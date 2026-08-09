/**
 * components/art/KanjiAccent.tsx — the reusable 北天 background-motif layer.
 *
 * Governed by DESIGN-REVISIT.md D5 ("The 北天 background-motif layer
 * (`<KanjiAccent>`, our own SVG) still ships and is still ours to build" —
 * distinct from the supplied glyph-mosaic photography, which this component
 * is NOT: this is flat, huge, near-invisible brand geometry, not imagery),
 * §3.5 ("huge outlined/low-opacity 北/天 glyphs (SVG paths, reuse the hanko
 * glyph geometry, never `<text>`), placed like OrbitalArcs: absolute,
 * aria-hidden, pointer-events-none, ≤8% opacity dark / ≤6% light, one per
 * section max"), docs/design/HANKO.md (source geometry), and the same
 * doctrine `components/art/OrbitalArcs.tsx` already ships under (this file's
 * structure mirrors that one on purpose — read it first if this is unclear).
 *
 * ── Why paths, never `<text>` ────────────────────────────────────────────
 * There is no CJK webfont on this site (see HANKO.md §2). A `<text>` glyph
 * resolves against whatever CJK font (if any) the visiting OS happens to
 * ship — tofu boxes on a machine with none, a wrong-look glyph on a machine
 * with one, and always wrong inside a headless render. Both characters below
 * are therefore vector outlines, lifted VERBATIM (coordinates only, not the
 * literal hex fill) from the character paths in `public/brand/hanko-gold.svg`
 * / `hanko-blue.svg` — the seven 北 paths and five 天 paths, EXCLUDING the six
 * border-wear paths (this is a typographic field motif, not a second seal).
 * Both hanko cuts share identical glyph coordinates (only the root `fill`
 * differs), so there is exactly one path set here, coloured by `currentColor`
 * — see the next section.
 *
 * ── Colour: currentColor, never a literal fill ───────────────────────────
 * No `fill="#…"` anywhere in this file (token law, P0). The `<g>` below reads
 * `fill="currentColor"` and sets no `color` of its own, so it inherits the
 * ambient `color: var(--fg)` every `.surface-*` scope already declares
 * (globals.css §3) — ivory on `.surface-dark`/`.surface-black`, ink
 * everywhere else, correct in both themes with zero per-theme branching here.
 *
 * ── Opacity: CSS ancestor selector, not a prop ───────────────────────────
 * Per the task brief: "Detect surface via the existing .surface-* scope
 * mechanism rather than a prop where you can." The base class applies the
 * light-surface ceiling (`--kanji-opacity-light`, 0.06); the compound
 * arbitrary-variant classes below — the SAME `[.surface-dark_&]:` /
 * `[.surface-black_&]:` descendant-selector pattern already shipping in
 * `ui/button.tsx`, `ui/field.tsx`, `ui/input.tsx`, `forms/BovForm.tsx` —
 * override it to the dark ceiling (`--kanji-opacity-dark`, 0.08) whenever a
 * `.surface-dark`/`.surface-black` ancestor exists ANYWHERE up the tree. That
 * compound selector is strictly higher specificity than the base single-class
 * rule (two classes vs one), so it wins regardless of Tailwind's internal
 * stylesheet ordering — verified against the same reasoning `button.tsx`
 * documents for its own `tone: "auto"` compound variant.
 *
 * KNOWN LIMITATION (inherited, not new): `[.surface-dark_&]` matches ANY
 * ancestor with that class, not the nearest one — so a `.surface-card` island
 * nested inside an outer `.surface-dark` chapter would still read as "dark"
 * here, same false positive `button.tsx`'s own header comment documents for
 * its `tone` escape hatch. `opacityMode` below is that same escape hatch,
 * ported to this component: leave it `"auto"` (the default, CSS-driven) in
 * every normal placement; pass `"light"`/`"dark"` only for that one nested-
 * surface exception, matching Button's `tone="light"|"dark"` convention.
 *
 * ── Placement, size, and why the parent needs nothing but a position ─────
 * The OUTER wrapper is `absolute inset-0 overflow-hidden` — exactly the
 * `OrbitalArcs` contract — so it clips its own oversized, deliberately
 * off-canvas-bleeding glyph internally. The parent section needs only a
 * positioning context (`position: relative`, or `isolate`, or already being
 * positioned some other way); it never needs its own `overflow-hidden`. Size
 * is a responsive `clamp()` computed server-side from the optional `scale`
 * multiplier (default 1) — no client JS, no ResizeObserver, no CSS `transform:
 * scale()` (which would fight the corner-anchoring translate below).
 *
 * ── Usage contract (discipline, not code-enforced — same posture as
 *    OrbitalArcs' "dark sections only" rule) ──────────────────────────────
 * 1. AT MOST ONE per section (§3.5). A second instance in the same section is
 *    a design regression, not a variant — the design audit checks for it.
 * 2. Render it FIRST among the section's children, immediately after the
 *    opening tag, so it paints behind real content by DOM order alone — no
 *    invented `z-index`, matching `OrbitalArcs`.
 * 3. Purely decorative, informationless field texture (unlike `HotelEngraving`,
 *    which depicts a specific building and therefore needs an adjacent
 *    visually-hidden description) — `aria-hidden` on the wrapper is the whole
 *    a11y footprint, nothing more is owed.
 * 4. Composable with `OrbitalArcs` on dark sections if a section wants both
 *    motifs, but prefer one accent layer per section in practice — two
 *    layered background devices compete for the same "quiet" register.
 *
 * Server Component. Renders zero client JS.
 */

