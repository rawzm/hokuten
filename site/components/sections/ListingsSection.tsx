/**
 * components/sections/ListingsSection.tsx — `#listings`, "Hotels for sale".
 *
 * Governed by docs/design/specs/listings.md and hokuten-design-director ref 04
 * (#listings). Server Component — `Reveal` and `PhotoFrame` (inside
 * `ListingCard`) already carry the only client-side code on this page
 * (AGENT-BRIEF: push the client boundary down, don't mark a whole section
 * client for it).
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
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

/** ref 04 §#listings — no verbatim headline given; new copy in the established voice. */
const LISTINGS_HEADLINE = "On the market, handled *quietly*.";
/** ref 04 §#listings, verbatim: "Header + 'Powered by our confidential channel' subline." */
const LISTINGS_SUB = "Powered by our confidential channel.";

export function ListingsSection() {
  return (
    <section id="listings" aria-labelledby="listings-heading" className="surface-deep section-pad">
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
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {listings.map((listing) => (
              <Reveal.Item key={listing.id} as="li">
                <ListingCard listing={listing} className="h-full" />
              </Reveal.Item>
            ))}
          </Reveal>
        ) : (
          <Reveal
            as="div"
            className="surface-card hairline rounded-card mt-12 flex flex-col items-center gap-4 px-6 py-16 text-center"
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
