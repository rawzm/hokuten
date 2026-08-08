/**
 * content/methodology.ts — the #method dark chapter: how we run a sale.
 *
 * Source: docs/port/04-copy.md §5 (kwc index.html:1090–1112), re-read
 * byte-for-byte against ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html
 * on 2026-08-08. Voice: the source section is the cleanest on the page — already
 * team-first ("How we run a sale", "You see real offers"). Step bodies are
 * tightened to the Hokuten register (numbers-first, no adjective padding) and the
 * implied actor is made explicit as "we". The framing paragraph is contractual
 * language and is carried verbatim; it contains no singular voice to convert.
 *
 * Evidence status — reference 06 verified claims register:
 *   • BOV promise (48h, conditioned on T-12 / STR / PIP receipt) — `verified-current`.
 *   • Reach stats (~400K · ~60K · 1,500 · 30K) — `verified-current` (kwc methodology).
 *   • Listing-term structure (180 days / two 90-day cycles / Days 30 and 60 /
 *     Day 90 decision) — `verified-current`, row added 2026-08-08 against
 *     kwc index.html:1095. Re-confirm against the Hokuten listing agreement at
 *     the KW / Forward Wilshire paperwork gate before public launch.
 *   • Average close 60–90 days post-LOI — `verified-current`, row added
 *     2026-08-08 against kwc index.html:1103.
 *   • Distribution across CoStar, LoopNet, and Crexi — `verified-current`, row
 *     added 2026-08-08 against kwc index.html:1100.
 *
 * Renderer notes (do not "fix" these in data):
 *   • The approximation markers on `~400K` and `~60K` are load-bearing: two of
 *     the four figures are estimates and two are assertions. Never drop a `~`,
 *     never add one.
 *   • `60–90` uses an en dash (U+2013), matching the source.
 *   • Step titles carry a literal `&` ("Listing & Marketing", "LOI &
 *     Negotiation"). These are data strings, not markup — JSX renders them as-is.
 *   • Micro-labels are the renderer's job: `[ 03 — METHOD ]` for the section,
 *     `index` for each step.
 */

import type { MethodStep, ReachStat } from "@/lib/types";

/**
 * The BOV service-level promise. The CONDITION is part of the claim: this string
 * may never be shortened to "written BOV in 48 hours". Import it — do not retype
 * it — anywhere the promise appears (#method step 01, the #bov chrome, the BOV
 * success state). Source: kwc index.html:1165 / :2253.
 */
export const bovPromise =
  "Written BOV within 48 hours of receiving the T-12, STR report, franchise / PIP information, and other material property data.";

/**
 * The 180-day / two-90-day-cycle framing paragraph that sits above the stepper.
 * Verbatim from kwc index.html:1095 — contractual timeframe language, not
 * marketing copy. Any edit is an engagement-terms change, not a copy change.
 */
export const methodFraming =
  "The listing term is 180 days, structured as two 90-day cycles. The first 90 days are the front-loaded campaign and diagnostic period, with market reads at Days 30 and 60. At Day 90, if the hotel is not under contract, the seller decides: accept a live offer, reprice and authorize a second 90-day cycle, or conclude the engagement. A qualified offer can move to LOI, diligence, and close at any time.";

export const methodSteps = [
  {
    index: "01",
    title: "BOV",
    body: `${bovPromise} Comp set, market analysis, and a pricing recommendation, delivered before the listing agreement.`,
  },
  {
    index: "02",
    title: "Listing & Marketing",
    body: "We build the confidential OM and run targeted buyer outreach. Public launch across CoStar, LoopNet, and Crexi, supported by direct database distribution and owner outreach — unless the seller's circumstances require a controlled confidential process.",
  },
  {
    index: "03",
    title: "Buyer Vetting",
    body: "We pre-qualify the capital. You see real offers from real buyers — inquiries that don't meet qualification standards never reach you.",
  },
  {
    index: "04",
    title: "LOI & Negotiation",
    body: "We negotiate price, terms, and contingencies. Best-and-final rounds when warranted, single-buyer negotiations when not. You stay focused on running the hotel.",
  },
  {
    index: "05",
    title: "Close",
    body: "We coordinate title, lender, and franchise through diligence, re-trades, and wire. Average close: 60–90 days post-LOI.",
  },
] satisfies MethodStep[];

export const reachStats = [
  {
    value: "~400K",
    label:
      "Hotel-investor reach — primarily CoStar, supplemented by Crexi distribution and direct outreach.",
  },
  {
    value: "~60K",
    label: "Hotel owners reached through direct voice outreach.",
  },
  {
    value: "1,500",
    label: "Direct hotel-owner relationships.",
  },
  {
    value: "30K",
    label: "SMS-capable contacts.",
  },
] satisfies ReachStat[];
