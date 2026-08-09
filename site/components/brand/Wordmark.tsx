/**
 * components/brand/Wordmark.tsx — the header/footer brand mark: "THE HOKUTEN
 * GROUP".
 *
 * Governed by hokuten-design-director ref 01 (Typography → tracked-caps
 * brand line; Lockups & usage), ref 03 (Type ramp → "Tracked brand line:
 * uppercase Inter, tracking 0.35em ... headers/footers only"), ref 04 (Nav →
 * "Hokuten wordmark left"), ref 07 (P0: real text, never a name baked into an
 * image — the Sarhan anti-pattern this brand explicitly avoids: a name
 * rendered only as pixels is invisible to SEO crawlers and screen readers
 * alike). D1 (Razim, 2026-08-08): "brand" variant added below — the
 * DESIGN-REVISIT.md §4.1 nav rebuild.
 *
 * Server Component, zero client JS of its own (no hooks, no "use client") —
 * still correct when a Client Component renders it directly (`SiteNav.tsx`
 * already did this before this round; Next.js bundles a directive-less
 * component into whichever tree imports it, and this one has nothing
 * server-only in it either way).
 *
 * ── Three variants, one brand line ───────────────────────────────────────
 * `variant="text"` (default) — real text, `content/site.ts`'s `BRAND_LINE`
 * run through the `brand-line` utility (Inter, uppercase, 0.35em tracking,
 * `--accent-text`). Indexable, screen-reader-native, correct on every
 * surface/theme via `text-accent-text` with zero extra markup.
 *
 * `variant="lockup"` — the theme's fixed SVG lockup
 * (`themePresentation.wordmark` from `@/lib/theme`, e.g.
 * `/brand/hokuten-wordmark-gold.svg`), real outlined type built once by
 * `scripts/og-gen.ts` so it renders identically everywhere a font isn't
 * guaranteed (social crawlers, image exports, print). For FIXED-lockup
 * contexts only — a cover/print-style panel where the exact glyph outlines
 * matter more than live text reflow (today: `HeroPlate.tsx`'s knockout
 * card). Rendered as a plain `<img>`, matching `Stamp.tsx`'s own reasoning:
 * the default `next/image` loader can't optimise SVG anyway, so `<Image>`
 * would add machinery for zero bytes saved. `alt` carries the natural-case
 * brand name (`content/site.ts`'s `SITE_NAME`) rather than the tracked-caps
 * `BRAND_LINE` — unlike `Stamp` (which is always beside real brand text
 * already, so it can be `alt=""`), a standalone lockup IS the only rendering
 * of the brand name in its placement, so the image needs a real accessible
 * name.
 *
 * `variant="brand"` (D1) — the header unit: the theme-matched KW COMMERCIAL /
 * THE HOKUTEN GROUP raster (`themePresentation.lockup`, a PNG — a DIFFERENT
 * asset from `variant="lockup"`'s SVG wordmark, hence the different variant
 * name rather than overloading "lockup") rendered through `next/image` at an
 * explicit width/height (CLS 0), plus a REAL-TEXT `BRAND_LINE` beside it.
 * The image is `alt=""` (decorative) — at the mandated 44px render height
 * the words baked into the raster are below legibility anyway (Razim,
 * 2026-08-08), so the adjacent text span, not the image, is what makes the
 * brand name indexable and screen-reader-native here (the Sarhan anti-
 * pattern this file's header already warns about). No `priority`: the hero
 * art band is the page's real LCP candidate (D5/D7) and this 44px mark
 * competing for the browser's fetch-priority hint would only slow that down.
 * `min-w-0`/`truncate` on the text span mean a caller can let this whole
 * unit sit in a shrinkable flex slot (the nav row on narrow viewports) —
 * the wordmark PNG never shrinks (`shrink-0`), only the text visually
 * truncates if space runs out; the full string stays in the accessibility
 * tree regardless (CSS `text-overflow: ellipsis` does not hide text from
 * assistive tech, only from the visual box).
 *
 * `WORDMARK_ASPECT` mirrors `scripts/og-gen.ts`'s `LOCKUP_ASPECT` exactly —
 * that script's own build-time assertion names this constant if the
 * typesetting ever drifts, so keep the two numbers in sync by hand.
 * `BRAND_LOCKUP_ASPECT` is the equivalent measurement for the D1 raster,
 * taken by Razim against the prepared crops (gold 669×501, blue 971×811 —
 * DESIGN-REVISIT.md §4.1). Keyed by theme even though only one theme ever
 * ships per build (`THEME` is resolved at build time from
 * `NEXT_PUBLIC_HOKUTEN_THEME`, `lib/theme.ts`) — this file has no other
 * reason to special-case a theme, and the alternative (hardcoding one
 * theme's ratio) would silently render the wrong aspect the day this repo's
 * build target flips from gold to blue.
 */

import Image from "next/image";

import { BRAND_LINE, SITE_NAME } from "@/content/site";
import { THEME, themePresentation, type HokutenTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Ink aspect ratio of the generated lockup SVG — scripts/og-gen.ts LOCKUP_ASPECT. */
export const WORDMARK_ASPECT = 22.093;

/** Sensible default rendered cap height for the lockup in UI contexts, px. */
const DEFAULT_LOCKUP_HEIGHT = 20;

/** Trimmed pixel aspect (width / height) of each theme's `variant="brand"`
 *  raster — see the file header for provenance. */
const BRAND_LOCKUP_ASPECT: Record<HokutenTheme, number> = {
  gold: 669 / 501,
  blue: 971 / 811,
};

export type WordmarkProps = {
  /** "text" (default, real text) · "lockup" (theme SVG, fixed print-style
   *  contexts) · "brand" (D1: theme lockup raster + adjacent real text — the
   *  nav header unit). */
  variant?: "text" | "lockup" | "brand";
  /** Element for the "text" variant. Ignored for "lockup"/"brand" (always an image). */
  as?: "span" | "p" | "div";
  /** "lockup"/"brand" variants only: rendered height, px. Width follows
   *  WORDMARK_ASPECT ("lockup") or BRAND_LOCKUP_ASPECT[THEME] ("brand"). */
  height?: number;
  className?: string;
};

export function Wordmark({
  variant = "text",
  as: Tag = "span",
  height = DEFAULT_LOCKUP_HEIGHT,
  className,
}: WordmarkProps) {
  if (variant === "lockup") {
    const width = Math.round(height * WORDMARK_ASPECT * 100) / 100;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- SVG outline lockup; next/image can't optimise SVG and would add machinery for zero bytes saved (matches Stamp.tsx).
      <img
        src={themePresentation.wordmark}
        alt={SITE_NAME}
        width={width}
        height={height}
        draggable={false}
        decoding="async"
        className={cn("block select-none", className)}
      />
    );
  }

  if (variant === "brand") {
    const width = Math.round(height * BRAND_LOCKUP_ASPECT[THEME]);
    return (
      <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
        <Image
          src={themePresentation.lockup}
          alt=""
          width={width}
          height={height}
          className="block shrink-0"
        />
        <span className="min-w-0 truncate brand-line text-micro">{BRAND_LINE}</span>
      </span>
    );
  }

  return <Tag className={cn("brand-line", className)}>{BRAND_LINE}</Tag>;
}
