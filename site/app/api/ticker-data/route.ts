/**
 * GET /api/ticker-data — live U.S. rate feed for the bottom ticker.
 *
 * A 1:1 port of ~/Documents/Dino/dino-sites/kwc-dinomonteverde/api/ticker-data.js
 * (quoted whole in docs/port/05-forms-and-ticker.md §D.1) onto a Next 16 Route
 * Handler. Spec: PHASE-1-IMPLEMENTATION.md §7.
 *
 * It proxies FRED so the API key stays server-side. THIS FILE IS THE ONLY PLACE
 * ON THE SITE THAT MAY READ `FRED_API_KEY` (AGENT-BRIEF "Secrets (P0)"). The key
 * is never logged, never echoed into an error, never put in a response body, and
 * never imported anywhere else. `lib/ticker.ts` — which this shares with the
 * client — deliberately contains no env access at all.
 *
 * ─── Caching, verified against site/node_modules rather than assumed ─────────
 * Next 13/14 cached GET handlers by default; that is no longer true and the old
 * habit would have frozen these rates at build time.
 *
 *   node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md
 *     "Route Handlers are not cached by default. You can, however, opt into
 *      caching for GET methods … `export const dynamic = 'force-static'`."
 *
 * `force-static` is exactly wrong here — it would prerender one snapshot of the
 * yield curve at build time and serve it until the next deploy. But leaving the
 * segment config off is not safe either: dist/build/index.js (~line 1446) marks
 * any non-dynamic app route static when `appConfig.revalidate !== 0`, and only a
 * runtime dynamic-access bailout would rescue it. `dynamic = "force-dynamic"`
 * sets `revalidate = 0` (dist/build/utils.js ~line 703), which pins the route to
 * request time, deterministically.
 *
 * Freshness then comes from the CDN, not from Next: for a non-ISR app route,
 * dist/build/templates/app-route.js hands the Response to `sendResponse`
 * untouched (the only Cache-Control it ever overwrites is the draft-mode branch,
 * which is inside the ISR path), so the header below is what the edge sees —
 * one hour fresh, one day stale-while-revalidate, exactly as the source shipped.
 *
 * ─── Degradation ────────────────────────────────────────────────────────────
 * ALWAYS 200. Three response shapes, per the source contract, so the bar can
 * treat every failure identically: keep the dashes, say nothing to the visitor.
 */

import { NextResponse } from "next/server";
import {
  TICKER_DASH,
  TICKER_SERIES,
  formatRate,
  type TickerErrorCode,
  type TickerItem,
  type TickerResponse,
  type TickerSeriesId,
} from "@/lib/ticker";

/** Pinned to request time — see the caching note above. */
export const dynamic = "force-dynamic";

/** The key must resolve from a Node process env. Also keeps `force-*` legal. */
export const runtime = "nodejs";

const FRED_OBSERVATIONS = "https://api.stlouisfed.org/fred/series/observations";

/**
 * FRED writes `"."` for non-trading days, so a single observation is often
 * blank. The source pulls the most recent 12 descending and takes the first real
 * one — twelve covers a holiday week plus a long weekend on either side.
 */
const FRED_OBSERVATION_LIMIT = 12;

/**
 * Whole-route upstream budget. One shared signal across all five requests, so a
 * hanging FRED cannot hold the function open: worst case the route answers in
 * ~6s with dashes rather than burning the platform's invocation ceiling.
 */
const FRED_BUDGET_MS = 6_000;

/** api/ticker-data.js:65-68 — byte-exact. Edge-fresh 1h, serve stale up to 24h. */
const CACHE_FRESH = "s-maxage=3600, stale-while-revalidate=86400";

/**
 * Degraded answers are not cached. The source set no header on these paths,
 * which on Vercel meant "do not cache"; saying it explicitly stops a transient
 * FRED outage from being pinned at the edge for an hour after FRED recovers.
 */
const CACHE_DEGRADED = "no-store";

type Reading = {
  value: number | null;
  date: string | null;
};

const NO_READING: Reading = { value: null, date: null };

