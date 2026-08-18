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
 * the imported atoms (`Reveal`, `Stamp`, `PhotoFrame`) — this file adds zero
 * client JS of its own.
 *
 * ── Micro-label index: `04` (sitewide registry, fixed 2026-08-08,
 *    re-sequenced 2026-08-17) ───────────────────────────────────────────────
 * The concurrent section agents each guessed, so the page shipped with a
 * broken run (01, 02, 03, unindexed, 01, unindexed…). The coherence audit
 * assembled the definitive sequence; the 2026-08-17 launch reorder
 * (docs/LAUNCH-IMPLEMENTATION.md §3.2, R5) moved `#faq` and `#bov` up and
 * `#team` / `#doors` / `#mandates` down, and the run was renumbered with the
 * order. This section keeps `04`. The current run is the single source of
 * truth:
 *
 *   masthead band — unindexed word-only labels:
 *     #hero `[ HOSPITALITY INVESTMENT SALES — NATIONWIDE ]`
 *     #stats `[ TRUST METRICS ]` · #brands `[ FLAGS WE TRANSACT ACROSS ]`
 *   numbered chapter run (ref 04 pins #closings to `01`, so nothing above it
 *   may take a number):
 *     01 #closings · 02 #listings · 03 #calculator · 04 #method · 05 #faq ·
 *     06 #bov · 07 #team · 08 #doors · 09 #mandates
 *
 * `content/methodology.ts`'s header comment proposing `[ 03 — METHOD ]` is
 * stale — 03 belongs to `#calculator`. Do not renumber a section without
 * renumbering the whole run.
 *
 * ── Art: HotelEngraving RETIRED, glyph-mosaic chapter art now WIRED ────────
 * Razim's verdict on the old engraving: ugly. It never renders here — do not
 * re-add `<HotelEngraving>`. Its component file and `public/art/hotel-
 * engraving.svg` stay untouched (this file does not own them).
 *
 * The engraving's slot was reserved for the supplied 「北天」 glyph-mosaic
 * Method-chapter piece. As of design-revisit 1 neither the placement manifest
 * nor the image files existed, so this chapter shipped on an interim of
 * texture alone (`star-grain` + `OrbitalArcs` + `KanjiAccent`, no photographic
 * art object). Both now exist: `site/content/artwork.ts`'s `"method.chapter"`
 * entry is `status: "delivered"` (slug `hie-dusk`, `variant: "chapter"`, 4:3),
 * and the generated derivatives are on disk under `site/public/art/`. This
 * pass wires it in via `getArt()` — see "2026-08-10 spatial rebuild" below for
 * where it sits in the composition. `getArt()` is still called defensively
 * (`methodArt` may be `null`) so a future manifest regression degrades to the
 * pre-existing text-only layout rather than a broken `<img>`.
 *
 * ── 2026-08-10 spatial rebuild (docs/DESIGN-REVISIT-2.md §5.6, D9/D10/D20) ──
 * Chassis: `container-hk` (1200px cap) → `stage-shell` (D9, full-width, fluid
 * gutter); `section-fit` → `page-panel` (D10, the twelve-screen chassis class
 * the route-level snap rule actually targets); `section-pad` →
 * `section-pad-tight` (this is a content-dense chapter — paragraph, five
 * steps, four reach stats, now plus art — the tighter rhythm buys back some
 * of the vertical budget the new art object spends). No `section-join`: this
 * section's neighbours in `page.tsx` are `#calculator` (`.surface-paper`) and,
 * since the 2026-08-17 reorder, `#faq` (`.surface-paper`) — both different from
 * this section's `.surface-dark`, so the alternating-surface pair never
 * qualifies here. `#faq` below now carries a `section-join` it no longer earns
 * against this dark surface; see FaqSection.tsx's header note.
 *
 * Composition — "balance the artwork and the process steps across the full
 * width" (the brief's literal instruction), not stack one on top of the
 * other: a two-column `lg:grid-cols-12` row puts the chapter photograph +
 * two-tone framing paragraph in a `lg:col-span-4` left column and the five-
 * step process list in a `lg:col-span-8` right column. 4/8 rather than the
 * previous 5/7 split is deliberate — a photograph reads taller than a text
 * column at the same width (4:3 box vs. flowing prose), so the narrower left
 * column keeps the two columns closer to equal height instead of the art
 * column running noticeably taller than the stepper. The header row (micro-
 * label + stamp + headline) and the reach-stats row bracket that grid, and
 * the whole stack sits inside a `lg:flex-1 lg:justify-between` wrapper (same
 * device `StatsSection` already ships) so it DISTRIBUTES across the usable
 * screen at qualifying desktop sizes rather than clustering at the top with
 * dead space below — the defect this round exists to fix.
 *
 * D20 hierarchy carried through unchanged in voice, only reassigned to the
 * four canonical jobs: Display is the section headline (`SectionHeader`,
 * Fraunces 300); Heading/value is each step title (Fraunces 500, unchanged
 * from D8); Body/data is the framing paragraph, step bodies, and reach-stat
 * labels (Inter body); Micro is the step index numerals and reach-stat
 * numerals' own micro companions (mono tracked caps, unchanged). No new type
 * size was introduced to "enlarge" anything — the brief is explicit that this
 * pass is spatial, not a hierarchy rewrite beyond what D20 already specifies.
 *
 * Still exactly ONE `<KanjiAccent />` in this section (unchanged) and the
 * hanko `<Stamp>` stays exactly where it was, beside the micro-label — both
 * required by the fixed-placement scarcity rules in their own component
 * headers.
 *
 * ── 2026-08-17 · the operating-model intro (D10, plan §3.15 / Appendix B6) ─
 * `V2` §3 line 51's operating-model paragraph is APPROVED VERBATIM copy that
 * had no surface anywhere on the site; D10 lands it here, as this chapter's
 * intro, because it describes exactly what this chapter then shows. It sits
 * directly under the headline, above the art/stepper row, as `METHOD_INTRO`
 * below.
 *
 * Two rules on that string. **It is verbatim** — pasted from the plan's paste
 * bank, never paraphrased, never trimmed to fit a height budget. And **its
 * last sentence is the compliance half of the paragraph**: it is what keeps
 * the AI/automation sentence in front of it from reading as machine-made
 * valuation or advice. The first two sentences never ship without it. The
 * two-tone pass below renders that sentence at full `text-fg` for exactly
 * that reason — emphasis is colour only, the string is untouched.
 *
 * Fit: this chapter was already the worst offender against the D28 budget
 * (1.57 screens at 1440x900) and the intro adds ~3 lines. `page-panel` sets
 * `min-height`, never `height`, so it grows and scrolls rather than clips.
 * The levers, if one is needed, are spatial (the intro's measure, the art
 * box, `section-pad-tight`) — never this paragraph's words.
 */

