/**
 * POST /api/contact-intake — the server-side BOV / contact intake.
 *
 * Replaces the browser-only Web3Forms path (plan §3.7, portion P10 / F28).
 * `HANDOFF-02` names this exact path so the edge rate-limit rule can target it.
 * Binding behaviour contract: docs/MONDAY-INTAKE-CONTRACT.md.
 *
 * ─── WHAT THIS FILE IS RESPONSIBLE FOR ──────────────────────────────────────
 * The perimeter, and nothing else. Origin, size, rate, shape, honeypot, and the
 * translation of a delivery report into an HTTP answer. The CRM rules live in
 * `lib/monday.ts`; the wire contract and validation live in `lib/intake.ts`.
 * Keeping them apart is what lets `lib/intake.test.ts` prove the dedupe branch,
 * the dry-run default and the mutation shape without an HTTP server.
 *
 * ─── SECRETS ────────────────────────────────────────────────────────────────
 * No secret is read in this file. `MONDAY_API_TOKEN` is read only inside
 * `lib/monday.ts`, which carries a module-scope guard against ever being
 * imported by a client component. Nothing on this path is a `NEXT_PUBLIC_*`
 * variable, so nothing here can be inlined into the browser bundle.
 *
 * ─── NEVER FAKE A SUCCESS ───────────────────────────────────────────────────
 * The visitor is told "sent" only when Monday returned an item/update id or the
 * fallback email webhook returned 2xx (contract §7). Every other outcome is a
 * 502 and a designed failure state on the form, with the `mailto:` recovery
 * beside it. Today, with `INTAKE_DRY_RUN` on by default and no column map, that
 * means the FALLBACK EMAIL WEBHOOK IS THE ONLY THING THAT CAN CONFIRM RECEIPT —
 * until `FALLBACK_EMAIL_WEBHOOK_URL` is provisioned the form answers honestly
 * that it could not deliver, and the visitor is handed the mailto instead.
 *
 * ─── CACHING, verified against site/node_modules ────────────────────────────
 *   node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md
 *     "Route Handlers are not cached by default. You can, however, opt into
 *      caching for GET methods … Other supported HTTP methods are **not**
 *      cached."
 * A POST handler is therefore never cached. `dynamic`/`runtime` are still set
 * explicitly: `force-dynamic` pins the segment to request time, and `nodejs`
 * guarantees a `process.env` the Monday token can be read from.
 */

import { NextResponse } from "next/server";

import { siteDomain } from "@/content/site";
import {
  FixedWindowLimiter,
  INTAKE_ERRORS,
  MAX_PAYLOAD_BYTES,
  buildSubmission,
  clientKey,
  isHoneypotTripped,
  isOriginAllowed,
  newSubmissionId,
  parseAllowedOrigins,
  validateIntake,
  type IntakeResponse,
} from "@/lib/intake";
import { deliverIntake } from "@/lib/monday";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * In-function backstop only (plan §3.7, contract §8). Serverless instances do
 * not share memory, so N warm instances allow N× this budget and a cold start
 * resets it. The REAL control is the edge / Vercel-Firewall rule on this path;
 * this exists so one warm instance cannot be hammered and so the route degrades
 * honestly if that rule is ever removed. Five in ten minutes is far above any
 * genuine use (a person sends one BOV request) and far below a useful flood.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const limiter = new FixedWindowLimiter(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);

function json(body: IntakeResponse, status: number): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      /* Nothing here is meant to be embedded or framed by anyone. */
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function fail(
  error: Exclude<IntakeResponse, { ok: true }>["error"],
  message: string,
  status: number,
  fields?: Record<string, string>,
): NextResponse {
  return json(fields ? { ok: false, error, message, fields } : { ok: false, error, message }, status);
}

export async function POST(request: Request): Promise<NextResponse> {
  /* 1 — Origin. Contract §8. With ALLOWED_ORIGINS set the header must be on the
     list; with it unset the fallback is strict same-origin, never "any". */
  const allowList = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);
  if (!isOriginAllowed(request.headers.get("origin"), allowList, request.headers.get("host"))) {
    return fail("origin", "This request did not come from an allowed origin.", 403);
  }

  /* 2 — Declared size, before anything is read. */
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_PAYLOAD_BYTES) {
    return fail("payload_too_large", "That submission is too large.", 413);
  }

  /* 3 — Rate. Keyed on the forwarded client IP; `unknown` shares one bucket,
     which is the conservative direction. */
  if (!limiter.take(clientKey(request.headers))) {
    return fail("rate_limited", "Too many submissions from this address. Try again shortly.", 429);
  }

  /* 4 — Body. `content-length` is a claim, so the real byte length is checked
     too before the string is parsed. */
  let raw: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_PAYLOAD_BYTES) {
      return fail("payload_too_large", "That submission is too large.", 413);
    }
    raw = JSON.parse(text);
  } catch {
    return fail("bad_request", INTAKE_ERRORS.body, 400);
  }

  /* 5 — Honeypot, BEFORE validation so a bot is classified as a bot rather than
     as a malformed human. It is answered with a plain 200 and no reference: the
     field is `display:none` and out of the tab order, so no person can reach
     this branch, and telling a bot it failed only teaches it to retry. Nothing
     is delivered and no alert is raised — alerting on bot traffic would turn
     the same-day channel into noise. */
  if (isHoneypotTripped(raw)) {
    console.info(`[contact-intake] honeypot tripped — dropped, nothing delivered`);
    return json({ ok: true, reference: null }, 200);
  }

  /* 6 — Shape. Every problem is reported at once, keyed by wire field name so
     the form can paint each one against its own control. */
  const validation = validateIntake(raw);
  if (!validation.ok) {
    return fail("validation", "Please fix the highlighted fields.", 400, validation.errors);
  }

  /* 7 — The server's own record. `submission_type`, `source`, the consent
     yes/no's disclosure text and its timestamp are all minted here; anything the
     caller sent under those names was discarded by `validateIntake`. */
  const submission = buildSubmission(validation.value, {
    submissionId: newSubmissionId(),
    receivedAt: new Date(),
    userAgent: request.headers.get("user-agent") ?? "",
  });

  /* 8 — Delivery. `deliverIntake` owns the dry-run default, the Monday write,
     the fallback email and the alert; `report.ok` is true only on a confirmed
     receipt. */
  const report = await deliverIntake(submission, siteDomain(), fetch);

  console.info(
    `[contact-intake] submission=${submission.submissionId} mode=${report.mode} ok=${report.ok} ` +
      `monday=${report.monday.attempted ? (report.monday.ok ? "ok" : `fail(${report.monday.reason ?? "unknown"})`) : "skipped"} ` +
      `email=${report.email.attempted ? (report.email.ok ? "ok" : `fail(${report.email.reason ?? "unknown"})`) : "skipped"} ` +
      `alert=${report.alert.attempted ? (report.alert.ok ? "ok" : "fail") : "skipped"}`,
  );

  if (!report.ok) {
    return fail(
      "delivery_failed",
      "We could not confirm delivery. Please email the same details instead.",
      502,
    );
  }

  return json({ ok: true, reference: report.reference }, 200);
}
