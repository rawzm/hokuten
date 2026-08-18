/**
 * lib/monday.ts — SERVER ONLY. The website's entire relationship with the CRM.
 *
 * Binding contract: docs/MONDAY-INTAKE-CONTRACT.md (2026-08-17) §1–§9. Where the
 * "RAZIM DEPLOYMENT SETTINGS REQUIRED v2" summary disagrees with that contract,
 * the contract wins — most importantly on the write target: the website creates
 * items ONLY in `Unverified Leads / New / Unverified`, never in Contacts.
 *
 * ─── THE FOUR RULES THIS FILE EXISTS TO ENFORCE ─────────────────────────────
 *  1. NEVER INVENT. No board, group, column, label, view or automation is ever
 *     created. Every mutation carries `create_labels_if_missing: false`, and the
 *     only column ids ever written are the ones present in
 *     `MONDAY_COLUMN_MAP_JSON`. A field with no mapped column goes into the
 *     item's Update and the Relationship Notes line — never into a new column.
 *  2. DEDUPE BY EMAIL FIRST. Contacts, Unverified Leads and (when configured)
 *     the read-only Buyer Leads board are searched by the Email column before
 *     anything is created. A hit in Contacts or Unverified Leads means an Update
 *     on the existing item and NOTHING else — no second item, no column change,
 *     no Cadence, no People, no Last Contacted. A hit in BUYER LEADS means no
 *     Monday call whatsoever (rule 5).
 *  3. REFUSE ON A CONFIGURATION MISMATCH. Missing env, a non-numeric id, the
 *     write board equal to the Contacts board, a group id that is not on the
 *     board, a mapped column id that is not on the board, a column whose type is
 *     not what the map claims, or a board whose API-reported `workspace_id` is
 *     not `MONDAY_WORKSPACE_ID` — every one of those refuses the write and
 *     alerts. The route never picks a target by board NAME.
 *  4. DRY RUN IS THE DEFAULT. `INTAKE_DRY_RUN` unset means ON. The exact
 *     GraphQL is built and logged, the fallback email is sent, and not one byte
 *     reaches Monday. That is how this ships today, because the column map does
 *     not exist yet.
 *  5. BUYER LEADS IS READ-ONLY. It is searched for dedupe and nothing else.
 *     A match there produces ZERO Monday operations — the submission goes out on
 *     the fallback-email path with an alert, and a human routes it. `grep -n
 *     buyerLeads lib/monday.ts` should only ever find reads.
 *
 * ─── SECRETS ────────────────────────────────────────────────────────────────
 * `MONDAY_API_TOKEN` is read here and nowhere else. It is never logged, never
 * echoed into an error, never put in a response body, and never imported by a
 * client module — the module-scope guard below turns a mistaken client import
 * into a loud crash rather than a shipped token. Env is read at CALL time, not
 * module scope, so a Vercel value change needs no code change and tests can
 * vary it.
 *
 * ─── LOGGING ────────────────────────────────────────────────────────────────
 * NO SUBMISSION VALUE REACHES A LOG LINE BY DEFAULT — not in dry run, not in
 * live mode. A Vercel runtime log is readable by everyone with project access
 * and is retained on the platform's schedule, not ours; a hotel owner who typed
 * their mobile number into a public form did not consent to that, and neither
 * did the third party whose CRM record a dedupe search happened to match.
 *
 * Dry run still logs the operation SHAPE in full — the query text verbatim, the
 * board id, the group id, every column id, the JSON structure of the payload —
 * because "build and log the exact mutation" (contract §9) is the whole point of
 * the mode. What it does not log is the VALUES: emails become `a***@domain`,
 * phones become their last four digits, and free text becomes a length plus a
 * short fingerprint (`redactOperation`). That is enough to confirm the mapping
 * is right and to correlate two attempts, and not enough to identify anybody.
 *
 * `INTAKE_LOG_VERBOSE` turns the values back on for a bounded debugging session
 * and says so loudly in the log every time it is used. It is OFF unless
 * explicitly set — the mirror of `INTAKE_DRY_RUN`'s discipline.
 *
 * Live mode logs op name, board id, item id and submission id only — the
 * reversal trail contract §8 asks for, with no PII, verbose flag or not.
 */

import { createHash } from "node:crypto";

import {
  LOG_SAFE_UPDATE_LABELS,
  UPDATE_BODY_EMPTY,
  UPDATE_BODY_LABELS,
  buildUpdateBody,
  isReadOnlyDedupe,
  propertiesMentioned,
  relationshipNotesLine,
  singleLine,
  splitName,
  type DedupeOutcome,
  type IntakeSubmission,
  type PhoneCollision,
} from "@/lib/intake";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/monday.ts is server-only and must never be imported from a client component.",
  );
}

/* -------------------------------------------------------------------------- */
/*  Endpoint + transport                                                       */
/* -------------------------------------------------------------------------- */

export const MONDAY_ENDPOINT = "https://api.monday.com/v2";

/**
 * Pinned, and overridable by env without a code change (contract §7's
 * "config, not code" principle). `items_page_by_column_values`, `create_item`'s
 * `create_labels_if_missing` argument and `Board.workspace_id` all exist from
 * 2023-10 onward; 2024-10 is the version this was written against.
 */
export const DEFAULT_MONDAY_API_VERSION = "2024-10";

export const MONDAY_TIMEOUT_MS = 10_000;
export const WEBHOOK_TIMEOUT_MS = 10_000;
export const ALERT_TIMEOUT_MS = 5_000;

/** Injected so tests can assert "zero network calls" without stubbing globals. */
export type Fetcher = (input: string, init: RequestInit) => Promise<Response>;

/* -------------------------------------------------------------------------- */
/*  Column map — contract §2                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The eight mappable columns and nothing else. A key outside this list is a
 * configuration error, not a silent extra: it would mean someone tried to add a
 * write target by editing an env var, which is exactly what rule 1 forbids.
 */
export const COLUMN_MAP_KEYS = [
  "name_first",
  "name_last",
  "email",
  "phone",
  "company",
  "type",
  "properties_mentioned",
  "relationship_notes",
] as const;

export type ColumnMapKey = (typeof COLUMN_MAP_KEYS)[number];

export type ColumnMap = {
  name_first?: string;
  name_last?: string;
  email?: string;
  phone?: string;
  company?: string;
  /** Status/dropdown. `lead_label` must already exist on the board as a label. */
  type?: { id: string; lead_label: string };
  properties_mentioned?: string;
  relationship_notes?: string;
};

/**
 * Monday column types each mapped key is allowed to point at. A column whose
 * real type is not in its list refuses the write (contract §2: "Column types are
 * read from the API at first use; a type mismatch refuses the write and
 * alerts"). `color` is the legacy wire name for `status`.
 */
export const ALLOWED_COLUMN_TYPES: Record<ColumnMapKey, readonly string[]> = {
  name_first: ["text"],
  name_last: ["text"],
  email: ["email"],
  phone: ["phone"],
  company: ["text"],
  type: ["status", "color", "dropdown"],
  properties_mentioned: ["text", "long_text"],
  relationship_notes: ["long_text", "text"],
};

