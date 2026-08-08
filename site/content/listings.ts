/**
 * Active listings — static Phase 1 seed.
 *
 * SOURCE
 *   docs/port/03-deals.md §B.3 (`CREXI_LINKS`, verbatim from the kwc source
 *   index.html:1771–1780), §B.4 (link-resolution logic, index.html:1830–1840)
 *   and §B.6 (the port pack's own resolved `Listing[]` table).
 *   Cross-checked against .agents/skills/hokuten-design-director/references/
 *   06-content-and-proof.md → "Seed content sources" (listings line) and
 *   §04-page-anatomy.md `#listings` (empty-state copy).
 *
 * EVIDENCE STATUS
 *   `verified-current` for the five display names and the five Crexi URLs —
 *   both are committed data in the kwc source, byte-verified against
 *   index.html:1775–1779. Nothing else about these properties exists in the
 *   source repo.
 *
 *   The old site hardcoded ZERO listing attributes: service level, key count,
 *   price, cap rate and photo all arrived at runtime from the a100arms public
 *   feed (docs/port/03-deals.md §B, "Critical finding for the builder"). They
 *   are therefore omitted here rather than invented — `price` undefined renders
 *   PRICE_ON_REQUEST ("Price on Request"), and an absent `displayCapRate`
 *   renders no cap chip. Phase 2 swaps this array for the feed with an
 *   identical card contract.
 *
 *   `city` is only populated where the source itself supplies it (the trailing
 *   comments on the CREXI_LINKS map) or where ref 06 does. Two Pennsylvania
 *   listings carry no city in either document; they ship state-only rather than
 *   with a guessed municipality.
 *
 * PHOTOS
 *   The source repo contains closing photos only — there is no photograph of
 *   any of these five properties. Reusing a closing photo would misrepresent
 *   the asset, so every card points at the designed placeholder written
 *   alongside this file: site/public/art/listing-placeholder.svg.
 */

import type { Listing } from "@/lib/types";

/**
 * Public listing cards may only ever link to Crexi.
 *
 * Ported verbatim from the kwc renderer's guard (index.html:1836–1837) — the
 * mechanism that stops a public card resolving to the private a100 Arms host.
 * The renderer must call this before emitting an anchor; a URL that fails is
 * dropped, never rewritten.
 */
const CREXI_URL_PATTERN = /^https:\/\/(www\.)?crexi\.com\//i;

export function isTrustedCrexiUrl(url: string): boolean {
  return CREXI_URL_PATTERN.test(url);
}

/** ref 04 §#listings — rendered when `listings` is empty. */
export const listingsEmptyState: string =
  "No public listings right now — request off-market access";

export const listings = [
  {
    // Monday item id — index.html:1775
    id: "9119549004",
    name: "The Lodge at Split Rock Resort",
    // Lake Harmony per ref 06's listings line; the Crexi slug carries state only.
    city: "Lake Harmony",
    stateCode: "PA",
    status: "listed",
    crexiUrl:
      "https://www.crexi.com/properties/1936508/pennsylvania-the-lodge-at-split-rock-resort",
    photo: "/art/listing-placeholder.svg",
    photoAlt:
      "The Lodge at Split Rock Resort, Lake Harmony, Pennsylvania — photograph on request",
  },
  {
    // Monday item id — index.html:1776
    id: "10846884635",
    name: "Pocono Mountain Hotel and Spa",
    // No city in the source or in ref 06 — the slug gives Pennsylvania only.
    // Ships state-only rather than with an invented municipality.
    city: "",
    stateCode: "PA",
    status: "listed",
    crexiUrl:
      "https://www.crexi.com/properties/2301818/pennsylvania-pocono-mountain-hotel-and-spa",
    photo: "/art/listing-placeholder.svg",
    photoAlt:
      "Pocono Mountain Hotel and Spa, Pennsylvania — photograph on request",
  },
  {
    // Monday item id — index.html:1777. Source comment: "Developer Inn Highway (Kissimmee)".
    id: "9105456786",
    name: "Developer Inn Highway",
    city: "Kissimmee",
    stateCode: "FL",
    brand: "Howard Johnson by Wyndham",
    status: "listed",
    crexiUrl:
      "https://www.crexi.com/properties/2320085/florida-developer-inn-highway-a-howard-johnson-by-wyndham",
    photo: "/art/listing-placeholder.svg",
    photoAlt:
      "Developer Inn Highway, a Howard Johnson by Wyndham, Kissimmee, Florida — photograph on request",
  },
  {
    // Monday item id — index.html:1778
    id: "9105456863",
    name: "Developer Inn Downtown Orlando",
    city: "Orlando",
    stateCode: "FL",
    brand: "Baymont by Wyndham",
    status: "listed",
    crexiUrl:
      "https://www.crexi.com/properties/2348822/florida-developer-inn-downtown-orlando-a-baymont-by-wyndham",
    photo: "/art/listing-placeholder.svg",
    photoAlt:
      "Developer Inn Downtown Orlando, a Baymont by Wyndham, Orlando, Florida — photograph on request",
  },
  {
    // Monday item id — index.html:1779
    id: "9105456898",
    name: "Baymont Jacksonville Airport",
    city: "Jacksonville",
    stateCode: "FL",
    brand: "Baymont by Wyndham",
    status: "listed",
    crexiUrl:
      "https://www.crexi.com/properties/1995485/florida-baymont-by-wyndham-jacksonville-airport",
    photo: "/art/listing-placeholder.svg",
    photoAlt:
      "Baymont by Wyndham Jacksonville Airport, Jacksonville, Florida — photograph on request",
  },
] satisfies Listing[];
