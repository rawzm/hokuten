/**
 * content/brands.ts — the #brands franchise-flag marquee.
 *
 * Source: design-skill reference 04 `#brands` (marquee spec + scale order),
 * reference 01 "Motif system" (third-party-mark rules), reference 06 (the
 * coverage claim + the trademark microcopy), PHASE-1-EXECUTION §4.3 and §8.4.
 *
 * Evidence status: `verified-current` AS A COVERAGE CLAIM. Ref 06's register
 * row reads — "Marriott, IHG, Radisson, Choice, Wyndham evidenced in closed
 * deals/listings; Hilton, Hyatt, Best Western, Sonesta et al. included as
 * market-coverage statement (decision 2026-08-07) … label must say 'flags we
 * transact across', never 'partners' or 'clients'." Nothing here asserts a
 * relationship with any franchisor.
 *
 * ─── WHY EVERY ENTRY IS A TEXT MARK (read before adding a `logo`) ──────────
 * No entry carries a `logo`. Phase 1 renders all nine as brand NAMES set in
 * our own typography — grayscale, uniform optical height, `--meta`-toned —
 * not as reproductions of the franchisors' logos.
 *
 * That is a deliberate, researched decision, not a missing asset:
 *   1. Seven of the nine have no usable free vector. Sonesta has no Wikimedia
 *      Commons file at all (the only Wikipedia file is `{{Non-free logo}}`).
 *      The other six carry original graphic devices — Wyndham's arc, Choice's
 *      "C" form, Radisson's circular monogram, Hilton's H-in-oval, Marriott's
 *      stylized M, Hyatt's underscore arc — so the volunteer-applied Commons
 *      "PD-textlogo" tag on those files is contestable and is not a licence
 *      determination this repo may rely on.
 *   2. Only Best Western and IHG have marks that are genuinely type-only with
 *      a well-founded tag. Two marks cannot carry a nine-item row at uniform
 *      optical height without the band reading as a partner wall that favors
 *      two franchisors — the exact effect ref 04 forbids.
 *   3. Copyright is only half the question. The marquee grayscales everything;
 *      recoloring a franchisor's mark violates essentially every hotel brand's
 *      usage guidelines regardless of copyright. Setting the NAME in our own
 *      type reproduces no mark, so that conflict does not arise, and nominative
 *      use of a word is a materially narrower ask than reproducing trade dress.
 *
 * The vector question is FLAGGED, not resolved: docs/design/LOGO-MANIFEST.md
 * records every file checked, its exact URL, its tag, and what was actually
 * verified, so Razim/counsel can flip an individual row to "ship" without
 * repeating the research. Do not add a `logo` to any entry below without a
 * dated PROJECT-MEMORY.md decision recording that clearance.
 *
 * Rendering contract (ref 04 `#brands`, ref 01 "Motif system"):
 *   • Micro-label above: BRANDS_MICRO_LABEL. Never "partners", never "clients",
 *     never "brands we work with".
 *   • TRADEMARK_MICROCOPY renders in `type.micro` beneath the marquee. It is
 *     re-exported here so the section imports one module; the canonical string
 *     lives in content/compliance.ts and must not be retyped.
 *   • Grayscale, uniform optical height (~28px desktop / 22px mobile). No
 *     colorize-on-hover, ever.
 *   • Tone: `--meta` (`#6E6862`, the measured 5.01:1 token), NOT `--meta-soft`.
 *     Ref 01 "Accessible tones" retires `#8B8680` to decorative use only, and
 *     these names are real text carrying the coverage claim — the one place a
 *     logo row would have gotten away with the softer gray, a text-mark row
 *     cannot.
 *   • Never place this band adjacent to the Hokuten lockup.
 *   • Marquee a11y: duplicated content for the translateX loop, pause on hover
 *     AND focus, static row under reduced-motion, `aria-label`ed container.
 *     The names are real text, so no content is conveyed by motion alone.
 *   • Order is ref 04's chain-scale run (economy → upper-upscale). Keep it.
 */

import type { FranchiseFlag } from "@/lib/types";
import { TRADEMARK_MICROCOPY } from "@/content/compliance";

/** Ref 04 `#brands` micro-label, verbatim. The framing IS the legal posture. */
export const BRANDS_MICRO_LABEL = "[ FLAGS WE TRANSACT ACROSS ]";

/**
 * Ref 04's scale run, economy through upper-upscale.
 *
 * `logo` / `licence` / `source` are intentionally absent on every entry — the
 * contract makes them optional precisely so a text-mark row is expressible.
 * A renderer must therefore treat a missing `logo` as the normal case and set
 * `name` in our own typography, not fall back to an empty slot.
 */
export const franchiseFlags = [
  { name: "Wyndham" },
  { name: "Choice Hotels" },
  { name: "Best Western" },
  { name: "IHG" },
  { name: "Radisson" },
  { name: "Sonesta" },
  { name: "Hilton" },
  { name: "Marriott" },
  { name: "Hyatt" },
] satisfies FranchiseFlag[];

/**
 * The closing item in the marquee row (ref 04: "+ independents note";
 * PHASE-1-EXECUTION §4.3: 'an "& independents" text mark').
 *
 * Deliberately NOT a FranchiseFlag: it is our own copy, not a third-party
 * mark, and must never pick up trademark treatment or a `logo` slot. Render it
 * as the last item in the row, in the same optical size and `--meta` tone as
 * the names, so the band reads as coverage rather than a closed roster.
 */
export const INDEPENDENTS_MARK = "& independents";

/**
 * Byte-identical to content/compliance.ts. Re-exported so #brands has a single
 * import; compliance.ts remains the canonical owner of the string.
 */
export { TRADEMARK_MICROCOPY };