export function parseColumnMap(raw: string | undefined):
  | { ok: true; value: ColumnMap }
  | { ok: false; reason: string } {
  if (!raw || !raw.trim()) return { ok: false, reason: "MONDAY_COLUMN_MAP_JSON is not set" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "MONDAY_COLUMN_MAP_JSON is not valid JSON" };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, reason: "MONDAY_COLUMN_MAP_JSON must be a JSON object" };
  }

  const entries = parsed as Record<string, unknown>;
  const unknown = Object.keys(entries).filter(
    (key) => !(COLUMN_MAP_KEYS as readonly string[]).includes(key),
  );
  if (unknown.length > 0) {
    return { ok: false, reason: `MONDAY_COLUMN_MAP_JSON has unmappable key(s): ${unknown.join(", ")}` };
  }

  const map: ColumnMap = {};
  for (const key of COLUMN_MAP_KEYS) {
    const value = entries[key];
    if (value === undefined || value === null) continue;

    if (key === "type") {
      if (typeof value !== "object" || Array.isArray(value)) {
        return { ok: false, reason: '"type" must be { "id": …, "lead_label": … }' };
      }
      const shape = value as Record<string, unknown>;
      if (typeof shape.id !== "string" || !shape.id.trim()) {
        return { ok: false, reason: '"type.id" must be a non-empty column id' };
      }
      if (typeof shape.lead_label !== "string" || !shape.lead_label.trim()) {
        return { ok: false, reason: '"type.lead_label" must be the EXACT existing label text' };
      }
      map.type = { id: shape.id.trim(), lead_label: shape.lead_label };
      continue;
    }

    if (typeof value !== "string" || !value.trim()) {
      return { ok: false, reason: `"${key}" must be a non-empty column id` };
    }
    map[key] = value.trim();
  }

  /* Email is the primary key of the whole contract (§3). Without it there is no
     dedupe, and without dedupe the route must not create anything. */
  if (!map.email) return { ok: false, reason: '"email" is required — it is the dedupe key' };

  return { ok: true, value: map };
}

/* -------------------------------------------------------------------------- */
/*  Configuration — contract §2 + §8                                           */
/* -------------------------------------------------------------------------- */

export type MondayConfig = {
  token: string;
  apiVersion: string;
  workspaceId: string;
  contactsBoardId: string;
  unverifiedBoardId: string;
  intakeGroupId: string;
  /** Optional, read-only. Searched for dedupe when present (contract §3). */
  buyerLeadsBoardId: string | null;
  columns: ColumnMap;
  /** Optional prefix for the §6 test items (`WEBSITE TEST — delete me`). */
  itemNamePrefix: string;
};

