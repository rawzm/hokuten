/**
 * Active listings — the three-property allowlist.
 *
 * SOURCE OF TRUTH
 *   docs/LAUNCH-IMPLEMENTATION.md §3.5 + Appendix B12 (`approved`, Razim
 *   2026-08-17), which lock decision **L8**: the active-listing allowlist is
 *   EXACTLY three properties — The Florida Gateway (Yulee, FL) · Quality
 *   Suites Houston NW Cy-Fair · Pocono Mountain Hotel & Spa. No other record
 *   may render. That supersedes the five-listing Phase 1 seed ported from the
 *   kwc source (docs/port/03-deals.md §B.3): four of those five cards are
 *   deleted here (The Lodge at Split Rock Resort, both Developer Inns,
 *   Baymont by Wyndham Jacksonville Airport) and two new mandates are added.
 *
 * RENDER CONTRACT (L8, restated so nobody re-derives it)
 *   THIS FILE is the rendered source of truth for the three cards.
 *   `app/api/public-listings/route.ts` + `lib/a100.ts` are ADDITIVE: the proxy
 *   exists to serve the same three approved records with a public-field
 *   whitelist, and a fourth record from the a100 source feed is dropped,
 *   logged server-side, and never rendered. The proxy must never become the
 *   render path — `ListingsSection` reads this array and nothing else.
 *
 * IDS — deliberately slugs, and deliberately the SAME slugs the proxy uses
 *   `lib/a100.ts` `APPROVED_LISTINGS` publishes its own slug as the public id
 *   (it never lets an upstream Monday item id reach the browser). The three
 *   `id` values below are byte-identical to those three slugs so the eventual
 *   feed swap is a data change, not a re-keying exercise. `lib/types.ts`
 *   already sanctions this ("Monday item id (feed) or slug (static seed)").
 *   Pocono's real Monday item id — `10846884635`, verbatim from the kwc
 *   `CREXI_LINKS` map — is recorded in its row's comment, not in `id`.
 *   KNOWN GAP: no source document anywhere carries a Monday item id for The
 *   Florida Gateway or Quality Suites Cy-Fair (both are new mandates), which
 *   is why `lib/a100.ts` resolves those two by normalised-name alias instead
 *   of by pinned id. Nothing here can close that gap; it closes when the a100
 *   source endpoint is reachable.
 *
 * EVIDENCE STATUS — what each field is allowed to be
 *   Every fact below comes from Appendix B12 (the plan's verbatim copy bank)
 *   or, for Pocono's Crexi URL, from the byte-verified kwc port. Nothing is
 *   inferred, rounded, or filled in from general knowledge. Where the sources
 *   are silent the field is simply ABSENT — never "N/A", never a guess:
 *     - no `displayCapRate` on any of the three (no source states a cap rate),
 *       so no cap chip renders;
 *     - Pocono carries no keys and no price (§3.5 gives it a name, an address
 *       and a Crexi id and nothing else), so its ticket renders the approved
 *       `PRICE_ON_REQUEST` fallback;
 *     - `brand` is omitted wherever the flag is already inside the display
 *       name (Quality Suites), the same no-double-statement rule the previous
 *       seed applied to the Baymont Jacksonville row.
 *   The confidential set named in §3.5 / §3.14 is absent by construction: no
 *   value range, no debt/lender/ownership fact, no net-to-seller math, no
 *   performance-deficit language, and none of the unverified anecdote.
 *
 * EXCLUSIVITY — the EXCLUSIVE badge is an unevidenced public claim on two of
 * these three rows; the claim is gated here and OPEN (P1) in `ListingCard`
 *   A `status` value in this file is NOT an internal flag. `lib/status.ts`
 *   maps BOTH `exclusive` and `listed` to the badge label "EXCLUSIVE" (the
 *   a100 feed is Listed-stage only, so a feed row's `listed` IS our exclusive
 *   mandate — PHASE-1-IMPLEMENTATION §4), and `ListingCard` renders that badge
 *   for whatever status a row carries. Setting one therefore publishes an
 *   assertion about our engagement with the owner.
 *   THE PROBLEM. While D7/D18 were being verified, BOTH new mandates were
 *   found publicly listed on LoopNet showing other brokers' contacts (The
 *   Florida Gateway via a floridamotelforsale.com broker; Quality Suites
 *   Cy-Fair via "Amit Mehta Inc"). Neither has a `verified-current` row
 *   anywhere for our exclusivity, and CLAUDE.md's evidence gate says no public
 *   claim ships without one.
 *   WHY THE DATA STILL SAYS `listed`. `listed` is the one literally true
 *   statement the vocabulary offers — all three properties ARE listed — and no
 *   other existing value is honest: `off-market` is false for a property
 *   sitting on LoopNet (and incoherent under an "on the market" header), and
 *   `in-contract` / `closed` assert a deal stage no source states. No new
 *   status label was invented. The truthful outcome is NO BADGE, and `status`
 *   cannot simply be omitted: `Listing` requires it, and `ListingCard` hands
 *   the same object to `getListingMedia(listing: Listing)`, so widening it
 *   here fails typecheck inside `components/cards/ListingCard.tsx`.
 *   THE GATE. `exclusivityStatus` below is the publish gate, set to
 *   `"unevidenced"` on both new mandates. It is modelled on the `streetStatus`
 *   gate, and its reader LANDED 2026-08-17 in
 *   `components/cards/ListingCard.tsx`:
 *       {listing.exclusivityStatus === "unevidenced" ? null : (
 *         <Badge status={listing.status} className="bg-paper" />
 *       )}
 *   Neither new mandate renders an EXCLUSIVE chip today.
 *   ONE-TOKEN RESTORE, per row: delete `exclusivityStatus` (or set it to
 *   `"verified"`) the moment Dino confirms that mandate is exclusive.
 *   POCONO IS NOT GATED: it is the byte-verified kwc port, carrying our own
 *   Crexi record (2301818), and nothing surfaced against it — but its
 *   exclusivity is inherited from the port rather than separately evidenced,
 *   so it belongs on Dino's production-review checklist too.
 *
 * STREET ADDRESSES — gated, and today NO card renders one (D18)
 *   §3.5/B12 flag The Florida Gateway's street number, "852374 US Highway 17",
 *   as `provisional`: the source sweep itself prints it as a possible
 *   digit-concatenation typo and asks for verification against Crexi record
 *   2629907 or the county record before it is published. Neither of those two
 *   named sources could be reached from this environment (crexi.com returns
 *   403 to automated fetches; the Nassau County appraiser record could not be
 *   queried), so under D18's own default the card publishes **city and state
 *   only**. The mechanism is the `streetStatus` gate below, not a deletion:
 *   the value is carried as data marked `provisional`, `ListingCard` renders a
 *   street ONLY when `streetStatus === "verified"`, and clearing D18 is a
 *   one-token flip by whoever verifies it. The other two rows carry no street
 *   at all — their addresses are not needed to render a card, and leaving them
 *   out keeps the published address surface at zero, matching `lib/a100.ts`
 *   ("this module publishes no address at all").
 *
 * CREXI LINKS — one of three has a verified URL; the other two ship without
 *   A public listing card may only ever resolve to Crexi (`isTrustedCrexiUrl`
 *   below is the frozen port of that guard). A card whose URL is missing or
 *   untrusted is NOT a broken card: `ListingCard` degrades it to a
 *   non-linking ticket with a real `mailto:` contact route in the stub.
 *     - Pocono → the byte-verified port URL (Crexi 2301818). Ships.
 *     - Quality Suites Cy-Fair → **no Crexi URL exists in any source**, and
 *       decision D7's verification step (web-search the Crexi record for
 *       17550 NW Freeway and confirm it matches the write-up) came back
 *       empty — the property is findable on other marketplaces, not on Crexi.
 *       Per D7's stated default, that card ships with NO Crexi link.
 *     - The Florida Gateway → §3.5 carries a candidate URL recovered from a
 *       forwarded screenshot, which exists in no text source and which could
 *       not be confirmed from here (Crexi 403s automated requests and the
 *       record id returns nothing in search). It is therefore NOT wired: an
 *       unconfirmed link on a $3.75M offering is worse than no link, and the
 *       mailto degrade is a real contact route. Wiring it is a one-line
 *       change the moment somebody opens the record in a browser and confirms
 *       it — the URL is recorded in the plan, deliberately not copied here.
 *
 * PHOTOGRAPHY — the honest interim, unchanged (D12, docs/PLACEHOLDERS.md #41)
 *   Every listing flyer in the 2026-08-17 delivery carries prior-firm branding
 *   and a legacy contact block, so none of it can ship (CLAUDE.md guardrail),
 *   and no unbranded property photography of these three hotels exists
 *   anywhere. All three rows therefore keep the sentinel `photo` value, which
 *   `lib/listingMedia.ts` resolves to the delivered `beachfront-aerial`
 *   glyph-mosaic placement — generic art openly standing in for a photograph,
 *   not a picture of any of these three properties. `photoAlt` follows the
 *   established "<name>, <city>, <state> — photograph on request" pattern so
 *   the gap is stated rather than papered over.
 */

