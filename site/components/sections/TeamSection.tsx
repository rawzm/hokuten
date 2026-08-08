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
    <section id="team" aria-labelledby="team-heading" className="surface-paper section-pad">
      <div className="container-hk">
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
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {principals.map((member) => (
            <RevealItem key={member.name} as="li">
              <TeamCard member={member} />
            </RevealItem>
          ))}
        </Reveal>

        {/* Operations — lighter treatment, own Reveal, outside the stagger group. */}
        {operations ? (
          <Reveal delay={0.1} className="hairline-t mt-16 pt-10">
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
