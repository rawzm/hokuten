/**
 * components/sections/MandatesSection.tsx — `#mandates` Capital & Standing
 * Mandates (ref 04 §`#mandates`; full rationale in
 * docs/design/specs/mandates.md). Server Component — the only client
 * boundary this section touches is the existing `motion/Reveal.tsx`, which
 * already ships its own `"use client"`.
 *
 * This is the page's SECOND dark panel (between #doors and #team) and must
 * not read as a repeat of #method: no star-grain texture, no engraved art
 * object — `#method` already owns the page's one dark-chapter art object.
 * Denser, table-like rhythm instead.
 *
 * Content is 100% `@/content/mandates` — this file never retypes a
 * mandate's headline or criteria, the deck line, the discretion line, or the
 * CTA label (content law, AGENT-BRIEF.md). Only the four mandates already
 * cleared `verified-current` in design-skill reference 06 ship; nothing here
 * may add a fifth.
 *
 * The a100 Arms reference reads as a confidential channel, never a product
 * tour: no a100 UI colours/fonts, no screenshots, no tier or match-score
 * language — just a ghost CTA to the signup URL and one line of discretion
 * copy. The CTA's `→` renders only as literal text inside mono micro-label
 * type (ref 03 Iconography: "→ allowed inside mono micro-labels only, as
 * type not icon") — never a Lucide icon.
 *
 * Not using `CardShell` for the mandate cards on purpose: that chassis
 * reserves photo/meta/badge slots and forces a `surface-card`/`surface-paper`
 * fill, built for the photo-tile shape of Listing/Closing/Team cards. A
 * mandate card has no photo, no meta line, no badge, and must sit
 * transparent on the dark surface with only a hairline border — a different
 * shape ref 04 asks for explicitly, not a duplicated primitive.
 */

import { mandates, mandatesCta, mandatesDeck, mandatesDiscretion } from "@/content/mandates";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { DataLine } from "@/components/atoms/DataLine";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

export function MandatesSection() {
  return (
    <section id="mandates" aria-labelledby="mandates-heading" className="surface-dark section-pad">
      <div className="container-hk">
        <Reveal>
          <SectionHeader
            id="mandates-heading"
            index="06"
            label="Capital & mandates"
            headline="Four mandates we are already *working*."
            sub={mandatesDeck}
          />
        </Reveal>

        <Reveal
          stagger
          delay={0.1}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16"
        >
          {mandates.map((mandate) => (
            <RevealItem
              key={mandate.headline}
              as="article"
              className="hairline flex flex-col gap-4 rounded-card p-6 sm:p-8"
            >
              <h3 className="font-display font-normal text-body-lg text-fg">
                {mandate.headline}
              </h3>
              <DataLine parts={[mandate.criteria]} className="text-fg-meta" />
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="hairline-t mt-12 flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-16">
          <Button asChild variant="ghost" size="sm">
            <a
              href={mandatesCta.href}
              {...(mandatesCta.external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
            >
              <span className="font-mono text-micro uppercase tracking-micro">
                {mandatesCta.label}
                {mandatesCta.external ? (
                  <span className="visually-hidden"> (opens in a new tab)</span>
                ) : null}
              </span>
            </a>
          </Button>

          <p className="text-micro text-fg-meta">{mandatesDiscretion}</p>
        </Reveal>
      </div>
    </section>
  );
}
