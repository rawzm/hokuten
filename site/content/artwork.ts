/**
 * content/artwork.ts — the 「北天」 glyph-mosaic artwork intake manifest.
 *
 * SOURCE OF RECORD: docs/DESIGN-REVISIT.md §2 D5, §3 "Art program v2" (the
 * placement table + delivered-batch table), reconciled against the round's
 * execution-brief assignment (2026-08-08/09) that fixed the fifteen
 * placements, the six shape/variant tokens and the nine master slugs below.
 *
 * WHAT THIS FILE IS FOR. Razim produces each artwork himself with a
 * controlled img2img prompt — sole rendering primitive 「北天」, source-photo
 * colors preserved — and drops finished master files in `Ref/artwork/`. This
 * repo does not generate the art (the retired AsciiCanvas pipeline stays
 * uninvested, ref DESIGN-REVISIT §2 D5). This manifest is the ONE place that
 * maps a design PLACEMENT to a delivered asset, so that landing a new master
 * is a one-line data edit here, never a component refactor. Get the shape
 * wrong and every future artwork drop turns into a hunt through JSX; that is
 * the failure mode this file exists to prevent.
 *
 * THE GENERATION CONTRACT (owned by a concurrent agent, not this file):
 *   site/public/art/<slug>-<variant>-<width>.avif   — every breakpoint
 *   site/public/art/<slug>-<variant>-<width>.webp   — every breakpoint
 *   site/public/art/<slug>-<variant>-<width>.jpg    — LARGEST breakpoint only
 *   site/public/art/_manifest.json                  — every generated file's
 *                                                      real dimensions + bytes
 *
 * DIMENSIONS — DERIVED, NOT YET MEASURED. `site/public/art/_manifest.json`
 * did not exist at the time this file was written (checked immediately
 * before writing). Every `breakpoints` entry below is therefore COMPUTED —
 * width × the placement's target aspect ratio, per DESIGN-REVISIT §3's shape
 * contract — not read from a real generated file. The math is exact (see
 * per-entry ratio comments), so it should match sharp's actual output to
 * within a rounding pixel, but it has not been cross-checked against a real
 * manifest. THE NEXT AGENT TO TOUCH THIS FILE AFTER `_manifest.json` EXISTS
 * MUST diff every `breakpoints` value against it and correct any mismatch —
 * do not assume the derivation was perfect.
 *
 * MASTER → SLUG MAPPING. The nine raw `Ref/artwork/ChatGPT Image …png` files
 * were opened and visually matched to the slugs named in the placement
 * contract (all nine slugs below are read verbatim from the assignment, not
 * invented here) — every `alt` string in this file was written FROM the
 * actual image, not guessed from the slug name:
 *   hie-dusk             — Holiday Inn Express entrance canopy at dusk (the
 *                           HIE Brooklyn closing's subject)
 *   resort-tower-pool    — white curved resort tower behind palms, lagoon
 *                           pool with swimmers (SPARE — not wired to a
 *                           placement below; see "Spare masters")
 *   full-service-sunset  — full-service tower + arched porte-cochere at
 *                           sunset, rose/lavender sky
 *   marriott-tower       — Marriott-branded tower, warm sand facade, roofline
 *                           "M" + wordmark
 *   beachfront-aerial    — aerial over a beach, white oceanfront towers,
 *                           palm-lined boulevard (native ~1942×809, ~2.4:1 —
 *                           do NOT upscale past 1920w without a re-render)
 *   grand-resort-arrival — palm-flanked resort porte-cochere motor court at
 *                           dusk, pink sky
 *   historic-urban-dawn  — historic-style hotel tower, gold cornice and
 *                           colonnade, tree-lined city corner
 *   select-service-dusk  — a Hyatt Place hotel exterior at dusk, vertical
 *                           branded sign, traffic light trails
 *   resort-pool-loungers — resort pool deck, green loungers, yellow
 *                           umbrellas, footbridge over a lagoon pool
 *
 * Several masters carry visible third-party signage (Holiday Inn Express,
 * Marriott, Hyatt Place) — same nominative-use posture and counsel flag as
 * the `#brands` marquee (content/brands.ts); internal-only until the launch
 * gate (docs/design/LOGO-MANIFEST.md records the parallel for brand chips).
 *
 * SPARE MASTERS — generated (hero + tile crops only, per DESIGN-REVISIT §3
 * pieces-to-request table) but not wired to any placement below: only
 * `resort-tower-pool`. (`grand-resort-arrival` IS wired, to `tier.secondary`.)
 * Kept available for a future swap without a new generation pass; add a
 * sixteenth placement or repoint an existing `slug` field to use it.
 *
 * VARIANT TOKENS (the shape word baked into every generated filename) are
 * fixed by the placement contract, not invented here: `hero` (2.4:1),
 * `portrait` (3:4), `chapter` (4:3), `card` (3:2), `square` (1:1), `wide`
 * (5:2). A placement's `variant` below is one of these six — never a new one
 * without updating the generation contract first.
 *
 * ALT TEXT LAW (docs/AGENT-BRIEF.md "Accessibility law" + ref 03 imagery):
 * `alt` describes the DEPICTED SUBJECT — the hotel, the scene — never the
 * 「北天」 glyph-mosaic treatment. "Holiday Inn Express entrance at dusk," not
 * "kanji mosaic artwork of a hotel." Every `alt` below was written against
 * the actual master image.
 *
 * `tile.extendedStay` HAS NO ARTWORK. Status `"blocked: awaiting-artwork"`,
 * no `slug`, no `alt`, no `src`. Per DESIGN-REVISIT §3: "Do not fake it. …
 * the tile renders the designed typographic interim." Promote it to a
 * `DeliveredArtwork` entry the moment Razim supplies an extended-stay 1:1
 * square, using the same visual-verification + alt-text discipline as the
 * other fourteen — do not reuse another tile's master as a stand-in.
 *
 * TYPES ARE LOCAL, not added to lib/types.ts: that contract is scoped to the
 * a100arms feed allowlist (lib/types.ts header) and artwork has no feed
 * analogue — same pattern content/doors.ts already uses for `Door`.
 */

