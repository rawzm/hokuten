/**
 * components/sections/CalculatorSection.tsx — `#calculator`, the Hotel Worth
 * Calculator.
 *
 * Spec: docs/design/specs/calculator.md (IA, states, motion, a11y, acceptance
 * criteria all already resolved there). Anatomy: hokuten-design-director ref 04
 * → `#calculator` (paper). Server Component — the only client-side code on this
 * section is `<Calculator>` itself, wrapped here (never edited here).
 *
 * Two-column layout matches the source's `.calculator-grid` byte-for-byte:
 * `1fr 1.1fr` / 64px gap at `lg`, collapsing to one column / 40px gap below it
 * (index.html:393, :744).
 *
 * Intro column (left) is pure static copy — micro-label, headline, sub, the
 * methodology note — zero JS. The wizard panel (right) is the client island;
 * `Calculator` renders its own `.surface-deep hairline rounded-card` chassis
 * per the spec's component-plan table, so nothing here duplicates those tokens.
 */

import { Calculator } from "@/components/calculator/Calculator";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CALCULATOR_DISCLAIMER } from "@/content/compliance";
import { cn } from "@/lib/utils";

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

export interface CalculatorSectionProps {
  className?: string;
}

export function CalculatorSection({ className }: CalculatorSectionProps) {
  return (
    <section
      id="calculator"
      aria-labelledby={HEADING_ID}
      className={cn("surface-paper section-pad", className)}
    >
      <div className="container-hk">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="flex flex-col gap-8">
            <SectionHeader
              id={HEADING_ID}
              index="03"
              label={COPY.microLabel}
              headline={COPY.headline}
              sub={COPY.sub}
            />

            {/* IA #4 — the methodology note, byte-exact, imported never retyped. */}
            <p className="font-sans text-data text-fg-meta">
              {CALCULATOR_DISCLAIMER.methodologyNote}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <Calculator />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
