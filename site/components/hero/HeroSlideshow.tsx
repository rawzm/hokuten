"use client";

/**
 * components/hero/HeroSlideshow.tsx — `#hero` row 2, the art-directed
 * slideshow. Governed by docs/DESIGN-REVISIT-2.md D11 (the behaviour
 * contract), §4.1 (the three declared display ratios that fix the crop
 * defect), §5.1 ("Desktop composition" row 2), docs/DESIGN-REVISIT-3.md D24
 * (fully automatic, zero visible chrome — supersedes D11's visible
 * prev/next/dots/counter/pause seat below), docs/AGENT-BRIEF.md's D11 digest,
 * and hokuten-design-director ref 05 → "Hero slideshow." Content comes from
 * `content/heroSlides.ts`'s typed manifest and resolvers — this file renders
 * what it is handed, it does not choose slides or crops.
 *
 * ── THE CROP FIX (§2 of the task brief) ──────────────────────────────────
 * The retired build gave the art band a flexible height (`Image fill` +
 * object-cover inside a flex-grow box), so its rendered ratio drifted with
 * viewport height and headline wrapping. This file's root instead carries a
 * DECLARED display ratio per breakpoint — `aspect-[4/3] md:aspect-[16/7]
 * lg:aspect-[4/1]` — matching §4.1 exactly (mobile 4:3, tablet 16:7, desktop
 * 4:1). The image box's ratio is now a property of the design, not a
 * leftover of whatever height the flex layout happened to compute. `md:`/
 * `lg:` are Tailwind's 768px/1024px breakpoints, chosen because they are the
 * exact thresholds `<SlidePicture>`'s own `<picture><source media>` art
 * direction switches on below — the CSS box and the source image change
 * ratio at the same viewport width, so `object-cover` on the resolved image
 * only ever makes a near-zero correction, never a second crop on top of the
 * first.
 *
 * ── One resting image layer; tiles exist only mid-transition ────────────
 * At rest this file renders exactly ONE `<picture>` (the current slide).
 * When `pendingIndex` is set it renders the INCOMING slide as a full image
 * underneath a transient 8×5 (40-tile) grid built from the OUTGOING slide,
 * each tile individually fading + shrinking out on a diagonal-stagger delay
 * (`row + col`), revealing the incoming image as they disappear — a
 * deterministic mosaic reveal, no randomness, no glitch/chromatic-aberration/
 * bounce/strobe. The tile grid unmounts the instant the transition commits;
 * nothing about the resting state ever carries 40 permanent DOM nodes or a
 * running rAF loop (D11's explicit perf gate).
 *
 * ── Server-rendered slide 1, real LCP element ────────────────────────────
 * This is a Client Component (autoplay/pause/transition state all need the
 * DOM), but Next server-renders Client Components too — the same reasoning
 * `TickerClient.tsx`'s header documents. `<SlidePicture>` for `slides[0]` is
 * a plain `<picture>`/`<img>` with `fetchPriority="high"`/`loading="eager"`,
 * so it paints from the server HTML exactly like a Server durable element
 * would; nothing here gates it behind a mount flag, an opacity-0 initial
 * state, or a canvas snapshot. `isFirstPaintRef` only stops `priority` from
 * re-arming if autoplay ever cycles back around to index 0 later in the
 * session — the ORIGINAL request is what must be eager/high-priority, not
 * every subsequent time the same slide becomes current again.
 *
 * ── Breakpoint tracking is JS-computed only for the tile texture ─────────
 * `<SlidePicture>`'s actual RESOURCE selection (which crop loads) is native
 * browser art-direction via `<picture><source media>` — zero JS, zero
 * latency, correct before hydration. Its small per-breakpoint
 * `object-position` nudge uses a CSS-custom-property switch (three Tailwind
 * arbitrary-property classes keyed to the same 768/1024 breakpoints) so it
 * needs no JS either. The ONE thing that genuinely cannot be done in pure
 * CSS is the mosaic tile texture (`background-image`/`-size`/`-position` per
 * tile must agree with whichever crop is currently on screen), so — and
 * ONLY for that — `useHeroBreakpoint()` mirrors the same 768/1024 thresholds
 * in JS via `matchMedia`, feeding `<MosaicTiles>` the correct single JPG.
 *
 * ── Pause conditions (D11, unchanged by D24) ─────────────────────────────
 * Autoplay is enabled only when: more than one slide exists, motion is
 * allowed (`motionAllowed()` — reduced motion, Save-Data, and the global
 * `data-motion="off"` kill switch all gate it the same way every other
 * animated component on the site does), the user has not manually paused,
 * the slideshow is not hovered or focus-within, the tab is not hidden
 * (`visibilitychange`), and the hero is on screen (`IntersectionObserver`).
 * Pausing never resets `index` — resuming re-arms a fresh interval from
 * wherever the slideshow currently rests, never rewinding to slide 1.
 *
 * ── Reduced motion / Save-Data ───────────────────────────────────────────
 * `motionAllowed(prefersReduced) === false` disables autoplay entirely and
 * makes the (now hidden-until-focus) pause control unmount too — there is
 * nothing auto-updating left to pause. Slide 1 stays a static, fully visible
 * image. This is a real branch in state, not just a hope that the global
 * reduced-motion stylesheet catches it after the fact (defense in depth,
 * matching the sitewide pattern other components already use).
 *
 * ── D24 (2026-08-10): zero visible chrome ────────────────────────────────
 * Razim: "the hero slideshow should be automatic and dont need to show
 * navigation chvrons and pause button there." The previous build's visible
 * controls seat — prev/next chevrons, a dot-per-slide `role="group"`, an
 * always-on `NN / NN` counter, and a visible pause/play button, all sitting
 * on a permanent ink scrim across the bottom of the art — is gone outright.
 * `ChevronLeft`/`ChevronRight` are no longer imported. There is no manual
 * prev/next/dot navigation anymore; the slideshow only ever advances on its
 * own ~7s timer.
 *
 * WCAG 2.2.2 still requires a way to pause auto-updating content, so exactly
 * one control survives: `<PauseControl>`, an invisible-until-focused button
 * modeled directly on globals.css's `skip-link` utility (itself
 * off-canvas-until-`:focus` UI chrome, absolutely positioned above the box
 * at rest, transitioning into view on focus). Hover/focus-within on the root
 * already pauses autoplay for pointer users touching the slideshow anywhere;
 * `<PauseControl>` exists specifically for keyboard users who tab to the
 * hero without ever hovering it. It carries `data-slideshow-controls` so
 * globals.css's print block (`[data-slideshow-controls] { display: none }`)
 * still hides it on paper.
 *
 * ── Accessibility ─────────────────────────────────────────────────────────
 * Root: `role="group" aria-roledescription="carousel" aria-label="Hotel
 * photography"`. Only the CURRENTLY RESTING slide's `<img>` carries its real
 * `alt` (the manifest's scene description, never the glyph-mosaic/art
 * language); the incoming layer mid-transition and the ahead-of-use preload
 * copy are both `aria-hidden` with an empty `alt` so nothing is ever
 * announced twice. Auto-advances stay silent (D11: "stay silent"); the one
 * remaining manual action — toggling `<PauseControl>` — updates a
 * `visually-hidden` `aria-live="polite"` status string ("Hero slideshow
 * paused" / "Hero slideshow resumed") so a screen-reader user who reaches
 * for the control hears the state change confirmed. `<PauseControl>` is a
 * real ≥44px `<button>` on the same high-contrast ink-scrim seat
 * (`color-mix(in srgb, var(--ink) NN%, transparent)`, the same token-only
 * scrim vocabulary `OptionTiles.tsx` documents) so it reads against any
 * photo once focus reveals it. It locally overrides `--focus` to
 * `var(--accent-on-dark)` (inline style) so the visible focus ring stays
 * legible on dark ink over arbitrary photography, rather than falling back
 * to `--accent-ink` (tuned for text on paper/card, not for a ring over a
 * photograph).
 *
 * ── No-JS fallback ────────────────────────────────────────────────────────
 * `<PauseControl>` renders as a real `<button>` regardless of hydration
 * state; without JS it simply has no `onClick` attached yet (same graceful
 * degradation as `AnchorLink`) while slide 1's image and the headline stay
 * fully visible and legible — "usable static hero," not "fully interactive
 * hero," is the acceptance bar for the no-JS case.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";

import { EASE_CSS, motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { HeroBreakpoint, HeroSlideId } from "@/content/heroSlides";

/* ---------------------------------------------------------------------------
   Public contract
   --------------------------------------------------------------------------- */

