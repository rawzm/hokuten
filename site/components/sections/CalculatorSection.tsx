/**
 * components/sections/CalculatorSection.tsx — `#calculator`, the Hotel Worth
 * Calculator.
 *
 * Spec: docs/design/specs/calculator.md (IA, states, motion, a11y, acceptance
 * criteria all already resolved there). Anatomy: hokuten-design-director ref 04
 * → `#calculator` (paper). Redesign: docs/DESIGN-REVISIT.md §4.6.
 *
 * Server Component. The only client-side code in this section is `<Calculator>`
 * itself, and it is DYNAMICALLY IMPORTED (D7): the wizard, its option-tile
 * primitive, the artwork manifest, the popovers and the whole frozen valuation
 * engine are a large island that nobody needs before they scroll to it, so they
 * are code-split out of the landing route's critical path. `ssr: false` is
 * deliberately NOT used — it is unsupported in a Server Component, and we want
 * the real console in the server HTML anyway so the swap costs nothing.
 *
 * ── LANDSCAPE, FIT TO VIEWPORT (D6) ─────────────────────────────────────────
 * The old portrait split (`1fr 1.1fr`, copy left / form right) is gone. The
 * section is now one landscape screen: a compact header band across the top,
 * then the full-width console. The section is a flex column carrying
 * `section-fit`'s min-height on desktop, and the console is `lg:flex-1`, so the
 * console's box is a constant for all three wizard steps — which is what lets
 * `Calculator` guarantee a zero-CLS step change (see its header). Below `lg`
 * nothing is forced: the section keeps natural flow.
 *
 * ── LOADING STATE ───────────────────────────────────────────────────────────
 * The heading, micro-label, sub and the methodology disclaimer are static
 * server-rendered markup and never depend on the island. While the island's
 * chunk resolves, `CalculatorLoading` paints the console's real chassis with
 * its stepper track, tile row and rail blocked out at the same dimensions —
 * a designed placeholder, never a blank hole and never a bare spinner. It is
 * sized by the same `lg:flex-1` box, so the swap moves nothing.
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
        "surface-paper section-pad-tight section-fit relative lg:flex lg:flex-col",
        className,
      )}
    >
      {/* One 北天 accent per section, behind everything, purely decorative. */}
      <KanjiAccent placement="right" scale={1.1} />

      <div className="container-wide relative flex flex-col gap-6 lg:flex-1">
        {/* Header band: headline left, sub right — one row, no dead band. */}
        <Reveal className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-end lg:gap-12">
          <SectionHeader
            id={HEADING_ID}
            index="03"
            label={COPY.microLabel}
            headline={COPY.headline}
          />
          <p className="max-w-[52ch] font-sans text-body text-fg-muted">{COPY.sub}</p>
        </Reveal>

        <Calculator className="lg:flex-1" />

        {/* IA #4 — the methodology note, byte-exact, imported never retyped. */}
        <p className="font-sans text-data text-fg-meta">
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

function CalculatorLoading() {
  return (
    <div
      aria-busy="true"
      className="surface-deep hairline rounded-card flex min-h-[34rem] flex-col gap-5 p-5 sm:p-6 lg:flex-1"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div aria-hidden="true" className="flex items-center gap-3">
          <span className="hairline size-11 rounded-pill" />
          <span className="block h-px w-6 bg-hairline sm:w-10" />
          <span className="hairline size-11 rounded-pill" />
          <span className="block h-px w-6 bg-hairline sm:w-10" />
          <span className="hairline size-11 rounded-pill" />
        </div>
        <p role="status" className="micro-label font-medium">
          {"Loading the valuation console"}
        </p>
      </div>

      <div className="grid gap-6 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
        <div aria-hidden="true" className="flex flex-col gap-4">
          <span className={cn(BLOCK, "h-6 w-56")} />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:max-w-[54rem] lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={cn(BLOCK, "aspect-square")} />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-6">
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cn(BLOCK, "h-16 lg:h-14")} />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <span key={i} className={cn(BLOCK, "h-11")} />
              ))}
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="surface-card hairline rounded-card flex flex-col gap-3 p-4">
          <p className="micro-label font-medium">{"Market reference"}</p>
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn(BLOCK, "h-5")} />
          ))}
        </div>
      </div>
    </div>
  );
}
