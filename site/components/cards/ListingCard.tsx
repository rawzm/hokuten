/**
 * components/cards/ListingCard.tsx — one "Hotels for sale" deal ticket.
 *
 * Governed by docs/DESIGN-REVISIT-2.md D13 + §5.4 ("02 — Hotels for sale",
 * screen 4) — this wave's rebuild — and hokuten-design-director ref 04
 * (`#listings`), ref 07 (the 5-second CRE gate: a Crexi/LoopNet user finds
 * price, keys, cap rate and a contact route at a glance). Built onto
 * `Ticket` (components/cards/Ticket.tsx) — read that file's header for the
 * chassis contract this component composes against; it is NOT owned or
 * modified here. Server Component — `Ticket`, `PhotoFrame` and `Badge`
 * carry the only client-side pieces (PhotoFrame's tap toggle).
 *
 * ── THIS WAVE: migrated onto Ticket's dedicated `price`/`serial` slots ─────
 * `Ticket.tsx`'s own header left an explicit "NEXT-WAVE TODO" for whoever
 * rebuilds this file: move the price-valued entry OUT of `metrics` and into
 * the new `price` prop, and add `serial` from the grid's real array index.
 * That migration is what makes D13's four-level hierarchy (micro serial →
 * serif title → mono money PRICE → compact mono facts) actually reach the
 * page instead of leaving price sitting inside the small metrics grid at the
 * same visual weight as keys/cap rate. Both are done below:
 *   `price`   → `Ticket`'s dedicated slot (`text-heading` + `text-money`,
 *               THE dominant data moment, visibly larger than everything in
 *               `metrics`). `displayPrice()` already returns the approved
 *               "Price on Request" fallback — passed through unmodified.
 *   `serial`  → `"OFFERING NN"`, derived from the REAL, already-rendered
 *               array index `ListingsSection` passes in via the new
 *               `index` prop (never invented here — see that prop's doc
 *               below). "Offering" reads correctly for active-for-sale
 *               inventory, distinct from `ClosingCard`'s "Record" framing
 *               for the retired track-record grid (a separate file, a
 *               separate agent's assignment this wave).
 *   `metrics` → now ONLY keys and cap rate, in that order, when the seed
 *               supplies them — never price again (Ticket's own migration
 *               note: "NEVER the primary price again").
 *
 * ── The 5-second gate ───────────────────────────────────────────────────────
 * Price always renders (real value or the "Price on Request" fallback — it
 * is never blank). Keys and cap rate join the facts grid only when the seed
 * data supplies them, and under the three-property allowlist that is now a
 * MIXED grid rather than a uniformly empty one: The Florida Gateway and
 * Quality Suites Cy-Fair each carry a real key count and a real price, while
 * Pocono carries neither (no source states them), so its ticket renders the
 * "Price on Request" fallback and an empty facts grid. `Ticket`'s
 * `reserveMetrics`/`reservePrice` defaults are what keep those three tickets
 * level with each other despite the difference — do not "fix" the gap by
 * filling it. No source states a cap rate for ANY of the three, so no cap
 * chip renders anywhere today. Nothing here is invented when the source
 * hasn't supplied it — `keys` and `cap rate` are genuinely omitted rows,
 * never "N/A" (content/listings.ts header comment).
 *
 * ── D4: what moved where (carried forward from the pre-Ticket CardShell era,
 *    unchanged this wave) ────────────────────────────────────────────────────
 *   EXCLUSIVE (status) badge  → the "class" chip, overlaid top-left on the
 *     header photo band.
 *   "View on Crexi ->"        → the stub action below the tear line, plain
 *     text + a Lucide `ArrowUpRight` (never the "→" glyph directly — a11y
 *     law reserves the literal arrow character for mono micro-label type).
 *     Not a second `<a>`: the whole ticket is already one link via the
 *     title's stretched anchor (Crexi trust boundary below), so this is
 *     decoration, not a duplicate hit target.
 *
 * ── Crexi trust boundary (unchanged, still load-bearing) ───────────────────
 * The ticket becomes a link ONLY when `isTrustedCrexiUrl()` passes. A listing
 * whose `crexiUrl` is missing or fails that check never resolves to a dead or
 * mismatched link — it degrades to a non-linking tile with a real `mailto:`
 * contact route in the stub instead.
 *
 * That degrade is now the MAJORITY state, by decision rather than by accident:
 * of the three allowlisted listings only Pocono has a Crexi URL that any
 * source confirms. Quality Suites Cy-Fair has none anywhere (D7's default:
 * ship the card without a link), and The Florida Gateway's candidate URL is
 * unconfirmed and deliberately not wired. See content/listings.ts's "CREXI
 * LINKS" header note. Two mailto tickets beside one Crexi ticket is the
 * designed, honest outcome — not a rendering bug to route around.
 *
 * ── Street address: rendered only behind the publish gate (D18) ────────────
 * `locationLabel()` below composes the meta line's location. It prepends a
 * street ONLY when the row carries one AND marks it `streetStatus:
 * "verified"`; anything else — no street, or a street still marked
 * `provisional` — renders city/state exactly as before. That is the code half
 * of decision D18 (docs/LAUNCH-IMPLEMENTATION.md §3.5): The Florida Gateway's
 * street number is flagged in its own source as a possible digit-
 * concatenation typo, and the plan's default is that an unverified street
 * number is not published on a $3.75M offering. No row is `verified` today,
 * so no card renders a street; clearing D18 is a one-token data flip in
 * content/listings.ts and needs no change here.
 *
 * ── Photo: the listing-media adapter, not inline resolution ────────────────
 * THIS WAVE: photo/placeholder resolution moved OUT of this file and into
 * the new `lib/listingMedia.ts` adapter (`getListingMedia()`) — read that
 * file's header for the full three-branch contract (real CRM photo / glyph-
 * art placeholder / raw-SVG degrade) and the `focalPoint` gap it documents.
 * This file now only asks "what media does this listing have?" and renders
 * whatever comes back — it no longer knows the sentinel value, the artwork
 * manifest, or which branch fired. That is the whole point of the adapter
 * (D13: "when CRM media arrives it changes DATA, not component anatomy") —
 * the day a real `photoUrl` lands on a `Listing` record, this file changes
 * NOTHING; `getListingMedia()`'s first branch already renders it.
 *
 * KNOWN GAP, not something this component can fix (docs/PLACEHOLDERS.md row
 * 41, `provisional`): none of the three allowlisted listings has real
 * photography yet — every one resolves the approved 「北天」 glyph-mosaic
 * placeholder via the adapter's second branch. The 2026-08-17 delivery's
 * listing flyers cannot close it either: they carry prior-firm branding and a
 * legacy contact block, so they are unusable (D12). This is the designed,
 * tracked interim state, not a bug.
 *
 * ── `focalPoint`: consumed here, not yet populated anywhere (see the adapter's
 *    header for the full gap note) ──────────────────────────────────────────
 * `FOCAL_IMAGE_CLASS` below is a closed, literal Tailwind lookup — never a
 * dynamically interpolated class name (PhotoFrame.tsx's own established
 * pattern: "Literal class strings so Tailwind's source scan can see them").
 * No listing supplies a focal point today, so this branch is inert in
 * practice, but it is real, wired code: the day `getListingMedia()` starts
 * returning one (once `Listing` gains a source field for it — the adapter's
 * documented gap), this file needs no further change.
 *
 * ── Header aspect: 3:2, matching the adapter's own canonical box ───────────
 * The artwork manifest fixes the "card" variant (used by both
 * `listing.placeholder` and `#closings`' `closings.accent`) at 3:2, and
 * `lib/listingMedia.ts`'s real-photo branch reserves that same 3:2 box —
 * this file's `HEADER_ASPECT` constant matches both so every ticket in the
 * grid shares one aspect regardless of source.
 */

