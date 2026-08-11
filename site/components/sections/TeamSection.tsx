/**
 * components/sections/TeamSection.tsx — `#team`, The Principals.
 *
 * Governed by hokuten-design-director ref 04 (`#team`), ref 05 (Reveals →
 * stagger cap of 6), ref 06 (Team bios, evidence gate, Dino's CA DRE), ref 07
 * (contact-row P0s) and docs/design/specs/team.md — read that file for the
 * full IA/states/motion rationale before changing this one.
 *
 * Server Component — ships no client JS of its own; `Reveal`, and
 * `TeamCard`'s nested `PhotoFrame`/`CopyButton`, are the only client
 * boundaries in the tree, all existing and unmodified.
 *
 * `content/team.ts` ships four rows: the three principals (Dino, Razim,
 * William) and a fourth combined "Jae Hun Jeong & Donna Grace Yangyang" /
 * "Operations" row — ref 04: "Jae & Donna listed together under
 * 'Operations', a lighter treatment than the three principals." That fourth
 * row is deliberately NOT rendered through `TeamCard` (no portrait/glyph
 * plate, no card border, no `p-6` chassis) — it renders as a quiet
 * hairline-divided block below the 3-up grid, matching the DoorsSection
 * precedent of a section composing its own lighter-weight local block rather
 * than overloading a card component with a variant prop for a one-off shape.
 * See docs/design/specs/team.md → "Operations is not a TeamCard variant".
 *
 * ── D6 density pass (2026-08-08/09) ─────────────────────────────────────
 * `section-fit` (desktop-only min-height) + `lg:flex lg:flex-col
 * lg:justify-center` centres the whole content block when it's shorter than
 * the fit-viewport floor — the same pattern `MethodSection` already ships.
 * When the roster genuinely runs taller than the floor (long bios, narrow
 * viewport), `justify-center` is a no-op against a flex container with no
 * free space, so nothing clips — it degrades to ordinary top-down flow.
 * `#team` sits between `#mandates` (`surface-dark`) and `#faq`
 * (`surface-paper`) — different surface above, so this section keeps its
 * own full gutter rather than a `section-join`; `#faq` is the one that
 * joins onto it (see FaqSection.tsx). Header-to-content and grid gaps
 * compress at `lg:` only — mobile keeps the original values, per D6
 * ("do not compress below lg").
 *
 * ── D8 typography pass ───────────────────────────────────────────────────
 * No change here beyond spacing: the section's one focal step is still
 * `SectionHeader`'s Display-2 headline. The hierarchy work for this section
 * lives inside `TeamCard` (name weight, role voice) — see that file's header.
 *
 * ── Design Revisit 2 (2026-08-10, D9/D10/D20, §5.6) — chassis swap, spatial
 *    only ─────────────────────────────────────────────────────────────────
 * `container-hk` (1200px cap) → `stage-shell` (D9: full-width, fluid
 * gutter). `section-fit` → `page-panel` (identical `min-height:
 * var(--screen-fit)` mechanism — the panel fills the usable viewport height
 * and centres/distributes its content, so the page still reads as one of
 * twelve deliberate screens; if the roster ever grows past one usable
 * screen, the panel simply grows and the document scrolls through it). The
 * `lg:flex-1 lg:justify-center` split (outer `<section>` flex host, inner
 * `stage-shell` the one growing/centred child) matches the pattern
 * `StatsSection.tsx` already established this wave.
 *
 * D22 note (2026-08-10): scroll snap is gone — the route-scoped mandatory
 * snap rule in `globals.css` and `components/motion/PagedMode.tsx` are both
 * deleted, so scrolling on the landing route is entirely natural. This
 * section no longer "participates in a paged mode"; it never depended on
 * snap for anything beyond the `min-height` behaviour described above, which
 * is unchanged.
 *
 * `section-pad` → `section-pad-tight`: NOT the surface-adjacency reason
 * (unchanged — `#mandates` above is still `.surface-dark`, so no
 * `section-join` applies here), but the OTHER documented reason
 * `globals.css` gives that utility: "sections that carry a lot of content"
 * (its own example is the calculator). Three cards plus an Operations block
 * is exactly that, and the tighter gutter is what keeps the section inside
 * one usable screen now that `TeamCard` flips to a landscape row at `lg:`
 * (see `TeamCard.tsx`'s own header for why the card shape had to change
 * before "use the width" could mean anything at `stage-shell` widths
 * without the portrait becoming absurd).
 *
 * `Reveal as="ul"` gains `role="list"`: `ol`/`ul` lose their implicit list
 * semantics under VoiceOver once Tailwind's preflight sets `list-style:
 * none` on them (confirmed in `node_modules/tailwindcss/preflight.css`) —
 * the same defensive `role="list"` `StatsSection.tsx` already carries on
 * its own `Reveal as="ul"`, applied here for the same reason, not because
 * anything about the grid itself changed.
 */

import { team } from "@/content/team";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { TeamCard } from "@/components/cards/TeamCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

/** Ref 04 order: three principal cards, then Jae & Donna's combined row. */
const principals = team.slice(0, 3);
const operations = team[3];

export function TeamSection() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="surface-paper section-pad-tight page-panel lg:flex lg:flex-col"
    >
      <div className="stage-shell flex flex-col gap-10 lg:flex-1 lg:justify-center lg:gap-8">
        <Reveal>
          <SectionHeader
            id="team-heading"
            index="07"
            label="The principals"
            headline="Named people, not a *desk*."
          />
        </Reveal>

        <Reveal
          as="ul"
          stagger
          role="list"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {principals.map((member) => (
            <RevealItem key={member.name} as="li">
              <TeamCard member={member} />
            </RevealItem>
          ))}
        </Reveal>

        {/* Operations — lighter treatment, own Reveal, outside the stagger group. */}
        {operations ? (
          <Reveal delay={0.1} className="hairline-t pt-8">
            <MicroLabel as="p" className="mb-4">
              Operations
            </MicroLabel>
            <h3 className="font-display font-light text-body-lg text-fg">{operations.name}</h3>
            <p className="mt-2 max-w-[62ch] text-body text-fg-muted">{operations.bio}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
