/**
 * components/sections/BrandsSection.tsx — `#brands` franchise-flag marquee.
 *
 * Governed by docs/DESIGN-REVISIT-2.md §1 request 1, §2 D9/D11, §5.1 "Brand
 * rail changes" (2026-08-10, Design Revisit 2) — supersedes
 * docs/DESIGN-REVISIT.md §2 D2 + §3.7 (2026-08-08/09) on chip size and the
 * independents tail ONLY. Everything else D2 established (real colour 3D
 * chips, no grayscale, no hover-colorize, the evidence-gated framing) still
 * governs and is not re-litigated here. Ref 01 "Motif system" carries the
 * dated 2026-08-10 supersession note; ref 04 `#brands`; ref 08.4 trademark
 * rules.
 *
 * Server Component. `Marquee` itself is now a small client island (see its
 * own file header for why the measured continuous loop needs runtime JS) —
 * this file stays server-rendered and simply composes it; nothing here needs
 * `"use client"`. Content is 100% `@/content/brands` (which re-exports
 * `TRADEMARK_MICROCOPY` from `@/content/compliance` unmodified) — this file
 * never retypes a name, a label, or the trademark disclaimer.
 *
 * ── D25 (2026-08-10): chips grow again, a third time ──────────────────────
 * Razim's localhost review of the D9/D11 build below: "the brand logos in
 * the bottom is not big enough." `CHIP_HEIGHT_CLASS` raises the clamp again,
 * ~64px → ~80px wide-desktop ceiling (~48px mobile floor). Full note at the
 * constant itself. `docs/DESIGN-REVISIT-3.md` D25 also owns the sibling fix
 * this rail depends on — `Hero.tsx` reworking the hero panel so the taller
 * rail still lands inside one usable screen; that arithmetic lives in
 * `Hero.tsx`, not here.
 *
 * ── D9/D11 (2026-08-10): three changes from the D2 build ─────────────────
 * 1. Chips grow again: a fluid `clamp()` targeting ~64px optical height on
 *    wide desktop, 52–56px tablet, 42–44px mobile — see `CHIP_HEIGHT_CLASS`
 *    below (superseded again by D25 above — kept for the record, this is
 *    the change that established the one-clamp-not-three-breakpoints
 *    pattern D25 continues). Razim's second-round screenshots showed the D2
 *    row (~44–52px desktop / ~36px mobile, two hard breakpoints) still
 *    reading small against the new full-viewport `stage-shell` composition.
 *    One clamp token, not three hard-coded stops, per the brief's own
 *    instruction.
 * 2. `INDEPENDENTS_MARK` is gone — not resized, deleted. Razim asked for the
 *    "& independents" tail removed outright. `content/brands.ts` no longer
 *    exports it; nothing here imports or renders it. The row ships only the
 *    15 supplied franchise chips.
 * 3. The loop is now measured, not assumed. `Marquee` measures the viewport
 *    and one chip-row width at runtime and repeats the row until a "half"
 *    exceeds the viewport plus a seam margin, so the rail covers ultrawide
 *    screens (2560, 3840) with no visible gap. That mechanism lives entirely
 *    in `Marquee.tsx`'s own file — nothing about it belongs here beyond
 *    passing `speed="brands"`.
 *
 * Two flags (Radisson, Choice Hotels) are evidenced in closed deals but have
 * no chip asset yet. `content/brands.ts` tracks them in `FLAGS_AWAITING_CHIP`,
 * deliberately outside `franchiseFlags` — this file does not import that
 * export, so there is nothing to accidentally render for either. A sixteenth
 * supplied chip, `_hold-amber-mark`, is unidentified and held out the same
 * way at the content layer — not in `franchiseFlags`, so it is structurally
 * impossible for this component to render it.
 *
 * No `SectionHeader` here — same deliberate exception as the pre-D2 version.
 * Ref 04 gives `#brands` only a micro-label + trademark microcopy, never a
 * Display-2 headline: the framing itself ("flags we transact across," never
 * "partners"/"clients") IS the legal control, and inventing headline copy
 * here would reopen exactly the claim-drafting risk `BRANDS_MICRO_LABEL`
 * exists to close off. Rendered text stays limited to the two vetted
 * constants and the flag names (as chip `alt`s).
 *
 * ── Two exports, one fixed contract ──────────────────────────────────────
 * `BrandsMarquee` is what the hero renders as a landmark INSIDE its own
 * first-viewport panel (docs/DESIGN-REVISIT-2.md §3.1, §5.1) — it carries its
 * OWN `<section id="brands" aria-labelledby>` landmark and its own accessible
 * name, so the hero must not wrap it in a second landmark. The export name is
 * a fixed contract with the hero agent — do not rename it.
 *
 * `BrandsMarquee` deliberately carries NO `page-panel` class and makes NO
 * fixed-height assumption anywhere in this file — do not add either. It is a
 * landmark inside the hero's own panel, never a second snap target of its
 * own (§3.1: "without becoming a second snap target and without the brittle
 * hard-coded `--brands-h` subtraction the previous build used"). Its
 * rendered height is content-driven and now DIFFERENT from whatever fixed
 * figure the previous hero pass hard-coded (chips alone grew from a 52px
 * ceiling to a 64px one). A consuming layout should give this component
 * `shrink-0` and size a flexible sibling around it — never subtract a
 * literal pixel constant tuned against an old render. (At the time this file
 * was written, `Hero.tsx` — not this file's to edit — still computed
 * `lg:h-[calc(var(--screen-fit)-var(--brands-h))]` against a hard-coded
 * `--brands-h: 184px` in globals.css; both are now stale against this
 * component's actual height and are flagged for whoever next touches the
 * hero, not fixed here.)
 *
 * `BrandsSection` stays exported, unchanged in shape, purely so nothing that
 * still imports the old entry point breaks; it renders `BrandsMarquee`
 * verbatim.
 *
 * ── Never adjacent to the Hokuten lockup (ref 01) ────────────────────────
 * This component renders no lockup of its own, so it cannot self-violate the
 * rule. Whether it ends up visually adjacent to the header lockup depends on
 * the hero's own composition, which lives in `components/hero/`, out of this
 * file's scope.
 *
 * ── Band stays light in both themes (VERIFIED CONSTRAINT, not a preference) ─
 * `.surface-paper` unconditionally, in both `data-theme="gold"` and
 * `data-theme="blue"` — never `.surface-dark`/`.surface-black`. The supplied
 * chip PNGs carry baked light-ground shadows (confirmed 2026-08-09 by
 * compositing the real files); on a dark surface they render as grey halo
 * boxes. Flagged explicitly in docs/DESIGN-REVISIT-2.md §5.1 — do not move
 * this band onto a dark surface scope.
 */

