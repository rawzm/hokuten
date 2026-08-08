/**
 * AsciiCanvas — the site's ONE signature effect: the character-grid hotel study,
 * breathing on a single <canvas>, with a pointer-proximity shimmer.
 *
 * Spec of record:    .agents/skills/hokuten-design-director/references/05-motion.md
 *                    ("ASCII hero" + "Ambient art loop" + "Performance gates")
 * Contract of record: site/lib/ascii-types.ts
 * Budget of record:  HERO_BUDGET in site/lib/motion.ts
 *
 * ===========================================================================
 * THE SHAPE OF THIS COMPONENT
 * ===========================================================================
 * It is a progressive enhancement over `AsciiStatic`, not a replacement for it.
 * The server always emits the static SVG frame, so the art is on screen from
 * the first HTML byte (good LCP, zero CLS, correct with JS off). The canvas is
 * mounted on top only when the client is a fine-pointer device AND motion is
 * allowed, and it fetches the frame data only once the box is actually in the
 * viewport. Consequences, all of them deliberate:
 *
 *   - reduced motion / data-saver / global freeze → no canvas, no 585KB fetch,
 *     the SVG stands. That is the "designed static state", not a missing one.
 *   - touch / coarse pointer ("mobile") → same: the static frame, no rAF.
 *   - a consumer that hides this with `hidden lg:block` never intersects, so
 *     the JSON is never downloaded on the hidden breakpoint.
 *
 * DO NOT also render <AsciiStatic> next to this — it is already inside.
 *
 * ===========================================================================
 * HOW THE FRAME DATA IS HELD (the 585KB problem)
 * ===========================================================================
 * The JSON is fetched at runtime, never imported: importing it would put the
 * whole grid in the JS bundle and blow the 180KB landing budget on its own.
 *
 * Once fetched it is decoded into pre-allocated typed arrays and the JSON
 * strings are dropped. The decode leans on the contract's ONE INVARIANT —
 * `cells[i] === ramp[lum[i]]` everywhere except the seam letters and the
 * double-width accents — which means glyphs do not have to be stored per frame
 * at all:
 *
 *   - the glyph table starts with `ramp` in order, so for an ordinary cell the
 *     glyph slot IS its luminance bucket;
 *   - the handful of exception cells are frozen across every frame, so a single
 *     `override` array (built from frame 0) covers all of them.
 *
 * So the entire animation is one `Uint8Array` of luminance per frame. For the
 * shipped 160x64x28 asset that is ~287KB of buffer instead of ~1.2MB of strings,
 * and frames 1..n-1 never have their `cells` string touched.
 *
 * ===========================================================================
 * HOW IT PAINTS
 * ===========================================================================
 * Full repaint on mount / resize / webfont swap ONLY. Every other frame is a
 * dirty-rectangle pass: cells whose (glyph, colour) pair changed are queued in
 * a pre-allocated index ring, merged into per-row runs, and only those runs are
 * cleared and redrawn. Nothing inside the rAF loop allocates — no literals, no
 * closures, no string building, no `measureText`.
 *
 * The queue is drained under a TIME BUDGET (`HERO_BUDGET.frameBudgetMs`), not
 * all at once. That is load-bearing, not a nicety: an ambient frame step dirties
 * ~2,900 cells on average and 3,784 at worst, which is far too much text for one
 * 16ms frame on a mid-tier device. Because ambient steps are 250ms apart there
 * are ~15 rAF ticks to spend them over, so the morph is amortised and no single
 * frame is ever long enough to drop. Queue entries are re-resolved at draw time,
 * so a cell drained two ticks late still paints the CURRENT truth. Shimmer
 * changes are queued ahead of ambient ones, so pointer response never waits
 * behind a morph step.
 *
 * The loop runs only while the canvas is in the viewport (IntersectionObserver)
 * and, within that, does real work only when the ambient frame is due or the
 * pointer/shimmer is live. Off-screen it is cancelled outright.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  ASCII_ART_DESCRIPTION,
  ASCII_ASSETS,
  ASCII_TONE_STOPS,
  type AsciiArt,
  type AsciiPalette,
} from "@/lib/ascii-types";
import { HERO_BUDGET, freezeMotion, motionAllowed } from "@/lib/motion";
import { themePresentation } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { AsciiStatic } from "./AsciiStatic";

/* ===========================================================================
   Constants
   =========================================================================== */

/** `override[i]` when the cell is an ordinary ramp cell. */
const NO_OVERRIDE = 255;
/** `shimStep[i]` when the cell is not shimmering. */
const NO_SHIMMER = 255;
/** `paintedGlyph[i]` / `paintedColor[i]` before anything has been drawn. */
const UNPAINTED = 255;

/** Tone buckets in the contract's colour rule: ink · mid · light. */
const TONE_COUNT = 3;

/**
 * The 400ms shimmer decay is quantised into this many colour steps. Quantising
 * is what keeps the decay dirty-rect friendly: a shimmering cell is redrawn ~6
 * times over its life instead of ~24, and every blend colour is a string built
 * ONCE at mount (see `buildPalette`) rather than per frame.
 */
