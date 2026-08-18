/**
 * GET /api/public-listings — the same-origin a100 Arms listings proxy.
 *
 * Spec: docs/LAUNCH-IMPLEMENTATION.md §3.5 "Delivery mechanism" (F29, P11) and
 * the L8 render contract in §1.
 *
 * WHAT THIS ROUTE IS FOR, AND WHAT IT IS NOT.
 * L8: "`content/listings.ts` stays the rendered source of truth; `/api/public-
 * listings` is the additive same-origin proxy with a 3-ID allowlist and a
 * public-field whitelist, and a fourth record from the source feed is dropped,
 * logged, and never rendered." So this route ships with the site, is exercised
 * by tests, and changes nothing about what renders today. Wiring a section to
 * it is a separate, later decision.
 *
 * THE ONE RULE THIS FILE EXISTS TO ENFORCE (§3.5): "It fetches the a100 public
 * source SERVER-SIDE ... and prevents the broader response from reaching
 * browser storage. Never point browser code back at the a100 endpoint." The
 * upstream URL lives in the `A100_PUBLIC_SOURCE_URL` server env var, is read
 * only in `lib/a100.ts`, and is never echoed into a response body, a header or
 * a log line. The old kwc site fetched a100 straight from the browser and
 * cached the whole response in `localStorage` under `kwc_listings_v2`
 * (docs/port/03-deals.md §B.2) — this route is the replacement for exactly
 * that, so no client-side fetch, no client cache key, no a100 URL in the
 * bundle. `grep -rn "a100" site/components site/content` must never find a
 * network call.
 *
 * ALL THE LOGIC IS IN `lib/a100.ts`. This file is transport: read the env,
 * hand back a body and the right cache header. That split is what lets the
 * allowlist, the field whitelist, the URL validation and every failure path be
 * unit-tested in `lib/a100.test.ts` without a Next runtime or a network.
 */

import { NextResponse } from "next/server";

import { loadPublicListings, type PublicListingsPayload } from "@/lib/a100";

/**
 * Pinned to request time, so the env var is read per request rather than baked
 * into a build-time prerender. Verified against site/node_modules, not memory:
 * `dynamic = "force-dynamic"` sets the segment revalidate to 0
 * (next/dist/build/utils.js:703), and the route-segment-config reference
 * confirms `dynamic` is still available in Next 16 unless Cache Components is
 * enabled — site/next.config.ts does not enable it.
 *
 * This does NOT make the route uncached upstream: `lib/a100.ts` passes an
 * explicit `next: { revalidate }` on its fetch, which keeps the a100 body in
 * the Data Cache for that window (see the caching note on `loadPublicListings`
 * for the patch-fetch lines that prove it). The route stays honest per request;
 * a100 is hit at most once per revalidate window.
 */
export const dynamic = "force-dynamic";

/** Node runtime: `process.env` access plus `AbortSignal.timeout` on the fetch. */
export const runtime = "nodejs";

/**
 * ALWAYS 200 with a well-formed body — the same degradation contract as
 * `app/api/ticker-data/route.ts`. A consumer renders `content/listings.ts`
 * whatever happens here (L8), so a 5xx would buy nothing and would turn an
 * unset env var into a page-level error. Which of the eight documented states
 * produced the answer is in `payload.status`; `listings` is `[]` in every
 * non-`ok` state.
 */
export async function GET(): Promise<NextResponse<PublicListingsPayload>> {
  const { payload, cacheControl } = await loadPublicListings();

  return NextResponse.json<PublicListingsPayload>(payload, {
    headers: {
      "Cache-Control": cacheControl,
      // A JSON endpoint has no business in an index. Unconditional and
      // unrelated to the page-level noindex that P12 flips at cutover.
      "X-Robots-Tag": "noindex",
      // NO Access-Control-Allow-Origin, deliberately: with no CORS header only
      // same-origin script can read this, which is the whole point of proxying.
    },
  });
}
