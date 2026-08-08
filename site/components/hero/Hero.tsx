/**
 * components/hero/Hero.tsx — the chassis switch.
 *
 * Reads `themePresentation.heroChassis` (`@/lib/theme`) and renders
 * `HeroCoverPanel` ("cover-panel", Theme G) or `HeroPlate` ("plate", Theme B).
 * This is the ONLY place the hero chassis is selected — `app/page.tsx` (and
 * any future route) imports `Hero`, never the two chassis components
 * directly, so a third theme/chassis pair only ever requires editing here.
 *
 * `THEME`/`themePresentation` are resolved once at build time from
 * `NEXT_PUBLIC_HOKUTEN_THEME` (PROJECT-MEMORY 2026-08-07 dual-theme decision),
 * so exactly one branch below renders per deploy — `main` ships
 * `HeroCoverPanel`, `theme-blue` ships `HeroPlate`.
 *
 * Server Component — a plain conditional, no client JS of its own.
 */

import { themePresentation } from "@/lib/theme";
import { HeroCoverPanel } from "./HeroCoverPanel";
import { HeroPlate } from "./HeroPlate";

export function Hero() {
  return themePresentation.heroChassis === "cover-panel" ? <HeroCoverPanel /> : <HeroPlate />;
}
