/**
 * components/hero/Hero.tsx — `#hero`, screen 1 of the twelve-panel chassis.
 *
 * Governed by docs/DESIGN-REVISIT-2.md D9 (stage-shell), D10 (page-panel +
 * native snap), D11 (the slideshow — mechanics documented in full in
 * ./HeroSlideshow.tsx, read that file too), §3.1 ("Hero owns the brand rail
 * inside the first panel... refactor `BrandsMarquee` so it can render as a
 * landmark inside the hero without a second snap target or a brittle
 * hard-coded `--brands-h` subtraction") and §5.1 (the four-row desktop
 * composition this file implements), and docs/DESIGN-REVISIT-3.md D25 (the
 * panel must land on exactly one usable screen; row 3 spans the full
 * `stage-shell` width like every other section instead of a centred
 * `container-hk` column — see "Row 3" below, which SUPERSEDES this file's
 * own prior container-hk doctrine, not quietly drops it). Rewritten this
 * round — read this header before assuming any prior anatomy still applies;
 * the "Row 4 is a SIBLING, never a child" doctrine this file used to carry is
 * SUPERSEDED below, not quietly dropped.
 *
 * ── Anatomy — four rows, ONE `page-panel` ────────────────────────────────
 *   Row 1  Nav. Not this file's job — `SiteNav.tsx` renders as a normal-flow
 *          surface band before `<Hero>` in `app/page.tsx`.
 *   Row 2  `<HeroSlideshow>` — the art-directed slideshow (D11). Declared
 *          per-breakpoint display ratio (4:3 mobile / 16:7 tablet / 4:1
 *          desktop, §4.1) lives on that component's own root, which is what
 *          fixes finding #1 in the task brief's evidence table (the crop
 *          used to drift with viewport height and headline wrapping because
 *          the art band absorbed whatever height the headline row didn't
 *          use — it no longer does; the art band's height is now a pure
 *          function of its own width and the declared ratio).
 *   Row 3  Headline row, on the themed surface below the art: left = the h1
 *          manifesto at `text-display0` (the one place that token is
 *          allowed), one italic accent word; right = the sub line + two
 *          CTAs. **Restructured 2026-08-10 (D25):** this used to be a
 *          full-width stack (eyebrow+h1 spanning the whole row, a SEPARATE
 *          split sub-row beneath it) inside a centred `container-hk` column
 *          — Razim's review found the copy "sits in a centred column with
 *          large dead margins on both sides." It is now a genuine two-column
 *          split spanning the full `stage-shell` (ref 04 §5.1's anatomy,
 *          "proposition dominant left, supporting line + CTAs right," which
 *          the pre-D25 build never actually implemented): left column
 *          (`lg:flex-1`) carries the eyebrow+h1 stack and claims whatever
 *          width the right column does not; right column (`lg:w-[26rem]
 *          lg:shrink-0`) carries the sub line + both CTAs, stacked. See the
 *          inline comment at the JSX for the one-screen budget arithmetic.
 *   Row 4  `<BrandsMarquee />` — now a DIRECT CHILD of `<section id="hero">`,
 *          not a sibling landmark. See "Row 4 is now nested" below.
 *
 * ── The panel, not two fixed boxes that happen to add up ─────────────────
 * The retired build gave the SECTION a fixed
 * `lg:h-[calc(var(--screen-fit)-var(--brands-h))]` height (subtracting a
 * hard-coded `--brands-h: 184px` from `globals.css`) specifically because
 * the brand rail was a SIBLING outside the section, so the pair had to sum
 * to exactly one screen by construction. §3.1 calls that subtraction out by
 * name as brittle and asks for it to go. Now that the rail is INSIDE this
 * section, there is nothing to subtract: `<section id="hero">` simply
 * carries `page-panel` (D10's `min-height: var(--screen-fit)` at ≥64rem) and
 * composes its three content rows with flex —
 *   `flex flex-col` on the section;
 *   an inner `flex flex-1 flex-col lg:justify-center` wrapper around rows
 *   2+3, so on a qualifying desktop where art+headline together are SHORTER
 *   than the remaining height, they centre as a unit in the space above the
 *   rail (§3.1: "vertically centre or distribute content within the usable
 *   height") instead of pinning to the top with dead space below;
 *   `<BrandsMarquee />` as the section's last child, `shrink-0` (its own
 *   root), so it always sits flush at the BOTTOM of the panel — the
 *   flex-1 sibling above it absorbs whatever space the rail does not need.
 * If art+headline are TALLER than the remaining space (a short/zoomed
 * viewport), `page-panel`'s `min-height` — never `height` — lets the whole
 * section grow past one screen and the document scrolls through it before
 * the next boundary; the (separately owned) tall-panel measurement island
 * takes it out of the mandatory snap set via `data-tall`. Nothing here
 * clips content to preserve a one-screen illusion.
 *
 * ── Row 4 is now NESTED — supersedes this file's own prior doctrine ──────
 * The retired build kept `<BrandsMarquee />` as a Fragment SIBLING of
 * `<section id="hero">`, specifically because `data-nav-sentinel` (below)
 * used to report a THEME-DEPENDENT `data-surface`, and pulling the
 * always-light marquee inside a sometimes-dark sentinel block would have
 * corrupted that signal. That constraint no longer holds: `data-surface` is
 * the constant `"light"` in both themes (see the surviving note on
 * `data-surface` below, unchanged from the prior build) — and `BrandsMarquee`
 * is ALSO always `.surface-paper` in both themes (its own file's "Band stays
 * light in both themes" doctrine). Nesting one light landmark inside another
 * light-sentinel section cannot corrupt anything nav reads. §3.1 asks for
 * this directly ("Hero owns the brand rail inside the same panel... Render
 * `<BrandsMarquee />` inside the hero panel") and it is also the correct
 * reading of what `data-nav-sentinel` was always FOR — "spans the hero's
 * FULL block extent" (SiteNav.tsx's own contract comment) now genuinely
 * means the full first screen, art through brand rail, not art+headline
 * with the rail silently excluded. `BrandsMarquee` still carries its own
 * `<section id="brands" aria-labelledby="brands-heading">` — a nested
 * landmark, not "wrapped in a second landmark" (that phrase in
 * `BrandsSection.tsx`'s header warns against ADDING a new wrapping landmark
 * of this file's own around the call, which this file does not do — it
 * renders `<BrandsMarquee />` as a plain JSX child, nothing more). It still
 * carries no `page-panel` of its own and is still not a second snap target;
 * only `<section id="hero">` does.
 *
 * ── Nav scroll-sentinel contract — UNCHANGED, preserved exactly ─────────
 * `SiteNav.tsx`'s header comment defines this contract and reads it at
 * runtime; this file is the consumer, not the author:
 *
 *   <section id="hero" ... data-nav-sentinel data-surface="light">
 *
 * `data-nav-sentinel` is presence-only, on the element spanning the hero's
 * full block extent — with row 4 now nested, that is once again simply
 * `<section id="hero">` itself, no caveats.
 *
 * `data-surface` stays the constant `"light"` in both themes — this was
 * already true in the previous build (dated 2026-08-09) because the nav is a
 * normal-flow band ABOVE the full-bleed art, not overlaid on it, in either
 * theme. Nothing in this round's brief touches that; do not re-derive it
 * from `themePresentation.heroSurface` (that field governs ONLY row 3's own
 * background, per its own doc comment in `lib/theme.ts` — a narrower, still-
 * current, still-unchanged meaning).
 *
 * ── Art resolution — content/heroSlides.ts, not content/artwork.ts ──────
 * The retired build resolved a SINGLE image via `getArt(themePresentation.
 * heroArtPlacement)` against `content/artwork.ts`'s `hero.gold`/`hero.blue`
 * placements. D11 replaces that with the typed slideshow manifest in
 * `content/heroSlides.ts` — `getHeroSlidesForTheme`, `getHeroSlideArt`,
 * `getHeroSlideSources`. `resolveHeroSlideshowSlides()` below adapts that
 * manifest's per-breakpoint shape into `HeroSlideshow`'s prop shape, DROPPING
 * (never rendering broken) any slide missing a resolvable breakpoint — D21's
 * "a missing breakpoint uses the documented fallback and never silently
 * changes the crop." Today all three `HERO_SLIDES` entries resolve cleanly at
 * every breakpoint (they are Razim's accepted 2026-08-10 interim crops,
 * flagged `isInterim` in the manifest but NOT flagged in this UI — the task
 * brief is explicit: "do not hide or apologise for that in the UI; just
 * render them"). If `resolveHeroSlideshowSlides()` ever returns an empty
 * array (every slide `blocked: missing-crop`), this file falls back to the
 * same designed `<KanjiAccent>` interim it always has, inside the identical
 * aspect-ratio box so the panel's proportions do not jump between the two
 * states.
 *
 * FLAG for whoever next owns `content/artwork.ts`: its `hero.gold`/
 * `hero.blue` placements are no longer read by this file. Not cleaned up
 * here — that manifest belongs to a different agent this round.
 *
 * ── Preserved from the prior build, unchanged ────────────────────────────
 * The one `<h1>`, its one italic accent word, both CTAs routed through the
 * shared `<AnchorLink>` focus-handling island, `heroContent.ts`'s copy
 * verbatim (no new claim invented — see that file for why it did not need
 * an edit this round), and the Theme B `plate-frame` inset-into-the-row fix
 * (its own inline comment below explains why it cannot sit on the full-width
 * row itself).
 *
 * ── D25 (2026-08-10) SUPERSEDES the pre-D25 `container-hk` doctrine ──────
 * The note this header used to carry here — "`container-hk` scoping row 3's
 * own prose measure... row 3 is exactly that local prose+CTA measure, not
 * the full `stage-shell`... widening it is out of this round's scope" — is
 * retired outright. Razim's review named row 3 explicitly: "the hero text
 * should be fit to whole width like other sections." Row 3's OUTER wrapper
 * is now `stage-shell` (D9), matching every other section on the page (see
 * the grep in ref 04/AGENT-BRIEF: `StatsSection`/`MandatesSection`/
 * `DoorsSection`/`TeamSection`/`FaqSection`/etc. all made this exact swap
 * already). The prose measure D9 still asks for ("constrain PROSE locally,
 * never throttle the whole composition") now lives on the SUB LINE only
 * (`max-w-[42ch]` on the `<p>`, tightened from the pre-D25 `56ch` to match
 * the right column's own narrower `26rem` measure) — never on the row's
 * outer wrapper, which is the one thing D25 explicitly forbids
 * ("no `max-w-*` throttle on the row itself").
 */