/**
 * An upstream non-2xx, carried as the error NAME so it survives logging.
 *
 * The message and stack of anything thrown near a `fetch` can quote the request
 * URL, and the request URL carries the API key as a query parameter. So the log
 * path below reads `.name` and nothing else, and this is how the status code
 * gets into `.name`.
 */
function upstreamError(status: number): Error {
  const error = new Error("fred_upstream");
  error.name = `HTTP_${status}`;
  return error;
}

/**
 * Latest numeric observation for one series (api/ticker-data.js:32-42).
 *
 * Every field of the FRED payload is treated as unknown: this is third-party
 * JSON, and a shape change should degrade one row to a dash, not throw.
 */
async function latest(
  seriesId: TickerSeriesId,
  apiKey: string,
  signal: AbortSignal,
): Promise<Reading> {
  const url = new URL(FRED_OBSERVATIONS);
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("sort_order", "desc");
  url.searchParams.set("limit", String(FRED_OBSERVATION_LIMIT));
  // Appended LAST on purpose. FRED ignores parameter order, but Next's dev fetch
  // logger truncates the query string to its first 16 characters
  // (dist/server/dev/log-requests.js `truncateUrl`), so a key that sorts last is
  // a key that cannot reach a terminal even if fetch logging is switched on.
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, {
    signal,
    // Next's data cache has no business holding a rate feed; the CDN header
    // above is the only caching layer this route wants.
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw upstreamError(response.status);

  const body: unknown = await response.json();
  const observations =
    typeof body === "object" && body !== null
      ? (body as { observations?: unknown }).observations
      : undefined;
  if (!Array.isArray(observations)) return NO_READING;

  for (const entry of observations) {
    if (typeof entry !== "object" || entry === null) continue;
    const { value, date } = entry as { value?: unknown; date?: unknown };
    if (typeof value !== "string" || value === "." || value === "") continue;
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) continue;
    return { value: parsed, date: typeof date === "string" ? date : null };
  }

  return NO_READING;
}

/**
 * Series id + failure class only. NEVER the error message, NEVER the stack,
 * NEVER the request — each of those can carry the key.
 */
function noteUnavailable(seriesId: TickerSeriesId, reason: unknown): void {
  const cause = reason instanceof Error ? reason.name : "unknown";
  console.warn(`[ticker] ${seriesId} unavailable (${cause})`);
}

function degraded(error: TickerErrorCode): NextResponse<TickerResponse> {
  return NextResponse.json<TickerResponse>(
    { updated: null, items: [], error },
    { headers: { "Cache-Control": CACHE_DEGRADED } },
  );
}

export async function GET(): Promise<NextResponse<TickerResponse>> {
  const apiKey = process.env.FRED_API_KEY?.trim();

  // A missing key is a configuration state, not an error. Answer 200 with the
  // shape the bar already knows how to ignore (api/ticker-data.js:46-50).
  if (!apiKey) return degraded("missing_key");

  // One deadline for the batch, not one per request.
  const signal = AbortSignal.timeout(FRED_BUDGET_MS);

  // DELIBERATE DIVERGENCE from the source's `Promise.all`, which let one bad
  // series blank the whole bar (port doc §D.1 flags this and asks for it to be
  // logged): `allSettled` returns whatever resolved, so a FRED hiccup on SOFR
  // costs one dash instead of five.
  const settled = await Promise.allSettled(
    TICKER_SERIES.map((series) => latest(series.id, apiKey, signal)),
  );

  let readings = 0;
  const items: TickerItem[] = TICKER_SERIES.map((series, index) => {
    const outcome = settled[index];
    if (outcome.status === "rejected") noteUnavailable(series.id, outcome.reason);

    const reading = outcome.status === "fulfilled" ? outcome.value : NO_READING;
    if (reading.value !== null) readings += 1;

    return {
      label: series.label,
      value: reading.value !== null ? formatRate(reading.value) : TICKER_DASH,
      date: reading.date,
    };
  });

  // Nothing came back at all — same shape the source produced when its
  // `Promise.all` rejected, so the client path is unchanged.
  if (readings === 0) return degraded("fetch_failed");

  return NextResponse.json<TickerResponse>(
    { updated: new Date().toISOString(), items },
    { headers: { "Cache-Control": CACHE_FRESH } },
  );
}
