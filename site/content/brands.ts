/**
 * content/brands.ts — the #brands franchise-flag marquee.
 *
 * Source: design-skill reference 04 `#brands` (marquee spec + scale order),
 * reference 01 "Motif system" (third-party-mark rules), reference 06 (the
 * coverage claim + the trademark microcopy), PHASE-1-EXECUTION §4.3 and §8.4,
 * docs/DESIGN-REVISIT.md §2 D2 and §3.7 (2026-08-08, the supersession below).
 *
 * Evidence status: `verified-current` AS A COVERAGE CLAIM. Ref 06's register
 * row reads — "Marriott, IHG, Radisson, Choice, Wyndham evidenced in closed
 * deals/listings; Hilton, Hyatt, Best Western, Sonesta et al. included as
 * market-coverage statement … label must say 'flags we transact across',
 * never 'partners' or 'clients'." Widened 2026-08-08 (D2) to "economy through
 * upper-upscale/luxury" — the shipped 16-chip set now includes luxury flags
 * (Four Seasons, Auberge) the original wording didn't anticipate. Nothing
 * here asserts a relationship with any franchisor.
 *
 * ═══ 2026-08-08 — D2 SUPERSEDES THE TEXT-MARK DECISION BELOW ═══════════════
 * Razim supplied 16 real chips (3D glass-squircle renderings, `Ref/hotel-
 * brands/`, prep spec in docs/DESIGN-REVISIT.md §3.7) on 2026-08-08. Fifteen
 * are shipped below; the sixteenth carries no identifiable brand name (see
 * "THE 16TH CHIP" below) and is held out. This is a deliberate, informed
 * supersession, not an accident: every entry below now carries a `slug`
 * pointing at Razim's OWN rendering — his 3D interpretation of each mark, not
 * a reproduction pulled from Wikimedia or any third-party source. That is a
 * materially different posture than the one the 2026-08-07 research (kept
 * below, unedited, for the reasoning it still supplies) evaluated: the
 * copyright/licence question that research chased was specifically about
 * REPRODUCING a franchisor's own file. Rendering our own interpretation of a
 * mark for nominative, non-commercial-affiliation identification is a
 * narrower and different question — the copyright analysis below doesn't
 * transfer to it, and neither does its "text mark only" conclusion.
 * **What does NOT change**: the counsel flag. AI-rendered approximations of
 * trademarked marks carry their own clearance question (trade dress /
 * likelihood-of-confusion, not the PD-textlogo copyright question below) —
 * still open, still internal-only until the launch gate. Razim accepts that
 * interim posture for now (docs/design/LOGO-MANIFEST.md records it per row).
 * A dated PROJECT-MEMORY.md entry records this decision; see that log for the
 * date-stamped source of the supersession itself.
 *
 * ─── THE 2026-08-07 TEXT-MARK RESEARCH (superseded above, kept for context) ─
 * The original nine-flag roster shipped with NO `logo`: every name rendered
 * in our own typography, because the free-vector research below found the
 * available Wikimedia Commons files unusable:
 *   1. Seven of the (then) nine had no usable free vector. Sonesta had no
 *      Wikimedia Commons file at all (the only Wikipedia file was
 *      `{{Non-free logo}}`). The other six carried original graphic devices
 *      — Wyndham's arc, Choice's "C" form, Radisson's circular monogram,
 *      Hilton's H-in-oval, Marriott's stylized M, Hyatt's underscore arc —
 *      so the volunteer-applied Commons "PD-textlogo" tag on those files was
 *      contestable and not a licence determination this repo could rely on.
 *   2. Only Best Western and IHG had marks that were genuinely type-only
 *      with a well-founded tag — too few to carry a uniform-height row
 *      without reading as a partner wall favoring two franchisors.
 *   3. The marquee then grayscaled everything; recoloring a franchisor's
 *      sourced mark would have violated brand usage guidelines regardless of
 *      copyright. Setting the NAME in our own type sidestepped that.
 * Full per-mark evidence: docs/design/LOGO-MANIFEST.md (unchanged rows, plus
 * a dated header note recording this supersession).
 *
 * ─── THE 16TH CHIP — UNIDENTIFIED, HELD OUT ─────────────────────────────────
 * `Ref/hotel-brands/ChatGPT Image Aug 8, 2026, 03_44_42 PM.png` is a glossy
 * amber/orange squircle with an abstract two-quarter-circle device and NO
 * legible brand name or wordmark — it cannot be identified from the image
 * alone. It is prepared as `_hold-amber-mark` (not shipped as a numbered
 * flag) pending Razim naming it. See docs/design/LOGO-MANIFEST.md.
 *
 * ─── MISSING: RADISSON, CHOICE HOTELS ───────────────────────────────────────
 * Both are evidenced in closed deals (ref 06) but have no chip asset in this
 * delivery. Tracked in code as `FLAGS_AWAITING_CHIP` below, NOT in
 * `franchiseFlags` — they must not render (there is nothing to render). Do
 * not fall back to a text-only entry for either; that would silently
 * reintroduce the two-tier "some chips, some text" look D2 exists to retire.
 *
 * Rendering contract (ref 04 `#brands`, ref 01 "Motif system"; updated 2026-
 * 08-08 for D2 — supersedes the grayscale/28px rule below it):
 *   • Micro-label above: BRANDS_MICRO_LABEL. Never "partners", never "clients",
 *     never "brands we work with".
 *   • TRADEMARK_MICROCOPY renders beneath the marquee — re-exported here so
 *     the section imports one module; content/compliance.ts remains the
 *     canonical, byte-exact owner. NEW (D2): renders as ONE LINE, `text-micro`
 *     at reduced emphasis, with a leading asterisk — UI chrome the rendering
 *     component prepends, not a change to the frozen string itself. No longer
 *     a paragraph block.
 *   • Chips render at uniform optical height, IN COLOUR: ~44–52px desktop,
 *     ~36px mobile (dimensional 3D renderings carry more presence than flat
 *     marks, hence larger than the old 28px/22px text-mark rule). Build the
 *     `src` as `` `/logos/${flag.slug}.png` `` (an AVIF sibling may also
 *     exist per DESIGN-REVISIT §3.7 — prefer it via `<picture>` if present).
 *   • NO colorize-on-hover — the old grayscale→colour hover treatment is
 *     retired for this row because the chips are ALREADY in colour at rest.
 *   • Never place this band adjacent to the Hokuten lockup.
 *   • Marquee a11y: duplicated content for the translateX loop, pause on hover
 *     AND focus, static row under reduced-motion, `aria-label`ed container.
 *     Each chip's accessible name is still `flag.name` as real text (`alt` on
 *     the image or a visually-hidden label) — no content is conveyed by the
 *     rendering alone.
 *   • Order is economy → upper-upscale/luxury (see `franchiseFlags` below).
 *     Keep it — the order itself is what reads as "deliberate coverage span"
 *     rather than a random pile.
 */

