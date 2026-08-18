/**
 * lib/intake.ts — the website→CRM intake CONTRACT, in pure TypeScript.
 *
 * Governed by docs/MONDAY-INTAKE-CONTRACT.md (2026-08-17), which is binding and
 * overrides the deployment-settings summary wherever the two disagree. Plan:
 * docs/LAUNCH-IMPLEMENTATION.md §3.7, §5.1, portion P10 (F28).
 *
 * WHAT LIVES HERE AND WHY
 * -----------------------
 * Everything in this file is PURE: no `process.env`, no `fetch`, no secret, no
 * Monday vocabulary. That is deliberate — `components/forms/BovForm.tsx` (a
 * client component) and `app/api/contact-intake/route.ts` (server) both import
 * it, so it is compiled into the browser bundle. Anything that reads a token or
 * talks to Monday lives in `lib/monday.ts`, which is server-only and is never
 * imported from a client module.
 *
 * THE FIELD NAMES ARE A CONTRACT (carried over verbatim from the retired
 * Web3Forms path). `name`, `hotel_name`, `city`, `state`, `phone`, `email`,
 * `sms_consent` and `botcheck` are parsed by name downstream. Renaming one does
 * not error — the lead just arrives blank. `company`, `keys`, `brand`,
 * `timeline`, `comments`, `state_code`, `page`, `referrer` and the five `utm_*`
 * keys are ADDITIONS (contract §3, `V2` §2); nothing existing was renamed.
 *
 * WHAT THE CALLER IS NOT TRUSTED WITH (contract §6)
 * -------------------------------------------------
 * `submission_type`, `source`, `sms_consent_text`, `consent_timestamp` and any
 * server timestamp are IGNORED if present on the wire. `submission_type` is
 * fixed server-side to "BOV request"; the consent disclosure text and the
 * consent timestamp are minted here from `content/compliance.ts`, never echoed
 * back from the browser. A tampered payload cannot manufacture a consent record.
 *
 * VALIDATION SHAPE — a note on zod
 * -------------------------------
 * The plan calls for zod. `zod@4.4.3` is present in `site/pnpm-lock.yaml` only
 * as a TRANSITIVE dependency of `eslint-plugin-react-hooks`; it is NOT a direct
 * dependency of `site/package.json` and does not resolve from `site/lib`
 * (`require.resolve("zod")` → MODULE_NOT_FOUND, verified 2026-08-17). Adding it
 * mid-wave would mean a `pnpm install` while five other agents are running
 * `tsc` against the same `node_modules`, so the validator below is hand-rolled
 * with the same discipline instead: one declarative field table, unknown-in /
 * narrowed-out, every rule stated once. Swapping in zod later is mechanical —
 * replace `validateIntake` and keep `IntakeFields` as the inferred type.
 */

import {
  AGENCY_RELATIONSHIP_NOTICE,
  SMS_CONSENT,
  consentTimestamp,
} from "@/content/compliance";
import { CONTACT } from "@/content/site";

/* -------------------------------------------------------------------------- */
/*  Wire vocabulary                                                            */
/* -------------------------------------------------------------------------- */

/** The route. `HANDOFF-02` names this path for the edge rate-limit rule. */
export const INTAKE_ENDPOINT = "/api/contact-intake";

/**
 * Server-fixed. Never read from the request (contract §6, plan §5.1).
 * Any `submission_type` on the wire is discarded.
 */
export const SUBMISSION_TYPE = "BOV request" as const;

/** Server-fixed. `V2` §2 line 31. */
export const SUBMISSION_SOURCE = "Website" as const;

/**
 * Honeypot field name. `botcheck` is kept from the Web3Forms era on purpose:
 * the hidden input already ships with that name and bot toolkits fill it.
 */
export const HONEYPOT_FIELD = "botcheck";

/**
 * Payload ceiling (contract §8). 32 KiB is ~15× the largest honest submission
 * (a 2,000-character comment plus every other field at its cap) and small
 * enough that a body bomb is rejected before it is parsed.
 */
export const MAX_PAYLOAD_BYTES = 32 * 1024;

/** Per-field ceilings. Enforced on the server; mirrored as `maxLength` in the form. */
export const LIMITS = {
  name: 120,
  hotelName: 160,
  city: 80,
  state: 60,
  stateCode: 8,
  email: 254,
  phone: 32,
  company: 160,
  brand: 120,
  timeline: 120,
  comments: 2000,
  keysMax: 100_000,
  context: 512,
  utm: 200,
  userAgent: 300,
} as const;

