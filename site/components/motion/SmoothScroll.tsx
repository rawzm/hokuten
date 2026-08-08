/**
 * SmoothScroll — Lenis, desktop pointer devices only.
 * Governed by .agents/skills/hokuten-design-director/references/05-motion.md
 * ("Lenis on desktop pointer devices only; native scroll on touch and under
 * reduced-motion. No scroll-jacking, no scroll-linked pinning in Phase 1.")
 *
 * Mount once, near the top of the tree. Renders nothing.
 *
 * Three gates before Lenis exists at all:
 *   1. motionAllowed() — prefers-reduced-motion, the global kill switch, and
 *      the data-saver signal.
 *   2. (hover: hover) and (pointer: fine) — a real mouse or trackpad. Touch and
 *      hybrid-touch devices keep native scroll, which is what they are good at.
 *   3. The library itself is dynamically imported only once both pass, so phone
 *      visitors never download it (ref 05: 180KB landing budget).
 *
 * The media query is watched, not sampled: plugging in a mouse starts Lenis,
 * unplugging it destroys the instance and hands scrolling back to the browser.
 *
 * globals.css sets `html { scroll-behavior: smooth }`. Native smooth scrolling
 * and Lenis fight over the same scroll position, so Lenis takes ownership while
 * it is alive and gives it straight back on teardown. This is done from JS
 * because the token sheet is not ours to edit; if a future change adds a
 * `html.lenis { scroll-behavior: auto }` rule to globals.css, delete this.
 *
 * `anchors` is left off on purpose. In-page navigation stays native so that
 * `scroll-margin-top: var(--nav-h)` and focus movement to the target heading
 * (ref 05, a11y) keep working exactly as they do without Lenis.
 */

"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { motionAllowed } from "@/lib/motion";

const DESKTOP_POINTER = "(hover: hover) and (pointer: fine)";

export function SmoothScroll() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!motionAllowed(prefersReduced)) return;
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia(DESKTOP_POINTER);
    const root = document.documentElement;

    let instance: Lenis | null = null;
    let loading = false;
    let disposed = false;
    let previousScrollBehavior = "";

    const start = () => {
      if (instance || loading) return;
      loading = true;
      void import("lenis")
        .then(({ default: LenisClass }) => {
          loading = false;
          if (disposed || instance || !query.matches) return;
          previousScrollBehavior = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          instance = new LenisClass({
            // Lenis drives its own rAF; destroy() cancels it.
            autoRaf: true,
            // Overlays, dialogs and any data-lenis-prevent region scroll natively.
            allowNestedScroll: true,
          });
        })
        .catch(() => {
          // Smooth scroll is a nicety. A failed chunk keeps native scrolling.
          loading = false;
        });
    };

    const stop = () => {
      if (!instance) return;
      instance.destroy();
      instance = null;
      root.style.scrollBehavior = previousScrollBehavior;
    };

    const sync = () => {
      if (query.matches) start();
      else stop();
    };

    sync();
    query.addEventListener("change", sync);

    return () => {
      disposed = true;
      query.removeEventListener("change", sync);
      stop();
    };
  }, [prefersReduced]);

  return null;
}
