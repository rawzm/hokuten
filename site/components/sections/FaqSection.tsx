/**
 * components/sections/FaqSection.tsx — `#faq` Diligence FAQ (ref 04 §`#faq`;
 * full rationale in docs/design/specs/faq.md). Server Component — the only
 * client boundary this section touches is the existing `ui/accordion.tsx`,
 * which already ships its own `"use client"`.
 *
 * Content is 100% `@/content/faq` — this file never retypes a question or an
 * answer (content law, AGENT-BRIEF.md). The one thing it DOES do to that copy
 * is presentational: split each answer on its `[PLACEHOLDER:confirm — …]`
 * markers so an unresolved fact renders as an unmissable notice instead of
 * blending into shipped body copy. That split relocates the marker's own
 * words out of the bracket syntax the same way `MicroLabel` composes its
 * brackets separately from its words — punctuation scaffolding, not content —
 * and never touches, trims, or invents the words themselves. The placeholder
 * notices themselves are UNCHANGED by the D6/D8 pass below and stay fully
 * visible — design-revisit §4.8: "they are a launch gate, not a bug."
 *
 * ── D6 density pass (2026-08-08/09), re-based 2026-08-17 ─────────────────
 * As built, `#faq` sat between `#team` (`surface-paper`) and `#bov`
 * (`surface-deep`); `#team` → `#faq` was a same-surface pair, so this section —
 * the SECOND of that pair — carries `section-join` to zero its own top padding
 * and share the gutter above instead of stacking two.
 *
 * The 2026-08-17 reorder (docs/LAUNCH-IMPLEMENTATION.md §3.2, R5) moved this
 * section up to screen 7, so the neighbour above is now `#method`
 * (`surface-dark`) and the pair no longer shares a surface, so `section-join`
 * was UNEARNED — it zeroed this section's top padding and jammed the paper
 * content against the dark band's edge. REMOVED 2026-08-17 (wave-1 review).
 * `#bov` below is still a different surface, so nothing applies on that side.
 * `section-fit` + `lg:flex lg:flex-col lg:justify-center` follow the same
 * pattern as `MethodSection`
 * and `TeamSection` — a no-op once the accordion genuinely runs past one
 * viewport, which design-revisit §4.8 explicitly allows ("a genuine
 * candidate for exceeding one screen … let the page scroll"). The accordion
 * itself is never put in a `scroll-well` — a collapsed accordion inside a
 * fixed-height well is a usability trap the brief calls out by name.
 *
 * ── D8 typography pass ────────────────────────────────────────────────────
 * The headline (`SectionHeader`, unmodified) stays the section's one focal
 * step — already carries its one italic accent word ("closer"). The only
 * type change here is the placeholder-notice caption stepping to mono 500
 * ("mono 500 for emphasised data values … leaned on more heavily").
 *
 * ── Design Revisit 2 (2026-08-10, D9/D10/D20, §5.6) — two-zone layout ──────
 * `container-hk` (1200px cap, single column) → `stage-shell` (D9) laid out
 * as a 12-column grid: `SectionHeader` takes the left 4 columns, the
 * `Accordion` takes the right 8, side by side from `lg:` — the "two-zone
 * layout — index/context on one side, the accordion on the other" the brief
 * asks for (docs/DESIGN-REVISIT-2.md §5.6; ref 04 `#faq`).
 *
 * "Index/context" is read here as the `SectionHeader` block ITSELF — its
 * `MicroLabel` already IS the page's bracketed numbered-index device
 * (`[ 05 — DILIGENCE FAQ ]`, ref 04: "a bracketed numbered index on every
 * section"), and its `sub` line already names what this section answers.
 * A second, invented table-of-contents (e.g. a plain-text echo of all 7
 * question strings as a mini nav) was considered and rejected: this task's
 * brief is explicit that `#method` through `#faq` "KEEP their current
 * information and interaction models… not a content rewrite," and a click-
 * to-open index item would change the interaction model (state would have
 * to move out of the Radix-owned accordion into a shared client parent),
 * which is out of scope this round. Reusing the existing header block as
 * the left zone adds zero new copy and zero new interaction — spatial only.
 *
 * `lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]` on the header zone: once a
 * visitor opens an answer, the right column can genuinely outgrow one screen
 * — `page-panel`'s `min-height` (never `height`) lets the panel grow rather
 * than clip, and the document scrolls through it (D22, 2026-08-10: scroll
 * snap and `PagedMode` are both deleted, so this was already how the page
 * scrolled; there is no mandatory-snap set left to drop out of). Without
 * `sticky` the left zone would just scroll away with row 1's answer; with
 * it, the index/context stays the visible anchor for the "which section of
 * the site am I in" question while the accordion grows underneath — pure
 * CSS positioning, no scroll listener, no `preventDefault`. The offset
 * matches the sitewide `scroll-margin-top: var(--nav-h)` convention
 * (`StatsSection.tsx` uses the identical `calc(var(--nav-h) + …)` shape for
 * its own nav-clearance fix) plus a little extra air so the header never
 * sits flush under the nav's bottom edge.
 *
 * `lg:items-start` on the grid (not `items-center`): the accordion column is
 * far taller than the header column even collapsed (7 rows vs. 3 lines of
 * copy), so centering would float the header toward the grid's vertical
 * middle instead of anchoring it to the top of its own zone — top-aligned
 * columns is what actually reads as "two zones," not one drifting past the
 * other.
 *
 * `section-pad` unchanged. The `section-join` that rode with it was dropped in
 * the 2026-08-17 reorder review — `#method` (`.surface-dark`) is the neighbour
 * above now, so there is no shared gutter to collapse into.
 *
 * ── 2026-08-17 · the `sub` line, re-cut after the D3 FAQ cut ───────────────
 * The header's `sub` used to read "Confidentiality, exchange timelines,
 * off-market access, licensing — the diligence a serious buyer or seller runs
 * before signing anything." Every one of those four topics belonged to a
 * question that decision D3 CUT this run (plan §3.12; the five cut questions
 * and what each is waiting on are tabulated in `content/faq.ts`'s header), so
 * the line advertised four answers the section no longer contains. It is
 * rewritten from the two SURVIVING questions' own words — "written BOV",
 * "calculator estimate" — and makes no claim of its own. **Rule for whoever
 * re-adds a cut question: the `sub` is a promise, so re-widen it in the same
 * change, and never let it name a topic the accordion does not answer.**
 */