export type ConfigResult =
  | { ok: true; value: MondayConfig }
  | { ok: false; reason: string };

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/** Monday ids are numeric strings. Anything else is a typo, not a board. */
function isMondayId(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * `INTAKE_DRY_RUN` — **ON when unset**. Only an explicit, unambiguous "off"
 * turns writes on, so a missing or misspelled variable can never be the reason
 * a stranger lands in the CRM.
 */
export function isDryRun(): boolean {
  const raw = env("INTAKE_DRY_RUN").toLowerCase();
  if (!raw) return true;
  return !(raw === "0" || raw === "false" || raw === "off" || raw === "no");
}

/**
 * Read and hard-validate the Monday configuration. Every refusal names the
 * exact variable, because the operator reading the alert is the person who has
 * to fix it — and none of these strings can contain the token.
 */
export function loadMondayConfig(): ConfigResult {
  const token = env("MONDAY_API_TOKEN");
  if (!token) return { ok: false, reason: "MONDAY_API_TOKEN is not set" };

  const workspaceId = env("MONDAY_WORKSPACE_ID");
  if (!isMondayId(workspaceId)) {
    return { ok: false, reason: "MONDAY_WORKSPACE_ID is missing or not a numeric id" };
  }

  const contactsBoardId = env("MONDAY_CONTACTS_BOARD_ID");
  if (!isMondayId(contactsBoardId)) {
    return { ok: false, reason: "MONDAY_CONTACTS_BOARD_ID is missing or not a numeric id" };
  }

  const unverifiedBoardId = env("MONDAY_UNVERIFIED_BOARD_ID");
  if (!isMondayId(unverifiedBoardId)) {
    return { ok: false, reason: "MONDAY_UNVERIFIED_BOARD_ID is missing or not a numeric id" };
  }

  /* Contract §1: the write target is NEVER Contacts. If the two ids are equal
     the deployment has been configured against the contract — refuse, loudly,
     rather than putting an unverified stranger into the mass-campaign board. */
  if (unverifiedBoardId === contactsBoardId) {
    return {
      ok: false,
      reason:
        "MONDAY_UNVERIFIED_BOARD_ID equals MONDAY_CONTACTS_BOARD_ID — the website never creates items in Contacts (contract §1)",
    };
  }

  const intakeGroupId = env("MONDAY_INTAKE_GROUP_ID");
  if (!intakeGroupId) {
    return { ok: false, reason: "MONDAY_INTAKE_GROUP_ID is not set (the `New / Unverified` group)" };
  }

  const buyerLeadsRaw = env("MONDAY_BUYER_LEADS_BOARD_ID");
  if (buyerLeadsRaw && !isMondayId(buyerLeadsRaw)) {
    return { ok: false, reason: "MONDAY_BUYER_LEADS_BOARD_ID is set but is not a numeric id" };
  }

  const columns = parseColumnMap(process.env.MONDAY_COLUMN_MAP_JSON);
  if (!columns.ok) return { ok: false, reason: columns.reason };

  return {
    ok: true,
    value: {
      token,
      apiVersion: env("MONDAY_API_VERSION") || DEFAULT_MONDAY_API_VERSION,
      workspaceId,
      contactsBoardId,
      unverifiedBoardId,
      intakeGroupId,
      buyerLeadsBoardId: buyerLeadsRaw || null,
      columns: columns.value,
      itemNamePrefix: env("INTAKE_ITEM_NAME_PREFIX"),
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  GraphQL operations — pure builders, so the shape is testable               */
/* -------------------------------------------------------------------------- */

export type MondayOperation = {
  /** Human label used in logs and in the dry-run transcript. */
  name: string;
  query: string;
  variables: Record<string, unknown>;
};

export function buildBoardVerificationQuery(boardIds: readonly string[]): MondayOperation {
  return {
    name: "verify_boards",
    query: `query IntakeVerifyBoards($boardIds: [ID!]) {
  boards(ids: $boardIds) {
    id
    name
    workspace_id
    groups { id title }
    columns { id title type }
  }
}`,
    variables: { boardIds: [...boardIds] },
  };
}

export function buildDedupeQuery(
  boardId: string,
  columnId: string,
  value: string,
): MondayOperation {
  return {
    name: "dedupe_by_column",
    query: `query IntakeDedupe($boardId: ID!, $columns: [ColumnValuesInput!]) {
  items_page_by_column_values(board_id: $boardId, limit: 25, columns: $columns) {
    items { id name }
  }
}`,
    variables: { boardId, columns: [{ column_id: columnId, column_values: [value] }] },
  };
}

/**
 * Column values for a CREATE, built strictly from the map.
 *
 * The loop is over the MAP, never over the submission: a field the map does not
 * mention cannot reach a column even by accident. Everything left over is
 * carried by the Relationship Notes line and the Update instead (contract §4).
 */
export function buildColumnValues(
  submission: IntakeSubmission,
  config: MondayConfig,
  domain: string,
): Record<string, unknown> {
  const { columns } = config;
  const { first, last } = splitName(submission.name);
  const values: Record<string, unknown> = {};

  if (columns.name_first) values[columns.name_first] = first;
  if (columns.name_last) values[columns.name_last] = last;
  if (columns.email) values[columns.email] = { email: submission.email, text: submission.email };
  if (columns.phone && submission.phone) {
    values[columns.phone] = { phone: submission.phone, countryShortName: "US" };
  }
  if (columns.company && submission.company) values[columns.company] = submission.company;
  /* The Type label is written verbatim from the map — it must already exist on
     the board, which is what `create_labels_if_missing: false` guarantees. */
  if (columns.type) values[columns.type.id] = { label: columns.type.lead_label };
  if (columns.properties_mentioned) {
    values[columns.properties_mentioned] = propertiesMentioned(submission);
  }
  if (columns.relationship_notes) {
    values[columns.relationship_notes] = { text: relationshipNotesLine(submission, domain) };
  }

  return values;
}

/**
 * The create mutation.
 *
 * `create_labels_if_missing: false` is written as a LITERAL in the query text,
 * not passed as a variable, so it is greppable, reviewable, and cannot be
 * flipped by a runtime value. `lib/intake.test.ts` asserts on that literal.
 */
export function buildCreateItemOperation(
  submission: IntakeSubmission,
  config: MondayConfig,
  domain: string,
): MondayOperation {
  /* One line: an item NAME is a single-line field, and the name is caller text. */
  const itemName = singleLine(
    `${config.itemNamePrefix ? `${config.itemNamePrefix} ` : ""}${submission.name}`,
  );
  return {
    name: "create_item",
    query: `mutation IntakeCreateItem($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
  create_item(
    board_id: $boardId,
    group_id: $groupId,
    item_name: $itemName,
    column_values: $columnValues,
    create_labels_if_missing: false
  ) { id name }
}`,
    variables: {
      boardId: config.unverifiedBoardId,
      groupId: config.intakeGroupId,
      itemName,
      columnValues: JSON.stringify(buildColumnValues(submission, config, domain)),
    },
  };
}

export function buildCreateUpdateOperation(itemId: string, body: string): MondayOperation {
  return {
    name: "create_update",
    query: `mutation IntakeCreateUpdate($itemId: ID!, $body: String!) {
  create_update(item_id: $itemId, body: $body) { id }
}`,
    variables: { itemId, body },
  };
}

/* -------------------------------------------------------------------------- */
/*  Log redaction — no submission value reaches a log line                     */
/* -------------------------------------------------------------------------- */

/**
 * `INTAKE_LOG_VERBOSE` — **OFF unless explicitly turned on**, the mirror image
 * of `isDryRun`'s discipline.
 *
 * Only an unambiguous "on" enables it, so a missing, empty or misspelled value
 * can never be the reason a visitor's name, email, phone number and comments
 * end up in a runtime log. It exists for one thing: a bounded debugging session
 * where an operator must see the literal payload. Every call that honours it
 * says so in the log, so an instance left verbose is visible in the transcript
 * rather than silent.
 */
export function isLogVerbose(): boolean {
  const raw = env("INTAKE_LOG_VERBOSE").toLowerCase();
  return raw === "1" || raw === "true" || raw === "on" || raw === "yes";
}

/**
 * A short, stable fingerprint of a value.
 *
 * NOT a security primitive, and it must never be used as one: it is truncated
 * to 32 bits of digest and it is unsalted, so a low-entropy input (a common
 * first name, a two-letter state) is confirmable by anyone who guesses it. Its
 * only job is CORRELATION — telling an operator reading a dry-run transcript
 * that the `comments` in two log lines were the same text, without printing
 * either of them.
 */
export function logFingerprint(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex").slice(0, 8);
}

/**
 * Free text → `[redacted len=42 h=1a2b3c4d]`.
 *
 * Length and fingerprint are what an operator actually needs from a dry-run
 * transcript: that the field arrived, roughly how big it was, and whether it
 * changed between two attempts. The empty string stays empty — "this field was
 * blank" is shape, not content, and it is exactly what a mapping bug looks like.
 */
export function redactText(value: string): string {
  if (value === "") return "";
  return `[redacted len=${value.length} h=${logFingerprint(value)}]`;
}

/**
 * `aiko@example.com` → `a***@example.com`.
 *
 * The domain survives on purpose: it is what tells an operator that the dedupe
 * key looks like a real submission rather than a test address, and a domain is
 * shared by everyone who uses it. The local part — the identifying half — does
 * not survive beyond its first character.
 */
export function redactEmail(value: string): string {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const at = trimmed.lastIndexOf("@");
  /* Not an address shape. Fall back to the generic redactor rather than guess
     which half was meant to be the local part. */
  if (at < 1 || at === trimmed.length - 1) return redactText(value);
  return `${trimmed.slice(0, 1)}***@${trimmed.slice(at + 1)}`;
}

/**
 * `+16507206995` → `***6995`. Last four digits only — enough for a team member
 * to match a log line against a call-back they already have, useless to anyone
 * who does not.
 */
export function redactPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return value.trim() === "" ? "" : redactText(value);
  return `***${digits.slice(-4)}`;
}

/**
 * The default for anything whose provenance the redactor does not recognise.
 * Structure is preserved so the SHAPE of the payload stays readable; every
 * string in it is redacted, and a number is reduced to the fact that it was one.
 * `null`, booleans and `undefined` pass through — they disclose nothing.
 */
function redactUnknown(value: unknown): unknown {
  if (typeof value === "string") return redactText(value);
  if (typeof value === "number") return "[redacted number]";
  if (Array.isArray(value)) return value.map(redactUnknown);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        redactUnknown(entry),
      ]),
    );
  }
  return value;
}

/** column id → the mapped field it carries, so each value gets its own redactor. */
function columnKeyIndex(config: MondayConfig): Map<string, ColumnMapKey> {
  const index = new Map<string, ColumnMapKey>();
  for (const key of COLUMN_MAP_KEYS) {
    const mapped = config.columns[key];
    if (mapped === undefined) continue;
    index.set(typeof mapped === "string" ? mapped : mapped.id, key);
  }
  return index;
}

function redactColumnValue(key: ColumnMapKey | null, value: unknown): unknown {
  const mapStrings = (transform: (input: string) => string): unknown => {
    if (typeof value === "string") return transform(value);
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([field, entry]) => [
          field,
          /* Monday's phone value object carries `countryShortName: "US"` — a
             constant this file sets, not something the visitor typed, and it is
             worth reading back because a wrong country code is a real bug. */
          field === "countryShortName"
            ? entry
            : typeof entry === "string"
              ? transform(entry)
              : redactUnknown(entry),
        ]),
      );
    }
    return redactUnknown(value);
  };

  switch (key) {
    /* Monday's email value object is `{ email, text }` — both halves are the
       address, so both get the same treatment. */
    case "email":
      return mapStrings(redactEmail);
    case "phone":
      return mapStrings(redactPhone);
    case "type":
      /* The Type label is CONFIGURATION (`MONDAY_COLUMN_MAP_JSON.type
         .lead_label`), never submission data — and it is the single value an
         operator most needs to read back from a dry run, because it has to match
         an existing board label EXACTLY or `create_labels_if_missing: false`
         rejects the write. Kept verbatim. */
      return value;
    default:
      return redactUnknown(value);
  }
}

