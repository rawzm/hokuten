/**
 * components/sections/StatsSection.tsx — `#stats`, the Trust Metrics proof
 * wall.
 *
 * Governed by design-skill references 03 (Type ramp → stat numerals: Fraunces,
 * never mono), 04 (`#stats`), 05 (Reveals → count-up rules) and 07 (P0: "stat
 * counters that show 0/placeholder without JS" — the Sarhan anti-pattern).
 * docs/DESIGN-REVISIT-2.md D12/D18/§5.2 govern this round's rebuild. Server
 * Component — the only client code that ships is inside the existing
 * `Reveal` and `CountUp`, both reused as-is.
 *
 * ── Why this file does not import `StatNumeral` ─────────────────────────────
 * `StatNumeral`'s `value` prop is typed `string`; it prints `{value}` as plain
 * text and has no slot that can host a component, so `<CountUp>` cannot be
 * passed into it. Its `countUp` flag only marks the numeral with
 * `data-countup`/`data-countup-value` for an external enhancer — no such
 * enhancer exists in the repo (grep confirms the only matches are that doc
 * comment and `CountUp.tsx`'s own unrelated marker), so flipping it on today
 * would ship inert attributes with no animation. `CountUp` is the complete,
 * already-correct instrument the brief calls for ("via the existing CountUp,
 * from 60% of value, once, on useInView, nothing under reduced motion") — it
 * server-renders the final string verbatim (the P0 gate holds on its own) and
 * enhances from there. Its parse/render internals aren't exported, so there is
 * no way to reuse its algorithm short of rendering the component itself.
 *
 * The fix here composes the *same tokens* `StatNumeral` composes — its exact
 * numeral className recipe (weight bumped from its `font-light` default —
 * see "D8 hierarchy" below, a deliberate LOCAL divergence, not drift), plus
 * the `micro-label` / `data-line text-fg-muted` utilities it uses for
 * caption/detail — swapping only the numeral's leaf node for `<CountUp>`.
 * Nothing is duplicated from `StatNumeral` beyond that one unavoidable seam.
 * Flagged for whoever owns `components/atoms/`: an optional
 * `valueSlot?: ReactNode` on `StatNumeral` (rendered instead of `{value}` when
 * present) would remove this seam entirely.
 *
 * ── DESIGN REVISIT 1 (2026-08-08/09) — CLIPPING BUG, DIAGNOSED AND FIXED ───
 * Razim's screenshot showed the top of the stat numerals cut off under the
 * sticky nav. Root cause: `app/globals.css`'s sitewide
 * `:where([id]) { scroll-margin-top: var(--nav-h); }` gives `#stats` a
 * ZERO-buffer clearance from the sticky nav on any anchor-triggered scroll —
 * no margin for Fraunces Light's real ascender/cap overshoot at display sizes
 * or the sticky nav's own scrolled-state shadow/blur bleed. Fix, still local
 * to this file (`globals.css` is not this file's to edit):
 * `scroll-mt-[calc(var(--nav-h)+1.5rem)]` on `<section id="stats">` — an
 * explicit 24px buffer beyond the bare nav height, composed from the existing
 * token. This does not touch the global `:where([id])` default for every
 * OTHER section on the site.
 * NOT fixed here (found, out of scope, reported in the return value):
 * `SiteNav.tsx` sets its own height as `h-[var(--nav-h)]` unconditionally on
 * every breakpoint, never switching to `--nav-h-mobile`.
 *
 * ── DESIGN REVISIT 2 (2026-08-10) — D12/§5.2: one proof wall, not a sparse
 * band with a badge-strip bolted on ────────────────────────────────────────
 * D12 explicitly supersedes D3's split CoStar placement (three Quarterly
 * banners here, two Annual badges in a separate `RecognitionStrip` inside
 * `#closings`). All five now render HERE, in two families, and nowhere else
 * on the landing page — `RecognitionStrip.tsx` is deleted (this agent's
 * file); `ClosingsSection.tsx`'s import of it must be removed by that file's
 * owner (out of this agent's assigned-files scope; reported in the return
 * value). `components/awards/QuarterlyBanners.tsx` (this agent's file) now
 * exports both `AnnualBadges` and `QuarterlyBanners` — see that file's own
 * header for the full sizing/asset rationale; this file just composes them.
 *
 * Chassis swap: `container-hk` (max-width 1200px) → `stage-shell` (D9: full-
 * width, fluid gutter, no cap) — the brief's own diagnosis of the prior
 * defect names `.container-hk`'s 1200px ceiling as exactly why this section
 * read as "a narrow column," not a full-stage rail. `section-fit` →
 * `page-panel`: same `min-height: var(--screen-fit)` mechanism, but
 * `page-panel` is the specific class selector the route-level scroll-snap
 * rule in `globals.css` targets (`:root:has(main[data-page="home"])
 * .page-panel`), so this section now participates correctly in the twelve-
 * screen paged mode the main loop's foundation wave landed.
 *
 * Composition, per D12/§5.2 (three rows, vertically DISTRIBUTED across the
 * usable screen rather than clustered with a dead lower field): the outer
 * `<section>` is a column flexbox at `lg`; its single child (the
 * `stage-shell` wrapper) takes `lg:flex-1` so it actually fills that box
 * (a `min-height` alone does not stretch a non-growing flex child), and only
 * THAT wrapper's own three children — top row, stat rail, evidence field —
 * take `lg:justify-between`. The `gap-*` classes stay on as a floor: at a
 * short/zoomed viewport where content exceeds the fit-viewport budget,
 * `justify-between` simply has no slack to distribute and the floor gap is
 * what actually renders, so nothing ever collapses to zero space and the
 * document still grows/scrolls normally (D10 §3.2's non-qualifying tiers).
 *
 * Top row: `SectionHeader` (unchanged copy — no new claim) plus a LARGER
 * theme-matched `Wordmark` "brand" lockup as the identity anchor (D12/D18).
 * `Wordmark`'s `height` prop is a single number, not itself responsive, so
 * one flat value was chosen rather than a two-instance breakpoint swap (which
 * would ship a second real `<img>` fetch just to pick a size): 96px reads
 * unambiguously larger than the 44/52px header/footer placements (D18) while
 * staying inside BOTH themes' prepared 3x lockup raster's 132px height cap
 * (`public/brand/lockup-{gold,blue}.png`, verified via `identity-prep.ts`'s
 * own 2026-08-10 run — no upscale), and its rendered width even for the
 * wider blue lockup (~115px) never risks overflow down to a 320px viewport.
 * `Wordmark`'s own "brand" variant already renders the image `alt=""` beside
 * a real-text `BRAND_LINE` span, so "real-text brand string stays in the
 * DOM" (D12) is satisfied without anything extra here.
 *
 * Middle row: the four verified numerical facts, UNCHANGED in content and in
 * their `font-medium` numeral weight — the historical reasoning below (why
 * weight, not size, originally carried the whole distinction from the
 * headline) still holds; the `stage-shell` swap gives each column more room,
 * not less, so it does not reopen the overflow risk that reasoning guards
 * against. **Size is superseded at `lg`+ by D27** — see that section below
 * for the numeral now stepping up partway toward `text-display1` once the
 * column has room to afford it.
 *
 * Evidence field: `AnnualBadges` (large, centered) directly above
 * `QuarterlyBanners` (smaller, immediately below) — two rows, each fronted by
 * its own `MicroLabel`, exactly the "two rows and micro-labels, never boxes"
 * device D12 asks for. A `hairline-t` marks the field off from the stat rail
 * above it, and the Annual/Quarterly groups sit inside their own vertical
 * rhythm below that rule — enough separation from the identity lockup two
 * rows up that the layout cannot read as CoStar affiliation/endorsement of
 * the brand itself, only of the five specific registered wins.
 *
 * ── DESIGN REVISIT 1 — D8 hierarchy (numeral weight, unchanged this round) ──
 * Numeral weight: `font-light` (300) → `font-medium` (500), inside D8's
 * explicit "Fraunces may step 300→500, never 600+" allowance — targets the
 * 2026-08-09 audit finding that the section headline (`SectionHeader`,
 * `text-display2`/`font-light`) and the four numerals previously rendered at
 * IDENTICAL size AND weight. Weight, not size, carries the distinction here
 * on purpose: bumping the numeral to `text-display1` risks "$200M+"
 * wrapping/overflowing a quarter-width grid column — `StatNumeral`'s own doc
 * comment reserves `display1` for "a solo stat," not a 4-up band, for the
 * same reason. This divergence is local to this file's own composed recipe
 * and has no cross-section effect: a grep confirms `StatNumeral` is not
 * imported anywhere else on the site today.
 * **Superseded at `lg`+ only, D27 below** — the full `text-display1` jump
 * is still avoided (still too wide for the 4-up grid at its own ceiling),
 * but the numeral now steps up partway there above 1024px, where the D9
 * `stage-shell` column is wide enough to afford it.
 *
 * ── DESIGN REVISIT 3 (2026-08-10 evening) — D27: fill the screen, add the
 * CoStar verification link ──────────────────────────────────────────────────
 * Razim, reviewing the D12 build: "the [ Trust metrics ] section has a lot
 * of empty spaces, if its fit to the screen then fine" — and asked for a
 * plain-text link to the public CoStar Power Broker directory beneath the
 * evidence rows, "so that they'll know this is a legit one from costar."
 *
 * **Where the empty space actually was.** `page-panel`'s `min-height:
 * var(--screen-fit)` plus this section's own `lg:justify-between` do not, by
 * themselves, make content bigger — they only redistribute leftover space as
 * gaps once the three rows are laid out. If the rows render small, the
 * SLACK (not the content) fills the screen — precisely what Razim flagged.
 * D27 grows the rows themselves so the same mechanism now fills the screen
 * with composition, not gap:
 *   1. **Numerals** — the four stat values step up at `lg`+ via a composed
 *      intermediate clamp, `text-[length:clamp(2.75rem,1.1rem+4vw,4.75rem)]`
 *      (44–76px), layered over `text-display2` (which still supplies the
 *      Fraunces-light-tracking `line-height`/`letter-spacing` pair — the
 *      bracket form only touches `font-size`, per Tailwind's `length:` type
 *      hint). This is deliberately NOT the full `text-display1` jump: at
 *      `lg` (1024px, the tightest width the 4-up grid ever renders at, and
 *      an explicit AGENT-BRIEF QA breakpoint) the grid column is ≈207px;
 *      `text-display1`'s own clamp reaches ≈76.5px there, and "$200M+" set
 *      in Fraunces at that size (≈3.3em of glyph width for six characters,
 *      $/2/0/0/M/+) runs ≈250px — a real overflow into the next column, not
 *      a rounding error. The clamp above is calibrated instead to reach only
 *      ≈58.6px at 1024 (well inside the 207px column) and its own 76px
 *      ceiling by ≈1460px — comfortably filling more of the 1440×900
 *      acceptance viewport without reopening that overflow. `break-words` is
 *      added as a second, independent safety net beneath the calibration —
 *      this file cannot render a live browser to confirm exact glyph metrics
 *      (Razim's standing "no dev servers this round" instruction), so if the
 *      calibration above is still off by a few percent in either direction,
 *      the worst case degrades to a benign two-line wrap inside the column
 *      rather than a horizontal bleed into the neighbour — the D28/D29 gate
 *      this section must never fail.
 *   2. **Headline measure** — `SectionHeader`'s `className` widens from
 *      `lg:max-w-2xl` (672px) to `lg:max-w-4xl` (896px). At 672px the
 *      headline ("Before the story, the math.") wraps to two lines at
 *      `text-display2`'s ≈56px ceiling; the row's actual available width
 *      (stage-shell content width minus the Wordmark lockup minus their
 *      `gap-12`) is ≈1165px at 1440 — nearly double what the headline needs
 *      on one line. The 672px cap was a leftover prose-measure habit, not a
 *      real constraint here (this is a four-word display headline, not
 *      running text); widening it lets the headline set on one line from
 *      ≈1280px up, trading a wrap-driven ≈59px of dead vertical space for
 *      real content. Below 1280 it still wraps naturally — no regression,
 *      the cap was never binding there.
 *   3. **Evidence rasters** — `QuarterlyBanners.tsx`'s own D27 note (that
 *      file's header) retunes both families toward their already-approved
 *      112px/84px ceilings, reached at 1440×900 rather than deep into
 *      4K territory.
 *   4. **Row rhythm** — the outer `stage-shell` wrapper's floor gap tightens
 *      from `lg:gap-8` (32px) to `lg:gap-6` (24px). This is pure headroom,
 *      not a squeeze: `justify-between` only falls back to the floor gap
 *      when the three rows' own content already claims most of the 784px
 *      budget (`--screen-fit` at 1440×900) — which, after 1–3 above, it now
 *      does. The 8px-per-gap trim banks the margin this hand-computed
 *      budget needs given it was never checked against a live render (see
 *      point 1); it costs nothing when the browser's real metrics turn out
 *      more generous than the estimate above, since `justify-between` simply
 *      distributes the difference as extra slack instead.
 *   5. **Verification link** — a new plain-text link renders as the last
 *      child of the Quarterly group (reusing that group's own `gap-3`, not
 *      a new row), in the mono micro voice: "Verify at
 *      costarpowerbrokers.com →", `target="_blank" rel="noopener
 *      noreferrer"`, a spoken "(opens in a new tab)" warning, 44px tap
 *      target (`min-h-11`) — the exact external-link recipe already used by
 *      `SiteFooter.tsx`/`MandatesSection.tsx`/`MenuOverlay.tsx`. It sits
 *      immediately beneath the Quarterly banners specifically (the lowest
 *      of the two evidence tiers), so it visually reads as a footnote to
 *      the evidence field as a whole, not a new claim: this is a SOURCE
 *      POINTER to the public CoStar Power Broker directory, not a sixth
 *      register row (ref 06's five CoStar rows already carry the claims;
 *      see this file's return value for the dated note those rows need,
 *      naming this link — out of this file's assigned scope to edit ref 06
 *      directly). The badge images stay non-linking — D12's law, unchanged;
 *      this is one separate text link, not a badge treatment change.
 *
 * **Budget check (hand-computed, not measured — see point 1 above for why):
 * at 1440×900, `--screen-fit` = 784px. Estimated content: Row 1 (one-line
 * headline + 96px Wordmark) ≈91px · Row 2 (four numerals, tallest cell is
 * "12"'s two-line detail sentence) ≈183px · Row 3 (both evidence tiers at
 * their new ceiling + the verify link) ≈375px · `section-pad-tight
 * section-join` bottom padding ≈48px · two `lg:gap-6` floor gaps ≈48px.
 * Total ≈745px against the 784px budget — a ≈39px cushion, banked
 * specifically because point 1's glyph-width math is estimated. The main
 * loop's scheduled §6 headless measurement pass (docs/DESIGN-REVISIT-3.md
 * §2 step 4) is the authority on whether this actually lands inside one
 * screen at 1440×900 in both themes — this comment records the reasoning,
 * not a verified result.**
 */

