/**
 * components/atoms/AccentRule.tsx — the thin accent rule.
 *
 * Governed by design-skill references 01 ("accent is scarce: CTAs, one accent
 * word per headline, badges, thin rules") and 03 (Colour roles — accent reads as
 * accent on light AND dark sections; Surfaces & borders — 1px structure, never a
 * drop shadow). Server Component.
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

export type AccentRuleProps = {
  /** sm 32px · md 48px · lg 64px · full — default `md`. */
  width?: keyof typeof WIDTH;
  /** 1px hairline (default) or a 2px emphasis rule. Nothing heavier ships. */
  thickness?: 1 | 2;
  align?: keyof typeof ALIGN;
  className?: string;
};

export function AccentRule({
  width = "md",
  thickness = 1,
  align = "start",
  className,
}: AccentRuleProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block bg-accent",
        WIDTH[width],
        thickness === 2 ? "h-0.5" : "h-px",
        ALIGN[align],
        className,
      )}
    />
  );
}
