/**
 * content/closings.ts — the six closed transactions in the track record.
 *
 * Source: docs/port/03-deals.md §A.1–A.6 (verbatim extract of the kwc source
 * `#closings` grid, ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html
 * lines 872–907), re-verified byte-for-byte against that source on 2026-08-08.
 * Photo filenames re-mapped to the Hokuten asset paths under site/public/hotels/.
 *
 * Evidence status: `verified-current` — every display name, location, key count,
 * segment, metric and price below is verbatim published copy from the kwc source.
 * Registered in design-skill reference 06 under "Closings (6) — deal figures".
 *
 * Formatting notes for the renderer (do not fix these in data):
 *   • Decimal precision is intentionally inconsistent — `$50.1M` (1dp) beside
 *     `$61.49M` (2dp). Verbatim port; do not normalize (port pack §C.1).
 *   • `metrics` is the two-slot mono line ONLY; `price` is the third, gold slot.
 *     Slot semantics vary per card: Brooklyn substitutes a $/key figure for the
 *     duration metric and Rohnert Park substitutes a structure note for the
 *     LP/SP ratio. Never pad a missing slot with "—" (port pack §A.4).
 *   • "Confidential" is the proud stand-in for a withheld ratio — never a
 *     placeholder dash and never an abbreviation for "not available".
 *   • ONE DELIBERATE NORMALIZATION, declared so the "byte-for-byte" claim above
 *     stays honest: the source's Last Hotel card reads "142 rooms" where its
 *     other two counted cards read "keys" (index.html:885 vs :878, :890). The
 *     unit is typed here as `keys: 142` and renders "142 keys", because (a) the
 *     source's OWN listing renderer normalizes the same way — index.html:1810,
 *     `String(p.rooms).replace(/\brooms?\b/i, "keys")` — so "keys" is the
 *     source's settled data vocabulary, not this file's invention; (b) keys and
 *     rooms are the same quantity, and the calculator's own ⓘ copy defines it on
 *     this very page ("Keys = the total number of rentable guest rooms"); and
 *     (c) `Closing.keys` in lib/types.ts can only express one noun. This is the
 *     ONLY place the closings data departs from the source card text.
 *   • Separator is " · " (U+00B7, one space each side) per the lib/types.ts
 *     contract; join location/keys/segment/note with metaLine() from @/lib/utils.
 *   • Order is the source's own, which already leads with the largest close.
 *
 * ── LAUNCH 2026-08-17 (docs/LAUNCH-IMPLEMENTATION.md §3.4, Appendix B4) ─────
 * Two strings are ADDED below and nothing in the six records changes. §3.4 is
 * explicit on both halves of that:
 *   • `EDITS` §8.3 — "Do not renumber or thin the grid without Dino's word."
 *     All six cards stay, Renaissance Reno included (D4 default: it stays and
 *     ships as-is).
 *   • Every price, day count, LP/SP ratio, key count and role still owes a
 *     check against Claims & Coverage Register v1.1 (`V2` §2 bullet 4), and
 *     that register was never delivered (X10/D17). So the figures ship as the
 *     frozen kwc port, UNVERIFIED-AGAINST-REGISTER, and correcting a number
 *     here on any other authority is out of the question — the register is
 *     the only thing that could authorise it. Post-push item G7.
 * What is added: `dealTeamCredits` (the two cards `PROFILE` §6 ties to
 * William Betancourt) and `closingsProvenance` (the section's fine print,
 * which is what keeps six transactions closed at prior affiliations from
 * reading as closings of The Hokuten Group, which did not exist when they
 * closed). Both pasted from Appendix B4, never retyped.
 */

import type { Closing } from "@/lib/types";