/**
 * The `column_values` JSON of a create, redacted value by value while every
 * column ID survives — the column ids are the whole thing a reviewer is checking
 * in dry run, and they are configuration rather than personal data.
 */
export function redactColumnValues(raw: string, config: MondayConfig): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return redactText(raw);
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return redactText(raw);
  }

  const keyByColumnId = columnKeyIndex(config);
  const out: Record<string, unknown> = {};
  for (const [columnId, value] of Object.entries(parsed as Record<string, unknown>)) {
    out[columnId] = redactColumnValue(keyByColumnId.get(columnId) ?? null, value);
  }
  return JSON.stringify(out);
}

/**
 * The Update body, line by line: every LABEL survives, every caller-supplied
 * VALUE is redacted.
 *
 * This is safe to do textually because `buildUpdateBody` controls the whole
 * document: every caller value is put on a `Label: value` line and is flattened
 * by `singleLine` first, so a submission can neither start a line of its own nor
 * forge one of the server-minted labels. A line without the `Label: value`
 * shape is structural (the header, a blank, the dry-run marker) and is kept.
 * The allow-list lives beside `buildUpdateBody` in `lib/intake.ts`; a label that
 * is not on it gets redacted, which is the safe direction for a list someone
 * will forget to update.
 */
export function redactUpdateBody(body: string): string {
  return body
    .split("\n")
    .map((rawLine) => {
      const cut = rawLine.indexOf(": ");
      if (cut < 0) return rawLine;

      const label = rawLine.slice(0, cut);
      const value = rawLine.slice(cut + 2);

      if (LOG_SAFE_UPDATE_LABELS.includes(label)) return rawLine;
      /* The em dash means the field was blank. Redacting it would hide shape and
         disclose nothing in return. */
      if (value === UPDATE_BODY_EMPTY) return rawLine;
      if (label === UPDATE_BODY_LABELS.email) return `${label}: ${redactEmail(value)}`;
      if (label === UPDATE_BODY_LABELS.phone) return `${label}: ${redactPhone(value)}`;
      return `${label}: ${redactText(value)}`;
    })
    .join("\n");
}

/** The §6 test prefix is operator-set config and is exactly what an operator is
 *  looking for in a staged run — keep it, redact the person after it. */
function redactItemName(itemName: string, config: MondayConfig): string {
  const prefix = config.itemNamePrefix;
  if (prefix && itemName.startsWith(`${prefix} `)) {
    return `${prefix} ${redactText(itemName.slice(prefix.length + 1))}`;
  }
  return redactText(itemName);
}

/**
 * A log-safe copy of an operation: identical `name` and `query`, variables with
 * every submission value replaced.
 *
 * Each branch starts from `redactUnknown` over the WHOLE variable object and
 * then re-admits the specific keys that are configuration rather than personal
 * data. That ordering is the point: a variable added to one of these operations
 * later is redacted by default, and an operation this function has never been
 * taught (the `default` branch) is redacted wholesale. Leaking requires someone
 * to deliberately re-admit a key, not merely to forget one.
 */
export function redactOperation(
  operation: MondayOperation,
  config: MondayConfig,
): MondayOperation {
  const vars = operation.variables;
  const scrubbed = redactUnknown(vars) as Record<string, unknown>;

  switch (operation.name) {
    /* Board ids only — configuration, nothing from the submission. */
    case "verify_boards":
      return operation;

    case "dedupe_by_column": {
      /* `columns[].column_values` IS the dedupe key: the visitor's email (or
         phone). The board id and the column id stay, so the transcript still
         shows which board was searched by which column. */
      const keyByColumnId = columnKeyIndex(config);
      const columns = Array.isArray(vars.columns) ? vars.columns : [];
      scrubbed.boardId = vars.boardId;
      scrubbed.columns = columns.map((entry) => {
        if (entry === null || typeof entry !== "object") return redactUnknown(entry);
        const { column_id: columnId, column_values: values } = entry as {
          column_id?: unknown;
          column_values?: unknown;
        };
        const key = typeof columnId === "string" ? (keyByColumnId.get(columnId) ?? null) : null;
        return {
          column_id: columnId,
          column_values: Array.isArray(values)
            ? values.map((value) => redactColumnValue(key, value))
            : redactUnknown(values),
        };
      });
      return { ...operation, variables: scrubbed };
    }

    case "create_item":
      scrubbed.boardId = vars.boardId;
      scrubbed.groupId = vars.groupId;
      scrubbed.itemName =
        typeof vars.itemName === "string"
          ? redactItemName(vars.itemName, config)
          : redactUnknown(vars.itemName);
      scrubbed.columnValues =
        typeof vars.columnValues === "string"
          ? redactColumnValues(vars.columnValues, config)
          : redactUnknown(vars.columnValues);
      return { ...operation, variables: scrubbed };

    case "create_update":
      /* A Monday item id is a record locator, not personal data, and contract §8
         wants it in the trail. In dry run it is the literal placeholder. */
      scrubbed.itemId = vars.itemId;
      scrubbed.body =
        typeof vars.body === "string" ? redactUpdateBody(vars.body) : redactUnknown(vars.body);
      return { ...operation, variables: scrubbed };

    default:
      return { ...operation, variables: scrubbed };
  }
}

/**
 * Write the dry-run transcript: the shape in full, the values redacted unless
 * `INTAKE_LOG_VERBOSE` is explicitly on.
 */
function logPlannedOperations(
  operations: readonly MondayOperation[],
  config: MondayConfig,
  submissionId: string,
): void {
  const verbose = isLogVerbose();
  if (verbose) {
    console.warn(
      `[contact-intake] INTAKE_LOG_VERBOSE is ON — submission values are being written to the runtime log in clear text. Turn it off when this debugging session ends. submission=${submissionId}`,
    );
  }
  for (const operation of operations) {
    const logged = verbose ? operation : redactOperation(operation, config);
    console.info(
      `[contact-intake] DRY RUN ${logged.name}\n${logged.query}\nvariables: ${JSON.stringify(logged.variables, null, 2)}`,
    );
  }
}


/* -------------------------------------------------------------------------- */
/*  Transport                                                                  */
/* -------------------------------------------------------------------------- */

export type GraphqlResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: string };

/**
 * One GraphQL round trip.
 *
 * Never throws and never surfaces the token: a thrown fetch error's `message`
 * can quote the request, so only `error.name` is read (the same discipline
 * `app/api/ticker-data/route.ts` uses for `FRED_API_KEY`). Monday answers 200
 * with an `errors` array for a rejected query, so the body is inspected, not
 * just the status.
 */
