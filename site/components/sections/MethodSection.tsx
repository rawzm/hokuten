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
 * ── Micro-label index: `04` (sitewide registry, fixed 2026-08-08) ──────────
 * The concurrent section agents each guessed, so the page shipped with a
 * broken run (01, 02, 03, unindexed, 01, unindexed…). The coherence audit
 * assembled the definitive sequence and it is now the single source of truth:
 *
 *   masthead band — unindexed word-only labels:
 *     #hero `[ HOSPITALITY INVESTMENT SALES — NATIONWIDE ]`
 *     #stats `[ TRUST METRICS ]` · #brands `[ FLAGS WE TRANSACT ACROSS ]`
 *   numbered chapter run (ref 04 pins #closings to `01`, so nothing above it
 *   may take a number):
 *     01 #closings · 02 #listings · 03 #calculator · 04 #method · 05 #doors ·
 *     06 #mandates · 07 #team · 08 #faq · 09 #bov
 *
 * `content/methodology.ts`'s header comment proposing `[ 03 — METHOD ]` is
 * stale — 03 belongs to `#calculator`. Do not renumber a section without
 * renumbering the whole run.
 *
 * ── Art: HotelEngraving RETIRED (design revisit, 2026-08-08, D5) ──────────
 * Razim's verdict: the engraving is ugly. It no longer renders here — do not
 * re-add `<HotelEngraving>`. Its component file and `public/art/hotel-
 * engraving.svg` are untouched (this file does not own them; another
 * placement may still want them).
 *
 * Its slot was reserved for the supplied 「北天」 glyph-mosaic Method-chapter
 * piece (`/art/hie-dusk-chapter-*`, per the design-revisit art manifest §3).
 * As of this pass neither `site/content/artwork.ts` (the placement resolver)
 * nor the image files themselves exist yet, so the chapter ships on the
 * documented interim: `star-grain` (on the section root) + `OrbitalArcs` +
 * `KanjiAccent` alone — no photographic art object. Swap in the resolved
 * artwork here once both land; do not hand-roll a `next/image` call against
 * the raw paths in the meantime (that was the fallback ONLY if the manifest
 * was missing but the files were present — neither condition holds).
 */

import type { ReactNode } from "react";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { KanjiAccent } from "@/components/art/KanjiAccent";
import { OrbitalArcs } from "@/components/art/OrbitalArcs";
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

export function MethodSection() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="surface-dark star-grain section-pad section-fit relative isolate overflow-hidden lg:flex lg:flex-col lg:justify-center"
    >
      <OrbitalArcs />
      <KanjiAccent />
      <span className="visually-hidden">
        Decorative hairline orbital-ring texture and background 北天 kanji motif behind this
        chapter — no informational content.
      </span>

      <div className="container-hk relative">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <MicroLabel index="04">Method</MicroLabel>
            <Stamp placement="method" onDark size={20} />
          </div>
          <SectionHeader id="method-heading" headline="How we run a *sale*." />
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <Reveal as="p" className="text-body-lg leading-relaxed lg:col-span-5">
            {renderFramingParagraph(methodFraming)}
          </Reveal>

          <Reveal as="ol" stagger className="hairline-l flex flex-col gap-8 pl-8 lg:col-span-7">
            {methodSteps.map((step) => (
              <RevealItem as="li" key={step.index} className="group relative">
                <span
                  className="block font-mono text-micro uppercase tracking-micro tabular text-accent-text"
                  aria-hidden="true"
                >
                  {step.index}
                </span>
                <h3 className="mt-2 font-display text-body-lg font-medium">
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
          className="hairline-t mt-8 grid grid-cols-2 gap-x-8 gap-y-8 pt-8 md:grid-cols-4"
        >
          {reachStats.map((stat, i) => (
            <RevealItem as="li" key={stat.value} className={reachDividerClass(i)}>
              <span className="block font-mono text-body-lg font-medium tabular text-fg">
                {stat.value}
              </span>
              {/* Label is SANS, not mono. `reachStats[].label` is a full
                  sentence ("Hotel-investor reach — primarily CoStar,
                  supplemented by…"), and ref 03's Data role scopes mono to
                  figures, not prose; ref 04's "reach stats row in mono" is
                  satisfied by the value above. Setting 15-word sentences in
                  16px mono is what tipped this chapter from "enterprise
                  spine" to terminal, and it flattened the value/label step —
                  face contrast now carries it alongside weight and colour. */}
              <span className="mt-2 block font-sans text-body leading-snug text-fg-muted">
                {stat.label}
              </span>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