export type HeroSlideshowBreakpointArt = {
  /** Largest generated JPG — the `<img>` fallback AND the mosaic tile texture. */
  src: string;
  width: number;
  height: number;
  /** CSS `object-position` value, already formatted (see `toObjectPosition`). */
  objectPosition: string;
  /** Ready-to-use `srcset` strings across every generated width. */
  avifSrcSet: string;
  webpSrcSet: string;
};

export type HeroSlideshowSlide = {
  id: HeroSlideId;
  /** Describes the depicted scene, never the glyph-mosaic treatment. */
  alt: string;
  mobile: HeroSlideshowBreakpointArt;
  tablet: HeroSlideshowBreakpointArt;
  desktop: HeroSlideshowBreakpointArt;
};

export type HeroSlideshowProps = {
  /** Already theme-filtered, already sorted, already breakpoint-complete —
   *  `Hero.tsx` drops any slide missing a resolvable breakpoint before this
   *  ever mounts (D21: never render a broken crop). */
  slides: HeroSlideshowSlide[];
  /** ms between auto-advances. D11: "about 7 seconds." */
  intervalMs?: number;
};

/* ---------------------------------------------------------------------------
   Timing + grid constants
   --------------------------------------------------------------------------- */

const DEFAULT_INTERVAL_MS = 7000;

