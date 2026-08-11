/**
 * content/heroSlides.ts — the hero slideshow's typed manifest.
 *
 * SOURCE OF RECORD: docs/DESIGN-REVISIT-2.md §4.1 (crop spec) + D11 (slideshow
 * behavior) + D21 (Ref/ is never a runtime source) + docs/DESIGN-REVISIT-3.md
 * D23 (2026-08-10 evening — Razim's real hero triplets, superseding the
 * interim 「北天」-artwork build this file shipped earlier the same day).
 *
 * GENERATION CONTRACT (site/scripts/hero-prep.ts, run 2026-08-10 D23):
 *   site/public/hero/<id>-<breakpoint>-<width>.avif   — every surviving width
 *   site/public/hero/<id>-<breakpoint>-<width>.webp   — every surviving width
 *   site/public/hero/<id>-<breakpoint>-<width>.jpg    — LARGEST surviving width only
 *   site/public/hero/_manifest.json                   — every generated file's
 *                                                        real bytes/dimensions
 *   site/public/hero/_contact-sheet.jpg                — every slide x breakpoint,
 *                                                        labelled, verified by eye
 *
 * Every `widths`/`width`/`height` value below was cross-checked against the
 * real `site/public/hero/_manifest.json` produced by that D23 run — not
 * derived and left unverified.
 *
 * ── D23 status: `interim-resolution` — real crops, below ideal canvas ─────
 * Razim delivered all nine `Ref/hero/` files today (2026-08-10 evening),
 * correctly named, exact display ratios (`01-marriott`, `02-luxury`,
 * `03-resort`, each with `.desktop`/`.tablet`/`.mobile`). Every breakpoint of
 * every slide below is now `source: "triplet"` — real, art-directed
 * photography for that exact breakpoint, not a crop from an unrelated
 * 「北天」 glyph-mosaic master. `isInterim` is `false` on all three slides.
 *
 * The photography itself carries the site's own 「北天」 glyph-mosaic
 * treatment baked in by Razim before hand-off — this file's `alt` strings
 * describe the photographed SCENE (the hotel, the setting, the time of day),
 * written by looking at every one of the nine delivered files with the Read
 * tool, never the treatment (same alt-text law as `content/artwork.ts`).
 *
 * BUT: the delivered masters (1536–1672px wide) sit below the §4.1 IDEAL
 * canvas for every ratio (3200/2048/1600px ideal), and below the §4.1
 * MINIMUM canvas at several breakpoints too — `belowSpecMinimum` and
 * `belowSpecIdeal` below record exactly which, per breakpoint, straight from
 * the manifest. Consequence: every slide reads modestly soft above roughly
 * its own native width (~1536-1672px viewport width) — never upscaled past
 * it. Razim shipped this knowingly (DESIGN-REVISIT-3.md §D23: "these are
 * below the §4.1 ideal canvas... NEVER upscale"). Re-export the same crops at
 * the full §4.1 ideal canvas (3200x800 / 2048x896 / 1600x1200) when
 * convenient — tracked in docs/PLACEHOLDERS.md — is a pure data edit at that
 * point, same as this one was.
 *
 * ── Slide order / LCP ────────────────────────────────────────────────────
 *   1. marriott — a Marriott-branded tower shot from below at a corner angle
 *      under a clear midday sky. Slide 1 = the LCP image in BOTH themes
 *      (D23), matching the previous interim build's slide-1 LCP contract.
 *   2. luxury — a grand resort's palm-lined arrival court at dusk, twin
 *      colonnaded wings around a lit, symmetric entrance.
 *   3. resort — a resort's lagoon-style pool deck at midday, palms and
 *      loungers in front of a curved oceanfront tower.
 *
 * ── Alt-text law ─────────────────────────────────────────────────────────
 * `alt` describes the SCENE, never the 「北天」 glyph-mosaic treatment — same
 * law as content/artwork.ts.
 *
 * ── Theme eligibility ────────────────────────────────────────────────────
 * All three slides ship `theme: "both"` — Razim: "use that in both theme
 * sites." The art's own colours render unmodified in both themes (Hero.tsx's
 * own doctrine — "the art carries its own colours in both themes; nothing
 * here recolors it").
 *
 * ── content/artwork.ts note ──────────────────────────────────────────────
 * `content/artwork.ts`'s `hero.gold`/`hero.blue` placements are unused by
 * this file (and have been since the D11 interim build, before this D23
 * update) — Hero.tsx resolves art through this manifest's resolvers only.
 * Marking that retirement in `content/artwork.ts`'s own comments is that
 * file's owner's edit, not this one's.
 */

export type HeroBreakpoint = "desktop" | "tablet" | "mobile";
export type HeroTheme = "gold" | "blue" | "both";
export type HeroSlideStatus = "approved" | "blocked: missing-crop";
export type HeroSlideSourceKind = "triplet" | "interim-artwork";

/** The three slide ids this round's SLIDE_SLOTS registry defines (D23). A
 *  fourth or fifth slide (D11 supports up to 5) widens this union when it's
 *  added to `hero-prep.ts`'s SLIDE_SLOTS and this manifest, together, as one
 *  PR. */