import type { ReactNode } from "react";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { KanjiAccent } from "@/components/art/KanjiAccent";
import { OrbitalArcs } from "@/components/art/OrbitalArcs";
import Stamp from "@/components/atoms/Stamp";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { getArt } from "@/content/artwork";
import { methodFraming, methodSteps, reachStats } from "@/content/methodology";

/**
 * Two-tone emphasis (ref 06): key temporal/contractual phrases render
 * `text-fg`, the connective narrative around them renders `text-fg-muted`.
 * Weight never changes — colour alone carries the emphasis, per the on-dark
 * law ("never invent an opacity; the on-dark tokens are contrast-proven").
 *
 * This only wraps substrings of its input in spans for styling — the text
 * itself is never altered, so both verbatim paragraphs it serves (the
 * listing-term framing from `content/methodology.ts` and the approved
 * operating-model intro below) stay byte-identical to their sources.
 */
const FRAMING_EMPHASIS = [
  "180 days",
  "two 90-day cycles",
  "Days 30 and 60",
  "Day 90",
  "second 90-day cycle",
] as const;

/**
 * The `#method` intro — `V2` §3 line 51's operating-model paragraph, APPROVED
 * VERBATIM (plan Appendix B6, surfaced here by D10 / plan §3.15). Pasted from
 * the paste bank, never retyped and never edited: no trim, no reorder, no
 * "tightening". See this file's header note for why the final sentence is
 * non-severable.
 *
 * It lives here rather than in `content/methodology.ts` only because that file
 * is outside this change's ownership fence; it is ordinary content copy and
 * belongs beside `methodFraming` whenever that module is next opened.
 */
