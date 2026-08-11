/**
 * components/loader/BrandLoader.tsx — the first-visit / hard-refresh branded
 * loader. docs/DESIGN-REVISIT-2.md D16 + §6.3. Razim explicitly requested
 * this, superseding Design Revisit 1's "no preloader ever" rule — read D16
 * before changing behaviour here, and read this file's own reasoning before
 * "simplifying" any of the three failure-safety mechanisms below. A loader is
 * a liability the moment it can stick; every decision here optimizes for
 * "always gets out of the way," polish second.
 *
 * ── THE GATE ATTRIBUTE — the contract with app/layout.tsx ───────────────────
 * This file does not decide, on its own, whether to appear. `app/layout.tsx`
 * mounts a `next/script` `strategy="beforeInteractive"` tag that runs BEFORE
 * any hydration — before this component's own JS has had a chance to do
 * anything — and, if this is a first-session visit or a real reload (never a
 * back/forward navigation), stamps a presence-only attribute onto `<html>`:
 *
 *     document.documentElement.setAttribute("data-loader-pending", "")
 *
 * That single attribute is read in TWO independent places that must agree:
 *   1. CSS below, via the Tailwind arbitrary variant
 *      `[html[data-loader-pending]_&]:flex` — the root renders `hidden` by
 *      default and only becomes `flex` (visible) when the attribute is
 *      present. Because this is a plain CSS rule compiled into the site's
 *      one global stylesheet, and stylesheets are render-blocking by
 *      definition, the browser's very FIRST paint already reflects the
 *      correct final answer — there is no window in which the wrong state
 *      (loader over content that shouldn't be covered, or a flash of raw
 *      content that should have been covered) is ever visible, in EITHER
 *      direction. That is what closes "no flash of underlying content before
 *      hydration" — the harder half of that requirement is a flash of the
 *      LOADER itself on a back/forward reload, which a plain `useEffect`
 *      deciding after the fact cannot prevent (the browser paints the raw
 *      SSR HTML before any JS runs, full stop) but a render-blocking CSS
 *      rule keyed off an attribute set even earlier, in `beforeInteractive`,
 *      does prevent.
 *   2. This component's own effect, via `hasAttribute`. If the attribute is
 *      absent, the effect does nothing at all — no timers, no scroll lock —
 *      because the CSS above has already, unconditionally, kept this root
 *      `hidden`. Running the orchestration anyway would lock body scroll for
 *      up to ~600ms behind an invisible element, which is a real bug, not a
 *      harmless no-op.
 *
 * The literal string "data-loader-pending" therefore appears three times
 * (the script in layout.tsx, `GATE_ATTR` below, and the Tailwind class
 * string below) and cannot be shared as a single JS constant across the
 * inline-script boundary or into a statically-scanned Tailwind class. Keep
 * all three in sync by hand if this ever changes.
 *
 * `[data-loader-root]` (a SEPARATE, presence-only attribute on the root
 * element itself, unrelated to the gate attribute above) is the one
 * app/globals.css already keys its `@media print` rule off — "the loader
 * must never appear" in print. Do not rename it.
 *
 * ── THE THREE THINGS THAT MUST NEVER FAIL ────────────────────────────────
 * 1. Body scroll is ALWAYS released. `finish()` restores
 *    `document.body.style.overflow` SYNCHRONOUSLY, as its first act, before
 *    the exit fade even starts — not inside the fade's own setTimeout. If
 *    that later timeout somehow never fires, the worst residual failure is a
 *    loader that lingers on screen, never one that traps scrolling. `finish`
 *    is reachable from two independent triggers (readiness-and-minimum-
 *    duration, and the hard-cap timer) and is idempotent via a local
 *    `finished` flag, so whichever fires first wins and the other is a
 *    harmless no-op. The effect's own unmount cleanup is a SEPARATE,
 *    synchronous release path (`releaseImmediately`, see below) rather than
 *    a third caller of `finish` — a finally-style path either way, not a
 *    happy-path-only one.
 * 2. The hero image is never delayed by this component. `waitForHeroImage`
 *    only ever OBSERVES an existing `<img>` (via `.decode()` or a `load`
 *    listener) — it never creates a request, sets `src`, or touches
 *    `loading`/`fetchPriority`. The hero's own markup (owned by a concurrent
 *    agent this round) fetches on its own schedule regardless of whether
 *    this component exists.
 * 3. No flash of underlying content — see "THE GATE ATTRIBUTE" above.
 *
 * ── REDUCED MOTION, FOR FREE ─────────────────────────────────────────────
 * Deliberately zero `motion/react` here. The fill and the exit both use
 * plain CSS `transition`, and app/globals.css's global
 * `@media (prefers-reduced-motion: reduce) { *, *::before, *::after {
 * transition-duration: 0.01ms !important } }` rule (already shipped,
 * unowned by this file) collapses both to effectively instant automatically
 * — a static filled segment and a near-instant opacity exit, exactly D16's
 * reduced-motion spec, with no `useReducedMotion()` branch to hand-roll or
 * forget. This also keeps the loader off `motion/react`'s critical-path
 * weight, which matters here specifically because this is the one component
 * guaranteed to run on every first paint.
 *
 * ── FORCED COLORS ─────────────────────────────────────────────────────────
 * The progress track carries a real `border` (not just a background fill).
 * Forced-colors mode recolors borders to system colors rather than removing
 * them, so the track stays visible as an outline even where a flat
 * background fill would be forced away — no `forced-colors:` variant needed.
 *
 * ── WHY THE LOCKUP IS `<Wordmark variant="brand">`, NOT NEW MARKUP ────────
 * D16: "select via themePresentation in lib/theme.ts, never a hand-rolled
 * theme check." `Wordmark`'s `variant="brand"` already does exactly that
 * dispatch (`themePresentation.lockup`) and already pairs the raster with a
 * real, visible `BRAND_LINE` text span — which is what satisfies "the
 * real-text brand name stays available to assistive technology" here. That
 * text is why the root below is NOT `aria-hidden` (only the decorative
 * progress track is); hiding the root would hide the one piece of real text
 * this component is required to expose.
 */

