/**
 * components/atoms/DataLine.tsx — the mono deal-data line
 * ("Lake Harmony, PA · Full-Service · 450 keys").
 *
 * Governed by design-skill references 03 (Type ramp → Data row: JetBrains Mono,
 * tabular-nums — a P1 gate; the face changed under L3 on 2026-08-17, the rule
 * did not), 06 (Copy patterns → data lines) and
 * PHASE-1-EXECUTION §9 (the separator vocabulary is shared verbatim with the
 * a100 feed so a Phase 2 data swap renders without re-formatting).
 * Server Component.
 *
 * Mono + `font-variant-numeric: tabular-nums` both come from the `data-line`
 * utility, so every deal number on the site lines up column-for-column.
 *
 * Empty/blank parts are dropped by `metaLine`'s filter; a line with nothing left
 * to say renders nothing at all rather than a stray separator.
 */

import { Fragment, type ReactNode } from "react";
import { cn, metaLine } from "@/lib/utils";

export type DataLinePart = string | number | null | undefined;

/**
 * Longest part that still gets `whitespace-nowrap`. Above this a part is prose,
 * not a data token, and must be allowed to wrap — see the note at the render.
 */
const LONG_PART_CHARS = 32;

export type DataLineProps = {
  /** Ordered parts. Null/undefined/"" are dropped, matching `metaLine`. */
  parts: ReadonlyArray<DataLinePart>;
  /**
   * `joined` (default) — one text node via `metaLine`, the cheapest form and the
   * right choice for short lines.
   * `parts` — one span per value, each `whitespace-nowrap`, with a breakable
   * space after each separator. Long lines then wrap BETWEEN values on mobile
   * and never mid-value ("Lake Harmony," / "PA").
   */
  variant?: "joined" | "parts";
  as?: "p" | "span" | "div" | "dd";
  className?: string;
};

/**
 * `&nbsp;&middot;` (U+00B7 — the same character `metaLine` joins with) glues the
 * separator to the value it follows; the plain space after it is the only break
 * opportunity, so a wrapped line always starts on a value. The dot is
 * aria-hidden while the space stays readable, so assistive tech hears three
 * separate values rather than one run-on string.
 */
const SEPARATOR: ReactNode = (
  <>
    <span aria-hidden="true">&nbsp;&middot;</span>{" "}
  </>
);

export function DataLine({
  parts,
  variant = "joined",
  as: Tag = "p",
  className,
}: DataLineProps) {
  if (variant === "joined") {
    const text = metaLine([...parts]);
    if (!text) return null;
    return <Tag className={cn("data-line", className)}>{text}</Tag>;
  }

  const values = parts.filter(
    (part): part is string | number => part !== null && part !== undefined && part !== "",
  );
  if (values.length === 0) return null;

  return (
    <Tag className={cn("data-line min-w-0", className)}>
      {values.map((value, i) => (
        <Fragment key={`${i}-${value}`}>
          {i > 0 ? SEPARATOR : null}
          {/* `whitespace-nowrap` only for parts SHORT enough to plausibly fit a
              column. The rule exists so a real data value never breaks
              mid-token ("Lake Harmony," / "PA") — but a part longer than its
              container cannot honour it, and `nowrap` then forces the span to
              overflow the layout entirely rather than wrap.

              That is not hypothetical: #mandates splits a criteria line on its
              `·` separators, and one clause is a full prose sentence. In a
              two-column grid its column measured 245px while the nowrap span
              demanded 486px, which pushed the document's scrollWidth to 1616px
              at a 1440px viewport — a horizontal scrollbar on every breakpoint.
              Razim called that out as a hard release gate (D29), so the fix is
              here at the source rather than masked by the root's overflow clip.

              LONG_PART_CHARS is deliberately generous: every genuine data value
              this component was built for (prices, "450 keys", "Lake Harmony,
              PA", LP/SP ratios) is far below it, so the no-mid-token guarantee
              is untouched for its real use case. */}
          <span className={value.toString().length <= LONG_PART_CHARS ? "whitespace-nowrap" : undefined}>
            {value}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
