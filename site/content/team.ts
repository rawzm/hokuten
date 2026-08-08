/**
 * content/team.ts — the #team roster.
 *
 * Sources:
 *   • Dino's title, creds line, email and phone: docs/port/04-copy.md §6b–6c
 *     (verbatim extract of kwc index.html:1135–1140), re-read against
 *     ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html on 2026-08-08.
 *   • Every other card: design-skill reference 06, "Team bios (provisional
 *     generic set — decision 2026-08-07)". That file overrides the port pack.
 *   • Dino's DRE number: docs/port/02-compliance.md §1.1 / §5.1 and reference 06's
 *     compliance block — "Dino Monteverde, CA DRE #01948432."
 *
 * Evidence status (reference 06 register):
 *   • Dino creds line — `verified-current` (verbatim from the kwc `team-creds`
 *     block; the $200M+ / 12 transactions / 11+1 split / three-time CoStar Power
 *     Broker rows are each separately registered).
 *   • Razim / William / Jae / Donna — `verified-current as written`: provisional
 *     generic bios carrying zero numbers, zero awards, zero license claims, and
 *     zero brokerage verbs (PHASE-1-EXECUTION §compliance).
 *   • Omitted deliberately: the prior-affiliation "~$1B" narrative and the
 *     prior-affiliation testimonials (`pending-verification`), every KW
 *     corporate award (`prohibited`), and the source's "Platform" card, whose
 *     content is barred by the brand-scrub guardrail (port pack §6d).
 *
 * Voice: the source section is singular ("The practitioner.", one portrait, one
 * bio). This roster is the plural replacement Appendix A §2 asks for. Titles are
 * ported; no superlatives are added to any of them.
 *
 * CONTRACT GAP — `TeamMember.email` is required but only Dino has a sourced
 * address; nothing in the kwc source or reference 06 gives one for anyone else,
 * and inventing one is forbidden. Those cards carry an empty string. Consumers
 * MUST treat an empty `email` as "no contact channel" and render nothing — never
 * an empty `mailto:`. The contract fix is `email?: string` (reported, not made).
 *
 * Renderer notes (do not "fix" these in data):
 *   • `phone` is the source's dotted display format. The `tel:` href is E.164 —
 *     `tel:+16507206995` — derived at render time, not stored here.
 *   • `dre` is the bare license string. Wherever Dino appears in a broker
 *     capacity it must render with his name; the full two-sentence brokerage
 *     disclosure lives in the compliance block, not in this file.
 *   • Only Dino has a portrait in Phase 1 (reference 06: no portraits required
 *     for the Operations card).
 */

import type { TeamMember } from "@/lib/types";

export const team = [
  {
    name: "Dino Monteverde",
    role: "Senior Associate · Hospitality Investment Sales",
    bio: "$200M+ across 12 hospitality transactions — 11 hotel-asset transactions + 1 hotel-management-company M&A. Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026. USMC veteran. Former hotel owner-operator.",
    titleStatus: "approved",
    email: "dino.monteverde@kw.com",
    phone: "650.720.6995",
    dre: "CA DRE #01948432",
    photo: "/team/dino-monteverde.jpg",
    photoAlt: "Dino Monteverde",
  },
  {
    name: "Mohamed Razim Meeran",
    role: "Buyer Relations & Platform Technology",
    bio: "Buyer-side coverage for incoming hospitality investors. Builds and runs the group's data, marketing, and off-market platform infrastructure.",
    titleStatus: "provisional",
    // No sourced address. See the CONTRACT GAP note above.
    email: "",
  },
  {
    name: "William Betancourt",
    role: "Associate · Hospitality Investment Sales",
    bio: "Buy-side and sell-side transaction coverage across the group's national hospitality mandates.",
    titleStatus: "provisional",
    email: "",
  },
  {
    // Reference 06 lists Jae and Donna together on one card under "Operations".
    name: "Jae Hun Jeong & Donna Grace Yangyang",
    role: "Operations",
    bio: "Outreach, diligence coordination, and client care.",
    titleStatus: "provisional",
    email: "",
  },
] satisfies TeamMember[];
