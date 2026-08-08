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
 * alike).
 *
 * Server Component, zero client JS.
 *
 * ── Two variants, one brand line ─────────────────────────────────────────
 * `variant="text"` (default) — real text, `content/site.ts`'s `BRAND_LINE`
 * run through the `brand-line` utility (Inter, uppercase, 0.35em tracking,
 * `--accent-text`). This is what the header and footer should use: indexable,
 * screen-reader-native, correct on every surface/theme via `text-accent-text`
 * with zero extra markup.
 *
 * `variant="lockup"` — the theme's fixed SVG lockup
 * (`themePresentation.wordmark` from `@/lib/theme`, e.g.
 * `/brand/hokuten-wordmark-gold.svg`), real outlined type built once by
 * `scripts/og-gen.ts` so it renders identically everywhere a font isn't
 * guaranteed (social crawlers, image exports, print). For FIXED-lockup
 * contexts only — a cover/print-style panel where the exact glyph outlines
 * matter more than live text reflow; the header/footer use `variant="text"`.
 * Rendered as a plain `<img>`, matching `Stamp.tsx`'s own reasoning: the
 * default `next/image` loader can't optimise SVG anyway, so `<Image>` would
 * add machinery for zero bytes saved. `alt` carries the natural-case brand
 * name (`content/site.ts`'s `SITE_NAME`) rather than the tracked-caps
 * `BRAND_LINE` — unlike `Stamp` (which is always beside real brand text
 * already, so it can be `alt=""`), a standalone lockup IS the only rendering
 * of the brand name in its placement, so the image needs a real accessible
 * name.
 *
 * `WORDMARK_ASPECT` mirrors `scripts/og-gen.ts`'s `LOCKUP_ASPECT` exactly —
 * that script's own build-time assertion names this constant if the
 * typesetting ever drifts, so keep the two numbers in sync by hand.
 */

import { BRAND_LINE, SITE_NAME } from "@/content/site";
import { themePresentation } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Ink aspect ratio of the generated lockup SVG — scripts/og-gen.ts LOCKUP_ASPECT. */
export const WORDMARK_ASPECT = 22.093;

/** Sensible default rendered cap height for the lockup in UI contexts, px. */
const DEFAULT_LOCKUP_HEIGHT = 20;

export type WordmarkProps = {
  /** "text" (default, real text) or "lockup" (theme SVG, fixed contexts only). */
  variant?: "text" | "lockup";
  /** Element for the "text" variant. Ignored for "lockup" (always an `<img>`). */
  as?: "span" | "p" | "div";
  /** "lockup" variant only: rendered height, px. Width follows WORDMARK_ASPECT. */
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

  return <Tag className={cn("brand-line", className)}>{BRAND_LINE}</Tag>;
}
