/**
 * components/sections/ClosingsSection.tsx — `#closings` [ 01 ], the track
 * record.
 *
 * Governed by hokuten-design-director ref 04 (`#closings`), ref 05 (Reveals →
 * stagger cap of 6), ref 06 (Voice, evidence gate), docs/DESIGN-REVISIT.md
 * §2 D3/D4/D6/D8 and §4.4/§4.5 — read those for the full IA/states/motion
 * rationale before changing this one. `#closings` is the canonical section
 * [ 01 ] in the numbered micro-label sequence `01 #closings … 09 #bov` —
 * that index is load-bearing, not cosmetic; keep it.
 *
 * Server Component — ships no client JS of its own; `Reveal` and
 * `ClosingCard`'s nested `PhotoFrame` are the only client boundaries in the
 * tree, both existing, unmodified modules.
 *
 * All six closings are `verified-current` deal figures from
 * `content/closings.ts` (design-skill ref 06, "Closings (6) — deal figures")
 * — a curated six of the group's twelve verified closed transactions (see
 * `#stats` for the aggregate figure). Nothing here is retyped or invented.
 *
 * ── D3: RecognitionStrip mounted in the header area ─────────────────────────
 * The two CoStar 2025 ANNUAL badges sit beside `SectionHeader`, not below the
 * grid — this section's own real estate is spent on six tickets, and a
 * badge row squeezed beneath the header (StatsSection's placement for the
 * THREE quarterly banners) would either compete with the grid for the fit-
 * viewport budget or force `RecognitionStrip` down among the tickets, which
 * the task brief doesn't ask for and would read as decorating a ticket
 * rather than a section-level credential. `#stats`' `QuarterlyBanners` and
 * this section's `RecognitionStrip` are two different sections entirely, so
 * "spread apart... neither moment congested" (task brief) is satisfied by
 * section separation alone — no extra spacing trick needed here.
 *
 * ── D6 density pass (2026-08-09) ─────────────────────────────────────────
 * `section-pad` → `section-pad-tight` + `section-join` + `section-fit`.
 * `section-join` is correct here: `#closings`' real preceding sibling in
 * `app/page.tsx` is `<StatsSection />`, whose own root carries
 * `surface-paper` (verified by reading StatsSection.tsx directly) — the
 * SAME surface this section has always used, so the two share one gutter
 * instead of stacking two (ref 03 "Global rhythm"). `#closings`' following
 * sibling, `<ListingsSection />`, is `surface-deep` (verified by reading
 * ListingsSection.tsx) — a different surface, so `section-join` only
 * applies going INTO this section, never out of it, which is exactly what
 * the utility does (it only ever zeroes `padding-block-start`).
 * `lg:flex lg:flex-col lg:justify-center` centres the grid when it is
 * shorter than the fit-viewport floor, the same pattern `StatsSection` /
 * `ListingsSection` / `TeamSection` / `MandatesSection` / `FaqSection` /
 * `DoorsSection` already ship. In practice six tickets in a 3-up `lg` grid
 * (two full rows) almost certainly exceed one screen at typical laptop
 * heights — `ListingsSection`'s own header comment reasons through the
 * identical case for five tickets — so `justify-center` degrades to a
 * no-op and the section falls back to ordinary top-down flow with native
 * page scroll, never a hijacked internal scroll-well (ref 05 reserves that
 * for content that MUST fit a fixed region, not "a grid that's merely
 * tall"). Grid rhythm (`mt-*`, `gap-*`) now matches `ListingsSection`'s own
 * D6 numbers exactly, so the two sibling ticket grids step at the same
 * points rather than one compressing earlier than the other.
 *
 * ── D8 typography ────────────────────────────────────────────────────────
 * No headline-size change — `SectionHeader`'s default `display2` step plus
 * its existing one-word italic accent ("*six*") already carries this
 * section's hierarchy. D8's amplification for `#closings` lives inside
 * `Ticket`'s structured metrics grid (tiny-caps labels over bold mono
 * values) rather than in the section chrome, same reasoning
 * `ListingsSection` already recorded for its own header.
 */

import { closings } from "@/content/closings";
import ClosingCard from "@/components/cards/ClosingCard";
import { RecognitionStrip } from "@/components/awards/RecognitionStrip";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function ClosingsSection() {
  return (
    <section
      id="closings"
      aria-labelledby="closings-heading"
      className="surface-paper section-pad-tight section-join section-fit lg:flex lg:flex-col lg:justify-center"
    >
      <div className="container-hk">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <SectionHeader
            id="closings-heading"
            index="01"
            label="Track record"
            headline={{
              before: "12 closed transactions — ",
              accent: "six",
              after: " shown in full.",
            }}
            className="lg:max-w-2xl"
          />

          <RecognitionStrip className="lg:shrink-0 lg:pb-1" />
        </div>

        <Reveal
          as="ul"
          stagger
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6 print:grid-cols-1 print:gap-6"
        >
          {closings.map((closing) => (
            <RevealItem key={closing.name} as="li" className="print:break-inside-avoid">
              <ClosingCard closing={closing} className="h-full" />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// Default retained for existing call sites; the named export above is canonical.
export default ClosingsSection;