export async function mondayGraphql<T>(
  operation: MondayOperation,
  config: MondayConfig,
  fetcher: Fetcher,
): Promise<GraphqlResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MONDAY_TIMEOUT_MS);

  try {
    const response = await fetcher(MONDAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: config.token,
        "API-Version": config.apiVersion,
      },
      body: JSON.stringify({ query: operation.query, variables: operation.variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, reason: `${operation.name}: HTTP ${response.status}` };
    }

    const payload: unknown = await response.json();
    if (typeof payload !== "object" || payload === null) {
      return { ok: false, reason: `${operation.name}: non-object response` };
    }

    const body = payload as { data?: unknown; errors?: unknown; error_message?: unknown };
    if (Array.isArray(body.errors) && body.errors.length > 0) {
      const first = body.errors[0] as { message?: unknown };
      const message = typeof first?.message === "string" ? first.message : "unspecified";
      return { ok: false, reason: `${operation.name}: ${message}` };
    }
    if (typeof body.error_message === "string") {
      return { ok: false, reason: `${operation.name}: ${body.error_message}` };
    }
    if (body.data === undefined || body.data === null) {
      return { ok: false, reason: `${operation.name}: empty data` };
    }

    return { ok: true, data: body.data as T };
  } catch (error) {
    const name = error instanceof Error ? error.name : "unknown";
    return { ok: false, reason: `${operation.name}: ${name}` };
  } finally {
    clearTimeout(timer);
  }
}

/* -------------------------------------------------------------------------- */
/*  Safety rails — contract §8                                                 */
/* -------------------------------------------------------------------------- */

type BoardShape = {
  id: string;
  name: string;
  workspace_id: string | number | null;
  groups: { id: string; title: string }[];
  columns: { id: string; title: string; type: string }[];
};

export type VerificationResult = { ok: true } | { ok: false; reason: string };

/**
 * First-use verification. Everything here is a refusal condition, not a warning:
 * a mis-set board id must never become a write.
 *
 * Checks, in order:
 *   • both boards exist and report `workspace_id === MONDAY_WORKSPACE_ID`
 *     (this is what stops a write landing in the Japan workspace or the retired
 *     legacy CRM workspace, which is precisely the failure the contract names);
 *   • the configured group id exists on the write board;
 *   • every mapped column id exists on the write board;
 *   • every mapped column's real type is one the map is allowed to point at.
 */
