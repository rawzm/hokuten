/**
 * Site-level constants: identity, section order, footer IA, external destinations.
 *
 * Sources:
 *   - .agents/skills/hokuten-design-director/references/04-page-anatomy.md
 *     (Nav · Section order · Footer)
 *   - .agents/skills/hokuten-design-director/references/01-brand.md (Identity)
 *   - PROJECT-MEMORY.md §1 (tagline stack, domain), §4 (open items)
 *   - docs/port/04-copy.md §1 (head metadata), §8 (a100 Arms), §9 (footer columns)
 *
 * Evidence status: `verified-current`. Every string here is either brand identity
 * from ref 01 / PROJECT-MEMORY, a verbatim source URL, or literal wayfinding.
 * No metric, award, coverage or capability claim is authored in this file — the
 * source's "Personal practice site of…" line is deliberately NOT ported
 * (prior-affiliation guardrail).
 *
 * SUPERSEDED 2026-08-09 (DESIGN-REVISIT §5.1, a compliance P0 from the ship
 * gate): this comment used to say the source's nationwide/partner-brokerage
 * line was also unported for want of a register row. It now HAS a register row
 * (ref 06) and ships — but as OUT_OF_STATE_QUALIFIER in content/compliance.ts,
 * ported byte-exact from the brokerage-of-record card at index.html:1152, not
 * from the run-on footer variant at :1249 that this comment was describing.
 * Compliance strings live in compliance.ts; this file still authors none.
 *
 * Unprovisioned values are exported as `null` with a `blocked:` marker and a
 * safe fallback. Never invent a URL.
 */

import type { NavLink } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Identity                                                                   */
/* -------------------------------------------------------------------------- */

/** Prose form. Ref 01 Identity. The spelling is HOKUTEN everywhere (brand guardrail). */
export const SITE_NAME = "The Hokuten Group";

/** Tracked-caps brand line as set in text (`letter-spacing: 0.35em`, accent). */
export const BRAND_LINE = "THE HOKUTEN GROUP";

/**
 * The brand tagline, from `GUIDE` line 37 and `PROFILE` (docs/LAUNCH-IMPLEMENTATION.md
 * §3.11, R15). It is a brand line, not a claim — no number, no coverage
 * assertion, no award reference — so it carries no register row.
 *
 * ONE PLACEMENT, SITE-WIDE: a mono kicker beneath the footer lockup
 * (`components/sections/SiteFooter.tsx`), rendered uppercase by the mono-label
 * type tokens while the source string stays sentence case so assistive tech
 * reads words rather than shouted caps. It does NOT go in the hero, a headline,
 * `<title>`, the meta description or the OG card — `V2` never uses it and
 * `EDITS` carried it only as an optional footer line, so it gets exactly one
 * restrained placement. Grep-enforced at §7.3 (one occurrence in `site/`,
 * which is why no comment in this repo's `site/` tree repeats the words).
 */
export const BRAND_TAGLINE = "True north for hotel owners";

/**
 * Brand hierarchy as it reads on official assets (PROJECT-MEMORY §1, ref 01).
 * On the WEBSITE the hierarchy inverts — Hokuten leads and KW Commercial is a
 * footer compliance mark only. Use this stack for lockup-faithful surfaces
 * (OG card, covers), not for the header.
 */
export const TAGLINE_STACK = [
  "KW COMMERCIAL",
  "THE HOKUTEN GROUP",
  "HOSPITALITY INVESTMENT SALES",
  "NATIONWIDE COVERAGE",
] as const;

/** Person-agnostic, team-first. Shape proposed in docs/port/04-copy.md §1 flags. */
export const SITE_TITLE = "THE HOKUTEN GROUP — Hospitality Investment Sales";

/** Verbatim from the source `og:description` (index.html:20) — already team-neutral. */
export const SITE_DESCRIPTION =
  "Hospitality investment sales across the United States. Data-grounded pricing. Disciplined open-market execution. Closed deals.";

/** Copyright segment of the footer legal row. Source year, held constant so SSG output is deterministic. */
export const COPYRIGHT_YEAR = 2026;
export const COPYRIGHT_HOLDER = BRAND_LINE;
export function copyrightLine(year: number = COPYRIGHT_YEAR): string {
  return `© ${year} ${COPYRIGHT_HOLDER}. All rights reserved.`;
}

/* -------------------------------------------------------------------------- */
/*  Section order — ref 04 "Section order" (13 entries, page order)             */
/* -------------------------------------------------------------------------- */

