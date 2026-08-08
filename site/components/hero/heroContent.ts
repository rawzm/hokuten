/**
 * components/hero/heroContent.ts — the hero's copy, authored ONCE and shared
 * by both theme chassis (`HeroCoverPanel` Theme G, `HeroPlate` Theme B) so the
 * two builds cannot drift into different sentences.
 *
 * Governed by hokuten-design-director ref 04 (`#hero` slot list), ref 06
 * (Voice, evidence gate, verified claims register) and the task brief's own
 * hero bullet. Spec of record: docs/design/specs/hero.md — read that file for
 * the full IA/motion/accessibility reasoning; this file is content only.
 *
 * ── Evidence gate ────────────────────────────────────────────────────────
 * Every string below is either literal wayfinding (no claim), the BOV promise
 * rendered WITH its condition (T-12/STR/PIP — the condition is part of the
 * claim, ref 06 "BOV promise" row, `verified-current`), or reuses an
 * already-verified sitewide constant (`navCta`, `anchor()`). No stat digit
 * ($200M+ / 12 / 836K+ / 3×) is restated here — `#stats` is the very next
 * section and owns those numbers; repeating them in the hero would be
 * duplication, not proof. See hero.md "Intent" for why this reads as
 * sufficient "who/what" without them.
 *
 * ── Casing convention ────────────────────────────────────────────────────
 * `eyebrow` and `rail` are authored in SENTENCE case, matching every other
 * micro-label-voiced string in the codebase (`MicroLabel.tsx`'s own doc
 * comment, `content/stats.ts`'s "Trust metrics", `content/brands.ts`'s
 * "Franchise flags we transact across"). The `micro-label` utility applies
 * `text-transform: uppercase` at render time — authoring lower keeps a screen
 * reader from spelling out an all-caps string as an acronym.
 *
 * ── Reuse, not duplication ───────────────────────────────────────────────
 * `ctaPrimary` is `content/nav.ts`'s own `navCta` ("Request a written BOV" →
 * `#bov`) — the exact same object the (already-built) SiteNav renders, so the
 * hero's primary CTA and the nav's CTA can never say two different things.
 * `ctaGhost.href` and the scroll-cue target both resolve through `anchor()`
 * (typed against `SectionId`), so a dead anchor cannot compile.
 */

import { navCta } from "@/content/nav";
import { anchor } from "@/content/site";

/** A pre-split headline, mirroring `SectionHeader`'s `AccentHeadline` shape
 * (`components/atoms/SectionHeader.tsx`) so both files render the identical
 * "before / one italic word / after" pattern. Kept as its own type rather than
 * imported from there — `SectionHeader` is `h1`-agnostic by design (`as` prop
 * defaults to `h2`) and the hero's `h1` is hand-built in each chassis, not
 * routed through `SectionHeader`. */
export type HeroHeadline = {
  before: string;
  /** Exactly one italic accent word (ref 03 typography law). */
  accent: string;
  after: string;
};

export type HeroCta = {
  label: string;
  href: string;
};

export type HeroContent = {
  /** Micro-label eyebrow words — NO brackets; `MicroLabel`/the raw
   * `micro-label` utility composes them. */
  eyebrow: string;
  /** Display-1 manifesto, one sentence, one italic word. */
  headline: HeroHeadline;
  /** One-line sub. Carries the BOV promise WITH its condition. */
  sub: string;
  /** Primary CTA — gold/accent pill. Reused verbatim from `content/nav.ts`. */
  ctaPrimary: HeroCta;
  /** Ghost CTA — hairline pill. */
  ctaGhost: HeroCta;
  /** Right-edge small-caps value rail, desktop only (`lg:` and up). */
  rail: readonly string[];
  /** Scroll-cue label. Real, visible text — not a decorative-only glyph. */
  scrollCue: string;
  /** Scroll-cue destination — the next section in document order. */
  scrollCueHref: string;
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
  rail: ["Discretion", "Data", "Execution", "Closed deals"],
  scrollCue: "Scroll",
  scrollCueHref: anchor("stats"),
} satisfies HeroContent;
