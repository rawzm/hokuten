/**
 * lib/web3forms.ts — RETIRED FOR THE BOV FORM (P10 / F28, 2026-08-17).
 *
 * ─── WHAT HAPPENED ──────────────────────────────────────────────────────────
 * `V2` §2 and `HANDOFF-02` ("Protected intake") replaced the browser-only
 * Web3Forms path with a server-side endpoint using protected credentials:
 * `POST /api/contact-intake`, governed by docs/MONDAY-INTAKE-CONTRACT.md. The
 * BOV form no longer touches this module at all — its payload builder, its
 * subject/from-name constants and its `mailto:` fallback moved to
 * `lib/intake.ts`, where the server and the client share one contract.
 *
 * ─── WHY THE FILE STILL EXISTS ──────────────────────────────────────────────
 * The calculator's "Email me this estimate" capture (index.html:1949-2025,
 * `components/calculator/Calculator.tsx`) is a SECOND, separate lead path that
 * still posts here, and `components/sections/BovSection.tsx` still reads
 * `isWeb3FormsConfigured()` for its skeleton branch. Neither file is in P10's
 * scope, so deleting this module would have broken two components this portion
 * does not own. What is left below is exactly what those two callers use and
 * nothing else.
 *
 * ─── FOLLOW-UP, NAMED ───────────────────────────────────────────────────────
 * `NEXT_PUBLIC_WEB3FORMS_KEY` is still unprovisioned (site/.env.example:
 * "blocked: a NEW Hokuten key must be provisioned"), so the calculator's email
 * capture is still disabled behind `configured === false` with its designed
 * honest state. Plan §5.3 marks the variable "retired by §3.7 — remove after
 * `/api/contact-intake` lands". It has landed. The remaining work — pointing
 * the calculator's capture at `/api/contact-intake` too (a `submission_type` of
 * its own, the same server-side consent discipline), then deleting this file,
 * the env var and the Web3Forms references on the /privacy route — belongs to
 * whoever next owns `components/calculator/`. It is recorded in the P10 report.
 *
 * KEY HANDLING is unchanged: `NEXT_PUBLIC_WEB3FORMS_KEY` is public-class by
 * design (it names a destination inbox, it authorises nothing), it is never
 * hardcoded, and every caller must handle `configured === false` with a
 * designed, honest state. Never fake a success. The FRED key and the Monday
 * token have no business in this file or anywhere else client-side.
 */

import { SITE_NAME, siteDomain } from "@/content/site";

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
 * Is the calculator's email capture wired up at all?
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
 * Subject prefix. The separator is an em dash (U+2014) with a space on each
 * side — index.html:1997. `siteDomain()` is the single source of truth for the
 * trailing domain (content/site.ts), so a DNS cutover changes one value.
 */
export const VALUATION_SUBJECT_PREFIX = "Valuation lead — ";

/** index.html:2003 `KWC Valuation Tool` → team-first (docs/port/05 §A.9 VOICE). */
export const VALUATION_FROM_NAME = `${SITE_NAME} Valuation Tool`;

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
 * The calculator's "Email me this estimate" lead. index.html:1998-2016.
 * The estimate fields are open-ended by design — the calculator owns their names
 * and this module must not constrain them — but they are all flat strings.
 */
export type ValuationLeadPayload = Web3FormsEnvelope & {
  email: string;
} & Record<string, string>;

/** Anything this module still knows how to post. */
export type Web3FormsPayload = ValuationLeadPayload;

/* -------------------------------------------------------------------------- */
/*  Payload builder                                                            */
/* -------------------------------------------------------------------------- */

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
 * Transport note (logged decision): the source posted the calculator lead as
 * JSON (:2019) and this keeps that encoding, so the received email is unchanged.
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
