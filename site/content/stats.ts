/**
 * content/stats.ts — the #stats band (the kwc hero `.trust-strip`, re-sited).
 *
 * Source: docs/port/03-deals.md §D.1 and §D.2 (verbatim extract of
 * ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html lines 857–862 for
 * the figures and line 1137 for the "12" decomposition), re-verified byte-for-
 * byte against that source on 2026-08-08.
 *
 * Evidence status: all four are `verified-current` in design-skill reference 06
 * ("Aggregate volume $200M+", "Closed transactions 12 (11 hotel assets + 1
 * management-co M&A)", "Total square feet 836K+", "CoStar Power Broker
 * Quarterly Deals Q3 2025 · Q1 2026 · Q2 2026").
 *
 * Rendering contract:
 *   • Plain data — these strings must reach the DOM server-side. Never compose
 *     a figure from a counter, a token, or anything that resolves in the client;
 *     the "$0 B+" JS-off failure is the anti-pattern this module exists to avoid.
 *   • `detail` is a qualifier, not decoration. The register qualifies both the
 *     "12" and the award, so both details must render wherever their value does.
 *   • The award value is the count; its quarters live in `detail` per the
 *     lib/types.ts contract. Give the quarters `white-space: nowrap` (or an
 *     NBSP at render time) so a narrow cell never breaks mid-date — the source
 *     used `Q3&nbsp;'25`; the data here stays plain-space so greps match.
 *   • Separator inside `detail` is " · " (U+00B7, one space each side).
 */

import type { Stat } from "@/lib/types";

export const stats = [
  {
    value: "$200M+",
    label: "Aggregate volume",
  },
  {
    value: "12",
    label: "Closed transactions",
    detail: "11 hotel-asset transactions + 1 hotel-management-company M&A",
  },
  {
    value: "836K+",
    label: "Total square feet",
  },
  {
    value: "3×",
    label: "CoStar Power Broker",
    detail: "Q3 '25 · Q1 '26 · Q2 '26",
  },
] satisfies Stat[];
