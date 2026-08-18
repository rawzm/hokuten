/**
 * components/sections/ClosingsSection.tsx — `#closings` [ 01 ], the track
 * record.
 *
 * Governed by docs/DESIGN-REVISIT-2.md D9 (stage-shell), D10 (page-panel +
 * native snap), D13 + §5.3 (this file's own composition spec — landscape
 * ticket grid, recognition-strip removal), D20 (hierarchy), and the carried-
 * forward hokuten-design-director ref 04 (`#closings`), ref 05 (Reveals →
 * stagger cap of 6), ref 06 (Voice, evidence gate). `#closings` is the
 * canonical section [ 01 ] in the numbered micro-label sequence `01
 * #closings … 09 #mandates` (re-sequenced 2026-08-17,
 * docs/LAUNCH-IMPLEMENTATION.md §3.2) — that index is load-bearing, not
 * cosmetic; keep it.
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
 * ── THIS WAVE (Design Revisit 2, 2026-08-10) — what changed and why ────────
 *
 * The old quarterly/annual award-badge strip that Revisit 1 (D3) split
 * across two sections is gone from this one, full stop. D12 explicitly
 * supersedes that split placement: all five verified CoStar awards now
 * render exactly once, inside `#stats`, and nowhere else on the landing
 * page — its component file is deleted this round (StatsSection/
 * QuarterlyBanners' own file headers confirm this, dated 2026-08-10). This
 * file never imported it as a live dependency in the first place; the
 * previous revision of this doc comment only *described* that now-dead
 * layout in prose. That description is rewritten below rather than carried
 * forward, and this file is grep-clean of any reference to the deleted
 * component or to CoStar, satisfying ref 07's audit gate on both counts —
 * see that reference for the exact grep this section must keep passing.
 *
 * Chassis swap, matching the pattern `StatsSection`/`ListingsSection` already
 * landed this round: `container-hk` (max-width 1200px) → `stage-shell` (D9:
 * full-width, fluid gutter, no cap — the six tickets gain real width instead
 * of being throttled to an editorial column); `section-fit` → `page-panel`
 * (`min-height: var(--screen-fit)` — the panel fills the usable viewport
 * height and centres/distributes its content, so the page still reads as one
 * of twelve deliberate screens). `lg:flex lg:flex-col lg:justify-center` is
 * unchanged from before — it vertically centres the header+grid block inside
 * the panel's usable height when there is slack, and degrades to ordinary
 * top-down flow (no centring, no clipping) when there isn't, exactly the
 * D10 §3.2 contract for a panel whose truthful content exceeds one screen.
 *
 * D22 note (2026-08-10): scroll snap is gone — `globals.css`'s mandatory
 * snap rule and `components/motion/PagedMode.tsx` are both deleted, so
 * scrolling on the landing route is now entirely natural. `page-panel`'s
 * `min-height` mechanism above is unaffected by that removal and still does
 * the load-bearing layout work described here; only the snap targeting that
 * used to key off the same class is gone.
 *
 * Header wrapper simplified: the previous revision wrapped `SectionHeader`
 * in a `flex lg:flex-row lg:justify-between` row with no second child — dead
 * layout code that never had anything to justify against. §5.3 asks for "a
 * compact section header above" the grid, so `SectionHeader` now renders
 * directly with no pointless wrapper, and its `lg:max-w-2xl` cap is dropped
 * too: `stage-shell` gives the header its own full-width room and the
 * headline is short enough to hold one line at that width without help. (It
 * held one line before at an even NARROWER 672px `max-w-2xl` inside
 * `container-hk`'s ~1100px content box — removing the cap can only ever gain
 * width, never lose it, so the one-line read is unaffected.)
 *
 * ── §5.3 acceptance vs. the real fixed geometry — read before touching
 *    spacing values below ───────────────────────────────────────────────────
 * §5.3's own budget note: "Six tickets MUST fit at 1440×900 without internal
 * or horizontal scrolling — the usable panel height is 784px there, so
 * budget roughly 350px per row including the header." That figure is
 * consistent with `Ticket.tsx`'s OWN fixed per-slot reservations at the
 * `lg:` landscape breakpoint (title `min-h-[2.4em]`, meta `min-h-[3.2em]`,
 * price `min-h-[3.25rem]`, metrics `min-h-24`, `lg:p-7` padding) — those sum
 * to a real, content-independent floor of ~342px per ticket row (see
 * `ClosingCard.tsx`'s "why no serial" note for the full arithmetic), which
 * is why this file omits `serial` entirely rather than treating it as a
 * cosmetic option: that extra ~23px/ticket genuinely does not fit the
 * budget on top of the ~342px floor Ticket already spends per row.
 * Even so, the honest total does not quite close: two ticket rows (~685px)
 * + `SectionHeader`'s own minimum footprint (a one-line `display2` headline
 * plus its micro-label, ~90px, un-shrinkable — `SectionHeader`'s `size`
 * prop only offers `display1`/`display2`, both large, and this file does
 * not own that component) + `section-pad-tight`'s fixed non-zero bottom
 * padding (this section's `section-join` neighbour relationship only zeroes
 * the TOP half of that utility, per its own contract) land close to, and by
 * hand-calculation slightly over, the 784px budget — even with the tightest
 * defensible `mt-*`/`gap-*` values below. This is flagged precisely in this
 * agent's return value as a real, disclosed tension between §5.3's stated
 * pixel budget and `Ticket.tsx`'s fixed reservations (a file this agent is
 * explicitly not permitted to edit), not silently claimed as solved. If it
 * measures tall in the mandatory screenshot QA pass, the fallback is
 * `page-panel`'s own `min-height` (never `height`) mechanism: the panel
 * grows and the document scrolls through it rather than clipping a ticket,
 * which is a real, working degrade path — just not this section's OWN
 * stricter "no scroll at 1440×900" line. (D22 note: since scroll snap is
 * gone, this was already how the page scrolled — no separate `PagedMode`
 * `data-tall` measurement is involved; that mechanism is deleted.)
 *
 * ── LAUNCH 2026-08-17 (docs/LAUNCH-IMPLEMENTATION.md §3.4, Appendix B4) ─────
 * Two verbatim strings are added and NOTHING in the six records changes — no
 * card is pulled (Renaissance Reno stays, D4), no figure is "corrected" (the
 * register that would authorise a correction was never delivered, D17/X10).
 *   • A deal-team credit renders beneath two of the six tickets, from
 *     `content/closings.ts`'s `dealTeamCredits`. Beneath, not inside: the
 *     card's own meta slot is `line-clamp-2`, and `ClosingCard`/`Ticket` are
 *     not this agent's files to add a slot to (flagged in the build report).
 *     Each `<li>` becomes a `flex flex-col` so the card still stretches to
 *     the row height (`flex-1` replaces the old `h-full`, which would have
 *     made the card full-height and pushed the caption out of the cell).
 *   • The provenance fine print closes the section.
 * Fit note: both additions cost height in a section whose own budget note
 * below already runs slightly over §5.3's 784px at 1440x900. The degrade path
 * is unchanged and correct (`page-panel` is `min-height`, never `height`), and
 * neither string is a lever — both are mandated verbatim.
 *
 * ── D8/D20 typography (unchanged reasoning) ─────────────────────────────────
 * No headline-size change — `SectionHeader`'s default `display2` step plus
 * its existing one-word italic accent ("*six*") already carries this
 * section's hierarchy. The four-level ticket hierarchy (D20) lives inside
 * `Ticket` itself: micro status (the "Sold" overprint) → serif title → mono
 * money price → compact mono facts.
 */

