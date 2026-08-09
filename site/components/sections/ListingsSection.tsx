/**
 * components/sections/ListingsSection.tsx — `#listings`, "Hotels for sale".
 *
 * Governed by docs/design/specs/listings.md, docs/DESIGN-REVISIT.md §4.5 (D4
 * ticket cards) and hokuten-design-director ref 04 (#listings). Server
 * Component — `Reveal` and `PhotoFrame` (inside `ListingCard`/`Ticket`)
 * already carry the only client-side code on this page (AGENT-BRIEF: push
 * the client boundary down, don't mark a whole section client for it).
 *
 * ── D6 density pass (2026-08-09) ─────────────────────────────────────────
 * `section-fit` (desktop-only min-height) + `lg:flex lg:flex-col
 * lg:justify-center` centres the grid when it's shorter than the
 * fit-viewport floor — the same pattern TeamSection/MandatesSection/
 * FaqSection/DoorsSection already ship. Five tickets in a 3-up `lg` grid
 * genuinely exceed one screen at typical laptop heights; `justify-center`
 * against a flex container with no free space is then a no-op and the
 * section degrades to ordinary top-down flow with native page scroll —
 * never a hijacked internal scroll-well, which ref 05 reserves for content
 * that MUST fit inside a fixed region (calculator step 3), not for "a grid
 * that's merely tall."
 * `#listings` sits between `#closings` (`surface-paper`) and `#calculator`
 * (`surface-paper`) — this section's own `surface-deep` matches neither
 * neighbour, so `section-join` does not apply here (that utility is for two
 * ADJACENT sections sharing one surface; check the real order/surfaces in
 * app/page.tsx before reaching for it — this section did, and doesn't
 * qualify). Grid gaps/margins compress at `lg:` only, matching the D6 rule
 * of never compressing spacing below `lg`.
 *
 * ── D8 typography pass ───────────────────────────────────────────────────
 * No headline-size change here — `SectionHeader`'s default `display2` step
 * plus its one italic accent word (`*quietly*`) already carries this
 * section's hierarchy; D8's amplification for `#listings` lives inside
 * `Ticket`'s structured grid (tiny-caps labels over bold mono values) rather
 * than in the section chrome.
 *
 * ── Content gap (see spec "Content gap — flagged, not invented") ───────────
 * Ref 04 §#listings gives the sub-line "Powered by our confidential channel"
 * verbatim but `content/listings.ts` — a file this agent does not own — has no
 * export for it or for a headline. Both are authored as local constants below
 * with this citation rather than invented from nothing; the content owner
 * should promote them into `content/listings.ts` next time that file is
 * touched, matching the `content/doors.ts` / `content/mandates.ts` pattern of
 * section-chrome copy living beside its section's data.
 */

import { Lock } from "lucide-react";

import { A100_ARMS_SIGNUP_URL } from "@/content/site";
import { listings, listingsEmptyState } from "@/content/listings";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { ListingCard } from "@/components/cards/ListingCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

/** ref 04 §#listings — no verbatim headline given; new copy in the established voice. */
const LISTINGS_HEADLINE = "On the market, handled *quietly*.";
/** ref 04 §#listings, verbatim: "Header + 'Powered by our confidential channel' subline." */
const LISTINGS_SUB = "Powered by our confidential channel.";

export function ListingsSection() {
  return (
    <section
      id="listings"
      aria-labelledby="listings-heading"
      className="surface-deep section-pad section-fit lg:flex lg:flex-col lg:justify-center"
    >
      <div className="container-hk">
        <SectionHeader
          id="listings-heading"
          index="02"
          label="Hotels for sale"
          headline={LISTINGS_HEADLINE}
          sub={LISTINGS_SUB}
        />

        {listings.length > 0 ? (
          <Reveal
            as="ul"
            stagger
            // 2-up starts at `md`, not `sm` (fixed 2026-08-08, coherence
            // audit). Ref 03: "2-up only ≥640px if cards stay ≥320px wide" —
            // at a 640px viewport container-hk leaves 592px, minus the 32px
            // gap, giving 280px tiles. `md` (768px) yields 344px and matches
            // #closings and #team, so all three card grids now break at the
            // same viewport instead of one stepping early.
            className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6"
          >
            {listings.map((listing) => (
              <RevealItem key={listing.id} as="li">
                <ListingCard listing={listing} className="h-full" />
              </RevealItem>
            ))}
          </Reveal>
        ) : (
          <Reveal
            as="div"
            className="surface-card hairline rounded-card mt-10 flex flex-col items-center gap-4 px-6 py-16 text-center lg:mt-8"
          >
            <Lock aria-hidden="true" strokeWidth={1.5} className="size-6 text-fg-muted" />
            <p className="font-display text-heading text-fg max-w-[32ch]">
              {listingsEmptyState}
            </p>
            <Button asChild variant="primary">
              <a href={A100_ARMS_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
                Request invite to a100 Arms
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default ListingsSection;
