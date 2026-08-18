/**
 * components/sections/SiteFooter.tsx — the site-wide footer landmark.
 *
 * Governed by docs/design/specs/footer.md (component plan / states / motion /
 * a11y / acceptance list — the compaction below supersedes its "Component
 * plan" section; the IA, states, motion and a11y sections still hold),
 * hokuten-design-director ref 04 ("Footer"), ref 01 ("Lockups & usage" /
 * "Compliance"), ref 05 (hanko press-in), ref 07 (P0: compliance disclosure,
 * KW mark placement), docs/DESIGN-REVISIT.md §4.10 (D6 density pass —
 * "collapse the footer to a compact band"), and docs/DESIGN-REVISIT-2.md
 * D9/D10/§5.8 (screen 12 of 12 — see "DESIGN REVISIT 2" note below).
 *
 * Server Component. The only client boundary is `StampPressIn` (a leaf import,
 * not this file) — everything else here is static markup, so this file costs
 * nothing against the JS budget.
 *
 * ── DESIGN REVISIT 2 (2026-08-10) — screen 12 of 12, D9/D10/§5.8 ────────────
 * The D6 density pass below (2026-08-09) compacted this footer's own internal
 * rhythm; this pass changes the CHASSIS it sits in, not that internal rhythm —
 * the two-block stack, the gap sizing, the tap targets and every string are
 * untouched. Two changes:
 *   1. `container-hk` (max-width 1200px) → `stage-shell` (D9): full-width,
 *      fluid gutter, no cap — the brief's own diagnosis is that this footer
 *      read as "a thin band after the last snap" specifically because its
 *      three nav columns and brand cluster were fighting for space inside a
 *      1200px column instead of the actual viewport. `stage-shell` gives the
 *      SAME grid (`sm:grid-cols-3` for the link columns, unchanged) more room
 *      to breathe — nothing about the grid shape changed, only its ceiling.
 *   2. `<footer>` gains `page-panel` (D10) plus `lg:flex lg:flex-col
 *      lg:justify-center`, so on a qualifying desktop this composes as the
 *      twelfth screen and VERTICALLY CENTRES rather than sitting flush at
 *      the top of a min-height box with dead space below (§5.8: "rather than
 *      leaving a tiny band after the last snap"). `page-panel` is min-height
 *      ONLY (same rule as every other panel — see BovSection.tsx's identical
 *      note) and its own `@media (width >= 64rem)` gate means mobile is
 *      completely unaffected: below `lg` this footer has no forced height at
 *      all and returns to plain natural content flow (§5.8: "On mobile the
 *      footer returns to natural content height"), exactly as it always has.
 *
 * The ticker-clearance mechanism below (`pb-[var(--ticker-h-mobile)]
 * sm:pb-[var(--ticker-h)]`) is UNCHANGED by this pass — read, verified again
 * against `TickerBar.tsx` for this round, and deliberately left alone rather
 * than "optimized" against `page-panel`'s own `--screen-fit` math (which
 * already subtracts `--ticker-h` once, so on the qualifying ≥1024px tier this
 * padding is technically redundant with the panel's own reserved floor — it
 * shaves a `--ticker-h` sliver off the centred content's usable height rather
 * than off empty margin, which is a strictly safe direction to be wrong in).
 * It stays load-bearing below `lg`, where `page-panel` sets no height at all
 * and this footer's box is exactly its natural content height — the tier this
 * P0 finding was written for, and the one an "optimize it away" edit would
 * reopen. Preserved rather than re-derived, per this round's own instruction
 * to read TickerBar.tsx before touching this spacing at all. See that file's
 * header for the flow-spacer mechanics this reserve is keeping in step with.
 *
 * ── LAUNCH ADDITIONS (2026-08-17) — §3.11 / R15 / F35 / P16 ────────────────
 * Two strings land in this footer and nowhere else on the site. Neither is
 * authored here: both are imported constants, and both are grep-gated at §7.3
 * to exactly one occurrence in `site/`.
 *
 *   1. `BRAND_TAGLINE` (R15) — a mono kicker directly beneath the lockup, in
 *      the brand cluster. The brand cluster's row of [chipped lockup + hanko]
 *      is unchanged; it is now the first row of a two-row column, with the
 *      kicker as the second. Type tokens are composed by hand
 *      (`font-mono text-micro uppercase tracking-micro`) rather than via the
 *      `micro-label` utility, because that utility bundles its own
 *      `color: var(--fg-meta)` and the cascade order between two
 *      same-specificity utilities is undefined — the exact collision
 *      `FaqSection.tsx` and `atoms/Badge.tsx` document and solve the same way.
 *      Colour is `text-accent-text`, which resolves to `--accent-on-dark` here
 *      because `surface-dark` rebinds it (globals.css) — §3.11 asks for
 *      `--accent-ink` on light and `--accent-on-dark` on dark, and naming the
 *      surface-scoped token is how a component gets both without knowing which
 *      ground it is on. The source string is sentence case and the uppercase is
 *      presentational, so AT reads words rather than shouted caps (the
 *      convention `MicroLabel.tsx` documents). It is NOT rendered through
 *      `MicroLabel`: that component composes the bracketed `[ … ]` section-index
 *      device, and a brand line inside section brackets reads as a section
 *      label.
 *
 *   2. `WHATSAPP_COMMUNITY` + `WHATSAPP_DISCLOSURE` (F35) — the public
 *      investor-community invite in the legal block, with the phone-visibility
 *      and vetting disclosure in the SAME sub-block immediately beneath it.
 *      The pairing is the requirement, not a courtesy: §3.11 says "never a link
 *      on its own", because the disclosure exists to be read before the tap,
 *      not found afterwards somewhere else on the page. They are wrapped in one
 *      `<div>` so that adjacency survives a future reflow of this stack rather
 *      than depending on sibling order. The disclosure renders through
 *      `DisclosureLine` — it is disclosure prose and holds the same 16px body
 *      floor as the brokerage disclosure above it, never `text-data`.
 *
 * The single-KW-mark invariant below is untouched by both: neither addition
 * renders a mark, and the chipped lockup is still the one KW-mark-bearing
 * instance in this file.
 *
 * ── D6 compaction (2026-08-09) ──────────────────────────────────────────────
 * Rebuilt from a two-block stack (brand cluster → nav grid → KW mark → hairline
 * → disclosure → legal row → sign-off, six `mt-12`/`mt-16`/`mt-8` gaps deep)
 * into two blocks: one `lg:flex-row` (brand cluster left, three nav columns
 * right — "one row of link columns" per the work order, not one row per
 * column) and one dense hairline-separated stack (disclosure → legal links +
 * brand line, sharing a single `mt-3`). `section-pad` → `section-pad-tight`.
 * Estimated block height at 1440px, section-pad excluded: ~640px before this
 * pass → ~330px after (~52%). The floor that stops this from reaching the
 * brief's 40% stretch target is a hard one, not a shortcut: every stacked nav
 * link keeps a genuine 44px tap target (a11y law, non-negotiable), and the
 * Quick Links column has 5 of them — 5 × 44px is ~220px on its own regardless
 * of how tight the surrounding gaps get. Reported per the brief's own
 * "legibility is a rule, height is a target" instruction rather than forcing
 * the number by shrinking a tap target or the disclosure text.
 *
 * ── The KW-mark duplication (audit finding, resolved here) ─────────────────
 * This file previously rendered TWO separate KW Commercial renderings: the
 * co-brand `lockup-stacked-gold.png` in the brand cluster (which already bakes
 * in the full-colour "KW COMMERCIAL" glyph — confirmed by pixel inspection,
 * not assumed) AND a second, standalone `KW_COMMERCIAL_MARK` image
 * (`kw-commercial.png`, a monochrome cut of the identical glyph) in its own
 * chipped row further down, captioned "the only place it renders sitewide" —
 * which was already false the moment the lockup above it also carried the
 * mark. REMOVED: the standalone `KW_COMMERCIAL_MARK` block and its import.
 * KEPT: the lockup in the brand cluster — it is the one KW-mark-bearing
 * instance in this file now, it is the element the work order's "Lockup +
 * hanko small on the left" line asks for, and per ref 01 ("If listings ship
 * under KW license, the KW Commercial mark must be present in the footer")
 * that requirement is satisfied by the lockup's own bundled mark. The
 * `BROKERAGE_DISCLOSURE` text — the actual legal requirement — is untouched
 * and still renders byte-exact; only the redundant second GRAPHIC came out.
 * `content/compliance.ts`'s doc comment on `KW_COMMERCIAL_MARK` ("appears
 * ONLY in the footer... never in the header") now reads stale next to D1
 * (header carries a KW-bearing lockup too) — flagged for the content owner,
 * not edited here (out of this file's scope).
 *
 * ── Lockup-on-dark finding, still live (unresolved upstream) ───────────────
 * `lockup-stacked-gold.png` was pixel-sampled for this build: its border and
 * "COMMERCIAL" wordmark are baked in `--ink` (#1A1C1F), a LIGHT-section text
 * token, not a dark-safe one. `--ink` on `--dark` measures 1.04:1 — a near-
 * total contrast failure. So it is not placed bare on `--dark`: it sits in a
 * small `surface-card` chip (white ground, hairline border). Presentation-
 * layer mitigation only; the source PNG is untouched.
 *
 * ── The theme-matched lockup — SWAP DONE 2026-08-09 ────────────────────────
 * When this file was written the four prepared crops did not exist yet, so it
 * kept `lockup-stacked-gold.png` and rendered a GOLD KW mark in the blue
 * build's footer. The dual-theme audit caught that the same day. It now reads
 * `themePresentation.lockup` — the same record the header uses, so there is
 * exactly one place per-theme assets are chosen. The two crops are different
 * aspects (gold 669x501, blue 971x811), so `LOCKUP_INTRINSIC` passes the real
 * intrinsic size per theme and CLS stays at 0.
 *
 * The chip backing above is KEPT deliberately: both prepared crops still carry
 * their own light ground (the marks are framed boxes on white in the masters),
 * so a bare placement on `--dark` would show a raw white rectangle. The chip
 * makes that ground look intentional instead.
 *
 * ── Ticker clearance (P0) — mechanism unchanged ─────────────────────────────
 * The root's `pb-[var(--ticker-h-mobile)] sm:pb-[var(--ticker-h)]` is additive
 * on top of `section-pad-tight`'s own bottom rhythm, not a replacement for it
 * — the fixed ticker must never cover the last visible row of footer content
 * at any viewport. Verified against `components/ticker/TickerBar.tsx`: the
 * bar reserves its own flow-spacer at the SAME breakpoint (`sm`) using the
 * SAME tokens, so this reserve and that spacer never drift independently —
 * this padding is what keeps the footer's own content clear of the bar when
 * the bar is `position: fixed` over it.
 *
 * ── Disclosure floor (2026-08-09) ───────────────────────────────────────────
 * The brokerage disclosure previously rendered at `text-data` (14–15px) — the
 * work order is explicit that legal disclosure is not a micro-label and must
 * hold a 16px body floor. Bumped to `text-body`. The legal links row and the
 * nav columns are ordinary UI links, not disclosure prose, so they keep the
 * smaller `text-data` size the work order asks for ("one row of link columns
 * at small type") — same size the legal links row already used before this
 * pass, now applied to the nav columns too for a consistent "small type" read.
 *
 * ── Class-composition note ───────────────────────────────────────────────
 * No `cn()` in this file. `cn()` runs tailwind-merge, which treats a
 * `text-{size}` token (`text-body`, `text-data`) and a `text-{color}` token
 * (`text-fg-muted`, `text-accent-text`) as the same conflict group and drops
 * one silently (documented in `SectionHeader.tsx` and `Badge.tsx`) — this file
 * needs both on the same link, so class strings are composed as plain
 * template literals instead, matching `LegalPage.tsx`'s own workaround.
 */

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { StampPressIn } from "@/components/atoms/Stamp";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import {
  BROKERAGE_DISCLOSURE,
  OUT_OF_STATE_QUALIFIER,
  WHATSAPP_DISCLOSURE,
} from "@/content/compliance";
import { cn } from "@/lib/utils";
import { THEME, themePresentation } from "@/lib/theme";
import {
  BRAND_LINE,
  BRAND_TAGLINE,
  copyrightLine,
  footerColumns,
  footerLegalLinks,
  WHATSAPP_COMMUNITY,
  type FooterLink,
} from "@/content/site";

