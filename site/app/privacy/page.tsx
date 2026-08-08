/**
 * app/privacy/page.tsx — `/privacy`
 *
 * VERBATIM PORT of ~/Documents/Dino/dino-sites/kwc-dinomonteverde/privacy.html
 * (174 lines, effective 2026-06-04), re-read against the read-only source on
 * 2026-08-08. Extraction of record: docs/port/06-legal-pages.md §3.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PERMITTED LEGAL-STRING SUBSTITUTIONS: NONE.
 *
 * Do not re-wrap a sentence, do not smarten a quote, do not turn an em dash into
 * a hyphen, do not renumber a section, do not convert the source's singular
 * voice to "we" inside legal copy. Sections 1–9 are the shipped kwc policy;
 * sections 10–12 are appended (never inserted) so the source numbering can
 * never shift. See docs/port/06-legal-pages.md §6 for the frozen-string register
 * and §8 for the marker table.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Why the body copy lives in module constants rather than inside JSX text: JSX
 * collapses newlines and runs of whitespace, so a Prettier reflow of a long
 * paragraph could silently alter a frozen string. As constants the bytes are
 * fixed, greppable, and diffable against the source. The only non-ASCII
 * characters in this file's legal copy are U+2014 EM DASH and U+00B7 MIDDLE DOT
 * — every apostrophe and quotation mark is ASCII, exactly as in the source.
 *
 * Entity names, licence numbers and the registered 10DLC brand string are NOT
 * retyped here: they are interpolated from `@/content/compliance`, which is the
 * frozen register. Each composed string is annotated with the source line whose
 * bytes it reproduces.
 */

import type { Metadata } from "next";
import Link from "next/link";

import {
  LEGAL_LINK_CLASS,
  LegalContactBlock,
  LegalList,
  LegalP,
  LegalPage,
  LegalSection,
} from "@/components/legal/LegalPage";
import {
  BROKERAGE_OF_RECORD,
  DRE_BROKERAGE,
  SMS_CONSENT,
} from "@/content/compliance";
import { CONTACT, LEGAL_ROUTES } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

/* -------------------------------------------------------------------------- */
/*  Metadata — privacy.html:6-8                                                */
/* -------------------------------------------------------------------------- */

/*
  PLACEHOLDER:counsel — page title/description still name Dino Monteverde only;
  update to The Hokuten Group when the KW / Forward Wilshire naming gate clears.
  (docs/port/06-legal-pages.md P-10 / flag F-3.)
*/
const FROZEN_TITLE = "Privacy Policy — Dino Monteverde";
const FROZEN_DESCRIPTION =
  "Privacy Policy for Dino Monteverde (KW Commercial), including SMS / text-messaging data practices.";

/**
 * `title.absolute` bypasses the root layout's `%s — The Hokuten Group` template,
 * so the frozen string ships byte-exact instead of gaining a second brand.
 * Verified against `next/dist/lib/metadata/resolvers/resolve-title.js` (an
 * `absolute` member short-circuits the template) and
 * `next/dist/lib/metadata/resolve-metadata.js:807` (the Open Graph and Twitter
 * templates are stashed from the PARENT's `openGraph.title.template` /
 * `twitter.title.template`, which the root layout leaves unset — so those two
 * pass through untemplated and `pageMetadata()`'s values stand as written,
 * card image and canonical included).
 *
 * `robots` comes from `pageMetadata()` → `robotsMeta()`, which emits
 * `noindex, nofollow` while `INDEXING_ENABLED` is false in lib/seo.ts. That is
 * the launch switch; do not hand-write a robots value here.
 *
 * NOTE for the launch checklist: docs/port/06-legal-pages.md §9 expects
 * `index, follow` on this route once the site is public — flipping
 * `INDEXING_ENABLED` in lib/seo.ts does that for all three legal routes at once.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    title: FROZEN_TITLE,
    description: FROZEN_DESCRIPTION,
    path: LEGAL_ROUTES.privacy,
  }),
  title: { absolute: FROZEN_TITLE },
};

/* -------------------------------------------------------------------------- */
/*  Frozen body copy — privacy.html:111-147                                    */
/* -------------------------------------------------------------------------- */

/** privacy.html:113. Mixed case in the DOM; `micro-label` uppercases visually. */
const LAST_UPDATED = "Last updated: June 4, 2026";

/**
 * privacy.html:115. Composed, not retyped: `SMS_CONSENT.brand` is the registered
 * 10DLC campaign brand and `BROKERAGE_OF_RECORD` / `DRE_BROKERAGE` are the frozen
 * entity + licence. The assembled string is byte-identical to the source, ASCII
 * straight quotes and inside-the-quotes commas included.
 */
const INTRO = `This Privacy Policy describes how ${SMS_CONSENT.brand}, whose brokerage services are provided through ${BROKERAGE_OF_RECORD} (${DRE_BROKERAGE}) ("we," "us," or "our"), collects, uses, and protects information you provide through this website and our SMS text-messaging program.`;