const SHIMMER_STEPS = 6;

/**
 * Hard ceiling on concurrently shimmering cells. At the shipped grid a 120px
 * disc covers ~600 cells and 20% of them shimmer, so this is ~7x headroom; it
 * exists so a pathological cell size can never turn the sweep into an O(grid)
 * walk.
 */
const MAX_ACTIVE_SHIMMER = 4096;

/**
 * Cells drawn between clock reads while draining the dirty queue. Reading
 * `performance.now()` per cell would itself be a measurable share of the budget.
 */
const DRAIN_CHECK_CELLS = 256;

/**
 * Baseline position inside the 1.0em cell, and the size the double-width CJK
 * accents are drawn at.
 *
 * `ascii-gen.ts` writes the SVG fallback with `y = row * LINE + LINE * 0.8`, so
 * 0.8 is the baseline that makes canvas and SVG agree cell-for-cell.
 *
 * The accents are drawn at 0.82em rather than the SVG's 1.0em-stretched-to-two-
 * cells. An ideographic glyph inks ~0.88em above the baseline, which at 1.0em
 * would poke ~8% of a cell into the row above — and anything that overflows its
 * cell is erased the moment its neighbour is dirty-cleared. At 0.82em the mark
 * sits entirely inside its own row and the dirty-rect invariant holds with no
 * guard rows, no clear padding and no draw ordering rules.
 */
const CELL_BASELINE = 0.8;
const WIDE_FONT_SCALE = 0.82;

/** Last-resort mono stack if `--font-mono` cannot be read off the canvas. */
const FALLBACK_MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
/** Appended for the CJK accents; mirrors the `.w` class in the generated SVG. */
const CJK_STACK = '"Hiragino Sans", "Noto Sans JP", "Yu Gothic", sans-serif';

/**
 * The kill switch is per SESSION, not per mount: once the hero has proven it
 * cannot hold frame budget on this device, remounting must not re-arm it.
 */
let sessionFrozen = false;

/* ===========================================================================
   Colour — read from the token sheet, never authored here
   =========================================================================== */

type Rgb = readonly [number, number, number];

function parseColor(input: string): Rgb | null {
  const s = input.trim();
  if (s.length === 0) return null;
  if (s.charCodeAt(0) === 35 /* # */) {
    const hex = s.slice(1);
    const short = hex.length === 3 || hex.length === 4;
    const long = hex.length === 6 || hex.length === 8;
    if (!short && !long) return null;
    const step = short ? 1 : 2;
    const out: number[] = [];
    for (let k = 0; k < 3; k += 1) {
      const part = hex.slice(k * step, k * step + step);
      const v = Number.parseInt(short ? part + part : part, 16);
      if (Number.isNaN(v)) return null;
      out.push(v);
    }
    return [out[0], out[1], out[2]] as const;
  }
  const m = /^rgba?\(([^)]*)\)$/i.exec(s);
  if (m === null) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some((v) => Number.isNaN(v))) return null;
  return [parts[0], parts[1], parts[2]] as const;
}

