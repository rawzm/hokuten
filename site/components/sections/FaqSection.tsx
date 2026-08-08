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
 * and never touches, trims, or invents the words themselves.
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
 * the utility that would fight it).
 */
function PlaceholderNotice({ note }: { note: string }) {
  return (
    <p
      data-placeholder-confirm="true"
      className="hairline flex items-start gap-2.5 rounded-card px-4 py-3 text-brick"
    >
      <AlertTriangle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
      <span className="flex flex-col gap-1">
        <span className="font-mono text-micro uppercase tracking-micro">
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
    <section id="faq" aria-labelledby="faq-heading" className="surface-paper section-pad">
      <div className="container-hk">
        <Reveal>
          <SectionHeader
            id="faq-heading"
            label="Diligence FAQ"
            headline="The questions a *closer* answers first."
            sub="Confidentiality, exchange timelines, off-market access, licensing — the diligence a serious buyer or seller runs before signing anything."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 md:mt-16">
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
