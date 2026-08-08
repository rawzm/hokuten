/**
 * components/hero/HeroCoverPanel.tsx — `#hero`, Theme G's dark cover panel.
 *
 * Governed by hokuten-design-director ref 04 (`#hero`), ref 05 (ASCII hero,
 * reveals, reduced-motion), ref 06 (voice, evidence gate), ref 07 (a11y).
 * Spec of record: docs/design/specs/hero.md.
 *
 * ── Layout: copy and art are SIBLINGS, never overlaid ──────────────────────
 * The brief's hardest constraint is that the art's seam row (which resolves
 * into THE HOKUTEN GROUP, `art.seamRow` = row 46 of 64 = 71.9% down the grid,
 * verified against the shipped `public/art/ascii-gold.json`) must never
 * collide with the headline, at any viewport. Rather than reserve a percentage
 * band and hope no headline length/viewport combination ever breaks it, this
 * component makes collision structurally impossible: copy and art occupy
 * disjoint boxes (a CSS grid, two columns on `lg:` and up, a single stacked
 * column below it) instead of one being overlaid on the other. There is no
 * shared coordinate space for the seam row and the headline to collide in, at
 * 375 / 768 / 1440 or anywhere between.
 *   - **< lg (375, 768)**: single column, source order = eyebrow → h1 → sub →
 *     CTAs → art. The reserved region for the art is everything BELOW the
 *     copy block — the seam row (and everything else in the grid) lives
 *     entirely under the last CTA, with zero vertical overlap.
 *   - **≥ lg (1440)**: two-column grid, copy in column 1 (left), art in
 *     column 2 (right). The reserved region for the art is the entire right
 *     column — the seam row lives at 71.9% down THAT column only; the
 *     headline lives in column 1 and never enters column 2's x-range.
 * This also means "one authoritative sentence before imagery" (the Paisana
 * reference digest's manifesto-hero principle) is true by construction on
 * mobile: the sentence is literally first in the DOM, the art comes after it.
 *
 * ── Nav scroll-sentinel contract ────────────────────────────────────────────
 * `SiteNav.tsx` already exists (built concurrently) and defines/consumes this
 * contract itself (docs/design/specs/nav.md "The sentinel contract"): the
 * element spanning the hero's full block extent carries `data-nav-sentinel`
 * (presence-only) and `data-surface="dark"|"light"`, read via
 * `themePresentation.heroSurface === "surface-black" ? "dark" : "light"`. That
 * is implemented verbatim below on `<section id="hero">` itself — the
 * simplest correct element per nav's own spec, no extra marker needed. This
 * file does NOT invent a second contract.
 *
 * ── Why no `star-grain` ─────────────────────────────────────────────────────
 * `globals.css`'s `star-grain` utility is opt-in texture for dark sections
 * (ref 03: "Dark sections MAY carry star-grain"). The ASCII canvas is already
 * this screen's one signature effect and is itself a dense character texture;
 * layering a second decorative texture over/beside it risks reading as a
 * competing effect (ref 07 P1: "two signature effects in one viewport") rather
 * than a complement. `#method` (a dark chapter with no art object of its own)
 * uses `star-grain` for exactly the texture the hero's own art already
 * supplies here — so the hero deliberately opts out. Ground stays plain
 * `--black`.
 *
 * ── Motion: exactly two systems, per the brief ──────────────────────────────
 * 1. The ASCII canvas's own shimmer + ambient morph loop (owned by
 *    `AsciiCanvas`, not this file) — the signature effect.
 * 2. ONE `<Reveal>` wrapping the copy+art grid as a single block (no stagger,
 *    no per-child reveals) — the "single entrance reveal" the brief asks for.
 *    In practice this fires zero animation on a normal page load: `Reveal`
 *    only arms elements that start below the fold on mount
 *    (`Reveal.tsx` header), and the hero is always the first thing in the
 *    viewport, so the copy renders in its final, visible state immediately —
 *    satisfying "the h1 ... server-rendered immediately, never blocked."
 * The scroll cue and value rail render statically — no third animation.
 *
 * Server Component. `Reveal`, `AsciiCanvas` and `Button`'s own internals carry
 * their own "use client" boundaries; this file adds no client JS of its own.
 */

import { ChevronDown } from "lucide-react";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { AsciiCanvas } from "@/components/art/AsciiCanvas";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { themePresentation } from "@/lib/theme";
import { heroContent } from "./heroContent";

export function HeroCoverPanel() {
  const { eyebrow, headline, sub, ctaPrimary, ctaGhost, rail, scrollCue, scrollCueHref } =
    heroContent;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      data-nav-sentinel
      data-surface={themePresentation.heroSurface === "surface-black" ? "dark" : "light"}
      className="surface-black relative overflow-hidden"
    >
      <Reveal
        as="div"
        className="container-hk section-pad relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
      >
        {/* Copy column */}
        <div className="max-w-[52ch]">
          <MicroLabel as="p">{eyebrow}</MicroLabel>

          <h1 id="hero-heading" className="mt-6 font-display text-display1 font-light">
            {headline.before}
            <em className="italic">{headline.accent}</em>
            {headline.after}
          </h1>

          <p className="mt-6 max-w-[46ch] text-body-lg">
            <span className="text-fg-muted">{sub}</span>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild variant="primary" size="lg">
              <a href={ctaPrimary.href}>{ctaPrimary.label}</a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href={ctaGhost.href}>{ctaGhost.label}</a>
            </Button>
          </div>
        </div>

        {/* Art column — the reserved region for the seam row (see file header). */}
        <div className="relative">
          <AsciiCanvas palette="gold" className="w-full" />
        </div>
      </Reveal>

      {/* Right-edge value rail — decorative rhythm, desktop only. */}
      <ul
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 lg:right-12 lg:flex"
      >
        {rail.map((item) => (
          <li key={item} className="micro-label [writing-mode:vertical-rl]">
            {item}
          </li>
        ))}
      </ul>

      {/* Scroll cue — static, no bounce/loop (ref 05: no second animation on this screen).
          `bottom-6`/`sm:bottom-8`: kept inside `section-pad`'s bottom padding at its
          smallest clamp value (4rem/64px at the 375px floor) rather than a single
          fixed offset — the cue's own rendered height (~39px) plus a fixed 32px
          offset would slightly outrun that floor. */}
      <a
        href={scrollCueHref}
        className="absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-2 text-fg-meta transition-colors duration-fast ease-out hover:text-fg sm:bottom-8"
      >
        <span className="micro-label">{scrollCue}</span>
        <ChevronDown aria-hidden="true" strokeWidth={1.5} className="size-4" />
      </a>
    </section>
  );
}
