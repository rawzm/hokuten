/**
 * app/sitemap.ts — Next 16 metadata file convention.
 *
 * Verified against `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts`
 * (next@16.3.0): default export returning `MetadataRoute.Sitemap`, an array of
 * `{ url, lastModified?, changeFrequency?, priority?, alternates?, images?, videos? }`.
 *
 * The sitemap lists the real routes even though `robots.ts` currently disallows
 * everything (`INDEXING_ENABLED === false` in lib/seo.ts). That is deliberate:
 * the moment the paperwork gate clears and the switch flips, this file is
 * already correct and no one has to remember to write it.
 *
 * Routes come from `INDEXABLE_ROUTES` in lib/seo.ts, which is built from
 * `LEGAL_ROUTES` in content/site.ts — renaming a legal route updates the footer,
 * the consent links and this sitemap together.
 *
 * The landing page is one document; its thirteen sections are in-page anchors,
 * and anchors are not sitemap entries.
 */

import type { MetadataRoute } from "next";

import {
  CONTENT_LAST_MODIFIED,
  INDEXABLE_ROUTES,
  absoluteUrl,
} from "@/lib/seo";

/**
 * `changeFrequency` and `priority` are advisory only — Google ignores both. They
 * are included because Bing and several private crawlers still read them, and
 * because they record the intended cadence: the landing page carries live
 * listings and a ticker, the legal routes change when the filings change.
 */
const ROUTE_HINTS: Record<
  string,
  { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
> = {
  "/": { changeFrequency: "weekly", priority: 1 },
  "/privacy": { changeFrequency: "yearly", priority: 0.3 },
  "/sms-terms": { changeFrequency: "yearly", priority: 0.3 },
  "/accessibility": { changeFrequency: "yearly", priority: 0.3 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => {
    const hint = ROUTE_HINTS[route];
    return {
      url: absoluteUrl(route),
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: hint?.changeFrequency ?? "monthly",
      priority: hint?.priority ?? 0.5,
    };
  });
}
