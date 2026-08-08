/**
 * ASCII hero art — the shared contract between the BUILD-TIME generator
 * (`site/scripts/ascii-gen.ts`) and the client canvas renderer.
 *
 * Spec of record: .agents/skills/hokuten-design-director/references/05-motion.md
 * ("ASCII hero" + "Ambient art loop"). Nothing here is computed in the browser —
 * the renderer only reads glyphs and paints them.
 *
 * ---------------------------------------------------------------------------
 * THE ONE INVARIANT
 *
 *     cells[i] === ramp[parseInt(lum[i], 36)]
 *
 * holds for EVERY index i, with exactly three documented exceptions:
 *   1. newline separators (`cells[i] === lum[i] === "\n"` — the strings are
 *      index-parallel, so `cells.length === lum.length` always);
 *   2. the 17 letter cells of `seamRow` that spell THE HOKUTEN GROUP;
 *   3. the cells listed in `wide` and their continuation cell (col + 1).
 *
 * A renderer that ignores exceptions 2 and 3 still produces a correctly
 * aligned grid — it just loses the seam wordmark and the CJK accents.
 * ---------------------------------------------------------------------------
 */

/** Palette key. Selected by `THEME_PRESENTATION[theme].artPalette` in lib/theme.ts. */
export type AsciiPalette = "gold" | "blue";

export type AsciiFrame = {
  /**
   * Rows joined by "\n". Each row is exactly `cols` glyphs wide in CELL units
   * (a double-width CJK accent occupies its own cell plus a blank
   * continuation cell, so the character count per row never drifts).
   */
  cells: string;
  /**
   * Index-parallel to `cells`: one base-36 digit per CELL giving the source
   * luminance bucket, and "\n" wherever `cells` has "\n".
   *
   * 0 = darkest source pixel, `levels - 1` = brightest. This is SOURCE
   * BRIGHTNESS, not ink — it is identical in meaning across both palettes, so
   * the colour rule below is the same code in both themes.
   */
  lum: string;
};

export type AsciiArt = {
  version: 1;
  palette: AsciiPalette;
  /** Source photo, for provenance. Repo-relative. */
  source: string;
  cols: number;
  rows: number;
  /**
   * cellHeight / cellWidth for the mono face — used to keep the image
   * un-squashed. The renderer must lay out cells at
   *   cellW = fontSize * (1 / charAspect)   // IBM Plex Mono advance = 0.6em
   *   cellH = cellW * charAspect            // line box pinned to 1.0em
   */
  charAspect: number;
  /**
   * Charset ordered DARK -> LIGHT **as rendered on this palette's ground**.
   * `ramp[0]` is the glyph that reads darkest, `ramp[levels - 1]` the lightest.
   *
   * Because the two palettes sit on opposite grounds, the same measured
   * ink-coverage ordering is emitted in opposite directions:
   *   gold  (glyphs on BLACK) — ramp ascends by ink coverage: " " ... "#"
   *   blue  (glyphs on COOL WHITE) — ramp descends by ink coverage: "#" ... " "
   * So `ramp[lum]` is always the correct glyph for that file. The renderer
   * never inverts anything.
   */
  ramp: string[];
  /** === ramp.length. Always <= 36 so one base-36 digit addresses a bucket. */
  levels: number;
  /**
   * Row index whose glyphs resolve into THE HOKUTEN GROUP. Lives in the art's
   * lower third, clear of the headline safe region. Stable and legible in
   * every frame.
   */
  seamRow: number;
  /**
   * [row, col] cells occupied by a double-width CJK accent glyph (北天ホクテン).
   * The cell to the right (col + 1) is a continuation and MUST NOT be drawn —
   * the generator writes a space there so naive renderers stay aligned.
   * Identical in every frame: the motif layer does not breathe.
   */
  wide: [number, number][];
  /** frames[0] is the base/static frame (and the SVG fallback); the rest are the ambient morph loop. */
  frames: AsciiFrame[];
  /** Playback rate for the loop. frames.length / fps = loop seconds. */
  fps: number;
};

/**
 * Colour rule — the canvas renderer and the emitted SVG fallback MUST agree.
 * t = lum / (levels - 1); identical thresholds in both palettes.
 *
 *   t <  0.34            -> var(--art-ink)
 *   0.34 <= t < 0.67     -> var(--art-mid)
 *   t >= 0.67            -> var(--art-light)
 *
 * On gold this runs gold -> gold-dim -> ivory against black; on blue it runs
 * deep blue -> mid blue -> wash against the cool-white plate. Low `lum` is the
 * high-contrast end on BOTH grounds, which is why the seam row's luminance is
 * pushed bright on gold and dark on blue by the generator.
 */
export const ASCII_TONE_STOPS = [0.34, 0.67] as const;

/** Resolve a luminance bucket to its CSS custom property name. */
export function asciiToneVar(lum: number, levels: number): string {
  const t = levels > 1 ? lum / (levels - 1) : 0;
  if (t < ASCII_TONE_STOPS[0]) return "--art-ink";
  if (t < ASCII_TONE_STOPS[1]) return "--art-mid";
  return "--art-light";
}

/** Emitted asset paths. The renderer hard-codes these. */
export const ASCII_ASSETS = {
  gold: { json: "/art/ascii-gold.json", svg: "/art/ascii-gold.svg" },
  blue: { json: "/art/ascii-blue.json", svg: "/art/ascii-blue.svg" },
} as const satisfies Record<AsciiPalette, { json: string; svg: string }>;

/**
 * The visually-hidden description that must sit next to the aria-hidden
 * canvas (ACCESSIBILITY LAW — the art is decorative, but what it depicts is
 * not allowed to be invisible to assistive tech).
 */
export const ASCII_ART_DESCRIPTION =
  "Character-grid rendering of the Holiday Inn Express Brooklyn, a Hokuten Group hotel closing, " +
  "drawn in HOKUTEN letters, digits and 北天 accent marks. One line of the image resolves into " +
  "the words THE HOKUTEN GROUP.";
