/**
 * app/page.tsx — the Phase 1 landing route.
 *
 * TWELVE SCREENS (DESIGN-REVISIT-2 §0). Each carries `page-panel`, and on a
 * qualifying desktop each boundary settles like a page:
 *
 *   1 hero (owns the brand rail)   2 trust metrics   3 01-track record
 *   4 02-hotels for sale           5 03-valuation    6 04-method
 *   7 05-doors                     8 06-mandates     9 07-team
 *  10 08-faq                      11 09-bov         12 footer
 *
 * `#brands` is NOT a separate screen — D2 moved the franchise rail inside the
 * hero panel, so `Hero` renders `<BrandsMarquee />` itself. Rendering the
 * standalone `<BrandsSection />` here too would put two `<section id="brands">`
 * elements in one document.
 *
 * This file stays a Server Component. Every client island lives inside its own
 * component so the landing route's JS budget is spent deliberately rather than
 * by pulling a boundary up to the page. The budget is D7's, re-based
 * 2026-08-08: critical path ≤200KB gzip, full landing route ≤340KB gzip.
 * (It previously said 180KB — ref 05's original figure, which was measured to
 * be unreachable against a 129KB framework floor.)
 *
 * Both themes now share ONE hero chassis; the theme governs chrome only.
 */

import type { Metadata } from "next";

import { Hero } from "@/components/hero/Hero";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { BovSection } from "@/components/sections/BovSection";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { ClosingsSection } from "@/components/sections/ClosingsSection";
import { DoorsSection } from "@/components/sections/DoorsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ListingsSection } from "@/components/sections/ListingsSection";
import { MandatesSection } from "@/components/sections/MandatesSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteNav } from "@/components/sections/SiteNav";
import { StatsSection } from "@/components/sections/StatsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/content/site";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <JsonLd />
      <SmoothScroll />

      <SiteNav />

      {/* `data-page="home"` was D10's route marker for scroll snap. D22 removed
          snap entirely (Razim rejected it on a live render), so nothing keys off
          this today — it is kept because it costs nothing and leaves a clean
          route hook for any future landing-only rule. */}
      <main id="main" data-page="home" tabIndex={-1}>
        {/* D2 (Razim, 2026-08-08) moved the franchise-flag band INTO the hero's
            first viewport, so `Hero` now renders `<BrandsMarquee />` itself as a
            sibling landmark after `<section id="hero">`. The standalone
            `<BrandsSection />` that used to sit here is gone — rendering both
            would put two `<section id="brands">` elements in one document. */}
        <Hero />
        <StatsSection />
        <ClosingsSection />
        <ListingsSection />
        <CalculatorSection />
        <MethodSection />
        <DoorsSection />
        <MandatesSection />
        <TeamSection />
        <FaqSection />
        <BovSection />
      </main>

      <SiteFooter />
    </>
  );
}
