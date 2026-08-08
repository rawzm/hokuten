/**
 * app/robots.ts — Next 16 metadata file convention.
 *
 * Verified against `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts`
 * (next@16.3.0): the route is a default export returning `MetadataRoute.Robots`,
 * i.e. `{ rules, sitemap?, host? }` where a rule is
 * `{ userAgent?, allow?, disallow?, crawlDelay?, other? }`.
 *
 * ---------------------------------------------------------------------------
 * THE SITE IS INTERNAL-ONLY. Every crawler is disallowed from everything.
 *
 * AGENTS.md hard guardrail: "Do not deploy publicly under the Hokuten name until
 * the KW / Forward Wilshire paperwork gate clears."
 *
 * WHAT TO CHANGE AT LAUNCH: nothing in this file. Flip `INDEXING_ENABLED` in
 * `lib/seo.ts` to `true` (after setting `SITE_DOMAIN` in `content/site.ts`) and
 * this route switches to `Allow: /` plus the `Sitemap:` line on the next build.
 * The allow-branch below is already written — read it, do not rewrite it.
 *
 * Note that `robots.txt` is a request, not an access control. It keeps compliant
 * crawlers out; it does not make the deployment private. Password protection /
 * deployment protection on the Vercel project is the actual control.
 * ---------------------------------------------------------------------------
 */

import type { MetadataRoute } from "next";

import { INDEXING_ENABLED, absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (INDEXING_ENABLED) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          // API routes carry no indexable content — /api/ticker-data is a JSON
          // proxy. Keeping it out of the index is hygiene, not secrecy.
          disallow: "/api/",
        },
      ],
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    // No `sitemap:` line while the site is disallowed — advertising a sitemap
    // for a fully-blocked host only publishes the route list.
  };
}