export function verifyBoards(config: MondayConfig, boards: BoardShape[]): VerificationResult {
  const byId = new Map(boards.map((board) => [String(board.id), board]));

  const allBoardIds = [config.unverifiedBoardId, config.contactsBoardId];
  if (config.buyerLeadsBoardId) allBoardIds.push(config.buyerLeadsBoardId);

  for (const boardId of allBoardIds) {
    const board = byId.get(boardId);
    if (!board) return { ok: false, reason: `board ${boardId} not found or not visible to this token` };
    if (String(board.workspace_id ?? "") !== config.workspaceId) {
      return {
        ok: false,
        reason: `board ${boardId} is in workspace ${String(board.workspace_id ?? "none")}, not the configured ${config.workspaceId}`,
      };
    }
  }

  const writeBoard = byId.get(config.unverifiedBoardId)!;

  if (!writeBoard.groups.some((group) => group.id === config.intakeGroupId)) {
    return {
      ok: false,
      reason: `group ${config.intakeGroupId} is not on board ${config.unverifiedBoardId}`,
    };
  }

  const columnTypes = new Map(writeBoard.columns.map((column) => [column.id, column.type]));

  for (const key of COLUMN_MAP_KEYS) {
    const mapped = config.columns[key];
    if (mapped === undefined) continue;
    const columnId = typeof mapped === "string" ? mapped : mapped.id;
    const actual = columnTypes.get(columnId);
    if (!actual) {
      return {
        ok: false,
        reason: `mapped column "${key}" → ${columnId} is not on board ${config.unverifiedBoardId}`,
      };
    }
    if (!ALLOWED_COLUMN_TYPES[key].includes(actual)) {
      return {
        ok: false,
        reason: `mapped column "${key}" → ${columnId} is type "${actual}"; expected one of ${ALLOWED_COLUMN_TYPES[key].join("/")}`,
      };
    }
  }

  /* The dedupe key is queried against the READ boards as well, and the column
     map's own template warns "identical ids on Contacts because the boards are
     structural clones — VERIFY, DON'T ASSUME" (contract §2). An email column id
     that is absent — or is a different column — on Contacts turns the dedupe
     search into a silent miss, and a silent miss is exactly how a verified
     contact acquires a second, unverified record (contract §3). Refuse instead:
     a refused write still reaches the team by email and alert, a duplicated
     person does not un-duplicate itself. */
  const readBoards: { id: string; label: string; keys: ColumnMapKey[] }[] = [
    {
      id: config.contactsBoardId,
      label: "Contacts",
      /* `findPhoneCollision` searches Contacts by the phone column too. */
      keys: config.columns.phone ? ["email", "phone"] : ["email"],
    },
  ];
  if (config.buyerLeadsBoardId) {
    readBoards.push({ id: config.buyerLeadsBoardId, label: "Buyer Leads", keys: ["email"] });
  }

  for (const readBoard of readBoards) {
    const board = byId.get(readBoard.id)!;
    const types = new Map(board.columns.map((column) => [column.id, column.type]));
    for (const key of readBoard.keys) {
      const mapped = config.columns[key];
      if (mapped === undefined) continue;
      const columnId = typeof mapped === "string" ? mapped : mapped.id;
      const actual = types.get(columnId);
      if (!actual) {
        return {
          ok: false,
          reason: `dedupe column "${key}" → ${columnId} is not on the ${readBoard.label} board ${readBoard.id} — the dedupe search would silently miss`,
        };
      }
      if (!ALLOWED_COLUMN_TYPES[key].includes(actual)) {
        return {
          ok: false,
          reason: `dedupe column "${key}" → ${columnId} is type "${actual}" on the ${readBoard.label} board ${readBoard.id}; expected one of ${ALLOWED_COLUMN_TYPES[key].join("/")}`,
        };
      }
    }
  }

  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/*  Dedupe — contract §3                                                       */
/* -------------------------------------------------------------------------- */

type ItemsPageData = { items_page_by_column_values: { items: { id: string; name: string }[] } };

async function searchBoard(
  boardId: string,
  columnId: string,
  value: string,
  config: MondayConfig,
  fetcher: Fetcher,
): Promise<GraphqlResult<{ id: string; name: string } | null>> {
  const result = await mondayGraphql<ItemsPageData>(
    buildDedupeQuery(boardId, columnId, value),
    config,
    fetcher,
  );
  if (!result.ok) return result;
  const items = result.data.items_page_by_column_values?.items ?? [];
  return { ok: true, data: items[0] ?? null };
}

/**
 * Search order is the contract's own precedence: **Contacts first**.
 *
 * A verified contact who fills in the website form must never produce a second
 * record in Unverified Leads, and the guide is explicit that graduating anyone
 * into Contacts is a licensed-broker move the website has no part in. Buyer
 * Leads is searched last and only when its board id is configured; it is
 * read-only either way.
 */
export async function resolveDedupe(
  submission: IntakeSubmission,
  config: MondayConfig,
  fetcher: Fetcher,
): Promise<GraphqlResult<DedupeOutcome>> {
  const emailColumn = config.columns.email!;

  const boards: { id: string; kind: Extract<DedupeOutcome, { itemId: string }>["kind"] }[] = [
    { id: config.contactsBoardId, kind: "contacts" },
    { id: config.unverifiedBoardId, kind: "unverified" },
  ];
  if (config.buyerLeadsBoardId) {
    boards.push({ id: config.buyerLeadsBoardId, kind: "buyer-leads" });
  }

  for (const board of boards) {
    const hit = await searchBoard(board.id, emailColumn, submission.email, config, fetcher);
    if (!hit.ok) return hit;
    if (hit.data) {
      return { ok: true, data: { kind: board.kind, itemId: hit.data.id, itemName: hit.data.name } };
    }
  }

  return { ok: true, data: { kind: "new" } };
}

/**
 * Same phone, different email (contract §3, last bullet).
 *
 * Runs only when the email search found nothing and a phone was supplied. A hit
 * does NOT block the create and does NOT merge anything — the guide's rule is
 * "preserve both records and flag it", so the note goes in the Update and a
 * human decides.
 */
export async function findPhoneCollision(
  submission: IntakeSubmission,
  config: MondayConfig,
  fetcher: Fetcher,
): Promise<PhoneCollision> {
  const phoneColumn = config.columns.phone;
  if (!phoneColumn || !submission.phone) return null;

  const boards: { id: string; label: string }[] = [
    { id: config.contactsBoardId, label: "Contacts" },
    { id: config.unverifiedBoardId, label: "Unverified Leads" },
  ];

  for (const board of boards) {
    const hit = await searchBoard(board.id, phoneColumn, submission.phone, config, fetcher);
    if (hit.ok && hit.data) {
      return { itemId: hit.data.id, itemName: hit.data.name, board: board.label };
    }
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Write plan                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The `MondayOutcome.reason` for a read-only board match. Matched as a prefix by
 * `deliverIntake` when it chooses the alert severity, so it is a constant rather
 * than a string typed twice.
 */
export const READ_ONLY_MATCH_REASON =
  "read-only board match: Buyer Leads is dedupe-read only (contract §1.3, §4) — no Monday write attempted";


export type MondayOutcome = {
  ok: boolean;
  /** Set on a confirmed create. */
  itemId: string | null;
  /** Set on a confirmed update — including the Update posted on an existing item. */
  updateId: string | null;
  dedupe: DedupeOutcome | null;
  reason: string | null;
  /**
   * Every operation the route built. In dry run these were built and logged (in
   * redacted form), not sent.
   *
   * CONTAINS SUBMISSION VALUES IN CLEAR TEXT — this is the plan as it would go
   * on the wire, which is the point of holding it. Never `console.log` it
   * directly: pass it through `redactOperation` first, as `logPlannedOperations`
   * does.
   */
  operations: MondayOperation[];
};

/**
 * Build the exact operations a submission would produce, without sending any of
 * them. This is what `INTAKE_DRY_RUN` logs, and it is also the single place the
 * live path gets its plan from — so the transcript an operator reviews in dry
 * run is, byte for byte, the request that goes out when the flag is turned off.
 */
export function planOperations(
  submission: IntakeSubmission,
  config: MondayConfig,
  domain: string,
  dedupe: DedupeOutcome,
  phoneCollision: PhoneCollision = null,
  dryRun = false,
): MondayOperation[] {
  /* Contract §1.3 + §4: a match on a READ-ONLY board (Buyer Leads) produces no
     Monday operation of any kind. Not an item, not a column, not an Update — an
     Update is still a write, and Buyer Leads is a curated campaign board no
     unverified web submission gets to append to. The submission leaves by the
     fallback-email path with an alert and a human routes it. This branch is
     first so that it cannot be reached past a create. */
  if (isReadOnlyDedupe(dedupe)) return [];

  const body = buildUpdateBody({ submission, domain, dedupe, phoneCollision, dryRun });

  if (dedupe.kind === "new") {
    /* The create's id is not known until it returns, so the Update operation is
       completed by `writeToMonday`. In dry run the placeholder is explicit. */
    return [
      buildCreateItemOperation(submission, config, domain),
      buildCreateUpdateOperation("<id of the item created above>", body),
    ];
  }

  /* Existing record anywhere → an Update and NOTHING else. No create, no column
     write, on any board (contract §3). */
  return [buildCreateUpdateOperation(dedupe.itemId, body)];
}

type CreateItemData = { create_item: { id: string; name: string } | null };
type CreateUpdateData = { create_update: { id: string } | null };

/**
 * The live write. Dedupe → create-or-update → Update.
 *
 * Note what is absent: there is no `change_column_values` call anywhere in this
 * file. An existing item is never modified, on any board — the only thing the
 * website can do to a record that already exists is add a comment to it.
 */
export async function writeToMonday(
  submission: IntakeSubmission,
  config: MondayConfig,
  domain: string,
  fetcher: Fetcher,
): Promise<MondayOutcome> {
  const empty: MondayOutcome = {
    ok: false,
    itemId: null,
    updateId: null,
    dedupe: null,
    reason: null,
    operations: [],
  };

  const dedupe = await resolveDedupe(submission, config, fetcher);
  if (!dedupe.ok) return { ...empty, reason: dedupe.reason };

  /* Contract §1.3 + §4 — see `isReadOnlyDedupe`. The dedupe SEARCH of Buyer
     Leads is a read and is allowed; acting on the hit is not. Return before a
     single mutation is built, with `ok: false` so `deliverIntake` routes the
     submission to the fallback email and raises the alert a human will act on.
     `ok: false` here is not a failure — it is a refusal, and the reason says so. */
  if (isReadOnlyDedupe(dedupe.data)) {
    console.info(
      `[contact-intake] monday write REFUSED (read-only board match) submission=${submission.submissionId} kind=${dedupe.data.kind} item=${dedupe.data.itemId} — nothing sent to Monday`,
    );
    return { ...empty, dedupe: dedupe.data, reason: READ_ONLY_MATCH_REASON, operations: [] };
  }

  const phoneCollision =
    dedupe.data.kind === "new" ? await findPhoneCollision(submission, config, fetcher) : null;

  const body = buildUpdateBody({
    submission,
    domain,
    dedupe: dedupe.data,
    phoneCollision,
  });

  const operations: MondayOperation[] = [];

  let itemId: string | null = null;
  if (dedupe.data.kind === "new") {
    const createOp = buildCreateItemOperation(submission, config, domain);
    operations.push(createOp);
    const created = await mondayGraphql<CreateItemData>(createOp, config, fetcher);
    if (!created.ok) {
      return { ...empty, dedupe: dedupe.data, reason: created.reason, operations };
    }
    itemId = created.data.create_item?.id ?? null;
    if (!itemId) {
      return { ...empty, dedupe: dedupe.data, reason: "create_item returned no id", operations };
    }
    /* Contract §8's reversal trail: the item id is logged the moment it exists,
       before anything else can fail. */
    console.info(
      `[contact-intake] monday create_item ok submission=${submission.submissionId} board=${config.unverifiedBoardId} item=${itemId}`,
    );
  } else {
    itemId = dedupe.data.itemId;
  }

  const updateOp = buildCreateUpdateOperation(itemId, body);
  operations.push(updateOp);
  const update = await mondayGraphql<CreateUpdateData>(updateOp, config, fetcher);

  if (!update.ok) {
    /* A created item with no Update is still a confirmed receipt — the lead is
       in the CRM. Report success, and let the alert carry the missing comment. */
    return {
      ok: dedupe.data.kind === "new" && itemId !== null,
      itemId: dedupe.data.kind === "new" ? itemId : null,
      updateId: null,
      dedupe: dedupe.data,
      reason: update.reason,
      operations,
    };
  }

  const updateId = update.data.create_update?.id ?? null;
  console.info(
    `[contact-intake] monday create_update ok submission=${submission.submissionId} item=${itemId} update=${updateId ?? "none"}`,
  );

  return {
    ok: itemId !== null || updateId !== null,
    itemId: dedupe.data.kind === "new" ? itemId : null,
    updateId,
    dedupe: dedupe.data,
    reason: null,
    operations,
  };
}

/* -------------------------------------------------------------------------- */
/*  Fallback email + alert webhooks                                            */
/* -------------------------------------------------------------------------- */

/**
 * Both webhook URLs carry the visitor's name, email, phone, comments and the
 * consent record. They are operator-set, but an operator typo must not put that
 * on the wire in clear text or point it at something that is not a web
 * endpoint, so the scheme is checked before anything is posted. Refusing is the
 * safe direction: a refused webhook is a visible failure, a plaintext one is an
 * invisible disclosure.
 */
function httpsWebhook(raw: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export type WebhookOutcome = {
  attempted: boolean;
  ok: boolean;
  reason: string | null;
};

/**
 * The fallback email. `FALLBACK_EMAIL_WEBHOOK_URL` is "a tested server-side
 * email-delivery webhook" (plan §5.1) — this posts a JSON envelope and treats a
 * 2xx as CONFIRMED DELIVERY. That is the whole contract with it, and it is why
 * the destination has to be tested before launch: a webhook that 200s without
 * sending would turn a lost lead into a green tick.
 *
 * Unset is not an error and not a success: `attempted: false`, which the caller
 * reads as "nothing confirmed receipt".
 */
export async function sendFallbackEmail(
  submission: IntakeSubmission,
  domain: string,
  body: string,
  fetcher: Fetcher,
): Promise<WebhookOutcome> {
  const configured = env("FALLBACK_EMAIL_WEBHOOK_URL");
  if (!configured) {
    return { attempted: false, ok: false, reason: "FALLBACK_EMAIL_WEBHOOK_URL is not set" };
  }
  const url = httpsWebhook(configured);
  if (!url) {
    console.error(
      "[contact-intake] FALLBACK_EMAIL_WEBHOOK_URL is not a credential-free https URL — refusing to post the submission to it",
    );
    return { attempted: false, ok: false, reason: "FALLBACK_EMAIL_WEBHOOK_URL is not https" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const response = await fetcher(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        /* `hotelName` is caller text and this string becomes an email Subject
           header downstream: a newline in it would be header injection at the
           webhook (Bcc:, Content-Type:). `singleLine` makes that impossible. */
        subject: singleLine(`${submission.submissionType} — ${submission.hotelName} (${domain})`),
        replyTo: submission.email,
        submissionId: submission.submissionId,
        text: body,
      }),
      signal: controller.signal,
    });
    return response.ok
      ? { attempted: true, ok: true, reason: null }
      : { attempted: true, ok: false, reason: `HTTP ${response.status}` };
  } catch (error) {
    return {
      attempted: true,
      ok: false,
      reason: error instanceof Error ? error.name : "unknown",
    };
  } finally {
    clearTimeout(timer);
  }
}

export type AlertSeverity =
  | "new_lead"
  | "monday_failed"
  | "config_refused"
  /** Not a failure: the website deliberately wrote nothing and a human must route it. */
  | "buyer_leads_read_only"
  | "total_failure";

/**
 * The alert. Two jobs, and the severity says which:
 *   • `new_lead` on EVERY accepted submission — `MANUAL` line 65 requires
 *     BOV-interest leads to reach the Managing Director SAME DAY, and contract
 *     §5 names this alert as the mechanism ("the intake alert makes every
 *     submission same-day visible");
 *   • the three failure severities, per contract §7.
 *
 * An alert that fails NEVER changes what the visitor sees. It is logged and the
 * submission's own outcome stands.
 */
export async function sendAlert(
  severity: AlertSeverity,
  submission: IntakeSubmission,
  summary: string,
  detail: string,
  fetcher: Fetcher,
): Promise<WebhookOutcome> {
  const configured = env("INTAKE_ALERT_WEBHOOK_URL");
  if (!configured) {
    /* Deliberately no PII in this line: an unconfigured alert must not turn the
       runtime log into the place the lead's details end up. */
    console.warn(
      `[contact-intake] alert not sent (INTAKE_ALERT_WEBHOOK_URL unset) severity=${severity} submission=${submission.submissionId}`,
    );
    return { attempted: false, ok: false, reason: "INTAKE_ALERT_WEBHOOK_URL is not set" };
  }
  const url = httpsWebhook(configured);
  if (!url) {
    console.error(
      `[contact-intake] INTAKE_ALERT_WEBHOOK_URL is not a credential-free https URL — alert not sent severity=${severity} submission=${submission.submissionId}`,
    );
    return { attempted: false, ok: false, reason: "INTAKE_ALERT_WEBHOOK_URL is not https" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ALERT_TIMEOUT_MS);

  try {
    const response = await fetcher(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        severity,
        submissionId: submission.submissionId,
        submissionType: submission.submissionType,
        receivedAtPacific: submission.receivedAtPacific,
        summary,
        text: detail,
      }),
      signal: controller.signal,
    });
    return response.ok
      ? { attempted: true, ok: true, reason: null }
      : { attempted: true, ok: false, reason: `HTTP ${response.status}` };
  } catch (error) {
    return { attempted: true, ok: false, reason: error instanceof Error ? error.name : "unknown" };
  } finally {
    clearTimeout(timer);
  }
}