import { AnnualBadges, QuarterlyBanners } from "@/components/awards/QuarterlyBanners";
import { Wordmark } from "@/components/brand/Wordmark";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { DataLine } from "@/components/atoms/DataLine";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { stats } from "@/content/stats";
import { cn } from "@/lib/utils";

/** D12/D18: rendered height of the Trust identity lockup, px — see the file
 *  header "Top row" note for why this is one flat value rather than a
 *  responsive clamp.
 *
 *  D27 (2026-08-10 evening): the brief asked this row to use a larger
 *  `lockupXl` derivative if a concurrent agent had wired one into
 *  `themePresentation` this round. Checked at implementation time: neither
 *  `site/lib/theme.ts` nor `site/public/brand/` carries a `lockupXl` /
 *  `lockup-{gold,blue}-xl.png` entry yet — so this stays the existing
 *  `variant="brand"` lockup at its existing 96px height, unchanged. See this
 *  file's return value for the explicit report back to the orchestrator. */
const TRUST_LOCKUP_HEIGHT = 96;

/** 44px minimum tap target for the verify link — the same device
 *  `SiteFooter.tsx`/`MandatesSection.tsx`/`MenuOverlay.tsx` already use for
 *  every standalone external link (a11y law, not relaxed for density). */
const VERIFY_LINK_TAP_TARGET = "inline-flex min-h-11 items-center";

