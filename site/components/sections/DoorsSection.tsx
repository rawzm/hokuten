/**
 * components/sections/DoorsSection.tsx — `#doors`, The Owner / The Investor
 * split panel.
 *
 * Governed by hokuten-design-director ref 04 (`#doors`), ref 05 (Reveals),
 * ref 06 (Voice, evidence gate) and docs/design/specs/doors.md — read that
 * file for the full IA/states/motion rationale, and in particular for why the
 * section headline is a short original line (content-law analysis) and why
 * the panel row does NOT use `Reveal`'s `stagger` mode (equal-weight
 * rationale).
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
 */

import { ArrowUpRight } from "lucide-react";

import { doors, type Door } from "@/content/doors";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { AccentRule } from "@/components/atoms/AccentRule";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

const [ownerDoor, investorDoor] = doors;

function DoorPanel({ door, primary }: { door: Door; primary: boolean }) {
  return (
    <div className="flex-1">
      <MicroLabel as="p" index={door.index} className="mb-4">
        {door.label}
      </MicroLabel>

      <h3 className="font-display font-light text-heading">{door.headline}</h3>
      <AccentRule width="sm" className="mt-4" />

      <p className="mt-6 max-w-[46ch] text-body text-fg-muted">{door.body}</p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button asChild variant={primary ? "primary" : "ghost"}>
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
    <section id="doors" aria-labelledby="doors-heading" className="surface-paper section-pad">
      <div className="container-hk">
        <Reveal>
          <SectionHeader
            id="doors-heading"
            label="The Owner / The Investor"
            headline="Two doors, one *house*."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-col md:mt-16 md:flex-row md:items-stretch">
          <DoorPanel door={ownerDoor} primary />

          <div
            aria-hidden="true"
            className="my-8 h-px w-full bg-hairline md:my-0 md:mx-12 md:h-auto md:w-px"
          />

          <DoorPanel door={investorDoor} primary={false} />
        </Reveal>
      </div>
    </section>
  );
}

export default DoorsSection;