/*
 * `AGENCY_RELATIONSHIP_NOTICE` used to be declared here. It MOVED to
 * `content/compliance.ts` §8 on 2026-08-17 — its proper home beside the other
 * disclosures — and is imported above. It is not re-exported from this module:
 * the form, the /privacy route and `recordConsent()` below all read the one
 * constant from the one file, so the string a visitor is shown and the string
 * written into the CRM Update can never drift apart.
 */

/* -------------------------------------------------------------------------- */
/*  E.164 envelope — a deliberate 3-line duplicate                             */
/* -------------------------------------------------------------------------- */

/**
 * `components/forms/PhoneField.tsx` owns the same two constants and the same
 * check, but that module carries a `"use client"` pragma and a React component;
 * importing it into a Route Handler would drag a client module onto the server.
 * The envelope is ITU-T E.164 and does not move, so it is restated rather than
 * shared. If the digit envelope ever changes, change both. The leading-"+"
 * requirement below is server-only and deliberate — see the function comment.
 */
export const E164_MIN_DIGITS = 7;
export const E164_MAX_DIGITS = 15;

export function isPlausibleE164(value: string): boolean {
  /* The server is stricter than the client by one character, on purpose: this
     value is written straight into Monday's Phone column, and contract §4 says
     that column holds E.164 — which is "+" then digits. `PhoneField.toE164`
     always emits the "+", so no real submission is affected; what this rejects
     is a hand-crafted POST putting a bare national number in the CRM. */
  if (!value.startsWith("+")) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= E164_MIN_DIGITS && digits.length <= E164_MAX_DIGITS;
}

/** index.html:2209 — the source's own regex, unchanged. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------------------------------------------------------- */
/*  Validated shape                                                            */
/* -------------------------------------------------------------------------- */

export type IntakeUtm = {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
};

/** Silently captured by the browser; advisory only, never a validation failure. */
export type IntakeContext = {
  /** Path + query of the page the form was submitted from. */
  page: string;
  referrer: string;
  utm: IntakeUtm;
};

/** Everything the caller is allowed to influence, after narrowing. */
export type IntakeFields = {
  name: string;
  hotelName: string;
  city: string;
  state: string;
  /** USPS code (`NV`) when the city picker supplied one, else `""`. */
  stateCode: string;
  /** E.164 (`+16507206995`) or `""`. */
  phone: string;
  email: string;
  smsConsent: boolean;
  company: string;
  keys: number | null;
  brand: string;
  timeline: string;
  comments: string;
  context: IntakeContext;
};

/**
 * The server's own consent record (contract §6).
 *
 * `disclosure` is what was on screen and is recorded either way — the fact that
 * a visitor was shown the disclosure and declined is itself part of the trail.
 * `checkboxValue`, `auditTrailText` and `recordedAt` exist only for "yes":
 * there is no consent to evidence when the box was never ticked.
 *
 * NOTE — this deliberately diverges from port rule R4 ("stamp
 * `consent_timestamp` on EVERY submit"), which described the Web3Forms inbox
 * path. Plan §3.7 and contract §6 supersede it for this route: the server
 * "creates the disclosure/timestamp only for 'yes'". R4 still governs the
 * `mailto:` fallback below, where the browser is the only recorder.
 */
export type ServerConsentRecord = {
  smsConsent: boolean;
  disclosure: string;
  checkboxValue: string | null;
  auditTrailText: string | null;
  /** ISO 8601 UTC, minted by the server. `null` when consent was not given. */
  recordedAt: string | null;
  agencyNotice: string;
};

/** The complete, server-authoritative submission. Nothing downstream re-derives. */
export type IntakeSubmission = IntakeFields & {
  submissionId: string;
  submissionType: typeof SUBMISSION_TYPE;
  source: typeof SUBMISSION_SOURCE;
  consent: ServerConsentRecord;
  /** ISO 8601 UTC. */
  receivedAtUtc: string;
  /** `YYYY-MM-DD HH:mm` in America/Los_Angeles — the team's own clock. */
  receivedAtPacific: string;
  /** Truncated. Never used for anything but the audit line. */
  userAgent: string;
};

/* -------------------------------------------------------------------------- */
/*  Validation                                                                 */
/* -------------------------------------------------------------------------- */

