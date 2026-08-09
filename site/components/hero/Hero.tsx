/**
 * components/hero/Hero.tsx — `#hero`, the ONE chassis both themes now share.
 *
 * DESIGN-REVISIT.md §4.2 (executed here) + docs/AGENT-BRIEF.md D1/D2/D5/D6/D7.
 * Reference read in full before writing a line, per the task brief:
 * `Ref/HOYskIPaMAEwBLK.jpeg` + `Ref/HOYsosgaYAAt2xu.jpeg` (runcycle.com hero,
 * both crops of the same page) — clean white nav, full-bleed truncated
 * (~55–60vh) typographic-halftone art band, headline row BELOW the art
 * (serif display left, sub + two pill CTAs right), a logo bar closing the
 * first viewport.
 *
 * ── The defect this replaces ─────────────────────────────────────────────
 * Razim reviewed both live theme URLs on 2026-08-08 and rejected the previous
 * build: the art was a small block bottom-right of a two-column grid, and the
 * two themes ran two entirely different chassis — `HeroCoverPanel` (a dark
 * "cover panel," Theme G) and `HeroPlate` (a light "Coronal plate," Theme B),
 * each hosting an animated `<AsciiCanvas>` in an art *column* beside the copy.
 * Both files are DELETED by this change; there is exactly one chassis now,
 * and this file (no longer just a theme switch) IS it. `<AsciiCanvas>` is no
 * longer rendered anywhere on the page — `components/art/AsciiCanvas.tsx`,
 * `AsciiStatic.tsx` and `public/art/ascii-{gold,blue}.{json,svg}` are
 * untouched on disk (another agent owns them) but uninvested per D5; this
 * removes ~200KB gz of JSON asset fetch plus the canvas's own playback JS
 * from the hero's critical path, which is most of how the D7 budget (hero +
 * nav + stats interactive ≤200KB gzip) gets met from this file's side. The
 * "seam row" requirement the old files' headers documented at length (the
 * lettering resolving in-art at a fixed row) is retired along with them —
 * DESIGN-REVISIT §3.4 makes that a Razim-prompt concern now, not a build
 * concern, and nothing below carries the idea forward.
 *
 * ── Anatomy — four rows, exactly per §4.2 ────────────────────────────────
 *   Row 1  Nav. Not this file's job — `SiteNav.tsx` (owned by a concurrent
 *          agent) renders as a normal-flow surface band before `<Hero>` in
 *          `app/page.tsx`; this file does nothing to overlay or clear space
 *          for it beyond not fighting its own sticky positioning.
 *   Row 2  Full-bleed supplied 「北天」 glyph-mosaic art band, edge to edge (no
 *          `container-hk`), ~40svh mobile / ~55–60svh desktop. The LCP
 *          element: a plain `next/image`, `fill`, `preload` (see the
 *          "priority is deprecated" note below), real `alt` from the
 *          manifest. The art carries its own colours in both themes; nothing
 *          here recolors it.
 *   Row 3  Headline row on a themed surface below the art: left = the h1
 *          manifesto at `text-display0` (the one place on the site that
 *          token is allowed), one italic accent word; right = the sub line +
 *          two CTAs — runcycle's own split, read directly off the reference.
 *   Row 4  `<BrandsMarquee />` — see "Row 4 is a sibling, never a child"
 *          below.
 *
 * ── Nav scroll-sentinel contract ────────────────────────────────────────
 * `SiteNav.tsx`'s header comment defines this contract and reads it at
 * runtime; this file is the consumer, not the author:
 *
 *   <section id="hero" ... data-nav-sentinel data-surface="dark"|"light">
 *
 * `data-nav-sentinel` is presence-only, on the element spanning the hero's
 * FULL block extent — here that is `<section id="hero">` wrapping rows 2+3
 * ONLY (row 4 is deliberately outside it; see below).
 *
 * `data-surface` is now the CONSTANT "light" in both themes. It used to be
 * derived from `themePresentation.heroSurface`; that was correct only while the
 * nav overlaid the hero, and it shipped invisible ivory-on-ivory nav controls in
 * Theme G under this anatomy. The full reasoning sits on the component itself,
 * immediately above `export function Hero()` — read it there before changing it.
 *
 * ── Row 4 is a SIBLING, never a child ────────────────────────────────────
 * The task brief is explicit: `<BrandsMarquee />` "owns its own
 * `<section id="brands">` wrapper and its own accessible name, so do not wrap
 * it in another landmark." Nesting it inside `<section id="hero">` would do
 * exactly that (and would also pull the marquee — always `.surface-paper`,
 * regardless of theme — into the hero's own `data-nav-sentinel` block extent,
 * corrupting the dark/light signal SiteNav reads). So this component returns
 * a Fragment: `<section id="hero">` (rows 2+3), then `<BrandsMarquee />` as
 * an immediate sibling. Visually the two sit flush against each other with no
 * gap, reading as one continuous "first screen" even though they are two
 * independent sectioning landmarks in the DOM.
 *
 * ── The page-assembly seam — RESOLVED 2026-08-09 ─────────────────────────
 * This file embeds `<BrandsMarquee />`, so `app/page.tsx` must NOT also render
 * the standalone `<BrandsSection />`; doing both put two `<section id="brands">`
 * landmarks (a duplicate DOM id) and two marquees on the page. The main loop
 * removed that call, and `page.tsx` carries a comment saying why. `BrandsSection`
 * is still exported for any other consumer. `content/site.ts`'s `SECTION_IDS`
 * keeps its `hero → stats → brands → …` order deliberately: it is the anchor
 * registry and the nav's DOM-order tie-break, not a rendering order.
 *
 * ── Desktop viewport budget — RETUNED 2026-08-09 against a real render ───
 * The first pass gave `<section id="hero">` `section-fit` (a min-height of one
 * screen) and the art band a fixed `clamp(420px, 58svh, 760px)`, on the
 * assumption that the manifesto would set in one line. It does not: it is ~60
 * characters, and at `text-display0`'s then-132px maximum inside a half-width
 * column it wrapped to four lines. Measured at 1440x900 the hero came out 1402px
 * — 1.78 viewports — and pushed the CTAs and the whole brand marquee below the
 * fold, which is the one thing §4.2 says must not happen.
 *
 * Three changes fixed it, all verified by measuring the rendered page:
 *   1. `text-display0` retuned to a 4.75rem max (globals.css carries the note).
 *   2. The manifesto spans the FULL container and the sub + CTAs moved to the
 *      row beneath it. runcycle's literal left/right split works there because
 *      its headline is short; ours is a sentence.
 *   3. The art band became the FLEXIBLE element and the section took a fixed
 *      `lg:h-[calc(var(--screen-fit) - var(--brands-h))]`. The copy row is
 *      `shrink-0` and takes its natural height; the art absorbs the remainder.
 *      This is self-correcting — the hero is exactly one screen minus the
 *      marquee at any viewport height, instead of being the sum of two fixed
 *      boxes that only happened to add up at one size.
 *
 * Measured result at 1440x900: hero 604px + marquee 180px = 784px against a
 * 788px budget. Mobile is unchanged and deliberately NOT fit-to-viewport: the
 * art keeps its own `clamp(220px, 40svh, 380px)` band and the page flows.
 */

