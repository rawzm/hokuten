import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
