/**
 * components/sections/SiteFooter.tsx — the site-wide footer landmark.
 *
 * Governed by docs/design/specs/footer.md (read that first — component plan,
 * states, motion, a11y and the acceptance list live there) and
 * hokuten-design-director ref 04 ("Footer"), ref 01 ("Lockups & usage" /
 * "Compliance"), ref 05 (hanko press-in), ref 07 (P0: compliance disclosure,
 * KW mark placement).
 *
 * Server Component. The only client boundary is `StampPressIn` (a leaf import,
 * not this file) — everything else here is static markup, so this file costs
 * nothing against the 180KB landing JS budget.
 *
 * ── The lockup-on-dark finding (read before touching the brand cluster) ────
 * `lockup-stacked-gold.png` was pixel-sampled for this build: its border and
 * "COMMERCIAL" wordmark are baked in `--ink` (#1A1C1F), a LIGHT-section text
 * token, not a dark-safe one. `--ink` on `--dark` measures 1.04:1 — the same
 * failure class ref 01 already names as a P0 for the *linear* lockup ("its
 * charcoal COMMERCIAL wordmark vanishes on charcoal"), just not yet logged for
 * this asset. So neither raster brand mark in this footer is placed bare on
 * `--dark`: both sit in a small `surface-card` chip (white ground, hairline
 * border) — the same mitigation the component brief already prescribes for the
 * KW Commercial mark, extended here to the lockup for the same measured
 * reason. This is a presentation-layer fix; the source PNG is untouched.
 * Full writeup: docs/design/specs/footer.md § "Finding carried into this spec".
 *
 * ── Ticker clearance (P0) ───────────────────────────────────────────────────
 * The root's `pb-[var(--ticker-h-mobile)] sm:pb-[var(--ticker-h)]` is additive
 * on top of `section-pad`'s own bottom rhythm, not a replacement for it — the
 * fixed ticker must never cover the last visible row of footer content at any
 * viewport.
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
import { BROKERAGE_DISCLOSURE, KW_COMMERCIAL_MARK } from "@/content/compliance";
import {
  BRAND_LINE,
  copyrightLine,
  footerColumns,
  footerLegalLinks,
  type FooterLink,
} from "@/content/site";

/** 44px minimum tap target for every standalone link (a11y law). */
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
  const className = `${TAP_TARGET} text-body text-fg-muted transition-colors duration-fast ease-out hover:text-accent-text`;

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

function DisclosureLine({ children }: { children: ReactNode }) {
  return <p className="max-w-[60ch] text-data text-fg-meta">{children}</p>;
}

export function SiteFooter() {
  return (
    <footer className="surface-dark pb-[var(--ticker-h-mobile)] sm:pb-[var(--ticker-h)]">
      <div className="container-hk section-pad">
        {/* Brand cluster — stacked lockup (chipped) + hanko, placement ① of three sitewide. */}
        <div className="flex flex-wrap items-center gap-4">
          <span className={`${MARK_CHIP} px-3 py-2`}>
            <Image
              src="/brand/lockup-stacked-gold.png"
              alt=""
              width={240}
              height={184}
              className="h-10 w-auto sm:h-12"
            />
          </span>
          <StampPressIn placement="footer" size={48} />
        </div>

        {/* Quick Links · For Owners · For Buyers */}
        <nav aria-label="Footer navigation" className="mt-12 lg:mt-16">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.heading}>
                <MicroLabel as="p" className="mb-4">
                  {column.heading}
                </MicroLabel>
                <ul className="space-y-3">
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

        {/* KW Commercial compliance mark — the only place it renders sitewide. */}
        <div className="mt-12 lg:mt-16">
          <span className={`${MARK_CHIP} p-3`}>
            <Image
              src={KW_COMMERCIAL_MARK.src}
              alt={KW_COMMERCIAL_MARK.alt}
              width={225}
              height={225}
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
          </span>
        </div>

        {/* Brokerage-of-record disclosure — verbatim, two sentences, hard line break. */}
        <div className="mt-8 hairline-t pt-8">
          <DisclosureLine>
            {BROKERAGE_DISCLOSURE[0]}
            <br />
            {BROKERAGE_DISCLOSURE[1]}
          </DisclosureLine>

          <nav aria-label="Policies" className="mt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
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

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="brand-line text-data">{BRAND_LINE}</p>
            <p className="text-data text-fg-meta">{copyrightLine()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