import Image from "next/image";
import { KanjiAccent } from "@/components/art/KanjiAccent";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { AnchorLink } from "@/components/nav/AnchorLink";
import { BrandsMarquee } from "@/components/sections/BrandsSection";
import { Button } from "@/components/ui/button";
import { getArt } from "@/content/artwork";
import { themePresentation } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { heroContent } from "./heroContent";

/*
 * WHY THE HERO'S nav sentinel REPORTS "light" IN BOTH THEMES (2026-08-09).
 * This is a behaviour change, not a leftover — read it before "fixing" it back
 * to `themePresentation.heroSurface === "surface-black" ? "dark" : "light"`.
 *
 * `data-surface` tells SiteNav what sits BEHIND the nav band so it can pick a
 * contrasting text colour. Under the old anatomy the nav was overlaid on the
 * hero, so the hero's own surface was the right answer and Theme G reported
 * "dark". Under the runcycle anatomy the nav is a normal-flow band ABOVE the
 * full-bleed art (§4.2 row 1: "clean nav — surface, not overlaid"), so what is
 * behind it is the paper page top, in both themes. Deriving it from
 * `heroSurface` kept returning "dark" for Theme G and painted the nav links and
 * the menu trigger ivory-on-ivory: invisible controls, and no way to open the
 * menu on mobile at all. Caught in screenshot QA at 375px.
 *
 * The scrolled state stays correct too: SiteNav paints a translucent paper
 * background under itself once scrolled, so dark link text keeps its contrast
 * even where the hero's dark copy row passes underneath.
 */
