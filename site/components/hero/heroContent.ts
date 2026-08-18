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
 * ── LAUNCH 2026-08-17 — the copy this file now carries ─────────────────────
 * docs/LAUNCH-IMPLEMENTATION.md §3.1 replaces the previously AUTHORED h1 and
 * sub with Dino's approved positioning copy (decision R4/D1; strings pasted
 * from that document's Appendix B1 copy bank, never retyped):
 *   • h1  — `V2` §3 "Approved website positioning → Hero", line 47. The
 *     precedence rule (L13) picks `V2` over `FINAL`, so NOTHING from `FINAL`
 *     ships here: not "The signal underneath every hotel transaction", and not
 *     the Asia-to-Americas coverage phrase §3.14 bans outright — the Japan
 *     programme is pilot-only and has no approved public description, so that
 *     phrase would fail the evidence gate. Its literal wording is deliberately
 *     not written out here: §3.14's never-ship strings are QA-grep targets over
 *     the whole of site/ and the sweep makes no exemption for comments.
 *   • sub — `V2` §3 line 48, complete. It is ~40 words and renders at
 *     `--text-body-lg` inside a prose measure, never at display size; §3.1's
 *     build note makes the sub THE ROW THAT FLEXES if the hero ever measures
 *     past one usable screen (D25) — the headline size is not the lever.
 *   • ctaSupport — `content/methodology.ts`'s `bovPromise`, IMPORTED (§3.1
 *     lists it as the hero's CTA support line; B5 carries the same frozen
 *     string). The 48-hour promise may never appear without its condition, so
 *     it is never retyped anywhere — this is the fifth import site.
 *
 * ── Evidence gate ────────────────────────────────────────────────────────
 * Every string below is either literal wayfinding (no claim), a service
 * description with no figure in it, or an already-verified sitewide constant
 * (`navCta`, `bovPromise`, `anchor()`). No stat digit ($200M+ / 12 / 836K+)
 * is restated here — `#stats` is the next content section in `app/page.tsx`'s
 * render order and owns those numbers; repeating them in the hero would be
 * duplication, not proof. The award count is deliberately absent sitewide
 * (§3.3: never compress the five CoStar records into a personal multiplier).
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

import { bovPromise } from "@/content/methodology";
import { navCta } from "@/content/nav";
import { anchor } from "@/content/site";

/** A pre-split headline. The launch round changes the SHAPE of the site's
 * signature display move: `GUIDE` v1.3 line 14 sets the LAST PHRASE of a
 * display line in Cormorant italic + gold ("the tail"), where the pre-launch
 * site italicised one accent word mid-sentence. §2.2's `.display-tail`
 * utility carries that treatment, and this type carries the split it needs —
 * `before` + `tail`, with nothing after the tail by construction, so a
 * headline can never be authored with the accent stranded mid-clause. */
export type HeroHeadline = {
  before: string;
  /** The trailing phrase, rendered with `.display-tail` (Cormorant italic,
   * `--accent-text`). Exactly one per headline — see `Hero.tsx`. This is the
   * ONE headline on the site permitted to render at `text-display0`. */
  tail: string;
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
   * `micro-label` utility composes them. §3.1: "nationwide" is a market
   * statement only — nothing on the site may read as blanket brokerage
   * authority in every jurisdiction (the coverage sentence in §3.11 is the
   * canonical statement and lives in the footer). */
  eyebrow: string;
  /** The positioning line, `text-display0`, italic gold tail (§3.1). */
  headline: HeroHeadline;
  /** The ~40-word positioning sub, `text-body-lg`, prose measure. */
  sub: string;
  /** Mono micro support line beside the CTAs — the BOV promise WITH its
   * condition, imported from `content/methodology.ts` and never retyped. */
  ctaSupport: string;
  /** Primary CTA — outlined gold per D-VOCAB/R2, row 3 right column. Reused
   * verbatim from `content/nav.ts`. */
  ctaPrimary: HeroCta;
  /** Ghost CTA — hairline pill, row 3 right column. */
  ctaGhost: HeroCta;
};

export const heroContent: HeroContent = {
  eyebrow: "Hospitality investment sales — nationwide",
  headline: {
    before: "Hotel brokerage and advisory, coast to coast — ",
    tail: "with systems in place.",
  },
  sub:
    "Human-led hotel brokerage supported by source-controlled underwriting, licensed comparable-sale research, structured buyer qualification, documented owner reporting, AI-assisted research, document review, and controlled workflow automation.",
  ctaSupport: bovPromise,
  ctaPrimary: navCta,
  ctaGhost: { label: "See the track record", href: anchor("closings") },
} satisfies HeroContent;
