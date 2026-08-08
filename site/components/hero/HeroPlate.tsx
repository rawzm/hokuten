/**
 * components/hero/HeroPlate.tsx — `#hero`, Theme B's light Coronal plate
 * chassis ("Hokuten Blue" = 北天, "northern sky," rendered literally).
 *
 * Governed by hokuten-design-director ref 02 (Coronal video digest — read in
 * full per the task brief; it is the specification), ref 04 (`#hero`), ref 05
 * (reveals, reduced-motion), ref 06 (voice, evidence gate), ref 07 (a11y).
 * Spec of record: docs/design/specs/hero.md.
 *
 * ── Same content, same seam-collision resolution as HeroCoverPanel ────────
 * Both chassis read from the ONE `heroContent` module (`./heroContent.ts`), so
 * the copy cannot drift between themes. The seam-row/headline collision
 * constraint (ref 04: "must never collide with the headline at any
 * viewport") is resolved the same structural way as `HeroCoverPanel`: the
 * headline lives in a copy column, the art lives in a separate plate column —
 * disjoint boxes, not an overlay, so there is nothing for the seam row to
 * collide WITH at 375 / 768 / 1440. (The blue ASCII asset carries the same
 * `seamRow` contract as gold — `ascii-blue.json`'s generator shares
 * `scripts/ascii-gen.ts` — so the same reasoning applies without re-deriving
 * it per palette.)
 *
 * ── "Chrome never moves while the art morphs" ──────────────────────────────
 * `PlateChrome` (hairline frame + 4 registration marks + caption) and the
 * white knockout card are both static, absolutely-positioned chrome; only the
 * `AsciiCanvas` layer beneath them repaints on its own ambient-loop schedule.
 * Nothing in this file animates the frame, the marks, the caption or the
 * card — the print-proof read depends on that stillness.
 *
 * ── The knockout card ────────────────────────────────────────────────────
 * Coronal's "white knockout plate carrying the wordmark + mono version tag,
 * centred over the art" (ref 02). The wordmark is `Wordmark`
 * (`components/brand/Wordmark.tsx`, already built) in its `variant="lockup"`
 * mode — its own doc comment names exactly this case: "a cover/print-style
 * panel where the exact glyph outlines matter more than live text reflow."
 * The mono tag below it, "北天 — Northern sky," is a translation gloss (ref 01:
 * "Hokuten (北天) means 'northern sky'"), not a business claim — it needs no
 * evidence-register row, the same way the hanko's own `<title>` ("北天 — The
 * Hokuten Group seal") glosses itself. It reuses the SAME "北天 — <gloss>"
 * convention the hanko SVG already established, rather than inventing a new
 * caption voice.
 * The card is real text, not `aria-hidden`: `Wordmark`'s `alt`/accessible name
 * IS the brand name, and Theme B's hero has no other visible wordmark on this
 * screen (unlike the nav, not yet scrolled to) — this card is the only place
 * a sighted OR assistive-tech visitor sees/hears "The Hokuten Group" before
 * scrolling.
 *
 * ── Plate caption ────────────────────────────────────────────────────────
 * "Study — Holiday Inn Express Brooklyn" names the real photograph the ASCII
 * asset is generated from (`ASCII_ART_DESCRIPTION` in `lib/ascii-types.ts`;
 * `content/closings.ts`'s own `name` string for the same property) — a print
 * proof's caption conventionally names its subject, and this one happens to
 * be true rather than invented.
 *
 * ── Nav scroll-sentinel contract ────────────────────────────────────────────
 * Identical mechanism to `HeroCoverPanel` — see that file's header for the
 * full contract. Here `themePresentation.heroSurface` resolves to
 * `"surface-paper"`, so `data-surface="light"`.
 *
 * ── Motion ───────────────────────────────────────────────────────────────
 * Same two-system budget as `HeroCoverPanel`: the canvas's own shimmer + loop
 * (signature effect) and ONE `<Reveal>` around the copy+plate grid (fires no
 * animation on a normal load — see that file's header for why).
 *
 * Server Component.
 */

import { ChevronDown } from "lucide-react";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { AsciiCanvas } from "@/components/art/AsciiCanvas";
import { PlateChrome } from "@/components/art/PlateChrome";
import { Wordmark } from "@/components/brand/Wordmark";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { themePresentation } from "@/lib/theme";
import { heroContent } from "./heroContent";

const PLATE_CAPTION = "Study — Holiday Inn Express Brooklyn";
const KNOCKOUT_TAG = "北天 — Northern sky";

export function HeroPlate() {
  const { eyebrow, headline, sub, ctaPrimary, ctaGhost, rail, scrollCue, scrollCueHref } =
    heroContent;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      data-nav-sentinel
      data-surface={themePresentation.heroSurface === "surface-black" ? "dark" : "light"}
      className="surface-paper relative overflow-hidden"
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

        {/* Plate column — framed art panel; chrome is static, art morphs beneath it. */}
        <div className="relative">
          <PlateChrome caption={PLATE_CAPTION}>
            <AsciiCanvas palette="blue" className="w-full" />

            {/* White knockout plate — wordmark + mono tag, centred over the art. */}
            <div
              className={
                "absolute left-1/2 top-1/2 z-10 flex w-[min(72%,18rem)] -translate-x-1/2 " +
                "-translate-y-1/2 flex-col items-center gap-3 rounded-card bg-card px-6 py-8 " +
                "text-center shadow-[var(--shadow-overlay)]"
              }
            >
              <Wordmark variant="lockup" height={22} />
              <span className="micro-label">{KNOCKOUT_TAG}</span>
            </div>
          </PlateChrome>
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
          offset would slightly outrun that floor.

          That ~39px rendered height (micro-label 15.4px + gap-2 8px + size-4 16px)
          is BELOW the 44px tap-target floor (ref 07 P0), so the hit area is grown
          with the same transparent `::before` expander `ui/button.tsx` uses for its
          `sm`/`link` variants: `-inset-y-1` adds 4px top and bottom for a ~47px
          target while the painted box — and therefore the `bottom-6` clearance
          maths above — is unchanged. The anchor is already `absolute`, so it is
          its own containing block and needs no extra `relative`. */}
      <a
        href={scrollCueHref}
        className="absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-2 text-fg-meta transition-colors duration-fast ease-out hover:text-fg sm:bottom-8 before:absolute before:content-[''] before:inset-x-0 before:-inset-y-1"
      >
        <span className="micro-label">{scrollCue}</span>
        <ChevronDown aria-hidden="true" strokeWidth={1.5} className="size-4" />
      </a>
    </section>
  );
}
