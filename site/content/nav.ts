/**
 * Navigation content: sticky bar links + CTA, the numbered menu overlay, and the
 * overlay's footer utilities.
 *
 * Source: .agents/skills/hokuten-design-director/references/04-page-anatomy.md
 * ("Nav") — labels and the 8-item overlay index are quoted from that spec.
 * The kwc nav (docs/port/04-copy.md §2) does NOT port: its co-brand lockup leads
 * with the KW mark, and its labels ("Hotels for Sale", "Hotel Worth Calculator",
 * "Methodology", "Marketplace") belong to a different IA.
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
 * Eight items, serif index, mapped to real anchors exactly as ref 04 specifies.
 * Body scroll is locked while the overlay is open; the close control is an X.
 */
export const menuItems = [
  { index: "01", label: "The Group", href: anchor("hero") },
  { index: "02", label: "Listings", href: anchor("listings") },
  { index: "03", label: "Track Record", href: anchor("closings") },
  { index: "04", label: "Valuation", href: anchor("calculator") },
  { index: "05", label: "Method", href: anchor("method") },
  { index: "06", label: "Mandates", href: anchor("mandates") },
  { index: "07", label: "Team", href: anchor("team") },
  { index: "08", label: "Contact", href: anchor("bov") },
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
