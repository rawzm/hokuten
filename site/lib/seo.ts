/**
 * lib/seo.ts — the single source of site metadata.
 *
 * Everything that needs to know "where does this site live" and "what does a
 * link preview say" reads from here: `app/layout.tsx` (via `buildMetadata()`),
 * every legal route (via `pageMetadata()`), `app/sitemap.ts`, `app/robots.ts`,
 * and `components/seo/JsonLd.tsx`.
 *
 * Identity strings are NOT authored in this file. Name, title, description,
 * contact and routes are imported from `@/content/site`; legal strings come from
 * `@/content/compliance`. This module composes them — it never retypes them.
 *
 * ---------------------------------------------------------------------------
 * SERVER-SIDE ONLY (by construction, not by secret).
 *
 * The Vercel host variables read below are not `NEXT_PUBLIC_*`, so they are not
 * inlined into the client bundle; in a client component they would silently
 * resolve to the localhost fallback. Nothing here is a credential — no key of
 * any class is read, logged, or emitted — but this module is still meant for
 * Server Components, `generateMetadata`, and the metadata file conventions only.
 * (`server-only` is not a dependency of this app, so the constraint is stated
 * rather than enforced by the compiler.)
 * ---------------------------------------------------------------------------
 */

import type { Metadata } from "next";

import { themePresentation } from "@/lib/theme";
import {
  LEGAL_ROUTES,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_TITLE,
} from "@/content/site";

/* -------------------------------------------------------------------------- */
/*  Canonical origin                                                           */
/* -------------------------------------------------------------------------- */

/**
 * `blocked: domain-unconfirmed` — PROJECT-MEMORY §5 open item, "Confirm exact
 * live domain (thehokutengroup.com assumed) + Vercel DNS on Dino's GoDaddy".
 *
 * NO DOMAIN IS HARD-CODED IN THIS FILE. `content/site.ts` owns the single
 * `SITE_DOMAIN` constant and it is deliberately `null` until DNS is cut over.
 * The origin therefore resolves from the deployment itself, in this order:
 *
 *   1. `SITE_DOMAIN` from content/site.ts — set this ONE constant at cutover and
 *      every canonical, OG url, sitemap entry and JSON-LD `@id` follows.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — the project's stable production host
 *      (same value on every deploy, including previews). This is what makes a
 *      preview build emit production canonicals rather than its own throwaway
 *      hostname.
 *   3. `VERCEL_URL` — the per-deployment host. Only reached on a deployment that
 *      predates the production alias; correct-but-ephemeral, which is acceptable
 *      because indexing is off (see `INDEXING_ENABLED`).
 *   4. `http://localhost:3000` — local dev.
 *
 * Never add a fifth branch that guesses a domain.
 */
export type SiteUrlSource =
  | "content/site.ts SITE_DOMAIN"
  | "VERCEL_PROJECT_PRODUCTION_URL"
  | "VERCEL_URL"
  | "localhost fallback";

const LOCALHOST_ORIGIN = "http://localhost:3000";

/**
 * Vercel supplies bare hosts (`hokuten.vercel.app`), never a scheme, and never a
 * trailing slash. Both are normalised anyway so a hand-set `SITE_DOMAIN` written
 * as `https://example.com/` cannot produce `https://https://example.com//`.
 */
function normalizeOrigin(rawHost: string): string | null {
  const host = rawHost.trim().replace(/\/+$/, "");
  if (host.length === 0) return null;
  if (host.startsWith("http://") || host.startsWith("https://")) return host;
  return `https://${host}`;
}

function resolveSiteOrigin(): { origin: string; source: SiteUrlSource } {
  const configured = SITE_DOMAIN === null ? null : normalizeOrigin(SITE_DOMAIN);
  if (configured) {
    return { origin: configured, source: "content/site.ts SITE_DOMAIN" };
  }

  const productionHost = normalizeOrigin(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "",
  );
  if (productionHost) {
    return { origin: productionHost, source: "VERCEL_PROJECT_PRODUCTION_URL" };
  }

  const deploymentHost = normalizeOrigin(process.env.VERCEL_URL ?? "");
  if (deploymentHost) {
    return { origin: deploymentHost, source: "VERCEL_URL" };
  }

  return { origin: LOCALHOST_ORIGIN, source: "localhost fallback" };
}

const resolved = resolveSiteOrigin();

/** Canonical origin for this build. No trailing slash. */
export const SITE_URL: string = resolved.origin;

/** Which branch of `resolveSiteOrigin()` produced `SITE_URL`. Launch-checklist aid. */
export const SITE_URL_SOURCE: SiteUrlSource = resolved.source;

/** `true` once `SITE_DOMAIN` is set — i.e. the domain question is closed. */
export const SITE_URL_IS_CONFIRMED_DOMAIN: boolean =
  resolved.source === "content/site.ts SITE_DOMAIN";

/** `metadataBase` for Next's metadata resolver. */
export const METADATA_BASE = new URL(SITE_URL);

/** Absolute URL for an app-relative path. `absoluteUrl("/privacy")` → `<origin>/privacy`. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, `${SITE_URL}/`).href;
}

/* -------------------------------------------------------------------------- */
/*  Indexing gate                                                              */
/* -------------------------------------------------------------------------- */

