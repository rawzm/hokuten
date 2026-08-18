/**
 * Tests for the website→CRM intake (P10 / F28).
 *
 * Every expectation traces to docs/MONDAY-INTAKE-CONTRACT.md, which is the
 * binding document, or to docs/LAUNCH-IMPLEMENTATION.md §3.7 / §5.1. The suite
 * covers the deliberate tests from Deployment Settings v2 that can be proven
 * WITHOUT a live Monday token — validation, SMS-without-phone rejection, client
 * consent tampering, the bot field, the rate limiter, dedupe branch selection,
 * the dry-run default, and the shape of the mutation itself. The four that need
 * a real token and a real board (Monday success, Monday failure + email success,
 * total failure, alert delivery) are exercised here against an injected
 * `Fetcher`; contract §6's staged live test plan still has to run against the
 * real workspace before `INTAKE_DRY_RUN` is turned off.
 *
 * `lib/monday.ts` reads `process.env` at CALL time, never at module scope, which
 * is what lets these tests vary the configuration without re-importing.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AGENCY_RELATIONSHIP_NOTICE, SMS_CONSENT } from "@/content/compliance";
import {
  FixedWindowLimiter,
  LOG_SAFE_UPDATE_LABELS,
  MAX_PAYLOAD_BYTES,
  buildSubmission,
  buildUpdateBody,
  describeDedupe,
  isHoneypotTripped,
  isOriginAllowed,
  isReadOnlyDedupe,
  parseAllowedOrigins,
  propertiesMentioned,
  relationshipNotesLine,
  splitName,
  validateIntake,
  type IntakeFields,
} from "@/lib/intake";
import {
  COLUMN_MAP_KEYS,
  READ_ONLY_MATCH_REASON,
  buildColumnValues,
  buildCreateItemOperation,
  buildDedupeQuery,
  deliverIntake,
  isDryRun,
  isLogVerbose,
  loadMondayConfig,
  parseColumnMap,
  planOperations,
  redactEmail,
  redactOperation,
  redactPhone,
  redactText,
  redactUpdateBody,
  resetVerificationCache,
  resolveDedupe,
  verifyBoards,
  writeToMonday,
  type Fetcher,
  type MondayConfig,
} from "@/lib/monday";

/* -------------------------------------------------------------------------- */
/*  Fixtures                                                                   */
/* -------------------------------------------------------------------------- */

const DOMAIN = "thehokutengroup.com";

const COLUMN_MAP = {
  name_first: "text_first",
  name_last: "text_last",
  email: "email_col",
  phone: "phone_col",
  company: "text_company",
  type: { id: "status_type", lead_label: "Lead" },
  properties_mentioned: "text_props",
  relationship_notes: "long_notes",
};

const CONFIG: MondayConfig = {
  token: "TEST-TOKEN-NEVER-REAL",
  apiVersion: "2024-10",
  workspaceId: "1111",
  contactsBoardId: "2222",
  unverifiedBoardId: "3333",
  intakeGroupId: "new_unverified",
  buyerLeadsBoardId: null,
  columns: COLUMN_MAP,
  itemNamePrefix: "",
};

function wire(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: "Aiko Tanaka",
    hotel_name: "Grand Sierra Inn",
    city: "Reno",
    state: "Nevada",
    state_code: "NV",
    phone: "+16507206995",
    email: "Aiko@Example.COM",
    sms_consent: false,
    company: "Sierra Lodging LLC",
    keys: "120",
    brand: "Independent",
    timeline: "6-12 months",
    comments: "T-12 available on request.",
    page: "/#bov",
    referrer: "https://www.google.com/",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "hotel-bov",
    ...overrides,
  };
}

function fields(overrides: Record<string, unknown> = {}): IntakeFields {
  const parsed = validateIntake(wire(overrides));
  if (!parsed.ok) throw new Error(`fixture failed validation: ${JSON.stringify(parsed.errors)}`);
  return parsed.value;
}

const SUBMISSION = () =>
  buildSubmission(fields(), {
    submissionId: "sub-test-1",
    receivedAt: new Date("2026-08-17T18:30:00.000Z"),
    userAgent: "vitest",
  });

