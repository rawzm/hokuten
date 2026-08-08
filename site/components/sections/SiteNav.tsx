"use client";

/**
 * components/sections/SiteNav.tsx — the sticky primary nav.
 * Spec of record: docs/design/specs/nav.md (read that first — the state
 * model, the cascade-layer background gotcha, and every acceptance criterion
 * live there). Governed by hokuten-design-director ref 04 ("Nav"), ref 03
 * (surfaces, type ramp), ref 07 (P0: 44px targets, focus, no KW lockup).
 *
 * ┌── THE SENTINEL CONTRACT — this agent DEFINES it, the hero agent reads it ─┐
 * │ Neither site/components/hero/HeroCoverPanel.tsx nor Wordmark.tsx exists   │
 * │ yet (verified at authoring time). Per the task brief this file defines    │
 * │ the contract rather than consuming an existing one:                      │
 * │                                                                          │
 * │   <section id="hero" ... data-nav-sentinel data-surface="dark"|"light">  │
 * │                                                                          │
 * │ - data-nav-sentinel: presence-only marker on whichever element spans the │
 * │   hero's FULL block extent (the <section id="hero"> root itself is the   │
 * │   simplest correct choice). Exactly one is expected in Phase 1.          │
 * │ - data-surface: "dark" for Theme G's cover-panel chassis, "light" for    │
 * │   Theme B's plate chassis. Derive it from the existing                   │
 * │   `themePresentation.heroSurface` in lib/theme.ts — that record already  │
 * │   says "surface-black" (Theme G) vs "surface-paper" (Theme B) — rather   │
 * │   than hand-writing a second theme check:                                │
 * │     data-surface={themePresentation.heroSurface === "surface-black" ? "dark" : "light"} │
 * │                                                                          │
 * │ WHY THE SENTINEL SPANS THE WHOLE HERO, NOT JUST ITS BOTTOM EDGE           │
 * │ This file observes it with rootMargin "-{navHeight}px 0 0 0" (top-trimmed│
 * │ by the LIVE --nav-h custom property) and threshold 0. That reports        │
 * │ "intersecting" for exactly as long as the area BEHIND the nav band (the  │
 * │ top --nav-h px of the viewport) is still hero content, and flips false   │
 * │ the instant the nav's own bottom edge passes the hero's bottom edge. A   │
 * │ thin marker at only the hero's bottom edge cannot produce this: it would │
 * │ report "not intersecting" both before the hero is ever reached AND after │
 * │ it has fully passed — two opposite states collapsed into one signal.     │
 * │                                                                          │
 * │ FALLBACK: if no [data-nav-sentinel] exists (today's interim build, or a  │
 * │ chassis that forgets the attribute), this defaults to the LIGHT variant  │
 * │ permanently and logs a dev-only warning. Light, not dark: ink-on-        │
 * │ transparent stays legible over most content; ivory-on-transparent can    │
 * │ vanish over an unexpectedly light background. Fail toward the safer one. │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * ── Why this whole file is "use client" ─────────────────────────────────
 * Every part of nav's job here is dynamic: scroll-driven background, hero-
 * driven text variant, IntersectionObserver-driven active link, click-driven
 * focus management. There is no meaningful server-rendered remainder to push
 * a client island into — this matches the codebase's existing leaf-client
 * precedent (Stamp.tsx, AsciiCanvas.tsx, ConsentModal.tsx), not the
 * "server section + small client island" pattern used for page sections.
 *
 * ── Two independent state axes, never conflated ─────────────────────────
 * `scrolled` (has the page moved past 24px — ref 04) only ever toggles
 * WHETHER a background paints. `surface` ("dark" | "light", from the hero
 * sentinel only) governs BOTH the background colour and the text/icon/CTA
 * colour together, via the same `.surface-dark`/`.surface-paper` scope
 * classes every other component on the site already uses. Because both axes
 * read from the SAME `surface` value for colour, "scrolled + dark" can only
 * ever render as a translucent dark bar with ivory text (valid, high
 * contrast) — the ivory-on-paper failure mode a naive two-boolean design
 * would allow is structurally unreachable here.
 *
 * ── Why the scrolled background is set via inline `style`, not a class ───
 * `.surface-dark`/`.surface-paper` (globals.css §3) are plain, UNLAYERED CSS
 * — not wrapped in any `@layer` — and their `background-color: var(--surface)`
 * declaration is unconditional. Per the CSS cascade-layers spec, unlayered
 * rules always beat rules inside any `@layer`, and every Tailwind utility
 * (bg-transparent, bg-[...], etc.) is generated inside `@layer utilities`.
 * No Tailwind background utility can ever override `.surface-dark`'s own
 * background on the same element, at any class order — only an inline
 * `style` (which outranks both layered and unlayered class rules) can.
 * Verified against site/app/globals.css's actual structure, not assumed.
 */

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useIsomorphicLayoutEffect } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/Wordmark";
import { MenuOverlay } from "@/components/nav/MenuOverlay";
import { SECTION_IDS } from "@/content/site";
import { navCta, navLinks } from "@/content/nav";

