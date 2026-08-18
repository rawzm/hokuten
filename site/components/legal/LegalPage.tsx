/**
 * components/legal/LegalPage.tsx — the shared chassis for the three policy
 * routes: `/privacy`, `/sms-terms`, `/accessibility`.
 *
 * Server Component. Zero client JS: the chrome is links only, so these routes
 * ship no interactivity and cost nothing against the 180KB landing budget.
 *
 * ── What this file owns ───────────────────────────────────────────────────
 * The page frame (nav → main → footer), the reading measure, the heading
 * hierarchy, and the footer compliance disclosure. It owns NO copy: every legal
 * string it renders is imported from `@/content/compliance` and `@/content/site`.
 *
 * ── CHROME DEPENDENCY (report, do not resolve here) ───────────────────────
 * docs/port/06-legal-pages.md §9 says these routes should use the shared
 * `<SiteNav />` / `<SiteFooter />`. `site/components/sections/` does not exist
 * yet (it is being written by a concurrent workflow), so `LegalChrome` and
 * `LegalFooter` below are a reduced, structurally-equivalent stand-in built from
 * the same content modules the real components will read (`content/nav.ts`,
 * `content/site.ts`, `content/compliance.ts`). Swapping them in is a two-line
 * change inside `LegalPage` — nothing else in this file or in the three routes
 * needs to move. Do NOT wrap a legal route in `SiteFooter` on top of this
 * chassis; that would render the disclosure twice.
 *
 * The compliance disclosure is a P0 gate on EVERY page (design ref 07, PHASE-1
 * §8.2), which is why the stand-in footer exists at all rather than the routes
 * shipping bare.
 *
 * ── Class-composition note ────────────────────────────────────────────────
 * `cn()` runs tailwind-merge, which treats `text-{size}` and `text-{color}` as
 * one group and silently drops one (see components/atoms/SectionHeader.tsx).
 * This file therefore uses literal className strings — no `cn()` — so a size
 * token and a colour token can safely sit side by side. Reading colour is set
 * once on the prose wrapper and inherited; only headings re-state it.
 *
 * ── Layout of record (docs/port/06-legal-pages.md §1.4) ───────────────────
 * Source `.legal` was `max-width: 860px; padding: 96px 48px` (64px/24px ≤640px).
 * Reproduced with Hokuten tokens as `container-hk` + `section-pad` + a 68ch
 * measure (design ref 07: line length 60–75ch). None of the source's literals
 * cross into this file — in particular its `--gold`, which is the KIT gold and
 * is permitted only inside raster assets. Website gold is a token, and hex lives
 * only in globals.css and design ref 01.
 */

import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { AccentRule } from "@/components/atoms/AccentRule";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { BROKERAGE_DISCLOSURE, KW_COMMERCIAL_MARK } from "@/content/compliance";
import { navCta, navLinks } from "@/content/nav";
import {
  BRAND_LINE,
  copyrightLine,
  footerLegalLinks,
  siteDomain,
} from "@/content/site";

/* -------------------------------------------------------------------------- */
/*  Shared class vocabulary                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Body links inside legal prose. Source rule was `gold + underline`
 * (privacy.html:52); `text-accent-text` resolves to `--accent-ink` on light,
 * which is the AA-measured accent-as-text tone in BOTH themes
 * (docs/design/CONTRAST.md). Never `text-accent` here — the decorative accent
 * fails AA as text on paper.
 */
export const LEGAL_LINK_CLASS =
  "text-accent-text underline decoration-1 underline-offset-4 hover:decoration-2";

/** 44px minimum tap target for every standalone (non-inline) link in the chrome. */
const TAP_TARGET = "inline-flex min-h-11 items-center";

/* -------------------------------------------------------------------------- */
/*  Chrome — nav                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Reduced nav. Same destinations as the landing nav (`content/nav.ts`), rewritten
 * from in-page anchors (`#listings`) to root-relative ones (`/#listings`) so a
 * legal route never emits a dead same-page anchor — flag F-5 in the port pack.
 *
 * No hamburger, no overlay, no JS: the link row wraps at 375px instead.
 */
