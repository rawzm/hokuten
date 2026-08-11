"use client";

/**
 * Marquee — the measured-loop rail used by both `#brands` and `#ticker`.
 * Governed by docs/DESIGN-REVISIT-2.md §5.1 "Brand rail changes" item 4 and
 * §6.4 "Ticker and brand marquees" (2026-08-10, Design Revisit 2), which
 * supersedes the always-server, fixed-duration build below. `.agents/skills/
 * hokuten-design-director/references/05-motion.md` (Ticker) and
 * `04-page-anatomy.md` (`#brands`) still govern each consumer's own content
 * and semantics — nothing about THOSE changed here.
 *
 * ── THE BUG THIS REPLACES ─────────────────────────────────────────────────
 * The old build rendered `children` exactly twice — `[set][clone of set]` —
 * and animated the pair by a CSS-keyframe `translate3d(-50%, 0, 0)`. That is
 * seamless FOREVER, but only on the assumption that one set's own width is
 * already >= the viewport's width: the visible viewport must always be able
 * to find at least one full set's worth of content ahead of wherever the
 * scroll offset currently sits, and with only two sets total that is only
 * guaranteed while set-width >= viewport-width. Once a screen gets wide
 * enough that a single pass of chips/ticker-items is narrower than the
 * viewport (2560, 3840), the two-set track runs out of content before the
 * viewport is covered and a visible gap opens once per cycle. That is
 * exactly the defect the brief calls out: "assumes one set is wider than the
 * viewport, which fails at 2560 and 3840."
 *
 * ── THE FIX: a measured half, per §6.4 / the brands brief item 4 ─────────
 * On mount, measure the viewport's width and ONE pass of `children`'s own
 * width (including its internal item gaps) via `ResizeObserver`. Repeat that
 * one pass inside a "half" until the half's total width exceeds the viewport
 * plus a seam margin (`SEAM_SLACK_PX`) — so a half is now ALWAYS wide enough
 * to cover the viewport, at any screen width. Render that half twice (the
 * same two-copy technique as before, now generalized to N-repeat halves) and
 * animate the whole track by exactly `-50%` — still seamless forever, for
 * the same reason the old two-set version was, just now correctly sized.
 * Duration is derived from the measured half-width at a fixed steady-state
 * speed (`SPEED_PX_PER_S`), so adding repetitions to cover a wider screen
 * lengthens the cycle instead of speeding the visible motion up.
 *
 * ── Public contract is UNCHANGED ─────────────────────────────────────────
 * `MarqueeProps` — `children`, `speed`, `label`, `edgeFade`, `className`,
 * `trackClassName` — keeps the exact same names and shapes as the previous
 * build. Both known consumers, `components/sections/BrandsSection.tsx`
 * (this round) and `components/ticker/TickerClient.tsx` (owned by a
 * different agent this round, NOT touched here), call this component with
 * those same six props today; neither needs a call-site change for this fix.
 * `trackClassName` now applies to the ONE flex track that holds every
 * repeated/duplicated copy (previously it applied per-"half" box) — the
 * effect for both current callers is neutral-to-better: gaps are now uniform
 * at every repeat boundary, including the loop's own seam, which the old
 * per-half-box structure did not guarantee (the ticker's own
 * `trackClassName` compensated with trailing `pr-10 sm:pr-14` padding; that
 * padding is harmless but no longer load-bearing under this structure — an
 * FYI for whoever next touches `TickerClient.tsx`, not a change made here).
 *
 * ── Why this component now carries JS (D7 budget note) ───────────────────
 * The previous build was a zero-JS Server Component specifically to protect
 * the hero's critical-path JS budget (ref 05, D7: hero + nav + stats
 * interactive <=200KB gzip) — `#brands` renders inside the hero's first
 * panel. The measured-loop technique this brief mandates is inherently
 * runtime-driven (you cannot know how many repeats a half needs without
 * measuring the real viewport and the real rendered width of `children`), so
 * there is no way to satisfy item 4 of the brief while staying zero-JS. This
 * file is deliberately as small as reasonably possible — no animation
 * library, only `ResizeObserver` (a native browser API) and a handful of
 * hooks — to keep that addition small. Flagged here for the W7 budget audit,
 * which this agent cannot run (`pnpm build` is off-limits this round).
 *
 * ── Accessibility contract — unchanged in spirit, generalized in shape ───
 * `children` is rendered as the accessible DOM's ONE logical set — never
 * twice, never N times — exactly like before. Every repeat/duplicate beyond
 * that first pass (both the extra repeats needed to fill a "half" AND the
 * whole second "half") is wrapped `aria-hidden` + `inert` +
 * `data-marquee-clone`, so screen readers and the tab order see exactly one
 * set, same as the old two-copy build. `data-marquee-clone` is the existing
 * selector globals.css already keys its reduced-motion and print rules off
 * (`[data-marquee-clone] { display: none !important }` in both places) — it
 * generalizes correctly to "however many clone passes exist this render"
 * with zero changes to globals.css.
 *
 *   [data-marquee-viewport]:hover / :focus-within  → pauses the track (WCAG 2.2.2)
 *   @media (prefers-reduced-motion) [data-marquee] → animation + transform off
 *   @media (prefers-reduced-motion) [data-marquee-clone] → display: none
 *   :root[data-motion="off"] [data-marquee]        → global kill switch
 *
 * so under reduced motion the row holds its first frame — now exactly ONE
 * clean, readable pass, regardless of how many clone passes exist for the
 * wide-screen loop — and the duplicates never leave a gap.
 *
 * ── Why the viewport is `tabIndex={0}` (WCAG 2.2.2, Level A) ────────────────
 * Both rails auto-start, loop for longer than 5s and sit in parallel with
 * other content, so 2.2.2 requires a pause mechanism for EVERY user — not
 * only the reduced-motion cohort. The token sheet's pause rule is `:hover,
 * :focus-within`, and neither rail contains a single focusable descendant
 * (`#brands` renders `<span>`/`<img>` marks, `#ticker` renders `<span>`
 * label/value pairs), so `:focus-within` could never match without this.
 * Making the labelled `role="group"` viewport itself focusable is the
 * standard focusable-region technique: it is announced by its `aria-label`,
 * takes the global 2px focus-visible ring from globals.css's `[tabindex]`
 * selector, pauses the track for as long as it holds focus, and traps
 * nothing.
 *
 * ── Animation starts only after valid dimensions exist (§6.4) ────────────
 * Before the first successful measurement (server render, first paint,
 * JS-disabled) the track renders exactly ONE real pass plus one aria-hidden
 * clone pass — the same static, simple, two-copy shape the old build always
 * rendered — with NO animation class and NO `will-change`. A JS-disabled
 * visitor or a narrow viewport therefore always sees a complete, readable,
 * static row; the measured multi-repeat loop is purely a progressive
 * enhancement for wide screens once `ResizeObserver` has real numbers.
 *
 * ── `will-change` stays scoped to "actually animating" (ship-gate fix, kept) ─
 * `will-change: transform` is applied only once a measurement exists AND
 * only collapses back to `auto` via the same four states the previous ship-
 * gate fix established: paused (hover/focus-within), reduced motion, and the
 * `:root[data-motion="off"]` kill switch — plus the new fifth state, "no
 * measurement yet," which the old build never had to consider.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** `hk-marquee`'s animation-name/timing-function/iteration-count still come
 * from these two `@theme` tokens in globals.css (unedited by this file); only
 * the DURATION is now overridden per-instance — see `SPEED_PX_PER_S` below. */
