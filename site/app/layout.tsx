import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConsentProvider } from "@/components/modals/ConsentProvider";
import { TickerBar } from "@/components/ticker/TickerBar";
import { THEME, themePresentation } from "@/lib/theme";
import "./globals.css";

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

const SITE_NAME = "The Hokuten Group";
const SITE_DESCRIPTION =
  "Hospitality investment sales, nationwide. $200M+ closed across 12 hospitality transactions. Written BOV in 48 hours on receipt of T-12, STR, and PIP.";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Hospitality Investment Sales`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Hospitality Investment Sales`,
    description: SITE_DESCRIPTION,
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
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/* ConsentProvider belongs HERE, not on the landing page.
            It installs the measurement guard that <Analytics /> and
            <SpeedInsights /> below respect. Mounted only on `/`, a stored
            "Reject all" was silently ignored on /privacy, /sms-terms and
            /accessibility — the visitor was measured with no way to decline,
            while our own consent copy claimed otherwise. Compliance P0,
            found by the ship gate 2026-08-08. */}
        <ConsentProvider>{children}</ConsentProvider>

        {/* Outside {children} on purpose: app/template.tsx wraps children in a
            transform for the route transition, and a transformed ancestor
            becomes the containing block for `position: fixed`, detaching the
            ticker from the viewport for the length of every navigation. */}
        <TickerBar />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