function LegalChrome() {
  return (
    <header className="hairline-b">
      <div className="container-hk flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
        <Link href="/" className={`${TAP_TARGET} brand-line text-data`}>
          {BRAND_LINE}
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${link.href}`}
                  className={`${TAP_TARGET} micro-label hover:text-fg`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* D-VOCAB / R2 (2026-08-17): this was a hand-rolled FILLED gold pill
              (`rounded-pill bg-accent … text-on-accent`) that bypassed the CTA
              primitive, so the outlined-box swap in ui/button.tsx never reached
              the legal routes. It now goes through `Button` exactly as the
              landing nav does (SiteNav.tsx), which is also why the recipe can
              never diverge again. Guide v1.3 line 29: never filled buttons. */}
          <Button asChild variant="primary" size="md">
            <Link href={`/${navCta.href}`}>{navCta.label}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chrome — footer                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The reduced footer strip. The source legal pages rendered only `.footer-legal`
 * (privacy.html:151-156) rather than the full multi-column footer, and this keeps
 * that shape.
 *
 * `BROKERAGE_DISCLOSURE` is the byte-exact two-sentence CA DRE disclosure and is
 * imported, never retyped. The two elements render with a hard line break between
 * them, matching the source `<br>`.
 *
 * The KW Commercial mark is the ONLY place KW branding is permitted (AGENTS.md
 * guardrail): footer compliance mark, beside the disclosure, never in the header.
 * It keeps its own colours in both themes.
 */
function LegalFooter() {
  return (
    <footer className="hairline-t">
      <div className="container-hk py-12">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <nav aria-label="Policies">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {footerLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${TAP_TARGET} micro-label hover:text-fg`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Image
            src={KW_COMMERCIAL_MARK.src}
            alt={KW_COMMERCIAL_MARK.alt}
            width={72}
            height={72}
            className="h-14 w-14"
          />
        </div>

        <p className="mt-8 max-w-[68ch] text-data text-fg-meta">
          {BROKERAGE_DISCLOSURE[0]}
          <br />
          {BROKERAGE_DISCLOSURE[1]}
        </p>

        <p className="mt-4 text-data text-fg-meta">
          {siteDomain()}
          <span aria-hidden="true">&nbsp;&middot;</span> {copyrightLine()}
        </p>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page chassis                                                               */
/* -------------------------------------------------------------------------- */

export type LegalPageProps = {
  /**
   * Bracketed eyebrow words. Defaults to the source's `.eyebrow` text, "Legal".
   * The brackets are composed by `MicroLabel`; never pass them in.
   */
  eyebrow?: string;
  /** The single `h1`. */
  title: string;
  /**
   * The `.updated` line, e.g. "Last updated: June 4, 2026". SOURCE CASING is
   * preserved in the DOM and the `micro-label` utility uppercases it visually,
   * so the accessible name and any copy/paste keep the mixed-case original.
   */
  updated?: string;
  /** Unnumbered prose that sits between the header block and the first section. */
  lede?: ReactNode;
  /** The numbered `<LegalSection>` run. */
  children: ReactNode;
};

/**
 * One `h1`, a flat `h2` run beneath it, no skipped levels — the heading contract
 * both source pages already satisfied (port pack §2).
 */
export function LegalPage({
  eyebrow = "Legal",
  title,
  updated,
  lede,
  children,
}: LegalPageProps) {
  return (
    <div className="surface-paper flex min-h-dvh flex-col">
      <JsonLd />
      <LegalChrome />

      {/* `id="main"` is the target of the skip-link in app/layout.tsx.
          tabIndex -1 makes the landmark focusable so the skip actually moves focus. */}
      <main id="main" tabIndex={-1} className="flex-1">
        <div className="container-hk section-pad">
          <article className="max-w-[68ch]">
            <MicroLabel as="p">{eyebrow}</MicroLabel>

            <h1 className="mt-4 text-display2 font-display font-light text-fg">{title}</h1>

            {updated ? <p className="micro-label mt-4">{updated}</p> : null}

            <AccentRule width="md" className="mt-8" />

            <div className="mt-10 text-fg-muted">
              {lede}
              {children}
            </div>

            <p className="mt-16">
              <Link href="/" className={`${TAP_TARGET} micro-label hover:text-fg`}>
                Back to The Hokuten Group
              </Link>
            </p>
          </article>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section + block primitives                                                 */
/* -------------------------------------------------------------------------- */

export type LegalSectionProps = {
  /**
   * Stable id. It lands on the `h2` (so the section can point `aria-labelledby`
   * at it) and doubles as the deep-link anchor. Global `scroll-margin-top` in
   * globals.css clears the nav for it.
   */
  id: string;
  /**
   * The complete heading text INCLUDING its source number — "1. Information We
   * Collect". Section numbers are frozen: never renumber, never re-derive.
   */
  heading: string;
  children: ReactNode;
};

export function LegalSection({ id, heading, children }: LegalSectionProps) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="text-heading font-display font-light text-fg">
        {heading}
      </h2>
      {children}
    </section>
  );
}

/** A body paragraph. 18–20px at the `text-body-lg` step — the reading size. */
export function LegalP({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-body-lg">{children}</p>;
}

/**
 * The first lists in the legal body. Source CSS already carried
 * `.legal ul { padding-left: 22px }` for counsel-enriched sections that had not
 * yet been written (port pack §1.4) — these are those sections.
 */
export function LegalList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 ps-6 text-body-lg">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * The `.contact-block` — mono, line-height 1.9, one `<br>`-separated line per
 * entry (privacy.html:139-144). Reproduced with the site's `data-line` voice.
 */
export function LegalContactBlock({ lines }: { lines: readonly ReactNode[] }) {
  return (
    <p className="data-line mt-4 leading-[1.9]">
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </p>
  );
}
