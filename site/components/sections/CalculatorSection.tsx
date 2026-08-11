/**
 * components/sections/CalculatorSection.tsx — `#calculator`, screen 5 of the
 * twelve-panel landing route (`03 — Valuation`).
 *
 * Spec: docs/DESIGN-REVISIT-2.md §D14 + §5.5. Anatomy: hokuten-design-director
 * ref 04 → `#calculator` (paper). Port of record: docs/port/01-calculator.md.
 *
 * Server Component. The only client-side code in this section is `<Calculator>`
 * itself, and it is DYNAMICALLY IMPORTED (D7): the wizard, its option-tile
 * primitive, the artwork manifest, the popovers and the whole frozen valuation
 * engine are a large island that nobody needs before they scroll to it, so they
 * are code-split out of the landing route's critical path. `ssr: false` is
 * deliberately NOT used — it is unsupported in a Server Component, and we want
 * the real console in the server HTML anyway so the swap costs nothing.
 *
 * ── THE PANEL CONTRACT (D9/D10, 2026-08-10) ─────────────────────────────────
 * `page-panel` replaces `section-fit`: the same `min-height: var(--screen-fit)`
 * mechanism, but `page-panel` is the class the route-scoped snap rules in
 * globals.css actually target (`:root:has(main[data-page="home"]) .page-panel`),
 * so this section participates in the twelve-screen paged mode. `min-height`,
 * never `height` — a genuinely tall layout (short viewport, 200% zoom, an
 * expanded refinement) grows this panel and the DOCUMENT scrolls through it.
 *
 * `stage-shell` replaces `container-wide`: D9 composes the landing route at
 * viewport scale with a fluid gutter and no max-width. The two things here that
 * genuinely want a measure — the section's sub-line and the methodology note —
 * are constrained LOCALLY, which is exactly the trade D9 asks for.
 *
 * The section is a flex column at `lg` and the stage wrapper takes `lg:flex-1`
 * (a `min-height` alone does not stretch a non-growing flex child), so the
 * console below actually fills the usable screen instead of leaving a dead
 * lower field. `Calculator` gets `lg:flex-1` in turn — that constant box is
 * what makes its five step changes cost zero layout shift (see its header).
 *
 * ── NO INTERNAL SECTION SCROLLBAR (D14) ─────────────────────────────────────
 * Nothing in this subtree may carry an internal scroll container, a vertical
 * overflow class, a fixed result height, a mask-based fade or a sticky
 * subpanel. D6's masked result well is deleted; the five-step split is what
 * replaced it. A QA grep checks this file and `Calculator.tsx` for exactly
 * that.
 *
 * ── LOADING STATE ───────────────────────────────────────────────────────────
 * The heading, micro-label, sub and the methodology disclaimer are static
 * server-rendered markup and never depend on the island. While the island's
 * chunk resolves, `CalculatorLoading` paints the console's real chassis — the
 * five-station stepper track, the workspace, the market-reference rail and the
 * action row — blocked out at the same dimensions. A designed placeholder,
 * never a blank hole and never a bare spinner. It is sized by the same
 * `lg:flex-1` box plus an explicit `min-h` floor, so the swap moves nothing.
 */

import dynamic from "next/dynamic";

import { KanjiAccent } from "@/components/art/KanjiAccent";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CALCULATOR_DISCLAIMER } from "@/content/compliance";
import { cn } from "@/lib/utils";

import type { CalculatorProps } from "@/components/calculator/Calculator";

const HEADING_ID = "calculator-heading";

const COPY = {
  /** docs/design/specs/calculator.md IA #1 — index "03", ref 04's ordering (01
   *  closings, 02 listings, 03 valuation). */
  microLabel: "Valuation",
  /** IA #2, one italic accent word: `worth`. index.html:917 (shared question;
   *  `#bov` answers it — see BovSection.tsx's header note on the duplicate). */
  headline: { before: "What's your hotel ", accent: "worth", after: "?" },
  /**
   * IA #3 / spec decision C1: the source's "Get a confidential range from comp
   * data in under 60 seconds…" drops "from comp data" — the model is
   * GENERALIZED industry assumptions, not transaction-derived (port pack §B.6),
   * and the methodology note four lines below says exactly that. Shipping the
   * capability claim would be a P0 evidence-gate contradiction on the same
   * screen. Everything else is byte-identical to index.html:918.
   */
  sub: "Get a confidential range in under 60 seconds. No email required to see the result.",
} as const;