export type MarqueeSpeed = "ticker" | "brands";

const SPEED_CLASS: Record<MarqueeSpeed, string> = {
  ticker: "animate-marquee",
  brands: "animate-marquee-brands",
};

/**
 * Steady-state travel speed, px/s. Duration is derived from the MEASURED
 * half-width at this constant speed (`halfWidthPx / SPEED_PX_PER_S`), so
 * repeating the row to cover an ultrawide screen lengthens the cycle instead
 * of speeding the visible motion up (the brief's explicit requirement).
 * Picked to read at roughly the old fixed 40s/45s pace at each rail's
 * typical single-pass width; this agent has no dev-server/browser access to
 * measure a live render against, so treat these as a tunable design constant
 * to sanity-check on the next screenshot pass, not a frozen figure.
 */
const SPEED_PX_PER_S: Record<MarqueeSpeed, number> = {
  brands: 46,
  ticker: 50,
};

/** Extra slack past the raw viewport width before a "half" counts as wide
 * enough — keeps the loop's seam from ever riding exactly at the clipped
 * edge (a one-pixel rounding error should never reopen the gap this file
 * exists to close). */
const SEAM_SLACK_PX = 64;

export type MarqueeProps = {
  /** One logical item set. Rendered exactly once in the accessible DOM —
   *  `Marquee` repeats and duplicates it internally to build the loop; a
   *  consumer never renders it twice itself. */
  children: ReactNode;
  /** Which steady-state speed to run — see `SPEED_PX_PER_S`. */
  speed?: MarqueeSpeed;
  /** Accessible name for the rail, e.g. "Franchise flags we transact across". */
  label: string;
  /** Soft-fade the left and right edges with `rail-mask`. */
  edgeFade?: boolean;
  /** Classes for the viewport (height, surface, hairlines, padding). */
  className?: string;
  /** Classes for the moving track — gap between items and vertical alignment.
   *  Applied to the one real flex track, so the gap is uniform at every
   *  repeat boundary, including the loop's own seam. */
  trackClassName?: string;
};

