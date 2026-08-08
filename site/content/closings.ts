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
 *   • Separator is " · " (U+00B7, one space each side) per the lib/types.ts
 *     contract; join location/keys/segment/note with metaLine() from @/lib/utils.
 *   • Order is the source's own, which already leads with the largest close.
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
