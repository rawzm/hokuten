/**
 * components/sections/BrandsSection.tsx — `#brands` franchise-flag marquee.
 * Governed by docs/DESIGN-REVISIT.md §2 D2 + §3.7 (2026-08-08/09), ref 04
 * `#brands`, ref 01 "Motif system", ref 08.4 trademark rules.
 *
 * Server Component — zero JavaScript, same as `motion/Marquee.tsx` itself.
 * This row sits inside the hero's FIRST viewport (D2 closes the hero on it),
 * so it shares the hero's ≤200KB gzip critical-path budget (D7): no
 * `Reveal`, no interactivity, no client boundary of any kind.
 *
 * Content is 100% `@/content/brands` (which re-exports `TRADEMARK_MICROCOPY`
 * from `@/content/compliance` unmodified) — this file never retypes a name,
 * a label, or the trademark disclaimer.
 *
 * ── D2: real chips, in colour ────────────────────────────────────────────
 * Supersedes the prior "every mark set in Hokuten's own typography,
 * grayscale, uniform ~28px optical height" treatment — `content/brands.ts`'s
 * header comment carries the full, dated reasoning for that supersession
 * (including why the original per-mark licence audit no longer controls);
 * not repeated here. Each of the 15 shipped flags now renders as Razim's own
 * 3D glass-squircle chip rendering, `public/logos/<slug>.png` (208x208,
 * pre-normalized so the row sits optically even — scripts/brand-chips.ts),
 * ALREADY in colour: no grayscale filter, no hover colorize, no coloured
 * backing chip. That dimensionality (baked gloss edge + soft cast shadow) is
 * the point of D2 — flattening any of it would undo the treatment.
 *
 * Two flags (Radisson, Choice Hotels) are evidenced in closed deals but have
 * no chip asset yet. `content/brands.ts` tracks them in `FLAGS_AWAITING_CHIP`,
 * deliberately outside `franchiseFlags` — this file does not import that
 * export, so there is nothing to accidentally render for either. A text-only
 * fallback for two names in an otherwise all-image row would read as broken
 * (dimensional chips + flat text = looks like an error, not a choice). A
 * sixteenth supplied chip, `_hold-amber-mark`, is unidentified and held out
 * the same way at the content layer — not in `franchiseFlags`, so it is
 * structurally impossible for this component to render it.
 *
 * No `SectionHeader` here — same deliberate exception as the pre-D2 version.
 * Ref 04 gives `#brands` only a micro-label + trademark microcopy, never a
 * Display-2 headline: the framing itself ("flags we transact across," never
 * "partners"/"clients") IS the legal control, and inventing headline copy
 * here would reopen exactly the claim-drafting risk `BRANDS_MICRO_LABEL`
 * exists to close off. Rendered text stays limited to the two vetted
 * constants, the flag names (as chip `alt`s), and `INDEPENDENTS_MARK`.
 *
 * ── Two exports, one fixed contract ──────────────────────────────────────
 * `BrandsMarquee` is what the hero renders directly as its row 4
 * (DESIGN-REVISIT §4.2) — it carries its OWN `<section id="brands"
 * aria-labelledby>` landmark and its own accessible name, so the hero must
 * not wrap it in a second landmark. The export name is a fixed contract with
 * the hero agent — do not rename it.
 * `BrandsSection` stays exported, unchanged in shape, purely so nothing that
 * still imports the old entry point breaks; it renders `BrandsMarquee`
 * verbatim. NOTE for the integrator: `app/page.tsx` was still importing and
 * rendering `<BrandsSection />` as its own standalone section at the time
 * this file was written — D2 moves the band into the hero, and the brief
 * assigns removing that render to the main loop, not to this file
 * (`app/page.tsx` is out of scope here). Until that removal lands, the page
 * will carry two `id="brands"` sections (this one, nested in the hero, plus
 * the still-wired standalone one).
 *
 * ── Never adjacent to the Hokuten lockup (ref 01) ────────────────────────
 * This component renders no lockup of its own, so it cannot self-violate the
 * rule. Whether it ends up visually adjacent to the header lockup depends on
 * the hero's own composition (the brief's row order puts the headline row
 * between the art band and this one) — that composition lives in
 * `components/hero/`, out of this file's scope. At the time this file was
 * written, `HeroCoverPanel`/`HeroPlate` were still on the pre-revisit
 * small-block anatomy with no `<BrandsMarquee />` call site yet, so the
 * adjacency could not be screenshot-verified from here — flagged for
 * whoever wires the new hero row order.
 */

import Image from "next/image";
import {
  BRANDS_MICRO_LABEL,
  INDEPENDENTS_MARK,
  TRADEMARK_MICROCOPY,
  franchiseFlags,
} from "@/content/brands";
import { Marquee } from "@/components/motion/Marquee";