/**
 * One pass of `children`. The first (real, accessible) pass renders bare —
 * `hidden={false}` returns `children` untouched, adding no DOM node. Every
 * later pass renders inside a `display: contents` wrapper (transparent to
 * the track's flex `gap`, so item spacing stays uniform across the repeat
 * boundary) carrying `aria-hidden` + `inert` + `data-marquee-clone`, so
 * screen readers, the tab order, reduced motion, and print never see it.
 */
function MarqueeGroup({ children, hidden }: { children: ReactNode; hidden: boolean }) {
  if (!hidden) return children;
  return (
    <div className="contents" aria-hidden="true" inert data-marquee-clone>
      {children}
    </div>
  );
}

export function Marquee({
  children,
  speed = "ticker",
  label,
  edgeFade = true,
  className,
  trackClassName,
}: MarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  // `null` until the first measurement resolves. Until then the track
  // renders one real pass + one clone pass, statically — see file header
  // "Animation starts only after valid dimensions exist."
  const [loop, setLoop] = useState<{ repeat: number; durationS: number } | null>(null);

  useEffect(() => {
    const viewportEl = viewportRef.current;
    const measureEl = measureRef.current;
    if (!viewportEl || !measureEl) return;

    let frame = 0;

    const recompute = () => {
      const viewportWidth = viewportEl.clientWidth;
      const setWidth = measureEl.getBoundingClientRect().width;
      if (viewportWidth <= 0 || setWidth <= 0) return;

      const target = viewportWidth + SEAM_SLACK_PX;
      const repeat = Math.max(1, Math.ceil(target / setWidth));
      const halfWidthPx = repeat * setWidth;
      const durationS = halfWidthPx / SPEED_PX_PER_S[speed];

      setLoop((prev) =>
        prev && prev.repeat === repeat && Math.abs(prev.durationS - durationS) < 0.05
          ? prev
          : { repeat, durationS },
      );
    };

    recompute();

    // Recalculate on resize (§6.4) — batched through rAF so a drag-resize
    // doesn't thrash React state on every intermediate pixel.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(recompute);
    });
    observer.observe(viewportEl);
    observer.observe(measureEl);

    // Recalculate once more after web fonts finish loading (§6.4) — chip/
    // label widths can shift once the real face swaps in for a fallback.
    let cancelled = false;
    document.fonts?.ready
      .then(() => {
        if (!cancelled) recompute();
      })
      .catch(() => {
        // Readiness is a nicety, not a requirement: if the promise rejects,
        // the ResizeObserver above still catches any resulting width change.
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [speed]);

  const repeat = loop?.repeat ?? 1;
  const groupCount = repeat * 2;

  return (
    <div
      ref={viewportRef}
      data-marquee-viewport
      role="group"
      aria-label={label}
      /* The pause mechanism's only keyboard/AT entry point — see file header. */
      tabIndex={0}
      className={cn("relative w-full", className)}
    >
      {/* The clipper, and the ONLY element that may carry `rail-mask`.
          A CSS mask applies to an element's whole rendering — its outline
          included — so leaving the edge fade on the focusable viewport above
          would fade that element's own `:focus-visible` ring out at both ends
          and leave the focus indicator half-invisible. Clipping and masking
          therefore live one level in, where nothing is ever focused. */}
      <div className={cn("w-full overflow-hidden", edgeFade && "rail-mask")}>
        <div
          data-marquee
          className={cn(
            "flex w-max",
            // will-change is only actually useful while the transform is
            // running — see file header "`will-change` stays scoped."
            loop ? "will-change-transform" : "will-change-auto",
            trackClassName,
            // Only truly animating once a real measurement exists.
            loop && SPEED_CLASS[speed],
            // Collapse back to `auto` in every state where the transform is
            // not actually moving. `_` stands in for the space Tailwind can't
            // carry inside a class token; each compiles to a real descendant
            // selector rooted at `[data-marquee-viewport]` or `:root`.
            "motion-reduce:will-change-auto",
            "[[data-marquee-viewport]:hover_&]:will-change-auto",
            "[[data-marquee-viewport]:focus-within_&]:will-change-auto",
            "[:root[data-motion=off]_&]:will-change-auto",
          )}
          style={loop ? { animationDuration: `${loop.durationS}s` } : undefined}
        >
          {Array.from({ length: groupCount }, (_, i) => (
            <MarqueeGroup key={i} hidden={i > 0}>
              {children}
            </MarqueeGroup>
          ))}
        </div>
      </div>

      {/* Hidden measuring pass: one bare copy of the content, in the same gap
          context as the real track (`trackClassName` applied identically),
          out of flow (`absolute`) and out of both the accessibility tree and
          the tab order. Exists purely so the ResizeObserver above can read a
          true "one set" width — including its own internal item gaps —
          independent of how many times the visible track currently repeats
          it. `invisible` (not `opacity-0`) so it stays genuinely non-
          rendering under forced-colors mode, which can otherwise still paint
          an opacity-0 element's borders/text with system colors.
          `data-print-hide` stops the print stylesheet's blanket
          `visibility: visible !important` reset (globals.css §8) from
          making it visible on paper — that reset targets `visibility`
          specifically because `invisible` alone wouldn't survive it. */}
      {/* THE PROBE MUST SIT INSIDE A ZERO-SIZE CLIPPING WRAPPER.
          `invisible` + `absolute` hide paint, not layout: the probe is
          intentionally WIDER than the viewport (measuring one full set is its
          whole job), so it still contributed to the document's scrollable
          overflow — a real horizontal scrollbar, measured 1800px against a
          1440px viewport at every breakpoint. The 0x0 `overflow-hidden`
          wrapper removes it from the page's scroll width while the probe still
          lays out at its natural width inside, so the ResizeObserver reads a
          true one-set measurement. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
      >
        <div
          ref={measureRef}
          inert
          data-print-hide
          className={cn("invisible flex w-max items-center", trackClassName)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