/** 44px minimum tap target for every standalone link (a11y law — not relaxed for density). */
const TAP_TARGET = "inline-flex min-h-11 items-center";

/** Chip backing for a raster mark that isn't dark-safe on its own — see file header. */
const MARK_CHIP =
  "surface-card inline-flex items-center justify-center rounded-card border border-hairline";

/**
 * One footer link, resolved to the right element for its destination:
 * `next/link` for a root-relative route, a plain `<a>` for a same-page anchor
 * or `mailto:`, and an externally-warned `<a>` for `external` links — the same
 * pattern `CardShell.tsx` already uses for its own external links.
 */
function FooterNavLink({ label, href, external }: FooterLink) {
  const className = `${TAP_TARGET} text-data text-fg-muted transition-colors duration-fast ease-out hover:text-accent-text`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

/** Disclosure prose — 16px body floor (P0, see file header), never `text-data`/`text-micro`. */
/** Intrinsic pixel size of each prepared lockup crop (scripts/identity-prep.ts).
 *  Passed to next/image so the footer mark reserves the right box in both
 *  themes — the two crops are not the same aspect (gold 1.335, blue 1.197). */
const LOCKUP_INTRINSIC = {
  gold: { w: 669, h: 501 },
  blue: { w: 971, h: 811 },
} as const;

function DisclosureLine({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("max-w-[60ch] text-body text-fg-meta", className)}>{children}</p>;
}

export function SiteFooter() {
  return (
    <footer
      className={cn(
        "surface-dark page-panel pb-[var(--ticker-h-mobile)] sm:pb-[var(--ticker-h)]",
        // D10: screen 12 of 12. Centres the composed footer inside its usable
        // height on a qualifying desktop (§5.8) instead of sitting flush at
        // the top with dead space below it. `page-panel`'s own media gate
        // means this is a no-op below `lg` — mobile keeps natural flow.
        "lg:flex lg:flex-col lg:justify-center",
      )}
    >
      <div className="stage-shell section-pad-tight">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* Brand cluster — lockup (chipped) + hanko, small. The one KW-mark
              instance in this file (see file header, "KW-mark duplication"). */}
          <div className="flex shrink-0 flex-col gap-2">
            <div className="flex items-center gap-3">
              {/* Theme-matched, not hardcoded. This rendered the GOLD lockup on
                  Theme B too — a gold KW mark in the footer of the blue build,
                  found in the 2026-08-09 dual-theme audit. `themePresentation`
                  is the single place per-theme assets are chosen (lib/theme.ts);
                  the prepared crops are gold 669x501 and blue 971x811, so the
                  intrinsic size differs per theme and both are passed explicitly
                  to keep CLS at 0. alt="" is correct: the mark is decorative and
                  the real-text brand line below carries the name. */}
              <span className={`${MARK_CHIP} px-2.5 py-1.5`}>
                <Image
                  src={themePresentation.lockup}
                  alt=""
                  width={LOCKUP_INTRINSIC[THEME].w}
                  height={LOCKUP_INTRINSIC[THEME].h}
                  className="h-7 w-auto sm:h-8"
                />
              </span>
              <StampPressIn placement="footer" size={28} />
            </div>

            {/* R15 — the tagline's ONE placement site-wide (see file header). */}
            <p className="font-mono text-micro uppercase tracking-micro text-accent-text">
              {BRAND_TAGLINE}
            </p>
          </div>

          {/* Quick Links · For Owners · For Buyers — one row of columns, small type. */}
          <nav aria-label="Footer navigation" className="lg:flex-1">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3 sm:gap-y-0">
              {footerColumns.map((column) => (
                <div key={column.heading}>
                  <MicroLabel as="p" className="mb-2">
                    {column.heading}
                  </MicroLabel>
                  <ul className="space-y-1">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <FooterNavLink {...link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Dense stack — byte-exact disclosure, legal links, brand line. */}
        <div className="mt-6 hairline-t pt-6">
          <DisclosureLine>
            {BROKERAGE_DISCLOSURE[0]}
            <br />
            {BROKERAGE_DISCLOSURE[1]}
          </DisclosureLine>

          {/* The out-of-state qualifier (DESIGN-REVISIT §5.1, a compliance P0 from
              the ship gate). Ported byte-exact from the source site's brokerage-of-
              record card (index.html:1152) into content/compliance.ts, and rendered
              here immediately beneath the disclosure it qualifies — never alone,
              because "nationwide" without the partner-brokerage mechanism beside it
              is the overclaim the qualifier exists to prevent. Wired by the main
              loop: the constant landed after this file was written. */}
          <DisclosureLine className="mt-2">{OUT_OF_STATE_QUALIFIER}</DisclosureLine>

          {/* F35/P16 — the invite and its disclosure are ONE block, never a bare
              link (§3.11). Public channel: never labelled as private access,
              which is a100 Arms' lane. */}
          <div className="mt-3">
            <FooterNavLink {...WHATSAPP_COMMUNITY} external />
            <DisclosureLine className="mt-1">{WHATSAPP_DISCLOSURE}</DisclosureLine>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <nav aria-label="Policies">
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {footerLegalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`${TAP_TARGET} text-data text-fg-muted underline-offset-4 transition-colors duration-fast ease-out hover:text-fg hover:underline`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="brand-line text-data">{BRAND_LINE}</p>
              <p className="text-data text-fg-meta">{copyrightLine()}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