import { KanjiAccent } from "@/components/art/KanjiAccent";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { Reveal } from "@/components/motion/Reveal";
import { AnchorLink } from "@/components/nav/AnchorLink";
import { BrandsMarquee } from "@/components/sections/BrandsSection";
import { Button } from "@/components/ui/button";
import {
  getHeroSlideArt,
  getHeroSlideSources,
  getHeroSlidesForTheme,
  type HeroBreakpoint,
} from "@/content/heroSlides";
import { THEME, themePresentation } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { heroContent } from "./heroContent";
import { HeroSlideshow, type HeroSlideshowSlide } from "./HeroSlideshow";

const HERO_BREAKPOINTS: HeroBreakpoint[] = ["mobile", "tablet", "desktop"];

/**
 * Adapts `content/heroSlides.ts`'s manifest + resolvers into
 * `HeroSlideshow`'s prop shape. Pure, synchronous, cheap (3 slides × 3
 * breakpoints today) — safe to call directly in this Server Component's
 * render. Drops any slide missing a resolvable breakpoint rather than
 * rendering a broken or mismatched crop (D21).
 */
function resolveHeroSlideshowSlides(): HeroSlideshowSlide[] {
  const eligible = getHeroSlidesForTheme(THEME);
  const resolved: HeroSlideshowSlide[] = [];

  for (const slide of eligible) {
    const art = Object.fromEntries(
      HERO_BREAKPOINTS.map((bp) => [bp, getHeroSlideArt(slide.id, bp)]),
    ) as Record<HeroBreakpoint, ReturnType<typeof getHeroSlideArt>>;
    const sources = Object.fromEntries(
      HERO_BREAKPOINTS.map((bp) => [bp, getHeroSlideSources(slide.id, bp)]),
    ) as Record<HeroBreakpoint, ReturnType<typeof getHeroSlideSources>>;

    const complete = HERO_BREAKPOINTS.every((bp) => art[bp] !== null && sources[bp] !== null);
    if (!complete) continue;

    resolved.push({
      id: slide.id,
      alt: slide.alt,
      mobile: {
        src: art.mobile!.src,
        width: art.mobile!.width,
        height: art.mobile!.height,
        objectPosition: art.mobile!.objectPosition,
        avifSrcSet: sources.mobile!.avif,
        webpSrcSet: sources.mobile!.webp,
      },
      tablet: {
        src: art.tablet!.src,
        width: art.tablet!.width,
        height: art.tablet!.height,
        objectPosition: art.tablet!.objectPosition,
        avifSrcSet: sources.tablet!.avif,
        webpSrcSet: sources.tablet!.webp,
      },
      desktop: {
        src: art.desktop!.src,
        width: art.desktop!.width,
        height: art.desktop!.height,
        objectPosition: art.desktop!.objectPosition,
        avifSrcSet: sources.desktop!.avif,
        webpSrcSet: sources.desktop!.webp,
      },
    });
  }

  return resolved;
}

