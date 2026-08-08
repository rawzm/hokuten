/**
 * components/atoms/StatNumeral.tsx — the big Fraunces stat numeral with its mono
 * caption (`$200M+` / AGGREGATE VOLUME).
 *
 * Governed by design-skill references 03 ("Stat numerals: Display 1/2 in Fraunces
 * with mono caption beneath — never mono for the big numeral", a P1 gate),
 * 04 (`#stats`) and 05 (Reveals → count-up rules). Server Component.
 *
 * Two non-negotiables encoded here:
 *
 * 1. The value is REAL TEXT rendered on the server. A counter that shows "$0 B+"
 *    with JS off is the named anti-pattern in ref 07 and a P0 gate. Nothing about
 *    `countUp` changes what the server renders; it only marks the element for a
 *    client enhancer.
 * 2. The numeral is Fraunces Light 300 with the ramp's negative tracking, which
 *    `text-display1` / `text-display2` already carry via their
 *    `--text-*--letter-spacing` modifiers. `tabular` keeps figure widths stable
 *    so a count-up cannot reflow the line — that is tabular FIGURES, not a mono
 *    font, so the P1 gate holds.
 *
 * Colour comes from the surrounding `.surface-*` scope by inheritance; adding a
 * `text-{color}` token alongside a `text-{size}` token would make tailwind-merge
 * drop one of them.
 */

import { cn } from "@/lib/utils";

export type StatNumeralProps = {
  /** Final, verified value as it must read with JS off, e.g. "$200M+", "3×". */
  value: string;
  /** Mono caption beneath the numeral, e.g. "Aggregate volume". */
  caption: string;
  /** Optional third line, e.g. "Q3 '25 · Q1 '26 · Q2 '26". */
  detail?: string;
  /**
   * Opt this numeral into the client count-up enhancer. Adds data attributes
   * only — this component stays a Server Component and ships no JS. The
   * enhancer is responsible for `useReducedMotion()` + `motionAllowed()` and for
   * restoring `data-countup-value` verbatim when it finishes or is disabled.
   */
  countUp?: boolean;
  /** Display step. Default `display2` (a 4-up band); `display1` for a solo stat. */
  size?: "display1" | "display2";
  as?: "div" | "li";
  className?: string;
};

export function StatNumeral({
  value,
  caption,
  detail,
  countUp = false,
  size = "display2",
  as: Tag = "div",
  className,
}: StatNumeralProps) {
  return (
    <Tag className={cn("block", className)}>
      <span
        className={cn(
          "block font-display font-light tabular",
          size === "display1" ? "text-display1" : "text-display2",
        )}
        data-countup={countUp ? "" : undefined}
        data-countup-value={countUp ? value : undefined}
        data-animated={countUp ? "" : undefined}
      >
        {value}
      </span>
      <span className="micro-label mt-3 block">{caption}</span>
      {detail ? <span className="data-line mt-2 block text-fg-muted">{detail}</span> : null}
    </Tag>
  );
}