const TABLET_MIN_WIDTH = 768;
const DESKTOP_MIN_WIDTH = 1024;

/** 8×5 = 40 tiles (D11: "~40 CSS tiles"). If either changes, the literal
 *  `grid-cols-8`/`grid-rows-5` Tailwind classes on `<MosaicTiles>`'s root
 *  MUST change with them — Tailwind needs the literal class text to scan,
 *  a template string will not generate the utility. */
const GRID_COLS = 8;
const GRID_ROWS = 5;

/** Per-tile fade/shrink duration + the diagonal stagger step. Total transition
 *  = STEP * (max(row)+max(col)) + DURATION = 32 * 11 + 420 = 772ms — inside
 *  D11's 720–800ms band. */
const TILE_DURATION_MS = 420;
const TILE_STEP_MS = 32;
const TRANSITION_VISUAL_MS = TILE_STEP_MS * (GRID_ROWS - 1 + (GRID_COLS - 1)) + TILE_DURATION_MS;
/** Small buffer after the last tile visually finishes before the DOM swap —
 *  never visible (the incoming image is already fully opaque by then), just
 *  insurance against committing a frame early. */
const COMMIT_BUFFER_MS = 60;
const COMMIT_DELAY_MS = TRANSITION_VISUAL_MS + COMMIT_BUFFER_MS;

/** Ink scrim seat — token-only, matches `OptionTiles.tsx`'s documented
 *  `color-mix(in_srgb, var(--ink) NN%, transparent)` vocabulary. Still used
 *  by `<PauseControl>`, the one surviving control (D24). */
const CONTROL_SEAT =
  "bg-[color-mix(in_srgb,var(--ink)_72%,transparent)] text-paper transition-colors duration-fast ease-out hover:bg-[color-mix(in_srgb,var(--ink)_85%,transparent)]";