export function Hero() {
  const { eyebrow, headline, sub, ctaPrimary, ctaGhost } = heroContent;
  const slides = resolveHeroSlideshowSlides();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      data-nav-sentinel
      data-surface="light"
      className="page-panel relative flex flex-col"
    >
      {/* Rows 2+3 share the panel's remaining height above the brand rail;
          `lg:justify-center` distributes any leftover space around them
          rather than pinning both to the top (§3.1). */}
      <div className="flex flex-1 flex-col lg:justify-center">
        {slides.length > 0 ? (
          <HeroSlideshow slides={slides} />
        ) : (
          // Dead code today (the interim slide manifest always resolves) —
          // the designed fallback if a future manifest edit ever leaves
          // every slide `blocked: missing-crop`. Same declared-ratio box as
          // the real slideshow so the panel's proportions do not jump.
          <div className="relative w-full shrink-0 overflow-hidden bg-surface aspect-[4/3] md:aspect-[16/7] lg:aspect-[4/1]">
            <div aria-hidden="true" className="absolute inset-0">
              <KanjiAccent />
            </div>
          </div>
        )}

        {/* Row 3 — headline row, on the themed surface below the art.
            D25 (2026-08-10): full `stage-shell` width, genuine two-column
            split (dominant left / narrower right), padding retuned for the
            one-screen budget. See the budget comment below for the numbers.
        */}
        <Reveal
          as="div"
          className={cn(themePresentation.heroSurface, "relative flex shrink-0 items-center")}
        >
          {/*
            ── D25 one-screen budget arithmetic (Razim: "the hero section is
            not fully fit to screen"; hero must land on `100svh - var(--nav-h)
            - var(--ticker-h)` = `--screen-fit`) ──────────────────────────

            `--screen-fit` at the two reference viewports (`--nav-h` 72px +
            `--ticker-h` 44px = 116px of fixed chrome, globals.css §2):
              1440×900  → 900  - 116 = 784px
              1920×1080 → 1080 - 116 = 964px

            Row 2 (`<HeroSlideshow>`) is full-bleed at its declared `4:1`
            desktop ratio — height = viewport width / 4, NOT flexible (the
            whole point of the crop fix, do not touch):
              1440×900  → 1440 / 4 = 360px
              1920×1080 → 1920 / 4 = 480px

            Row 4 (`<BrandsMarquee>`, this section's own file) at the D25
            chip clamp (`clamp(3rem, 2.5rem + 2.6vw, 5rem)`, ceiling reached
            ~1538px width) plus its `py-6`/`gap-4` rhythm and the two-line
            trademark microcopy that `container-hk`'s ~1104px content width
            already forces pre-D25 (unrelated to this round's chip change):
              chip height: 1440px → ~77px · 1920px → 80px (ceiling)
              48 (py-6) + 32 (2× gap-4) + 16 (h2) + chip + ~31 (2-line p)
              1440×900  → 48+32+16+77+31 ≈ 204px
              1920×1080 → 48+32+16+80+31 ≈ 207px

            That leaves row 3's own budget:
              1440×900  → 784 - 360 - 204 = 220px
              1920×1080 → 964 - 480 - 207 = 277px

            Row 3's own height (this row, both columns vertically centred —
            the taller column sets the row's height), at the padding below
            and `text-display0`'s ceiling font-size (76px, reached ~1165px
            viewport width — both reference widths exceed it, line-height
            0.98 → ~75px/line):
              Left column (dominant, `lg:flex-1`): eyebrow (~16px) + `mt-4`
              (16px) + h1. The headline is 60 characters; at this column's
              real rendered width (viewport-dependent, not hand-measurable
              without a browser) it wraps 2–3 lines depending on actual
              Fraunces Light glyph metrics — this is the ONE figure in this
              budget that cannot be pinned exactly by hand:
                2 lines → 16+16+150 = 182px    3 lines → 16+16+225 = 257px
              Right column (`lg:w-[26rem]`): 2-line sub (~64px, the sentence
              is long enough that 1 line is unrealistic at this measure) +
              `gap-4` (16px) + the CTA row (Button `lg` = 52px) = 132px —
              never the binding column, both scenarios.
              Wrapper padding: `py-6 lg:py-5` = 40px (lg) both themes, PLUS
              Theme B's `plate-frame py-4 lg:py-5` = 40px more (registration-
              mark chrome Theme G does not carry — `plate-frame`'s marks are
              absolutely positioned off the border box, ref globals.css, so
              trimming this padding does not distort them).

            Totals (row 3 alone), 2-line-headline scenario:
              Gold  1440 → 40 + 182 = 222px  (budget 220 → ~at budget)
              Blue  1440 → 40 + 40 + 182 = 262px  (budget 220 → over ~42px)
              Gold  1920 → 222px  (budget 277 → fits, 55px margin)
              Blue  1920 → 262px  (budget 277 → fits, 15px margin)

            **Honest read:** 1920×1080 fits both themes under this estimate.
            1440×900 is within hand-calculation noise for Theme G and short
            by ~40px for Theme B specifically — the plate-frame chrome Theme
            B alone carries. If the headline actually wraps 3 lines instead
            of 2 (the one unmeasurable variable above), both themes need
            another ~75px at 1440, which this hand calculation cannot rule
            out. This is the exact gap docs/DESIGN-REVISIT-3.md §2 step 4
            schedules a real headless measurement pass to close — the two
            remaining levers if it does not already fit are `plate-frame`'s
            `py-4 lg:py-5` (Theme B only, no visual floor below ~12px given
            the -5px registration-mark offsets) and this wrapper's own
            `py-6 lg:py-5`. Both are called out again at their class names
            below so the next pass finds them without re-deriving this.
          */}
          <div className="stage-shell w-full py-6 lg:py-5">
            {/* Theme B's plate chrome lives HERE, inset inside stage-shell's
                gutter, so its -5px registration marks stay on screen rather
                than hanging past the edge of a full-width row. Padding is
                `py-4 lg:py-5` — the tightened, budget-driven figure; see the
                arithmetic above before loosening it back toward the pre-D25
                `py-6`. */}
            <div
              className={cn(
                themePresentation.plateChrome && "plate-frame px-5 py-4 lg:px-8 lg:py-5",
              )}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                {/* Left — the proposition, dominant (ref 04 §5.1). `lg:flex-1`
                    claims whatever width the fixed-measure right column does
                    not, rather than a hard percentage that would need
                    re-tuning every time the right column's own measure
                    changes. */}
                <div className="lg:flex-1">
                  <MicroLabel as="p">{eyebrow}</MicroLabel>

                  <h1 id="hero-heading" className="mt-4 font-display text-display0 font-light">
                    {headline.before}
                    <em className="italic">{headline.accent}</em>
                    {headline.after}
                  </h1>
                </div>

                {/* Right — supporting line + dual CTAs, stacked, at a fixed
                    narrower measure so the left column stays visibly
                    dominant at every `stage-shell` width (ref 04 §5.1:
                    "supporting line + CTAs right"). */}
                <div className="flex flex-col gap-4 lg:w-[26rem] lg:shrink-0">
                  <p className="max-w-[42ch] text-body-lg text-fg-muted">{sub}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button asChild variant="primary" size="lg">
                      {/* Safe assertion — both hrefs are anchor() results, which
                          always produce `#<SectionId>`. */}
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
          </div>
        </Reveal>
      </div>

      {/* Row 4 — nested, `shrink-0`, no `page-panel` of its own. See this
          file's header, "Row 4 is now nested." */}
      <BrandsMarquee />
    </section>
  );
}