import type { Listing } from "@/lib/types";

/**
 * Whether a street value has cleared verification and may be PUBLISHED.
 * `provisional` is the safe default and renders nothing — see the file
 * header's D18 note.
 */
export type StreetStatus = "verified" | "provisional";

/**
 * The static seed's row shape: `Listing` plus the two publish-gate fields.
 *
 * TYPED HERE, NOT IN `lib/types.ts`: that contract is scoped to the a100
 * public-feed allowlist (its own header says so), and the feed carries no
 * street field — this gate is a property of our static seed and its pending
 * D18 decision, so it lives with the seed. Same local-extension pattern
 * `content/artwork.ts` and `content/doors.ts` already use.
 */
export type SeedListing = Listing & {
  /**
   * Publish gate for the EXCLUSIVE badge — see the header's "EXCLUSIVITY".
   *
   * ABSENT is the unchanged path: the row's `status` badge renders exactly as
   * it always has, which keeps every feed row (a plain `Listing`, which has no
   * such field) and the ported Pocono row behaving as before. `"unevidenced"`
   * means a human has looked and found no `verified-current` evidence for our
   * exclusivity, and `ListingCard` must render NO chip for that row.
   * `"verified"` is the explicit clear, for when Dino confirms one.
   *
   * The reader is one line in `components/cards/ListingCard.tsx` and is NOT
   * yet written — that file belongs to another agent. The field is inert until
   * it lands; it is carried here because the decision is a property of the
   * data, and because wiring it is then a single conditional.
   */
  exclusivityStatus?: "verified" | "unevidenced";
  /**
   * Street line as the source prints it. Carried as DATA even while
   * unverified so the pending decision is visible where it will be resolved —
   * but never rendered unless `streetStatus` says `verified`.
   */
  street?: string;
  /** Publish gate for `street`. Absent or `provisional` → nothing renders. */
  streetStatus?: StreetStatus;
};

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