/* -------------------------------------------------------------------------- */
/*  The client island, code-split out of the critical path (D7)                */
/* -------------------------------------------------------------------------- */

const Calculator = dynamic<CalculatorProps>(
  () => import("@/components/calculator/Calculator").then((mod) => mod.Calculator),
  { loading: () => <CalculatorLoading /> },
);

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export interface CalculatorSectionProps {
  className?: string;
}

export function CalculatorSection({ className }: CalculatorSectionProps) {
  return (
    <section
      id="calculator"
      aria-labelledby={HEADING_ID}
      className={cn(
        "surface-paper section-pad-tight page-panel relative scroll-mt-[calc(var(--nav-h)+1.5rem)] lg:flex lg:flex-col",
        className,
      )}
    >
      {/* One 北天 accent per section, behind everything, purely decorative. */}
      <KanjiAccent placement="right" scale={1.1} />

      <div className="stage-shell relative flex flex-col gap-6 lg:flex-1">
        {/* Header band: headline left, sub right — one row, no dead band. */}
        <Reveal className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:items-end lg:gap-12">
          <SectionHeader
            id={HEADING_ID}
            index="03"
            label={COPY.microLabel}
            headline={COPY.headline}
          />
          {/* Prose keeps its own measure inside the full-width stage (D9). */}
          <p className="max-w-[52ch] font-sans text-body text-fg-muted">{COPY.sub}</p>
        </Reveal>

        <Calculator className="lg:flex-1" />

        {/* IA #4 — the methodology note, byte-exact, imported never retyped.
            Never shrunk to make the panel fit (D20). */}
        <p className="max-w-[92ch] font-sans text-data text-fg-meta">
          {CALCULATOR_DISCLAIMER.methodologyNote}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Designed loading state                                                     */
/* -------------------------------------------------------------------------- */

/** Blocked-out shapes only — token colours, no animation, nothing to gate. */
const BLOCK = "rounded-card bg-[color-mix(in_srgb,var(--fg)_7%,transparent)]";

const STATIONS = [0, 1, 2, 3, 4];

function CalculatorLoading() {
  return (
    <div
      aria-busy="true"
      className="surface-deep hairline rounded-card flex min-h-[32rem] flex-col gap-5 p-5 sm:p-6 lg:flex-1"
    >
      {/* Five-station stepper track, same geometry as the real one. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div aria-hidden="true" className="flex flex-wrap items-center gap-1 sm:gap-2.5">
          {STATIONS.map((i) => (
            <span key={i} className="flex items-center gap-1 sm:gap-2.5">
              {i > 0 ? <span className="block h-px w-1.5 bg-hairline sm:w-5 lg:w-8" /> : null}
              <span className="hairline size-11 rounded-pill" />
            </span>
          ))}
        </div>
        <p role="status" className="micro-label font-medium">
          {"Loading the valuation console"}
        </p>
      </div>

      <div className="grid gap-6 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:gap-y-6">
        <div
          aria-hidden="true"
          className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-start-1 lg:min-h-[26rem] lg:justify-between lg:gap-6"
        >
          <span className={cn(BLOCK, "h-6 w-56")} />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:max-w-[52rem] lg:grid-cols-5">
            {STATIONS.map((i) => (
              <span key={i} className={cn(BLOCK, "aspect-square")} />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:gap-8">
            <span className={cn(BLOCK, "h-11")} />
            <span className={cn(BLOCK, "h-11")} />
          </div>
          <span className={cn(BLOCK, "h-11")} />
        </div>

        <div
          aria-hidden="true"
          className="surface-card hairline rounded-card flex min-w-0 flex-col gap-3 p-4 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start"
        >
          <p className="micro-label font-medium">{"Market reference"}</p>
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn(BLOCK, "h-5")} />
          ))}
        </div>

        <div aria-hidden="true" className="flex flex-wrap gap-3 lg:col-start-1 lg:row-start-2">
          <span className={cn(BLOCK, "h-11 w-full sm:w-32")} />
        </div>
      </div>
    </div>
  );
}
