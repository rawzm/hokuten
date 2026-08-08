/**
 * app/accessibility/page.tsx — `/accessibility`
 *
 * AUTHORED, not ported. The kwc source has no accessibility statement; this page
 * is required by docs/PHASE-1-EXECUTION.md §8.1 and is linked from the footer of
 * every page (`footerLegalLinks` in content/site.ts).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HONESTY RULE FOR THIS FILE
 *
 * This page must never claim conformance that has not been verified. It says we
 * AIM to conform to WCAG 2.1 Level AA, names the date of the last review, and
 * lists the limitations we know about. An accessibility statement that overstates
 * is worse than none: under the California Unruh Act it is an admission written
 * in our own hand.
 *
 * Sections 2 and 3 are split on purpose. Section 2 lists mechanisms this agent
 * READ in `site/app/globals.css` and `site/app/layout.tsx` and can therefore
 * state as built. Section 3 lists the standard every page is built to but whose
 * per-page implementation this agent did not audit — it carries a re-verification
 * marker. Do not merge the two sections, and do not promote an item from 3 to 2
 * without checking the shipped page.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Marker namespaces used here: `PLACEHOLDER:counsel` for wording that a lawyer
 * owns, `PLACEHOLDER:a11y` for claims an engineer must re-verify before this page
 * goes public. Both belong in docs/PLACEHOLDERS.md.
 */

import type { Metadata } from "next";

import {
  LEGAL_LINK_CLASS,
  LegalContactBlock,
  LegalList,
  LegalP,
  LegalPage,
  LegalSection,
} from "@/components/legal/LegalPage";
import { CONTACT, LEGAL_ROUTES, SITE_NAME } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Unlike `/privacy` and `/sms-terms`, nothing on this route is a frozen port, so
 * the title composes through the root layout template as
 * "Accessibility — The Hokuten Group". `robots` comes from `pageMetadata()` →
 * `robotsMeta()`: `noindex, nofollow` until `INDEXING_ENABLED` flips in
 * lib/seo.ts.
 */
export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description:
    "How this site is built for accessibility, what has been measured against WCAG 2.1 Level AA, the limitations we know about, and how to report a barrier.",
  path: LEGAL_ROUTES.accessibility,
});

/* -------------------------------------------------------------------------- */
/*  Copy                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The date of the last review, and the only date this page asserts. Update it
 * when a review actually happens — not when the file is edited.
 */
const LAST_REVIEWED = "Last reviewed: August 8, 2026";

const LEDE = `${SITE_NAME} aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. We treat that standard as binding rather than aspirational. This page records the standard we work to, what is built, what we know is still incomplete, and how to tell us about a barrier.`;

const STANDARD_BODY =
  "Our target is WCAG 2.1 Level AA. We aim to conform. We do not claim conformance: this site has not been reviewed by an independent auditor, and no Accessibility Conformance Report or VPAT exists for it. Where this page states that something is built, it means we have built and checked it ourselves.";

const BUILT_LEAD =
  "The following are implemented in the shared foundation every page on this site uses:";

const BUILT_ITEMS = [
  "A skip-to-content link as the first focusable element on the page, which becomes visible when it receives focus.",
  "A visible focus indicator on every link, button, form field and other interactive element — a 2px ring in a colour chosen for the surface behind it. It is never removed.",
  "Colour measured rather than estimated. Every text and interface colour pair is computed against WCAG 2.1 relative luminance in both of the site's themes, and pairs that fall below the threshold are recorded as unusable for text and are not bound to any text colour in the stylesheet.",
  "Support for the reduced-motion setting in your operating system. Animation is reduced to a still state site-wide, and moving decoration holds its first frame rather than vanishing.",
  "Moving content that pauses. The franchise-flag marquee and the market ticker stop when a pointer rests on them and when anything inside them receives keyboard focus.",
  "Form fields that never drop below 16px, so a mobile browser does not zoom when you focus one.",
  "Headings and anchors that account for the fixed navigation bar, so following a link does not leave its target hidden behind the header.",
  "A print stylesheet, because owners print listings and closing records.",
] as const;

const REQUIRED_LEAD =
  "Every page is additionally built to the following requirements. They are part of our definition of done rather than an aspiration, but this page is not the record of a per-page audit — see section 5.";

const REQUIRED_ITEMS = [
  "Semantic landmarks on every page — header, navigation, one main region, footer — with exactly one h1 and headings in order, no levels skipped.",
  "Full keyboard operability. Everything reachable by pointer is reachable and operable by keyboard, in a sensible order, with no trap.",
  "Real visible labels on form fields. A placeholder is never used in place of a label.",
  "Errors reported in text and with an icon, never by colour alone, and associated with their field so assistive technology announces them.",
  "Body text at 16px or larger, 18 to 20px in reading sections, and a line length between 60 and 75 characters.",
  "Touch targets of at least 44 by 44 pixels. Nothing on this site requires a drag, a long press, or knowledge of a gesture — scrolling and tapping complete every task.",
  "No information conveyed by hover alone, so a touch device is never told less than a desktop.",
  "Alternative text that describes the subject of a photograph rather than its treatment.",
  "A text description beside the decorative ASCII artwork. The artwork itself is hidden from assistive technology, so nothing is lost when it is skipped.",
] as const;

