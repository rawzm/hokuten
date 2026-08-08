/**
 * components/sections/BrandsSection.tsx — `#brands` franchise-flag marquee
 * (ref 04 §`#brands`; ref 01 "Motif system"; ref 08.4 trademark rules; full
 * rationale in docs/design/specs/brands.md). Server Component — zero
 * JavaScript, same as `motion/Marquee.tsx` itself.
 *
 * Content is 100% `@/content/brands` (which re-exports `TRADEMARK_MICROCOPY`
 * from `@/content/compliance` unmodified) — this file never retypes a name or
 * the trademark disclaimer (content law, AGENT-BRIEF.md).
 *
 * `docs/design/LOGO-MANIFEST.md` records the researched, dated decision that
 * zero franchise-mark vectors ship in Phase 1: none of the nine has a
 * free-licensed, type-only, current logo, so every mark below renders as a
 * brand NAME set in Hokuten's own typography — grayscale, uniform optical
 * height, never colorized, never linked (a link would imply a relationship
 * ref 01 forbids). See `content/brands.ts`'s header comment for the full
 * per-mark audit; that reasoning is not repeated here.
 *
 * No `SectionHeader` here — the one deliberate exception to the sitewide
 * section-shell shape. Ref 04 gives `#brands` only a micro-label + trademark
 * microcopy (never a Display-2 headline, unlike `#closings`/`#mandates`), and
 * this is the single most explicit compliance-P0 section in the brief: the
 * framing itself ("flags we transact across," never "partners"/"clients") IS
 * the legal control. Inventing new headline copy here — even something
 * innocuous — reopens exactly the claim-drafting risk `BRANDS_MICRO_LABEL`
 * exists to close off, so rendered text stays limited to the two vetted
 * constants plus the names themselves. See docs/design/specs/brands.md
 * "Component plan" for the full reasoning.
 */

import {
  BRANDS_MICRO_LABEL,
  INDEPENDENTS_MARK,
  TRADEMARK_MICROCOPY,
  franchiseFlags,
} from "@/content/brands";
import { Marquee } from "@/components/motion/Marquee";

/**
 * Every mark — the nine franchise names and "& independents" — shares one
 * treatment: `text-heading` clamps 22px (mobile floor) → 28px (desktop
 * ceiling), matching ref 04's "~28px desktop / 22px mobile" exactly, so no
 * arbitrary size is introduced. `uppercase` is load-bearing for "uniform
 * optical height," not just style — capitalizing removes the
 * ascender/descender variance between names (no "y" tail, no "h" ascender
 * difference) so the row sits level the way a real logo row would.
 * Tracking is `tracking-brand` (changed 2026-08-08, coherence audit). The
 * typography program allows exactly TWO tracked-caps flavours: `brand-line`
 * (Inter caps 0.35em) and `micro-label` (MONO caps 0.14em). The previous
 * combination here — Inter caps at 0.14em — belonged to neither and was a
 * third flavour, at 28px the most conspicuous tracked-caps run on the page.
 * `brand-line`'s own utility class is not used because it hard-sets
 * `color: var(--accent-text)`, which would colorize marks that ref 01 requires
 * stay grayscale; the flavour is adopted via its face + tracking tokens with
 * `text-fg-meta` kept. Weight stays Inter 500, matching `brand-line`.
 */
const FLAG_MARK_CLASS =
  "shrink-0 whitespace-nowrap text-heading font-sans font-medium uppercase tracking-brand text-fg-meta";

export function BrandsSection() {
  return (
    <section
      id="brands"
      aria-labelledby="brands-heading"
      // NOT `section-pad` (changed 2026-08-08, coherence audit). `section-pad`
      // is the CHAPTER rhythm (clamp 64–160px), and at 1440px it put ~147px
      // above and below a 28px logo row — a ~10:1 void-to-content ratio that
      // reads as an accidentally empty screen rather than as air, and gave a
      // quiet familiarity strip the same vertical claim as `#closings`. Ref 04
      // calls this a "band"; ref 03's density rule is one idea per screen.
      // 56/80px is band rhythm on the same base-8 scale.
      className="surface-paper hairline-t hairline-b py-14 lg:py-20"
    >
      <div className="container-hk flex flex-col items-center gap-8 text-center md:gap-10">
        {/*
          BRANDS_MICRO_LABEL ships as the fully-composed string
          "[ FLAGS WE TRANSACT ACROSS ]" — MicroLabel (the atom) instead
          composes its OWN brackets around word-only children, so routing this
          constant through that atom would double-bracket it. Rendering the
          frozen string verbatim in a plain heading (the same technique
          app/page.tsx's scaffold already uses for a bracketed label) imports
          it byte-exact with no derivation logic to get wrong. This is a real
          <h2> — it still contributes to the page's heading outline even
          though, visually, it is only a small-caps eyebrow.
        */}
        <h2 id="brands-heading" className="micro-label">
          {BRANDS_MICRO_LABEL}
        </h2>

        <Marquee
          speed="brands"
          label="Franchise flags we transact across"
          trackClassName="gap-8 md:gap-12"
        >
          {franchiseFlags.map((flag) => (
            <span key={flag.name} className={FLAG_MARK_CLASS}>
              {flag.name}
            </span>
          ))}
          <span className={FLAG_MARK_CLASS}>{INDEPENDENTS_MARK}</span>
        </Marquee>

        <p className="max-w-[60ch] text-micro text-fg-meta">{TRADEMARK_MICROCOPY}</p>
      </div>
    </section>
  );
}