export const closings = [
  {
    name: "Carte Hotel",
    location: "San Diego, CA",
    segment: "Lifestyle full-service",
    metrics: "96% LP/SP · 74 days",
    price: "$61.49M",
    photo: "/hotels/carte-san-diego.jpg",
    photoAlt:
      "The Carte Hotel's glass tower rising above downtown San Diego, with the street grid running toward the waterfront.",
    note: "JV / equity capital arranged",
  },
  {
    name: "Renaissance Reno Downtown",
    location: "Reno, NV",
    keys: 214,
    segment: "Upper-upscale",
    metrics: "91% LP/SP · 140 days",
    price: "$50.1M",
    photo: "/hotels/renaissance-reno.jpg",
    photoAlt:
      "Renaissance Reno Downtown at dusk, its riverfront terrace and restaurant lit beneath the guestroom floors.",
  },
  {
    name: "The Last Hotel",
    location: "Saint Louis, MO",
    keys: 142,
    segment: "Boutique",
    metrics: "83% LP/SP · 92 days",
    price: "$13.2M",
    photo: "/hotels/last-hotel-st-louis.jpg",
    photoAlt:
      "The Last Hotel on a downtown Saint Louis corner, its stone facade and upper cornice lit at dusk.",
  },
  {
    name: "Holiday Inn Express Brooklyn",
    location: "Sunset Park, NY",
    keys: 88,
    segment: "Select-service",
    metrics: "Confidential · $227K/key",
    price: "$20.0M",
    photo: "/hotels/hie-brooklyn.jpg",
    photoAlt:
      "The Holiday Inn Express Brooklyn entrance canopy and lit ground-floor lobby in Sunset Park.",
  },
  {
    name: "Radisson McAllen",
    location: "McAllen, TX",
    segment: "Branded full-service",
    metrics: "85% LP/SP · 10 months",
    price: "$14.0M",
    photo: "/hotels/radisson-mcallen.jpg",
    photoAlt:
      "The Radisson McAllen's blue-and-white guestroom wing and porte-cochere under a clear South Texas sky.",
  },
  {
    name: "Budget Inn & Rodeway Inn",
    location: "Rohnert Park, CA",
    segment: "Two-property portfolio",
    metrics: "Lease → Buy · 1 year",
    price: "$14.0M",
    photo: "/hotels/rohnert-park.jpg",
    photoAlt:
      "The Rodeway Inn of the two-property Rohnert Park portfolio, its porte-cochere lit at dusk beside the two-story guestroom wing.",
  },
] satisfies Closing[];

/**
 * Deal-team credit lines (`EDITS` §8.1, Appendix B4), keyed by the closing's
 * own `name` so the pairing survives any reorder of the array above. The two
 * entries are the two site case studies `PROFILE` §6 attributes to William
 * Betancourt — The Last Hotel, Saint Louis and Radisson McAllen. No other
 * card carries a credit line, and no name outside this string appears on any
 * closing: the scrub target for `#closings` is zero prior-affiliation
 * personal names in rendered copy, which the six records already meet.
 *
 * Rendered by `ClosingsSection.tsx` as a caption beneath the card rather than
 * inside it: `Ticket`'s meta slot is `line-clamp-2` with a fixed 3.2em
 * reservation, so appending the credit to `note` (the only card field this
 * agent owns a path into) would have TRUNCATED it at the two narrower
 * breakpoints. A truncated attribution is worse than none. See the build
 * report — a first-class `dealTeam` slot on `Closing`/`ClosingCard` is the
 * proper fix and belongs to whoever owns `lib/types.ts` + `components/cards/`.
 */
export const dealTeamCredits: Readonly<Record<string, string>> = {
  "The Last Hotel": "Deal team: Dino Monteverde · William Betancourt",
  "Radisson McAllen": "Deal team: Dino Monteverde · William Betancourt",
};

/**
 * Provenance fine print (`EDITS` §8.4, Appendix B4) — renders verbatim at the
 * bottom of `#closings`. Source rationale, quoted in plan §3.4: "the deals are
 * advertised as Dino's transaction experience, not as closings of The Hokuten
 * Group (which did not exist when they closed)." Never shortened, never moved
 * out of the section it qualifies.
 */
export const closingsProvenance =
  "Selected transactions completed by Dino Monteverde, 2022–2026, including transactions completed at prior affiliations.";