/**
 * ============================ THE LAUNCH SWITCH =============================
 * `blocked: paperwork-gate` — AGENTS.md hard guardrail: "Do not deploy publicly
 * under the Hokuten name until the KW / Forward Wilshire paperwork gate clears."
 *
 * While this is `false`:
 *   · `robots.ts`      emits `User-agent: * / Disallow: /` and no `Sitemap:` line
 *   · `buildMetadata()` emits `<meta name="robots" content="noindex, nofollow">`
 *
 * TO GO LIVE, in this order:
 *   1. Close the paperwork gate and log a dated PROJECT-MEMORY.md decision.
 *   2. Set `SITE_DOMAIN` in `content/site.ts` to the confirmed domain
 *      (`blocked: domain-unconfirmed` — see above). Do this FIRST: flipping the
 *      switch while the origin still resolves from `VERCEL_URL` would publish a
 *      sitemap and canonicals pointing at a deployment hostname.
 *   3. Flip this ONE constant to `true`. Nothing else changes.
 * ============================================================================
 */
export const INDEXING_ENABLED: boolean = false;

/* -------------------------------------------------------------------------- */
/*  Routes in the sitemap                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Every real route. The landing page is a single-document site — the thirteen
 * sections are in-page anchors (`content/site.ts` `SECTION_IDS`) and anchors are
 * not sitemap entries. The three legal routes come from `LEGAL_ROUTES` so a
 * renamed route cannot desynchronise from the footer.
 *
 * Port rule R8: `/privacy`, `/sms-terms` and `/accessibility` must stay publicly
 * indexable once indexing is on — they are the pages the 10DLC registration and
 * the accessibility statement point at.
 */
export const INDEXABLE_ROUTES = [
  "/",
  LEGAL_ROUTES.privacy,
  LEGAL_ROUTES.smsTerms,
  LEGAL_ROUTES.accessibility,
] as const satisfies readonly string[];

export type IndexableRoute = (typeof INDEXABLE_ROUTES)[number];

/**
 * `lastModified` for every sitemap row, held CONSTANT so static output is
 * deterministic across builds (same convention as `COPYRIGHT_YEAR` in
 * content/site.ts — `new Date()` here would churn the sitemap on every deploy
 * and teach crawlers to distrust the timestamp). Bump by hand when page content
 * materially changes, and note the bump in PROJECT-MEMORY.md.
 */
export const CONTENT_LAST_MODIFIED = "2026-08-08";

/* -------------------------------------------------------------------------- */
/*  Open Graph card                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The link-preview card, per active theme.
 *
 * Theme G ships `/og/og-gold.png`, Theme B `/og/og-blue.png`; the path comes
 * from `themePresentation.ogImage` so the branch-scoped `theme-blue` build picks
 * up its own card with zero code diff.
 *
 * These are STATIC PNGs generated by the asset workflow into `site/public/og/`.
 * There is deliberately NO `app/opengraph-image.tsx` — the file convention would
 * shadow this wiring and re-render the card per request for no benefit.
 *
 * `alt` is `SITE_TITLE`, imported. The kwc card's alt asserted a job title, a
 * division name and a phone number in raster; none of that is reproduced.
 */
export const OG_IMAGE = {
  url: themePresentation.ogImage,
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
  type: "image/png",
} as const;

function ogImages() {
  return [
    {
      url: absoluteUrl(OG_IMAGE.url),
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
      alt: OG_IMAGE.alt,
      type: OG_IMAGE.type,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*  Titles                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Root title. `SITE_TITLE` is already the composed team-first form
 * ("THE HOKUTEN GROUP — Hospitality Investment Sales"); child routes compose
 * through `TITLE_TEMPLATE` as "Privacy Policy — The Hokuten Group".
 */
export const TITLE_TEMPLATE = `%s — ${SITE_NAME}` as const;

/* -------------------------------------------------------------------------- */
/*  Metadata builders                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Root metadata for `app/layout.tsx`.
 *
 * Adopt with `export const metadata: Metadata = buildMetadata();` and delete the
 * layout's local `SITE_NAME` / `SITE_DESCRIPTION` duplicates — those strings
 * belong to `content/site.ts`.
 */
export function buildMetadata(): Metadata {
  return {
    metadataBase: METADATA_BASE,
    title: {
      default: SITE_TITLE,
      template: TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    icons: {
      icon: themePresentation.favicon,
      apple: "/brand/apple-touch-icon.png",
    },
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: absoluteUrl("/"),
      images: ogImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: ogImages(),
    },
    robots: robotsMeta(),
  };
}

/** Per-route metadata input. `path` is the real route, always leading-slashed. */
export type RouteMetadataInput = {
  title: string;
  description: string;
  path: `/${string}`;
};

/**
 * Metadata for a child route (`/privacy`, `/sms-terms`, `/accessibility`).
 *
 * `title` is the bare page title — the layout template appends the brand.
 * URLs are emitted ABSOLUTE rather than relying on `metadataBase`, so a route is
 * correct even if `app/layout.tsx` has not adopted `buildMetadata()` yet.
 */
export function pageMetadata(input: RouteMetadataInput): Metadata {
  const url = absoluteUrl(input.path);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url,
      images: ogImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: ogImages(),
    },
    robots: robotsMeta(),
  };
}

/**
 * The `<meta name="robots">` value, driven by the one launch switch.
 * `noimageindex` keeps closing/listing photography out of image search while the
 * site is internal-only.
 */
export function robotsMeta(): NonNullable<Metadata["robots"]> {
  if (INDEXING_ENABLED) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    };
  }
  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  };
}