import type { FranchiseFlag } from "@/lib/types";
import { TRADEMARK_MICROCOPY } from "@/content/compliance";

/** Ref 04 `#brands` micro-label, verbatim. The framing IS the legal posture. */
export const BRANDS_MICRO_LABEL = "[ FLAGS WE TRANSACT ACROSS ]";

/**
 * Local widening of the shared `FranchiseFlag` contract (lib/types.ts) to add
 * `slug`. lib/types.ts is NOT this file's to edit — it belongs to another
 * agent this round. The exact change to request there, if `slug` should
 * become a first-class part of the shared contract: add `slug?: string;`
 * beside `logo?: string;` on `FranchiseFlag`, with the same "vector path
 * under /public/logos/" comment updated to describe the `<slug>.png` chip
 * convention. Until that lands, `BrandFlag` widens locally via intersection
 * — every entry below still structurally satisfies `FranchiseFlag`.
 */
export type BrandFlag = FranchiseFlag & {
  /** Matches `site/public/logos/<slug>.png` (the rendered 3D chip). */
  slug: string;
};

/**
 * The 15 shipped chips, economy → upper-upscale/luxury. `slug` is the only
 * field populated per entry — `logo`/`licence`/`source` stay unset (D2's
 * chips are Razim's own renderings, not sourced third-party vectors, so the
 * old sourced-asset provenance fields don't apply; provenance instead lives
 * per-row in docs/design/LOGO-MANIFEST.md).
 */
export const franchiseFlags = [
  { name: "G6 Hospitality", slug: "g6-hospitality" },
  { name: "Extended Stay America", slug: "extended-stay-america" },
  { name: "Best Western", slug: "best-western" },
  { name: "Wyndham", slug: "wyndham" },
  { name: "IHG", slug: "ihg" },
  { name: "Sonesta", slug: "sonesta" },
  { name: "Aloft Hotels", slug: "aloft" },
  { name: "Hilton", slug: "hilton" },
  { name: "Marriott", slug: "marriott" },
  { name: "Hyatt", slug: "hyatt" },
  { name: "Omni Hotels", slug: "omni" },
  { name: "Loews Hotels & Resorts", slug: "loews" },
  { name: "Accor", slug: "accor" },
  { name: "Auberge Resorts Collection", slug: "auberge" },
  { name: "Four Seasons", slug: "four-seasons" },
] satisfies BrandFlag[];

/**
 * Evidenced in closed deals (ref 06) but NO chip asset delivered 2026-08-08.
 * Requested from Razim; tracked here so the gap lives in code, not just a
 * conversation. Deliberately NOT part of `franchiseFlags` — a renderer must
 * never fall back to a text-only entry for one of these; that would silently
 * reintroduce the two-tier look D2 retires. They render nowhere until a
 * `slug` exists and each gets its own `docs/design/LOGO-MANIFEST.md` row.
 */
export const FLAGS_AWAITING_CHIP = [
  { name: "Radisson" },
  { name: "Choice Hotels" },
] satisfies FranchiseFlag[];

/**
 * The closing item in the marquee row (ref 04: "+ independents note";
 * PHASE-1-EXECUTION §4.3: 'an "& independents" text mark').
 *
 * Deliberately NOT a FranchiseFlag/BrandFlag: it is our own copy, not a
 * third-party mark, and must never pick up trademark or chip-image treatment.
 * Render it as the last item in the row, in text, at the same optical height
 * as the chips, so the band reads as coverage rather than a closed roster.
 */
export const INDEPENDENTS_MARK = "& independents";

/**
 * Byte-identical to content/compliance.ts. Re-exported so #brands has a single
 * import; compliance.ts remains the canonical owner of the string. See the
 * rendering contract above for the new (D2) one-line/asterisk treatment.
 */
export { TRADEMARK_MICROCOPY };