import { closings, closingsProvenance, dealTeamCredits } from "@/content/closings";
import ClosingCard from "@/components/cards/ClosingCard";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function ClosingsSection() {
  return (
    <section
      id="closings"
      aria-labelledby="closings-heading"
      className="surface-paper section-pad-tight section-join page-panel lg:flex lg:flex-col lg:justify-center"
    >
      <div className="stage-shell">
        <SectionHeader
          id="closings-heading"
          index="01"
          label="Track record"
          headline={{
            before: "12 closed transactions — ",
            accent: "six",
            after: " shown in full.",
          }}
        />

        <Reveal
          as="ul"
          stagger
          className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-4 print:grid-cols-1 print:gap-6"
        >
          {closings.map((closing) => {
            const dealTeam = dealTeamCredits[closing.name];

            return (
              <RevealItem
                key={closing.name}
                as="li"
                className="flex flex-col print:break-inside-avoid"
              >
                <ClosingCard closing={closing} className="flex-1" />
                {/* Deal-team credit (Appendix B4), on the two cards PROFILE
                    §6 attributes to William Betancourt. It sits BENEATH the
                    ticket rather than inside it because `Ticket`'s meta slot
                    is `line-clamp-2` — see content/closings.ts's own note on
                    `dealTeamCredits` for why a truncated attribution was not
                    an acceptable alternative. Rendered as ONE plain string on
                    the `data-line` mono voice rather than through `DataLine`'s
                    `parts` variant: that variant re-emits the separator as
                    `&nbsp;·`, which would put a non-breaking space inside a
                    string the plan requires verbatim. */}
                {dealTeam ? <p className="data-line mt-2 text-fg-muted">{dealTeam}</p> : null}
              </RevealItem>
            );
          })}
        </Reveal>

        {/* Provenance fine print (Appendix B4) — verbatim, at the bottom of
            the section, qualifying all six cards at once: these are Dino
            Monteverde's transactions, some completed at prior affiliations,
            not closings of The Hokuten Group. */}
        <Reveal>
          <p className="mt-6 max-w-[92ch] font-sans text-data text-fg-muted lg:mt-5">
            {closingsProvenance}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// Default retained for existing call sites; the named export above is canonical.
export default ClosingsSection;
