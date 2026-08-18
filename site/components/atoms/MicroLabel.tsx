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
 *
 * ── D-VOCAB / R2 (2026-08-17) — the guide's kicker ────────────────────────
 * Brand Design Guide v1.3 line 27: a gold JetBrains Mono kicker with a thin
 * gold rule, sitting above a Cormorant headline. Two opt-in props express it:
 *
 *   tone="accent"  the words go gold (`--accent-text`) and the tracking widens
 *                  from the guide floor `--tracking-micro` (0.18em) to the
 *                  kicker value `--tracking-label` (0.24em). Both stay inside
 *                  the guide's legal 0.18–0.32em band.
 *   rule           renders the 1px `--accent-text` hairline beneath the words,
 *                  inset to the text column (32px, `AccentRule width="sm"`).
 *
 * Both default OFF. `SectionHeader` — the canonical kicker slot — turns both on,
 * so every section opener carries the device; the calculator rails, the consent
 * modal, the legal pages and the footer keep the quiet meta treatment, because
 * accent is scarce (ref 01) and those are labels, not kickers.
 *
 * TWO-DIGIT GOLD NUMERALS (guide line 32). The `index` is ALWAYS `--accent-text`,
 * tone or no tone: the 01/02/03 device is the guide's own, and the digits are
 * the scarce accent, not the words beside them.
 *
 * ── Why the accent treatment sits on an inner span ────────────────────────
 * `micro-label` is a custom `@utility`, so it is emitted after Tailwind's core
 * utilities and its own `color` / `letter-spacing` win the cascade against a
 * `text-accent-text` / `tracking-label` class placed on the SAME element (the
 * same ordering that makes MenuOverlay reach for `border-0!` to beat
 * `hairline`). Colour and letter-spacing both INHERIT, so carrying them on a
 * child element sidesteps the fight entirely and stays correct whichever way a
 * future Tailwind release orders the layer. Do not "simplify" this by hoisting
 * the classes onto `Tag`.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AccentRule } from "./AccentRule";

export type MicroLabelProps = {
  /** Section index, e.g. "01". Omit for an unindexed device: `[ CAPITAL & MANDATES ]`. */
  index?: string;
  /** The words. Brackets are composed by this component — never pass them in. */
  children: ReactNode;
  /** Element to render. Default `span` (inline); use `p`/`div` for a block eyebrow. */
  as?: "span" | "p" | "div" | "dt";
  /** `meta` (default) — the quiet label. `accent` — the guide's gold kicker. */
  tone?: "meta" | "accent";
  /** Draw the 1px gold kicker rule beneath the words. Needs a block `as`. */
  rule?: boolean;
  /** Which edge the kicker rule hangs from. Mirrors the header's alignment. */
  ruleAlign?: "start" | "center";
  id?: string;
  className?: string;
};

export function MicroLabel({
  index,
  children,
  as: Tag = "span",
  tone = "meta",
  rule = false,
  ruleAlign = "start",
  id,
  className,
}: MicroLabelProps) {
  const accent = tone === "accent";

  if (rule && Tag === "span" && process.env.NODE_ENV !== "production") {
    console.warn(
      "MicroLabel: `rule` draws a block-level hairline, so it needs a block " +
        'element — pass as="p" (or "div"/"dt"). On the default inline `span` the ' +
        "rule generates an anonymous block box and the eyebrow's layout drifts.",
    );
  }

  const device = (
    <>
      <span aria-hidden="true">[&nbsp;</span>
      {index ? (
        <>
          {/* Guide line 32: the two-digit numeral is the gold, always. */}
          {accent ? index : <span className="text-accent-text">{index}</span>}
          <span aria-hidden="true">&nbsp;&mdash;&nbsp;</span>
        </>
      ) : null}
      {children}
      <span aria-hidden="true">&nbsp;]</span>
    </>
  );

  return (
    <Tag id={id} className={cn("micro-label", className)}>
      {accent ? <span className="tracking-label text-accent-text">{device}</span> : device}
      {rule ? (
        <AccentRule tone="accent-text" width="sm" align={ruleAlign} className="mt-3" />
      ) : null}
    </Tag>
  );
}