/**
 * Renders a stat's `detail` line. `site/content/stats.ts` pre-joins multi-part
 * details with `" · "` (e.g. the CoStar quarters) — `DataLine`'s `parts`
 * variant re-splits on that separator and holds each group `whitespace-nowrap`
 * so a narrow cell never breaks mid-quarter, while the `"12"` stat's detail (a
 * single sentence, no `" · "` in it) falls through to `joined`, which wraps
 * normally instead of forcing one unbroken nowrap run.
 */
function StatDetail({ detail }: { detail: string }) {
  const parts = detail.split(" · ");
  return (
    <DataLine
      as="span"
      parts={parts}
      variant={parts.length > 1 ? "parts" : "joined"}
      className="mt-2 block text-fg-muted"
    />
  );
}

/** The one stat whose registered win gets a visual evidence row beneath it.
 *  Matched by label rather than array position, so a future reorder of
 *  `content/stats.ts` can't silently misfire this. */
const COSTAR_STAT_LABEL = "CoStar Power Broker";

export function StatsSection() {
  const costarStat = stats.find((stat) => stat.label === COSTAR_STAT_LABEL);

  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      className="surface-paper section-pad-tight section-join page-panel scroll-mt-[calc(var(--nav-h)+1.5rem)] lg:flex lg:flex-col"
    >
      <div className="stage-shell flex flex-col gap-12 lg:flex-1 lg:justify-between lg:gap-6">
        {/* Top row — micro-label + headline + the larger identity lockup.
            D27: max-w widened 2xl -> 4xl (672px -> 896px) so the headline
            sets on one line from ~1280px up instead of wrap-forcing a second
            line the row's real available width (~1165px at 1440, stage-shell
            minus the Wordmark minus their gap-12) never actually needed. */}
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <SectionHeader
            id="stats-heading"
            label="Trust metrics"
            headline="Before the story, the *math*."
            className="lg:max-w-4xl"
          />
          <Wordmark variant="brand" height={TRUST_LOCKUP_HEIGHT} className="shrink-0" />
        </Reveal>

        {/* Middle row — the four verified facts, full-stage and evenly weighted.
            D27: numeral steps up at `lg`+ via a composed intermediate clamp
            layered over text-display2 (see file header "D27" note for the
            full column-width math and why this stops short of the full
            text-display1 jump). `break-words` is the safety net if the
            hand-computed calibration runs long on a real render. */}
        <Reveal
          as="ul"
          stagger
          role="list"
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-10"
        >
          {stats.map((stat) => (
            <RevealItem as="li" key={stat.label} className="hairline-t pt-6">
              <span className="block break-words font-display font-medium text-display2 tabular lg:text-[length:clamp(2.75rem,1.1rem+4vw,4.75rem)]">
                <CountUp value={stat.value} />
              </span>
              <span className="micro-label mt-3 block">{stat.label}</span>
              {stat.detail ? <StatDetail detail={stat.detail} /> : null}
            </RevealItem>
          ))}
        </Reveal>

        {/* Evidence field — all five CoStar assets, two rows, micro-labels
            only, no badge frames (D12); plus D27's plain-text CoStar
            verification link, appended as the Quarterly group's own last
            child (reuses that group's gap-3 — no new row/gap introduced).
            See QuarterlyBanners.tsx's own D27 note for why the badge clamps
            now sit at their ceiling by 1440×900 rather than near their
            floor, and this file's header for the full row-budget math. */}
        <Reveal className="hairline-t flex flex-col items-center gap-6 pt-6 lg:gap-8 lg:pt-8">
          <div className="flex flex-col items-center gap-4">
            <MicroLabel as="p">2025 Annual Awards</MicroLabel>
            <AnnualBadges />
          </div>

          {costarStat ? (
            <div className="flex flex-col items-center gap-3">
              <MicroLabel as="p">{costarStat.label}</MicroLabel>
              <QuarterlyBanners />
              <a
                href="https://www.costarpowerbrokers.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  VERIFY_LINK_TAP_TARGET,
                  "gap-2 font-mono text-micro uppercase tracking-micro text-fg-muted",
                  "transition-colors duration-fast ease-out hover:text-accent-text",
                )}
              >
                Verify at costarpowerbrokers.com
                <span aria-hidden="true">→</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
