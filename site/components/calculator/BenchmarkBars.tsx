"use client";

/**
 * components/calculator/BenchmarkBars.tsx — the result panel's "Where you sit"
 * bars.
 *
 * Port of `bar()` at index.html:1614-1618 (docs/port/01-calculator.md §A.8).
 * The position formula lives in `pctBar()` in lib/valuation.ts and is FROZEN —
 * this component only paints the number it is handed.
 *
 * Two things the source did not do, both required here:
 *
 *  1. MOTION LAW (ref 05). The source's fill was sized with `width`. Animating
 *     width is a layout animation and is forbidden. The fill is painted at full
 *     width and scaled with `transform: scaleX()` from a left origin, so the
 *     only animated property is `transform`. There is no entrance animation —
 *     the first paint has no previous value to tween from, so a freshly loaded
 *     result never animates; only a RECALCULATION tweens. Reduced motion and the
 *     global kill switch drop even that (`transition-none`), which is the
 *     designed static state, not a missing one.
 *  2. A11Y (ref 07). The source shipped the bars with no ARIA at all. The track
 *     is a `role="meter"` on a 0–100 scale (the bar is a position WITHIN the
 *     typical band, and the value can sit outside that band — `pctBar` clamps —
 *     so the band's own numbers would be an invalid min/max pair). Its
 *     accessible name is the row's label + value, and the typical-band line is
 *     its description, so no string is duplicated for screen readers.
 */

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NO_OP_SUBSCRIBE = () => () => {};

/** Same pattern as ui/select.tsx: optimistic on the server, exact after hydration. */
function useTransitionsEnabled(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const getSnapshot = React.useCallback(
    () => motionAllowed(prefersReducedMotion),
    [prefersReducedMotion],
  );
  return React.useSyncExternalStore(NO_OP_SUBSCRIBE, getSnapshot, () => true);
}

export type BenchmarkRow = {
  /** Stable id — used to wire the meter's label/description. */
  id: string;
  /** e.g. "Occupancy" (index.html:1575). */
  label: string;
  /** Formatted value, e.g. "74%" or "$147". */
  value: string;
  /** 0–100, already clamped by `pctBar()`. Printed with `toFixed(0)` like the source. */
  pct: number;
  /** e.g. "60–78% typical" — from `formatOccBandSub` / `formatRevparBandSub`. */
  sub: string;
};

export type BenchmarkBarsProps = {
  rows: readonly BenchmarkRow[];
  className?: string;
};

export function BenchmarkBars({ rows, className }: BenchmarkBarsProps) {
  const transitions = useTransitionsEnabled();

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {rows.map((row) => {
        /* index.html:1616 printed the fill percentage with toFixed(0). */
        const pct = Math.round(row.pct);
        const labelId = `${row.id}-label`;
        const valueId = `${row.id}-value`;
        const subId = `${row.id}-sub`;

        return (
          <div key={row.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span id={labelId} className="micro-label">
                {row.label}
              </span>
              <span id={valueId} className="font-mono text-data font-medium tabular text-fg">
                {row.value}
              </span>
            </div>

            <div
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-labelledby={`${labelId} ${valueId}`}
              aria-describedby={subId}
              className="mt-2 h-1.5 w-full overflow-hidden rounded-card bg-hairline"
            >
              <span
                aria-hidden="true"
                data-animated=""
                className={cn(
                  "block h-full w-full origin-left bg-accent",
                  transitions ? "transition-transform duration-base ease-out" : "transition-none",
                )}
                style={{ transform: `scaleX(${pct / 100})` }}
              />
            </div>

            <p id={subId} className="mt-2 font-sans text-data text-fg-meta">
              {row.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
