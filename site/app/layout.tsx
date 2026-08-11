import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LazyMotion, domAnimation } from "motion/react";
import { BrandLoader } from "@/components/loader/BrandLoader";
import { ConsentProvider } from "@/components/modals/ConsentProvider";
import { TickerBar } from "@/components/ticker/TickerBar";
import { stats } from "@/content/stats";
import { SITE_NAME } from "@/content/site";
import { THEME, themePresentation } from "@/lib/theme";
import "./globals.css";

/**
 * D16 loader gate (docs/DESIGN-REVISIT-2.md §6.3) — a `beforeInteractive`
 * script, verified against this repo's own `node_modules/next/dist/client/
 * script.js`: strategy `"beforeInteractive"` is injected into the initial
 * server-rendered HTML and, per Next's own implementation, guaranteed to run
 * BEFORE any page JS hydrates, regardless of where in the tree this element
 * is placed. That is the one guarantee this whole mechanism depends on — a
 * plain `useEffect` inside BrandLoader.tsx runs AFTER the browser has already
 * painted the raw SSR HTML at least once, which is too late to prevent
 * either direction of flash (loader-over-content OR raw-content-before-
 * loader). This script decides BEFORE that first paint, so there is nothing
 * to correct after the fact.
 *
 * ALL this script does is decide "should the loader run this load?" and, if
 * so, stamp `data-loader-pending` onto `<html>` — a presence-only attribute
 * BrandLoader.tsx's own render-blocking CSS keys off (see that file's header,
 * "THE GATE ATTRIBUTE," for the full contract and why the literal string is
 * duplicated rather than shared as a JS import across this boundary). It
 * never touches scroll, timers, or anything else — that is BrandLoader.tsx's
 * job once it mounts and finds the attribute present.
 *
 * DECISION, per D16's CONDITIONS:
 *   - Navigation Timing `type === "back_forward"` → never show (covers real
 *     back/forward reloads; bfcache restoration doesn't re-run this script
 *     at all, so it is already excluded structurally, not by this check).
 *   - `type === "reload"` → always show, a hard refresh, regardless of
 *     whether this session has already shown it once.
 *   - Anything else (a fresh `"navigate"`, or an unsupported/absent
 *     Navigation Timing entry) → show only once per `sessionStorage`-tracked
 *     browser session.
 * `sessionStorage` and `performance.getEntriesByType` are both wrapped in one
 * `try`; ANY failure (storage denied, private-mode throw, API absent) FAILS
 * OPEN — the attribute is simply never set, so BrandLoader's CSS default
 * (hidden) stands and the real page shows immediately. This must never fail
 * toward showing an overlay this script cannot reason about clearing.
 */
const LOADER_GATE_SCRIPT = `(function () {
  try {
    var KEY = "hk-loader-seen";
    var entries =
      typeof performance !== "undefined" && performance.getEntriesByType
        ? performance.getEntriesByType("navigation")
        : [];
    var navType = entries && entries[0] ? entries[0].type : undefined;
    if (navType === "back_forward") return;
    var seen = window.sessionStorage.getItem(KEY) === "1";
    if (navType !== "reload" && seen) return;
    window.sessionStorage.setItem(KEY, "1");
    document.documentElement.setAttribute("data-loader-pending", "");
  } catch (e) {}
})();`;

/* Three voices, no more (ref 01). Self-hosted by next/font at build time —
   zero runtime CDN font requests. ≤2 files per family (ref 05 perf gate). */

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

/* ---------------------------------------------------------------------------
   Metadata description.

   The figures are READ FROM content/stats.ts, never retyped. This file used to
   hardcode "$200M+ closed across 12 hospitality transactions", which is a
   second, unowned copy of two register-backed numbers — the day stats.ts is
   corrected, a stale claim keeps shipping in the document head where nobody
   looks. Composition is byte-identical to the string that was hardcoded here.

   `statValue` throws rather than falling back. A silent fallback is how the
   drift being fixed got in; if a label is renamed in stats.ts the build should
   stop. It belongs in content/stats.ts as a shared helper — it lives here only
   because this agent does not own that file. See the build report.

   NOT the same string as content/site.ts's SITE_DESCRIPTION, deliberately: that
   one is the verbatim port of the source `og:description` (index.html:20) and is
   what app/page.tsx and lib/seo.ts serve. This one is the proof-carrying
   fallback for any route that does not set its own description.
   --------------------------------------------------------------------------- */

function statValue(label: string): string {
  const row = stats.find((stat) => stat.label === label);
  if (!row) {
    throw new Error(
      `content/stats.ts has no row labelled "${label}" — the metadata description cannot be composed without it.`,
    );
  }
  return row.value;
}