import Image from "next/image";
import { BRANDS_MICRO_LABEL, TRADEMARK_MICROCOPY, franchiseFlags } from "@/content/brands";
import { Marquee } from "@/components/motion/Marquee";

/** Every chip is delivered pre-normalized to this square (scripts/brand-chips.ts). */
const CHIP_PX = 208;

/**
 * D25 optical-height target (2026-08-10, docs/DESIGN-REVISIT-3.md D25 — the
 * D9/D11 figure directly below is superseded, kept for the record). Razim's
 * localhost review: "the brand logos in the bottom is not big enough."
 * Raised from ~64px wide-desktop ceiling to ~80px: `clamp(3rem, 2.5rem +
 * 2.6vw, 5rem)` — ~48px mobile floor, reaching its 5rem/80px ceiling ~1538px
 * width ((5rem-2.5rem)/2.6vw = 1538px). At the D25 reference viewports this
 * solves to ~77px at 1440px width and the full 80px ceiling at 1920px
 * (Hero.tsx's own D25 budget comment carries the full one-screen arithmetic
 * this rail feeds into — the taller chip row is accounted for there, not
 * re-derived here). Width still tracks automatically (`w-auto`) off each
 * chip's square 208×208 source, matching the sitewide `h-<n> w-auto` pattern
 * (SiteFooter's lockup). `_` stands in for the space CSS `clamp()` requires
 * around its `+` that a Tailwind arbitrary-value token can't carry literally
 * — same convention `Marquee.tsx` already documents for its own arbitrary
 * variants.
 *
 * ── D9/D11 figure, retired 2026-08-10 (kept for the record) ──────────────
 * ~64px wide desktop, ~52–56px tablet, ~42–44px mobile:
 * `h-[clamp(2.625rem,_2.3rem_+_1.9vw,_4rem)]`, ceiling ~1430px width.
 */
const CHIP_HEIGHT_CLASS = "h-[clamp(3rem,_2.5rem_+_2.6vw,_5rem)] w-auto shrink-0";

/**
 * One 3D glass-squircle chip. `alt` carries the flag's real name — the
 * accessible-name mechanism `content/brands.ts`'s rendering contract calls
 * for ("no content is conveyed by the rendering alone"). Never a link (ref
 * 01: linking a mark would imply a relationship the framing exists to deny).
 * `next/image` gets the asset's real 208x208 intrinsic size for zero-CLS;
 * `CHIP_HEIGHT_CLASS` renders the fluid optical height D9/D11 specifies.
 */
function BrandChip({ name, slug }: { name: string; slug: string }) {
  return (
    <Image
      src={`/logos/${slug}.png`}
      alt={name}
      width={CHIP_PX}
      height={CHIP_PX}
      draggable={false}
      className={CHIP_HEIGHT_CLASS}
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

        {/* D9/D11: no trailing "& independents" item — the row is exactly
            the 15 supplied chips, nothing appended. `Marquee` measures this
            one pass and repeats/duplicates it internally for the seamless,
            ultrawide-safe loop; this component renders it exactly once. */}
        <Marquee
          speed="brands"
          label="Franchise flags we transact across"
          trackClassName="items-center gap-8 md:gap-12"
        >
          {franchiseFlags.map((flag) => (
            <BrandChip key={flag.slug} name={flag.name} slug={flag.slug} />
          ))}
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
