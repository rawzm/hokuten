/**
 * TickerClient — the rail inside the fixed bottom bar.
 *
 * Ported from ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html:2269-2286
 * (client fetch + render) and :1253-1263 (static markup) via
 * docs/port/05-forms-and-ticker.md §D.2-D.4. Motion contract: design-skill
 * reference 05 (Ticker) — 45s CSS marquee, duplicated content, pause on hover
 * and focus, static under reduced motion, reserved height, zero CLS.
 *
 * ─── Why the WHOLE row is a Client Component ────────────────────────────────
 * `Marquee` renders its children TWICE (the clone is what makes translateX(-50%)
 * seamless). If the fetch lived in an island nested inside the marquee it would
 * mount twice and fetch twice; if it lived outside it could only reach the value
 * slots by writing to the DOM behind React's back, which a later re-render would
 * silently undo. So this component owns the row and calls `Marquee` itself.
 *
 * That costs nothing at first paint: Next server-renders Client Components too,
 * so the HTML that ships already contains all five labels and their em-dash
 * placeholders, at full width, before a single byte of JS runs. `values` starts
 * null on the server and on the client's first render, so the markup matches and
 * hydration is silent.
 *
 * ─── Zero CLS ───────────────────────────────────────────────────────────────
 * Two rules, both load-bearing:
 *   1. Each value sits in a `min-w-[6ch]` monospace slot. `—` and `4.32%` and
 *      `10.25%` all occupy the same box, so filling values in cannot move the
 *      item beside them.
 *   2. Only values matching `X.XX%` are admitted (`readTickerValues`). A
 *      malformed payload keeps its dash rather than stretching a slot.
 * The bar's own height is reserved by `TickerBar`, not here.
 *
 * ─── Failure ────────────────────────────────────────────────────────────────
 * One fetch, on mount. No polling, no retry, no interval. Every failure — a
 * degraded 200, a non-200, a timeout, an abort, a body that will not parse —
 * lands in the same place: keep the dashes, tell the visitor nothing. There is
 * no error state to design because the placeholder row IS the error state.
 *
 * ─── Motion gating ──────────────────────────────────────────────────────────
 * No `useReducedMotion()` / `motionAllowed()` call here, deliberately. `Marquee`
 * has no JS animation to gate: the loop is a CSS keyframe and globals.css
 * already stops it under `prefers-reduced-motion` (holding frame one and hiding
 * the clone, so the first items sit static and readable) and under the global
 * `:root[data-motion="off"]` kill switch. Adding a JS gate would duplicate that
 * in a second place and let the two disagree.
 */

"use client";

import { useEffect, useState } from "react";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { Marquee } from "@/components/motion/Marquee";
import {
  TICKER_DASH,
  TICKER_ENDPOINT,
  TICKER_LEAD,
  TICKER_REGION_LABEL,
  TICKER_SERIES,
  readTickerValues,
} from "@/lib/ticker";

/**
 * Client-side ceiling on the request. The route has its own 6s upstream budget
 * and answers 200 either way, so this only guards against a network that never
 * replies at all — it must not fire before the route has had time to answer.
 */
const FETCH_TIMEOUT_MS = 10_000;

export function TickerClient() {
  const [values, setValues] = useState<ReadonlyMap<string, string> | null>(null);

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
        // An empty map means missing_key / fetch_failed / garbage. Leaving state
        // null keeps the server-rendered dashes rather than re-rendering to the
        // identical thing.
        if (parsed.size > 0) setValues(parsed);
      })
      .catch(() => {
        // Intentionally silent. The visitor is never shown a market-data error.
      });

    return () => {
      live = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // One row. `Marquee` renders this same element twice; the clone is `inert`
  // and `aria-hidden`, so nothing here is announced or focusable twice.
  const row = (
    <>
      <MicroLabel className="shrink-0 font-medium">{TICKER_LEAD}</MicroLabel>

      {TICKER_SERIES.map((series) => (
        <span key={series.id} className="flex shrink-0 items-baseline gap-2">
          <span className="micro-label">{series.label}</span>
          {/* The fixed slot. `data-line` brings mono + tabular-nums + zero
              tracking; `min-w-[6ch]` reserves six monospace glyphs, which is
              every plausible reading for these five series plus a sign. */}
          <span className="data-line min-w-[6ch] font-medium text-accent-text">
            {values?.get(series.label) ?? TICKER_DASH}
          </span>
        </span>
      ))}
    </>
  );

  return (
    <Marquee
      label={TICKER_REGION_LABEL}
      speed="ticker"
      edgeFade
      // Gap lives on the half AND as trailing padding: the space after the last
      // item is what keeps the seam between the two copies the same width as
      // every other gap.
      trackClassName="gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {row}
    </Marquee>
  );
}
