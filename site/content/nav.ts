/**
 * Navigation content: sticky bar links + CTA, the numbered menu overlay, and the
 * overlay's footer utilities.
 *
 * Source: .agents/skills/hokuten-design-director/references/04-page-anatomy.md
 * ("Nav"). The kwc nav (docs/port/04-copy.md §2) does NOT port: its co-brand
 * lockup leads with the KW mark, and its labels ("Hotels for Sale", "Hotel
 * Worth Calculator", "Methodology", "Marketplace") belong to a different IA.
 *
 * ── `menuItems` renumbered (audit decision 2026-08-08, docs/DESIGN-REVISIT.md
 *    §4.3) — kills the conflicting second index ──────────────────────────
 * The old 8-item list ran its own standalone 01-08 order, independent of and
 * inconsistent with the numbered micro-label every section already carries
 * on its own `<SectionHeader index="…">` (verified against the built
 * sections themselves: ClosingsSection index="01", ListingsSection "02",
 * CalculatorSection "03", DoorsSection "05", MandatesSection "06",
 * TeamSection "07", FaqSection "08", BovSection defaults to "09" — "04" for
 * #method is implied by the sequence though that section's own header does
 * not yet render an index prop, which is that section's owner's concern,
 * not this file's). A number meant two different things depending on where
 * you saw it. `menuItems` now uses THOSE SAME numbers, in that same order:
 *
 *   (unnumbered) The Group  → #hero      — the lead item, deliberately
 *                                           uncounted (it is the masthead,
 *                                           not a numbered chapter)
 *   01 Track Record          → #closings
 *   02 Listings              → #listings
 *   03 Valuation              → #calculator
 *   04 Method                 → #method
 *   05 Doors                  → #doors
 *   06 Mandates                → #mandates
 *   07 Team                    → #team
 *   08 FAQ                      → #faq
 *   09 Contact                   → #bov
 *
 * #doors and #faq were previously ABSENT from the overlay entirely (the old
 * 8-item list skipped them) — both are included here so the sequence runs
 * unbroken 01-09, per the brief: "an unbroken 01-09 index is the whole point
 * of a numbered index." "Track Record" / "Valuation" / "Contact" reuse the
 * exact wording `navLinks`/`footerColumns` below already use for the same
 * anchors, rather than inventing new synonyms; "Doors" and "FAQ" are literal,
 * short wayfinding words matching this file's existing no-cleverness style
 * (not the sections' own longer marketing headlines — see DoorsSection's
 * `label="The Owner / The Investor"` / `headline="Two doors, one *house*."`,
 * neither of which is nav-label shaped).
 *
 * Evidence status: `verified-current` — literal wayfinding, no claims.
 * Anchors are typed through `anchor()`, so a dead destination cannot compile.
 */

import type { MenuItem, NavLink } from "@/lib/types";
import { A100_ARMS_SIGNUP_URL, CONTACT, anchor } from "./site";

/* -------------------------------------------------------------------------- */
/*  Sticky bar                                                                 */
/* -------------------------------------------------------------------------- */

/** Centre links. Literal wayfinding — no cleverness, no invented section names. */
export const navLinks = [
  { label: "Listings", href: anchor("listings") },
  { label: "Track Record", href: anchor("closings") },
  { label: "Valuation", href: anchor("calculator") },
  { label: "Method", href: anchor("method") },
  { label: "Team", href: anchor("team") },
] satisfies NavLink[];

/**
 * The gold pill, right side of the bar. Lowercase "written" is deliberate — it
 * matches the hero CTA and ref 04. The source site was inconsistent
 * ("Request a Written BOV" in nav, "Request a written BOV" in hero); this is the
 * resolved form, used everywhere.
 */
export const navCta = {
  label: "Request a written BOV",
  href: anchor("bov"),
} satisfies NavLink;

/* -------------------------------------------------------------------------- */
/*  Numbered menu overlay (mobile + desktop overflow)                          */
/* -------------------------------------------------------------------------- */

/**
 * Ten items — one unnumbered lead ("The Group") plus the canonical 01-09
 * sequence shared with every section's own micro-label index (see file
 * header). Serif index, mapped to real anchors. Body scroll is locked while
 * the overlay is open; the close control is an X.
 */
export const menuItems = [
  { index: "", label: "The Group", href: anchor("hero") },
  { index: "01", label: "Track Record", href: anchor("closings") },
  { index: "02", label: "Listings", href: anchor("listings") },
  { index: "03", label: "Valuation", href: anchor("calculator") },
  { index: "04", label: "Method", href: anchor("method") },
  { index: "05", label: "Doors", href: anchor("doors") },
  { index: "06", label: "Mandates", href: anchor("mandates") },
  { index: "07", label: "Team", href: anchor("team") },
  { index: "08", label: "FAQ", href: anchor("faq") },
  { index: "09", label: "Contact", href: anchor("bov") },
] satisfies MenuItem[];

/* -------------------------------------------------------------------------- */
/*  Overlay footer utilities                                                   */
/* -------------------------------------------------------------------------- */

export type MenuUtilities = {
  phone: NavLink;
  email: NavLink;
  /** Ghost link to the confidential channel; opens in a new tab with `rel="noopener"`. */
  privateAccess: NavLink & { external: true };
};

/**
 * Phone · email · the PRIVATE ACCESS ghost link, along the bottom of the overlay.
 * The email label is the address itself (the header/footer variants copy it to the
 * clipboard and flash "Copied"; inside the overlay a plain `mailto:` is correct —
 * the overlay is already a navigation surface).
 *
 * "PRIVATE ACCESS" is set in the mono tracked-caps micro-label voice, so the label
 * ships uppercase; the trailing arrow (→) is a rendering affordance, not content.
 */
export const menuUtilities = {
  phone: { label: CONTACT.phone, href: CONTACT.phoneHref },
  email: { label: CONTACT.email, href: CONTACT.emailHref },
  privateAccess: {
    label: "PRIVATE ACCESS",
    href: A100_ARMS_SIGNUP_URL,
    external: true,
  },
} satisfies MenuUtilities;
