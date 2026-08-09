/**
 * components/cards/ListingCard.tsx — one "Hotels for sale" deal ticket.
 *
 * Governed by docs/design/specs/listings.md, docs/DESIGN-REVISIT.md §4.5 (D4
 * ticket anatomy) and hokuten-design-director ref 04 (#listings), ref 07 (the
 * 5-second CRE gate: a LoopNet/Crexi user finds price, keys, cap rate and a
 * contact route at a glance). Rebuilt onto `Ticket` — see that file's header
 * for the chassis contract this component composes against. Server
 * Component — Ticket, PhotoFrame and Badge carry the only client-side pieces
 * (PhotoFrame's tap toggle).
 *
 * ── The 5-second gate ───────────────────────────────────────────────────────
 * Price is always the FIRST metric in the structured grid (Ticket's no-reflow
 * contract keeps every ticket the same height regardless of how many metrics
 * follow it). Keys and cap rate join it only when the seed data supplies
 * them — the Phase 1 seed carries none of roomCount, serviceLevel, price or
 * cap for any of the five active listings, so today every ticket ships a
 * single, full-width "Price" row (`Ticket` spans a sole metric across both
 * grid columns rather than leaving a half-empty row). Nothing here is
 * invented when the source hasn't supplied it — `keys` and `cap rate` are
 * genuinely omitted rows, never "N/A", per the source data's own contract
 * (content/listings.ts header comment).
 *
 * ── D4: what moved where ────────────────────────────────────────────────────
 *   EXCLUSIVE (status) badge  → the "class" chip, overlaid top-left on the
 *     header photo band (was CardShell's bottom badge row).
 *   cap rate                  → a metric-grid row ("Cap rate" / "7.25% Cap"),
 *     using `displayCapRate`'s exact formatted string — was a separate
 *     `<Badge>` chip in the badge row.
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
 * ── Photo: real listing photo, or the artwork-manifest placeholder ─────────
 * The Phase 1 seed has no photograph of any of these five properties (the
 * kwc source repo carries closing photos only) — every `listing.photo` is
 * the sentinel `/art/listing-placeholder.svg`, detected below rather than
 * guessed. Where that sentinel is set, the header resolves
 * `content/artwork.ts`'s `"listing.placeholder"` placement (delivered:
 * `beachfront-aerial`, the D5 glyph-mosaic art) via `getArt()` — "that is the
 * right wiring" per the round's task brief — and falls back to the legacy
 * static SVG only if the manifest ever reports the placement blocked.
 *
 * KNOWN GAP, not something this component can fix: as of this pass the
 * manifest's `breakpoints` for `listing.placeholder` point at
 * `/art/beachfront-aerial-card-{640,1280}.{avif,webp,jpg}`, and NONE of those
 * six files exist on disk yet (only `beachfront-aerial-hero-1024.avif/webp`
 * do — a different placement's breakpoint, generated for the hero). The
 * generation contract is owned by a concurrent agent (artwork.ts's own header
 * comment). Until those files land, every listing ticket's header will 404.
 * Verify before shipping / before the mandatory screenshot QA pass.
 *
 * ── Header aspect: 3:2, not the old 4:3 ─────────────────────────────────────
 * The artwork manifest fixes the "card" variant (used by both
 * `listing.placeholder` and `#closings`' `closings.accent`) at 3:2 — adopted
 * here for both the real-photo and placeholder-art branches so every ticket
 * in the grid shares one aspect regardless of source. This supersedes the
 * pre-ticket CardShell era's "4/3 crops least off the 5:4 SVG" reasoning,
 * which no longer governs now that a real 3:2 artwork piece is the intended
 * asset. The interim raw-SVG fallback branch (reached only if the manifest
 * ever reports this placement blocked — not the case today) inherits the
 * same 3:2 box and takes a slightly larger crop than the old 4/3 choice; that
 * branch is not live under the current manifest state, so this is a
 * documented, low-stakes tradeoff rather than a regression anyone will see.
 */

import { ArrowUpRight } from "lucide-react";

import type { Listing } from "@/lib/types";
import { displayCapRate, displayPrice, metaLine } from "@/lib/utils";
import { isTrustedCrexiUrl } from "@/content/listings";
import { getArt } from "@/content/artwork";
import { CONTACT } from "@/content/site";
import Ticket, { type TicketMetric } from "@/components/cards/Ticket";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/ui/button";

export type ListingCardProps = {
  listing: Listing;
  className?: string;
};

/** The seed's "no real photo yet" marker — see content/listings.ts header. */
const NO_PHOTO_SENTINEL = "/art/listing-placeholder.svg";

const HEADER_ASPECT = "3/2" as const;
const HEADER_SIZES = "(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw";

/** "City, ST" when a city is on file, "ST" alone otherwise — never an invented municipality. */
function locationLabel(listing: Listing): string {
  return listing.city ? `${listing.city}, ${listing.stateCode}` : listing.stateCode;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const hasTrustedLink = Boolean(listing.crexiUrl && isTrustedCrexiUrl(listing.crexiUrl));
  const cap = displayCapRate(listing.displayCapRate);
  const meta = metaLine([locationLabel(listing), listing.brand, listing.serviceLevel]);

  const hasRealPhoto = listing.photo !== NO_PHOTO_SENTINEL;
  const placeholderArt = hasRealPhoto ? null : getArt("listing.placeholder");

  const headerPhoto = hasRealPhoto ? (
    <PhotoFrame src={listing.photo} alt={listing.photoAlt} aspect={HEADER_ASPECT} sizes={HEADER_SIZES} />
  ) : placeholderArt ? (
    <PhotoFrame
      src={placeholderArt.src}
      alt={placeholderArt.alt}
      aspect={HEADER_ASPECT}
      sizes={placeholderArt.sizes}
    />
  ) : (
    // Interim fallback — only reached if the manifest ever reports
    // "listing.placeholder" as blocked (it does not today). Kept as the
    // documented degrade path rather than an empty slot.
    <PhotoFrame
      src={NO_PHOTO_SENTINEL}
      alt={listing.photoAlt}
      aspect={HEADER_ASPECT}
      sizes={HEADER_SIZES}
      reveal={false}
    />
  );

  const header = (
    <>
      {headerPhoto}
      <div className="absolute left-3 top-3 z-1">
        <Badge status={listing.status} className="bg-paper" />
      </div>
    </>
  );

  const metrics: TicketMetric[] = [{ label: "Price", value: displayPrice(listing.price) }];
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
      header={header}
      title={title}
      meta={meta}
      metrics={metrics}
      stub={stub}
    />
  );
}

export default ListingCard;