export type HeroSlideId = "marriott" | "luxury" | "resort";

export type HeroSlideDerivative = {
  /** Real generated widths, ascending — srcset-ready as-is. */
  widths: number[];
  /** The largest generated width's real intrinsic dimensions (matches the
   *  breakpoint's display ratio exactly — 4:1 / 16:7 / 4:3). Zero-CLS pair. */
  width: number;
  height: number;
  /** Which real source THIS breakpoint used — resolved independently per
   *  D21 ("a missing breakpoint uses the documented fallback and never
   *  silently changes the crop"), so two breakpoints of the same slide can
   *  legitimately differ once a partial real triplet lands. */
  source: HeroSlideSourceKind;
  /** This breakpoint's crop ceiling sits below the §4.1 MINIMUM canvas for
   *  its ratio. Always false once `source` is `"triplet"` (a real triplet is
   *  assumed art-directed to spec; hero-prep.ts does not verify this). */
  belowSpecMinimum: boolean;
  /** Clears the minimum but not the full §4.1 IDEAL canvas. */
  belowSpecIdeal: boolean;
  /** Small object-position nudge, fractions of the SERVED (already-cropped)
   *  image, 0..1. Omitted = centered (50% 50%) — use `toObjectPosition()`. */
  focalPoint?: { x: number; y: number };
};

export type HeroSlide = {
  id: HeroSlideId;
  order: number;
  theme: HeroTheme;
  /** Describes the SCENE, never the glyph-mosaic treatment. */
  alt: string;
  status: HeroSlideStatus;
  /** True the moment ANY breakpoint of this slide used the interim-artwork
   *  fallback. Gate "this is a placeholder" UI on this, not on `status`. */
  isInterim: boolean;
  /** One human-readable line for a QA pass or a future `/art` review page —
   *  never recomputed from the breakpoint flags at render time. */
  note: string;
  breakpoints: Record<HeroBreakpoint, HeroSlideDerivative>;
};

/**
 * The manifest. Three slides today. Typed as `Record<HeroSlideId, HeroSlide>`
 * (not `satisfies`) — every field here shares one shape, so there is no
 * discriminated union to preserve; a plain annotation keeps every entry's
 * optional fields (e.g. `focalPoint`) uniformly optional rather than
 * literally absent on the branches that don't set them.
 */
export const HERO_SLIDES: Record<HeroSlideId, HeroSlide> = {
  marriott: {
    id: "marriott",
    order: 1,
    theme: "both",
    alt: 'A Marriott hotel tower seen from below at a corner angle, its cream façade and rows of guestroom windows rising into a clear blue midday sky, palm trees at the edge of frame and the Marriott "M" logo and signage near the roofline.',
    status: "approved",
    isInterim: false,
    note:
      "Real Ref/hero/01-marriott triplet (2026-08-10, D23). Desktop crop ceiling 1536px and tablet ceiling 1536px are both below the §4.1 minimum (2400px / 1600px); mobile ceiling 1365px clears the minimum but not the ideal (1600px). Below the §4.1 ideal canvas at every breakpoint — a real crop, modestly soft above its own native width, shipped knowingly (Razim, D23). Never upscale.",
    breakpoints: {
      desktop: {
        widths: [640, 1024, 1440],
        width: 1440,
        height: 360,
        source: "triplet",
        belowSpecMinimum: true,
        belowSpecIdeal: true,
      },
      tablet: {
        widths: [768, 1024],
        width: 1024,
        height: 448,
        source: "triplet",
        belowSpecMinimum: true,
        belowSpecIdeal: true,
      },
      mobile: {
        widths: [480, 750, 1050, 1200],
        width: 1200,
        height: 900,
        source: "triplet",
        belowSpecMinimum: false,
        belowSpecIdeal: true,
      },
    },
  },
  luxury: {
    id: "luxury",
    order: 2,
    theme: "both",
    alt: "A grand resort's palm-lined arrival court at dusk, twin colonnaded wings with green domed roofs flanking a paved promenade toward a lit entrance, warm illuminated windows against a soft sunset sky.",
    status: "approved",
    isInterim: false,
    note:
      "Real Ref/hero/02-luxury triplet (2026-08-10, D23). Desktop crop ceiling 1672px is below the §4.1 minimum (2400px); tablet ceiling 1672px and mobile ceiling 1254px both clear their minimum but not their ideal. Below the §4.1 ideal canvas at every breakpoint — a real crop, modestly soft above its own native width, shipped knowingly (Razim, D23). Never upscale.",
    breakpoints: {
      desktop: {
        widths: [640, 1024, 1440],
        width: 1440,
        height: 360,
        source: "triplet",
        belowSpecMinimum: true,
        belowSpecIdeal: true,
      },
      tablet: {
        widths: [768, 1024, 1600],
        width: 1600,
        height: 700,
        source: "triplet",
        belowSpecMinimum: false,
        belowSpecIdeal: true,
      },
      mobile: {
        widths: [480, 750, 1050, 1200],
        width: 1200,
        height: 900,
        source: "triplet",
        belowSpecMinimum: false,
        belowSpecIdeal: true,
      },
    },
  },
  resort: {
    id: "resort",
    order: 3,
    theme: "both",
    alt: "A resort's lagoon-style pool deck at midday, palm trees and shaded loungers along the water's edge, swimmers in the pool, and a curved oceanfront hotel tower rising behind the palms under a clear blue sky.",
    status: "approved",
    isInterim: false,
    note:
      "Real Ref/hero/03-resort triplet (2026-08-10, D23). Desktop crop ceiling 1672px is below the §4.1 minimum (2400px); tablet ceiling 1672px and mobile ceiling 1254px both clear their minimum but not their ideal. Below the §4.1 ideal canvas at every breakpoint — a real crop, modestly soft above its own native width, shipped knowingly (Razim, D23). Never upscale.",
    breakpoints: {
      desktop: {
        widths: [640, 1024, 1440],
        width: 1440,
        height: 360,
        source: "triplet",
        belowSpecMinimum: true,
        belowSpecIdeal: true,
      },
      tablet: {
        widths: [768, 1024, 1600],
        width: 1600,
        height: 700,
        source: "triplet",
        belowSpecMinimum: false,
        belowSpecIdeal: true,
      },
      mobile: {
        widths: [480, 750, 1050, 1200],
        width: 1200,
        height: 900,
        source: "triplet",
        belowSpecMinimum: false,
        belowSpecIdeal: true,
      },
    },
  },
} satisfies Record<HeroSlideId, HeroSlide>;

