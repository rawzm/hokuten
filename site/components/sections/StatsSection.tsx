/**
 * components/sections/StatsSection.tsx — `#stats`, the trust-metrics band.
 *
 * Governed by design-skill references 03 (Type ramp → stat numerals: Fraunces,
 * never mono), 04 (`#stats`), 05 (Reveals → count-up rules) and 07 (P0: "stat
 * counters that show 0/placeholder without JS" — the Sarhan anti-pattern).
 * Full spec: docs/design/specs/stats.md. Server Component — the only client
 * code that ships is inside the existing `Reveal` and `CountUp`, both reused
 * as-is.
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
 * sticky nav. Reproduced by static analysis (no dev server available to this
 * agent — see the return-value report for what that does and doesn't cover)
 * against every named suspect:
 *   - NOT an overflow-hidden ancestor. `grep -rn overflow components/
 *     app/globals.css` finds none on any element between `<section id="stats">`
 *     and the numeral — `Reveal`/`RevealItem` set no `overflow`, `.container-hk`
 *     sets none, the `<ul>`/`<li>` grid sets none.
 *   - NOT a Reveal transform clipping anything. `motion.div`/`motion.li` write
 *     an inline `transform: translateY(0px)` at rest (Framer Motion's own
 *     baseline-for-animation behaviour) — that IS a new containing block for
 *     absolutely-positioned descendants, but with no `overflow` set anywhere
 *     in that subtree, a containing block alone clips nothing. Confirmed
 *     against `Reveal.tsx`: `armed` only ever applies to an element that
 *     starts BELOW the fold on mount, and `#stats` is never in that state on a
 *     direct hash-load (see next point) — so the hidden `y:16` state is never
 *     the one a nav-adjacent screenshot would show.
 *   - IS the real mechanism: `app/globals.css`'s sitewide
 *     `:where([id]) { scroll-margin-top: var(--nav-h); }` gives `#stats` a
 *     ZERO-buffer clearance from the sticky nav on any anchor-triggered
 *     scroll (a direct `/#stats` load, browser back/forward scroll
 *     restoration, or a future in-page link — none exist today per
 *     `content/nav.ts`, but the global rule exists precisely so one could be
 *     added without a follow-up fix). "Zero buffer" means the section's own
 *     top border-edge lands EXACTLY flush with the nav's bottom edge, with no
 *     margin for two things this rule cannot see: (1) Fraunces Light's real
 *     ascender/cap overshoot at `text-display2` sizes — the numeral is the
 *     first big display-weight glyph on the page below the fold, so this is
 *     the first place on the site that overshoot becomes visible against a
 *     hard edge; (2) the sticky nav's own `shadow-bar`/`backdrop-blur-md`
 *     bleed once scrolled (`SiteNav.tsx`). `--nav-h` dropping 88px → 68px
 *     this round (D6) removed 20px of what had been, by accident rather than
 *     design, exactly the slack this needed. `scroll-mt-[...]` below overrides
 *     the global rule with a real, calibrated buffer — Tailwind's generated
 *     class selector outranks `:where([id])` regardless of stylesheet order,
 *     since `:where()` is defined to always carry zero specificity, so this
 *     is a real override, not a coin-flip on cascade order.
 * Fix, entirely local to this file (`globals.css` is not this file's to
 * edit): `scroll-mt-[calc(var(--nav-h)+1.5rem)]` on `<section id="stats">` —
 * an explicit 24px buffer beyond the bare nav height, composed from the
 * existing token rather than a new hard-coded pixel value, sized to swallow
 * both the font-metric overshoot and the nav's scrolled-state shadow with
 * room to spare. This does not touch the global `:where([id])` default for
 * every OTHER section on the site — only `#stats` gets the extra margin,
 * because `#stats` is specifically the first section whose focal content is
 * a large Fraunces numeral sitting close to its own top edge.
 * NOT fixed here (found, out of scope, reported in the return value):
 * `SiteNav.tsx:271` sets its own height as `h-[var(--nav-h)]` unconditionally
 * on every breakpoint, never switching to `--nav-h-mobile` — which happens to
 * keep it self-consistent with this same global `scroll-margin-top` rule
 * (both always reference `--nav-h`), so it does not make this bug worse, but
 * it means the mobile nav is not actually the shorter `--nav-h-mobile` token
 * `globals.css` defines for it.
 *
 * ── DESIGN REVISIT 1 — D3 evidence added ────────────────────────────────────
 * The three CoStar Power Broker "Quarterly Deals" banners
 * (`components/awards/QuarterlyBanners.tsx`) render beneath the existing "3×"
 * numeral as a separate, full-width block AFTER the 4-item grid — not
 * INSIDE the CoStar stat's own grid cell. A 4-up desktop grid cell is only
 * ~1/4 of the container width (~260–280px at typical desktop widths); three
 * 178px-wide badge chips plus gaps need roughly double that, so placing them
 * inside the cell would either force the CoStar cell to span the whole grid
 * (breaking the "4-up ≥1024px" acceptance criterion `docs/design/specs/
 * stats.md` already checks off) or overflow it. A full-width row below the
 * grid keeps every existing acceptance criterion intact (unchanged 4-item
 * grid, unchanged detail text) while giving the badges real room — "the
 * numeral can stay as the anchor with the banners as evidence beneath it"
 * (task brief), read literally: beneath the whole band, not shoehorned into
 * a quarter-column. The connecting `[ CoStar Power Broker ]` micro-label
 * above the row is `costarStat.label` read back from `@/content/stats` (not
 * retyped), so it can never drift from the register.
 * Evidence-gate check (ref 06, "Verified claims register"): "CoStar Power
 * Broker Quarterly Deals | Q3 2025 · Q1 2026 · Q2 2026 | `verified-current`"
 * already has a row — confirmed present before wiring these three images.
 * The two 2025 ANNUAL badges are a separate registered claim assigned to
 * another agent's `#closings` recognition strip; not rendered here.
 *
 * ── DESIGN REVISIT 1 — D6 density + D8 hierarchy ────────────────────────────
 * `section-pad` → `section-pad-tight` + `section-join` + `section-fit`:
 * checked the section's REAL current neighbour in `app/page.tsx` (still
 * unmodified as of this file's writing) rather than assuming — `<Hero />`
 * now renders its own `<BrandsMarquee />` as a sibling immediately after
 * `<section id="hero">` (`components/hero/Hero.tsx`, "Row 4 is a SIBLING,
 * never a child"), so `#stats`'s actual preceding sibling in the DOM today is
 * `BrandsMarquee`'s `<section id="brands" className="surface-paper
 * hairline-t hairline-b section-pad-tight">` — NOT `#hero` directly.
 * `BrandsMarquee` is documented as "always `.surface-paper`, regardless of
 * theme" (`BrandsSection.tsx`), so this section-join is theme-independent —
 * no `themePresentation` branch needed, unlike an earlier draft of this
 * comment assumed before that file was re-read. FLAGGED, not silently
 * assumed permanent: `Hero.tsx`'s own header documents a "KNOWN INTEGRATION
 * GAP" — `app/page.tsx` still ALSO renders the old standalone `<BrandsSection
 * />` after `#stats` (a duplicate `id="brands"`, not this file's bug or
 * fix), and resolving that gap could in principle reorder `#stats` to sit
 * directly after `#hero` instead. If that happens, re-check this
 * `section-join` against `#hero`'s row-3 surface (`themePresentation.
 * heroSurface`, which IS theme-dependent) before trusting it again.
 * Numeral weight: bumped `font-light` (300) → `font-medium` (500), inside
 * D8's explicit "Fraunces may step 300→500, never 600+" allowance — targets
 * `docs/design/AUDIT_LOG.md`'s own named finding that the section headline
 * (`SectionHeader`, `text-display2`/`font-light`) and the four numerals
 * previously rendered at IDENTICAL size AND weight, "so the band has two
 * focal steps at identical scale... nothing in the code makes that
 * intentional." Weight, not size, carries the distinction here on purpose:
 * bumping the numeral to `text-display1` instead (a full step up) risks
 * "$200M+" wrapping/overflowing its quarter-width column at desktop —
 * `StatNumeral`'s own doc comment already reserves `display1` for "a solo
 * stat," not a 4-up band, for the same reason. This divergence is local to
 * this file's own composed recipe (this file already documents, above, that
 * it does not import `StatNumeral`) and has no cross-section effect: a grep
 * confirms `StatNumeral` is not imported anywhere else on the site today.
 */