import { cn } from "@/lib/utils";

/** The 北 (kita, "north") character — 7 filled paths, box x[18,82] y[15,44.3].
 *  Coordinates lifted verbatim from public/brand/hanko-gold.svg. */
const KITA_PATHS = [
  "M 29.4 15 L 36.2 15.3 L 35.9 44.2 L 29.2 43.9 Z",
  "M 18.2 21.6 L 36 21.9 L 36 27.5 L 18 27.2 Z",
  "M 18.4 37.8 L 36 34 L 36 39.6 L 18.2 43.4 Z",
  "M 55.8 15.2 L 62.5 15 L 62.3 44.2 L 55.7 44 Z",
  "M 55.8 38.4 L 82 38.6 L 81.8 44.3 L 55.7 44.1 Z",
  "M 75.4 30.4 L 82 30.2 L 82 44.3 L 75.5 44.3 Z",
  "M 81.6 18.9 L 41.8 29.5 L 42 34.8 L 81.9 24.6 Z",
] as const;

/** The 天 (ten, "sky") character — 5 filled paths, box x[18,82] y[54,86.2].
 *  Coordinates lifted verbatim from public/brand/hanko-gold.svg. */
const TEN_PATHS = [
  "M 25.8 54.2 L 74.2 54 L 74 60.1 L 25.6 60.3 Z",
  "M 18.2 64 L 82 63.8 L 81.8 70 L 18 70.2 Z",
  "M 47 54.2 L 53.6 54.2 L 51.4 70.1 L 46.4 70.1 Z",
  "M 46.6 68 L 51.6 68.2 L 26.6 86.2 L 20.8 85 Z",
  "M 49.4 68.2 L 54.6 68 L 79.2 85.2 L 73.4 86.2 Z",
] as const;

export type KanjiGlyph = "kita" | "ten" | "both";
export type KanjiPlacement = "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type KanjiAccentProps = {
  /** Which character(s) render. Default "both" — the full 北天 mark, stacked
   *  exactly as the hanko composes it (北 above 天, never side by side — see
   *  HANKO.md §2 on why side-by-side reads "Tenhoku"). */
  glyph?: KanjiGlyph;
  /** Which corner/edge the glyph anchors to and partially bleeds off of.
   *  Default "right" — the most common side-accent placement (§4.9's BOV
   *  brief, §4.6's calculator brief). */
  placement?: KanjiPlacement;
  /** Multiplies the default responsive size. 1 = default. Reasonable range
   *  ~0.6–1.6; nothing enforces the bound, oversized values are still clipped
   *  by the wrapper's own `overflow-hidden`. */
  scale?: number;
  /** Escape hatch for the one case CSS ancestor-detection gets wrong: a
   *  light `.surface-card`/`.surface-paper` island nested inside an outer
   *  `.surface-dark`/`.surface-black` chapter (or vice versa). Leave "auto"
   *  (default) everywhere else — see the header comment. */
  opacityMode?: "auto" | "light" | "dark";
  className?: string;
};

