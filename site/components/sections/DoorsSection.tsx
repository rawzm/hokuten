/**
 * components/sections/DoorsSection.tsx — `#doors`, The Owner / The Investor
 * split panel.
 *
 * Governed by hokuten-design-director ref 04 (`#doors`), ref 05 (Reveals),
 * ref 06 (Voice, evidence gate) and docs/design/specs/doors.md — read that
 * file for the full IA/states/motion rationale, and in particular for why the
 * section headline is a short original line (content-law analysis) and why
 * the panel row does NOT use `Reveal`'s `stagger` mode (equal-weight
 * rationale — the two choices are peers, not a sequence, so nothing about
 * this rebuild changes that: both panels still reveal together as one unit).
 *
 * Server Component — ships no client JS of its own; `Reveal` is the only
 * client boundary in the tree, and it's an existing, unmodified module.
 *
 * Every door promise is `@/content/doors` verbatim — this file never retypes
 * a headline, a body sentence, or a CTA label (content law, AGENT-BRIEF.md).
 * `doors` is a fixed 2-item array (Owner at [0], Investor at [1] — the
 * content module's own order, matching ref 04's section title "The Owner /
 * The Investor"); this file relies on that fixed shape rather than treating
 * it as an arbitrary-length list.
 *
 * Exported both ways (named + default) since sibling section files in this
 * same build wave disagree on convention (`ClosingsSection` default-exports,
 * `FaqSection` named-exports) — whichever the page-assembly agent expects,
 * this file satisfies it.
 *
 * ── 2026-08-10 — a true left/right decision screen (docs/DESIGN-REVISIT-2.md
 * §5.6, D9/D10/D20) ─────────────────────────────────────────────────────────
 * This was named directly in the round's brief as "the section that most
 * obviously wastes the width today" — a 1200px-capped `container-hk` holding
 * two columns of plain, modestly-padded prose. The fix is spatial, not a
 * content rewrite (every string below is unchanged from the prior pass):
 *
 *   · Chassis: `container-hk` → `stage-shell` (D9, no max-width, fluid
 *     gutter); `section-fit` → `page-panel` (D10, the class the route-level
 *     snap rule targets) plus the same `lg:flex-1` distribution wrapper
 *     `StatsSection`/`MethodSection` already ship, so the header row and the
 *     door row split the usable screen instead of stacking at the top.
 *   · The two-column row itself keeps its original skeleton — `flex-col` on
 *     mobile, `md:flex-row md:items-stretch` with a thin hairline divider
 *     between two `flex-1` children (ref 04: "Equal visual weight; hairline
 *     divider" — kept literally, not replaced with a bordered-card motif that
 *     ref 04 never asked for) — but the row now takes `lg:flex-1` so it fills
 *     the panel's remaining height, and each `DoorPanel` is a real vertical
 *     stack (`flex h-full flex-col`) with its CTA row pinned to the bottom
 *     via `mt-auto`. That is what "enlarges" the two choices: real height,
 *     not bigger type past what D20 already assigns this content.
 *   · Each panel gains one quiet, decorative Lucide glyph (`Building2` for
 *     the Owner, `Users` for the Investor) above its micro-label — a visual
 *     anchor with zero informational payload (`aria-hidden`), sized modestly
 *     (ref 07: decorative art needs no adjacent description because it adds
 *     no information a sighted user has that a screen-reader user doesn't).
 *   · Typography is UNCHANGED from D20's own assignment for this content:
 *     `text-heading` is already the "Heading/value" tier (D20 table: "Fraunces
 *     for names"), so the panel headline does not escalate past it — the
 *     brief is explicit that D20 caps a section at four sizes and that this
 *     round is spatial, not a hierarchy rewrite. `AccentRule` widens
 *     `sm` → `md` as the one modest typographic gesture, matching the extra
 *     room the rest of the panel now claims.
 *
 * ── Design revisit 1, 2026-08-08 (D6 density / D8 hierarchy) — superseded
 *    bits struck, rest still holds ─────────────────────────────────────────
 * `section-fit` (now `page-panel`, see above) targets one screen on desktop.
 * No `section-join`: this section's neighbours in `page.tsx` (`#method`,
 * `#mandates`) are both `.surface-dark` while this is `.surface-paper`, so
 * every adjacent pair alternates surface and none qualifies for the shared-
 * gutter treatment. Panel headline stays `font-normal` (D8: Fraunces may firm
 * up 300→500 for contrast, but this file's own headline hierarchy note above
 * explains why `text-heading` at its existing weight is the correct D20 tier
 * as-is) so the two door titles read as a clear secondary step under the
 * section's own Display-2 headline, which stays the one dominant focal step
 * by size alone.
 */

import { ArrowUpRight, Building2, Users } from "lucide-react";

import { doors, type Door } from "@/content/doors";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { AccentRule } from "@/components/atoms/AccentRule";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

const [ownerDoor, investorDoor] = doors;

function DoorPanel({ door, primary }: { door: Door; primary: boolean }) {
  const Icon = primary ? Building2 : Users;

  return (
    <div className="flex flex-col lg:h-full lg:flex-1">
      <Icon aria-hidden="true" strokeWidth={1.25} className="size-8 text-accent-text lg:size-9" />

      {/* Word-only, deliberately. `door.index` ("01" / "02") is a LOCAL
          enumeration of the two panels, but the bracketed device is the
          page's ONE numbered chapter run — rendering `[ 01 — THE OWNER ]`
          three sections below `[ 01 — TRACK RECORD ]` reset the count
          mid-page and made the whole index read as decoration. The section's
          own header carries `05`; the panels carry names. `door.index` stays
          in content/doors.ts for a future standalone route. */}
      <MicroLabel as="p" className="mt-6">
        {door.label}
      </MicroLabel>

      <h3 className="mt-4 font-display font-normal text-heading">{door.headline}</h3>
      <AccentRule width="md" className="mt-4" />

      <p className="mt-5 max-w-[46ch] text-body-lg text-fg-muted">{door.body}</p>

      <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-auto lg:pt-8">
        <Button asChild variant={primary ? "primary" : "ghost"} size="lg">
          <a href={door.cta.href}>{door.cta.label}</a>
        </Button>

        {door.secondaryCta ? (
          <Button asChild variant="link">
            <a
              href={door.secondaryCta.href}
              {...(door.secondaryCta.external
                ? { target: "_blank", rel: "noopener" }
                : {})}
            >
              {door.secondaryCta.label}
              {door.secondaryCta.external ? (
                <>
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  <span className="visually-hidden"> (opens in new tab)</span>
                </>
              ) : null}
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function DoorsSection() {
  return (
    <section
      id="doors"
      aria-labelledby="doors-heading"
      className="surface-paper page-panel section-pad-tight relative lg:flex lg:flex-col"
    >
      <div className="stage-shell flex flex-col gap-10 lg:flex-1 lg:justify-between lg:gap-12">
        <Reveal>
          <SectionHeader
            id="doors-heading"
            index="05"
            label="The Owner / The Investor"
            headline="Two doors, one *house*."
          />
        </Reveal>

        <Reveal
          delay={0.1}
          className="flex flex-col md:flex-row md:items-stretch lg:flex-1"
        >
          <DoorPanel door={ownerDoor} primary />

          <div
            aria-hidden="true"
            className="my-10 h-px w-full bg-hairline md:my-0 md:h-auto md:w-px md:mx-[clamp(2rem,4vw,5rem)]"
          />

          <DoorPanel door={investorDoor} primary={false} />
        </Reveal>
      </div>
    </section>
  );
}

export default DoorsSection;
