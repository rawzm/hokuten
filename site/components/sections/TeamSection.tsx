/**
 * components/sections/TeamSection.tsx — screen 9 of 12, `#team`, index `07`.
 *
 * Governed by hokuten-design-director ref 04 (`#team`), ref 05 (Reveals →
 * stagger cap of 6), ref 06 (Team bios, evidence gate, licence lines) and
 * ref 07 (contact-row P0s).
 *
 * Server Component — ships no client JS of its own; `Reveal`, and the nested
 * `PhotoFrame`/`CopyButton`, are the only client boundaries in the tree.
 *
 * ── The six-seat roster (LAUNCH-IMPLEMENTATION §3.9, P8/F26, R7/D6) ─────────
 * `content/team.ts` ships six seats split by a `featured` flag, and this file
 * renders the two shapes that split implies:
 *
 *   • **Featured** (Dino Monteverde, Mohamed Razim Meeran, William Betancourt)
 *     — the 3-up `TeamCard` grid: portrait, bio, licence line, contact row.
 *   • **Roster** (Donna Yangyang, Jae Hun Jeong, Marlon Guzman) — a compact
 *     row of name / title / headshot, plus a ≤45-word short bio where one has
 *     been supplied (Donna's, today). `FINAL` lines 38-41 locked "3 team
 *     members with bios … other team members: can add later"; `V2` §6 then
 *     named all six. R7/D6 reconciles them exactly this way — the other three
 *     are rendered compactly, neither omitted nor linked out.
 *
 * The roster row is composed HERE rather than as a `TeamCard` variant prop —
 * the same call this section already made for the old Operations block, and
 * the same one `DoorsSection`/`MandatesSection` make: a section composes its
 * own lighter-weight local shape rather than teaching a card component a
 * variant it only half fits. `TeamCard` and this block share the two things
 * that actually have to agree — `seatPortrait()` (the G8 approval gate) and
 * `GlyphPlate` (the no-portrait box) — by import, not by duplication.
 *
 * **Portraits render at ONE CSS aspect** (`4/5`) in both shapes, on the
 * `object-fit: cover` PhotoFrame, so the grid is even even though the canonical
 * masters are not one aspect (Jae Hun's is 0.750, the rest 0.800).
 *
 * **`TEAM_ROUTING` names Dino Monteverde as the destination** for the seats
 * with no direct contact field — the outreach kit's approved wording, never
 * softened to "the team". It renders once, under the roster block, because the
 * roster seats are the ones it describes.
 *
 * **Recruiting card:** removed and stays removed (`FINAL` Change 4 — "Do
 * not replace with anything").
 *
 * **Micro-label is "The team", not "The principals" (2026-08-17).** Three of
 * the six seats are founding team members (Dino Monteverde, William
 * Betancourt, Mohamed Razim Meeran) and three are support seats; `V2` §6 is
 * explicit that "no other team member is described as a founder, founding
 * partner, or founding team member" (plan §3.9). A kicker reading "The
 * principals" over a six-seat block extends a standing to seats that do not
 * hold it, so the label states the neutral fact instead. Do not restore it,
 * and do not substitute another standing word ("partners", "founders",
 * "principals") — seat standing is carried by each seat's own `role` string
 * in `content/team.ts`, never by this heading.
 *
 * ── D6 density pass (2026-08-08/09) ─────────────────────────────────────
 * `page-panel` (desktop-only min-height) + `lg:flex lg:flex-col
 * lg:justify-center` centres the whole content block when it's shorter than
 * the fit-viewport floor — the same pattern `MethodSection` already ships.
 * When the roster genuinely runs taller than the floor (long bios, narrow
 * viewport), `justify-center` is a no-op against a flex container with no
 * free space, so nothing clips — it degrades to ordinary top-down flow.
 * Header-to-content and grid gaps compress at `lg:` only — mobile keeps the
 * original values, per D6 ("do not compress below lg").
 *
 * After the 2026-08-17 reorder (LAUNCH-IMPLEMENTATION §3.2, R5) this section
 * sits between `#bov` (`surface-deep`) and `#doors` (`surface-paper`): the
 * surface above still differs, so this section keeps its own full gutter
 * rather than a `section-join` — but `#doors` below now shares this section's
 * `surface-paper` and is the one that should join onto it (reported, not made:
 * that is a className change in `DoorsSection`, a file P8 does not own).
 *
 * ── Design Revisit 2 (2026-08-10, D9/D10/D20, §5.6) — chassis, spatial only ─
 * `container-hk` (1200px cap) → `stage-shell` (D9: full-width, fluid gutter).
 * `section-fit` → `page-panel` (identical `min-height: var(--screen-fit)`
 * mechanism — the panel fills the usable viewport height and centres its
 * content, so the page still reads as one of twelve deliberate screens; if the
 * roster grows past one usable screen, the panel simply grows and the document
 * scrolls through it). The `lg:flex-1 lg:justify-center` split (outer
 * `<section>` flex host, inner `stage-shell` the one growing/centred child)
 * matches `StatsSection.tsx`.
 *
 * `section-pad` → `section-pad-tight`: NOT the surface-adjacency reason, but
 * the OTHER documented reason `globals.css` gives that utility — "sections
 * that carry a lot of content". Three cards plus a three-up roster block is
 * exactly that, and the tighter gutter is what keeps the section inside one
 * usable screen now that `TeamCard` flips to a landscape row at `lg:`.
 *
 * D22 note (2026-08-10): scroll snap is gone — scrolling on the landing route
 * is entirely natural. This section never depended on snap for anything beyond
 * the `min-height` behaviour described above, which is unchanged.
 *
 * `Reveal as="ul"` gains `role="list"`: `ol`/`ul` lose their implicit list
 * semantics under VoiceOver once Tailwind's preflight sets `list-style: none`
 * on them (confirmed in `node_modules/tailwindcss/preflight.css`) — the same
 * defensive `role="list"` `StatsSection.tsx` already carries, applied here for
 * the same reason.
 */

