/**
 * lib/listingMedia.ts — the `#listings` ticket-header media adapter.
 *
 * Governed by docs/DESIGN-REVISIT-2.md D13 (last bullet: "Establish a stable
 * listing-media adapter now so the future CRM photo changes data, not
 * component anatomy") and §5.4 point 2 ("Build site/lib/listingMedia.ts: a
 * small adapter that resolves a listing to { src, alt, width, height,
 * focalPoint?, isPlaceholder } from whatever media exists — today the
 * artwork manifest's `listing.placeholder` placement, later a CRM photo
 * URL."). This file is NEW this wave; `ListingCard.tsx` is rebuilt onto it
 * as part of the same assignment.
 *
 * ── Why this exists as a separate module, not inline in ListingCard ────────
 * Before this file, `ListingCard.tsx` decided "which image, or which
 * placeholder" itself, inline, mixed in with JSX. That meant a future CRM
 * integration — a real `photoUrl` landing on the `Listing` record — would
 * require editing the CARD to change the DATA question ("what image does
 * this listing have?"). Splitting the data question into its own resolver
 * means a Phase 2 feed swap is a change to what THIS FILE returns, never a
 * change to `Ticket.tsx` or `ListingCard.tsx`'s own anatomy — exactly the
 * "CRM media arrives, it changes data, not component anatomy" contract D13
 * asks for. `content/artwork.ts`'s `getArt()`/`getMenuArt()` already
 * establish this exact resolver shape sitewide; this file is the same
 * pattern applied to listing photography specifically, not a new idea.
 *
 * ── Dependency-free and server-safe (P0 per the task brief) ────────────────
 * No `"use client"`, no React import, no browser API, no new npm dependency.
 * The only import is `getArt` from `content/artwork.ts` — an existing,
 * already-server-safe internal manifest resolver (not a new dependency in
 * any practical sense; every other art-consuming component on the site
 * already depends on it). This module is plain, side-effect-free TypeScript:
 * it can run at build time, in a Server Component, or inside a future route
 * handler that resolves CRM data before the page renders.
 *
 * ── The three resolution branches, in the order this file checks them ──────
 *   1. REAL SUPPLIED PHOTO — `listing.photo` is set to something other than
 *      the seed's sentinel value. This is the future-CRM path: today NO
 *      listing in `content/listings.ts` reaches it (every one of the five
 *      active listings ships the sentinel — verified by reading the file
 *      directly), so it is exercised by nothing yet, but it is real,
 *      reachable code, not a stub — the moment a feed or a content edit sets
 *      a real `photo` path/URL, this branch renders it with `isPlaceholder:
 *      false`. Because `Listing` (lib/types.ts, outside this file's
 *      ownership) carries no intrinsic width/height for `photo` yet, this
 *      branch reserves the CANONICAL 3:2 display box every ticket header
 *      already uses (`CARD_DISPLAY_WIDTH`/`CARD_DISPLAY_HEIGHT` below,
 *      matching the artwork manifest's "card" variant and both
 *      `ListingCard`/`ClosingCard`'s own `HEADER_ASPECT` constant) rather
 *      than inventing a plausible-looking but false intrinsic size. This is
 *      the ONE place a future `Listing.photo` value could diverge from that
 *      3:2 box's real aspect and letterbox slightly inside `PhotoFrame`'s
 *      `object-cover` fill — an acceptable, documented tradeoff until
 *      `Listing` gains real dimensions, not a silent bug.
 *   2. GLYPH-ART PLACEHOLDER — `listing.photo` is the sentinel and
 *      `content/artwork.ts` reports `"listing.placeholder"` as delivered
 *      (it does today, for all five listings). Real intrinsic width/height
 *      come straight from the manifest's own resolved breakpoint —
 *      `getArt()` never guesses these, so neither does this file.
 *   3. RAW SVG FALLBACK — only reached if the manifest ever reports
 *      `"listing.placeholder"` as `"blocked: awaiting-artwork"` (it does not
 *      today — dead code in practice, kept as the same documented degrade
 *      path `ListingCard.tsx` used before this file existed, so the seed's
 *      `photoAlt` string is never simply dropped on the floor if the
 *      manifest entry is ever pulled).
 * Every branch returns real data already present in `listing`/the artwork
 * manifest — this file invents nothing (content law: never fabricate a
 * value; "Confidential"/omission only, never a fake number or photo — the
 * same law extends to imagery).
 *
 * ── `focalPoint` — typed and CONSUMED, not yet POPULATED (a flagged gap) ────
 * `ListingCard.tsx` already reads `media.focalPoint` and maps it straight to
 * one of `PhotoFrame`'s literal `imageClassName` object-position classes (a
 * small, closed set — Tailwind's static source scan cannot see a
 * dynamically-interpolated class name, so this file intentionally returns a
 * closed enum, `ListingMediaFocalPoint`, never a raw x/y percentage pair).
 * That consumption is real and already wired, so a future listing carrying a
 * focal point renders correctly with ZERO changes to `ListingCard.tsx` or
 * `Ticket.tsx` — matching D13's "without touching Ticket.tsx or
 * ListingCard.tsx" instruction literally. What is NOT yet wired is the
 * SOURCE: `Listing` (lib/types.ts) has no field this resolver could read a
 * focal point from, so every branch below returns `focalPoint: undefined`
 * today. THE GAP, for whoever next touches `lib/types.ts` or a Phase 2 CRM
 * mapper: add an optional field there (e.g. `photoFocalPoint?:
 * ListingMediaFocalPoint`, or map whatever the CRM's own crop-hint field is
 * called) and read it in branch 1 below — that is the only change a real
 * focal point will ever require, because the type and the render path both
 * already exist.
 */