const METHOD_INTRO =
  "The Hokuten model combines an owner-operator lens, direct relationship work, evidence-based valuation, disciplined prospecting, source verification, and modern systems. AI assists research and document review, while controlled automation supports routing, follow-up, reporting, and quality control. Licensed professionals retain responsibility for valuation, pricing, advice, communications, and client decisions.";

/**
 * Two-tone emphasis for the intro: the compliance sentence renders at full
 * `text-fg` against the muted operating-model sentences in front of it, so the
 * clause that assigns valuation, pricing, advice and client decisions to
 * LICENSED PROFESSIONALS is the one that reads first — colour only, weight
 * unchanged, string untouched.
 */
const INTRO_EMPHASIS = [
  "Licensed professionals retain responsibility for valuation, pricing, advice, communications, and client decisions.",
] as const;

function renderTwoTone(text: string, phrases: readonly string[], source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  phrases.forEach((phrase, i) => {
    const idx = text.indexOf(phrase, cursor);
    if (idx === -1) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `MethodSection: two-tone emphasis phrase "${phrase}" not found in ` +
            `${source} — the source paragraph may have changed.`,
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

/** Chapter photograph's box + its share of the row — see "Composition" above
 *  for why 4/12 (not the manifest's own 42vw default guess, tuned here
 *  against the real column). */
const ART_SIZES = "(min-width: 1024px) 30vw, 100vw";

export function MethodSection() {
  const methodArt = getArt("method.chapter");

  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="surface-dark star-grain page-panel section-pad-tight relative isolate overflow-hidden lg:flex lg:flex-col"
    >
      <OrbitalArcs />
      <KanjiAccent />
      <span className="visually-hidden">
        Decorative hairline orbital-ring texture and background 北天 kanji motif behind this
        chapter — no informational content.
      </span>

      <div className="stage-shell relative flex flex-col gap-10 lg:flex-1 lg:justify-between lg:gap-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <MicroLabel index="04">Method</MicroLabel>
            <Stamp placement="method" onDark size={20} />
          </div>
          <SectionHeader id="method-heading" headline="How we run a *sale*." />
          {/* D10 / plan §3.15 — the approved operating-model paragraph as this
              chapter's intro. Same measure and rhythm as `SectionHeader`'s own
              `sub` slot, but rendered as its own paragraph so the compliance
              sentence can take the two-tone step (`sub` wraps everything in one
              muted span). Verbatim: see METHOD_INTRO. */}
          <p className="mt-6 max-w-[62ch] text-body-lg leading-relaxed">
            {renderTwoTone(METHOD_INTRO, INTRO_EMPHASIS, "METHOD_INTRO")}
          </p>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-14">
          <Reveal className="flex flex-col gap-6 lg:col-span-4">
            {methodArt ? (
              <PhotoFrame
                src={methodArt.src}
                alt={methodArt.alt}
                aspect="4/3"
                sizes={ART_SIZES}
                reveal={false}
                className="w-full"
              />
            ) : null}
            <p className="max-w-[52ch] text-body-lg leading-relaxed">
              {renderTwoTone(methodFraming, FRAMING_EMPHASIS, "methodFraming")}
            </p>
          </Reveal>

          <Reveal as="ol" stagger className="hairline-l flex flex-col gap-8 pl-8 lg:col-span-8">
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
          className="hairline-t grid grid-cols-2 gap-x-8 gap-y-8 pt-8 md:grid-cols-4"
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