/* ---------------------------------------------------------------------------
   useHeroBreakpoint — the ONE place this file tracks viewport width in JS,
   used only to pick which single JPG the mosaic tiles texture from. Actual
   image RESOURCE selection stays native (`<picture><source media>`).
   --------------------------------------------------------------------------- */

function useHeroBreakpoint(): HeroBreakpoint {
  const [breakpoint, setBreakpoint] = useState<HeroBreakpoint>("mobile");

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const tabletQuery = window.matchMedia(`(min-width: ${TABLET_MIN_WIDTH}px)`);
    const desktopQuery = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);

    const update = () => {
      setBreakpoint(desktopQuery.matches ? "desktop" : tabletQuery.matches ? "tablet" : "mobile");
    };
    update();

    tabletQuery.addEventListener("change", update);
    desktopQuery.addEventListener("change", update);
    return () => {
      tabletQuery.removeEventListener("change", update);
      desktopQuery.removeEventListener("change", update);
    };
  }, []);

  return breakpoint;
}

/* ---------------------------------------------------------------------------
   SlidePicture — one real <picture>, art-directed per breakpoint.
   --------------------------------------------------------------------------- */

function SlidePicture({
  slide,
  priority,
  decorative = false,
  className,
}: {
  slide: HeroSlideshowSlide;
  priority: boolean;
  /** True for the incoming layer mid-transition and the ahead-of-use preload
   *  copy — real content only ever needs ONE announced image at a time. */
  decorative?: boolean;
  className?: string;
}) {
  const positionStyle = {
    "--hk-pos-mobile": slide.mobile.objectPosition,
    "--hk-pos-tablet": slide.tablet.objectPosition,
    "--hk-pos-desktop": slide.desktop.objectPosition,
  } as CSSProperties;

  return (
    <picture
      aria-hidden={decorative || undefined}
      className={cn("absolute inset-0 block h-full w-full", className)}
    >
      <source
        media={`(min-width: ${DESKTOP_MIN_WIDTH}px)`}
        srcSet={slide.desktop.avifSrcSet}
        type="image/avif"
        sizes="100vw"
      />
      <source
        media={`(min-width: ${DESKTOP_MIN_WIDTH}px)`}
        srcSet={slide.desktop.webpSrcSet}
        type="image/webp"
        sizes="100vw"
      />
      <source
        media={`(min-width: ${TABLET_MIN_WIDTH}px)`}
        srcSet={slide.tablet.avifSrcSet}
        type="image/avif"
        sizes="100vw"
      />
      <source
        media={`(min-width: ${TABLET_MIN_WIDTH}px)`}
        srcSet={slide.tablet.webpSrcSet}
        type="image/webp"
        sizes="100vw"
      />
      <source srcSet={slide.mobile.avifSrcSet} type="image/avif" sizes="100vw" />
      <source srcSet={slide.mobile.webpSrcSet} type="image/webp" sizes="100vw" />
      <img
        src={slide.mobile.src}
        width={slide.mobile.width}
        height={slide.mobile.height}
        alt={decorative ? "" : slide.alt}
        sizes="100vw"
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "h-full w-full object-cover",
          "[object-position:var(--hk-pos-mobile)]",
          "md:[object-position:var(--hk-pos-tablet)]",
          "lg:[object-position:var(--hk-pos-desktop)]",
        )}
        style={positionStyle}
      />
    </picture>
  );
}

/* ---------------------------------------------------------------------------
   MosaicTiles — the transient transition layer. Unmounted the instant the
   transition commits; never present at rest.
   --------------------------------------------------------------------------- */

