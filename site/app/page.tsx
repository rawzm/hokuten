/**
 * app/page.tsx — the Phase 1 landing route.
 *
 * Section order is fixed by design-skill reference 04 (page anatomy):
 *   hero → stats → brands → closings → listings → calculator → method →
 *   doors → mandates → team → faq → bov → footer + persistent ticker
 *
 * This file stays a Server Component. Every client island lives inside its own
 * component so the landing route's JS budget (180KB gzip, ref 05) is spent
 * deliberately rather than by pulling a boundary up to the page.
 *
 * `Hero` selects the theme chassis internally (dark cover panel for Theme G,
 * the Coronal plate for Theme B) — the page never branches on theme.
 */

import type { Metadata } from "next";

import { Hero } from "@/components/hero/Hero";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { BovSection } from "@/components/sections/BovSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
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

      <main id="main" tabIndex={-1}>
        <Hero />
        <StatsSection />
        <BrandsSection />
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