export type IntakeValidation =
  | { ok: true; value: IntakeFields }
  | { ok: false; errors: Record<string, string> };

/** Messages are visitor-facing and keyed by WIRE field name, so the form can paint them. */
export const INTAKE_ERRORS = {
  body: "The request body could not be read.",
  name: "Name is required.",
  hotel_name: "Hotel name is required.",
  city: "City and state are required.",
  email_required: "Email is required.",
  email_invalid: "Enter a valid email address.",
  phone_invalid: "Enter a valid phone number.",
  /** Contract §6 / plan §3.7 — the one rule that makes phone conditionally required. */
  phone_required_for_sms:
    "A mobile number is required when you agree to receive SMS messages.",
  keys_invalid: "Room count must be a whole number.",
  too_long: "This is longer than we can accept.",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Read a wire key as a trimmed string. Numbers are accepted (`keys` may arrive numeric). */
function str(raw: Record<string, unknown>, key: string): string {
  const value = raw[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

/**
 * Read a wire key as a boolean. HTML checkboxes reach servers as `"on"`, JSON
 * booleans reach it as `true`, and a hand-rolled client may send `"true"`/`"1"`.
 * Everything else — including absence — is `false`, which is the safe direction
 * for a consent box that must default to unchecked.
 */
function bool(raw: Record<string, unknown>, key: string): boolean {
  const value = raw[key];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value !== "string") return false;
  const normalised = value.trim().toLowerCase();
  return normalised === "true" || normalised === "on" || normalised === "1" || normalised === "yes";
}

function utmFrom(raw: Record<string, unknown>): IntakeUtm {
  const cut = (key: string) => str(raw, key).slice(0, LIMITS.utm);
  return {
    source: cut("utm_source"),
    medium: cut("utm_medium"),
    campaign: cut("utm_campaign"),
    term: cut("utm_term"),
    content: cut("utm_content"),
  };
}

/**
 * Narrow an unknown request body to `IntakeFields`, or report every problem at
 * once (one pass paints the whole form, matching the client's own behaviour).
 *
 * Required: name, hotel_name, city, state, email. Optional: everything else.
 * Context fields are TRUNCATED rather than rejected — a long referrer is not the
 * visitor's mistake and must never cost a lead.
 */
export function validateIntake(raw: unknown): IntakeValidation {
  if (!isRecord(raw)) return { ok: false, errors: { _: INTAKE_ERRORS.body } };

  const errors: Record<string, string> = {};

  const name = str(raw, "name");
  if (!name) errors.name = INTAKE_ERRORS.name;
  else if (name.length > LIMITS.name) errors.name = INTAKE_ERRORS.too_long;

  const hotelName = str(raw, "hotel_name");
  if (!hotelName) errors.hotel_name = INTAKE_ERRORS.hotel_name;
  else if (hotelName.length > LIMITS.hotelName) errors.hotel_name = INTAKE_ERRORS.too_long;

  const city = str(raw, "city");
  const state = str(raw, "state");
  if (!city || !state) errors.city = INTAKE_ERRORS.city;
  else if (city.length > LIMITS.city || state.length > LIMITS.state) {
    errors.city = INTAKE_ERRORS.too_long;
  }

  const email = str(raw, "email").toLowerCase();
  if (!email) errors.email = INTAKE_ERRORS.email_required;
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = INTAKE_ERRORS.email_invalid;
  }

  /* Consent is read from the wire ONLY as a yes/no. Everything the record needs
     besides that answer is minted server-side in `recordConsent`. */
  const smsConsent = bool(raw, SMS_CONSENT.checkboxField);

  const phone = str(raw, "phone");
  if (phone && (phone.length > LIMITS.phone || !isPlausibleE164(phone))) {
    errors.phone = INTAKE_ERRORS.phone_invalid;
  } else if (!phone && smsConsent) {
    /* Contract §6: the number is required ONLY when consent is ticked. This is
       the whole reason the field is otherwise optional. */
    errors.phone = INTAKE_ERRORS.phone_required_for_sms;
  }

  const company = str(raw, "company");
  if (company.length > LIMITS.company) errors.company = INTAKE_ERRORS.too_long;

  const brand = str(raw, "brand");
  if (brand.length > LIMITS.brand) errors.brand = INTAKE_ERRORS.too_long;

  const timeline = str(raw, "timeline");
  if (timeline.length > LIMITS.timeline) errors.timeline = INTAKE_ERRORS.too_long;

  const comments = str(raw, "comments");
  if (comments.length > LIMITS.comments) errors.comments = INTAKE_ERRORS.too_long;

  const keysRaw = str(raw, "keys");
  let keys: number | null = null;
  if (keysRaw) {
    const digits = keysRaw.replace(/[,\s]/g, "");
    const parsed = Number(digits);
    if (!/^\d+$/.test(digits) || !Number.isInteger(parsed) || parsed < 1 || parsed > LIMITS.keysMax) {
      errors.keys = INTAKE_ERRORS.keys_invalid;
    } else {
      keys = parsed;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      hotelName,
      city,
      state,
      stateCode: str(raw, "state_code").slice(0, LIMITS.stateCode).toUpperCase(),
      phone,
      email,
      smsConsent,
      company,
      keys,
      brand,
      timeline,
      comments,
      context: {
        page: str(raw, "page").slice(0, LIMITS.context),
        referrer: str(raw, "referrer").slice(0, LIMITS.context),
        utm: utmFrom(raw),
      },
    },
  };
}

/**
 * Was the hidden field filled? Contract §8.
 *
 * Read straight off the raw body, BEFORE validation, so a bot that also submits
 * garbage is dropped on the honeypot branch rather than on a validation error —
 * the two are logged differently.
 */
export function isHoneypotTripped(raw: unknown): boolean {
  if (!isRecord(raw)) return false;
  const value = raw[HONEYPOT_FIELD];
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().length > 0;
  return value != null && value !== 0;
}

/* -------------------------------------------------------------------------- */
/*  Server-authoritative record                                                */
/* -------------------------------------------------------------------------- */

/**
 * Mint the consent record. The ONLY input is the yes/no answer — every string
 * comes from `content/compliance.ts` verbatim and the timestamp is the server's
 * own clock, so a forged `sms_consent_text` or `consent_timestamp` on the wire
 * has nowhere to land.
 */
export function recordConsent(smsConsent: boolean): ServerConsentRecord {
  return {
    smsConsent,
    disclosure: SMS_CONSENT.label,
    checkboxValue: smsConsent ? SMS_CONSENT.checkboxValue : null,
    auditTrailText: smsConsent ? SMS_CONSENT.consentText : null,
    recordedAt: smsConsent ? consentTimestamp() : null,
    agencyNotice: AGENCY_RELATIONSHIP_NOTICE,
  };
}

/** Opaque, collision-free, and safe to show a visitor as a reference. */
export function newSubmissionId(): string {
  const cryptoRef = globalThis.crypto as Crypto | undefined;
  if (cryptoRef && typeof cryptoRef.randomUUID === "function") return cryptoRef.randomUUID();
  return `hk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const PACIFIC = "America/Los_Angeles";

/** `YYYYMMDD` on the team's own clock — the date token the CRM guide's note format uses. */
export function pacificDateStamp(when: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PACIFIC,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(when);
  return parts.replace(/\D/g, "");
}

/** `YYYY-MM-DD HH:mm` Pacific, for the Update block. */
export function pacificTimestamp(when: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PACIFIC,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(when);
  return parts.replace(",", "");
}

export type SubmissionMeta = {
  submissionId?: string;
  receivedAt?: Date;
  userAgent?: string;
};

/**
 * Compose the record everything downstream reads. The three server-controlled
 * facts — submission type, source, consent — are set HERE and nowhere else.
 */
export function buildSubmission(fields: IntakeFields, meta: SubmissionMeta = {}): IntakeSubmission {
  const receivedAt = meta.receivedAt ?? new Date();
  return {
    ...fields,
    submissionId: meta.submissionId ?? newSubmissionId(),
    submissionType: SUBMISSION_TYPE,
    source: SUBMISSION_SOURCE,
    consent: recordConsent(fields.smsConsent),
    receivedAtUtc: receivedAt.toISOString(),
    receivedAtPacific: pacificTimestamp(receivedAt),
    userAgent: (meta.userAgent ?? "").slice(0, LIMITS.userAgent),
  };
}

/* -------------------------------------------------------------------------- */
/*  CRM-facing renderings — contract §4                                        */
/* -------------------------------------------------------------------------- */

/**
 * `name` → item name + First Name + Last Name.
 * Contract §4: split on the LAST space; a single token is the first name and the
 * last name is empty. No cleverness — a name is not a parseable format.
 */
export function splitName(full: string): { first: string; last: string } {
  const trimmed = full.trim().replace(/\s+/g, " ");
  const cut = trimmed.lastIndexOf(" ");
  if (cut < 0) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, cut), last: trimmed.slice(cut + 1) };
}

/** `<City>, <ST>` — the state CODE when the picker gave one, else the full name. */
export function marketLabel(submission: Pick<IntakeSubmission, "city" | "state" | "stateCode">): string {
  const region = submission.stateCode || submission.state;
  return region ? `${submission.city}, ${region}` : submission.city;
}

/** Contract §4: Properties Mentioned = `"<hotel_name> — <City>, <ST>"` (em dash). */
export function propertiesMentioned(
  submission: Pick<IntakeSubmission, "hotelName" | "city" | "state" | "stateCode">,
): string {
  /* One line: this is a single-line Monday column and a line of the Update. */
  return singleLine(`${submission.hotelName} — ${marketLabel(submission)}`);
}

/**
 * The single line prepended to Relationship Notes, in the CRM guide's own
 * format (contract §4):
 *
 *   YYYYMMDD WEB: BOV request via <domain> — <hotel>, <City, ST>; keys <n>;
 *   brand <x>; timeline <y>; SMS consent <yes/no>; comments: <z>
 *
 * Segments whose value is blank are dropped rather than written as "keys ;" —
 * an empty segment is noise in a column a human reads every day.
 */
export function relationshipNotesLine(submission: IntakeSubmission, domain: string): string {
  const stamp = pacificDateStamp(new Date(submission.receivedAtUtc));
  /* ONE line, always. The guide's format is "prepend one line", and a caller
     value carrying a newline would otherwise forge extra note lines in a column
     a human reads as a history. `singleLine` also strips angle brackets. */
  const head = singleLine(
    `${stamp} WEB: ${submission.submissionType} via ${domain} — ${submission.hotelName}, ${marketLabel(submission)}`,
  );

  const segments: string[] = [];
  if (submission.keys !== null) segments.push(`keys ${submission.keys}`);
  if (submission.brand) segments.push(`brand ${singleLine(submission.brand)}`);
  if (submission.timeline) segments.push(`timeline ${singleLine(submission.timeline)}`);
  if (submission.company) segments.push(`company ${singleLine(submission.company)}`);
  segments.push(`SMS consent ${submission.consent.smsConsent ? "yes" : "no"}`);
  if (submission.comments) segments.push(`comments: ${singleLine(submission.comments)}`);

  return `${head}; ${segments.join("; ")}`;
}

/** Why this submission took the branch it took — one human-readable line. */
export type DedupeOutcome =
  | { kind: "new" }
  | { kind: "contacts"; itemId: string; itemName: string }
  | { kind: "unverified"; itemId: string; itemName: string }
  | { kind: "buyer-leads"; itemId: string; itemName: string };

/**
 * Boards the website may READ for dedupe and must NEVER write to.
 *
 * Contract §1.3 lists Buyer Leads as a read: "Search `Contacts` and `Unverified
 * Leads` (and **read-only** `Buyer Leads`) by the Email column." §4 then states
 * the prohibition without qualification — the website never creates Buyer Leads
 * records, and the only board that receives an Update on an existing item is
 * Contacts. An Update is a write: it appends to a record on a curated
 * mass-campaign board, notifies its subscribers, and does it on the say-so of an
 * unverified stranger who typed an email address into a public form. Nothing in
 * the CRM guide authorises that.
 *
 * The consequence is deliberate and is the whole point: a Buyer Leads hit
 * produces NO Monday call at all — not an item, not a column, not a comment.
 * The submission is delivered by the fallback email and alerted, and a HUMAN
 * decides whether it belongs in Unverified Leads or on the Buyer Leads record.
 * The lead is never lost; it is routed to a person instead of to a board.
 */
export const READ_ONLY_DEDUPE_KINDS = ["buyer-leads"] as const;

export type ReadOnlyDedupeKind = (typeof READ_ONLY_DEDUPE_KINDS)[number];

/**
 * True when the matched record sits on a board the website must not write to.
 * A type predicate, so the caller that refuses the write also gets the item id
 * it needs for the alert without re-narrowing by hand.
 */
export function isReadOnlyDedupe(
  dedupe: DedupeOutcome,
): dedupe is Extract<DedupeOutcome, { kind: ReadOnlyDedupeKind }> {
  return (READ_ONLY_DEDUPE_KINDS as readonly string[]).includes(dedupe.kind);
}

/** A phone match with a different email — contract §3, "preserve both, flag it". */
export type PhoneCollision = { itemId: string; itemName: string; board: string } | null;

export type UpdateBodyInput = {
  submission: IntakeSubmission;
  domain: string;
  dedupe: DedupeOutcome;
  phoneCollision?: PhoneCollision;
  /** Set when the route ran without writing (contract §9). */
  dryRun?: boolean;
};

/**
 * Printed in place of a blank value in the Update body. Exported because the
 * log redactor in `lib/monday.ts` leaves it alone: an em dash discloses nothing,
 * and redacting it would only make a dry-run transcript harder to read.
 */
export const UPDATE_BODY_EMPTY = "—";

const DASH = UPDATE_BODY_EMPTY;

/**
 * One-line, markup-free rendering of a caller-supplied string.
 *
 * TWO ATTACKS THIS CLOSES, both aimed at the CRM rather than at the website:
 *  1. RECORD FORGERY. The Update body is a structured `Label: value` block that
 *     a human reads as evidence. A `comments` value containing a newline could
 *     otherwise inject its own lines — "SMS consent: yes", a fake "Dedupe: …" —
 *     into the middle of that block. Collapsing whitespace makes every caller
 *     value exactly one line, so only this function's own labels start a line.
 *  2. MARKUP. `create_update`'s `body` is rendered as HTML by monday.com, so
 *     angle brackets from a stranger's form submission have no business in it.
 *     They are removed rather than escaped, because the same string is also
 *     posted as the plain-text fallback email where `&lt;` would be noise.
 * Control characters go too — they break the Notes column and the email alike.
 *
 * The submission itself is never rewritten: this is a rendering rule for the
 * two places caller text is embedded in a document (the Update body and the
 * email subject), not a validation rule.
 */
export function singleLine(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The two labels whose values get a shape-preserving redactor of their own
 * (`t***@domain`, last four digits) instead of the generic length+fingerprint.
 * Declared here so `buildUpdateBody` and the redactor in `lib/monday.ts` cannot
 * drift apart: renaming a label in one place without the other would silently
 * turn a redacted line back into a verbatim one.
 */
export const UPDATE_BODY_LABELS = {
  email: "Email",
  phone: "Phone",
} as const;

/**
 * Update-body labels whose value is SERVER-MINTED or a compliance constant, and
 * is therefore safe to print verbatim in a runtime log.
 *
 * Everything not on this list is treated as caller-supplied and is redacted
 * before it reaches a log line — including `Dedupe`, which quotes the name of a
 * matched CRM record (somebody else's personal data), and the `possible
 * duplicate (phone)` line, which quotes the same. The list is an allow-list on
 * purpose: adding a line to `buildUpdateBody` and forgetting this constant
 * yields a redacted line, never a leaked one.
 */
export const LOG_SAFE_UPDATE_LABELS: readonly string[] = [
  "MODE",
  "Submission id",
  "Source",
  "Site",
  "Received (UTC)",
  "Received (Pacific)",
  "SMS consent",
  "Consent recorded (server)",
  "Disclosure shown",
  "Checkbox value",
  "Audit trail",
  "Agency notice shown",
];

/**
 * The fixed structured block posted as a Monday **Update** (contract §4 last two
 * rows). Everything that has no mapped column lands here — UTM values, page,
 * referrer, submission id, both timestamps, the consent disclosure text and its
 * timestamp, the agency notice, and a truncated user-agent. Never a column.
 */
export function buildUpdateBody(input: UpdateBodyInput): string {
  const { submission: s, domain, dedupe } = input;
  /* Every caller-supplied value is flattened to one markup-free line — see
     `singleLine`. Server-minted values pass through unchanged because the
     function is a no-op on them. */
  const line = (label: string, value: string | number | null) => {
    if (value === null) return `${label}: ${DASH}`;
    if (typeof value === "number") return `${label}: ${value}`;
    const clean = singleLine(value);
    return `${label}: ${clean === "" ? DASH : clean}`;
  };

  /* Three headers, because three different things happened to the CRM: a new
     item was created, an Update was added to an existing item, or — on a
     read-only board match — Monday was never called at all and this block exists
     only as the email + alert a human will act on. */
  const header =
    dedupe.kind === "new"
      ? `${s.submissionType} ${DASH} website intake`
      : isReadOnlyDedupe(dedupe)
        ? `${s.submissionType} ${DASH} website intake (read-only board match; NOTHING written to Monday)`
        : `${s.submissionType} ${DASH} website intake (existing record; no columns written)`;

  const lines = [
    header,
    input.dryRun ? "MODE: DRY RUN — nothing was written to Monday." : null,
    "",
    line("Submission id", s.submissionId),
    line("Source", s.source),
    line("Site", domain),
    line("Received (UTC)", s.receivedAtUtc),
    line("Received (Pacific)", s.receivedAtPacific),
    "",
    line("Name", s.name),
    line(UPDATE_BODY_LABELS.email, s.email),
    line(UPDATE_BODY_LABELS.phone, s.phone),
    line("Company", s.company),
    line("Property", propertiesMentioned(s)),
    line("Keys", s.keys),
    line("Brand", s.brand),
    line("Timeline", s.timeline),
    line("Comments", s.comments),
    "",
    line("SMS consent", s.consent.smsConsent ? "yes" : "no"),
    line("Consent recorded (server)", s.consent.recordedAt),
    `Disclosure shown: "${s.consent.disclosure}"`,
    s.consent.checkboxValue ? `Checkbox value: "${s.consent.checkboxValue}"` : null,
    s.consent.auditTrailText ? `Audit trail: "${s.consent.auditTrailText}"` : null,
    `Agency notice shown: "${s.consent.agencyNotice}"`,
    "",
    line("Page", s.context.page),
    line("Referrer", s.context.referrer),
    line("utm_source", s.context.utm.source),
    line("utm_medium", s.context.utm.medium),
    line("utm_campaign", s.context.utm.campaign),
    line("utm_term", s.context.utm.term),
    line("utm_content", s.context.utm.content),
    line("User agent", s.userAgent),
    "",
    line("Dedupe", describeDedupe(dedupe)),
    input.phoneCollision
      ? `possible duplicate (phone): "${singleLine(input.phoneCollision.itemName)}" (${input.phoneCollision.board} item ${singleLine(input.phoneCollision.itemId)}) — records preserved separately, not merged.`
      : null,
  ];

  return lines.filter((entry) => entry !== null).join("\n");
}

export function describeDedupe(dedupe: DedupeOutcome): string {
  switch (dedupe.kind) {
    case "new":
      return "no existing record for this email — created in Unverified Leads / New / Unverified";
    case "contacts":
      return `email already in Contacts ("${singleLine(dedupe.itemName)}", item ${singleLine(dedupe.itemId)}) — Update posted, no item created, no column written`;
    case "unverified":
      return `email already in Unverified Leads ("${singleLine(dedupe.itemName)}", item ${singleLine(dedupe.itemId)}) — Update posted, no second item created`;
    case "buyer-leads":
      /* Buyer Leads is READ-ONLY (contract §1.3, §4). Nothing at all was sent to
         Monday on this branch — not an item, not a column, not an Update. */
      return `email already in Buyer Leads ("${singleLine(dedupe.itemName)}", item ${singleLine(dedupe.itemId)}) — READ-ONLY board: nothing written to Monday; delivered by fallback email and alerted for a human to route`;
  }
}

/* -------------------------------------------------------------------------- */
/*  Origin allow-list — contract §8                                            */
/* -------------------------------------------------------------------------- */

/** Parse `ALLOWED_ORIGINS` (comma-separated). Trailing slashes and case are normalised. */
export function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim().replace(/\/+$/, "").toLowerCase())
    .filter((entry) => entry.length > 0);
}

/**
 * Is this request allowed to post?
 *
 * With an allow-list configured, the Origin header must be on it — no header, no
 * submission. With NO allow-list configured (local dev, an unconfigured
 * preview), the fallback is strict SAME-ORIGIN: the Origin must match the
 * request's own Host. That keeps dev working without ever leaving the route open
 * to any origin on the internet, which a permissive default would.
 */
export function isOriginAllowed(
  origin: string | null,
  allowList: readonly string[],
  host: string | null,
): boolean {
  const normalised = origin?.trim().replace(/\/+$/, "").toLowerCase() ?? "";

  if (allowList.length > 0) {
    return normalised.length > 0 && allowList.includes(normalised);
  }

  if (!normalised) return false;
  if (!host) return false;

  let originHost: string;
  try {
    originHost = new URL(normalised).host.toLowerCase();
  } catch {
    return false;
  }
  return originHost === host.trim().toLowerCase();
}

/* -------------------------------------------------------------------------- */
/*  Rate limit — an honest backstop, not a defence                             */
/* -------------------------------------------------------------------------- */

/**
 * Fixed-window counter in process memory.
 *
 * BEST EFFORT BY CONSTRUCTION and documented as such in plan §3.7 and contract
 * §8: serverless instances do not share memory, so N concurrent instances allow
 * N× this limit, and a cold start resets it. The real control is the
 * edge/Vercel-Firewall rule on `/api/contact-intake`. This exists so a single
 * warm instance cannot be hammered, and so the route degrades honestly if the
 * edge rule is ever removed.
 */
export class FixedWindowLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    /** Bound on distinct keys held, so the map cannot grow without limit. */
    private readonly maxKeys = 2_000,
  ) {}

  /** `true` when the request is within budget. Records the hit when it is. */
  take(key: string, now = Date.now()): boolean {
    const cutoff = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((at) => at > cutoff);

    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }

    recent.push(now);
    this.hits.set(key, recent);

    if (this.hits.size > this.maxKeys) {
      for (const [existing, times] of this.hits) {
        if (times.length === 0 || times[times.length - 1]! <= cutoff) this.hits.delete(existing);
        if (this.hits.size <= this.maxKeys) break;
      }
    }
    return true;
  }
}

/**
 * The rate-limit bucket key.
 *
 * Platform-set headers are preferred over `x-forwarded-for` on purpose: a
 * caller can put anything in `x-forwarded-for`, so treating its first hop as
 * identity lets one client rotate through unlimited buckets. `x-vercel-
 * forwarded-for` and `x-real-ip` are written by the proxy in front of the
 * function and cannot be forged from outside it. The XFF first hop stays as the
 * last resort for local dev and non-Vercel hosts, where nothing better exists.
 */
export function clientKey(headers: Headers): string {
  const platform =
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim();
  if (platform) return platform;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

/* -------------------------------------------------------------------------- */
/*  Response contract (shared with the form)                                   */
/* -------------------------------------------------------------------------- */

export type IntakeErrorCode =
  | "bad_request"
  | "validation"
  | "origin"
  | "payload_too_large"
  | "rate_limited"
  | "delivery_failed";

export type IntakeResponse =
  | { ok: true; reference: string | null }
  | { ok: false; error: IntakeErrorCode; message: string; fields?: Record<string, string> };

/* -------------------------------------------------------------------------- */
/*  Mailto fallback                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The secondary action beside Send, and the recovery path after a failed POST.
 * Carries the SAME information the POST would have carried, so nothing typed is
 * wasted.
 *
 * Port rule R4 DOES still govern here: on this path the browser is the only
 * recorder and the resulting email is the record, so the consent line and its
 * timestamp are stamped client-side when the box is ticked. That is the opposite
 * of the route's rule, and deliberately so — the route has a server to trust.
 */
export type BovMailtoInput = {
  name?: string;
  hotelName?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  company?: string;
  keys?: string;
  brand?: string;
  timeline?: string;
  comments?: string;
  smsConsent?: boolean;
};

export function bovMailtoSubject(domain: string): string {
  return `New BOV request ${DASH} ${domain}`;
}

export function bovMailtoHref(input: BovMailtoInput = {}, domain: string): string {
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    const trimmed = value?.trim();
    if (trimmed) lines.push(`${label}: ${trimmed}`);
  };

  add("Name", input.name);
  add("Company", input.company);
  add("Hotel", input.hotelName);
  const place = [input.city?.trim(), input.state?.trim()].filter(Boolean).join(", ");
  add("City, State", place);
  add("Keys", input.keys);
  add("Brand", input.brand);
  add("Timeline", input.timeline);
  add("Phone", input.phone);
  add("Email", input.email);
  add("Comments", input.comments);

  if (input.smsConsent) {
    lines.push(`SMS consent: ${SMS_CONSENT.checkboxValue}`);
    lines.push(`Consent recorded: ${consentTimestamp()}`);
  }

  lines.push("");
  lines.push("Available property data (T-12, STR report, franchise / PIP):");

  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    bovMailtoSubject(domain),
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
}