/**
 * Every in-page anchor, in render order. Entry 13 is ref 04's
 * "Footer + persistent #ticker (fixed bottom)" — the footer shares that slot and
 * carries no anchor of its own.
 *
 * RE-SEQUENCED 2026-08-17 with the launch reorder (docs/LAUNCH-IMPLEMENTATION.md
 * §3.2, R5): #faq and #bov move above #team/#doors/#mandates. The order is
 * load-bearing — `SiteNav.tsx` builds `DOM_ORDER` from this array's INDEX to
 * break scroll-spy ties, so a stale sequence silently mis-highlights the nav.
 * Keep it in step with `app/page.tsx` and `content/nav.ts`.
 */
export const SECTION_IDS = [
  "hero",
  "stats",
  "brands",
  "closings",
  "listings",
  "calculator",
  "method",
  "faq",
  "bov",
  "team",
  "doors",
  "mandates",
  "ticker",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** `anchor("closings")` → `"#closings"`. Typed so a dead anchor cannot compile. */
export function anchor(id: SectionId): string {
  return `#${id}`;
}

/* -------------------------------------------------------------------------- */
/*  Contact — ref 06 team roster (Dino row, `verified-current`)                 */
/* -------------------------------------------------------------------------- */

export const CONTACT = {
  email: "dino.monteverde@kw.com",
  emailHref: "mailto:dino.monteverde@kw.com",
  /** Display form, index.html:1237. */
  phone: "650.720.6995",
  phoneHref: "tel:+16507206995",
  /**
   * Spaced E.164 display form used on the legal pages and in the registered
   * 10DLC HELP sample (sms-terms.html:99). Do not reformat — the on-page HELP
   * contact and the registered HELP reply must match.
   */
  phoneInternational: "+1 650 720 6995",
} as const;

/* -------------------------------------------------------------------------- */
/*  Routes                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Legal + policy routes. `/privacy` and `/sms-terms` are confirmed targets
 * (docs/port/06-legal-pages.md §Targets); `/accessibility` is the WCAG 2.1 AA
 * statement page required by docs/PHASE-1-EXECUTION.md §8.1 and linked in the footer.
 * All three must stay publicly indexable (port rule R8).
 */
export const LEGAL_ROUTES = {
  privacy: "/privacy",
  smsTerms: "/sms-terms",
  accessibility: "/accessibility",
} as const;

/* -------------------------------------------------------------------------- */
/*  External destinations                                                      */
/* -------------------------------------------------------------------------- */

/** a100 Arms — the confidential channel. Brand casing is `a100 Arms`, always. */
export const A100_ARMS_URL = "https://a100arms.com";

/**
 * The invite / signup destination behind every "Private access" and off-market
 * CTA on the site. Verbatim from index.html:1225, :1246, :1868 (`SIGNUP_URL`).
 * Opens in a new tab with `rel="noopener"`.
 *
 * Deployment note (2026-08-18): this file changed intentionally to trigger the
 * Vercel auto-deploy path from GitHub integration.
 */
export const A100_ARMS_SIGNUP_URL = "https://a100arms.com/signup";

/** Crexi broker profile — "View all listings on Crexi". index.html:869, :1120. */
export const CREXI_PROFILE_URL =
  "https://www.crexi.com/profile/dino-monteverde-dinomon";

/**
 * The public investor-community invite (docs/LAUNCH-IMPLEMENTATION.md §3.11,
 * Appendix B10 — `V2` §11 step 8). This is the controlling invite. The earlier
 * invite named in that appendix is historical and must never be restored; this
 * comment does not repeat its id, because §7.3 greps `site/` for it and expects
 * zero hits.
 *
 * Renders ONCE, in the footer legal block, with `WHATSAPP_DISCLOSURE`
 * (content/compliance.ts) immediately adjacent — the phone-visibility and
 * vetting disclosure is part of the link, not a separate nicety. Opens in a new
 * tab with `rel="noopener noreferrer"` like every other external destination
 * here. The community name is Dino's own (`Ref/listings/README.md` carries the
 * HOKUTEN-branded flyer for it), not authored copy.
 *
 * Unlike a100 Arms this is a PUBLIC channel: it is not the confidential
 * off-market lane, so it must never be labelled as private access.
 */
export const WHATSAPP_COMMUNITY = {
  label: "Hotel Investor Network on WhatsApp",
  href: "https://chat.whatsapp.com/Jk5rP0D1ad4J68SnGo8KJG",
} as const;

export const EXTERNAL_URLS = {
  a100Arms: A100_ARMS_URL,
  a100ArmsSignup: A100_ARMS_SIGNUP_URL,
  crexiProfile: CREXI_PROFILE_URL,
  whatsappCommunity: WHATSAPP_COMMUNITY.href,
} as const;

/* -------------------------------------------------------------------------- */
/*  Unprovisioned constants — never invent a value                             */
/* -------------------------------------------------------------------------- */

/**
 * PROVISIONED 2026-08-17 (F36). Dino's verified scheduling link, from the
 * verified-public-links list he delivered (`V2` §8 line 119, transcribed in
 * docs/LAUNCH-IMPLEMENTATION.md Appendix B11). This clears `blocked:
 * calendly-url` / PLACEHOLDERS.md #29 — the calculator's tertiary CTA
 * (`components/calculator/CalculatorResult.tsx`) stops degrading to
 * CALENDLY_FALLBACK and now opens the real popup widget on first click.
 *
 * TWO CONSEQUENCES, both deliberate and both recorded rather than hidden:
 *   1. The Calendly widget script is fetched from assets.calendly.com on first
 *      CTA click (never before) — a third-party request the site did not make
 *      while this was null. PLACEHOLDERS.md #12 (privacy processor list) is
 *      the row that now has to name Calendly as live.
 *   2. `hide_gdpr_banner=1` is still deliberately NOT appended (PLACEHOLDERS.md
 *      #44 / #13). Suppressing a third party's own consent prompt stays a
 *      decision nobody has made; provisioning the URL does not make it.
 *
 * The `string | null` annotation is kept on purpose: every caller still guards,
 * so reverting to null is a one-token change and no null-check goes stale.
 */
export const CALENDLY_URL: string | null =
  "https://calendly.com/dino-monteverde-kw";

/** Where a scheduling CTA lands while CALENDLY_URL is null. */
export const CALENDLY_FALLBACK = "#bov";

/** Resolved scheduling destination. Use this rather than reading CALENDLY_URL directly. */
export function schedulingHref(): string {
  return CALENDLY_URL ?? CALENDLY_FALLBACK;
}

/**
 * `blocked: domain-unconfirmed` — "thehokutengroup.com" is assumed, not confirmed
 * (PROJECT-MEMORY open item: "Confirm exact live domain (thehokutengroup.com
 * assumed) + Vercel DNS on Dino's GoDaddy"). Set this once DNS is cut over.
 *
 * Single source of truth (port pack §4.1): the same value feeds the footer's
 * tracked-domain segment and the BOV form's email subject. Do not hard-code a
 * domain string anywhere else.
 */
export const SITE_DOMAIN: string | null = null;

/** The deploy host that is live today (PROJECT-MEMORY 2026-08-07: project `hokuten`). */
export const SITE_DOMAIN_FALLBACK = "hokuten.vercel.app";

/** Resolved display domain. */
export function siteDomain(): string {
  return SITE_DOMAIN ?? SITE_DOMAIN_FALLBACK;
}

/* -------------------------------------------------------------------------- */
/*  Footer IA — ref 04 "Footer" (Quick Links · For Owners · For Buyers)         */
/* -------------------------------------------------------------------------- */

/** A footer link. `external` links open in a new tab with `rel="noopener"`. */
export type FooterLink = NavLink & { external?: true };

export type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

/**
 * Three columns, every destination a real anchor or a real route.
 *
 * Fixed from the source rather than ported (docs/port/04-copy.md §9 flags):
 *   - `marketplace.html` is dropped — Phase 1 has no /marketplace route (Phase 3).
 *   - "Email Dino" becomes team-first "Email the team".
 *   - "Sell Your Hotel" and "Request a Written BOV" both pointed at `#bov`;
 *     the duplicate is replaced by the real `#doors` owner panel.
 *   - `#methodology` becomes `#method`; `Contact` resolves to `#bov` (the source's
 *     `#contact` id lived on a `<p>` inside the BOV section).
 */
export const footerColumns = [
  {
    heading: "Quick Links",
    links: [
      { label: "Hotels for sale", href: anchor("listings") },
      { label: "Hotel worth calculator", href: anchor("calculator") },
      { label: "Recent closings", href: anchor("closings") },
      { label: "How we run a sale", href: anchor("method") },
      { label: "Contact", href: anchor("bov") },
    ],
  },
  {
    heading: "For Owners",
    links: [
      { label: "Request a written BOV", href: anchor("bov") },
      { label: "The owner's path", href: anchor("doors") },
      { label: "Diligence FAQ", href: anchor("faq") },
      { label: "Email the team", href: CONTACT.emailHref },
    ],
  },
  {
    heading: "For Buyers",
    links: [
      { label: "Active listings", href: anchor("listings") },
      { label: "Capital & mandates", href: anchor("mandates") },
      { label: "Request invite to a100 Arms", href: A100_ARMS_SIGNUP_URL, external: true },
    ],
  },
] satisfies FooterColumn[];

/**
 * Legal row links, left of the frozen disclosure block.
 * The disclosure text itself lives in content/compliance.ts — never retype it.
 */
export const footerLegalLinks = [
  { label: "Privacy Policy", href: LEGAL_ROUTES.privacy },
  { label: "SMS Terms", href: LEGAL_ROUTES.smsTerms },
  { label: "Accessibility", href: LEGAL_ROUTES.accessibility },
] satisfies FooterLink[];
