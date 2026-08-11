/**
 * TickerClient — the rail inside the fixed bottom bar. Rebuilt 2026-08-10 for
 * DESIGN-REVISIT-2 D19 ("LIVE is fixed; the rate rail is mathematically
 * continuous"), superseding the Marquee-based version.
 *
 * ─── The two defects D19 fixes ──────────────────────────────────────────────
 * 1. TICKER_LEAD rendered INSIDE the moving half, so the LIVE label scrolled
 *    away with the rates. It is now a fixed status block, leftmost, that never
 *    moves — with the green status dot (--live-on-dark via the `bg-live`
 *    token; decorative, `aria-hidden`) pulsing OPACITY slowly. Under reduced
 *    motion the global block collapses the pulse to its final frame, which is
 *    opacity 1: steadily green, by design of the keyframe.
 * 2. The generic marquee assumed one copy of the content is wider than the
 *    viewport. On a 2560/3840 screen five short rate items are NOT, so the
 *    translateX(-50%) loop exposed a blank gap once per cycle. The loop is now
 *    MEASURED: one set's width and the viewport's width are observed, the set
 *    is repeated until one half exceeds viewport + one seam gap, that half is
 *    duplicated, and the track animates by exactly one half-width (the
 *    existing hk-marquee -50% keyframe — with exactly two identical halves,
 *    -50% of the track IS one half-width). Duration derives from distance at a
 *    stable visual speed, so more repetitions never speed the text up.
 *
 * ─── Why this hand-rolls the loop instead of extending Marquee ──────────────
 * §6.4 permits a shared primitive "only if it keeps the ticker and
 * brand-specific semantics separate". The ticker needs real React state for an
 * explicit pause/resume BUTTON (WCAG 2.2.2 — hover-pause alone traps nobody
 * but also rescues nobody); Marquee's public contract has no controlled-pause
 * prop and its other consumer (the brand rail) doesn't want one. So the loop
 * lives here, but it reuses the SAME global CSS hooks Marquee uses —
 * [data-marquee-viewport] (hover/focus pause), [data-marquee] (reduced-motion
 * + kill-switch stop), [data-marquee-clone] (clone hidden under reduced
 * motion) — so globals.css governs both rails identically without an edit.
 *
 * ─── What did NOT change ────────────────────────────────────────────────────
 * The FRED behaviour is byte-identical: one fetch on mount against
 * TICKER_ENDPOINT, same five labels, same `X.XX%` validation, same em-dash
 * fallback, no polling, no retry, silent failure. The server-rendered HTML
 * still contains one readable metric set (repeat count starts at 1), so the
 * rail is never empty before hydration; the animation starts only once real
 * measurements exist.
 *
 * TICKER_LEAD still reads "Live data" (lib/ticker.ts owns the string; the
 * micro-label utility uppercases it). Assistive tech hears "Live market data"
 * via the visually-hidden span — the D19-specified accessible name — while
 * the visible text stays content-module-owned. If Razim wants the literal
 * word LIVE alone, that is a one-word edit in lib/ticker.ts.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TICKER_DASH,
  TICKER_ENDPOINT,
  TICKER_LEAD,
  TICKER_REGION_LABEL,
  TICKER_SERIES,
  readTickerValues,
} from "@/lib/ticker";

const FETCH_TIMEOUT_MS = 10_000;

/** Stable visual speed for the rail, px/s. ~1200px of content over 45s was the
 *  old cadence (~27px/s); 28 keeps the same unhurried read. */
const SPEED_PX_PER_S = 28;

