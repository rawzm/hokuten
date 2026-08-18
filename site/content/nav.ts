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
 * on its own `<SectionHeader index="…">`. A number meant two different things
 * depending on where you saw it. `menuItems` uses THOSE SAME numbers, in that
 * same order — and the two are re-synced together whenever the page order
 * moves. Renumbering one without the other reintroduces that bug.
 *
 * ── Re-sequenced for the launch order (2026-08-17,
 *    docs/LAUNCH-IMPLEMENTATION.md §3.2, R5) ─────────────────────────────
 * `app/page.tsx` now renders Dino's named order: `#faq` and `#bov` move up to
 * sit directly after `#method`, and `#team` / `#doors` / `#mandates` follow the
 * ask. Both lists below were reordered and renumbered with it — verified
 * against the built sections themselves: ClosingsSection index="01",
 * ListingsSection "02", CalculatorSection "03", MethodSection "04",
 * FaqSection "05", BovSection defaults to "06", TeamSection "07",
 * DoorsSection "08", MandatesSection "09":
 *
 *   (unnumbered) The Group → #hero  — the lead item, deliberately uncounted
 *                                     (it is the masthead, not a chapter)
 *   01 Track Record        → #closings
 *   02 Listings            → #listings
 *   03 Valuation           → #calculator
 *   04 Method              → #method
 *   05 FAQ                 → #faq
 *   06 Contact             → #bov
 *   07 Team                → #team
 *   08 Doors               → #doors
 *   09 Mandates            → #mandates
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

/**
 * Centre links. Literal wayfinding — no cleverness, no invented section names.
 * Listed in RENDER order (`app/page.tsx`), which is also the order `SiteNav`'s
 * scroll-spy tie-break assumes: #closings → #listings → #calculator → #method
 * → #team. Same wording as the matching `menuItems` rows.
 */
export const navLinks = [
  { label: "Track Record", href: anchor("closings") },
  { label: "Listings", href: anchor("listings") },
  { label: "Valuation", href: anchor("calculator") },
  { label: "Method", href: anchor("method") },
  { label: "Team", href: anchor("team") },
] satisfies NavLink[];

/**
 * The primary CTA, right side of the bar. Rendered through `ui/button.tsx`'s
 * `primary` variant, which R2 (D-VOCAB, 2026-08-17) turned from a filled gold
 * PILL into a hairline-OUTLINED gold BOX — transparent ground and an accent
 * label at rest, gold ground only on hover/active. This entry carries the
 * string and the anchor only; the treatment lives in the Button component, so
 * nothing here needs to change again when the outline is retuned.
 *
 * Lowercase "written" is deliberate — it matches the hero CTA and ref 04. The
 * source site was inconsistent ("Request a Written BOV" in nav, "Request a
 * written BOV" in hero); this is the resolved form, used everywhere.
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
  { index: "05", label: "FAQ", href: anchor("faq") },
  { index: "06", label: "Contact", href: anchor("bov") },
  { index: "07", label: "Team", href: anchor("team") },
  { index: "08", label: "Doors", href: anchor("doors") },
  { index: "09", label: "Mandates", href: anchor("mandates") },
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