function MosaicTiles({
  slide,
  breakpoint,
  revealed,
}: {
  /** The OUTGOING slide — tiles texture from this and fade away to reveal
   *  the incoming full image sitting beneath them. */
  slide: HeroSlideshowSlide;
  breakpoint: HeroBreakpoint;
  /** false = tiles fully opaque (visually identical to the resting frame
   *  that preceded the transition); true = faded/shrunk, revealing beneath. */
  revealed: boolean;
}) {
  const tileSrc = slide[breakpoint].src;
  const tiles: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      tiles.push({ row, col });
    }
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 grid grid-cols-8 grid-rows-5"
    >
      {tiles.map(({ row, col }) => (
        <div
          key={`${row}-${col}`}
          style={{
            backgroundImage: `url(${tileSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
            backgroundPosition: `${(col / (GRID_COLS - 1)) * 100}% ${(row / (GRID_ROWS - 1)) * 100}%`,
            opacity: revealed ? 0 : 1,
            transform: revealed ? "scale(0.94)" : "scale(1)",
            transitionProperty: "opacity, transform",
            transitionDuration: `${TILE_DURATION_MS}ms`,
            transitionTimingFunction: EASE_CSS.out,
            transitionDelay: `${(row + col) * TILE_STEP_MS}ms`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   PauseControl — the one surviving interactive affordance (D24). Invisible
   until keyboard focus: parked off the top of the slideshow's own clipped
   box at rest (the root carries `overflow-hidden`, so the off-canvas state
   is neither seen nor an accidental hit target — the same mechanism
   globals.css's `skip-link` utility relies on at the viewport edge), then
   slides down into a normal on-screen position on `:focus-visible`. Hover/
   focus-within on the slideshow root already pauses autoplay for pointer
   users touching the slideshow anywhere; this button is what WCAG 2.2.2
   requires for keyboard users who tab in without ever hovering it.
   --------------------------------------------------------------------------- */

function PauseControl({
  manualPaused,
  onTogglePause,
}: {
  manualPaused: boolean;
  onTogglePause: () => void;
}) {
  return (
    <button
      type="button"
      data-slideshow-controls
      onClick={onTogglePause}
      aria-pressed={manualPaused}
      aria-label={manualPaused ? "Resume the hero slideshow" : "Pause the hero slideshow"}
      className={cn(
        "absolute -top-16 left-4 z-20 flex h-11 w-11 items-center justify-center rounded-pill",
        "transition-[top] duration-fast ease-out focus-visible:top-4",
        CONTROL_SEAT,
      )}
      style={{ "--focus": "var(--accent-on-dark)" } as CSSProperties}
    >
      {manualPaused ? (
        <Play aria-hidden="true" className="size-4" />
      ) : (
        <Pause aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}

/* ---------------------------------------------------------------------------
   HeroSlideshow
   --------------------------------------------------------------------------- */

export function HeroSlideshow({ slides, intervalMs = DEFAULT_INTERVAL_MS }: HeroSlideshowProps) {
  const prefersReduced = useReducedMotion();
  const reduceMotionActive = !motionAllowed(prefersReduced);
  const breakpoint = useHeroBreakpoint();

  const hasMultiple = slides.length > 1;

  const [index, setIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [tilesRevealed, setTilesRevealed] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [preloadTarget, setPreloadTarget] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const pendingRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const innerRafRef = useRef<number | null>(null);
  const isFirstPaintRef = useRef(true);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    pendingRef.current = pendingIndex;
  }, [pendingIndex]);

  // Offscreen pause (D11).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Hidden-tab pause (D11).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = () => setIsHidden(document.hidden);
    handler();
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const commitTransition = useCallback((next: number) => {
    isFirstPaintRef.current = false;
    indexRef.current = next;
    pendingRef.current = null;
    setIndex(next);
    setPendingIndex(null);
    setTilesRevealed(false);
  }, []);

  // Autoplay-only advance — D24 removes every manual prev/next/dot path, so
  // this is called exclusively from the autoplay timer below. Auto-advances
  // stay silent (no status-message announcement); the mosaic transition is
  // still the full D11 treatment.
  const goTo = useCallback(
    (rawNext: number) => {
      if (slides.length <= 1) return;
      if (pendingRef.current !== null) return; // mid-transition — ignore

      const normalized = ((rawNext % slides.length) + slides.length) % slides.length;
      if (normalized === indexRef.current) return;

      if (reduceMotionActive) {
        isFirstPaintRef.current = false;
        indexRef.current = normalized;
        setIndex(normalized);
        return;
      }

      pendingRef.current = normalized;
      setPendingIndex(normalized);
      setTilesRevealed(false);

      // Paint the tiles at their fully-opaque (covering) state first, THEN
      // flip to the revealed state on a later frame — a CSS transition needs
      // two distinct painted states to animate between.
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        innerRafRef.current = requestAnimationFrame(() => setTilesRevealed(true));
      });

      if (transitionTimeoutRef.current !== null) window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = window.setTimeout(() => commitTransition(normalized), COMMIT_DELAY_MS);
    },
    [slides, reduceMotionActive, commitTransition],
  );

  // The one remaining manual action (D24): toggling pause/resume. Announces
  // the state change via the polite status string, since there is no longer
  // any other way for a screen-reader user to know the slideshow reacted.
  const handleTogglePause = useCallback(() => {
    setManualPaused((prev) => {
      const next = !prev;
      setStatusMessage(next ? "Hero slideshow paused" : "Hero slideshow resumed");
      return next;
    });
  }, []);

  // Autoplay.
  const autoplayEnabled =
    hasMultiple && !reduceMotionActive && !manualPaused && !isInteracting && !isHidden && isVisible;

  useEffect(() => {
    if (!autoplayEnabled) return;
    const id = window.setTimeout(() => goTo(indexRef.current + 1), intervalMs);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `index` re-arms the timer after every commit; `goTo` is stable across renders that matter.
  }, [autoplayEnabled, intervalMs, index, goTo]);

  // Preload the NEXT slide ahead of use (D11), deferred past the critical
  // path via requestIdleCallback (falls back to a short setTimeout — Safari
  // has no requestIdleCallback).
  useEffect(() => {
    if (!hasMultiple || pendingIndex !== null) return;
    const target = (index + 1) % slides.length;
    let cancelled = false;

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => {
        if (!cancelled) setPreloadTarget(target);
      });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(handle);
      };
    }

    const handle = window.setTimeout(() => {
      if (!cancelled) setPreloadTarget(target);
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [index, pendingIndex, hasMultiple, slides.length]);

  // Cleanup on unmount.
  useEffect(
    () => () => {
      if (transitionTimeoutRef.current !== null) window.clearTimeout(transitionTimeoutRef.current);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (innerRafRef.current !== null) cancelAnimationFrame(innerRafRef.current);
    },
    [],
  );

  if (slides.length === 0) return null;

  const current = slides[index];

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Hotel photography"
      className="relative w-full shrink-0 overflow-hidden bg-surface aspect-[4/3] md:aspect-[16/7] lg:aspect-[4/1]"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsInteracting(false);
        }
      }}
    >
      {pendingIndex === null ? (
        <SlidePicture slide={current} priority={isFirstPaintRef.current && index === 0} />
      ) : (
        <>
          <SlidePicture slide={slides[pendingIndex]} priority={false} decorative className="z-0" />
          <MosaicTiles slide={current} breakpoint={breakpoint} revealed={tilesRevealed} />
        </>
      )}

      {preloadTarget !== null && preloadTarget !== index && pendingIndex === null ? (
        <SlidePicture
          slide={slides[preloadTarget]}
          priority={false}
          decorative
          className="-z-10 opacity-0"
        />
      ) : null}

      {hasMultiple && !reduceMotionActive ? (
        <PauseControl manualPaused={manualPaused} onTogglePause={handleTogglePause} />
      ) : null}

      <span aria-live="polite" className="visually-hidden">
        {statusMessage}
      </span>
    </div>
  );
}