export function TickerClient() {
  const [values, setValues] = useState<ReadonlyMap<string, string> | null>(null);
  const [paused, setPaused] = useState(false);

  /** How many times one metric set repeats inside EACH half. Starts at 1 so
   *  the server HTML carries a full readable set; measurement raises it. */
  const [reps, setReps] = useState(1);
  /** Seconds for one half-width pass. null = not yet measured = no animation. */
  const [duration, setDuration] = useState<number | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const setRef = useRef<HTMLDivElement | null>(null);

  /* ── The one FRED fetch — unchanged from the ported implementation. ────── */
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let live = true;

    void fetch(TICKER_ENDPOINT, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? (response.json() as Promise<unknown>) : null))
      .then((payload) => {
        if (!live) return;
        const parsed = readTickerValues(payload);
        if (parsed.size > 0) setValues(parsed);
      })
      .catch(() => {
        /* Intentionally silent — the dash row IS the error state. */
      });

    return () => {
      live = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  /* ── Measurement. Re-runs on resize and on font readiness; both change the
        true width of one set. Updating state only when the numbers actually
        move keeps recalculation from restarting the keyframe needlessly —
        the one case that DOES restart it (a rep-count change mid-session) can
        only happen during a live window resize, when the whole rail is
        reflowing anyway. ──────────────────────────────────────────────────── */
  useEffect(() => {
    const viewport = viewportRef.current;
    const oneSet = setRef.current;
    if (!viewport || !oneSet) return;

    const measure = () => {
      const viewportW = viewport.clientWidth;
      const setW = oneSet.scrollWidth;
      if (viewportW <= 0 || setW <= 0) return;
      // Repeat until one half exceeds the viewport plus one seam gap (the gap
      // is baked into the set as trailing padding, so setW already includes it).
      const nextReps = Math.max(1, Math.ceil((viewportW + 1) / setW));
      const halfW = nextReps * setW;
      const nextDuration = Math.round((halfW / SPEED_PX_PER_S) * 10) / 10;
      setReps((r) => (r === nextReps ? r : nextReps));
      setDuration((d) => (d === nextDuration ? d : nextDuration));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(oneSet);
    // Fonts change glyph widths; re-measure once they settle.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  /* One metric set. Rendered 2×reps times in the track (reps per half) plus
     once, invisibly, as the measurement probe. Trailing padding IS the seam
     gap, so the joint between halves is the same width as every other gap. */
  const metricSet = (
    <>
      {TICKER_SERIES.map((series) => (
        <span key={series.id} className="flex shrink-0 items-baseline gap-2">
          <span className="micro-label">{series.label}</span>
          <span className="data-line min-w-[6ch] font-medium text-accent-text">
            {values?.get(series.label) ?? TICKER_DASH}
          </span>
        </span>
      ))}
    </>
  );

  const half = (hidden: boolean) => (
    <div
      {...(hidden ? { "aria-hidden": true, inert: true, "data-marquee-clone": true } : null)}
      className="flex shrink-0 items-center"
    >
      {Array.from({ length: reps }, (_, i) => (
        <div
          key={i}
          // Repetitions beyond the first are presentation, not content: only
          // the first set of the first half is in the accessibility tree.
          {...(!hidden && i > 0 ? { "aria-hidden": true } : null)}
          className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
        >
          {metricSet}
        </div>
      ))}
    </div>
  );

  const animating = duration !== null && !paused;

  return (
    <div
      role="region"
      aria-label={TICKER_REGION_LABEL}
      data-marquee-viewport
      className="flex h-full w-full items-center"
    >
      {/* Fixed status block — never moves (D19). */}
      <p className="micro-label flex shrink-0 items-center gap-2 pl-4 font-medium sm:pl-6">
        <span
          aria-hidden="true"
          className="inline-block size-2 rounded-pill bg-live animate-live-pulse"
        />
        <span className="visually-hidden">Live market data</span>
        <span aria-hidden="true">{TICKER_LEAD}</span>
      </p>

      {/* Clipped moving viewport. */}
      <div ref={viewportRef} className="relative mx-4 flex-1 overflow-hidden rail-mask sm:mx-6">
        <div
          data-marquee
          data-animated
          className={cn("flex w-max items-center", animating && "animate-marquee")}
          style={
            animating
              ? { animationDuration: `${duration}s`, willChange: "transform" }
              : undefined
          }
        >
          {half(false)}
          {half(true)}
        </div>

        {/* Measurement probe: one bare set inside a zero-size clipper, so its
            natural (viewport-exceeding) width never widens the document. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
        >
          <div
            ref={setRef}
            inert
            data-print-hide
            className="flex w-max items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
          >
            {metricSet}
          </div>
        </div>
      </div>

      {/* Explicit pause/resume (WCAG 2.2.2). Visually compact so it fits the
          32px mobile bar; the ::before expander grows the HIT AREA to 44px —
          the same pattern ui/button.tsx documents for its sm/link variants. */}
      <button
        type="button"
        aria-pressed={paused}
        aria-label={paused ? "Resume market data rail" : "Pause market data rail"}
        onClick={() => setPaused((p) => !p)}
        className={cn(
          "relative mr-3 grid size-6 shrink-0 place-items-center rounded-pill text-fg-meta sm:mr-5",
          "transition-colors duration-fast ease-out hover:text-fg",
          "before:absolute before:content-[''] before:-inset-y-2.5 before:-inset-x-2.5",
        )}
      >
        {paused ? (
          <Play className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Pause className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
