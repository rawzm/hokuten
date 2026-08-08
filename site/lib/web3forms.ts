/**
 * lib/web3forms.ts — the single typed path from any Hokuten form to Web3Forms.
 *
 * Ported from ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html
 * (BOV submit handler :2212-2266, calculator email-capture handler :1949-2025)
 * via docs/port/05-forms-and-ticker.md §A.3, §A.6, §A.9.
 *
 * WHY THIS FILE EXISTS
 * The source had two hand-rolled submit paths against the same endpoint with two
 * different transports (BOV posted `FormData`, the calculator posted JSON) and a
 * duplicated "is the key configured" guard. Both are collapsed here so the BOV
 * form and the calculator's "Email me this estimate" capture share one payload
 * builder, one guard, and one result type.
 *
 * FIELD NAMES ARE A CONTRACT. The destination inbox parses `name`, `hotel_name`,
 * `city`, `state`, `phone`, `email`, `sms_consent`, `sms_consent_text` and
 * `consent_timestamp` by name. Renaming one silently breaks the funnel — it does
 * not error, the lead just arrives blank. Do not "tidy" these keys.
 *
 * KEY HANDLING. `NEXT_PUBLIC_WEB3FORMS_KEY` is public-class by design: it names a
 * destination inbox, it authorises nothing. It is still never hardcoded — not
 * here, not in a comment, not in an example. It is ALSO not provisioned yet
 * (site/.env.example: `blocked: a NEW Hokuten key must be provisioned — do not
 * reuse the kwc key`). Every caller must handle `configured === false` with a
 * designed, honest state plus the mailto fallback. Never fake a success.
 *
 * The FRED key has no business in this file or anywhere else client-side.
 */

import { CONTACT, SITE_NAME, siteDomain } from "@/content/site";
import { SMS_CONSENT, consentTimestamp } from "@/content/compliance";

/* -------------------------------------------------------------------------- */
/*  Endpoint + configuration                                                   */
/* -------------------------------------------------------------------------- */

/** index.html:1167 — unchanged. */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Abort a hung request rather than leaving a submit button disabled forever. */
export const WEB3FORMS_TIMEOUT_MS = 15_000;

/**
 * Read the access key.
 *
 * `process.env.NEXT_PUBLIC_WEB3FORMS_KEY` must stay a literal static member
 * expression — Next.js inlines NEXT_PUBLIC_* by textual substitution at build
 * time, so a destructure or a computed lookup resolves to `undefined` in the
 * browser. Returns `null` (never `""`) when unset so the guard is unambiguous.
 */