function mixString(a: Rgb, b: Rgb, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

type Palette = {
  /** [0..2] base tone colours, then the shimmer blends. Indexed by colour slot. */
  colors: string[];
  ground: string;
};

/**
 * Reads `--art-ink`, `--art-mid`, `--art-light` and `--art-ground` off the live
 * element, so the canvas is theme-correct without ever knowing which theme is
 * live — and so no colour literal exists in this file (token law).
 *
 * `--art-ink` doubles as the shimmer's ACCENT TINT. That is not a shortcut: on
 * gold it is the brand gold on black, on blue it is the deep indigo on the
 * cool-white plate. It is the chromatic end of the palette in both themes,
 * which is exactly what ref 05's "gold-tint" means, expressed theme-agnostically.
 *
 * Returns null if the sheet has not resolved — the caller then leaves the static
 * SVG in place rather than inventing a colour.
 */
function buildPalette(el: Element): Palette | null {
  const cs = getComputedStyle(el);
  const ink = cs.getPropertyValue("--art-ink").trim();
  const mid = cs.getPropertyValue("--art-mid").trim();
  const light = cs.getPropertyValue("--art-light").trim();
  const ground = cs.getPropertyValue("--art-ground").trim();
  if (!ink || !mid || !light || !ground) return null;

  const raw = [ink, mid, light];
  const rgb = raw.map(parseColor);
  const accent = rgb[0];

  const colors = new Array<string>(TONE_COUNT + TONE_COUNT * SHIMMER_STEPS);
  for (let tone = 0; tone < TONE_COUNT; tone += 1) colors[tone] = raw[tone];
  for (let tone = 0; tone < TONE_COUNT; tone += 1) {
    const base = rgb[tone];
    for (let step = 0; step < SHIMMER_STEPS; step += 1) {
      const slot = TONE_COUNT + tone * SHIMMER_STEPS + step;
      colors[slot] =
        accent && base
          ? mixString(accent, base, step / SHIMMER_STEPS)
          : // Unparseable token (a colour function we do not read): degrade to a
            // hard on/off tint instead of guessing an intermediate value.
            step === 0
            ? raw[0]
            : raw[tone];
    }
  }
  return { colors, ground };
}

/* ===========================================================================
   Decode — JSON contract -> typed arrays
   =========================================================================== */

type Decoded = {
  cols: number;
  rows: number;
  /** cols * rows */
  cells: number;
  charAspect: number;
  levels: number;
  frameCount: number;
  /** ms per ambient frame */
  frameMs: number;
  /** Glyph table. Slots 0..levels-1 ARE the ramp, in ramp order. */
  glyphs: string[];
  /** Slot of " ", or -1. Never drawn. */
  spaceSlot: number;
  /** Per frame: one luminance bucket per cell. */
  lum: Uint8Array[];
  /** Per cell: glyph slot for the frozen exception cells, else NO_OVERRIDE. */
  override: Uint8Array;
  /** Per luminance bucket: 0 ink · 1 mid · 2 light (the contract's colour rule). */
  tone: Uint8Array;
  /** Per cell: 1 if the shimmer may step this cell's glyph. */
  swappable: Uint8Array;
  /** Per cell: 0, or (ordinal + 1) if this is a double-width accent's first cell. */
  wideOrd: Uint8Array;
  /** Per cell: 1 if this is a continuation cell — never drawn, never dirty. */
  wideCont: Uint8Array;
  /** Cell index of each double-width accent, in ordinal order. */
  wideCells: Int32Array;
  wideCount: number;
};

function decode(art: AsciiArt): Decoded | null {
  if (art.version !== 1) return null;
  const cols = art.cols;
  const rows = art.rows;
  const levels = art.levels;
  const frameCount = art.frames.length;
  if (!(cols > 0 && rows > 0 && levels > 1 && levels <= 36 && frameCount > 0)) return null;
  if (!(art.charAspect > 0) || !(art.fps > 0)) return null;
  if (art.ramp.length !== levels) return null;
  const n = cols * rows;

  // Glyph table: the ramp occupies slots 0..levels-1 IN ORDER, which is what
  // lets an ordinary cell use its luminance bucket as its glyph slot directly.
  const glyphs = art.ramp.slice();
  const slotOf = new Map<string, number>();
  for (let i = 0; i < levels; i += 1) if (!slotOf.has(glyphs[i])) slotOf.set(glyphs[i], i);

  // base-36 digit -> bucket, as a charCode table (avoids ~300k parseInt calls).
  const digit = new Int16Array(128).fill(-1);
  for (let v = 0; v < levels; v += 1) digit[v.toString(36).charCodeAt(0)] = v;

  const lum: Uint8Array[] = [];
  for (let f = 0; f < frameCount; f += 1) {
    const src = art.frames[f].lum;
    const out = new Uint8Array(n);
    let w = 0;
    for (let k = 0; k < src.length; k += 1) {
      const code = src.charCodeAt(k);
      if (code === 10) continue; // row separator
      if (w >= n) return null;
      const v = code < 128 ? digit[code] : -1;
      if (v < 0) return null;
      out[w] = v;
      w += 1;
    }
    if (w !== n) return null;
    lum.push(out);
  }

  // Exception cells, read ONCE off frame 0. The generator freezes both the
  // glyph and the luminance of every exception cell across the whole loop, so
  // frame 0 describes all of them (verified against the shipped assets).
  const override = new Uint8Array(n).fill(NO_OVERRIDE);
  {
    const src = art.frames[0].cells;
    const base = lum[0];
    let w = 0;
    for (let k = 0; k < src.length; k += 1) {
      const ch = src[k];
      if (ch === "\n") continue;
      if (w >= n) return null;
      if (ch !== glyphs[base[w]]) {
        let slot = slotOf.get(ch);
        if (slot === undefined) {
          slot = glyphs.length;
          glyphs.push(ch);
          slotOf.set(ch, slot);
        }
        override[w] = slot;
      }
      w += 1;
    }
    if (w !== n) return null;
  }
  // A glyph slot has to coexist with the 255 sentinels inside a Uint8Array.
  if (glyphs.length >= NO_OVERRIDE) return null;

  const tone = new Uint8Array(levels);
  for (let v = 0; v < levels; v += 1) {
    const t = v / (levels - 1);
    tone[v] = t < ASCII_TONE_STOPS[0] ? 0 : t < ASCII_TONE_STOPS[1] ? 1 : 2;
  }

  const wideOrd = new Uint8Array(n);
  const wideCont = new Uint8Array(n);
  const wideCells = new Int32Array(art.wide.length);
  let wideCount = 0;
  for (let k = 0; k < art.wide.length; k += 1) {
    const r = art.wide[k][0];
    const c = art.wide[k][1];
    if (r < 0 || r >= rows || c < 0 || c + 1 >= cols) continue;
    if (wideCount >= 254) break;
    const i = r * cols + c;
    wideCells[wideCount] = i;
    wideCount += 1;
    wideOrd[i] = wideCount; // ordinal + 1, so 0 means "not wide"
    wideCont[i + 1] = 1;
  }

  // Which cells the shimmer is allowed to step one luminance bucket.
  //
  // The WHOLE seam row is excluded, not just its 15 letter cells: the contract
  // does not publish the letter columns, and a letter can coincidentally equal
  // `ramp[lum]` (it does in the shipped assets), so column-level detection would
  // miss it. 160 cells out of 10,240 is invisible; a corrupted THE HOKUTEN
  // GROUP is not.
  const swappable = new Uint8Array(n);
  const seamStart = art.seamRow * cols;
  const seamEnd = seamStart + cols;
  for (let i = 0; i < n; i += 1) {
    if (i >= seamStart && i < seamEnd) continue;
    if (override[i] !== NO_OVERRIDE) continue;
    if (wideCont[i]) continue;
    swappable[i] = 1;
  }

  return {
    cols,
    rows,
    cells: n,
    charAspect: art.charAspect,
    levels,
    frameCount,
    frameMs: 1000 / Math.min(art.fps, HERO_BUDGET.loopFps),
    glyphs,
    spaceSlot: slotOf.get(" ") ?? -1,
    lum,
    override,
    tone,
    swappable,
    wideOrd,
    wideCont,
    wideCells,
    wideCount,
  };
}

/* ===========================================================================
   Runtime buffers
   =========================================================================== */

type Engine = {
  d: Decoded;
  /** What is currently ON the canvas, per cell. The dirty test compares to it. */
  paintedGlyph: Uint8Array;
  paintedColor: Uint8Array;
  /** Shimmer: current decay step, luminance direction, expiry timestamp. */
  shimStep: Uint8Array;
  shimDir: Int8Array;
  shimEnd: Float64Array;
  /** 1 while the cell is inside the pointer disc — the edge is what seeds. */
  inRadius: Uint8Array;
  /** Compact list of shimmering cells (no scan of the full grid per frame). */
  active: Int32Array;
  /** Cells the sweep touched this tick. */
  cand: Int32Array;
  /** FIFO of cells waiting to be redrawn. Drained under a per-tick time budget. */
  dirty: Int32Array;
  /** 1 while a cell is sitting in `dirty`, so it is never queued twice. */
  dirtyMask: Uint8Array;
  /** Per double-width accent: x offset that centres it in its two-cell slot. */
  wideX: Float32Array;
};

function createEngine(d: Decoded): Engine {
  const n = d.cells;
  return {
    d,
    paintedGlyph: new Uint8Array(n).fill(UNPAINTED),
    paintedColor: new Uint8Array(n).fill(UNPAINTED),
    shimStep: new Uint8Array(n).fill(NO_SHIMMER),
    shimDir: new Int8Array(n),
    shimEnd: new Float64Array(n),
    inRadius: new Uint8Array(n),
    active: new Int32Array(MAX_ACTIVE_SHIMMER),
    cand: new Int32Array(MAX_ACTIVE_SHIMMER),
    dirty: new Int32Array(n),
    dirtyMask: new Uint8Array(n),
    wideX: new Float32Array(Math.max(1, d.wideCount)),
  };
}

/* ===========================================================================
   Component
   =========================================================================== */

export type AsciiCanvasProps = {
  /** Defaults to the palette this build's theme selected. */
  palette?: AsciiPalette;
  /** Classes for the wrapper (it is `relative` and paints `--art-ground`). */
  className?: string;
  /**
   * `false` (default): the static frame sits in normal flow and reserves the
   * box from its own intrinsic 960x640 — zero CLS with no ratio guessing.
   * `true`: the parent owns the box (give the wrapper a height, or place it
   * `absolute inset-0`); the art letterboxes inside it, `xMidYMid meet`, exactly
   * like the SVG.
   */
  fill?: boolean;
  /** Override only if the art asset is regenerated from a different photograph. */
  description?: string;
};

export function AsciiCanvas({
  palette = themePresentation.artPalette,
  className,
  fill = false,
  description = ASCII_ART_DESCRIPTION,
}: AsciiCanvasProps) {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enhance, setEnhance] = useState(false);

  // Decide whether the canvas is mounted at all. Deliberately an effect: it
  // reads matchMedia + prefers-reduced-motion, neither of which exists on the
  // server, so the first client render must match the server's (SVG only).
  useEffect(() => {
    if (sessionFrozen) {
      setEnhance(false);
      return;
    }
    if (!motionAllowed(prefersReduced)) {
      setEnhance(false);
      return;
    }
    // Pointer devices only (ref 05). Also the "mobile → static frame" rule:
    // a coarse pointer is the honest signal, not a width breakpoint.
    setEnhance(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, [prefersReduced]);

  useEffect(() => {
    if (!enhance) return;
    const wrapNode = wrapRef.current;
    const canvasNode = canvasRef.current;
    if (!wrapNode || !canvasNode) return;
    const ctxNode = canvasNode.getContext("2d");
    if (!ctxNode) return;
    // Re-bound with non-nullable declared types: the render helpers below are
    // hoisted function declarations, and TS will not carry a narrowing into a
    // hoisted closure.
    const wrap: HTMLDivElement = wrapNode;
    const canvas: HTMLCanvasElement = canvasNode;
    const ctx: CanvasRenderingContext2D = ctxNode;

    const paletteTokens = buildPalette(canvas);
    if (!paletteTokens) return; // token sheet unresolved: keep the static frame
    const colors = paletteTokens.colors;
    const ground = paletteTokens.ground;

    const resolvedFamily = getComputedStyle(canvas).fontFamily || FALLBACK_MONO;
    const familyLatin = resolvedFamily;
    const familyWide = `${resolvedFamily}, ${CJK_STACK}`;

    const abort = new AbortController();

    /* --- machine state ---------------------------------------------------- */
    let engine: Engine | null = null;
    let raf = 0;
    let running = false;
    let inView = false;
    let frozen = false;
    let started = false;
    let needsRepaint = true;
    let boxW = 0;
    let boxH = 0;

    let cellW = 0;
    let cellH = 0;
    let offX = 0;
    let offY = 0;
    let fontLatin = "";
    let fontWide = "";

    let frameIndex = 0;
    let lastFrameAt = 0;
    let overruns = 0;

    let pointerInside = false;
    let pendingLeave = false;
    let px = 0;
    let py = 0;
    let prevPx = 0;
    let prevPy = 0;

    let activeCount = 0;
    let candCount = 0;
    let dirtyHead = 0;
    let dirtyTail = 0;

    // Scratch return pair for `resolve` — an out-param instead of an object.
    let outGlyph = 0;
    let outColor = 0;

    // Scratch bounds written by `computeBounds` — module-free, allocation-free.
    let b0r = 0;
    let b1r = 0;
    let b0c = 0;
    let b1c = 0;

    const shimmerStepMs = HERO_BUDGET.shimmerDecay / SHIMMER_STEPS;

    /* --- geometry: measured ONCE per resize, never per frame --------------- */

    function applyResize(eg: Engine) {
      const d = eg.d;
      const dpr = Math.min(window.devicePixelRatio || 1, HERO_BUDGET.maxDpr);
      const bw = Math.max(1, Math.round(boxW * dpr));
      const bh = Math.max(1, Math.round(boxH * dpr));
      if (canvas.width !== bw) canvas.width = bw;
      if (canvas.height !== bh) canvas.height = bh;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fit the grid inside the box without squashing it: cellH = cellW * charAspect.
      const byWidth = boxW / d.cols;
      const byHeight = boxH / (d.rows * d.charAspect);
      cellW = Math.min(byWidth, byHeight);
      cellH = cellW * d.charAspect;
      offX = (boxW - d.cols * cellW) / 2;
      offY = (boxH - d.rows * cellH) / 2;

      // The mono line box is pinned to 1.0em, so the font size IS the cell height.
      fontLatin = `${cellH}px ${familyLatin}`;
      fontWide = `${cellH * WIDE_FONT_SCALE}px ${familyWide}`;

      // measureText allocates a TextMetrics; that is why it lives here, in the
      // once-per-resize path, and never in the rAF loop.
      ctx.font = fontWide;
      for (let k = 0; k < d.wideCount; k += 1) {
        const slot = d.override[d.wideCells[k]];
        const w = slot === NO_OVERRIDE ? 0 : ctx.measureText(d.glyphs[slot]).width;
        eg.wideX[k] = (2 * cellW - w) / 2;
      }
      ctx.font = fontLatin;
    }

    /* --- resolve / queue / drain ------------------------------------------ */

    /**
     * The one place a cell's appearance is decided, written into the scratch
     * pair below so nothing allocates. Called from the scan (to test for change)
     * and again from the drain (so a queue entry always paints current truth).
     */
    function resolve(eg: Engine, i: number) {
      const d = eg.d;
      const lu = d.lum[frameIndex][i];
      const st = eg.shimStep[i];
      let g = d.override[i];
      if (st === NO_SHIMMER) {
        if (g === NO_OVERRIDE) g = lu;
        outGlyph = g;
        outColor = d.tone[lu];
        return;
      }
      if (g === NO_OVERRIDE) {
        let stepped = lu;
        // Frozen cells (the wordmark row, the CJK accents) tint but never step.
        if (d.swappable[i]) {
          stepped = lu + eg.shimDir[i];
          if (stepped < 0) stepped = 0;
          else if (stepped > d.levels - 1) stepped = d.levels - 1;
        }
        g = stepped;
      }
      outGlyph = g;
      outColor = TONE_COUNT + d.tone[lu] * SHIMMER_STEPS + st;
    }

    /**
     * Queue every cell in `list` (or the whole grid when `list` is null) whose
     * appearance no longer matches what is on the canvas.
     */
    function scan(eg: Engine, list: Int32Array | null, count: number) {
      const d = eg.d;
      const cells = d.cells;
      const wideCont = d.wideCont;
      const paintedGlyph = eg.paintedGlyph;
      const paintedColor = eg.paintedColor;
      const dirty = eg.dirty;
      const dirtyMask = eg.dirtyMask;
      const total = list === null ? cells : count;

      for (let k = 0; k < total; k += 1) {
        const i = list === null ? k : list[k];
        if (wideCont[i]) continue; // continuation cells are never drawn
        if (dirtyMask[i]) continue; // already waiting; it re-resolves on drain
        resolve(eg, i);
        if (outGlyph === paintedGlyph[i] && outColor === paintedColor[i]) continue;
        if (dirtyTail >= cells) break; // cannot happen while the mask dedupes
        dirtyMask[i] = 1;
        dirty[dirtyTail] = i;
        dirtyTail += 1;
      }
    }

    /**
     * Redraw queued cells as merged per-row runs until the time budget is spent.
     * `alreadyCleared` is true only for a full repaint, where the whole canvas
     * has just been flooded with the ground colour and per-run clears would be
     * pure waste.
     */
    function drain(eg: Engine, budgetMs: number, startedAt: number, alreadyCleared: boolean) {
      const d = eg.d;
      const cols = d.cols;
      const glyphs = d.glyphs;
      const spaceSlot = d.spaceSlot;
      const wideOrd = d.wideOrd;
      const paintedGlyph = eg.paintedGlyph;
      const paintedColor = eg.paintedColor;
      const dirty = eg.dirty;
      const dirtyMask = eg.dirtyMask;
      const wideX = eg.wideX;
      const wideMax = 2 * cellW;

      ctx.font = fontLatin;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      let curColor = -1;
      let sinceCheck = 0;
      while (dirtyHead < dirtyTail) {
        const start = dirty[dirtyHead];
        const row = (start / cols) | 0;
        const rowStart = row * cols;
        let end = start;
        dirtyHead += 1;
        // Merge the run. A double-width accent always terminates a run, because
        // its continuation cell can never be queued.
        while (
          dirtyHead < dirtyTail &&
          dirty[dirtyHead] === end + 1 &&
          dirty[dirtyHead] - rowStart < cols
        ) {
          end = dirty[dirtyHead];
          dirtyHead += 1;
        }
        const top = offY + row * cellH;
        const baseY = top + cellH * CELL_BASELINE;
        if (!alreadyCleared) {
          // A trailing accent owns the blank cell to its right; clear both.
          const span = end - start + 1 + (wideOrd[end] ? 1 : 0);
          ctx.fillStyle = ground;
          ctx.fillRect(offX + (start - rowStart) * cellW, top, span * cellW, cellH);
          curColor = -1;
        }
        for (let i = start; i <= end; i += 1) {
          dirtyMask[i] = 0;
          resolve(eg, i);
          paintedGlyph[i] = outGlyph;
          paintedColor[i] = outColor;
          if (outGlyph === spaceSlot) continue;
          if (outColor !== curColor) {
            ctx.fillStyle = colors[outColor];
            curColor = outColor;
          }
          const x = offX + (i - rowStart) * cellW;
          const ord = wideOrd[i];
          if (ord) {
            ctx.font = fontWide;
            ctx.fillText(glyphs[outGlyph], x + wideX[ord - 1], baseY, wideMax);
            ctx.font = fontLatin;
          } else {
            // maxWidth pins the glyph inside its own cell: a substituted face
            // wider than 0.6em would otherwise bleed into the neighbouring cell
            // and get sheared off when that cell is cleared.
            ctx.fillText(glyphs[outGlyph], x, baseY, cellW);
          }
        }
        sinceCheck += end - start + 1;
        if (sinceCheck >= DRAIN_CHECK_CELLS) {
          sinceCheck = 0;
          if (performance.now() - startedAt >= budgetMs) break;
        }
      }

      // Compact the ring so `dirtyTail` is always bounded by the cell count.
      if (dirtyHead >= dirtyTail) {
        dirtyHead = 0;
        dirtyTail = 0;
      } else if (dirtyHead > 0) {
        dirty.copyWithin(0, dirtyHead, dirtyTail);
        dirtyTail -= dirtyHead;
        dirtyHead = 0;
      }
    }

    /**
     * Mount / resize / webfont swap. Unsliced on purpose: this is the "drawn
     * once" pass, the static SVG is still visible underneath until it lands, and
     * a half-painted grid is not a state anybody designed.
     */
    function fullRepaint(eg: Engine) {
      ctx.fillStyle = ground;
      ctx.fillRect(0, 0, boxW, boxH);
      eg.paintedGlyph.fill(UNPAINTED);
      eg.paintedColor.fill(UNPAINTED);
      eg.dirtyMask.fill(0);
      dirtyHead = 0;
      dirtyTail = 0;
      scan(eg, null, 0);
      drain(eg, Number.POSITIVE_INFINITY, 0, true);
    }

    /* --- shimmer ---------------------------------------------------------- */

    /**
     * Grid bounds covering BOTH the previous and the current pointer disc, so a
     * cell that just left the disc is revisited and un-flagged in the same pass.
     * Anything outside this box was outside the disc last tick and is outside it
     * now, so its flag is already correct.
     */
    function computeBounds(d: Decoded) {
      const rad = HERO_BUDGET.shimmerRadius;
      const minX = (px < prevPx ? px : prevPx) - rad;
      const maxX = (px > prevPx ? px : prevPx) + rad;
      const minY = (py < prevPy ? py : prevPy) - rad;
      const maxY = (py > prevPy ? py : prevPy) + rad;
      b0c = Math.floor((minX - offX) / cellW);
      b1c = Math.ceil((maxX - offX) / cellW);
      b0r = Math.floor((minY - offY) / cellH);
      b1r = Math.ceil((maxY - offY) / cellH);
      if (b0c < 0) b0c = 0;
      if (b0r < 0) b0r = 0;
      if (b1c > d.cols) b1c = d.cols;
      if (b1r > d.rows) b1r = d.rows;
    }

    function seed(eg: Engine, now: number) {
      const d = eg.d;
      computeBounds(d);
      const rad = HERO_BUDGET.shimmerRadius;
      const r2 = rad * rad;
      const until = now + HERO_BUDGET.shimmerDecay;
      const inRadius = eg.inRadius;
      const shimStep = eg.shimStep;
      const shimDir = eg.shimDir;
      const shimEnd = eg.shimEnd;
      const active = eg.active;
      for (let r = b0r; r < b1r; r += 1) {
        const dy = offY + (r + 0.5) * cellH - py;
        const dy2 = dy * dy;
        const rowStart = r * d.cols;
        for (let c = b0c; c < b1c; c += 1) {
          const dx = offX + (c + 0.5) * cellW - px;
          const i = rowStart + c;
          const inside = dx * dx + dy2 <= r2 ? 1 : 0;
          if (inside === inRadius[i]) continue;
          inRadius[i] = inside;
          if (inside === 0) continue;
          // One roll per ENTRY into the disc — not per frame, or the whole disc
          // would shimmer within a few frames instead of one glyph in five.
          if (shimStep[i] !== NO_SHIMMER) continue;
          if (activeCount >= MAX_ACTIVE_SHIMMER) continue;
          if (Math.random() >= HERO_BUDGET.shimmerProbability) continue;
          shimStep[i] = 0;
          shimDir[i] = Math.random() < 0.5 ? -1 : 1;
          shimEnd[i] = until;
          active[activeCount] = i;
          activeCount += 1;
        }
      }
      prevPx = px;
      prevPy = py;
    }

    function clearRadius(eg: Engine) {
      const d = eg.d;
      computeBounds(d);
      const inRadius = eg.inRadius;
      for (let r = b0r; r < b1r; r += 1) {
        const rowStart = r * d.cols;
        for (let c = b0c; c < b1c; c += 1) inRadius[rowStart + c] = 0;
      }
      prevPx = px;
      prevPy = py;
    }

    /** Advance every live shimmer one tick and collect the cells it touched. */
    function sweep(eg: Engine, now: number) {
      candCount = 0;
      const shimStep = eg.shimStep;
      const shimEnd = eg.shimEnd;
      const active = eg.active;
      const cand = eg.cand;
      let k = 0;
      while (k < activeCount) {
        const i = active[k];
        const remain = shimEnd[i] - now;
        if (remain <= 0) {
          shimStep[i] = NO_SHIMMER;
          activeCount -= 1;
          active[k] = active[activeCount];
          cand[candCount] = i;
          candCount += 1;
          continue;
        }
        let step = SHIMMER_STEPS - 1 - ((remain / shimmerStepMs) | 0);
        if (step < 0) step = 0;
        else if (step >= SHIMMER_STEPS) step = SHIMMER_STEPS - 1;
        shimStep[i] = step;
        cand[candCount] = i;
        candCount += 1;
        k += 1;
      }
    }

    /* --- kill switch ------------------------------------------------------ */

    function kill(eg: Engine) {
      frozen = true;
      sessionFrozen = true;
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      // Settle on the honest static frame — the same one the SVG shows.
      frameIndex = 0;
      eg.shimStep.fill(NO_SHIMMER);
      eg.inRadius.fill(0);
      activeCount = 0;
      pointerInside = false;
      pendingLeave = false;
      fullRepaint(eg);
      freezeMotion();
    }

    /* --- the loop --------------------------------------------------------- */

    function tick(now: number) {
      raf = 0;
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const eg = engine;
      if (eg === null || boxW <= 0 || boxH <= 0) return;

      // Full repaints (mount, resize, webfont swap) are deliberately outside the
      // kill-switch accounting: the switch guards the steady-state loop.
      if (needsRepaint) {
        needsRepaint = false;
        applyResize(eg);
        fullRepaint(eg);
        lastFrameAt = now;
        return;
      }

      const dueFrame = eg.d.frameCount > 1 && now - lastFrameAt >= eg.d.frameMs;
      const live = pointerInside || pendingLeave || activeCount > 0;
      if (!dueFrame && !live && dirtyHead >= dirtyTail) return; // idle: no work

      const t0 = performance.now();

      if (dueFrame) {
        frameIndex += 1;
        if (frameIndex >= eg.d.frameCount) frameIndex = 0;
        lastFrameAt = now;
      }
      if (pendingLeave) {
        pendingLeave = false;
        clearRadius(eg);
      } else if (pointerInside) {
        seed(eg, now);
      }
      sweep(eg, now);

      // Shimmer first, so pointer response is never stuck behind a morph step.
      scan(eg, eg.cand, candCount);
      // A frame step can change any cell, so it has to consider the whole grid.
      if (dueFrame) scan(eg, null, 0);
      drain(eg, HERO_BUDGET.frameBudgetMs, t0, false);

      if (performance.now() - t0 > HERO_BUDGET.killFrameMs) {
        overruns += 1;
        if (overruns >= HERO_BUDGET.killConsecutiveFrames) kill(eg);
      } else {
        overruns = 0;
      }
    }

    function sync() {
      const want = engine !== null && inView && !frozen;
      if (want === running) return;
      running = want;
      if (want) {
        lastFrameAt = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    /* --- load ------------------------------------------------------------- */

    async function begin() {
      try {
        const res = await fetch(ASCII_ASSETS[palette].json, { signal: abort.signal });
        if (!res.ok) return;
        const art = (await res.json()) as AsciiArt;
        if (abort.signal.aborted) return;
        const decoded = decode(art);
        if (!decoded) return;
        const eg = createEngine(decoded);
        // Metrics depend on the webfont; painting before it lands would leave
        // stale pixels that a dirty-rect renderer never revisits.
        if (document.fonts) await document.fonts.ready;
        if (abort.signal.aborted) return;
        engine = eg;
        needsRepaint = true;
        sync();
      } catch {
        // Network/parse failure is not an error state for the user: the static
        // SVG underneath is already the designed fallback.
      }
    }

    /* --- observers + input ------------------------------------------------ */

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        inView = entry.isIntersecting;
        if (inView && !started) {
          started = true;
          void begin();
        }
        if (!inView && pointerInside) {
          pointerInside = false;
          pendingLeave = true;
        }
        sync();
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const ro = new ResizeObserver((entries) => {
      const rect = entries[entries.length - 1].contentRect;
      if (rect.width === boxW && rect.height === boxH) return;
      boxW = rect.width;
      boxH = rect.height;
      needsRepaint = true;
      // Off-screen we simply hold the flag; the repaint happens on re-entry.
      // Frozen means no rAF will ever run again, so repaint here instead.
      if (frozen && engine !== null && inView && boxW > 0 && boxH > 0) {
        applyResize(engine);
        fullRepaint(engine);
        needsRepaint = false;
      }
      sync();
    });
    ro.observe(wrap);

    // Native listeners, not React's: a synthetic event object per pointermove is
    // an allocation we do not need at 120Hz. `offsetX/offsetY` are relative to
    // the event target, which is always the wrapper because every child is
    // `pointer-events-none` — so the pointer never costs a layout read.
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      px = event.offsetX;
      py = event.offsetY;
      if (!pointerInside) {
        prevPx = px;
        prevPy = py;
        pointerInside = true;
        pendingLeave = false;
      }
    }
    function onPointerLeave() {
      if (!pointerInside) return;
      pointerInside = false;
      pendingLeave = true;
    }
    wrap.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("pointerleave", onPointerLeave, { passive: true });
    wrap.addEventListener("pointercancel", onPointerLeave, { passive: true });

    // A late webfont swap changes every glyph's metrics; re-measure and repaint.
    function onFontsDone() {
      needsRepaint = true;
      sync();
    }
    document.fonts?.addEventListener("loadingdone", onFontsDone);

    return () => {
      abort.abort();
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      wrap.removeEventListener("pointercancel", onPointerLeave);
      document.fonts?.removeEventListener("loadingdone", onFontsDone);
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      engine = null;
    };
  }, [enhance, palette]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative overflow-hidden bg-art-ground", className)}
    >
      {/* The reserved box AND the designed static state, server-rendered. */}
      <AsciiStatic
        palette={palette}
        description={null}
        className={cn(
          "pointer-events-none",
          fill && "absolute inset-0 h-full w-full object-contain",
        )}
      />
      {enhance ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block h-full w-full font-mono"
        />
      ) : null}
      {/* Decorative art is aria-hidden; what it depicts is not (a11y law). */}
      <p className="visually-hidden pointer-events-none">{description}</p>
    </div>
  );
}
