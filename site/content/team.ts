/**
 * content/team.ts — the `#team` roster.
 *
 * ── 2026-08-17 rebuild: the six-seat launch roster (LAUNCH-IMPLEMENTATION §3.9,
 *    P8 / F26; decisions D6/D9/R7/R8/R9) ──────────────────────────────────────
 * Replaces the four-row provisional set (three principals + a combined
 * Jeong/Yangyang "Operations" row). The roster is now data-driven off a
 * `featured` flag: featured seats render a full `TeamCard` with bio and
 * portrait; the other three render as a compact roster row (name / title /
 * headshot / optional short bio) composed by `TeamSection`.
 *
 * Seat order and every printed title come from §3.9's table, which is itself
 * read off `ROLES` line 51 and `V2` §6. Nothing here is paraphrased.
 *
 * SOURCES (per field, no exceptions — nothing on this page may be invented):
 *   • Titles — §3.9 table ("Title on site — exact").
 *   • Featured bios — Appendix B7 (`V2` §6 approved role paragraphs), minus the
 *     name/title prefix the card already renders and minus B7's editorial
 *     instructions ("Site and cards render the title as Managing Director",
 *     "Display Florida BK3200675 after final profile approval").
 *   • Razim's bio — Appendix B14, verbatim. See the `provisional` note on his row.
 *   • Donna's bio + `bioShort` — Appendix B13, verbatim (her own text, supplied
 *     via Razim 2026-08-17); B13's roster cut is already written to ≤45 words.
 *   • Dino's email + phone — frozen port (`docs/port/04-copy.md` §6b–6c, the
 *     verbatim kwc `index.html:1135–1140` extract). Unchanged by this rebuild.
 *   • Dino's licence numbers — `docs/port/02-compliance.md` §1.1/§5.1 and
 *     Appendix B9's brokerage disclosure.
 *
 * ── NAME GUARDRAILS (both are hard, both have been wrong on this site before) ─
 *   • "Jae Hun Jeong" — **no middle initial, ever.** `ROLES` line 51 and his
 *     vCard both print the name with none, and Dino confirmed it (team chat
 *     2026-08-17 00:43). `V2` §6 inserts one and is wrong (X24).
 *   • "Donna Yangyang" — **one word.** Her vCard reads `N: Yangyang;Donna`. The
 *     old row here carried a middle name between the two; it must never come back.
 *
 * ── LICENCE POLICY (do not "helpfully" add a number to a seat) ───────────────
 *   • Dino — `CA DRE #01948432`, plus the brokerage number in `brokerageLicence`.
 *   • William — `Florida BK3200675`, active through 2028-03-31, ships per D9.
 *   • **Razim — no licence number and no licensed-activity claim (R8).** He is
 *     currently licensed (Illinois #475.213653) but is pausing that membership;
 *     lead qualification, LOI and PSA work run under Dino's licence and
 *     supervision. Rendering his number would go stale at the pause, so the site
 *     never renders one. Title only, like Marlon's.
 *   • Donna / Jae Hun / Marlon — no licence claim of any kind. Marlon's CA DRE
 *     record (salesperson 02086279, reviewed 2026-08-12) reads *Licensed NBA /
 *     No Current Responsible Broker*, so his card makes no active-broker,
 *     active-licensee or licensed-service claim.
 *   `dre` stays the **CA DRE** field, because `components/seo/JsonLd.tsx` emits
 *   it under the label "California DRE license" — William's Florida number
 *   therefore lives in `licence` only and must never be moved into `dre`.
 *
 * ── CONTACT: `email: ""` means "no contact channel", never an empty mailto ────
 * Only Dino has a published address. The outreach kit's approved routing is
 * explicit and names the destination: Donna, Jae and Marlon have "no direct
 * business contact field; all inquiries route through Dino Monteverde" — say
 * that (`TEAM_ROUTING`), never "through the team". `MANUAL` §4 does print
 * working addresses for the other seats while the vCards state a public email is
 * "not yet approved" (X25) — the site takes the conservative reading and ships
 * `email: ""` for every non-Dino seat. **Never invent a contact detail.**
 *
 * ── PORTRAIT GATE (G8 — per seat, non-negotiable) ────────────────────────────
 * `portraitApproved` is a required field so every new seat has to state a
 * position. No headshot publishes without the subject's recorded approval:
 *   • **William Betancourt — `false`.** He objected in team chat (2026-08-17
 *     16:07–16:16) to his image having been AI-processed, and his
 *     Hokuten-vs-SHG decision is still open (C16/C17). His card renders the
 *     `GlyphPlate`, not a portrait. Belt and braces: his prepped export is
 *     deliberately **not** copied into `public/team/`, so there is no published
 *     URL to leak even if the flag were flipped by accident. Clearing C17 means
 *     exporting the asset AND setting the flag AND setting `photo` — in that
 *     order, with the approval recorded in PROJECT-MEMORY.md.
 *   • Everyone else — `true`. Razim's portrait is the headshot he supplied and
 *     chose himself (2026-08-17), prepped to the canonical frame; the older
 *     `SUBJECT APPROVAL PENDING` files in `Ref/team/` are superseded and unused.
 *
 * Renderer notes (do not "fix" these in data):
 *   • `phone` is the source's dotted display format; the `tel:` href is E.164,
 *     derived at render time in `TeamCard`, not stored here.
 *   • Portraits are the canonical B&W cuts, all exported to exactly 900×1125
 *     (4/5). The masters are NOT one aspect — Jae Hun's is 0.750, the rest 0.800
 *     — so they are normalised on export and rendered at one CSS aspect with
 *     `object-fit: cover` (`PhotoFrame aspect="4/5"`), which keeps the grid even.
 *   • The recruiting card is removed and stays removed (`FINAL` Change 4).
 */

