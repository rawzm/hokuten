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
 * ── D6 density pass (2026-08-08/09) ──────────────────────────────────────
 * `#faq` sits between `#team` (`surface-paper`) and `#bov` (`surface-deep`).
 * `#team` → `#faq` is a same-surface pair (`surface-paper` → `surface-paper`),
 * so this section — the SECOND of that pair — carries `section-join` to zero
 * its own top padding and share `#team`'s gutter instead of stacking two.
 * (`#bov` below is a different surface, so no join applies on that side.)
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
      className="surface-paper section-pad section-join section-fit lg:flex lg:flex-col lg:justify-center"
    >
      <div className="container-hk">
        <Reveal>
          <SectionHeader
            id="faq-heading"
            index="08"
            label="Diligence FAQ"
            headline="The questions a *closer* answers first."
            sub="Confidentiality, exchange timelines, off-market access, licensing — the diligence a serious buyer or seller runs before signing anything."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 md:mt-16 lg:mt-8">
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