/** ref 04: "paper with blur ... on scroll". A local constant — this axis has
 *  nothing to do with the hero sentinel and needs no shared token. */
const SCROLL_THRESHOLD_PX = 24;

/** Section ids the centre links point at, stripped of their leading "#". */
const NAV_LINK_IDS = navLinks.map((link) => link.href.slice(1));

/** Canonical DOM order, for resolving the rare case where the active-link
 *  observation band intersects more than one section at once. */
const DOM_ORDER = new Map<string, number>(SECTION_IDS.map((id, i) => [id, i]));

const TAP_TARGET = "inline-flex min-h-11 items-center";

type Surface = "dark" | "light";

/** Reads the live --nav-h custom property rather than hard-coding 88 — if the
 *  token ever changes, this observer stays correct without a matching edit. */
function readNavHeightPx(): number {
  if (typeof window === "undefined") return 88;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 88;
}

/**
 * Moves DOM focus to a section's heading after native hash navigation has
 * already scrolled to it. Duplicated (not shared) in MenuOverlay.tsx — see
 * that file's header for why. Every section pairs `<section id
 * aria-labelledby="{id}-heading">` with a heading carrying that exact id
 * (verified against Closings/Listings/Stats/Faq/Mandates/Doors/Method); the
 * plain `#{id}` fallback covers today's interim `Blocked` placeholders for
 * `#calculator`/`#team`, which have no heading yet.
 */
function focusAnchorTarget(hash: string): void {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const target = document.getElementById(`${id}-heading`) ?? document.getElementById(id);
  if (!target) return;

  const hadTabIndex = target.hasAttribute("tabindex");
  if (!hadTabIndex) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });

  if (!hadTabIndex) {
    const clear = () => {
      target.removeAttribute("tabindex");
      target.removeEventListener("blur", clear);
    };
    target.addEventListener("blur", clear);
  }
}

/**
 * Shared click handler for every internal `#id` link in this file. Never
 * preventDefaults — native hash navigation keeps ownership of the scroll
 * (honouring the global `scroll-margin-top`) and the URL; this only adds the
 * a11y requirement layered on top of it (P0, task brief: "Anchor clicks must
 * move FOCUS to the target section heading, not merely scroll").
 */
function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>): void {
  const href = event.currentTarget.getAttribute("href");
  if (href?.startsWith("#")) focusAnchorTarget(href);
}

