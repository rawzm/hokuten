/**
 * components/atoms/StatNumeral.tsx — the stat tile: a thin gold rule, a mono
 * caps label, and the big Cormorant numeral beneath it (AGGREGATE VOLUME /
 * `$200M+`).
 *
 * Governed by design-skill references 03 ("Stat numerals: Display 1/2 in the
 * display face with a mono caption — never mono for the big numeral", a P1
 * gate), 04 (`#stats`) and 05 (Reveals → count-up rules). Server Component.
 *
 * ── D-VOCAB / R2 (2026-08-17) — the guide's stat tile ─────────────────────
 * Brand Design Guide v1.3 line 30 states the anatomy top-down: "thin gold rule
 * on top / mono caps label / [display] number beneath". Two things changed here
 * to match it, and both are deliberate:
 *
 *   1. A 1px `--accent-text` rule now caps the tile (`AccentRule width="full"`).
 *      It is the tile's whole structure — there is no box, no fill and no
 *      shadow, which is the same "hairline rules and outlined boxes" sentence
 *      that took the resting shadow off the deal ticket.
 *   2. The LABEL now precedes the NUMERAL in source order, where it used to
 *      follow it. That is the guide's stack, and it also reads better aloud:
 *      "Aggregate volume, $200M+" rather than "$200M+, aggregate volume".
 *
 * Two non-negotiables are unchanged:
 *
 *   · The value is REAL TEXT rendered on the server. A counter that shows "$0 B+"
 *     with JS off is the named anti-pattern in ref 07 and a P0 gate. Nothing
 *     about `countUp` changes what the server renders; it only marks the element
 *     for a client enhancer.
 *   · The numeral is the display face at Light 300 with the ramp's negative
 *     tracking, which `text-display1` / `text-display2` already carry via their
 *     `--text-*--letter-spacing` modifiers. `tabular` keeps figure widths stable
 *     so a count-up cannot reflow the line — that is tabular FIGURES, not a mono
 *     font, so the P1 gate holds.
 *
 * The label's tracking widens to `--tracking-label` (0.24em, the guide's kicker
 * value) on an inner span rather than on the `micro-label` element: `micro-label`
 * is a custom `@utility` and wins the cascade against a `tracking-*` class on the
 * same element, while `letter-spacing` inherits cleanly to a child. Same reason
 * `MicroLabel` does it — see that file's note.
 *
 * Colour comes from the surrounding `.surface-*` scope by inheritance; adding a
 * `text-{color}` token alongside a `text-{size}` token would make tailwind-merge
 * drop one of them.
 */

import { cn } from "@/lib/utils";
import { AccentRule } from "./AccentRule";

export type StatNumeralProps = {
  /** Final, verified value as it must read with JS off, e.g. "$200M+", "3×". */
  value: string;
  /** Mono caption above the numeral, e.g. "Aggregate volume". */
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
      <AccentRule tone="accent-text" width="full" />
      <span className="micro-label mt-3 block">
        <span className="tracking-label">{caption}</span>
      </span>
      <span
        className={cn(
          "mt-2 block font-display font-light tabular",
          size === "display1" ? "text-display1" : "text-display2",
        )}
        data-countup={countUp ? "" : undefined}
        data-countup-value={countUp ? value : undefined}
        data-animated={countUp ? "" : undefined}
      >
        {value}
      </span>
      {detail ? <span className="data-line mt-2 block text-fg-muted">{detail}</span> : null}
    </Tag>
  );
}