import { QuarterlyBanners } from "@/components/awards/QuarterlyBanners";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { DataLine } from "@/components/atoms/DataLine";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { stats } from "@/content/stats";

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

/** The one stat whose registered win gets a visual evidence row beneath it
 *  (D3). Matched by label rather than array position, so a future reorder of
 *  `content/stats.ts` can't silently misfire this. */
const COSTAR_STAT_LABEL = "CoStar Power Broker";

export function StatsSection() {
  const costarStat = stats.find((stat) => stat.label === COSTAR_STAT_LABEL);

  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      className="surface-paper section-pad-tight section-join section-fit scroll-mt-[calc(var(--nav-h)+1.5rem)] lg:flex lg:flex-col lg:justify-center"
    >
      <div className="container-hk">
        <Reveal>
          <SectionHeader
            id="stats-heading"
            label="Trust metrics"
            headline="Before the story, the *math*."
          />
        </Reveal>

        <Reveal
          as="ul"
          stagger
          role="list"
          className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-16 lg:grid-cols-4 lg:gap-x-10"
        >
          {stats.map((stat) => (
            <RevealItem as="li" key={stat.label} className="hairline-t pt-6">
              <span className="block font-display font-medium text-display2">
                <CountUp value={stat.value} />
              </span>
              <span className="micro-label mt-3 block">{stat.label}</span>
              {stat.detail ? <StatDetail detail={stat.detail} /> : null}
            </RevealItem>
          ))}
        </Reveal>

        {costarStat ? (
          <Reveal className="mt-12 hairline-t pt-8 lg:mt-14 lg:pt-10">
            <MicroLabel as="p">{costarStat.label}</MicroLabel>
            <QuarterlyBanners className="mt-5" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
