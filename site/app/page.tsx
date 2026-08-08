/**
 * app/page.tsx — the Phase 1 landing route.
 *
 * Section order is fixed by design-skill reference 04 (page anatomy):
 *   hero → stats → brands → closings → listings → calculator → method →
 *   doors → mandates → team → faq → bov → footer + persistent ticker
 *
 * INTERIM STATE (2026-08-08). Three pieces are not built yet — SiteNav, the
 * Hero chassis pair (HeroCoverPanel / HeroPlate), TeamSection and
 * CalculatorSection. Rather than invent imports that will not compile, the
 * missing ones render a visible `blocked:` block so a reviewer can see exactly
 * what is absent, and the hero below is a deliberately temporary composition
 * over the real pre-generated ASCII art. See docs/RESUME.md §4.
 *
 * When the real components land: delete InterimHero and the Blocked blocks,
 * import Hero / SiteNav / TeamSection / CalculatorSection, and drop them in.
 */

import type { Metadata } from "next";

import { AsciiStatic } from "@/components/art/AsciiStatic";
import { ConsentProvider } from "@/components/modals/ConsentProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { BovSection } from "@/components/sections/BovSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
// Default export — the section agents were not consistent about this; normalise
// to named exports in the cleanup pass (docs/RESUME.md §6).
import ClosingsSection from "@/components/sections/ClosingsSection";
import { DoorsSection } from "@/components/sections/DoorsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ListingsSection } from "@/components/sections/ListingsSection";
import { MandatesSection } from "@/components/sections/MandatesSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { StatsSection } from "@/components/sections/StatsSection";
import { TickerBar } from "@/components/ticker/TickerBar";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/content/site";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

/* -------------------------------------------------------------------------- */
/*  Interim scaffolding — deleted once the real components land                */
/* -------------------------------------------------------------------------- */

/**
 * A visible, honest gap marker. Not styled to look finished: a reviewer must be
 * able to tell instantly that this is missing work rather than a design choice.
 */
function Blocked({ id, label, note }: { id: string; label: string; note: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-blocked`}
      className="surface-paper section-pad"
    >
      <div className="container-hk">
        <div className="hairline rounded-card border-dashed p-8">
          <p className="micro-label text-brick">[ BLOCKED — NOT BUILT ]</p>
          <h2 id={`${id}-blocked`} className="text-heading mt-3 text-fg">
            {label}
          </h2>
          <p className="text-body mt-2 max-w-[65ch] text-fg-muted">{note}</p>
        </div>
      </div>
    </section>
  );
}

const HERO_RAIL = ["DISCRETION", "DATA", "EXECUTION", "CLOSED DEALS"] as const;

/**
 * Temporary hero. The real chassis pair is theme-aware (dark cover panel for
 * Theme G, the Coronal plate for Theme B) and drives the ASCII canvas with the
 * pointer shimmer and the ambient morph loop. This one renders the static
 * pre-generated frame only — enough to review the art, the type ramp and the
 * copy, and nothing more.
 *
 * Copy uses only claims with a verified-current row in skill ref 06: the BOV
 * promise renders WITH its condition, which is part of the claim.
 */
function InterimHero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="surface-black relative overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60">
        <AsciiStatic className="h-full w-full object-cover" description={null} />
      </div>

      <div className="container-hk relative py-[clamp(6rem,4rem+12vw,12rem)]">
        <div className="max-w-[52ch]">
          <p className="micro-label">[ HOSPITALITY INVESTMENT SALES — NATIONWIDE ]</p>

          <h1 id="hero-heading" className="text-display1 mt-6 text-fg">
            Hospitality investment sales for owners who want the number{" "}
            <em className="font-display italic">defended</em>, not guessed.
          </h1>

          <p className="text-body-lg mt-6 max-w-[46ch] text-fg-muted">
            A written BOV in 48 hours, on receipt of your T-12, STR, and PIP.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#bov"
              className="rounded-pill bg-accent px-7 py-3.5 text-body font-medium text-on-accent duration-fast ease-out"
            >
              Request a written BOV
            </a>
            <a
              href="#closings"
              className="hairline rounded-pill px-7 py-3.5 text-body text-fg duration-fast ease-out"
            >
              See the track record
            </a>
          </div>
        </div>
      </div>

      <ul
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
      >
        {HERO_RAIL.map((item) => (
          <li key={item} className="micro-label [writing-mode:vertical-rl]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <ConsentProvider>
      <JsonLd />
      <SmoothScroll />

      <Blocked
        id="nav-blocked"
        label="Sticky nav + numbered menu overlay"
        note="SiteNav and MenuOverlay are not built. Anchor links, the scroll-sentinel dark/light switch and the 8-item numbered overlay are missing; every section below is still reachable by scrolling."
      />

      <main id="main">
        <InterimHero />
        <StatsSection />
        <BrandsSection />
        <ClosingsSection />
        <ListingsSection />

        <Blocked
          id="calculator"
          label="Hotel valuation calculator"
          note="The frozen engine (lib/valuation.ts) and its golden tests are done, as are the step, result and benchmark components. The Calculator shell and CalculatorSection wrapper that compose them are not."
        />

        <MethodSection />
        <DoorsSection />
        <MandatesSection />

        <Blocked
          id="team"
          label="The principals"
          note="TeamSection and TeamCard are not built. Bios, contact rows and Dino's CA DRE number are already typed in content/team.ts."
        />

        <FaqSection />
        <BovSection />
      </main>

      <SiteFooter />
      <TickerBar />
    </ConsentProvider>
  );
}