import { ArrowUpRight } from "lucide-react";

import { displayCapRate, displayPrice, metaLine } from "@/lib/utils";
import { getListingMedia, isRawSvgFallback, type ListingMediaFocalPoint } from "@/lib/listingMedia";
import { isTrustedCrexiUrl, type SeedListing } from "@/content/listings";
import { CONTACT } from "@/content/site";
import Ticket, { type TicketMetric } from "@/components/cards/Ticket";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/ui/button";

export type ListingCardProps = {
  /**
   * `SeedListing` = `lib/types.ts`'s `Listing` plus the optional street
   * publish-gate fields the static seed owns (content/listings.ts). Both
   * extras are optional, so a plain `Listing` — a future feed row, a preview
   * fixture — is still accepted unchanged; it simply never renders a street.
   */
  listing: SeedListing;
  /**
   * The listing's REAL, already-rendered position in the grid array (0-based
   * — this file adds 1 for display). `ListingsSection` passes its own
   * `.map((listing, index) => …)` index straight through; this component has
   * no serial-generation logic of its own and never invents one (Ticket's
   * own contract: a serial "MUST be derived by the caller from the real,
   * already-rendered array index"). Optional so a future standalone/preview
   * render of this card (outside the grid) simply omits the serial rather
   * than requiring a fabricated position.
   */
  index?: number;
  className?: string;
};

