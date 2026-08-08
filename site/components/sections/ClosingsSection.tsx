/**
 * components/sections/ClosingsSection.tsx — `#closings`, the track record.
 *
 * Governed by hokuten-design-director ref 04 (`#closings`), ref 05 (Reveals →
 * stagger cap of 6), ref 06 (Voice, evidence gate) and
 * docs/design/specs/closings.md — read that file for the full IA/states/motion
 * rationale before changing this one.
 *
 * Server Component — ships no client JS of its own; `Reveal` and
 * `ClosingCard`'s nested `PhotoFrame` are the only client boundaries in the
 * tree, and both are existing, unmodified modules.
 *
 * All six closings are `verified-current` deal figures from
 * `content/closings.ts` (design-skill ref 06, "Closings (6) — deal figures")
 * — a curated six of the group's twelve verified closed transactions (see
 * `#stats` for the aggregate figure). Nothing here is retyped or invented.
 */

import { closings } from "@/content/closings";
import ClosingCard from "@/components/cards/ClosingCard";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export default function ClosingsSection() {
  return (
    <section id="closings" aria-labelledby="closings-heading" className="surface-paper section-pad">
      <div className="container-hk">
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
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-1 print:gap-6"
        >
          {closings.map((closing) => (
            <RevealItem key={closing.name} as="li" className="print:break-inside-avoid">
              <ClosingCard closing={closing} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