const METADATA_DESCRIPTION = `Hospitality investment sales, nationwide. ${statValue(
  "Aggregate volume",
)} closed across ${statValue(
  "Closed transactions",
)} hospitality transactions. Written BOV in 48 hours on receipt of T-12, STR, and PIP.`;

/* `SITE_NAME` is imported from content/site.ts, not redeclared — the local copy
   was byte-identical to the export and there is only ever one site name.

   Wider consolidation, deliberately NOT done here: lib/seo.ts already exports
   `buildMetadata()`, written to replace this whole object. Adopting it is the
   right end state but it is not a no-op — it would change the root title to the
   tracked-caps `SITE_TITLE`, swap this description for content/site.ts's
   `SITE_DESCRIPTION`, and add metadataBase / canonical / OG images / robotsMeta.
   That is an SEO decision for the main loop, coordinated with app/page.tsx.
   Note while deciding: every route today (page.tsx, privacy, sms-terms,
   accessibility) sets its own `description`, so the string below is currently
   shadowed everywhere — correct, and inert until a route stops overriding it. */
export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Hospitality Investment Sales`,
    template: `%s — ${SITE_NAME}`,
  },
  description: METADATA_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: themePresentation.favicon,
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Hospitality Investment Sales`,
    description: METADATA_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Hospitality Investment Sales`,
    description: METADATA_DESCRIPTION,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: themePresentation.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={THEME}
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        {/* Must run before hydration — see the file-level comment above
            LOADER_GATE_SCRIPT. Placement in the tree does not matter for
            `beforeInteractive` (Next hoists it into the document regardless),
            but it sits first for readability: it is the first decision made
            on every load. */}
        <Script id="hk-loader-gate" strategy="beforeInteractive">
          {LOADER_GATE_SCRIPT}
        </Script>

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/* D7 LazyMotion boundary (2026-08-08). Every `m.*` element in the app
            resolves its renderer from LazyContext via React context — a
            component with no <LazyMotion> ancestor gets `lazyContext.renderer
            === undefined` and never mounts a visualElement at all (verified
            against framer-motion 13.0.0's useVisualElement source, not
            memory). So this provider must be a genuine ANCESTOR of every
            `m.*` render site, not just "present somewhere on the page".
            That's exactly why it lives here and not inside app/template.tsx:
            ConsentProvider renders <ConsentModal> (a Dialog, i.e. `m.div` ×2
            + AnimatePresence) as a SIBLING of {"{children}"} below, not a
            descendant — template.tsx only wraps {"{children}"}, so a
            provider placed there would silently leave the consent modal
            un-animated on every route. Wrapping here also covers <TickerBar
            /> should it ever grow a motion element. `domAnimation` (not
            domMax) is deliberate: it buys animation + exit + hover/tap/focus/
            inView, never drag or layout — this codebase has zero `drag` or
            `layout`/`layoutId` props on any motion element (grepped
            repo-wide), so domMax's extra ~cost buys nothing here.
            LazyMotion is already a "use client" component inside the motion
            package itself, so wrapping it around {"{children}"} here does
            NOT make this Server Component client — {"{children}"} is passed
            through as a prop from the server render, same as any other
            Client Component "slot" composition (ConsentProvider, one line
            up, already does exactly this). */}
        <LazyMotion features={domAnimation}>
          {/* ConsentProvider belongs HERE, not on the landing page.
              It installs the measurement guard that <Analytics /> and
              <SpeedInsights /> below respect. Mounted only on `/`, a stored
              "Reject all" was silently ignored on /privacy, /sms-terms and
              /accessibility — the visitor was measured with no way to decline,
              while our own consent copy claimed otherwise. Compliance P0,
              found by the ship gate 2026-08-08. */}
          <ConsentProvider>{children}</ConsentProvider>

          {/* Outside {children} on purpose: app/template.tsx wraps children in
              a transform for the route transition, and a transformed
              ancestor becomes the containing block for `position: fixed`,
              detaching the ticker from the viewport for the length of every
              navigation. Still inside <LazyMotion> — see note above. */}
          <TickerBar />
        </LazyMotion>

        {/* D16 — last in the tree on purpose. `position: fixed` means DOM
            order has no effect on its z-stacked visual coverage, so it is
            placed here (after everything else that mounts on every route)
            rather than disturbing the ConsentProvider/LazyMotion nesting
            above, per this file's "mount narrowly, do not restructure"
            brief. It does not need <LazyMotion>: BrandLoader.tsx is
            deliberately plain-CSS, no motion/react, for reasons documented
            in that file's own header. */}
        <BrandLoader />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