const HEADER_ASPECT = "3/2" as const;
const HEADER_SIZES = "(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw";

/** Literal, closed lookup — see file header "focalPoint" note. Every value
 *  is a built-in Tailwind utility; nothing here is interpolated. */
const FOCAL_IMAGE_CLASS: Record<ListingMediaFocalPoint, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

/**
 * "<street>, City, ST" once a row's street is VERIFIED; "City, ST" when only
 * a city is on file; "ST" alone otherwise. Never an invented municipality,
 * and never an unverified street number — see the file header's D18 note for
 * why the gate exists, and `content/listings.ts` for the data behind it (the
 * one provisional street value lives there and nowhere else, so it cannot be
 * copied out of a component comment by mistake).
 */
function locationLabel(listing: SeedListing): string {
  const place = listing.city ? `${listing.city}, ${listing.stateCode}` : listing.stateCode;
  return listing.street && listing.streetStatus === "verified"
    ? `${listing.street}, ${place}`
    : place;
}

export function ListingCard({ listing, index, className }: ListingCardProps) {
  const hasTrustedLink = Boolean(listing.crexiUrl && isTrustedCrexiUrl(listing.crexiUrl));
  const cap = displayCapRate(listing.displayCapRate);
  const meta = metaLine([locationLabel(listing), listing.brand, listing.serviceLevel]);

  const media = getListingMedia(listing);
  // The raw-SVG degrade is a flat interim icon, not a photograph — it skips
  // the grayscale-at-rest/colour-on-hover photo treatment every real image
  // (real or glyph-art) gets elsewhere on the site. See lib/listingMedia.ts.
  const isFlatFallback = isRawSvgFallback(media);

  const header = (
    <>
      <PhotoFrame
        src={media.src}
        alt={media.alt}
        aspect={HEADER_ASPECT}
        sizes={HEADER_SIZES}
        reveal={!isFlatFallback}
        imageClassName={media.focalPoint ? FOCAL_IMAGE_CLASS[media.focalPoint] : undefined}
      />
      <div className="absolute left-3 top-3 z-1">
        <Badge status={listing.status} className="bg-paper" />
      </div>
    </>
  );

  const metrics: TicketMetric[] = [];
  if (listing.roomCount) {
    metrics.push({ label: "Keys", value: listing.roomCount });
  }
  if (cap) {
    metrics.push({ label: "Cap rate", value: cap });
  }

  const title = hasTrustedLink ? (
    <>
      {listing.name}
      <span className="visually-hidden"> — view listing on Crexi</span>
    </>
  ) : (
    listing.name
  );

  const stub = hasTrustedLink ? (
    <span className="data-line inline-flex items-center gap-1.5 font-medium">
      <span className="text-accent-text">View on Crexi</span>
      <ArrowUpRight aria-hidden="true" strokeWidth={1.75} className="size-4 text-accent-text" />
    </span>
  ) : (
    <Button asChild variant="link" className="relative z-2">
      <a href={CONTACT.emailHref}>
        Email us about this listing
        <span className="visually-hidden"> ({CONTACT.email})</span>
      </a>
    </Button>
  );

  return (
    <Ticket
      className={className}
      href={hasTrustedLink ? listing.crexiUrl : undefined}
      external={hasTrustedLink}
      serial={index !== undefined ? `OFFERING ${String(index + 1).padStart(2, "0")}` : undefined}
      header={header}
      title={title}
      meta={meta}
      price={displayPrice(listing.price)}
      metrics={metrics}
      stub={stub}
    />
  );
}

export default ListingCard;