"use client";

import { useEffect, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { SITE_NAME } from "@/content/site";
import { DUR_MS } from "@/lib/motion";
import { themePresentation } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Presence-only attribute on `<html>`. Written by the `beforeInteractive`
 * script in app/layout.tsx, read here, removed here once the exit fade
 * completes. See the file header, "THE GATE ATTRIBUTE" — this string is
 * duplicated (not imported) into a Tailwind class below; keep both in sync.
 */
const GATE_ATTR = "data-loader-pending";

/**
 * Fill milestones, percent-of-track-width. Never rendered as text anywhere
 * — D16 forbids a percent number; these only ever become a CSS `width`.
 */
const PROGRESS = {
  start: 12,
  fontsReady: 55,
  heroReady: 88,
  complete: 100,
} as const;

/**
 * D16 timing law. MIN keeps the mark on screen long enough to read as
 * intentional rather than a flash; HARD_CAP is the absolute ceiling this
 * component may ever hold the page for, independent of whether readiness
 * signals resolve at all. EXIT_MS reuses the sitewide UI-transition token
 * (lib/motion DUR_MS.base) rather than a new magic number, so the fade is
 * the same 300ms every other piece of chrome uses — and it matches D16's
 * "exit around 300ms" exactly.
 */
const MIN_VISIBLE_MS = 600;
const HARD_CAP_MS = 2000;
const EXIT_MS = DUR_MS.base;

/**
 * Resolve the hero's LCP `<img>` defensively. This file does not own
 * Hero.tsx / the hero-slideshow track (a concurrent agent's file this
 * round), so it never assumes a specific data attribute that file may or
 * may not carry — it falls through three selectors, from most to least
 * specific, and simply gives up (treats the milestone as satisfied) if none
 * match. `#hero` and `fetchpriority="high"` on the LCP image are both
 * documented, stable contracts (D11 / SECTION_IDS), not guesses.
 */
function findHeroImage(): HTMLImageElement | null {
  return (
    document.querySelector<HTMLImageElement>('#hero img[fetchpriority="high"]') ??
    document.querySelector<HTMLImageElement>("#hero img") ??
    document.querySelector<HTMLImageElement>('img[fetchpriority="high"]')
  );
}

/**
 * Resolves once the hero's LCP image has decoded, or after a short internal
 * ceiling — whichever comes first. NEVER rejects: a `decode()` failure still
 * means "the browser is done trying," which is all this milestone claims.
 * The internal 1500ms ceiling is independent of, and tighter than, this
 * component's own HARD_CAP_MS — it exists so a stuck decode can never be the
 * thing that pushes the loader all the way to the hard cap on its own.
 */
function waitForHeroImage(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    try {
      const img = findHeroImage();
      if (!img || img.complete) {
        done();
        return;
      }
      if (typeof img.decode === "function") {
        img.decode().then(done, done);
      } else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    } catch {
      done();
      return;
    }
    window.setTimeout(done, 1500);
  });
}