/* ------------------------------ section chrome ----------------------------- */
/*
 * Promoted here from `components/sections/ListingsSection.tsx` local constants,
 * closing the "Content gap" TODO that file and docs/design/specs/listings.md
 * §"Content gap" both recorded ("promote LISTINGS_HEADLINE / LISTINGS_SUB into
 * content/listings.ts when that file is next touched, so the section stops
 * carrying literal copy"). This wave is that touch, and this file's owner is
 * the content owner the recommendation names. Both strings move across
 * unchanged, with their citations — nothing is reworded in the move, and the
 * section-chrome-lives-with-its-section's-data pattern now matches
 * `content/doors.ts` and `content/mandates.ts`.
 */

/**
 * ref 04 §#listings gives no verbatim headline; this is copy in the
 * established voice (sentence case, one italic accent word, no banned words).
 * `SectionHeader` renders the `*…*` span as the italic gold tail.
 */
export const listingsHeadline: string = "On the market, handled *quietly*.";

/** ref 04 §#listings, verbatim: "Header + 'Powered by our confidential channel' subline." */
export const listingsSub: string = "Powered by our confidential channel.";

/** ref 04 §#listings — rendered when `listings` is empty. */
export const listingsEmptyState: string =
  "No public listings right now — request off-market access";

export const listings = [
  {
    // Slug id — matches `lib/a100.ts` APPROVED_LISTINGS[0].slug exactly.
    id: "the-florida-gateway",
    // CANONICAL NAME (§3.5): the write-up doc calls this "The Yulee Gateway";
    // the flyer creative and the master allowlist both say "The Florida
    // Gateway", and the allowlist wins. Do not rename from a write-up.
    name: "The Florida Gateway",
    city: "Yulee",
    stateCode: "FL",
    // NOT RENDERED — `provisional` under D18. See the file header.
    street: "852374 US Highway 17",
    streetStatus: "provisional",
    // B12: "156 keys".
    roomCount: 156,
    // B12, verbatim: "closed since 2019, offered as-is". Carried in the meta
    // line rather than dropped, because a bare "156 keys" on a property that
    // has not operated since 2019 would read as an operating hotel. Stating
    // it is the honest framing, and it is the copy bank's own wording.
    serviceLevel: "Closed since 2019, offered as-is",
    // B12: "$3,750,000". Shipped in the bank's own format — `displayPrice`
    // passes a well-formed string straight through without reformatting.
    price: "$3,750,000",
    // `listed` is the literally-true value (the property IS listed). What it
    // must NOT do is render the EXCLUSIVE badge: our exclusivity here has no
    // verified-current evidence and the property is publicly listed on LoopNet
    // under another broker's contact. Header, "EXCLUSIVITY".
    status: "listed",
    exclusivityStatus: "unevidenced",
    // No `crexiUrl` — the candidate URL is unconfirmed. File header, "CREXI
    // LINKS". The ticket degrades to the mailto contact route.
    photo: "/art/listing-placeholder.svg",
    photoAlt: "The Florida Gateway, Yulee, Florida — photograph on request",
  },
  {
    // Slug id — matches `lib/a100.ts` APPROVED_LISTINGS[1].slug exactly.
    id: "quality-suites-houston-nw-cy-fair",
    name: "Quality Suites Houston NW Cy-Fair",
    // B12 gives "17550 NW Freeway (US-290), Houston, TX · Cypress / Houston
    // NW". The card publishes the city and state; the street is not needed to
    // render and is not carried (file header, "STREET ADDRESSES").
    city: "Houston",
    stateCode: "TX",
    // B12, verbatim: "Choice-flagged select-service". `brand` stays absent —
    // the flag is already inside the display name.
    serviceLevel: "Choice-flagged select-service",
    // B12: "54 keys".
    roomCount: 54,
    // B12: "$3,600,000".
    price: "$3,600,000",
    // Same gate as the row above: publicly listed on LoopNet under another
    // broker's contact, no verified-current row for our exclusivity, so the
    // claim is withheld rather than composed. Header, "EXCLUSIVITY".
    status: "listed",
    exclusivityStatus: "unevidenced",
    // No `crexiUrl` — D7's verification came back empty. File header.
    photo: "/art/listing-placeholder.svg",
    photoAlt:
      "Quality Suites Houston NW Cy-Fair, Houston, Texas — photograph on request",
  },
  {
    // Slug id — matches `lib/a100.ts` APPROVED_LISTINGS[2].slug exactly.
    // Real Monday item id, verbatim from the kwc CREXI_LINKS map
    // (docs/port/03-deals.md §B.3): 10846884635. Kept here, out of `id`.
    id: "pocono-mountain-hotel-and-spa",
    // B12 spells it with an ampersand; the previous seed's "and" form was the
    // Crexi slug's wording. The copy bank is canonical.
    name: "Pocono Mountain Hotel & Spa",
    // B12: "38 Lehigh Road, Gouldsboro, PA 18424" — the first source to name
    // the municipality, so this row no longer ships state-only. Street not
    // carried (file header, "STREET ADDRESSES").
    city: "Gouldsboro",
    stateCode: "PA",
    // NOT gated: the badge here is inherited from the byte-verified kwc port,
    // which published this as our own mandate with our own Crexi record behind
    // it, and nothing surfaced against it in this run's verification pass.
    // Still on Dino's production-review checklist — header, "EXCLUSIVITY".
    status: "listed",
    // Byte-verified in the kwc source (index.html:1776). The only one of the
    // three with a confirmed Crexi record.
    crexiUrl:
      "https://www.crexi.com/properties/2301818/pennsylvania-pocono-mountain-hotel-and-spa",
    photo: "/art/listing-placeholder.svg",
    photoAlt:
      "Pocono Mountain Hotel & Spa, Gouldsboro, Pennsylvania — photograph on request",
  },
] satisfies SeedListing[];