export function SiteNav() {
  const scrollSentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [surface, setSurface] = useState<Surface>("light");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Correct the initial state BEFORE first paint (mirrors Reveal.tsx's own
  // documented reasoning): a plain useEffect would leave one visible frame
  // of the wrong (SSR-safe default) state on every load. Server and first
  // client render both use the `false`/"light" defaults above, so hydration
  // never mismatches; this layout effect only ever runs client-side, after
  // the hydration commit, so it cannot desync the markup.
  useIsomorphicLayoutEffect(() => {
    const scrollEl = scrollSentinelRef.current;
    if (scrollEl) {
      setScrolled(scrollEl.getBoundingClientRect().bottom <= 0);
    }

    const surfaceEl = document.querySelector<HTMLElement>("[data-nav-sentinel]");
    if (!surfaceEl) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[SiteNav] No [data-nav-sentinel] element found — defaulting to the " +
            "light nav variant. See docs/design/specs/nav.md for the contract.",
        );
      }
      return;
    }
    const navHeight = readNavHeightPx();
    const rect = surfaceEl.getBoundingClientRect();
    const declared: Surface = surfaceEl.dataset.surface === "dark" ? "dark" : "light";
    setSurface(rect.bottom > navHeight ? declared : "light");
  }, []);

  // Ongoing updates: the scroll sentinel (24px) and the hero sentinel each
  // get their own IntersectionObserver — never a scroll listener, never a
  // getBoundingClientRect() read outside the one-time layout effect above.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const scrollEl = scrollSentinelRef.current;
    if (scrollEl) {
      const scrollObserver = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0 },
      );
      scrollObserver.observe(scrollEl);
      observers.push(scrollObserver);
    }

    const surfaceEl = document.querySelector<HTMLElement>("[data-nav-sentinel]");
    if (surfaceEl) {
      const declared: Surface = surfaceEl.dataset.surface === "dark" ? "dark" : "light";
      const navHeight = readNavHeightPx();
      const surfaceObserver = new IntersectionObserver(
        ([entry]) => setSurface(entry.isIntersecting ? declared : "light"),
        { rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 },
      );
      surfaceObserver.observe(surfaceEl);
      observers.push(surfaceObserver);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Active link: a thin "active band" just under the bar. Deterministic tie-
  // break by canonical DOM order (SECTION_IDS), not IO callback order.
  useEffect(() => {
    const elements = NAV_LINK_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const navHeight = readNavHeightPx();
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) {
          setActiveId(null);
          return;
        }
        let winner: string | null = null;
        let winnerOrder = Number.POSITIVE_INFINITY;
        for (const id of visible) {
          const order = DOM_ORDER.get(id) ?? Number.POSITIVE_INFINITY;
          if (order < winnerOrder) {
            winner = id;
            winnerOrder = order;
          }
        }
        setActiveId(winner);
      },
      { rootMargin: `-${navHeight + 8}px 0px -70% 0px`, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const surfaceClass = surface === "dark" ? "surface-dark" : "surface-paper";

  return (
    <>
      {/* Self-owned scroll sentinel — see file header. No positioned ancestor
          needed: it resolves against the initial containing block, i.e. the
          true document top, since nothing before it in the tree is positioned. */}
      <div
        ref={scrollSentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 w-px"
        style={{ height: SCROLL_THRESHOLD_PX }}
      />

      <nav
        aria-label="Primary"
        className={cn(
          surfaceClass,
          "sticky top-0 z-40 h-[var(--nav-h)] transition-colors duration-base ease-out",
          scrolled && "hairline-b shadow-bar backdrop-blur-md",
        )}
        style={{
          // Overrides .surface-*'s own unlayered background — see file header.
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--surface) 88%, transparent)"
            : "transparent",
        }}
      >
        <div className="container-hk flex h-full items-center justify-between gap-6">
          {/* components/brand/Wordmark.tsx landed mid-build (verified via git
              status partway through this task) — wired in directly rather
              than shipping the brand-line fallback this file originally
              planned for. Default `variant="text"` is exactly the real-text,
              indexable, screen-reader-native treatment ref 04 wants here. */}
          <a
            href="#hero"
            onClick={handleAnchorClick}
            className={cn("shrink-0 whitespace-nowrap", TAP_TARGET)}
          >
            <Wordmark className="text-data" />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeId === id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleAnchorClick}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      TAP_TARGET,
                      "border-b-2 px-0.5 text-body transition-colors duration-fast ease-out",
                      isActive
                        ? "border-accent-text font-semibold text-fg"
                        : "border-transparent font-normal text-fg-muted hover:text-fg",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-3">
            <Button asChild variant="primary" size="md" className="hidden sm:inline-flex">
              <a href={navCta.href} onClick={handleAnchorClick}>
                {navCta.label}
              </a>
            </Button>
            <MenuOverlay />
          </div>
        </div>
      </nav>
    </>
  );
}

// Re-exported so a caller can reuse the exact focus-management contract
// (e.g. the eventual Hero CTA) without re-deriving it. Not required by any
// current consumer — kept narrow rather than promoted to lib/ (out of scope).
export { focusAnchorTarget, handleAnchorClick };
