/**
 * components/sections/MandatesSection.tsx — `#mandates` Capital & Standing
 * Mandates (ref 04 §`#mandates`; full rationale in
 * docs/design/specs/mandates.md). Server Component — the only client
 * boundary this section touches is the existing `motion/Reveal.tsx`, which
 * already ships its own `"use client"`.
 *
 * This is the page's SECOND dark panel (between #doors and #team) and must
 * not read as a repeat of #method: no star-grain texture, no engraved/glyph-
 * mosaic art object, no `<KanjiAccent>` — `#method` already owns the page's
 * one dark-chapter art object and its one kanji motif. Denser, table-like
 * rhythm instead. That deliberate absence is unchanged by this pass.
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
 *
 * ── 2026-08-10 — a deliberate grid, not sparse floating copy (docs/DESIGN-
 *    REVISIT-2.md §5.6, D9/D10/D20) ────────────────────────────────────────
 * Chassis: `container-hk` → `stage-shell` (D9); `section-fit` → `page-panel`
 * (D10); `section-pad` → `section-pad-tight` (matches the sibling dark
 * chapter, `#method`, which made the same call this round for the same
 * reason — a denser rhythm buys back vertical budget). No `section-join` on
 * this section: when this was written its neighbours in `page.tsx` (`#doors`,
 * `#team`) were both `.surface-paper` while this is `.surface-dark`, so every
 * adjacent pair alternated surface and none qualified. After the 2026-08-17
 * reorder (docs/LAUNCH-IMPLEMENTATION.md §3.2, R5) this is screen 11: `#doors`
 * (`.surface-paper`) above still alternates, so nothing changes HERE — but
 * `SiteFooter` below is `.surface-dark` too, so that pair now shares a surface
 * and the join, if it is wanted, belongs on the footer (the SECOND of the
 * pair). Reported, not made: `SiteFooter.tsx` is not this portion's file.
 *
 * The grid itself: `sm:grid-cols-2` alone, inside a 1200px-capped container,
 * is what read as "sparse floating copy" — four modest cards with a lot of
 * unclaimed margin on either side at any real desktop width. `stage-shell`
 * removes the cap, so the same 2-up grid now widens to `xl:grid-cols-4` (a
 * single deliberate row of four — "four mandates" literally becomes four
 * columns) once there is enough width to hold four short cards without
 * cramming (1280px+; `lg` alone, 1024–1279px, stays 2-up so a card never
 * drops below a comfortable reading width). Card padding steps up
 * (`p-6` → `lg:p-8`) so the wider cells still read as considered, not empty.
 *
 * Each card also gains a bare mono index numeral (`01`–`04`, no brackets, no
 * "MANDATE" prefix) above the headline — the exact device `#method`'s own
 * stepper already uses for its five steps, not the bracketed
 * `[ 01 — LABEL ]` chapter-index device (`MicroLabel`'s own device), which
 * stays reserved for the page's single numbered chapter run per `#doors`'
 * file-header precedent (rendering a second bracketed "01" mid-card would
 * reset that count the same way a bracketed door sub-label would). This is
 * the D20 Micro tier the grid was previously missing entirely — a numeral,
 * a Fraunces headline (stepped to `text-heading`, D20's Heading/value tier,
 * up from the previous `text-body-lg` so it reads distinctly larger than the
 * mono criteria line beneath it), and the criteria line itself, now split on
 * its own `·` separators via `DataLine`'s `parts` variant (same device
 * `StatsSection`'s `StatDetail` helper already uses) so a long criteria
 * string wraps BETWEEN clauses, never mid-clause, at the new column widths.
 */

import { mandates, mandatesCta, mandatesDeck, mandatesDiscretion } from "@/content/mandates";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { DataLine } from "@/components/atoms/DataLine";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

/**
 * Renders a mandate's `criteria` line. `content/mandates.ts` joins each
 * card's clauses with `" · "` (middle dot) — split back on that separator and
 * hand it to `DataLine`'s `parts` variant so a narrow column wraps between
 * clauses, never mid-clause; the one card whose criteria has no `·` in it
 * falls through to `joined`, which wraps normally. Mirrors `StatsSection`'s
 * `StatDetail` helper exactly.
 */
function MandateCriteria({ criteria }: { criteria: string }) {
  const parts = criteria.split(" · ");
  return (
    <DataLine
      parts={parts}
      variant={parts.length > 1 ? "parts" : "joined"}
      className="text-fg-meta"
    />
  );
}

export function MandatesSection() {
  return (
    <section
      id="mandates"
      aria-labelledby="mandates-heading"
      className="surface-dark page-panel section-pad-tight relative lg:flex lg:flex-col"
    >
      <div className="stage-shell flex flex-col gap-10 lg:flex-1 lg:justify-between lg:gap-10">
        <Reveal>
          <SectionHeader
            id="mandates-heading"
            index="09"
            label="Capital & mandates"
            headline="Four mandates we are already *working*."
            sub={mandatesDeck}
          />
        </Reveal>

        <Reveal
          stagger
          delay={0.1}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8"
        >
          {mandates.map((mandate, i) => (
            <RevealItem
              key={mandate.headline}
              as="article"
              className="hairline flex flex-col gap-4 rounded-card p-6 lg:p-8"
            >
              <span
                className="block font-mono text-micro uppercase tracking-micro tabular text-accent-text"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display font-medium text-heading text-fg">
                {mandate.headline}
              </h3>
              <MandateCriteria criteria={mandate.criteria} />
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="hairline-t flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between lg:pt-8">
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