/** The fifteen art slots fixed by the round's placement contract. */
export type ArtPlacement =
  | "hero.gold"
  | "hero.blue"
  | "menu.panel"
  | "method.chapter"
  | "listing.placeholder"
  | "closings.accent"
  | "tile.limitedService"
  | "tile.selectService"
  | "tile.fullService"
  | "tile.resortBoutique"
  | "tile.extendedStay"
  | "tier.gateway"
  | "tier.secondary"
  | "tier.suburban"
  | "tier.tertiary";

/** The six crop shapes the generation contract will ever produce. */
export type ArtVariant = "hero" | "portrait" | "chapter" | "card" | "tile" | "wide";

/** One generated breakpoint's real pixel dimensions. */
export type ArtBreakpoint = {
  width: number;
  height: number;
};

export type ArtworkStatus = "delivered" | "blocked: awaiting-artwork";

type DeliveredArtwork = {
  status: "delivered";
  /** Stable kebab slug. Matches the intake filename and every generated
   *  file's `<slug>-<variant>-<width>` prefix under site/public/art/. */
  slug: string;
  variant: ArtVariant;
  /** Ascending by width. Last entry is the largest generated breakpoint —
   *  the one `getArt()` returns for explicit next/image width/height. */
  breakpoints: ArtBreakpoint[];
  /** Depicts the subject, never the treatment. See ALT TEXT LAW above. */
  alt: string;
  /**
   * Default `sizes` attribute for this placement's usual layout. A
   * considered default, not a hard contract — the rendering component owns
   * its real grid and MAY pass its own `sizes` to PhotoFrame instead.
   */
  sizesAttr: string;
};

type BlockedArtwork = {
  status: "blocked: awaiting-artwork";
  variant: ArtVariant;
  /** Widths the piece WILL be generated at once delivered. Spec only — no
   *  files exist yet, so this is not a `breakpoints` array. */
  targetWidths: number[];
  /** Why it's blocked and what renders instead. */
  note: string;
};

export type ArtworkEntry = DeliveredArtwork | BlockedArtwork;

/**
 * The manifest. Fifteen keys, one per `ArtPlacement`. `satisfies` keeps every
 * key required and every value shape-checked without widening the literal
 * `status`/`variant` strings the resolver below narrows on.
 */