import type { Listing } from "@/lib/types";
import { getArt } from "@/content/artwork";

/**
 * The Phase 1 seed's "no real photo yet" marker (content/listings.ts header;
 * previously duplicated as a local constant inside `ListingCard.tsx` — this
 * file is now the one place that owns detecting it).
 */
export const LISTING_NO_PHOTO_SENTINEL = "/art/listing-placeholder.svg";

/**
 * A closed set of `object-position` keywords, not an arbitrary x/y pair —
 * see the file header's "focalPoint" note for why. Matches Tailwind's own
 * built-in `object-{center,top,bottom,left,right}` utilities one-for-one, so
 * a consumer can map this enum straight onto a literal class with a small
 * lookup table (no dynamic class-name interpolation anywhere in the chain).
 */
export type ListingMediaFocalPoint = "center" | "top" | "bottom" | "left" | "right";

export type ListingMedia = {
  src: string;
  /** Describes the depicted hotel/scene, never the treatment — same alt law
   *  as every other image on the site (PhotoFrame, content/artwork.ts). */
  alt: string;
  width: number;
  height: number;
  /** Present only once a data source actually supplies one. See file header. */
  focalPoint?: ListingMediaFocalPoint;
  /** false only for a real, CRM-supplied photograph. Every placeholder state
   *  (glyph art or the raw SVG degrade) reports true, so a caller can choose
   *  to treat "no real photo of this specific property yet" uniformly
   *  without re-deriving it from `src`. */
  isPlaceholder: boolean;
};

/**
 * The canonical ticket-header display box: 3:2, matching the artwork
 * manifest's "card" variant and both `ListingCard`/`ClosingCard`'s own
 * `HEADER_ASPECT` constant (every ticket header in the site's two grids
 * shares this one ratio). Used ONLY as the reserved box for a future real
 * photo whose true intrinsic size `Listing` cannot yet express — see branch
 * 1 in the file header. 1200x800 also matches the "1200x800 minimum" figure
 * docs/DESIGN-REVISIT-2.md §4.3 already establishes for a dedicated 3:2
 * property crop, so it is not an arbitrary number invented here.
 */
const CARD_DISPLAY_WIDTH = 1200;
const CARD_DISPLAY_HEIGHT = 800;

/**
 * Resolve a listing to the media its ticket header should render. Never
 * returns null/undefined — there is always a designed state (real photo,
 * delivered placeholder art, or the raw-SVG degrade), so a caller never has
 * to handle "no image at all."
 */
export function getListingMedia(listing: Listing): ListingMedia {
  const hasSuppliedPhoto = listing.photo.trim() !== "" && listing.photo !== LISTING_NO_PHOTO_SENTINEL;

  if (hasSuppliedPhoto) {
    return {
      src: listing.photo,
      alt: listing.photoAlt,
      width: CARD_DISPLAY_WIDTH,
      height: CARD_DISPLAY_HEIGHT,
      isPlaceholder: false,
    };
  }

  const placeholderArt = getArt("listing.placeholder");
  if (placeholderArt) {
    return {
      src: placeholderArt.src,
      alt: placeholderArt.alt,
      width: placeholderArt.width,
      height: placeholderArt.height,
      isPlaceholder: true,
    };
  }

  // Manifest-blocked degrade path — not reachable under today's manifest
  // state (verified: content/artwork.ts reports "listing.placeholder" as
  // "delivered"), kept as the documented fallback rather than an empty slot.
  return {
    src: LISTING_NO_PHOTO_SENTINEL,
    alt: listing.photoAlt,
    width: CARD_DISPLAY_WIDTH,
    height: CARD_DISPLAY_HEIGHT,
    isPlaceholder: true,
  };
}

/**
 * True for the interim raw-SVG degrade path specifically (branch 3 above),
 * as distinct from the designed glyph-art placeholder (branch 2). The two
 * both report `isPlaceholder: true` (neither is a real property photo), but
 * only the raw SVG icon is not a photograph at all and should skip the
 * grayscale-at-rest/colour-on-hover photo treatment a real image (real or
 * glyph-art) gets everywhere else on the site — see `ListingCard.tsx`'s use
 * of this for the exact `reveal` wiring.
 */
export function isRawSvgFallback(media: ListingMedia): boolean {
  return media.src === LISTING_NO_PHOTO_SENTINEL;
}