const CHECKS_LEAD = "How we check:";

const CHECKS_ITEMS = [
  "Automated checks with axe-core on each route.",
  "A keyboard-only pass over each section as it is built.",
  "A screen-reader pass on the hero, the valuation calculator and the request form.",
  "A pass at 375px (iPhone SE), at laptop width and at desktop width, and a pass with the reduced-motion setting on.",
] as const;

const LIMITATIONS_LEAD =
  "We would rather list these than let you discover them:";

const LIMITATIONS_ITEMS = [
  "No independent audit. Nobody outside the team has reviewed this site, and there is no conformance report.",
  "The site is still being built. Sections are checked as they land, so at any moment some part of the site has had less scrutiny than the rest.",
  "The valuation calculator produces a dense numeric result. Its behaviour with a screen reader has not been reviewed yet.",
  "Some destinations are not ours. Property listings open on Crexi and scheduling runs through a third-party service; their accessibility is outside our control, and we link to them rather than reproduce them.",
  "We have not tested every combination of browser and assistive technology.",
  "Colour contrast is measured for the colours defined in our stylesheet. Colour inside fixed images — the franchise marks and the Keller Williams Commercial compliance mark — is not ours to change and has not been measured.",
] as const;

const REPORT_BODY =
  "If any part of this site blocks you, tell us and we will fix it. Describing the page, what you were trying to do, and the browser and assistive technology you were using lets us reproduce the problem rather than guess at it.";

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility"
      updated={LAST_REVIEWED}
      lede={<LegalP>{LEDE}</LegalP>}
    >
      {/* PLACEHOLDER:counsel — confirm the conformance-statement wording ("aims to conform", no claim of conformance, no VPAT) is what the sponsoring brokerage wants on the record, and whether Forward Wilshire requires its own accessibility contact or policy reference here. */}
      <LegalSection id="standard" heading="1. The standard we work to">
        <LegalP>{STANDARD_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:a11y — every item in this list was verified by reading site/app/globals.css and site/app/layout.tsx on 2026-08-08. Re-verify against the shipped pages before this route is made public, and move any item that no longer holds into section 5. */}
      {/* PLACEHOLDER:a11y — this section cites the repository path docs/design/CONTRAST.md, which is acceptable while the site is internal-only. Replace it with a plain description or a public link before public launch. */}
      <LegalSection id="built" heading="2. What is built">
        <LegalP>{BUILT_LEAD}</LegalP>
        <LegalList items={BUILT_ITEMS} />
        <LegalP>
          The contrast matrix behind the third item — every pair, in both themes,
          with its measured ratio — is kept in the repository at
          docs/design/CONTRAST.md and is re-run whenever a colour changes.
        </LegalP>
      </LegalSection>

      {/* PLACEHOLDER:a11y — this section states the build standard, NOT the result of a per-page audit. Before public launch, audit each shipped page against these nine items and either move verified items into section 2 or record the gap in section 5. */}
      <LegalSection id="requirements" heading="3. What every page is built to">
        <LegalP>{REQUIRED_LEAD}</LegalP>
        <LegalList items={REQUIRED_ITEMS} />
      </LegalSection>

      {/* PLACEHOLDER:a11y — these four checks are the testing plan in docs/PHASE-1-EXECUTION.md §8.1. Confirm each has actually been run, on which routes and on what date, before this page is public; drop any check that has not been run rather than describing it in the present tense. */}
      <LegalSection id="checks" heading="4. How we check">
        <LegalP>{CHECKS_LEAD}</LegalP>
        <LegalList items={CHECKS_ITEMS} />
      </LegalSection>

      <LegalSection id="limitations" heading="5. Known limitations">
        <LegalP>{LIMITATIONS_LEAD}</LegalP>
        <LegalList items={LIMITATIONS_ITEMS} />
      </LegalSection>

      {/* PLACEHOLDER:counsel — set a response-time commitment for accessibility reports and state it here, and confirm whether a dedicated accessibility address is required in addition to dino.monteverde@kw.com. No commitment is stated below because none has been agreed. */}
      <LegalSection id="report" heading="6. Report a barrier">
        <LegalP>{REPORT_BODY}</LegalP>
        <LegalContactBlock
          lines={[
            <>
              Email:{" "}
              <a href={CONTACT.emailHref} className={LEGAL_LINK_CLASS}>
                {CONTACT.email}
              </a>
            </>,
            <>
              Phone:{" "}
              <a href={CONTACT.phoneHref} className={LEGAL_LINK_CLASS}>
                {CONTACT.phoneInternational}
              </a>
            </>,
          ]}
        />
      </LegalSection>
    </LegalPage>
  );
}