/** privacy.html:118. Two em dashes (U+2014) with surrounding spaces. */
const S1_BODY =
  "We collect information you voluntarily provide, including your name, hotel or property name, location (city and state), email address, and — if you choose to provide it — your phone number. We may also collect non-identifying technical information such as browser type and pages visited.";

/** privacy.html:121. */
const S2_BODY =
  "We use your information to respond to valuation requests and inquiries, to provide a broker opinion of value, to schedule consultations, and — only if you have expressly opted in — to send you SMS text messages relevant to your inquiry.";

/**
 * privacy.html:124, split at the anchor. `STOP` and `HELP` are 10DLC keyword
 * literals and are always uppercase.
 */
const S3_BEFORE_LINK =
  "If you opt in to our SMS program, we will send you informational and conversational text messages related to your hotel valuation and real-estate matters. Message frequency varies (up to 6 messages per month). Message and data rates may apply. You can opt out at any time by replying STOP, or get help by replying HELP. For full details, see our ";
const S3_AFTER_LINK = ".";

/**
 * privacy.html:127 — the carrier-mandated 10DLC mobile-data-sharing disclaimer.
 * The first two sentences are the exact wording carriers and TCR look for.
 * Byte-exact, no exceptions, no marker inside it.
 */
const S4_BODY =
  "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties. This excludes service providers and subcontractors who help us operate the SMS program and deliver messages on our behalf (for example, messaging platforms and carriers); these providers are restricted from using your information for any purpose other than delivering our messages. This disclaimer governs over any other statement in this policy regarding data sharing.";

/** privacy.html:130. */
const S5_BODY =
  "Apart from the messaging service providers described above, we do not sell, rent, or share your personal information with third parties for their marketing purposes. We may disclose information if required by law or to protect our legal rights.";

/** privacy.html:133. */
const S6_BODY =
  "We retain information only as long as necessary to fulfill the purposes described here and to maintain records of consent, and we use reasonable safeguards to protect it.";

/** privacy.html:136. */
const S7_BODY =
  "You may request access to, correction of, or deletion of your information, and you may withdraw SMS consent at any time by replying STOP. Contact us using the details below.";

/**
 * privacy.html:140 — contact-block entity line. `—` is U+2014, `·` is U+00B7.
 * This is frozen-string register row S-5.
 */
const CONTACT_ENTITY_LINE = "Dino Monteverde — KW Commercial · Larchmont";

/**
 * privacy.html:141 — register row S-6. Note there is NO trailing period and NO
 * second "Dino Monteverde, CA DRE #01948432." sentence on this instance, unlike
 * the footer form (S-7, which the footer component renders from
 * `BROKERAGE_DISCLOSURE`). That asymmetry is in the source; it is preserved.
 */
const CONTACT_DISCLOSURE_LINE = `Brokerage services are provided through ${BROKERAGE_OF_RECORD} (${DRE_BROKERAGE})`;

/** privacy.html:147. ASCII straight quotes around "Last updated". */
const S9_BODY =
  'We may update this Privacy Policy from time to time. The "Last updated" date above reflects the most recent revision.';

/* -------------------------------------------------------------------------- */
/*  Appended sections 10-12 — NOT in the source. PROVISIONAL, counsel-owned.   */
/* -------------------------------------------------------------------------- */

/**
 * Appended per docs/port/06-legal-pages.md §8 (P-5) and PHASE-1-EXECUTION §8.3
 * (CalOPPA §22575(b)(5)). Draft text is the port pack's, verbatim — it is
 * provisional and must be confirmed against actual analytics behaviour.
 */
const S10_BODY =
  'We do not currently respond to "Do Not Track" browser signals. We do not permit third parties to collect personally identifiable information about your online activities over time and across third-party websites when you use this site.';

/**
 * Appended per P-6. Deliberately states what a California resident MAY be
 * entitled to and where to ask, and does not assert a rights scope, a
 * verification method, or a "we do not sell" conclusion — those are counsel's
 * to write, and asserting them unverified would be worse than omitting them.
 */
const S11_BODY =
  "California residents may have the right to know what personal information we collect, to request its deletion or correction, to opt out of any sale or sharing of personal information, and not to be treated differently for exercising those rights. The scope of those rights, the request channels, and how we verify a request are being confirmed with counsel. Until that review is complete, send any request to the contact details in section 8 and we will respond.";

/**
 * Appended to satisfy the CalOPPA third-party-disclosure item. The source policy
 * names no processor at all — §5 only says "apart from the messaging service
 * providers described above" — so this section is new copy, not a port.
 */
const S12_LEAD =
  "We use a small number of third-party providers to operate this site:";

