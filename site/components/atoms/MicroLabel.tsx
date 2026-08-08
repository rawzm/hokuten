/**
 * components/atoms/MicroLabel.tsx — the `[ 01 — TRACK RECORD ]` device.
 *
 * Governed by design-skill references 01 (Typography → micro-label device),
 * 03 (Type ramp → micro-label row) and 06 (Copy patterns). Server Component.
 *
 * Callers pass the WORDS only; the brackets and the em dash are composed here so
 * the device can never drift between sections. Those characters are real text in
 * the DOM (never CSS pseudo-content) but carry no meaning, so they sit in
 * aria-hidden spans — a screen reader hears "01 Track record", not
 * "left bracket 01 em dash Track record right bracket".
 *
 * The separators use `&nbsp;` so the device never breaks across a line, and are
 * written as HTML entities to keep the source free of invisible characters.
 *
 * Case: the `micro-label` utility applies `text-transform: uppercase`, which is
 * presentational only. Authoring children in sentence case ("Track record")
 * therefore renders as caps while assistive tech still reads a normal word.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MicroLabelProps = {
  /** Section index, e.g. "01". Omit for an unindexed device: `[ CAPITAL & MANDATES ]`. */
  index?: string;
  /** The words. Brackets are composed by this component — never pass them in. */
  children: ReactNode;
  /** Element to render. Default `span` (inline); use `p`/`div` for a block eyebrow. */
  as?: "span" | "p" | "div" | "dt";
  id?: string;
  className?: string;
};

export function MicroLabel({
  index,
  children,
  as: Tag = "span",
  id,
  className,
}: MicroLabelProps) {
  return (
    <Tag id={id} className={cn("micro-label", className)}>
      <span aria-hidden="true">[&nbsp;</span>
      {index ? (
        <>
          {index}
          <span aria-hidden="true">&nbsp;&mdash;&nbsp;</span>
        </>
      ) : null}
      {children}
      <span aria-hidden="true">&nbsp;]</span>
    </Tag>
  );
}