/* ---------------------------------------------------------------------------
   Resolvers — what a component should actually import.
   --------------------------------------------------------------------------- */

const HERO_DIR = "/hero";

function heroFileStem(id: HeroSlideId, breakpoint: HeroBreakpoint, width: number): string {
  return `${id}-${breakpoint}-${width}`;
}

/** CSS `object-position` for a slide's served (already-cropped) image at a
 *  given breakpoint. Defaults to centered when no focal point is recorded. */
export function toObjectPosition(focalPoint?: { x: number; y: number }): string {
  const fp = focalPoint ?? { x: 0.5, y: 0.5 };
  return `${(fp.x * 100).toFixed(1)}% ${(fp.y * 100).toFixed(1)}%`;
}

/** Props shape a component spreads onto `next/image`'s intrinsic mode
 *  (`src`/`alt`/`width`/`height`) plus `objectPosition` for the small focal
 *  nudge and `sizes` for a full-bleed band. `null` for an unknown id or a
 *  `blocked: missing-crop` slide — never render a broken `<img>`. */
export type ResolvedHeroSlide = {
  src: string;
  width: number;
  height: number;
  sizes: string;
  alt: string;
  objectPosition: string;
};

export function getHeroSlideArt(id: HeroSlideId, breakpoint: HeroBreakpoint): ResolvedHeroSlide | null {
  const slide = HERO_SLIDES[id];
  if (!slide || slide.status !== "approved") return null;
  const d = slide.breakpoints[breakpoint];
  return {
    src: `${HERO_DIR}/${heroFileStem(id, breakpoint, d.width)}.jpg`,
    width: d.width,
    height: d.height,
    sizes: "100vw",
    alt: slide.alt,
    objectPosition: toObjectPosition(d.focalPoint),
  };
}

export type HeroSlideSources = {
  /** `srcset`-ready string: `"/hero/id-desktop-640.avif 640w, … 1920w"`. */
  avif: string;
  webp: string;
};

/** Every generated width for one slide/breakpoint as ready-to-use `srcset`
 *  strings, for the real `<picture>` the slideshow renders. `null` for an
 *  unknown id or a `blocked: missing-crop` slide. */
export function getHeroSlideSources(id: HeroSlideId, breakpoint: HeroBreakpoint): HeroSlideSources | null {
  const slide = HERO_SLIDES[id];
  if (!slide || slide.status !== "approved") return null;
  const d = slide.breakpoints[breakpoint];
  const build = (ext: "avif" | "webp") => d.widths.map((w) => `${HERO_DIR}/${heroFileStem(id, breakpoint, w)}.${ext} ${w}w`).join(", ");
  return { avif: build("avif"), webp: build("webp") };
}

/** Every `approved` slide eligible for a theme, in display order. `"both"`-
 *  eligible slides appear for every theme. Skips `blocked: missing-crop`. */
export function getHeroSlidesForTheme(theme: "gold" | "blue"): HeroSlide[] {
  return Object.values(HERO_SLIDES)
    .filter((s) => s.status === "approved" && (s.theme === "both" || s.theme === theme))
    .sort((a, b) => a.order - b.order);
}

/** True once every breakpoint of this slide is a real Ref/hero triplet. */
export function isHeroSlideInterim(id: HeroSlideId): boolean {
  return HERO_SLIDES[id]?.isInterim ?? true;
}
