/**
 * components/atoms/SectionHeader.tsx — the standard section opener:
 * micro-label + Display-2 headline + optional sub.
 *
 * Governed by design-skill references 03 (Type ramp, hierarchy), 04 (every
 * section carries its micro-label index) and 06 (Voice: sentence-case headlines,
 * one evocative word). Server Component.
 *
 * The italic accent device (PHASE-1-EXECUTION §3): exactly ONE italic word per
 * headline, Cormorant Garamond Italic at the SAME size and weight as its line —
 * which is why the accent word inherits every type property and only adds
 * `italic`. More than one marker is a P2 gate breach, so it warns in development
 * and only the first marker is honoured.
 *
 * ── D-VOCAB / R2 (2026-08-17) — the guide's section opener ────────────────
 * Brand Design Guide v1.3 line 27 specifies the opener as a gold JetBrains Mono
 * kicker over a thin gold rule, above the Cormorant headline. This component IS
 * the site's kicker slot, so it turns `MicroLabel`'s `tone="accent"` + `rule` on
 * for every section rather than leaving each section to remember. The rule
 * inherits the header's own alignment so a centred closing line keeps its axis.
 *
 * `tail` opts the accent phrase into `.display-tail` (guide line 14: the last
 * phrase of a display line set in Cormorant italic AND in gold). It is OFF by
 * default and deliberately not inferred from "the accent happens to be last":
 * the utility's own note is that a headline whose accent genuinely sits
 * mid-clause keeps the plain italic, and manufacturing a tail where the
 * sentence has none is a copy decision, not a layout one. Content owners flip
 * it per headline.
 *
 * The headline always renders with an id so the owning section can carry
 * `aria-labelledby`. Scroll offset for that id is global (`:where([id])` in
 * globals.css), so nothing is applied here.
 *
 * Class-composition note: never put a `text-{size}` and a `text-{color}` token
 * in the same className — `cn()`'s tailwind-merge treats both as the same group
 * and silently drops one. Size and colour therefore live on separate elements.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MicroLabel } from "./MicroLabel";

/** Pre-split headline: `{ before: "Twelve closings, one ", accent: "method", after: "." }` */
export type AccentHeadline = {
  before?: string;
  /** The single italic word. Pass "" for a headline with no accent word. */
  accent: string;
  after?: string;
};

type ParsedHeadline = { before: string; accent: string; after: string };

export type SectionHeaderProps = {
  /** id for the heading — point the owning `<section aria-labelledby>` at it. */
  id: string;
  /** Micro-label index, e.g. "01". */
  index?: string;
  /** Micro-label words, e.g. "Track record". */
  label?: ReactNode;
  /**
   * Headline. String form marks the italic accent word with asterisks:
   * `"Twelve closings, one *method*."` Object form skips parsing entirely.
   */
  headline: string | AccentHeadline;
  /** One-line sub beneath the headline. */
  sub?: ReactNode;
  /** Heading level. Default `h2`; the hero uses `h1`. */
  as?: "h1" | "h2" | "h3";
  /** Display step. Default `display2`; `display1` is hero-scale. */
  size?: "display1" | "display2";
  /**
   * Set the accent phrase as the guide's gold italic TAIL (`.display-tail`)
   * instead of a plain italic accent word. Only correct when the accent phrase
   * actually closes the line.
   */
  tail?: boolean;
  align?: "start" | "center";
  className?: string;
};

const ACCENT_MARKER = /\*([^*]+)\*/g;

function stripMarkers(value: string): string {
  return value.replace(ACCENT_MARKER, "$1");
}

function parseHeadline(headline: string | AccentHeadline): ParsedHeadline {
  if (typeof headline !== "string") {
    return {
      before: headline.before ?? "",
      accent: headline.accent,
      after: headline.after ?? "",
    };
  }

  const matches = Array.from(headline.matchAll(ACCENT_MARKER));
  if (matches.length === 0) {
    return { before: headline, accent: "", after: "" };
  }

  if (matches.length > 1 && process.env.NODE_ENV !== "production") {
    console.warn(
      `SectionHeader: exactly one italic accent word per headline (design ref 03, ` +
        `P2 gate). Found ${matches.length} markers in "${headline}" — only the first ` +
        `is set in italic.`,
    );
  }

  const first = matches[0];
  const start = first.index ?? 0;
  return {
    before: headline.slice(0, start),
    accent: first[1],
    after: stripMarkers(headline.slice(start + first[0].length)),
  };
}

export function SectionHeader({
  id,
  index,
  label,
  headline,
  sub,
  as: Heading = "h2",
  size = "display2",
  tail = false,
  align = "start",
  className,
}: SectionHeaderProps) {
  const { before, accent, after } = parseHeadline(headline);
  const centered = align === "center";
  const hasMicroLabel = index !== undefined || label !== undefined;

  return (
    <div className={cn(centered ? "text-center" : "text-start", className)}>
      {hasMicroLabel ? (
        <MicroLabel
          as="p"
          index={index}
          tone="accent"
          rule
          ruleAlign={centered ? "center" : "start"}
          className="mb-4"
        >
          {label}
        </MicroLabel>
      ) : null}

      <Heading
        id={id}
        className={cn(
          "font-display font-light",
          size === "display1" ? "text-display1" : "text-display2",
        )}
      >
        {before}
        {accent ? <em className={tail ? "display-tail" : "italic"}>{accent}</em> : null}
        {after}
      </Heading>

      {sub ? (
        <p className={cn("mt-6 max-w-[62ch] text-body-lg", centered && "mx-auto")}>
          <span className="text-fg-muted">{sub}</span>
        </p>
      ) : null}
    </div>
  );
}
