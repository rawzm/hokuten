/**
 * components/art/OrbitalArcs.tsx — hairline orbital-mechanics arcs for DARK
 * sections only.
 *
 * Governed by hokuten-design-director ref 01 (Motif system → "Star-grain
 * texture: faint grain + hairline orbital arcs on dark sections only (Aurelian
 * ref). Never on light chrome."), ref 03 ("Dark sections may carry star-grain
 * + hairline orbital arcs, max opacity 8%; light sections carry no texture"),
 * ref 07 (P0 a11y: decorative, `aria-hidden`).
 *
 * Server Component, zero client JS, no layout footprint.
 *
 * ── The motif ────────────────────────────────────────────────────────────
 * Not concentric decoration — an off-centre "pole" (echoing 北天, the
 * northern-sky mark) with three rings, two tilted eccentric orbits, one
 * graduated arc segment (three radial scale ticks, like a sextant reading),
 * a small crosshair at the pole, and two body markers sitting on a ring.
 * Every stroke belongs to the same instrument; nothing is a stray decorative
 * squiggle.
 *
 * ── Usage contract ──────────────────────────────────────────────────────
 * 1. DARK SECTIONS ONLY (`.surface-dark` / `.surface-black`). Never compose
 *    this into light chrome — there is no runtime guard for that (this
 *    component has no notion of which surface scope it's mounted in, same as
 *    every other token-consuming component in this codebase); it is a
 *    discipline rule enforced by the design audit, not by code.
 * 2. Render it FIRST among a section's children, immediately after the
 *    section's opening tag, so it paints behind the content in DOM order —
 *    no invented `z-index`. The parent must be `position: relative` (or
 *    `isolate`); the `.star-grain` utility already provides that, and this
 *    component is meant to sit alongside `.star-grain` on the SAME element,
 *    never inside a `.star-grain` element of its own — the grain speckle is
 *    a `::before` on the host, this is a sibling `<div>` layer. Composing the
 *    two is exactly `<section className="surface-dark star-grain ..."><OrbitalArcs />{children}</section>`.
 * 3. Purely decorative, informationless (unlike `HotelEngraving`, which
 *    depicts a specific building and therefore needs its own adjacent
 *    visually-hidden description) — this is ambient background geometry, so
 *    it carries only `aria-hidden`. If a section wants prose describing its
 *    combined dark-chapter texture (arcs + grain) for assistive tech, that
 *    belongs to the section, not duplicated here.
 *
 * `preserveAspectRatio="xMidYMid slice"` lets one fixed 1200x900 composition
 * fill any section's aspect ratio without distortion — cropped, never
 * squashed, "compresses cleanly to mobile" per the Aurelian digest (ref 02).
 */

import { cn } from "@/lib/utils";

/** Hard cap from ref 03: "max opacity 8%" — same value `star-grain` uses. */
const OPACITY = 0.08;

export type OrbitalArcsProps = {
  className?: string;
};

export function OrbitalArcs({ className }: OrbitalArcsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: OPACITY }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {/* Three rings sharing one off-centre pole. */}
          <circle cx="980" cy="260" r="520" />
          <circle cx="980" cy="260" r="360" />
          <circle cx="980" cy="260" r="210" />

          {/* Two tilted eccentric orbits around the same pole. */}
          <ellipse cx="980" cy="260" rx="620" ry="380" transform="rotate(-14 980 260)" />
          <ellipse cx="980" cy="260" rx="440" ry="260" transform="rotate(9 980 260)" />

          {/* Graduated arc segment on the r=360 ring, 160°-220°, with three
              radial scale ticks (start / mid / end) — a sextant reading, not
              a stray curve. */}
          <path d="M641.7 383.1 A360 360 0 0 1 704.2 28.6" />
          <path d="M649.2 380.4 L634.2 385.9" />
          <path d="M633.3 198.9 L617.6 196.1" />
          <path d="M710.4 33.7 L698.1 23.5" />

          {/* Pole crosshair. */}
          <circle cx="980" cy="260" r="3" />
          <path d="M980 246 L980 254 M980 266 L980 274 M966 260 L974 260 M986 260 L994 260" />
        </g>

        {/* Two body markers riding the r=210 ring. */}
        <g fill="currentColor" stroke="none">
          <circle cx="908.2" cy="62.7" r="2.5" />
          <circle cx="1182.8" cy="314.4" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