export function Hero() {
  const { eyebrow, headline, sub, ctaPrimary, ctaGhost } = heroContent;
  const art = getArt(themePresentation.heroArtPlacement);

  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        data-nav-sentinel
        data-surface="light"
        /* NOT `section-fit`. The brands marquee is a sibling landmark (see the
           bottom of this file), so the hero must claim one screen MINUS the
           marquee's height or the pair overflows by exactly that much — which
           is what shipped in the first pass. Retuned by the main loop against a
           real 1440x900 render, 2026-08-09. */
        className="relative flex flex-col lg:h-[calc(var(--screen-fit)-var(--brands-h))]"
      >
        {/* Row 2 — full-bleed art band, the LCP element. No container-hk: this
            is the one deliberately edge-to-edge element in the hero. */}
        <div
          className={cn(
            "relative w-full overflow-hidden bg-surface",
            // Mobile keeps a fixed svh band and natural flow below it.
            "h-[clamp(220px,40svh,380px)] shrink-0",
            // Desktop: the art ABSORBS whatever the headline row does not use.
            // Retuned 2026-08-09 against a real 1440x900 render. A fixed svh
            // band here was the bug: the section had to be tall enough for the
            // art AND the copy, so the pair overflowed one screen by exactly
            // however much the headline wrapped. Making the art the flexible
            // element inverts that — the hero is pinned to exactly one screen
            // minus the marquee, the copy takes its natural height, and the art
            // takes the rest. Self-correcting at 900px, 1080px and 1440px tall,
            // and it degrades to the min rather than pushing the CTAs off.
            "lg:h-auto lg:min-h-[220px] lg:flex-1 lg:shrink",
          )}
        >
          {art ? (
            <Image
              src={art.src}
              alt={art.alt}
              fill
              sizes={art.sizes}
              preload
              fetchPriority="high"
              className="object-cover"
            />
          ) : (
            // Dead code today (both hero placements are "delivered" in the
            // manifest) — the designed interim if that ever changes. See
            // this file's header, "Art resolution + the alt-text law."
            <div aria-hidden="true" className="absolute inset-0">
              <KanjiAccent />
            </div>
          )}
        </div>

        {/* Row 3 — headline row, on the themed surface below the art. */}
        <Reveal
          as="div"
          className={cn(themePresentation.heroSurface, "relative flex shrink-0 items-center")}
        >
          <div
            className={cn(
              // py-7/py-8 rather than section-pad-tight: every pixel this row
              // does not use goes to the art band, which is flex-1 above and is
              // the LCP element. section-pad-tight spends 96px here at 1440.
              "container-hk w-full py-7 lg:py-8",
              // NOTE: `plate-frame` deliberately does NOT go here. It draws its
              // registration marks with ::before/::after at -5px, and this
              // element spans the full viewport width — so on Theme B the
              // bottom-right mark hung 5px past the right edge and gave the
              // whole document a 4px horizontal scroll at 375 and 768. Caught
              // in screenshot QA on the blue build (gold never showed it,
              // because `plateChrome` is Theme B only). It also read wrong:
              // a plate frame flush to the screen edge is not a frame. It now
              // sits on the inner wrapper below, inside container-hk's gutter.
            )}
          >
            {/* Theme B's plate chrome lives HERE, inset inside container-hk's
                gutter, so its -5px registration marks stay on screen. */}
            <div className={cn(themePresentation.plateChrome && "plate-frame px-5 py-6 lg:px-8")}>
            {/* The manifesto spans the FULL container, then the sub line and
                CTAs share the row beneath it.

                The first pass followed runcycle's split literally — h1 in a
                half-width left column, sub + CTAs right. Measured at 1440 that
                gave the h1 only ~670px, so a ~60-character headline wrapped to
                four lines and the hero grew to 1.78 viewports. runcycle's split
                works there because its headline is short. Ours is a sentence,
                so it gets the full measure and the split moves down one row —
                same anatomy, honest about the copy it has to carry. */}
            <MicroLabel as="p">{eyebrow}</MicroLabel>

            <h1 id="hero-heading" className="mt-4 font-display text-display0 font-light">
              {headline.before}
              <em className="italic">{headline.accent}</em>
              {headline.after}
            </h1>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <p className="max-w-[56ch] text-body-lg text-fg-muted">{sub}</p>
              <div className="flex flex-wrap items-center gap-4 lg:shrink-0">
                <Button asChild variant="primary" size="lg">
                  {/* Safe assertion — both hrefs are anchor() results, which
                      always produce `#<SectionId>`. See this file's header,
                      "CTAs route through the shared anchor-focus handler." */}
                  <AnchorLink href={ctaPrimary.href as `#${string}`}>
                    {ctaPrimary.label}
                  </AnchorLink>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <AnchorLink href={ctaGhost.href as `#${string}`}>{ctaGhost.label}</AnchorLink>
                </Button>
              </div>
            </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Row 4 — a SIBLING landmark, never nested inside #hero. See this
          file's header, "Row 4 is a sibling, never a child" and "KNOWN
          INTEGRATION GAP." */}
      <BrandsMarquee />
    </>
  );
}