export const ART_MANIFEST = {
  // ── Hero — 「北天」 art band, ~55–60svh full-bleed, the LCP element (D6) ──
  "hero.gold": {
    status: "delivered",
    slug: "beachfront-aerial",
    variant: "hero",
    // ratio 2.4:1 · native master ~1942×809 · 1920w stays under native, no
    // upscale (DESIGN-REVISIT §3 "ship it; request a ≥2560w re-render only
    // if it softens at 1440+").
    breakpoints: [
      { width: 1024, height: 427 },
      { width: 1440, height: 600 },
      { width: 1920, height: 800 },
    ],
    alt: "Aerial view of a beachfront hotel district, white oceanfront towers along a palm-lined boulevard with the beach and ocean beyond.",
    sizesAttr: "100vw",
  },
  "hero.blue": {
    status: "delivered",
    slug: "full-service-sunset",
    variant: "hero",
    // ratio 2.4:1 · native master ~1672×941 (16:9) — the hero crop is
    // narrower than native, so verify the porte-cochere entrance stays in
    // frame across all three breakpoints.
    breakpoints: [
      { width: 1024, height: 427 },
      { width: 1440, height: 600 },
      { width: 1672, height: 697 },
    ],
    alt: "A full-service hotel's arched entrance drive and guestroom tower at dusk, lit windows against a rose-colored sunset sky.",
    sizesAttr: "100vw",
  },

  // ── Menu overlay — left ~1/3 art panel (Stone anatomy, §4.3) ──
  "menu.panel": {
    status: "delivered",
    slug: "hie-dusk",
    variant: "portrait",
    // ratio 3:4 (w:h) — a portrait crop out of a 4:3 landscape master; the
    // 1200w breakpoint (1200×1600) upscales past the ~1086px-tall native
    // crop region, so confirm sharpness at that size once real files exist.
    breakpoints: [
      { width: 600, height: 800 },
    ],
    alt: "The Holiday Inn Express entrance canopy and lit lobby at dusk, the brand's green sign above the glass doors.",
    // Exact string already in use at components/nav/MenuOverlay.tsx:155 for
    // this same panel — kept identical so the two never drift.
    sizesAttr: "(min-width: 1024px) 38vw, 0px",
  },

  // ── #method chapter — dark-ground art replacing the retired engraving ──
  "method.chapter": {
    status: "delivered",
    slug: "hie-dusk",
    variant: "chapter",
    // ratio 4:3, matches the master's native orientation closely.
    breakpoints: [
      { width: 800, height: 600 },
      { width: 1200, height: 900 },
    ],
    alt: "Holiday Inn Express entrance at dusk, its lit canopy and glass lobby facing the street.",
    // Default guess: #method's layout is owned by another agent. Confirm
    // against the built split (art vs. stepper/reach-stats column) and
    // override here or at the call site if the real column width differs.
    sizesAttr: "(min-width: 1024px) 42vw, 100vw",
  },

  // ── #listings empty/no-photo ticket header ──
  "listing.placeholder": {
    status: "delivered",
    slug: "beachfront-aerial",
    variant: "card",
    breakpoints: [
      { width: 640, height: 427 },
    ],
    alt: "Aerial view of a beachfront hotel property, white towers set among palm trees along the sand.",
    // Same string as components/cards/ListingCard.tsx:83.
    sizesAttr: "(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw",
  },

  // ── #closings accent (D3/D4 area — not the retired-ticket photo itself) ──
  "closings.accent": {
    status: "delivered",
    slug: "marriott-tower",
    variant: "card",
    breakpoints: [
      { width: 640, height: 427 },
      { width: 1280, height: 853 },
    ],
    alt: "A Marriott-branded hotel tower with a warm sand-colored facade, its rooftop sign lit against a clear sky.",
    // Same string as components/cards/ClosingCard.tsx:66.
    sizesAttr: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  },

  // ── Calculator property-type tiles — 1:1 squares, five across desktop ──
  // (option-tile shape contract, DESIGN-REVISIT §3.8)
  "tile.limitedService": {
    status: "delivered",
    slug: "hie-dusk",
    variant: "tile",
    breakpoints: [
      { width: 400, height: 400 },
      { width: 800, height: 800 },
    ],
    alt: "Holiday Inn Express entrance canopy and lit lobby at dusk.",
    sizesAttr: "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  },
  "tile.selectService": {
    status: "delivered",
    slug: "select-service-dusk",
    variant: "tile",
    breakpoints: [
      { width: 400, height: 400 },
      { width: 800, height: 800 },
    ],
    alt: "A Hyatt Place hotel exterior at dusk, its vertical branded sign lit above the entrance with passing traffic light trails below.",
    sizesAttr: "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  },
  "tile.fullService": {
    status: "delivered",
    slug: "historic-urban-dawn",
    variant: "tile",
    breakpoints: [
      { width: 400, height: 400 },
      { width: 800, height: 800 },
    ],
    alt: "A historic-style hotel tower on a tree-lined city corner, its gold cornice and colonnade lit at dawn.",
    sizesAttr: "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  },
  "tile.resortBoutique": {
    status: "delivered",
    slug: "resort-pool-loungers",
    variant: "tile",
    breakpoints: [
      { width: 400, height: 400 },
      { width: 800, height: 800 },
    ],
    alt: "A resort pool deck with loungers and yellow umbrellas beneath the palms, a footbridge crossing the lagoon-style pool.",
    sizesAttr: "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  },
  "tile.extendedStay": {
    status: "blocked: awaiting-artwork",
    variant: "tile",
    targetWidths: [400, 800, 1200],
    note:
      "No artwork delivered for extended-stay. Do not fake it and do not reuse another tile's master as a stand-in — render the designed typographic interim (DESIGN-REVISIT §3 pieces-to-request table) until Razim supplies a 1:1 square ≥800×800.",
  },

  // ── Calculator market-tier panels — 5:2 wide, stacked full-width rows ──
  "tier.gateway": {
    status: "delivered",
    slug: "historic-urban-dawn",
    variant: "wide",
    breakpoints: [
      { width: 800, height: 320 },
      { width: 1600, height: 640 },
    ],
    alt: "A historic-style hotel tower on a tree-lined downtown street, its gold cornice and colonnade lit at dawn.",
    sizesAttr: "100vw",
  },
  "tier.secondary": {
    status: "delivered",
    slug: "grand-resort-arrival",
    variant: "wide",
    breakpoints: [
      { width: 800, height: 320 },
      { width: 1600, height: 640 },
    ],
    alt: "The palm-lined arrival drive of a grand resort, its arched entrances lit at dusk.",
    sizesAttr: "100vw",
  },
  "tier.suburban": {
    status: "delivered",
    slug: "marriott-tower",
    variant: "wide",
    breakpoints: [
      { width: 800, height: 320 },
    ],
    alt: "A Marriott-branded hotel tower with a sand-colored facade rising above the surrounding trees.",
    sizesAttr: "100vw",
  },
  "tier.tertiary": {
    status: "delivered",
    slug: "select-service-dusk",
    variant: "wide",
    breakpoints: [
      { width: 800, height: 320 },
      { width: 1600, height: 640 },
    ],
    alt: "A Hyatt Place hotel exterior at dusk, traffic light trails passing below its lit vertical sign.",
    sizesAttr: "100vw",
  },
} satisfies Record<ArtPlacement, ArtworkEntry>;

/* ---------------------------------------------------------------------------
   Resolver — the only thing a component should need to import.
   --------------------------------------------------------------------------- */

const ART_DIR = "/art";

/** `<slug>-<variant>-<width>`, the shared stem across the .avif/.webp/.jpg
 *  triplet the generation contract writes for one breakpoint. */
function artFileStem(entry: DeliveredArtwork, width: number): string {
  return `${entry.slug}-${entry.variant}-${width}`;
}

/** Props shape a component spreads straight onto `PhotoFrame`'s intrinsic
 *  mode (`src`/`alt`/`width`/`height`/`sizes`) — CLS 0, no layout guess. */
export type ResolvedArt = {
  src: string;
  width: number;
  height: number;
  sizes: string;
  alt: string;
};

/**
 * The manifest resolver. Returns the largest delivered breakpoint's `.jpg`
 * (the universal `next/image`-safe fallback; `.avif`/`.webp` siblings exist
 * at the same stem for a `<picture>`-based consumer — see `getArtSources`)
 * with real intrinsic width/height for zero-CLS `next/image` props.
 *
 * Returns `null` for a blocked placement — call `isArtDelivered` first (or
 * check for `null`) and render the section's designed interim instead of an
 * empty slot. Never render a broken `<img>`.
 */
export function getArt(placement: ArtPlacement): ResolvedArt | null {
  const entry = ART_MANIFEST[placement];
  if (entry.status !== "delivered") return null;

  const largest = entry.breakpoints[entry.breakpoints.length - 1];
  return {
    src: `${ART_DIR}/${artFileStem(entry, largest.width)}.jpg`,
    width: largest.width,
    height: largest.height,
    sizes: entry.sizesAttr,
    alt: entry.alt,
  };
}

/** True once a real asset backs this placement. Gate art-only UI on this,
 *  not on `getArt(...) !== null`, when you don't need the resolved props. */
export function isArtDelivered(placement: ArtPlacement): boolean {
  return ART_MANIFEST[placement].status === "delivered";
}

export type ArtSources = {
  /** `srcset`-ready string: `"/art/slug-variant-600.avif 600w, … 1200w"`. */
  avif: string;
  webp: string;
};

/**
 * Every generated breakpoint as ready-to-use `srcset` strings, for a future
 * `<picture>` component that wants real format negotiation instead of the
 * single-largest-file fallback `getArt` returns. `null` for a blocked
 * placement.
 */
export function getArtSources(placement: ArtPlacement): ArtSources | null {
  const entry = ART_MANIFEST[placement];
  if (entry.status !== "delivered") return null;

  const build = (ext: "avif" | "webp") =>
    entry.breakpoints
      .map((bp) => `${ART_DIR}/${artFileStem(entry, bp.width)}.${ext} ${bp.width}w`)
      .join(", ");

  return { avif: build("avif"), webp: build("webp") };
}