export function web3formsKey(): string | null {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (typeof key !== "string") return null;
  const trimmed = key.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Is submission wired up at all?
 *
 * Replaces the source's two literal sentinel checks (`key === "YOUR_WEB3FORMS_
 * ACCESS_KEY"` at :2231 and `ACCESS_KEY.indexOf("YOUR_") === 0` at :1994) with a
 * single presence test, since the Hokuten build reads an env var rather than a
 * committed placeholder.
 */
export function isWeb3FormsConfigured(): boolean {
  return web3formsKey() !== null;
}

/* -------------------------------------------------------------------------- */
/*  Envelope constants                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Subject prefixes. The separator is an em dash (U+2014) with a space on each
 * side — index.html:1270 and :1997. `siteDomain()` is the single source of truth
 * for the trailing domain (content/site.ts), so a DNS cutover changes one value.
 */
export const BOV_SUBJECT_PREFIX = "New BOV request — ";
export const VALUATION_SUBJECT_PREFIX = "Valuation lead — ";

/** index.html:1171 `Dino Monteverde Website` → team-first (docs/port/05 §A.3 VOICE). */
export const BOV_FROM_NAME = `${SITE_NAME} Website`;
/** index.html:2003 `KWC Valuation Tool` → team-first (docs/port/05 §A.9 VOICE). */
export const VALUATION_FROM_NAME = `${SITE_NAME} Valuation Tool`;

export function bovSubject(): string {
  return `${BOV_SUBJECT_PREFIX}${siteDomain()}`;
}

export function valuationSubject(): string {
  return `${VALUATION_SUBJECT_PREFIX}${siteDomain()}`;
}

/* -------------------------------------------------------------------------- */
/*  Payload types — the wire shape                                             */
/* -------------------------------------------------------------------------- */

/** Every Web3Forms submission carries these three. */
export type Web3FormsEnvelope = {
  access_key: string;
  subject: string;
  from_name: string;
};

/**
 * The BOV request as it goes on the wire.
 *
 * Optional keys are omitted rather than sent empty, mirroring `FormData`
 * semantics for an unchecked checkbox (index.html:1172, :1199): the source's
 * honeypot and consent box contribute NO key when unchecked. `phone` is the one
 * deliberate exception — index.html:2246 does `data.set("phone", …)`
 * unconditionally, so the key is always present, empty string when blank.
 */
export type BovPayload = Web3FormsEnvelope & {
  name: string;
  hotel_name: string;
  city: string;
  state: string;
  /** E.164 (`+16507206995`) or `""`. Never a national/pretty-printed string. */
  phone: string;
  email: string;
  /** Static 10DLC/TCR audit-trail string. index.html:1174. */
  sms_consent_text: string;
  /** ISO 8601 UTC, stamped on EVERY submit regardless of the box. index.html:2241. */
  consent_timestamp: string;
  /** Present only when the SMS box is ticked. index.html:1199. */
  sms_consent?: string;
  /** Honeypot. Present only when a bot ticked it; Web3Forms rejects server-side. */
  botcheck?: string;
};

/**
 * The calculator's "Email me this estimate" lead. index.html:1998-2016.
 * The estimate fields are open-ended by design — the calculator owns their names
 * and this module must not constrain them — but they are all flat strings.
 */
export type ValuationLeadPayload = Web3FormsEnvelope & {
  email: string;
} & Record<string, string>;

/** Anything this module knows how to post. */
export type Web3FormsPayload = BovPayload | ValuationLeadPayload;

/* -------------------------------------------------------------------------- */
/*  Payload builders                                                           */
/* -------------------------------------------------------------------------- */

/** Caller-side shape for a BOV request — domain values, not wire keys. */
export type BovRequestInput = {
  name: string;
  hotelName: string;
  /** City name only, e.g. `Albany`. */
  city: string;
  /** Full state name, e.g. `New York`. */
  state: string;
  /** E.164 or `""`. Normalise BEFORE calling — this module does not parse phones. */
  phone: string;
  email: string;
  /** Ticked state of the SMS box. Optional, unchecked by default (TCPA rule R3). */
  smsConsent: boolean;
  /** Ticked state of the honeypot. `true` means a bot filled a hidden field. */
  botcheck: boolean;
};

/**
 * Build the BOV payload. Trims user input, stamps the consent timestamp, and
 * attaches the frozen consent strings from content/compliance.ts — nothing here
 * retypes a legal string.
 *
 * @param accessKey resolved by the caller via `web3formsKey()`, so the guard and
 *   the designed unconfigured state stay in the component that renders them.
 */
export function buildBovPayload(input: BovRequestInput, accessKey: string): BovPayload {
  const payload: BovPayload = {
    access_key: accessKey,
    subject: bovSubject(),
    from_name: BOV_FROM_NAME,
    name: input.name.trim(),
    hotel_name: input.hotelName.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    [SMS_CONSENT.hiddenFields.consentText]: SMS_CONSENT.consentText,
    [SMS_CONSENT.hiddenFields.timestamp]: consentTimestamp(),
  };

  if (input.smsConsent) {
    payload[SMS_CONSENT.checkboxField] = SMS_CONSENT.checkboxValue;
  }
  if (input.botcheck) {
    payload.botcheck = "on";
  }

  return payload;
}

/**
 * Build the calculator lead payload. `fields` is the estimate snapshot the
 * calculator assembles (property_type, keys, market, estimated_range, …) — it is
 * passed through verbatim so the calculator owns its own field names.
 */
export function buildValuationLeadPayload(
  input: { email: string; fields: Readonly<Record<string, string>> },
  accessKey: string,
): ValuationLeadPayload {
  return {
    ...input.fields,
    access_key: accessKey,
    subject: valuationSubject(),
    from_name: VALUATION_FROM_NAME,
    email: input.email.trim(),
  };
}

/* -------------------------------------------------------------------------- */
/*  Submit                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Discriminated result. The three failure reasons map 1:1 onto the source's
 * three failure branches (index.html:2256 `success:false`, :2262 network throw,
 * :2231 key not configured) so callers can render the exact ported copy.
 */
export type Web3FormsResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "rejected" | "network" };

/**
 * POST a payload to Web3Forms.
 *
 * Transport note (logged decision): the source posted the BOV form as
 * `FormData` (:2248) and the calculator lead as JSON (:2019). Both paths are
 * JSON here. Web3Forms treats the two identically and the source already proved
 * the JSON path against this same endpoint and inbox, so the received email is
 * unchanged — only the encoding is. This is what lets both forms share one
 * typed builder.
 *
 * Never throws: a network failure, a timeout, and a non-JSON response all
 * resolve to `{ ok: false, reason: "network" }`.
 */
export async function submitWeb3Forms(payload: Web3FormsPayload): Promise<Web3FormsResult> {
  if (!payload.access_key) return { ok: false, reason: "unconfigured" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEB3FORMS_TIMEOUT_MS);

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data: unknown = await response.json();
    const success =
      typeof data === "object" && data !== null && (data as { success?: unknown }).success === true;
    return success ? { ok: true } : { ok: false, reason: "rejected" };
  } catch {
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
}

/* -------------------------------------------------------------------------- */
/*  Mailto fallback                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The honest degradation path while `NEXT_PUBLIC_WEB3FORMS_KEY` is unprovisioned,
 * and the recovery path after a failed send. Carries the SAME information the
 * POST would have carried, so the visitor never has to retype anything.
 *
 * The SMS consent line is included only when the visitor ticked the box —
 * an email cannot be a consent record for a box that was never ticked.
 */
export function bovMailtoHref(input: Partial<BovRequestInput> = {}): string {
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    const v = value?.trim();
    if (v) lines.push(`${label}: ${v}`);
  };

  add("Name", input.name);
  add("Hotel", input.hotelName);
  const place = [input.city?.trim(), input.state?.trim()].filter(Boolean).join(", ");
  add("City, State", place);
  add("Phone", input.phone);
  add("Email", input.email);
  if (input.smsConsent) {
    lines.push(`SMS consent: ${SMS_CONSENT.checkboxValue}`);
    lines.push(`Consent recorded: ${consentTimestamp()}`);
  }

  lines.push("");
  lines.push("Available property data (T-12, STR report, franchise / PIP):");

  const subject = bovSubject();
  const body = lines.join("\n");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