import { AlertTriangle } from "lucide-react";

import { faq } from "@/content/faq";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Matches `[PLACEHOLDER:confirm — …]`, capturing the words after the
 * `PLACEHOLDER:confirm` prefix. Tolerant of an em dash, hyphen, or plain
 * space before the words (content authoring may vary the separator; the
 * prefix itself is the load-bearing part).
 */
const PLACEHOLDER_PATTERN = /\[PLACEHOLDER:confirm[\s—-]*([^\]]*)\]/g;

type AnswerSegment =
  | { kind: "text"; value: string }
  | { kind: "placeholder"; value: string };

/** Splits an answer into ordinary text and placeholder-marker segments, in order. */
function parseAnswer(answer: string): AnswerSegment[] {
  const segments: AnswerSegment[] = [];
  let cursor = 0;

  for (const match of answer.matchAll(PLACEHOLDER_PATTERN)) {
    const start = match.index ?? 0;
    const before = answer.slice(cursor, start).trim();
    if (before) segments.push({ kind: "text", value: before });
    segments.push({ kind: "placeholder", value: match[1].trim() });
    cursor = start + match[0].length;
  }

  const rest = answer.slice(cursor).trim();
  if (rest) segments.push({ kind: "text", value: rest });

  return segments;
}

/**
 * A `[PLACEHOLDER:confirm — …]` marker, rendered so it cannot be mistaken for
 * a shipped claim: hairline-bordered block row, `text-brick` throughout (the
 * same token `ui/field.tsx` uses for form errors), an `AlertTriangle`, and a
 * fixed mono caption ahead of the marker's own words.
 *
 * The caption's type tokens are composed manually (`font-mono text-micro
 * uppercase tracking-micro`) rather than via the `micro-label` utility class,
 * because that utility bundles its own `color: var(--fg-meta)` — combined
 * with `text-brick` on the same element, Tailwind's cascade order between two
 * same-specificity utilities is undefined. `atoms/Badge.tsx` hits the same
 * collision and solves it the same way (type on the wrapper, colour kept off
 * the utility that would fight it). `font-medium` (D8: "mono 500 for
 * emphasised data values") gives the caption a firmer step than the note
 * text beneath it — this is the one moment in the section that should read
 * as an alarm, not a label.
 */
function PlaceholderNotice({ note }: { note: string }) {
  return (
    <p
      data-placeholder-confirm="true"
      className="hairline flex items-start gap-2.5 rounded-card px-4 py-3 text-brick"
    >
      <AlertTriangle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
      <span className="flex flex-col gap-1">
        <span className="font-mono text-micro font-medium uppercase tracking-micro">
          Placeholder — confirm before launch
        </span>
        <span className="text-data">{note}</span>
      </span>
    </p>
  );
}

function FaqAnswer({ answer }: { answer: string }) {
  const segments = parseAnswer(answer);
  return (
    <div className="flex flex-col gap-4">
      {segments.map((segment, index) =>
        segment.kind === "placeholder" ? (
          <PlaceholderNotice key={index} note={segment.value} />
        ) : (
          <p key={index}>{segment.value}</p>
        ),
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="surface-paper section-pad page-panel lg:flex lg:flex-col lg:justify-center"
    >
      <div className="stage-shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        <Reveal className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)] lg:col-span-4">
          <SectionHeader
            id="faq-heading"
            index="05"
            label="Diligence FAQ"
            headline="The questions a *closer* answers first."
            sub="What a written BOV needs from you, and how it differs from the calculator estimate."
          />
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          <Accordion type="single" collapsible>
            {faq.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <FaqAnswer answer={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