import { featuredTeam, rosterTeam, seatPortrait, TEAM_ROUTING } from "@/content/team";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { PhotoFrame } from "@/components/atoms/PhotoFrame";
import { GlyphPlate, TeamCard } from "@/components/cards/TeamCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

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
            label="The team"
            headline="Named people, not a *desk*."
          />
        </Reveal>

        <Reveal
          as="ul"
          stagger
          role="list"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {featuredTeam.map((seat) => (
            <RevealItem key={seat.name} as="li">
              <TeamCard member={seat} />
            </RevealItem>
          ))}
        </Reveal>

        {/* Roster — lighter treatment, own Reveal, outside the stagger group. */}
        {rosterTeam.length > 0 ? (
          <Reveal delay={0.1} className="hairline-t pt-8">
            <MicroLabel as="p" className="mb-6">
              Roster
            </MicroLabel>

            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {rosterTeam.map((seat) => {
                // The G8 gate again — one evaluation point, shared with TeamCard.
                const portrait = seatPortrait(seat);

                return (
                  <li key={seat.name} className="flex items-start gap-4">
                    <div className="w-20 shrink-0">
                      {portrait ? (
                        <PhotoFrame
                          src={portrait}
                          alt={seat.photoAlt ?? seat.name}
                          aspect="4/5"
                          sizes="80px"
                        />
                      ) : (
                        <GlyphPlate />
                      )}
                    </div>

                    <div className="min-w-0">
                      {/* One step below the featured card's name (`text-heading`),
                          which is what makes this read as the lighter tier. */}
                      <h3 className="font-display font-light text-body-lg text-fg">{seat.name}</h3>
                      <p className="micro-label mt-1">{seat.role}</p>
                      {seat.bioShort ? (
                        <p className="mt-2 max-w-[46ch] text-body text-fg-muted">{seat.bioShort}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 max-w-[62ch] text-body text-fg-meta">{TEAM_ROUTING}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
