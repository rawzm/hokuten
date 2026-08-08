/**
 * components/sections/MethodSection.tsx — `#method`, the dark heritage chapter
 * ("How we run a sale").
 *
 * Governed by hokuten-design-director references 03 (Visual system → dark
 * surfaces, imagery), 04 (`#method`), 05 (Motion → reveals, reduced-motion),
 * 06 (Voice, two-tone emphasis) and 07 (a11y / audit gates). Spec:
 * docs/design/specs/method.md — read that file for the full IA, states and
 * acceptance criteria before changing this component.
 *
 * Server Component. The only client boundaries are the ones already inside
 * the imported atoms (`Reveal`, `Stamp`) — this file adds zero client JS.
 *
 * ── Micro-label index: shipped UNINDEXED, deviating from the content file ──
 * `content/methodology.ts`'s own header comment proposes `[ 03 — METHOD ]`.
 * That number collides with `docs/design/specs/calculator.md`, which
 * independently chose micro-label `[ 03 — VALUATION ]` for `#calculator`.
 * Ref 04 only assigns an explicit index to `#closings` (`01`); every other
 * section agent is building concurrently with no shared index registry —
 * `docs/design/specs/faq.md` hit the identical problem and resolved it the
 * same way this file does: ship unindexed (`[ METHOD ]`), matching the
 * `#brands` / `#mandates` precedent, until one agent assembles the final
 * sitewide sequence and a dated PROJECT-MEMORY.md entry fixes the numbers.
 *
 * ── Art gap: OrbitalArcs / HotelEngraving are not shipped ──────────────────
 * The task brief calls for importing `OrbitalArcs` and `HotelEngraving` from
 * `site/components/art/` — that directory does not exist yet (verified
 * 2026-08-08; presumably W2's deliverable, still in flight). Per the brief's
 * own instruction ("import; report if missing"), this file does NOT create
 * those shared components — this agent owns exactly this file and the spec.
 * Two stand-ins ship instead, both local to this file only:
 *   • `star-grain` — the existing globals.css utility, used as specified.
 *   • `MethodArt` — a small inline hairline-ring SVG at the same 8% texture
 *     opacity cap, filling the "orbital arcs" role geometrically.
 * The white single-stroke engraved hotel facade (`HotelEngraving`) is a
 * commissioned/hand-traced illustration asset per PHASE-1-EXECUTION §4.3 —
 * fabricating one here would be inventing brand art outside this agent's
 * remit, so the section ships without it rather than with a fake. Swap
 * `MethodArt` for the real components the moment they land; nothing else in
 * this file needs to change.
 */

import type { ReactNode } from "react";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import Stamp from "@/components/atoms/Stamp";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { methodFraming, methodSteps, reachStats } from "@/content/methodology";

/**
 * Two-tone emphasis (ref 06): key temporal/contractual phrases render
 * `text-fg`, the connective narrative around them renders `text-fg-muted`.
 * Weight never changes — colour alone carries the emphasis, per the on-dark
 * law ("never invent an opacity; the on-dark tokens are contrast-proven").
 *
 * This only wraps substrings of `methodFraming` in spans for styling — the
 * text itself is never altered, so the verbatim listing-term paragraph stays
 * byte-identical to `content/methodology.ts`.
 */
const FRAMING_EMPHASIS = [
  "180 days",
  "two 90-day cycles",
  "Days 30 and 60",
  "Day 90",
  "second 90-day cycle",
] as const;

function renderFramingParagraph(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  FRAMING_EMPHASIS.forEach((phrase, i) => {
    const idx = text.indexOf(phrase, cursor);
    if (idx === -1) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `MethodSection: two-tone emphasis phrase "${phrase}" not found in ` +
            `methodFraming — the source paragraph may have changed.`,
        );
      }
      return;
    }
    if (idx > cursor) {
      nodes.push(
        <span key={`muted-${i}`} className="text-fg-muted">
          {text.slice(cursor, idx)}
        </span>,
      );
    }
    nodes.push(
      <span key={`emphasis-${i}`} className="text-fg">
        {phrase}
      </span>,
    );
    cursor = idx + phrase.length;
  });

  if (cursor < text.length) {
    nodes.push(
      <span key="muted-tail" className="text-fg-muted">
        {text.slice(cursor)}
      </span>,
    );
  }

  return nodes;
}

