/**
 * components/atoms/AccentRule.tsx — the thin accent rule.
 *
 * Governed by design-skill references 01 ("accent is scarce: CTAs, one accent
 * word per headline, badges, thin rules") and 03 (Colour roles — accent reads as
 * accent on light AND dark sections; Surfaces & borders — 1px structure, never a
 * drop shadow). Server Component.
 *
 * D-VOCAB / R2 (2026-08-17). Brand Design Guide v1.3 opens with "hairline rules
 * and outlined boxes", and this atom is the hairline half of that sentence: it
 * is now the shared instrument behind the gold kicker rule (`MicroLabel`) and
 * the stat tile's top rule (`StatNumeral`), not just a standalone divider.
 *
 * ── `tone` — which gold, and why there are two ────────────────────────────
 * `accent` (default) is the raw brand gold `--accent`: a DECORATIVE fill that
 * is correct for a divider read as ornament. It measures 2.96:1 on paper and
 * may never carry text — see the palette note in globals.css.
 * `accent-text` is `--accent-text`, which rebinds per surface scope
 * (`--accent-ink` on light, `--accent-on-dark` on dark) and therefore stays
 * legible as a hairline against every ground the site actually ships. The guide
 * kicker rule is specified in `--accent-text` (LAUNCH-IMPLEMENTATION §2.3), so
 * anything drawn as part of a TYPE device uses that tone; free-standing
 * ornament keeps the default and nothing existing changes.
 *
 * Purely decorative: it carries no information a sighted user gets and a
 * screen-reader user does not, so it is aria-hidden and is NOT an `<hr>` (that
 * would announce a thematic break that does not exist).
 */

import { cn } from "@/lib/utils";

/** Rhythm is the 8px component scale (ref 03: 8/16/24/32/48). */
const WIDTH = {
  sm: "w-8",
  md: "w-12",
  lg: "w-16",
  full: "w-full",
} as const;

const ALIGN = {
  start: "mr-auto",
  center: "mx-auto",
  end: "ml-auto",
} as const;

const TONE = {
  accent: "bg-accent",
  "accent-text": "bg-accent-text",
} as const;

export type AccentRuleProps = {
  /** sm 32px · md 48px · lg 64px · full — default `md`. */
  width?: keyof typeof WIDTH;
  /** 1px hairline (default) or a 2px emphasis rule. Nothing heavier ships. */
  thickness?: 1 | 2;
  /** `accent` decorative gold (default) · `accent-text` surface-aware gold. */
  tone?: keyof typeof TONE;
  align?: keyof typeof ALIGN;
  className?: string;
};

export function AccentRule({
  width = "md",
  thickness = 1,
  tone = "accent",
  align = "start",
  className,
}: AccentRuleProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block",
        TONE[tone],
        WIDTH[width],
        thickness === 2 ? "h-0.5" : "h-px",
        ALIGN[align],
        className,
      )}
    />
  );
}
