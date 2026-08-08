/**
 * components/art/PlateChrome.tsx — the Coronal print-proof chrome: hairline
 * frame + FOUR corner registration marks + an optional quiet mono caption.
 *
 * Governed by hokuten-design-director ref 02 (Coronal video digest — "cool-
 * white poster panel with hairline frame + print registration marks
 * (corner circles/crosses), quiet gray grotesk caption top-left"), ref 03
 * ("Coronal plate chassis — Theme B light chrome only. Light surfaces only;
 * never on dark" and the `plate-frame` utility this component extends), ref 07
 * (decorative parts `aria-hidden`).
 *
 * ┌── LIGHT SURFACES ONLY ──────────────────────────────────────────────────┐
 * │ The registration-mark colour (`--accent-text`) and hairline (`--hairline`)│
 * │ are calibrated for a `.surface-paper`/`.surface-card` ground. Do not      │
 * │ render this inside `.surface-dark`/`.surface-black` — ref 03 reserves     │
 * │ the plate chassis to Theme B's light hero and any other light-chrome      │
 * │ plate section; dark sections get `star-grain`, never `plate-frame`.       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ── Why this is a new component and not just the `plate-frame` utility ────
 * `globals.css`'s `@utility plate-frame` gives a hairline border plus TWO
 * corner marks (top-left + bottom-right, via `::before`/`::after` — a single
 * element only has two pseudo-elements to spend). The Coronal reference and
 * this component's own brief call for all FOUR corners (a real print
 * registration frame marks every edge), which needs four real DOM nodes, not
 * two pseudo-elements. This component does not reuse `plate-frame` as a base
 * class — it reimplements the same visual spec (hairline border, 9px circle
 * marks, 1px `--accent-text` stroke, 55% opacity, marks centred ON the
 * border) as four sibling elements so all four corners are identical, rather
 * than mixing two CSS-generated marks with two hand-built ones.
 *
 * ── The caption is Hokuten's own device, not a literal port ────────────────
 * The Coronal reference's caption face is a sans "grotesk." Hokuten's type law
 * allows exactly two tracked-caps flavours sitewide (`brand-line`,
 * `micro-label`) — inventing a third (a plain small sans caption) would widen
 * the type system for one component. The caption below renders through the
 * existing `micro-label` utility (mono, uppercase, tracked, `--fg-meta`),
 * which is already Hokuten's "quiet small caption" vocabulary everywhere else
 * on the site. This is the reference-digest rule in practice: translate, never
 * clone.
 *
 * Server Component — no interactivity, no client JS.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Tailwind position utilities for each of the four corners. Marks sit
 * centred ON the hairline border (half in, half out), matching the
 * `plate-frame` utility's own `-5px` offset for a 1px border + 9px mark. */
const CORNER_POSITION = [
  "-left-[5px] -top-[5px]",
  "-right-[5px] -top-[5px]",
  "-bottom-[5px] -left-[5px]",
  "-bottom-[5px] -right-[5px]",
] as const;

export type PlateChromeProps = {
  children: ReactNode;
  /** Quiet mono caption, top-left, inside the frame. Omit for no caption. */
  caption?: ReactNode;
  className?: string;
};

export function PlateChrome({ children, caption, className }: PlateChromeProps) {
  return (
    <div className={cn("relative hairline", className)}>
      {caption ? (
        // `bg-card/90` backs the caption regardless of what renders beneath it
        // (art glyphs, not a flat ground) — legibility must not depend on
        // which cell of the ASCII grid happens to sit under this corner.
        <p className="micro-label absolute left-4 top-3 z-10 max-w-[70%] rounded-card bg-card/90 px-2 py-1">
          {caption}
        </p>
      ) : null}

      {children}

      {/* Registration marks — purely decorative print-proof convention. */}
      {CORNER_POSITION.map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute size-[9px] rounded-pill border border-accent-text opacity-[0.55]",
            position,
          )}
        />
      ))}
    </div>
  );
}
