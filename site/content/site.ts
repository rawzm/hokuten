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
 * source's "Nationwide coverage delivered through formal partner-brokerage
 * relationships in every U.S. state." and "Personal practice site of…" lines are
 * deliberately NOT ported (no register row / prior-affiliation guardrail).
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
 */
export const SECTION_IDS = [
  "hero",
  "stats",
  "brands",
  "closings",
  "listings",
  "calculator",
  "method",
  "doors",
  "mandates",
  "team",
  "faq",
  "bov",
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
 */
export const A100_ARMS_SIGNUP_URL = "https://a100arms.com/signup";

/** Crexi broker profile — "View all listings on Crexi". index.html:869, :1120. */
export const CREXI_PROFILE_URL =
  "https://www.crexi.com/profile/dino-monteverde-dinomon";

export const EXTERNAL_URLS = {
  a100Arms: A100_ARMS_URL,
  a100ArmsSignup: A100_ARMS_SIGNUP_URL,
  crexiProfile: CREXI_PROFILE_URL,
} as const;

/* -------------------------------------------------------------------------- */
/*  Unprovisioned constants — never invent a value                             */
/* -------------------------------------------------------------------------- */

/**
 * `blocked: calendly-url` — the team Calendly URL is not provisioned
 * (PROJECT-MEMORY open item: "Provision: new Web3Forms access key + team Calendly
 * URL"). The kwc value is Dino's personal link and does not carry over.
 * Every caller must degrade to CALENDLY_FALLBACK.
 */
export const CALENDLY_URL: string | null = null;

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
