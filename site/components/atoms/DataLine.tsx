/**
 * components/atoms/DataLine.tsx — the mono deal-data line
 * ("Lake Harmony, PA · Full-Service · 450 keys").
 *
 * Governed by design-skill references 03 (Type ramp → Data row: IBM Plex Mono,
 * tabular-nums — a P1 gate), 06 (Copy patterns → data lines) and
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
    <Tag className={cn("data-line", className)}>
      {values.map((value, i) => (
        <Fragment key={`${i}-${value}`}>
          {i > 0 ? SEPARATOR : null}
          <span className="whitespace-nowrap">{value}</span>
        </Fragment>
      ))}
    </Tag>
  );
}