/**
 * Divider class for one reach-stat item, given its index in a row that wraps
 * 2-up on mobile and lays out 4-up from `md` (ref 03: 2-up ≥640px, but this
 * grid switches to the full 4-up at `md` since there are only four items).
 * A left hairline belongs on every column except the leader of its own row —
 * which row-leader positions differ between the two breakpoints, so each
 * needs its own modulo test rather than a single `i > 0` check (that would
 * wrongly draw a border on the mobile row-2 leader, item index 2).
 */
function reachDividerClass(i: number): string | undefined {
  const mobileDivider = i % 2 === 1; // right column of the 2-up mobile row
  const desktopDivider = i % 4 !== 0; // every column but the 4-up row leader
  if (mobileDivider && desktopDivider) return "hairline-l pl-8";
  if (desktopDivider) return "md:hairline-l md:pl-8";
  return undefined;
}

/**
 * Local stand-in for the missing `components/art/OrbitalArcs` — see the file
 * header. Three concentric hairline rings, `currentColor`, capped at the same
 * 8% texture opacity `star-grain` uses. Purely decorative: `aria-hidden`, no
 * layout impact (`absolute inset-0`, `pointer-events-none`), painted before
 * the content in DOM order so it sits behind it without an invented z-index.
 */
function MethodArt() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden text-fg"
      style={{ opacity: 0.08 }}
    >
      <svg
        width="480"
        height="480"
        viewBox="0 0 480 480"
        fill="none"
        className="-mr-40 hidden shrink-0 md:block"
      >
        <circle cx="240" cy="240" r="220" stroke="currentColor" strokeWidth="1" />
        <circle cx="240" cy="240" r="150" stroke="currentColor" strokeWidth="1" />
        <circle cx="240" cy="240" r="80" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function MethodSection() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="surface-dark star-grain section-pad relative isolate overflow-hidden"
    >
      <MethodArt />
      <span className="visually-hidden">
        Decorative hairline orbital-ring texture and star-grain behind this chapter — no
        informational content.
      </span>

      <div className="container-hk relative">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <MicroLabel>Method</MicroLabel>
            <Stamp placement="method" onDark size={20} />
          </div>
          <SectionHeader id="method-heading" headline="How we run a *sale*." />
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <Reveal as="p" className="text-body-lg leading-relaxed lg:col-span-5">
            {renderFramingParagraph(methodFraming)}
          </Reveal>

          <Reveal as="ol" stagger className="hairline-l flex flex-col gap-12 pl-8 lg:col-span-7">
            {methodSteps.map((step) => (
              <RevealItem as="li" key={step.index} className="group relative">
                <span
                  className="block font-mono text-micro uppercase tracking-micro tabular text-accent-text"
                  aria-hidden="true"
                >
                  {step.index}
                </span>
                <h3 className="mt-2 font-display text-body-lg font-normal">
                  <span className="border-b border-transparent pb-0.5 transition-colors duration-fast group-hover:border-accent-text group-focus-within:border-accent-text">
                    {step.title}
                  </span>
                </h3>
                <p className="mt-3 max-w-[60ch] text-body text-fg-muted">{step.body}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>

        <Reveal
          as="ul"
          stagger
          className="hairline-t mt-12 grid grid-cols-2 gap-x-8 gap-y-8 pt-12 md:grid-cols-4"
        >
          {reachStats.map((stat, i) => (
            <RevealItem as="li" key={stat.value} className={reachDividerClass(i)}>
              <span className="block font-mono text-body-lg font-medium tabular text-fg">
                {stat.value}
              </span>
              <span className="mt-2 block font-mono text-body leading-snug text-fg-muted">
                {stat.label}
              </span>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