const S12_ITEMS = [
  "Web3Forms, which delivers form submissions to us by email.",
  "Calendly, for consultation scheduling.",
  "Vercel, which hosts the site and provides its analytics.",
  "The Federal Reserve Bank of St. Louis (FRED), which supplies public economic data. That data is requested by our own server. No information about you is sent to FRED.",
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={LAST_UPDATED}
      lede={
        <>
          {/* PLACEHOLDER:counsel — VERBATIM PORT from kwc-dinomonteverde (privacy.html / sms-terms.html, 2026-06-04). Permitted legal-string substitutions: NONE. See docs/port/06-legal-pages.md §6. */}
          {/* PLACEHOLDER:counsel — controller entity: policy names Dino Monteverde (KW Commercial) as sole controller; confirm whether The Hokuten Group / Forward Wilshire should be named once the DRE team-name + KW paperwork clears. Frozen until then. */}
          <LegalP>{INTRO}</LegalP>
        </>
      }
    >
      {/* PLACEHOLDER:counsel — CalOPPA: enumerate the exact categories of PII collected (identifiers, commercial/property info, internet activity, geolocation-by-city, inferences) and the collection point for each (BOV form, consent modal, calculator inputs, analytics). Current prose is a partial list. */}
      <LegalSection id="collect" heading="1. Information We Collect">
        <LegalP>{S1_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="use" heading="2. How We Use Your Information">
        <LegalP>{S2_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — 10DLC: brand string "Dino Monteverde (KW Commercial)" is the registered campaign brand. Any Hokuten rebrand of this copy requires a new TCR campaign registration first. Do not edit. */}
      {/* PLACEHOLDER:counsel — the valuation calculator's "email me this estimate" capture POSTs name and email to Web3Forms with no privacy notice shown at the point of collection (kwc index.html:1071-1079). Decide whether a notice must appear beside that field and whether this section or section 12 must describe that collection. */}
      <LegalSection id="sms" heading="3. SMS / Text Messaging">
        <LegalP>
          {S3_BEFORE_LINK}
          <Link href={LEGAL_ROUTES.smsTerms} className={LEGAL_LINK_CLASS}>
            {SMS_CONSENT.links.smsLabel}
          </Link>
          {S3_AFTER_LINK}
        </LegalP>
      </LegalSection>

      <LegalSection id="mobile-data" heading="4. Mobile Information and Data Sharing">
        <LegalP>{S4_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — CalOPPA: name the third parties that receive data — Web3Forms (form delivery), Calendly (scheduling), Vercel (hosting + Analytics), FRED (server-side proxy, no user data transmitted). Confirm each processor's role and whether any qualifies as a "sale"/"share" under CPRA. Section 12 below is the provisional list. */}
      <LegalSection id="share" heading="5. How We Share Information">
        <LegalP>{S5_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — specify concrete retention periods per data category (form submissions, SMS consent records, analytics) and the safeguards described. Current sentence is unquantified. */}
      <LegalSection id="retention" heading="6. Data Retention and Security">
        <LegalP>{S6_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="choices" heading="7. Your Choices">
        <LegalP>{S7_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — privacy contact channel: confirm whether a dedicated privacy/DSAR address is required in addition to dino.monteverde@kw.com, and whether a postal address must be listed. */}
      <LegalSection id="contact" heading="8. Contact Us">
        <LegalContactBlock
          lines={[
            CONTACT_ENTITY_LINE,
            CONTACT_DISCLOSURE_LINE,
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

      {/* PLACEHOLDER:counsel — CalOPPA: describe the update process (how material changes are announced, whether prior versions are retained) and set the effective date. "Last updated: June 4, 2026" is the frozen kwc date and will be stale at Hokuten launch — counsel sets the new one. */}
      <LegalSection id="changes" heading="9. Changes to This Policy">
        <LegalP>{S9_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — CalOPPA §22575(b)(5): required Do-Not-Track disclosure, plus how the site responds to Global Privacy Control (GPC) signals. Draft below is provisional and must be confirmed against actual analytics behavior before launch. */}
      <LegalSection id="dnt" heading="10. Do Not Track and Global Privacy Control">
        <LegalP>{S10_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — CCPA/CPRA: thresholds are likely not met today, but include the section so counsel enriches rather than retrofits. Needs: rights to know/delete/correct/opt-out, non-discrimination, the two request channels, and verification method. */}
      <LegalSection id="california" heading="11. California Privacy Rights">
        <LegalP>{S11_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — confirm each provider below is actually in use at launch and remove any that is not: Calendly is not yet provisioned (CALENDLY_URL is null in content/site.ts) and Web3Forms has no access key yet. Confirm whether any of them is a "sale" or "share" under CPRA, and whether a processor agreement must be named. */}
      {/* PLACEHOLDER:counsel — the kwc source suppresses Calendly's own consent prompt with hide_gdpr_banner=1 (index.html:1922). If the Hokuten site keeps that parameter, decide what this policy must disclose about Calendly's own data collection in place of the banner Calendly would otherwise show. */}
      <LegalSection id="providers" heading="12. Service Providers">
        <LegalP>{S12_LEAD}</LegalP>
        <LegalList items={S12_ITEMS} />
      </LegalSection>
    </LegalPage>
  );
}