/** A fetcher that answers per-operation and records every call it received. */
function fakeFetcher(handler: (url: string, body: Record<string, unknown>) => unknown) {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  const fetcher: Fetcher = async (url, init) => {
    const body = JSON.parse(String(init.body ?? "{}")) as Record<string, unknown>;
    calls.push({ url, body });
    return new Response(JSON.stringify(handler(url, body)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  return { fetcher, calls };
}

/* -------------------------------------------------------------------------- */
/*  Env isolation                                                              */
/* -------------------------------------------------------------------------- */

const MANAGED_ENV = [
  "INTAKE_DRY_RUN",
  "INTAKE_LOG_VERBOSE",
  "MONDAY_API_TOKEN",
  "MONDAY_API_VERSION",
  "MONDAY_WORKSPACE_ID",
  "MONDAY_CONTACTS_BOARD_ID",
  "MONDAY_UNVERIFIED_BOARD_ID",
  "MONDAY_INTAKE_GROUP_ID",
  "MONDAY_BUYER_LEADS_BOARD_ID",
  "MONDAY_COLUMN_MAP_JSON",
  "FALLBACK_EMAIL_WEBHOOK_URL",
  "INTAKE_ALERT_WEBHOOK_URL",
  "INTAKE_ITEM_NAME_PREFIX",
  "ALLOWED_ORIGINS",
] as const;

let saved: Record<string, string | undefined> = {};

/**
 * Every line the module under test wrote to the console during a test. Output is
 * still suppressed; it is now also KEPT, because "no submission value reaches a
 * log line" is a property that can only be proven by reading the lines back.
 */
let logLines: string[] = [];

const logText = () => logLines.join("\n");

beforeEach(() => {
  saved = Object.fromEntries(MANAGED_ENV.map((key) => [key, process.env[key]]));
  for (const key of MANAGED_ENV) delete process.env[key];
  resetVerificationCache();
  logLines = [];
  const capture = (...args: unknown[]) => {
    logLines.push(args.map((entry) => String(entry)).join(" "));
  };
  vi.spyOn(console, "info").mockImplementation(capture);
  vi.spyOn(console, "warn").mockImplementation(capture);
  vi.spyOn(console, "error").mockImplementation(capture);
});

afterEach(() => {
  for (const key of MANAGED_ENV) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.restoreAllMocks();
});

function configureMonday(overrides: Record<string, string> = {}): void {
  process.env.MONDAY_API_TOKEN = "TEST-TOKEN-NEVER-REAL";
  process.env.MONDAY_WORKSPACE_ID = "1111";
  process.env.MONDAY_CONTACTS_BOARD_ID = "2222";
  process.env.MONDAY_UNVERIFIED_BOARD_ID = "3333";
  process.env.MONDAY_INTAKE_GROUP_ID = "new_unverified";
  process.env.MONDAY_COLUMN_MAP_JSON = JSON.stringify(COLUMN_MAP);
  Object.assign(process.env, overrides);
}

/* -------------------------------------------------------------------------- */
/*  1 — Validation (V2 deliberate test 1)                                      */
/* -------------------------------------------------------------------------- */

describe("validateIntake", () => {
  it("accepts a complete submission and normalises what it keeps", () => {
    const result = validateIntake(wire());
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.email).toBe("aiko@example.com"); // lower-cased, the dedupe key
    expect(result.value.stateCode).toBe("NV");
    expect(result.value.keys).toBe(120);
    expect(result.value.context.utm.campaign).toBe("hotel-bov");
    expect(result.value.context.page).toBe("/#bov");
  });

  it("reports every missing required field in one pass", () => {
    const result = validateIntake({ name: "", hotel_name: "", city: "", state: "", email: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["city", "email", "hotel_name", "name"]);
  });

  it("rejects a malformed email and a non-integer key count", () => {
    const bad = validateIntake(wire({ email: "aiko@example", keys: "one twenty" }));
    expect(bad.ok).toBe(false);
    if (bad.ok) return;
    expect(bad.errors.email).toBeDefined();
    expect(bad.errors.keys).toBeDefined();
  });

  it("rejects a non-object body rather than throwing", () => {
    expect(validateIntake("not json").ok).toBe(false);
    expect(validateIntake(null).ok).toBe(false);
    expect(validateIntake([1, 2, 3]).ok).toBe(false);
  });

  it("truncates oversized context instead of failing the lead", () => {
    const result = validateIntake(wire({ referrer: "https://x.test/".padEnd(9000, "a") }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.context.referrer.length).toBeLessThanOrEqual(512);
  });

  it("caps oversized comments as a validation error", () => {
    const result = validateIntake(wire({ comments: "x".repeat(5000) }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.comments).toBeDefined();
  });
});

/* -------------------------------------------------------------------------- */
/*  2 — SMS-without-phone rejection (contract §6, V2 test 2)                   */
/* -------------------------------------------------------------------------- */

describe("SMS consent requires a phone number", () => {
  it("rejects a ticked consent box with no phone", () => {
    const result = validateIntake(wire({ sms_consent: true, phone: "" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.phone).toMatch(/mobile number is required/i);
  });

  it("accepts a ticked consent box with a phone", () => {
    expect(validateIntake(wire({ sms_consent: true })).ok).toBe(true);
  });

  it("still accepts a blank phone when consent is NOT ticked — the box is optional", () => {
    const result = validateIntake(wire({ sms_consent: false, phone: "" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.phone).toBe("");
  });

  it("treats a missing sms_consent key as unchecked (compliance default)", () => {
    const raw = wire();
    delete raw.sms_consent;
    const result = validateIntake(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.smsConsent).toBe(false);
    expect(SMS_CONSENT.behaviour.checkedByDefault).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*  3 — Client consent-field tampering is ignored (contract §6, V2 test 3)     */
/* -------------------------------------------------------------------------- */

describe("consent is server-recorded, never caller-supplied", () => {
  it("discards a forged disclosure, timestamp, submission_type and source", () => {
    const parsed = validateIntake(
      wire({
        sms_consent: true,
        sms_consent_text: "FORGED CONSENT TEXT",
        consent_timestamp: "1999-01-01T00:00:00.000Z",
        submission_type: "Deal — already engaged",
        source: "Trusted partner",
      }),
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    /* Nothing forged survives narrowing. */
    expect(JSON.stringify(parsed.value)).not.toContain("FORGED");
    expect(JSON.stringify(parsed.value)).not.toContain("1999");

    const submission = buildSubmission(parsed.value, { receivedAt: new Date("2026-08-17T18:30:00Z") });

    expect(submission.submissionType).toBe("BOV request"); // server-fixed
    expect(submission.source).toBe("Website"); // server-fixed
    expect(submission.consent.disclosure).toBe(SMS_CONSENT.label); // verbatim from compliance.ts
    expect(submission.consent.checkboxValue).toBe(SMS_CONSENT.checkboxValue);
    expect(submission.consent.auditTrailText).toBe(SMS_CONSENT.consentText);
    expect(submission.consent.recordedAt).not.toContain("1999");
    expect(submission.consent.agencyNotice).toBe(AGENCY_RELATIONSHIP_NOTICE);
  });

  it("writes no consent evidence at all when the box was not ticked", () => {
    const submission = buildSubmission(fields({ sms_consent: false }));
    expect(submission.consent.smsConsent).toBe(false);
    expect(submission.consent.recordedAt).toBeNull();
    expect(submission.consent.checkboxValue).toBeNull();
    expect(submission.consent.auditTrailText).toBeNull();
    /* The disclosure is still recorded: "shown and declined" is part of the trail. */
    expect(submission.consent.disclosure).toBe(SMS_CONSENT.label);
  });
});

/* -------------------------------------------------------------------------- */
/*  4 — Honeypot (contract §8, V2 test 4)                                      */
/* -------------------------------------------------------------------------- */

describe("honeypot", () => {
  it("detects a filled botcheck field in every encoding a bot might use", () => {
    expect(isHoneypotTripped({ botcheck: true })).toBe(true);
    expect(isHoneypotTripped({ botcheck: "on" })).toBe(true);
    expect(isHoneypotTripped({ botcheck: "anything" })).toBe(true);
    expect(isHoneypotTripped({ botcheck: 1 })).toBe(true);
  });

  it("does not fire for an honest submission", () => {
    expect(isHoneypotTripped(wire())).toBe(false);
    expect(isHoneypotTripped({ botcheck: false })).toBe(false);
    expect(isHoneypotTripped({ botcheck: "" })).toBe(false);
    expect(isHoneypotTripped({})).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*  5 — Rate limit + origin + payload cap (contract §8, V2 test 5)             */
/* -------------------------------------------------------------------------- */

describe("perimeter", () => {
  it("allows the budget then refuses, per key, inside the window", () => {
    const limiter = new FixedWindowLimiter(3, 1000);
    const now = 1_000_000;
    expect(limiter.take("a", now)).toBe(true);
    expect(limiter.take("a", now)).toBe(true);
    expect(limiter.take("a", now)).toBe(true);
    expect(limiter.take("a", now)).toBe(false);
    expect(limiter.take("b", now)).toBe(true); // a different caller is unaffected
    expect(limiter.take("a", now + 1001)).toBe(true); // window rolled
  });

  it("enforces the ALLOWED_ORIGINS list when one is configured", () => {
    const list = parseAllowedOrigins(
      "https://thehokutengroup.com, https://www.thehokutengroup.com/",
    );
    expect(isOriginAllowed("https://thehokutengroup.com", list, "thehokutengroup.com")).toBe(true);
    expect(isOriginAllowed("https://www.thehokutengroup.com", list, "x")).toBe(true);
    expect(isOriginAllowed("https://evil.test", list, "thehokutengroup.com")).toBe(false);
    expect(isOriginAllowed(null, list, "thehokutengroup.com")).toBe(false);
  });

  it("falls back to strict same-origin — never 'any' — when the list is empty", () => {
    expect(isOriginAllowed("http://localhost:3000", [], "localhost:3000")).toBe(true);
    expect(isOriginAllowed("https://evil.test", [], "localhost:3000")).toBe(false);
    expect(isOriginAllowed(null, [], "localhost:3000")).toBe(false);
  });

  it("caps the payload well under any honest submission", () => {
    const honest = JSON.stringify(wire({ comments: "x".repeat(2000) }));
    expect(new TextEncoder().encode(honest).length).toBeLessThan(MAX_PAYLOAD_BYTES);
  });
});

/* -------------------------------------------------------------------------- */
/*  6 — Column map + mutation shape (contract §2, §4)                          */
/* -------------------------------------------------------------------------- */

describe("column map", () => {
  it("refuses a key that is not one of the eight mappable columns", () => {
    const result = parseColumnMap(JSON.stringify({ ...COLUMN_MAP, cadence: "cadence_col" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toMatch(/unmappable key\(s\): cadence/);
  });

  it("refuses a map with no email column — email is the dedupe key", () => {
    const { email: _email, ...withoutEmail } = COLUMN_MAP;
    const result = parseColumnMap(JSON.stringify(withoutEmail));
    expect(result.ok).toBe(false);
  });

  it("refuses a type entry without the exact existing label text", () => {
    const result = parseColumnMap(
      JSON.stringify({ ...COLUMN_MAP, type: { id: "status_type", lead_label: "" } }),
    );
    expect(result.ok).toBe(false);
  });

  it("never lists a column the contract forbids the website from writing", () => {
    /* Contract §4 last row: People, Relationship Category, Cadence, Role/Tag,
       Last Contacted, LinkedIn, Secondary Email/Phone, Primary Contact and
       Historical Notes are NEVER written by the website. */
    for (const forbidden of [
      "people",
      "cadence",
      "relationship_category",
      "role_tag",
      "last_contacted",
      "linkedin",
      "primary_contact",
      "historical_notes",
    ]) {
      expect(COLUMN_MAP_KEYS as readonly string[]).not.toContain(forbidden);
    }
  });
});

describe("create mutation shape", () => {
  it("writes ONLY column ids present in the map", () => {
    const values = buildColumnValues(SUBMISSION(), CONFIG, DOMAIN);
    const mapped = new Set([
      COLUMN_MAP.name_first,
      COLUMN_MAP.name_last,
      COLUMN_MAP.email,
      COLUMN_MAP.phone,
      COLUMN_MAP.company,
      COLUMN_MAP.type.id,
      COLUMN_MAP.properties_mentioned,
      COLUMN_MAP.relationship_notes,
    ]);
    for (const key of Object.keys(values)) expect(mapped.has(key)).toBe(true);
  });

  it("omits a column the map does not mention, and carries the field in the notes instead", () => {
    const narrow: MondayConfig = {
      ...CONFIG,
      columns: { email: COLUMN_MAP.email, relationship_notes: COLUMN_MAP.relationship_notes },
    };
    const submission = SUBMISSION();
    const values = buildColumnValues(submission, narrow, DOMAIN);

    expect(Object.keys(values).sort()).toEqual(
      [COLUMN_MAP.email, COLUMN_MAP.relationship_notes].sort(),
    );
    expect(values[COLUMN_MAP.properties_mentioned]).toBeUndefined();
    expect(values[COLUMN_MAP.type.id]).toBeUndefined();

    const notes = (values[COLUMN_MAP.relationship_notes] as { text: string }).text;
    expect(notes).toContain("keys 120");
    expect(notes).toContain("brand Independent");
  });

  it("carries create_labels_if_missing: false and never true", () => {
    const operation = buildCreateItemOperation(SUBMISSION(), CONFIG, DOMAIN);
    expect(operation.query).toContain("create_labels_if_missing: false");
    expect(operation.query).not.toContain("create_labels_if_missing: true");
    expect(JSON.stringify(operation.variables)).not.toContain("create_labels_if_missing");
  });

  it("targets the Unverified Leads board and the New / Unverified group — never Contacts", () => {
    const operation = buildCreateItemOperation(SUBMISSION(), CONFIG, DOMAIN);
    expect(operation.variables.boardId).toBe(CONFIG.unverifiedBoardId);
    expect(operation.variables.groupId).toBe(CONFIG.intakeGroupId);
    expect(operation.variables.boardId).not.toBe(CONFIG.contactsBoardId);
  });

  it("applies the test-item name prefix when one is configured (contract §6)", () => {
    const operation = buildCreateItemOperation(
      SUBMISSION(),
      { ...CONFIG, itemNamePrefix: "WEBSITE TEST — delete me" },
      DOMAIN,
    );
    expect(operation.variables.itemName).toBe("WEBSITE TEST — delete me Aiko Tanaka");
  });
});

describe("CRM renderings", () => {
  it("splits a name on the LAST space and leaves a single token alone", () => {
    expect(splitName("Aiko Tanaka")).toEqual({ first: "Aiko", last: "Tanaka" });
    expect(splitName("Mohamed Razim Meeran")).toEqual({ first: "Mohamed Razim", last: "Meeran" });
    expect(splitName("Cher")).toEqual({ first: "Cher", last: "" });
  });

  it("renders Properties Mentioned as '<hotel> — <City>, <ST>'", () => {
    expect(propertiesMentioned(SUBMISSION())).toBe("Grand Sierra Inn — Reno, NV");
  });

  it("renders the Relationship Notes line in the guide's own format", () => {
    const line = relationshipNotesLine(SUBMISSION(), DOMAIN);
    expect(line).toMatch(/^\d{8} WEB: BOV request via thehokutengroup\.com — Grand Sierra Inn, Reno, NV;/);
    expect(line).toContain("keys 120");
    expect(line).toContain("SMS consent no");
  });

  it("drops empty segments rather than writing 'keys ;'", () => {
    const sparse = buildSubmission(fields({ keys: "", brand: "", timeline: "", comments: "" }));
    const line = relationshipNotesLine(sparse, DOMAIN);
    expect(line).not.toContain("keys ");
    expect(line).not.toContain("; ;");
    expect(line).toContain("SMS consent no");
  });

  it("puts every unmapped field in the Update, including UTM and both timestamps", () => {
    const body = buildUpdateBody({ submission: SUBMISSION(), domain: DOMAIN, dedupe: { kind: "new" } });
    expect(body).toContain("utm_campaign: hotel-bov");
    expect(body).toContain("Received (UTC): 2026-08-17T18:30:00.000Z");
    expect(body).toContain("Received (Pacific):");
    expect(body).toContain("Submission id: sub-test-1");
    expect(body).toContain(`Disclosure shown: "${SMS_CONSENT.label}"`);
    expect(body).toContain(AGENCY_RELATIONSHIP_NOTICE);
  });
});

/* -------------------------------------------------------------------------- */
/*  7 — Configuration refusal (contract §8)                                    */
/* -------------------------------------------------------------------------- */

describe("configuration safety rails", () => {
  it("refuses when the write board equals the Contacts board", () => {
    configureMonday({ MONDAY_UNVERIFIED_BOARD_ID: "2222" });
    const result = loadMondayConfig();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toMatch(/never creates items in Contacts/);
  });

  it("refuses a non-numeric board id", () => {
    configureMonday({ MONDAY_UNVERIFIED_BOARD_ID: "Unverified Leads" });
    expect(loadMondayConfig().ok).toBe(false);
  });

  it("refuses when the token is unset", () => {
    configureMonday();
    delete process.env.MONDAY_API_TOKEN;
    const result = loadMondayConfig();
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toContain("MONDAY_API_TOKEN");
  });

  it("refuses a board that reports a different workspace", () => {
    const result = verifyBoards(CONFIG, [
      { id: "3333", name: "Unverified Leads", workspace_id: "9999", groups: [], columns: [] },
      { id: "2222", name: "Contacts", workspace_id: "1111", groups: [], columns: [] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toMatch(/workspace 9999/);
  });

  it("refuses a mapped column whose real type is not what the map claims", () => {
    const columns = [
      { id: "text_first", title: "First Name", type: "text" },
      { id: "text_last", title: "Last Name", type: "text" },
      { id: "email_col", title: "Email", type: "text" }, // wrong: should be `email`
      { id: "phone_col", title: "Phone", type: "phone" },
      { id: "text_company", title: "Company / Title", type: "text" },
      { id: "status_type", title: "Type", type: "status" },
      { id: "text_props", title: "Properties Mentioned", type: "text" },
      { id: "long_notes", title: "Relationship Notes", type: "long_text" },
    ];
    const result = verifyBoards(CONFIG, [
      {
        id: "3333",
        name: "Unverified Leads",
        workspace_id: "1111",
        groups: [{ id: "new_unverified", title: "New / Unverified" }],
        columns,
      },
      { id: "2222", name: "Contacts", workspace_id: "1111", groups: [], columns: [] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toMatch(/expected one of email/);
  });

  it("refuses a group id that is not on the write board", () => {
    const result = verifyBoards(CONFIG, [
      {
        id: "3333",
        name: "Unverified Leads",
        workspace_id: "1111",
        groups: [{ id: "topics", title: "Group Title" }],
        columns: [],
      },
      { id: "2222", name: "Contacts", workspace_id: "1111", groups: [], columns: [] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toMatch(/group new_unverified is not on board 3333/);
  });
});

/* -------------------------------------------------------------------------- */
/*  8 — Dedupe branch selection (contract §3, plus V2's dedupe tests)          */
/* -------------------------------------------------------------------------- */

/** Reply to a dedupe query with a hit only for `hitBoardId`. */
function dedupeFetcher(hitBoardId: string | null) {
  return fakeFetcher((_url, body) => {
    const variables = (body.variables ?? {}) as { boardId?: string };
    const hit = hitBoardId !== null && variables.boardId === hitBoardId;
    return {
      data: {
        items_page_by_column_values: {
          items: hit ? [{ id: "item-9", name: "Aiko Tanaka" }] : [],
        },
      },
    };
  });
}

describe("dedupe branch selection", () => {
  it("searches Contacts FIRST and stops there on a hit", async () => {
    const { fetcher, calls } = dedupeFetcher(CONFIG.contactsBoardId);
    const result = await resolveDedupe(SUBMISSION(), CONFIG, fetcher);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toEqual({ kind: "contacts", itemId: "item-9", itemName: "Aiko Tanaka" });
    /* One query only — the Unverified board is never even searched. */
    expect(calls).toHaveLength(1);
    expect((calls[0]!.body.variables as { boardId: string }).boardId).toBe(CONFIG.contactsBoardId);
  });

  it("falls through to Unverified Leads when Contacts has no match", async () => {
    const { fetcher, calls } = dedupeFetcher(CONFIG.unverifiedBoardId);
    const result = await resolveDedupe(SUBMISSION(), CONFIG, fetcher);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.kind).toBe("unverified");
    expect(calls).toHaveLength(2);
  });

  it("reports `new` when no board has the email", async () => {
    const { fetcher } = dedupeFetcher(null);
    const result = await resolveDedupe(SUBMISSION(), CONFIG, fetcher);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.kind).toBe("new");
  });

  it("searches Buyer Leads too, but only when that board id is configured", async () => {
    const withBuyers = { ...CONFIG, buyerLeadsBoardId: "4444" };
    const { fetcher, calls } = dedupeFetcher("4444");
    const result = await resolveDedupe(SUBMISSION(), withBuyers, fetcher);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.kind).toBe("buyer-leads");
    expect(calls).toHaveLength(3);
  });

  it("plans an Update and NOTHING else for an existing record", () => {
    const operations = planOperations(SUBMISSION(), CONFIG, DOMAIN, {
      kind: "contacts",
      itemId: "item-9",
      itemName: "Aiko Tanaka",
    });
    expect(operations).toHaveLength(1);
    expect(operations[0]!.name).toBe("create_update");
    expect(operations.some((operation) => operation.query.includes("create_item"))).toBe(false);
    expect(operations.some((operation) => operation.query.includes("change_column_value"))).toBe(false);
  });

  it("never issues a create_item when the email is already in Contacts", async () => {
    const { fetcher, calls } = fakeFetcher((_url, body) => {
      const query = String(body.query ?? "");
      if (query.includes("items_page_by_column_values")) {
        const variables = (body.variables ?? {}) as { boardId?: string };
        return {
          data: {
            items_page_by_column_values: {
              items:
                variables.boardId === CONFIG.contactsBoardId
                  ? [{ id: "item-9", name: "Aiko Tanaka" }]
                  : [],
            },
          },
        };
      }
      return { data: { create_update: { id: "update-1" } } };
    });

    const outcome = await writeToMonday(SUBMISSION(), CONFIG, DOMAIN, fetcher);

    expect(outcome.ok).toBe(true);
    expect(outcome.itemId).toBeNull();
    expect(outcome.updateId).toBe("update-1");
    expect(outcome.dedupe?.kind).toBe("contacts");
    for (const call of calls) {
      expect(String(call.body.query)).not.toContain("create_item");
    }
  });

  it("creates in Unverified Leads and comments on it when the email is new", async () => {
    const { fetcher, calls } = fakeFetcher((_url, body) => {
      const query = String(body.query ?? "");
      if (query.includes("items_page_by_column_values")) {
        return { data: { items_page_by_column_values: { items: [] } } };
      }
      if (query.includes("create_item")) {
        return { data: { create_item: { id: "item-new", name: "Aiko Tanaka" } } };
      }
      return { data: { create_update: { id: "update-new" } } };
    });

    const outcome = await writeToMonday(SUBMISSION(), CONFIG, DOMAIN, fetcher);

    expect(outcome.ok).toBe(true);
    expect(outcome.itemId).toBe("item-new");
    expect(outcome.updateId).toBe("update-new");

    const create = calls.find((call) => String(call.body.query).includes("create_item"));
    expect(create).toBeDefined();
    expect((create!.body.variables as { boardId: string }).boardId).toBe(CONFIG.unverifiedBoardId);
  });
});

/* -------------------------------------------------------------------------- */
/*  9 — INTAKE_DRY_RUN defaults ON, and writes nothing (contract §9)           */
/* -------------------------------------------------------------------------- */

describe("dry run", () => {
  it("is ON when INTAKE_DRY_RUN is unset — the shipping default", () => {
    expect(process.env.INTAKE_DRY_RUN).toBeUndefined();
    expect(isDryRun()).toBe(true);
  });

  it("stays ON for any value that is not an explicit off", () => {
    for (const value of ["1", "true", "on", "yes", "maybe", " "]) {
      process.env.INTAKE_DRY_RUN = value;
      expect(isDryRun()).toBe(true);
    }
  });

  it("turns OFF only for an explicit off", () => {
    for (const value of ["0", "false", "off", "no", "FALSE"]) {
      process.env.INTAKE_DRY_RUN = value;
      expect(isDryRun()).toBe(false);
    }
  });

  it("makes ZERO network calls when no webhook is configured", async () => {
    configureMonday(); // fully configured Monday — and still nothing is sent
    const { fetcher, calls } = fakeFetcher(() => ({ data: {} }));

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    expect(calls).toHaveLength(0);
    expect(report.mode).toBe("dry-run");
    expect(report.monday.attempted).toBe(false);
    /* Nothing confirmed receipt, so the visitor is NOT told it was sent. */
    expect(report.ok).toBe(false);
    expect(report.reference).toBeNull();
  });

  it("builds the exact mutation it would have sent, without sending it", async () => {
    configureMonday();
    const { fetcher, calls } = fakeFetcher(() => ({ data: {} }));

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    expect(calls).toHaveLength(0);
    const create = report.monday.operations.find((operation) => operation.name === "create_item");
    expect(create).toBeDefined();
    expect(create!.query).toContain("create_labels_if_missing: false");
    expect((create!.variables as { boardId: string }).boardId).toBe("3333");
  });

  it("sends the fallback email and nothing else, and never touches api.monday.com", async () => {
    configureMonday({ FALLBACK_EMAIL_WEBHOOK_URL: "https://hooks.test/email" });
    const { fetcher, calls } = fakeFetcher(() => ({ ok: true }));

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("https://hooks.test/email");
    expect(calls.some((call) => call.url.includes("api.monday.com"))).toBe(false);
    expect(report.ok).toBe(true);
    expect(report.reference).toBe("sub-test-1");
  });

  it("never puts the API token in an operation it logs", async () => {
    configureMonday();
    const { fetcher } = fakeFetcher(() => ({ data: {} }));
    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);
    expect(JSON.stringify(report.monday.operations)).not.toContain("TEST-TOKEN-NEVER-REAL");
  });
});

/* -------------------------------------------------------------------------- */
/*  10 — Delivery semantics (contract §7, V2 tests 6–9)                        */
/* -------------------------------------------------------------------------- */

describe("delivery semantics", () => {
  const boardsReply = {
    data: {
      boards: [
        {
          id: "3333",
          name: "Unverified Leads",
          workspace_id: "1111",
          groups: [{ id: "new_unverified", title: "New / Unverified" }],
          columns: [
            { id: "text_first", title: "First Name", type: "text" },
            { id: "text_last", title: "Last Name", type: "text" },
            { id: "email_col", title: "Email", type: "email" },
            { id: "phone_col", title: "Phone", type: "phone" },
            { id: "text_company", title: "Company / Title", type: "text" },
            { id: "status_type", title: "Type", type: "status" },
            { id: "text_props", title: "Properties Mentioned", type: "text" },
            { id: "long_notes", title: "Relationship Notes", type: "long_text" },
          ],
        },
        {
          id: "2222",
          name: "Contacts",
          workspace_id: "1111",
          groups: [],
          /* Contacts is a structural clone of Unverified Leads (contract §2), so
             the dedupe columns carry the same ids. `verifyBoards` now REFUSES
             when they do not — a missing email column on Contacts means the
             dedupe search silently misses and a verified contact gets a second,
             unverified record. */
          columns: [
            { id: "email_col", title: "Email", type: "email" },
            { id: "phone_col", title: "Phone", type: "phone" },
          ],
        },
      ],
    },
  };

  function liveFetcher(options: { mondayWrites: boolean; emailOk: boolean }) {
    return fakeFetcher((url, body) => {
      if (url.includes("api.monday.com")) {
        const query = String(body.query ?? "");
        if (query.includes("IntakeVerifyBoards")) return boardsReply;
        if (query.includes("items_page_by_column_values")) {
          return { data: { items_page_by_column_values: { items: [] } } };
        }
        if (!options.mondayWrites) return { errors: [{ message: "simulated Monday outage" }] };
        if (query.includes("create_item")) {
          return { data: { create_item: { id: "item-live", name: "Aiko Tanaka" } } };
        }
        return { data: { create_update: { id: "update-live" } } };
      }
      if (url.includes("/email")) return options.emailOk ? { ok: true } : { error: "nope" };
      return { ok: true };
    });
  }

  it("Monday success → success, no fallback email, one same-day alert", async () => {
    configureMonday({
      INTAKE_DRY_RUN: "0",
      FALLBACK_EMAIL_WEBHOOK_URL: "https://hooks.test/email",
      INTAKE_ALERT_WEBHOOK_URL: "https://hooks.test/alert",
    });
    const { fetcher, calls } = liveFetcher({ mondayWrites: true, emailOk: true });

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    expect(report.ok).toBe(true);
    expect(report.monday.ok).toBe(true);
    expect(report.email.attempted).toBe(false);
    expect(calls.some((call) => call.url === "https://hooks.test/alert")).toBe(true);
    expect(calls.some((call) => call.url === "https://hooks.test/email")).toBe(false);
  });

  it("Monday failure + email success → success for the visitor, alert for the team", async () => {
    configureMonday({
      INTAKE_DRY_RUN: "0",
      FALLBACK_EMAIL_WEBHOOK_URL: "https://hooks.test/email",
      INTAKE_ALERT_WEBHOOK_URL: "https://hooks.test/alert",
    });
    const { fetcher, calls } = liveFetcher({ mondayWrites: false, emailOk: true });

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    expect(report.monday.ok).toBe(false);
    expect(report.email.ok).toBe(true);
    expect(report.ok).toBe(true);
    expect(calls.some((call) => call.url === "https://hooks.test/alert")).toBe(true);
  });

  it("total failure → failure for the visitor and an alert", async () => {
    configureMonday({
      INTAKE_DRY_RUN: "0",
      FALLBACK_EMAIL_WEBHOOK_URL: "https://hooks.test/email",
      INTAKE_ALERT_WEBHOOK_URL: "https://hooks.test/alert",
    });
    const { fetcher, calls } = fakeFetcher((url, body) => {
      if (url.includes("api.monday.com")) {
        if (String(body.query ?? "").includes("IntakeVerifyBoards")) return boardsReply;
        return { errors: [{ message: "simulated Monday outage" }] };
      }
      if (url.includes("/email")) throw new Error("email webhook unreachable");
      return { ok: true };
    });

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    expect(report.ok).toBe(false);
    expect(report.reference).toBeNull();
    expect(calls.some((call) => call.url === "https://hooks.test/alert")).toBe(true);
  });

  it("refuses the write — and never queries Monday — on an invalid configuration", async () => {
    process.env.INTAKE_DRY_RUN = "0";
    process.env.FALLBACK_EMAIL_WEBHOOK_URL = "https://hooks.test/email";
    // No Monday env at all.
    const { fetcher, calls } = fakeFetcher(() => ({ ok: true }));

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    expect(calls.every((call) => !call.url.includes("api.monday.com"))).toBe(true);
    expect(report.monday.reason).toMatch(/config refused/);
    /* The lead is still delivered by email, so the visitor is not punished for
       a configuration mistake. */
    expect(report.ok).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/*  11 — Buyer Leads is READ-ONLY (contract §1.3, §4)                          */
/* -------------------------------------------------------------------------- */

/**
 * The adversarial review of this route found the one place the contract was
 * being read too loosely: an email that matched a Buyer Leads record produced a
 * `create_update` on that record. An Update is a write — it appends to a curated
 * mass-campaign board and notifies its subscribers — and §4 gives the website no
 * such permission. These tests pin the corrected behaviour: a Buyer Leads hit
 * produces NO Monday call at all, the submission leaves by the fallback email,
 * and a human decides where it belongs.
 */
describe("Buyer Leads is read-only", () => {
  const BUYERS = "4444";
  const withBuyers: MondayConfig = { ...CONFIG, buyerLeadsBoardId: BUYERS };
  const buyerHit = { kind: "buyer-leads", itemId: "buyer-77", itemName: "Someone Else" } as const;

  const boardsReplyWithBuyers = {
    data: {
      boards: [
        {
          id: "3333",
          name: "Unverified Leads",
          workspace_id: "1111",
          groups: [{ id: "new_unverified", title: "New / Unverified" }],
          columns: [
            { id: "text_first", title: "First Name", type: "text" },
            { id: "text_last", title: "Last Name", type: "text" },
            { id: "email_col", title: "Email", type: "email" },
            { id: "phone_col", title: "Phone", type: "phone" },
            { id: "text_company", title: "Company / Title", type: "text" },
            { id: "status_type", title: "Type", type: "status" },
            { id: "text_props", title: "Properties Mentioned", type: "text" },
            { id: "long_notes", title: "Relationship Notes", type: "long_text" },
          ],
        },
        {
          id: "2222",
          name: "Contacts",
          workspace_id: "1111",
          groups: [],
          columns: [
            { id: "email_col", title: "Email", type: "email" },
            { id: "phone_col", title: "Phone", type: "phone" },
          ],
        },
        {
          id: BUYERS,
          name: "Buyer Leads",
          workspace_id: "1111",
          groups: [],
          /* Read for dedupe only — the email column still has to exist, because a
             silent dedupe miss is how a buyer acquires a second record. */
          columns: [{ id: "email_col", title: "Email", type: "email" }],
        },
      ],
    },
  };

  it("classifies a Buyer Leads match as a board the website must not write to", () => {
    expect(isReadOnlyDedupe(buyerHit)).toBe(true);
    expect(isReadOnlyDedupe({ kind: "new" })).toBe(false);
    expect(isReadOnlyDedupe({ kind: "contacts", itemId: "c-1", itemName: "x" })).toBe(false);
    expect(isReadOnlyDedupe({ kind: "unverified", itemId: "u-1", itemName: "x" })).toBe(false);
  });

  it("plans ZERO operations — not an item, not a column, not an Update", () => {
    expect(planOperations(SUBMISSION(), withBuyers, DOMAIN, buyerHit)).toEqual([]);
  });

  it("never builds an operation carrying the Buyer Leads board or item id, on any branch", () => {
    const branches = [
      { kind: "new" } as const,
      { kind: "contacts", itemId: "c-1", itemName: "In Contacts" } as const,
      { kind: "unverified", itemId: "u-1", itemName: "In Unverified" } as const,
      buyerHit,
    ];
    for (const dedupe of branches) {
      for (const operation of planOperations(SUBMISSION(), withBuyers, DOMAIN, dedupe)) {
        const variables = JSON.stringify(operation.variables);
        expect(variables).not.toContain(BUYERS);
        expect(variables).not.toContain(buyerHit.itemId);
      }
    }
  });

  it("sends dedupe QUERIES only, and no mutation of any kind", async () => {
    const { fetcher, calls } = fakeFetcher((_url, body) => {
      const variables = (body.variables ?? {}) as { boardId?: string };
      return {
        data: {
          items_page_by_column_values: {
            items: variables.boardId === BUYERS ? [{ id: "buyer-77", name: "Someone Else" }] : [],
          },
        },
      };
    });

    const outcome = await writeToMonday(SUBMISSION(), withBuyers, DOMAIN, fetcher);

    expect(outcome.dedupe?.kind).toBe("buyer-leads");
    expect(outcome.reason).toBe(READ_ONLY_MATCH_REASON);
    /* Not "ok", because nothing in Monday confirmed receipt — the email path has
       to. That is a refusal, not a failure, and the alert severity says so. */
    expect(outcome.ok).toBe(false);
    expect(outcome.itemId).toBeNull();
    expect(outcome.updateId).toBeNull();
    expect(outcome.operations).toEqual([]);

    expect(calls).toHaveLength(3);
    for (const call of calls) {
      expect(String(call.body.query)).toContain("query IntakeDedupe");
      expect(String(call.body.query)).not.toContain("mutation");
    }
  });

  it("delivers by fallback email and alerts a human, without mutating Monday", async () => {
    configureMonday({
      INTAKE_DRY_RUN: "0",
      MONDAY_BUYER_LEADS_BOARD_ID: BUYERS,
      FALLBACK_EMAIL_WEBHOOK_URL: "https://hooks.test/email",
      INTAKE_ALERT_WEBHOOK_URL: "https://hooks.test/alert",
    });

    const { fetcher, calls } = fakeFetcher((url, body) => {
      if (url.includes("api.monday.com")) {
        const query = String(body.query ?? "");
        if (query.includes("IntakeVerifyBoards")) return boardsReplyWithBuyers;
        const variables = (body.variables ?? {}) as { boardId?: string };
        return {
          data: {
            items_page_by_column_values: {
              items: variables.boardId === BUYERS ? [{ id: "buyer-77", name: "Someone Else" }] : [],
            },
          },
        };
      }
      return { ok: true };
    });

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    /* The visitor is told it was received — the email webhook confirmed. */
    expect(report.ok).toBe(true);
    expect(report.monday.ok).toBe(false);
    expect(report.monday.itemId).toBeNull();
    expect(report.monday.updateId).toBeNull();
    expect(report.monday.reason).toBe(READ_ONLY_MATCH_REASON);
    expect(report.email.ok).toBe(true);

    const mondayCalls = calls.filter((call) => call.url.includes("api.monday.com"));
    expect(mondayCalls.length).toBeGreaterThan(0);
    for (const call of mondayCalls) {
      expect(String(call.body.query)).not.toContain("mutation");
      expect(String(call.body.query)).not.toContain("create_item");
      expect(String(call.body.query)).not.toContain("create_update");
    }

    const alert = calls.find((call) => call.url === "https://hooks.test/alert");
    expect(alert).toBeDefined();
    expect(alert!.body.severity).toBe("buyer_leads_read_only");
    expect(String(alert!.body.summary)).toContain("READ-ONLY Buyer Leads");
    expect(String(alert!.body.summary)).toContain("A human decides");

    const email = calls.find((call) => call.url === "https://hooks.test/email");
    expect(email).toBeDefined();
    expect(String(email!.body.text)).toContain("NOTHING written to Monday");
  });

  it("records in the note itself that nothing was written", () => {
    expect(describeDedupe(buyerHit)).toContain("READ-ONLY board: nothing written to Monday");
    const body = buildUpdateBody({ submission: SUBMISSION(), domain: DOMAIN, dedupe: buyerHit });
    expect(body).toContain("(read-only board match; NOTHING written to Monday)");
    expect(body).not.toContain("Update posted");
  });
});

/* -------------------------------------------------------------------------- */
/*  12 — No submission value reaches a log line (dry-run PII)                  */
/* -------------------------------------------------------------------------- */

/**
 * Dry run is the shipping default, so its transcript is the log this site will
 * actually produce. It used to print the whole mutation payload — name, email,
 * phone, comments — into Vercel's runtime log, which is readable by everyone
 * with project access and retained on the platform's schedule. The SHAPE is what
 * the mode exists to show; the VALUES are not.
 */
describe("log redaction", () => {
  /** Every distinctive value in the fixture submission. */
  const FIXTURE_VALUES = [
    "Aiko",
    "Tanaka",
    "aiko@example.com",
    "Grand Sierra Inn",
    "Reno",
    "6507206995",
    "Sierra Lodging",
    "Independent",
    "6-12 months",
    "T-12 available on request",
    "hotel-bov",
    "www.google.com",
  ];

  it("prints no submission value in any log line, by default", async () => {
    configureMonday();
    const { fetcher } = fakeFetcher(() => ({ data: {} }));

    await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    const transcript = logText();
    expect(transcript.length).toBeGreaterThan(0);
    for (const value of FIXTURE_VALUES) expect(transcript).not.toContain(value);
    /* The two renderings of the room count, checked as their own strings so a
       digit landing inside a fingerprint cannot fake a pass. */
    expect(transcript).not.toContain("Keys: 120");
    expect(transcript).not.toContain("keys 120");
  });

  it("keeps the mutation shape fully readable — that is what dry run is for", async () => {
    configureMonday();
    const { fetcher } = fakeFetcher(() => ({ data: {} }));

    await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    const transcript = logText();
    expect(transcript).toContain("create_item");
    expect(transcript).toContain("create_labels_if_missing: false");
    expect(transcript).toContain("dedupe=new");
    expect(transcript).toContain("values=redacted");
    /* Board, group and every mapped column id survive: configuration, and
       exactly what a reviewer checks against Dino's column map. */
    expect(transcript).toContain(CONFIG.unverifiedBoardId);
    expect(transcript).toContain(CONFIG.intakeGroupId);
    for (const columnId of [
      COLUMN_MAP.name_first,
      COLUMN_MAP.name_last,
      COLUMN_MAP.email,
      COLUMN_MAP.phone,
      COLUMN_MAP.company,
      COLUMN_MAP.type.id,
      COLUMN_MAP.properties_mentioned,
      COLUMN_MAP.relationship_notes,
    ]) {
      expect(transcript).toContain(columnId);
    }
    /* Redacted, not removed — the operator can still see a field arrived. */
    expect(transcript).toContain("a***@example.com");
    expect(transcript).toContain("***6995");
    expect(transcript).toMatch(/\[redacted len=\d+ h=[0-9a-f]{8}\]/);
  });

  it("keeps every column id and the Type label, and redacts every value", () => {
    const operation = buildCreateItemOperation(SUBMISSION(), CONFIG, DOMAIN);
    const redacted = redactOperation(operation, CONFIG);

    expect(redacted.name).toBe(operation.name);
    expect(redacted.query).toBe(operation.query);
    expect(redacted.variables.boardId).toBe(CONFIG.unverifiedBoardId);
    expect(redacted.variables.groupId).toBe(CONFIG.intakeGroupId);

    const before = JSON.parse(String(operation.variables.columnValues)) as Record<string, unknown>;
    const after = JSON.parse(String(redacted.variables.columnValues)) as Record<string, unknown>;
    expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());

    /* The Type label has to match an existing board label EXACTLY or
       `create_labels_if_missing: false` rejects the write — it is config, and it
       stays legible. */
    expect(after[COLUMN_MAP.type.id]).toEqual({ label: "Lead" });
    expect(after[COLUMN_MAP.email]).toEqual({
      email: "a***@example.com",
      text: "a***@example.com",
    });
    expect(after[COLUMN_MAP.phone]).toEqual({ phone: "***6995", countryShortName: "US" });
    expect(String(after[COLUMN_MAP.name_first])).toMatch(/^\[redacted len=4 h=[0-9a-f]{8}\]$/);
    expect(String((after[COLUMN_MAP.relationship_notes] as { text: string }).text)).toMatch(
      /^\[redacted len=\d+ h=[0-9a-f]{8}\]$/,
    );
    expect(String(redacted.variables.itemName)).toMatch(/^\[redacted len=11 h=[0-9a-f]{8}\]$/);

    const json = JSON.stringify(redacted.variables);
    for (const value of FIXTURE_VALUES) expect(json).not.toContain(value);
  });

  it("keeps the operator's test-item prefix while redacting the person after it", () => {
    const prefix = "WEBSITE TEST — delete me";
    const operation = buildCreateItemOperation(SUBMISSION(), { ...CONFIG, itemNamePrefix: prefix }, DOMAIN);
    const redacted = redactOperation(operation, { ...CONFIG, itemNamePrefix: prefix });
    expect(String(redacted.variables.itemName)).toMatch(
      /^WEBSITE TEST — delete me \[redacted len=11 h=[0-9a-f]{8}\]$/,
    );
  });

  it("keeps every Update label and every server-minted value, redacting only what the visitor typed", () => {
    const body = buildUpdateBody({
      submission: SUBMISSION(),
      domain: DOMAIN,
      dedupe: { kind: "new" },
    });
    const redacted = redactUpdateBody(body);

    /* Same line count, same labels — the block is still readable as a block. */
    expect(redacted.split("\n")).toHaveLength(body.split("\n").length);
    for (const label of LOG_SAFE_UPDATE_LABELS) {
      const original = body.split("\n").find((entry) => entry.startsWith(`${label}: `));
      if (original) expect(redacted).toContain(original);
    }
    expect(redacted).toContain("Submission id: sub-test-1");
    expect(redacted).toContain(`Disclosure shown: "${SMS_CONSENT.label}"`);
    expect(redacted).toContain(AGENCY_RELATIONSHIP_NOTICE);

    expect(redacted).toContain("Email: a***@example.com");
    expect(redacted).toContain("Phone: ***6995");
    expect(redacted).toMatch(/^Name: \[redacted len=11 h=[0-9a-f]{8}\]$/m);
    expect(redacted).toMatch(/^Comments: \[redacted len=26 h=[0-9a-f]{8}\]$/m);
    /* Even the branch description is redacted: it quotes a matched record. */
    expect(redacted).toMatch(/^Dedupe: \[redacted len=\d+ h=[0-9a-f]{8}\]$/m);

    for (const value of FIXTURE_VALUES) expect(redacted).not.toContain(value);
  });

  it("hides the name of a matched CRM record — that is a third party's data", () => {
    const body = buildUpdateBody({
      submission: SUBMISSION(),
      domain: DOMAIN,
      dedupe: { kind: "contacts", itemId: "item-9", itemName: "Someone Else" },
    });
    expect(body).toContain("Someone Else");
    expect(redactUpdateBody(body)).not.toContain("Someone Else");
  });

  it("leaves a blank field blank rather than fingerprinting the em dash", () => {
    const sparse = buildSubmission(fields({ comments: "", brand: "", company: "" }), {
      submissionId: "sub-test-2",
      receivedAt: new Date("2026-08-17T18:30:00.000Z"),
    });
    const redacted = redactUpdateBody(
      buildUpdateBody({ submission: sparse, domain: DOMAIN, dedupe: { kind: "new" } }),
    );
    expect(redacted).toContain("Comments: —");
    expect(redacted).toContain("Brand: —");
  });

  it("never logs the dedupe key, but keeps the board and column it searched", () => {
    const operation = buildDedupeQuery(CONFIG.contactsBoardId, COLUMN_MAP.email, "aiko@example.com");
    const json = JSON.stringify(redactOperation(operation, CONFIG).variables);
    expect(json).not.toContain("aiko@example.com");
    expect(json).toContain(CONFIG.contactsBoardId);
    expect(json).toContain(COLUMN_MAP.email);
    expect(json).toContain("a***@example.com");
  });

  it("redacts an operation it has never been taught, rather than passing it through", () => {
    const redacted = redactOperation(
      {
        name: "some_future_mutation",
        query: "mutation Future { x }",
        variables: {
          note: "aiko@example.com",
          nested: { comment: "T-12 available on request.", count: 120 },
        },
      },
      CONFIG,
    );
    const json = JSON.stringify(redacted.variables);
    expect(json).not.toContain("aiko@example.com");
    expect(json).not.toContain("T-12");
    expect(json).toContain("[redacted number]");
    expect(redacted.query).toBe("mutation Future { x }");
  });

  it("redacts an email to its first character and its domain", () => {
    expect(redactEmail("aiko@example.com")).toBe("a***@example.com");
    expect(redactEmail("A@b.co")).toBe("A***@b.co");
    expect(redactEmail("")).toBe("");
    expect(redactEmail("not-an-address")).toMatch(/^\[redacted len=14 h=[0-9a-f]{8}\]$/);
  });

  it("redacts a phone to its last four digits", () => {
    expect(redactPhone("+16507206995")).toBe("***6995");
    expect(redactPhone("(650) 720-6995")).toBe("***6995");
    expect(redactPhone("")).toBe("");
  });

  it("redacts free text to a length and a stable fingerprint", () => {
    const once = redactText("T-12 available on request.");
    expect(once).toMatch(/^\[redacted len=26 h=[0-9a-f]{8}\]$/);
    expect(redactText("T-12 available on request.")).toBe(once);
    expect(redactText("T-12 available on request!")).not.toBe(once);
    expect(redactText("")).toBe("");
  });

  it("prints values verbatim ONLY when INTAKE_LOG_VERBOSE is explicitly on, and says so", async () => {
    configureMonday({ INTAKE_LOG_VERBOSE: "1" });
    expect(isLogVerbose()).toBe(true);
    const { fetcher } = fakeFetcher(() => ({ data: {} }));

    await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    const transcript = logText();
    expect(transcript).toContain("INTAKE_LOG_VERBOSE is ON");
    expect(transcript).toContain("values=VERBATIM");
    expect(transcript).toContain("aiko@example.com");
    expect(transcript).toContain("Aiko Tanaka");
  });

  it("stays OFF for anything that is not an explicit on", () => {
    for (const value of ["", "0", "false", "off", "no", "maybe", " ", "verbose"]) {
      process.env.INTAKE_LOG_VERBOSE = value;
      expect(isLogVerbose()).toBe(false);
    }
    delete process.env.INTAKE_LOG_VERBOSE;
    expect(isLogVerbose()).toBe(false);
  });

  it("leaves the returned plan unredacted — redaction is a LOG boundary, not a data one", async () => {
    configureMonday();
    const { fetcher } = fakeFetcher(() => ({ data: {} }));

    const report = await deliverIntake(SUBMISSION(), DOMAIN, fetcher);

    /* The plan is what would go on the wire and is held for exactly that reason;
       it is the LOG that must never carry it. */
    expect(JSON.stringify(report.monday.operations)).toContain("aiko@example.com");
    expect(logText()).not.toContain("aiko@example.com");
  });
});