/**
 * Resolves once web fonts are ready, or after a short internal ceiling.
 * `document.fonts` is unsupported in some browsers/engines; its absence just
 * skips the milestone rather than blocking anything.
 */
function waitForFonts(): Promise<void> {
  try {
    if (typeof document !== "undefined" && "fonts" in document) {
      return Promise.race([
        document.fonts.ready.then(
          () => undefined,
          () => undefined,
        ),
        new Promise<void>((resolve) => window.setTimeout(resolve, 1500)),
      ]);
    }
  } catch {
    /* fall through to the resolved default below */
  }
  return Promise.resolve();
}

export function BrandLoader() {
  const [progress, setProgress] = useState<number>(PROGRESS.start);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    // The beforeInteractive gate script already made the show/hide decision
    // before this component's JS ever ran — see the file header. If it
    // decided "no," the CSS above already keeps this root `hidden`, so there
    // is nothing to orchestrate: no timers, no scroll lock, nothing.
    if (!html.hasAttribute(GATE_ATTR)) return;

    // Deliberately a LOCAL closure variable, not a `useRef`. A `ref` would
    // persist across React StrictMode's dev-only mount → cleanup → remount
    // cycle, so the phantom cleanup below would leave it `true` before the
    // "real" mount's own effect body ever runs — that real run would then
    // see a poisoned flag and its own `finish()` would silently no-op
    // forever, never fading out, never releasing scroll. A `let` inside this
    // closure is naturally fresh on every distinct effect invocation
    // (phantom or real, dev or prod), so each run is fully self-contained.
    let finished = false;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // failure thing #1 (setup half) + #3's independent backstop: this timer
    // is wholly separate from the readiness promises below — even if BOTH
    // of those hang forever, this still fires and calls the same `finish`.
    const hardCap = window.setTimeout(() => finish(), HARD_CAP_MS);

    // The graceful exit: reachable from readiness+minimum-duration and the
    // hard cap. Idempotent — whichever trigger fires first wins.
    function finish() {
      if (finished) return;
      finished = true;
      window.clearTimeout(hardCap);
      // Scroll is released HERE — synchronously, before the fade starts —
      // not inside the fade's own timeout below. See file header #1.
      document.body.style.overflow = prevOverflow;
      setProgress(PROGRESS.complete);
      setExiting(true);
      window.setTimeout(() => {
        html.removeAttribute(GATE_ATTR);
      }, EXIT_MS);
    }

    // The unmount path is DELIBERATELY NOT `finish()`. `finish()` defers the
    // attribute removal by EXIT_MS so the fade has time to play — a timer
    // that would otherwise dangle past this effect's own lifetime and could
    // fire mid-way through a StrictMode "real" remount's fresh run,
    // stripping the gate attribute out from under an orchestration that
    // never asked for it. This path instead releases everything
    // SYNCHRONOUSLY and schedules nothing, so nothing outlives the effect
    // that created it.
    function releaseImmediately() {
      if (finished) return;
      finished = true;
      window.clearTimeout(hardCap);
      document.body.style.overflow = prevOverflow;
      html.removeAttribute(GATE_ATTR);
    }

    const mountedAt = performance.now();

    void Promise.allSettled([
      waitForFonts().then(() => setProgress((p) => Math.max(p, PROGRESS.fontsReady))),
      waitForHeroImage().then(() => setProgress((p) => Math.max(p, PROGRESS.heroReady))),
    ]).then(() => {
      if (finished) return;
      const elapsed = performance.now() - mountedAt;
      window.setTimeout(finish, Math.max(0, MIN_VISIBLE_MS - elapsed));
    });

    return releaseImmediately;
    // Mount-once orchestration; nothing here is meant to re-run on a re-render.
  }, []);

  return (
    <div
      data-loader-root
      role="status"
      aria-live="polite"
      aria-label={`Loading ${SITE_NAME}`}
      className={cn(
        themePresentation.heroSurface,
        "fixed inset-0 z-[999] hidden flex-col items-center justify-center gap-8",
        // See file header "THE GATE ATTRIBUTE" — this literal string must
        // stay in sync with GATE_ATTR and the beforeInteractive script in
        // app/layout.tsx. Tailwind's scanner needs the class name literal in
        // source, so it cannot be built from the JS constant.
        "[html[data-loader-pending]_&]:flex",
        "transition-opacity duration-base ease-out",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <Wordmark variant="brand" height={64} />
      <div
        aria-hidden="true"
        className="h-[3px] w-40 overflow-hidden rounded-pill border border-hairline sm:w-48"
      >
        <div
          className="h-full rounded-pill bg-accent-text transition-[width] duration-base ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
