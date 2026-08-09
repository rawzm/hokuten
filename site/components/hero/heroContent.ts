/**
 * components/hero/heroContent.ts — the hero's copy, authored ONCE for the one
 * shared chassis `Hero.tsx` now renders in both themes (DESIGN-REVISIT.md §4.2
 * — the runcycle anatomy; this file no longer feeds two separate components).
 *
 * Governed by hokuten-design-director ref 04 (`#hero` slot list), ref 06
 * (Voice, evidence gate, verified claims register) and DESIGN-REVISIT.md §4.2
 * (row 3: "left — the manifesto h1 ... right — the sub line plus the two
 * CTAs"). Content only — see `Hero.tsx`'s header for the IA/motion/a11y
 * reasoning.
 *
 * ── Evidence gate ────────────────────────────────────────────────────────
 * Every string below is either literal wayfinding (no claim), the BOV promise
 * rendered WITH its condition (T-12/STR/PIP — the condition is part of the
 * claim, ref 06 "BOV promise" row, `verified-current`), or reuses an
 * already-verified sitewide constant (`navCta`, `anchor()`). No stat digit
 * ($200M+ / 12 / 836K+ / 3×) is restated here — `#stats` is the next content
 * section in `app/page.tsx`'s render order and owns those numbers; repeating
 * them in the hero would be duplication, not proof.
 *
 * ── Casing convention ────────────────────────────────────────────────────
 * `eyebrow` is authored in SENTENCE case, matching every other micro-label-
 * voiced string in the codebase (`MicroLabel.tsx`'s own doc comment,
 * `content/stats.ts`'s "Trust metrics"). The `micro-label` utility applies
 * `text-transform: uppercase` at render time — authoring lower keeps a screen
 * reader from spelling out an all-caps string as an acronym.
 *
 * ── Reuse, not duplication ───────────────────────────────────────────────
 * `ctaPrimary` is `content/nav.ts`'s own `navCta` ("Request a written BOV" →
 * `#bov`) — the exact same object the (already-built) SiteNav renders, so the
 * hero's primary CTA and the nav's CTA can never say two different things.
 * `ctaGhost.href` resolves through `anchor()` (typed against `SectionId`), so
 * a dead anchor cannot compile.
 *
 * ── What was here before, and why it is gone ────────────────────────────
 * The pre-revisit chassis (tall, one-screen, copy+art as grid siblings) also
 * carried a decorative right-edge value rail ("Discretion / Data / Execution
 * / Closed deals") and an absolute-bottom scroll cue. Neither survives the
 * runcycle rebuild: DESIGN-REVISIT §4.2 fixes the anatomy at exactly four
 * rows (nav / art band / headline row / brands marquee) and names no fifth
 * decorative element; the rail had no room left in the now much shorter
 * headline row, and a "scroll for more" chevron pinned to the hero's own
 * bottom edge would have sat directly on top of the brands marquee, which is
 * already visible in the same first screen — a redundant affordance pointing
 * at content already on screen. If a future round wants either back, they are
 * cheap to re-add here; nothing else in the codebase referenced
 * `heroContent.rail` or `.scrollCue` (verified by grep before deleting them).
 */

import { navCta } from "@/content/nav";
import { anchor } from "@/content/site";

/** A pre-split headline, mirroring `SectionHeader`'s `AccentHeadline` shape
 * (`components/atoms/SectionHeader.tsx`) so both files render the identical
 * "before / one italic word / after" pattern. Kept as its own type rather than
 * imported from there — `SectionHeader` is `h1`-agnostic by design (`as` prop
 * defaults to `h2`) and the hero's `h1` is hand-built in `Hero.tsx`, not
 * routed through `SectionHeader`. */
export type HeroHeadline = {
  before: string;
  /** Exactly one italic accent word (ref 03 typography law; D8 clarifies this
   * count is unchanged). This is the ONE headline on the site permitted to
   * render at `text-display0` — see `Hero.tsx`. */
  accent: string;
  after: string;
};

export type HeroCta = {
  label: string;
  /** Always an in-page anchor (`anchor()`'s return shape, `#<SectionId>`).
   * Typed as plain `string` here (matching `NavLink`, which this reuses) —
   * `Hero.tsx` asserts the narrower `AnchorLink` shape at the call site; see
   * that file's header for why the assertion is safe. */
  href: string;
};

export type HeroContent = {
  /** Micro-label eyebrow words — NO brackets; `MicroLabel`/the raw
   * `micro-label` utility composes them. */
  eyebrow: string;
  /** The manifesto, `text-display0`, one italic word (DESIGN-REVISIT §4.2 row
   * 3 left column). */
  headline: HeroHeadline;
  /** One-line sub, row 3 right column. Carries the BOV promise WITH its
   * condition. */
  sub: string;
  /** Primary CTA — accent pill, row 3 right column. Reused verbatim from
   * `content/nav.ts`. */
  ctaPrimary: HeroCta;
  /** Ghost CTA — hairline pill, row 3 right column. */
  ctaGhost: HeroCta;
};

export const heroContent: HeroContent = {
  eyebrow: "Hospitality investment sales — nationwide",
  headline: {
    before: "Every listing gets a number we can ",
    accent: "defend",
    after: ", not one we guess.",
  },
  sub: "A written BOV in 48 hours, on receipt of your T-12, STR, and PIP.",
  ctaPrimary: navCta,
  ctaGhost: { label: "See the track record", href: anchor("closings") },
} satisfies HeroContent;