import type { TeamMember } from "@/lib/types";

/**
 * One seat on the roster. Extends the shared `TeamMember` contract rather than
 * editing `lib/types.ts`, which this task does not own — the added fields are
 * all roster-specific, and every consumer of `TeamMember` still type-checks.
 * (Contract gaps reported, not fixed: `email` should be optional, and the `dre`
 * field's doc-comment should say "CA DRE only".)
 */
export type TeamSeat = TeamMember & {
  /** Full card with bio + portrait (`true`) vs. compact roster row (`false`). */
  featured: boolean;
  /** ≤45-word roster cut. Absent = the row renders name/title only. */
  bioShort?: string;
  /** The licence line as printed on the card. Absent = **no licence claim**. */
  licence?: string;
  /** Second licence line — the brokerage of record, Dino's card only. */
  brokerageLicence?: string;
  /** G8 subject-approval gate. `false` renders the no-portrait plate. */
  portraitApproved: boolean;
};

export const team: TeamSeat[] = [
  {
    name: "Dino Monteverde",
    role: "Managing Director",
    // "Founder & Managing Director" is the LinkedIn headline and short-bio
    // form; the site, the team section and the cards render "Managing
    // Director" (§3.9 table, B7).
    titleStatus: "approved",
    // B7 role paragraph. Holds until Dino's own bio arrives.
    bio: "Team lead: sellers, listings, BOVs and valuations, pricing, top relationships, campaigns, DNC decisions, access, and final approvals.",
    featured: true,
    email: "dino.monteverde@kw.com",
    phone: "650.720.6995",
    dre: "CA DRE #01948432",
    licence: "CA DRE #01948432",
    brokerageLicence: "CA DRE #01870534",
    photo: "/team/dino-monteverde.jpg",
    portraitApproved: true,
  },
  {
    name: "Mohamed Razim Meeran",
    role: "Founding Team Member | Director",
    titleStatus: "approved", // R9
    // BIO STATUS: provisional — Appendix B14 is a DRAFT written for Razim from
    // `V2` §6 line 80 and his own description of the seat. He has not yet
    // approved his own words. Ships per §3.9; re-read it with him before
    // cutover. Carries no licence number and no licensed-activity claim (R8).
    bio: "Razim leads The Hokuten Group's systems: the website, CRM workflows and integrations, data quality and enrichment, dashboards, and the technology behind a100 Arms. He moves qualified buyer and owner conversations to the next step and supports LOI and purchase-and-sale workflows under Dino Monteverde's direction, and trains the team on its tools.",
    featured: true,
    // No published address (X25) — see the CONTACT note above.
    email: "",
    photo: "/team/razim-meeran.jpg",
    portraitApproved: true,
  },
  {
    name: "William Betancourt",
    role: "Founding Team Member | Director · Florida",
    titleStatus: "approved",
    // B7 role paragraph. Holds until William's own bio arrives.
    bio: "William supports Florida coverage and operational deal execution, including buyer conversations, tours, transaction milestones, LOI and purchase-and-sale workflows, and coordination through closing.",
    featured: true,
    email: "",
    licence: "Florida BK3200675",
    // PORTRAIT BLOCKED (G8 / C17) — no `photo`, and the prepped export is not
    // in `public/team/`. See the PORTRAIT GATE note above before changing this.
    portraitApproved: false,
  },
  {
    name: "Donna Yangyang",
    role: "Administrative Assistant & Transaction Support",
    titleStatus: "approved",
    // B13, verbatim — her own text, supplied via Razim 2026-08-17. A personal
    // history statement, NOT a Team coverage claim: the "all 50 states" phrase
    // describes her research background. The Team's brokerage-authority
    // sentence is governed by `MANUAL` §2 and lives in the compliance block.
    bio: "With experience dating back to 2005, she is a U.S. real estate researcher and title analyst with more than two decades of experience working with property records and title research. Over the years, she has developed a strong understanding of real estate documentation and due diligence across all 50 states. Her areas of expertise include title examination and abstracting, current ownership and mortgage searches, vacant land due diligence, tax sale and foreclosure title research, and surplus funds and excess proceeds recovery. She is known for being thorough, resourceful, and attentive to the details that matter. For the past four years, she has also served as an administrative assistant to Dino Monteverde, where she has gained valuable hands-on knowledge of the hotel business. This experience has broadened her professional background and strengthened the organizational, research, and administrative skills she brings to every project.",
    // B13's own ≤45-word roster cut — every phrase is hers, only compressed.
    bioShort:
      "U.S. real estate researcher and title analyst since 2005 — title examination and abstracting, ownership and mortgage searches, tax-sale and foreclosure title research across all 50 states. Administrative assistant to Dino Monteverde for the past four years, with hands-on knowledge of the hotel business.",
    featured: false,
    email: "",
    photo: "/team/donna-yangyang.jpg",
    portraitApproved: true,
  },
  {
    // No middle initial, ever. See the NAME GUARDRAILS note above.
    name: "Jae Hun Jeong",
    role: "Administrative Assistant & Transaction Support",
    titleStatus: "approved",
    // No bio has arrived. §3.9: roster seats with no text render name/title
    // only. B7's role paragraph is reserved for the FEATURED seats, so it is
    // deliberately NOT borrowed here — publishing his service history before he
    // has supplied it would be over-shipping.
    bio: "",
    featured: false,
    email: "",
    photo: "/team/jae-hun-jeong.jpg",
    portraitApproved: true,
  },
  {
    name: "Marlon Guzman",
    role: "Team Member | Southern California",
    titleStatus: "approved",
    // No bio has arrived — name/title only, as above. No licence claim of any
    // kind (see the LICENCE POLICY note).
    bio: "",
    featured: false,
    email: "",
    photo: "/team/marlon-guzman.jpg",
    portraitApproved: true,
  },
];

/** Full cards, in roster order. */
export const featuredTeam = team.filter((seat) => seat.featured);

/** Compact roster rows, in roster order. */
export const rosterTeam = team.filter((seat) => !seat.featured);

/**
 * The approved routing line for the seats with no direct contact field —
 * verbatim from the outreach kit (§3.9), which names the destination on
 * purpose. Never soften this to "the team".
 */
export const TEAM_ROUTING =
  "No direct business contact field; all inquiries route through Dino Monteverde.";

/**
 * The one place the G8 portrait gate is evaluated. Both renderers call it, so a
 * blocked seat cannot be published by a renderer that forgot the flag.
 */
export function seatPortrait(seat: TeamSeat): string | null {
  return seat.portraitApproved && seat.photo ? seat.photo : null;
}
