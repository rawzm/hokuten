/**
 * components/cards/ListingCard.tsx — one "Hotels for sale" tile.
 *
 * Governed by docs/design/specs/listings.md and hokuten-design-director ref 04
 * (#listings), ref 07 (the 5-second CRE gate: a LoopNet/Crexi user finds price,
 * keys, cap rate and a contact route at a glance). Server Component — CardShell
 * and PhotoFrame carry the only client-side pieces (PhotoFrame's tap toggle).
 *
 * ── The 5-second gate ───────────────────────────────────────────────────────
 * Price sits in CardShell's mono `data` slot, elevated to `text-fg` (the
 * chassis' own default there is the muted `text-fg-meta`) because price is the
 * single most load-bearing number on the card — AGENT-BRIEF's typography law
 * reserves "mono 500 for emphasised data values" for exactly this case. Cap
 * rate — only when it parses positive — rides beside the status badge as its
 * own chip. Keys/service level/brand live in the sans meta line next to
 * city/state; nothing here is invented when the source data hasn't supplied it
 * (the Phase 1 seed carries none of roomCount, serviceLevel, price or cap).
 *
 * ── Crexi trust boundary ────────────────────────────────────────────────────
 * The card becomes a link ONLY when `isTrustedCrexiUrl()` passes. A listing
 * whose `crexiUrl` is missing or fails that check never resolves to a dead or
 * mismatched link — it degrades to a non-linking tile with a real `mailto:`
 * contact route instead (spec: "still shows a contact route").
 *
 * ── Photo aspect ────────────────────────────────────────────────────────────
 * `/art/listing-placeholder.svg` is authored at 5:4 (500×400), a ratio
 * PhotoFrame's registered `PhotoAspect` union does not carry. `4/3` is the
 * closest registered ratio and crops the least off the placeholder's
 * decorative frame edges — see the spec's "Photo aspect" section for the
 * pixel math. This is the only card grid on the site so far; a future
 * ClosingCard/TeamCard is free to choose its own aspect for its own imagery.
 */

import type { Listing } from "@/lib/types";
import { displayCapRate, displayPrice, metaLine } from "@/lib/utils";
import { isTrustedCrexiUrl } from "@/content/listings";
import { CONTACT } from "@/content/site";
import CardShell from "@/components/cards/CardShell";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/ui/button";

export type ListingCardProps = {
  listing: Listing;
  className?: string;
};

/** "City, ST" when a city is on file, "ST" alone otherwise — never an invented municipality. */
function locationLabel(listing: Listing): string {
  return listing.city ? `${listing.city}, ${listing.stateCode}` : listing.stateCode;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const hasTrustedLink = Boolean(listing.crexiUrl && isTrustedCrexiUrl(listing.crexiUrl));
  const cap = displayCapRate(listing.displayCapRate);
  const keysLabel = listing.roomCount ? `${listing.roomCount} keys` : undefined;
  const meta = metaLine([
    locationLabel(listing),
    listing.brand,
    listing.serviceLevel,
    keysLabel,
  ]);

  const title = hasTrustedLink ? (
    <>
      {listing.name}
      <span className="visually-hidden"> — view listing on Crexi</span>
    </>
  ) : (
    listing.name
  );

  return (
    <CardShell
      className={className}
      href={hasTrustedLink ? listing.crexiUrl : undefined}
      external={hasTrustedLink}
      photo={
        <PhotoFrame
          src={listing.photo}
          alt={listing.photoAlt}
          aspect="4/3"
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw"
        />
      }
      title={title}
      meta={meta}
      data={<span className="font-medium text-fg">{displayPrice(listing.price)}</span>}
      badge={
        <>
          {cap ? <Badge label={cap} /> : null}
          <Badge status={listing.status} />
          {!hasTrustedLink ? (
            <Button asChild variant="link" className="relative z-2">
              <a href={CONTACT.emailHref}>
                Email us about this listing
                <span className="visually-hidden"> ({CONTACT.email})</span>
              </a>
            </Button>
          ) : null}
        </>
      }
    />
  );
}

export default ListingCard;