/* -------------------------------------------------------------------------- */
/*  Delivery — contract §7                                                     */
/* -------------------------------------------------------------------------- */

export type DeliveryReport = {
  /** What the visitor is told. True ONLY on a confirmed receipt. */
  ok: boolean;
  mode: "dry-run" | "live";
  monday: MondayOutcome & { attempted: boolean };
  email: WebhookOutcome;
  alert: WebhookOutcome;
  /** The reference shown to the visitor: the submission id on success. */
  reference: string | null;
};

/**
 * The whole delivery decision, in one place.
 *
 *   dry run  → build + log the exact mutation, send the fallback email, write
 *              nothing. Success iff the email webhook confirms.
 *   live     → Monday first. A confirmed item or update id is success on its
 *              own. Otherwise the fallback email is tried; its confirmation is
 *              also success (contract §7: "Monday failure + email success =
 *              success (visitor) + alert (team)"). Neither confirming is a
 *              failure state on the form and a `total_failure` alert.
 *
 * There is no branch anywhere in this function that reports success without a
 * confirmed id or a confirmed 2xx from the email webhook.
 */
export async function deliverIntake(
  submission: IntakeSubmission,
  domain: string,
  fetcher: Fetcher,
): Promise<DeliveryReport> {
  const dryRun = isDryRun();
  const config = loadMondayConfig();

  const noMonday: MondayOutcome & { attempted: boolean } = {
    attempted: false,
    ok: false,
    itemId: null,
    updateId: null,
    dedupe: null,
    reason: null,
    operations: [],
  };

  /* ---- dry run: the shipping default -------------------------------------- */
  if (dryRun) {
    const dedupe: DedupeOutcome = { kind: "new" };
    let operations: MondayOperation[] = [];

    if (config.ok) {
      operations = planOperations(submission, config.value, domain, dedupe, null, true);
      /* Shape, ids and mode — every token on this line is server-minted or
         configuration. `dedupe=` is the branch enum, which is what the `Dedupe`
         line of the redacted transcript can no longer show (it quotes a matched
         record's name). */
      console.info(
        `[contact-intake] DRY RUN — ${operations.length} operation(s) built, none sent. ` +
          `submission=${submission.submissionId} board=${config.value.unverifiedBoardId} ` +
          `group=${config.value.intakeGroupId} dedupe=${dedupe.kind} ` +
          `values=${isLogVerbose() ? "VERBATIM (INTAKE_LOG_VERBOSE)" : "redacted"}`,
      );
      logPlannedOperations(operations, config.value, submission.submissionId);
    } else {
      console.info(
        `[contact-intake] DRY RUN — no Monday mutation built: ${config.reason}. submission=${submission.submissionId}`,
      );
    }

    const body = buildUpdateBody({ submission, domain, dedupe, dryRun: true });
    const email = await sendFallbackEmail(submission, domain, body, fetcher);

    const alert = await sendAlert(
      email.ok ? "new_lead" : "total_failure",
      submission,
      email.ok
        ? `DRY RUN — ${submission.submissionType} from ${submission.name} (${submission.email}); nothing written to Monday`
        : `DRY RUN — delivery FAILED for ${submission.email}: ${email.reason ?? "unknown"}`,
      body,
      fetcher,
    );

    return {
      ok: email.ok,
      mode: "dry-run",
      monday: { ...noMonday, dedupe, operations },
      email,
      alert,
      reference: email.ok ? submission.submissionId : null,
    };
  }

  /* ---- live --------------------------------------------------------------- */
  let monday: MondayOutcome & { attempted: boolean } = noMonday;

  if (!config.ok) {
    /* Contract §8: refuse the write rather than guess. The lead is not lost —
       it falls through to the email path below and the team is alerted. */
    console.error(`[contact-intake] Monday write REFUSED: ${config.reason}`);
    monday = { ...noMonday, reason: `config refused: ${config.reason}` };
  } else {
    const verification = await verifyConfiguredBoards(config.value, fetcher);
    if (!verification.ok) {
      console.error(`[contact-intake] Monday write REFUSED: ${verification.reason}`);
      monday = { ...noMonday, reason: `config refused: ${verification.reason}` };
    } else {
      const written = await writeToMonday(submission, config.value, domain, fetcher);
      monday = { ...written, attempted: true };
    }
  }

  if (monday.ok) {
    const dedupeNote = monday.dedupe
      ? monday.dedupe.kind
      : "unknown";
    const alert = await sendAlert(
      "new_lead",
      submission,
      `${submission.submissionType} from ${submission.name} (${submission.email}) — ${dedupeNote}; item ${monday.itemId ?? "existing"}`,
      buildUpdateBody({
        submission,
        domain,
        dedupe: monday.dedupe ?? { kind: "new" },
      }),
      fetcher,
    );
    return {
      ok: true,
      mode: "live",
      monday,
      email: { attempted: false, ok: false, reason: "not needed — Monday confirmed receipt" },
      alert,
      reference: submission.submissionId,
    };
  }

  const body = buildUpdateBody({
    submission,
    domain,
    dedupe: monday.dedupe ?? { kind: "new" },
  });
  const email = await sendFallbackEmail(submission, domain, body, fetcher);

  /* A read-only board match is NOT a Monday failure and must not be reported as
     one: nothing broke, the website deliberately declined to write and is
     handing the decision to a person. Calling it `monday_failed` would train the
     team to ignore the one alert that always needs a human. */
  const readOnlyMatch = monday.dedupe !== null && isReadOnlyDedupe(monday.dedupe);

  const severity: AlertSeverity = email.ok
    ? readOnlyMatch
      ? "buyer_leads_read_only"
      : monday.reason?.startsWith("config refused")
        ? "config_refused"
        : "monday_failed"
    : "total_failure";

  const summary = email.ok
    ? readOnlyMatch
      ? `${submission.submissionType} from ${submission.name} (${submission.email}) matches an existing record on the READ-ONLY Buyer Leads board — the website wrote NOTHING to Monday and delivered by fallback email. A human decides whether this belongs in Unverified Leads or on the Buyer Leads record.`
      : `Monday write did not confirm (${monday.reason ?? "unknown"}); fallback email delivered for ${submission.email}`
    : `TOTAL DELIVERY FAILURE for ${submission.email} — Monday: ${monday.reason ?? "unknown"}; email: ${email.reason ?? "unknown"}`;

  const alert = await sendAlert(severity, submission, summary, body, fetcher);

  return {
    ok: email.ok,
    mode: "live",
    monday,
    email,
    alert,
    reference: email.ok ? submission.submissionId : null,
  };
}

