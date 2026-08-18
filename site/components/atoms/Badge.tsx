/**
 * components/atoms/Badge.tsx — mono uppercase 11px inside a hairline BOX.
 *
 * Governed by design-skill reference 03 (Components → Badges: "mono uppercase
 * 11px in a hairline box — EXCLUSIVE · OFF-MARKET · IN CONTRACT · CLOSED, accent
 * text for EXCLUSIVE/OFF-MARKET") and PHASE-1-EXECUTION §9 ("status-chip
 * semantics restyled to ref 03's badge — no glow dots"). Server Component.
 *
 * D-VOCAB / R2 (2026-08-17): the pill is gone. Brand Design Guide v1.3 line 29
 * — "hairline rules and outlined boxes ... never rounded card grids" — makes the
 * outlined BOX the whole vocabulary, so the badge sets `rounded-none` rather
 * than reaching for `--radius-pill`. That token survives for circular
 * primitives only (the ticker's LIVE dot, corner dots, 44px icon buttons); it is
 * not a badge shape any more. See the radii note in globals.css.
 *
 * Label and accent-ness for a listing status come from STATUS_PRESENTATION in
 * lib/status.ts — the one presentation record. This component never branches on
 * a status string itself.
 *
 * No coloured fills anywhere: structure is the 1px hairline, emphasis is the text
 * colour. That keeps the badge legible on paper, on card, and on the dark
 * chapter, in both themes, without inventing a colour pair.
 *
 * The type tokens sit on the pill and the colour token on an inner span on
 * purpose: `cn()`'s tailwind-merge groups `text-micro` and `text-accent-text`
 * together and would drop one. For the same reason, a caller-supplied
 * `className` must not contain a `text-{color}` token — it would silently remove
 * `text-micro`. Pass `accent` instead.
 */

import { cn } from "@/lib/utils";
import { STATUS_PRESENTATION, type ListingStatus } from "@/lib/status";

export type BadgeProps = {
  /** Listing status — label and accent-ness are read from STATUS_PRESENTATION. */
  status?: ListingStatus;
  /** Free-text variant, e.g. a cap-rate chip "7.25% Cap". Ignored when `status` is set. */
  label?: string;
  /** Free-text variant only: render the label in accent text. Statuses decide for themselves. */
  accent?: boolean;
  as?: "span" | "li" | "div";
  className?: string;
};

export function Badge({
  status,
  label,
  accent = false,
  as: Tag = "span",
  className,
}: BadgeProps) {
  const presentation = status ? STATUS_PRESENTATION[status] : undefined;
  const text = presentation?.label ?? label;

  if (!text) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Badge: nothing to render — pass either `status` or `label`.");
    }
    return null;
  }

  const isAccent = presentation?.accent ?? accent;

  return (
    <Tag
      className={cn(
        "hairline inline-flex items-center whitespace-nowrap rounded-none px-3 py-1",
        "font-mono text-micro uppercase tracking-micro tabular",
        className,
      )}
    >
      <span className={isAccent ? "text-accent-text" : "text-fg-muted"}>{text}</span>
    </Tag>
  );
}
