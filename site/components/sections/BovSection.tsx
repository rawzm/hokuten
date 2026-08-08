/**
 * components/sections/BovSection.tsx — `#bov`, the Broker Opinion of Value request.
 *
 * Spec: design-skill reference 04 → `#bov` (surface-deep). Copy: docs/port/04-copy.md
 * §7a (chrome) and §7b (the disclaimer paragraph, verbatim).
 *
 * SERVER COMPONENT. Only <BovForm> crosses the client boundary, so the section
 * chrome, the promise line and the disclaimer cost nothing against the 180 KB
 * landing-route budget.
 *
 * TWO DECISIONS TAKEN HERE, both flagged in the build report:
 *
 * 1. The headline is NOT the source's `What's your hotel worth?`. That exact
 *    string is used twice on the source page — once in the calculator section
 *    (index.html:917) and once here (:1164) — and docs/port/04-copy.md §7a flags
 *    the duplicate as an information-architecture problem to resolve, not to
 *    port. `#calculator` keeps the question; `#bov` answers it, and the italic
 *    accent word stays `worth` so the family resemblance survives.
 *
 * 2. The 48-hour promise is IMPORTED from content/methodology.ts (`bovPromise`)
 *    rather than retyped. It is an evidence-gated service-level claim that the
 *    source stated twice in two different wordings; docs/port/04-copy.md §7 marks
 *    keeping them in sync as a P0. One export, one wording, everywhere.
 *
 * The source's `No cost, no obligation.` sentence is deliberately absent: it is a
 * commercial commitment (P1 evidence flag) and it is not exported from
 * `site/content/`. Add it to a content module and it can render here.
 *
 * The source hung `id="contact"` on the disclaimer paragraph (index.html:1211).
 * That anchor is not reproduced — content/site.ts already resolves the nav's
 * Contact entry to `#bov`, and an id on a `<p>` inside a section is the IA mess
 * docs/port/04-copy.md §7 asks to untangle.
 */

import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { BovForm } from "@/components/forms/BovForm";
import { bovPromise } from "@/content/methodology";
import { CONTACT } from "@/content/site";
import { cn } from "@/lib/utils";

const HEADING_ID = "bov-heading";

const COPY = {
  /** index.html:1163 eyebrow, verbatim. */
  microLabel: "Broker opinion of value",
  /** See decision 1 in the header note. One italic accent word: `worth`. */
  headline: { before: "What your hotel is ", accent: "worth", after: ", in writing." },
  /**
   * index.html:1211, verbatim, with the address rendered from CONTACT rather
   * than typed in. docs/port/04-copy.md §7 calls this paragraph "the best
   * existing model for HOKUTEN voice on the whole page" — it is already
   * team-first, so nothing in it changes.
   */
  disclaimer: {
    lead: "Thinking about selling your hotel, now or down the road? Most owners hesitate to inquire until they're already committed to a sale. We'd rather meet you earlier than that. Prefer email? Send the property name, location, and available T-12 / STR information to ",
    tail: ". A call is optional.",
  },
  /**
   * NET-NEW. Rendered inside <noscript> — the form is a client island, so with
   * scripting off it renders but cannot send. Saying so beats a control that
   * silently does nothing.
   */
  noscript: `Sending this form needs JavaScript. Email ${CONTACT.email} with the property name, the location, and the available T-12 / STR information.`,
} as const;

export interface BovSectionProps {
  /**
   * Bracketed micro-label index.
   *
   * ASSUMPTION, not a verified value: the indexed chapters appear to run
   * `01 TRACK RECORD` (#closings, confirmed in ref 04) → `03 METHOD` (#method,
   * confirmed in content/methodology.ts), with `#mandates` explicitly
   * unindexed — which puts `#bov` at 07 if the run is closings · listings ·
   * method · doors · team · faq · bov. The page composer owns the real
   * sequence; override it here rather than editing this file.
   */
  index?: string;
  className?: string;
}

export function BovSection({ index = "07", className }: BovSectionProps) {
  return (
    <section
      id="bov"
      aria-labelledby={HEADING_ID}
      className={cn("surface-deep section-pad", className)}
    >
      <div className="container-hk">
        <div className="grid items-start gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <Reveal>
            <SectionHeader
              id={HEADING_ID}
              index={index}
              label={COPY.microLabel}
              headline={COPY.headline}
              sub={bovPromise}
            />

            <div className="mt-12">
              <BovForm />
            </div>
          </Reveal>

          {/* Plain string child on purpose: React treats <noscript> children as
              text content, so an element child would hydrate inconsistently
              (the browser parses the tag as text when scripting is on). */}
          <noscript>{COPY.noscript}</noscript>

          {/* Pull-quote treatment: serif italic against an accent hairline, the
              source's own device (`.bov-disclaimer`, index.html:625) translated
              to tokens. Prose, never UI or data — the no-italics rule in ref 03
              governs the latter two. */}
          <Reveal delay={0.08}>
            <p className="border-l-2 border-accent pl-6 font-display text-body-lg font-light italic text-fg-muted">
              {COPY.disclaimer.lead}
              <a
                href={CONTACT.emailHref}
                className="text-accent-text underline underline-offset-4"
              >
                {CONTACT.email}
              </a>
              {COPY.disclaimer.tail}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