/** Every chip is delivered pre-normalized to this square (scripts/brand-chips.ts). */
const CHIP_PX = 208;

/**
 * `& independents` — OUR OWN copy, never a third-party mark (see
 * `content/brands.ts`), so it never picks up chip-image treatment. Sized to
 * sit at the row's optical centre rather than literally matching a chip's
 * 52px pixel height (which would read oversized at that many tracked caps) —
 * the same type recipe as the `brand-line` utility (Inter caps, 0.35em
 * tracking) MINUS its hard-set accent colour. `brand-line` itself is not
 * used for exactly that reason, unchanged from the pre-D2 version of this
 * file: colorizing the one non-chip item in an otherwise neutral 15-chip row
 * would make it the loudest thing in the band, the opposite of a quiet
 * closing note. Tracked caps stay inside the sitewide two-flavour budget
 * (`brand-line` / `micro-label`) by reusing `brand-line`'s face + tracking
 * tokens directly rather than inventing a third.
 */
const INDEPENDENTS_CLASS =
  "shrink-0 whitespace-nowrap text-heading font-sans font-medium uppercase tracking-brand text-fg-meta";

/**
 * One 3D glass-squircle chip. `alt` carries the flag's real name — the
 * accessible-name mechanism `content/brands.ts`'s rendering contract calls
 * for ("no content is conveyed by the rendering alone"). Never a link (ref
 * 01: linking a mark would imply a relationship the framing exists to deny).
 * `next/image` gets the asset's real 208x208 intrinsic size for zero-CLS;
 * `h-9`/`sm:h-[52px]` render the uniform optical height D2 specifies (~36px
 * mobile / ~52px desktop) while width tracks automatically off the square
 * source, matching the sitewide `h-<n> w-auto` pattern (SiteFooter's lockup).
 */
function BrandChip({ name, slug }: { name: string; slug: string }) {
  return (
    <Image
      src={`/logos/${slug}.png`}
      alt={name}
      width={CHIP_PX}
      height={CHIP_PX}
      draggable={false}
      className="h-9 w-auto shrink-0 sm:h-[52px]"
    />
  );
}

export function BrandsMarquee() {
  return (
    <section
      id="brands"
      aria-labelledby="brands-heading"
      className="surface-paper hairline-t hairline-b py-5 md:py-6"
    >
      <div className="container-hk flex flex-col items-center gap-3 text-center md:gap-4">
        {/*
          BRANDS_MICRO_LABEL ships as the fully-composed string
          "[ FLAGS WE TRANSACT ACROSS ]" — the MicroLabel atom composes its
          OWN brackets around word-only children, so routing this constant
          through that atom would double-bracket it. Rendering the frozen
          string verbatim in a plain heading imports it byte-exact with no
          derivation logic to get wrong. This is a real <h2> — it still
          contributes to the page's heading outline even though, visually,
          it is only a small-caps eyebrow.
        */}
        <h2 id="brands-heading" className="micro-label">
          {BRANDS_MICRO_LABEL}
        </h2>

        <Marquee
          speed="brands"
          label="Franchise flags we transact across"
          trackClassName="items-center gap-8 md:gap-12"
        >
          {franchiseFlags.map((flag) => (
            <BrandChip key={flag.slug} name={flag.name} slug={flag.slug} />
          ))}
          <span className={INDEPENDENTS_CLASS}>{INDEPENDENTS_MARK}</span>
        </Marquee>

        {/*
          D2: byte-exact TRADEMARK_MICROCOPY, one line, reduced emphasis, a
          leading asterisk. The asterisk is UI chrome this component
          prepends (content/brands.ts's own rendering contract), not a
          change to the frozen string — `aria-hidden` keeps it out of the
          announced reading, so a screen reader hears the disclosure
          verbatim with nothing prepended. No `max-w` clamp (the old 60ch
          wrap is exactly the "paragraph block" this round retires): it flows
          as one line at normal container widths and only wraps on a narrow
          viewport, never truncates — legal text is never clipped.
        */}
        {/* `text-fg-meta` with NO opacity modifier. The `/70` this carried
            measured 2.81:1 on gold paper and 2.86:1 on blue — an AA failure on
            a legal string, found in the 2026-08-09 contrast audit. D2's ask was
            "renders tiny", which the text-micro size already delivers; reduced
            EMPHASIS on a trademark disclaimer has to come from size and
            placement, never from dropping legal text below AA. Do not
            reintroduce an opacity modifier here. */}
        <p className="text-micro text-fg-meta">
          <span aria-hidden="true">* </span>
          {TRADEMARK_MICROCOPY}
        </p>
      </div>
    </section>
  );
}

export function BrandsSection() {
  return <BrandsMarquee />;
}