/* -------------------------------------------------------------------------- */
/*  First-use board verification, memoised per instance                        */
/* -------------------------------------------------------------------------- */

type BoardsData = { boards: BoardShape[] | null };

let verificationCache: { key: string; result: VerificationResult } | null = null;

/**
 * Verify once per warm instance, keyed on the configuration itself so an env
 * change on the next deploy re-verifies rather than trusting a stale pass.
 * The key deliberately excludes the token.
 */
export async function verifyConfiguredBoards(
  config: MondayConfig,
  fetcher: Fetcher,
): Promise<VerificationResult> {
  const key = JSON.stringify({
    workspaceId: config.workspaceId,
    contactsBoardId: config.contactsBoardId,
    unverifiedBoardId: config.unverifiedBoardId,
    intakeGroupId: config.intakeGroupId,
    columns: config.columns,
    apiVersion: config.apiVersion,
  });
  if (verificationCache && verificationCache.key === key) return verificationCache.result;

  const ids = [config.unverifiedBoardId, config.contactsBoardId];
  if (config.buyerLeadsBoardId) ids.push(config.buyerLeadsBoardId);

  const response = await mondayGraphql<BoardsData>(
    buildBoardVerificationQuery(ids),
    config,
    fetcher,
  );
  if (!response.ok) {
    /* A transient API failure must not be cached as a permanent refusal. */
    return { ok: false, reason: `board verification failed: ${response.reason}` };
  }

  const result = verifyBoards(config, response.data.boards ?? []);
  verificationCache = { key, result };
  return result;
}

/** Tests and long-lived dev servers need to drop the memo. */
export function resetVerificationCache(): void {
  verificationCache = null;
}