/** Tight per-glyph viewBoxes — bbox + ~3-unit padding on every side, so a
 *  single character or the stacked pair fills its box without excess air. */
const GLYPH_VIEWBOX: Record<KanjiGlyph, string> = {
  kita: "15 12 70 36",
  ten: "15 51 70 39",
  both: "15 12 70 78",
};

function glyphPaths(glyph: KanjiGlyph): readonly string[] {
  if (glyph === "kita") return KITA_PATHS;
  if (glyph === "ten") return TEN_PATHS;
  return [...KITA_PATHS, ...TEN_PATHS];
}

/** Anchors the glyph to a corner/edge and bleeds it partway off that edge —
 *  the wrapper's `overflow-hidden` clips whatever crosses the section
 *  boundary. Edges (`left`/`right`) centre vertically; corners pin to both
 *  axes. Plain Tailwind position/translate utilities — not colour, so the
 *  token gate does not apply. */
const PLACEMENT_CLASS: Record<KanjiPlacement, string> = {
  left: "top-1/2 left-0 -translate-x-[22%] -translate-y-1/2",
  right: "top-1/2 right-0 translate-x-[22%] -translate-y-1/2",
  "top-left": "top-0 left-0 -translate-x-[18%] -translate-y-[18%]",
  "top-right": "top-0 right-0 translate-x-[18%] -translate-y-[18%]",
  "bottom-left": "bottom-0 left-0 -translate-x-[18%] translate-y-[18%]",
  "bottom-right": "bottom-0 right-0 translate-x-[18%] translate-y-[18%]",
};

/** Responsive base size, in rem/vw, before the `scale` multiplier — computed
 *  server-side into a literal `clamp()` string (no CSS var arithmetic, no
 *  JS: clamp() cannot multiply a custom property by a prop at runtime, so the
 *  three numbers are resolved here instead). */
const BASE_MIN_REM = 14;
const BASE_PREFERRED_VW = 28;
const BASE_MAX_REM = 32;

function glyphSizeStyle(scale: number): { width: string; height: string } {
  return {
    width: `clamp(${BASE_MIN_REM * scale}rem, ${BASE_PREFERRED_VW * scale}vw, ${BASE_MAX_REM * scale}rem)`,
    height: "auto",
  };
}

const OPACITY_STYLE: Record<"light" | "dark", { opacity: string }> = {
  light: { opacity: "var(--kanji-opacity-light)" },
  dark: { opacity: "var(--kanji-opacity-dark)" },
};

export function KanjiAccent({
  glyph = "both",
  placement = "right",
  scale = 1,
  opacityMode = "auto",
  className,
}: KanjiAccentProps) {
  const paths = glyphPaths(glyph);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        viewBox={GLYPH_VIEWBOX[glyph]}
        preserveAspectRatio="xMidYMid meet"
        className={cn(
          "absolute block",
          PLACEMENT_CLASS[placement],
          // Auto mode: CSS ancestor detection (see header comment). Pinned
          // modes override via inline style below, which always wins.
          opacityMode === "auto" &&
            "opacity-[var(--kanji-opacity-light)] [.surface-dark_&]:opacity-[var(--kanji-opacity-dark)] [.surface-black_&]:opacity-[var(--kanji-opacity-dark)]",
        )}
        style={{
          ...glyphSizeStyle(scale),
          ...(opacityMode === "auto" ? {} : OPACITY_STYLE[opacityMode]),
        }}
      >
        <g fill="currentColor">
          {paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
