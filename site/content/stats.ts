/**
 * content/stats.ts — the #stats band (the kwc hero `.trust-strip`, re-sited)
 * plus the three qualifying sentences the Trust Metrics proof wall renders
 * around it.
 *
 * Source: docs/port/03-deals.md §D.1 and §D.2 (verbatim extract of
 * ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html lines 857-862 for
 * the figures and line 1137 for the "12" decomposition), re-verified byte-for-
 * byte against that source on 2026-08-08. The qualifying sentences below are
 * pasted from docs/LAUNCH-IMPLEMENTATION.md Appendix B2/B3, never retyped.
 *
 * Evidence status: all three figures are `verified-current` in design-skill
 * reference 06 ("Aggregate volume $200M+", "Closed transactions 12 (11 hotel
 * assets + 1 management-co M&A)", "Total square feet 836K+"). The five CoStar
 * rows stay registered and keep rendering as BADGE ARTWORK plus the approved
 * sentences below; what is gone is the numeral that compressed them.
 *
 * -- LAUNCH 2026-08-17 -- the `3x` CoStar tile is REMOVED (R6, plan §3.3) ----
 * The fourth tile used to read `3x` / "CoStar Power Broker" / "Q3 '25 · Q1
 * '26 · Q2 '26". `V2` §3 forbids exactly that move -- "do not combine the
 * five source records into a personal award count" -- so the numeral is gone
 * and the evidence now renders only as (a) the five unmodified CoStar badges,
 * (b) `costarRecognitionCaption` / `costarPriorFirmCaption` below, and (c)
 * the public verification link. Two consequences, both handled in
 * `components/sections/StatsSection.tsx` in the same change:
 *   • that file no longer looks the row up by label. The old
 *     `stats.find(s => s.label === "CoStar Power Broker")` gated BOTH the
 *     quarterly badge strip AND the costarpowerbrokers.com link behind a row
 *     that no longer exists; the evidence field now renders unconditionally
 *     and `costarEvidenceLabel` (below) carries the micro-label string the
 *     removed row used to supply.
 *   • the tile grid steps `lg:grid-cols-4` -> `lg:grid-cols-3`.
 *
 * -- Label keys are load-bearing: DO NOT RENAME ------------------------------
 * `app/layout.tsx:130-144` composes the root metadata description with
 * `statValue("Aggregate volume")` and `statValue("Closed transactions")`, and
 * that helper THROWS when a label is missing (deliberately -- a silent
 * fallback is how stale claims survive). Renaming either key red-builds the
 * site. If the VISIBLE wording ever has to change, change the rendered
 * string, not the key (plan §3.3).
 *
 * Rendering contract:
 *   • Plain data -- these strings must reach the DOM server-side. Never compose
 *     a figure from a counter, a token, or anything that resolves in the client;
 *     the "$0 B+" JS-off failure is the anti-pattern this module exists to avoid.
 *   • `detail` is a qualifier, not decoration. The register qualifies the "12",
 *     so its detail must render wherever its value does.
 *   • `statsHedge` is not optional and is not a footnote to be summarised: it
 *     is the single most repeated directive in the source corpus and must
 *     render VERBATIM wherever the $200M+/12 figures appear together. Never
 *     compress it to "12 closed hotel sales."
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
] satisfies Stat[];

/**
 * The locked hedge (plan Appendix B2 / `V2` §3 line 49) -- renders verbatim
 * beneath the stat rail. It qualifies the $200M+ and the 12 together: the
 * experience spans CURRENT AND PRIOR AFFILIATIONS and is not presented as 12
 * hotel sales personally closed by Dino, nor as Hokuten-only production.
 * Repeated in six places across `V2` and printed on Dino's own profile card.
 */
export const statsHedge =
  "Dino Monteverde's career experience includes $200M+ in aggregate transaction volume across 12 hotel and hospitality transactions, including hotel sales, a joint-venture refinance partnership, and the sale of a hotel management company involving 40+ management contracts. This experience includes current and prior affiliations and is not presented as 12 hotel sales personally closed by Dino or as Hokuten-only production.";

/**
 * Caption for the four INDIVIDUAL CoStar badges (plan Appendix B3 / `V2` §2
 * bullet 2). The DATED wording is the approved form -- each win is named with
 * its own period. The forbidden alternatives (a compressed multiplier count,
 * or an "Annual" label carrying a year no badge actually prints) are listed
 * in plan §3.14 and are deliberately not written out here: §7.3's QA grep
 * sweeps the whole of site/ for them and makes no exemption for comments.
 */
export const costarRecognitionCaption =
  "Dino Monteverde's recent CoStar Power Broker recognition includes the 2025 Annual Top Broker award and Quarterly Deals wins for Q3 2025, Q1 2026, and Q2 2026.";

/**
 * Caption for the 2025 Annual TOP FIRM graphic, which renders in its OWN
 * block after the individual strip -- never merged into it, never counted as
 * an individual award (plan Appendix B3, `V2` line 23 COMPLETE: the shorter
 * form drops the compliance-protective second clause). `KIT` line 30's
 * "presented ONLY as Hokuten TEAM recognition" is explicitly NOT used --
 * Hokuten did not exist in 2025, so that framing would be a false claim
 * (plan §3.3, X21).
 */
export const costarPriorFirmCaption =
  "The 2025 Annual Top Firm recognition is attributed separately to the prior firm/team — never counted as an individual award.";

/**
 * Micro-label above the individual badge strip. This is the label string the
 * removed `3x` row used to supply to `StatsSection`'s evidence field -- kept
 * here so the section keeps its existing, already-verified wayfinding word
 * instead of an invented one.
 */
export const costarEvidenceLabel = "CoStar Power Broker";
