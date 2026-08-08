/**
 * app/sms-terms/page.tsx — `/sms-terms`
 *
 * VERBATIM PORT of ~/Documents/Dino/dino-sites/kwc-dinomonteverde/sms-terms.html
 * (204 lines, effective 2026-06-04), re-read against the read-only source on
 * 2026-08-08. Extraction of record: docs/port/06-legal-pages.md §4.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PERMITTED LEGAL-STRING SUBSTITUTIONS: NONE.
 *
 * This page is A2P 10DLC campaign copy. Carriers and The Campaign Registry check
 * it against what was filed: the brand string, the frequency disclosure, the
 * STOP / HELP / START keywords and the mobile-data-sharing disclaimer must match
 * the registration character for character. Rewriting any of them — including
 * "improving" the singular voice into Hokuten's team-first "we" — invalidates
 * the campaign until it is re-registered with TCR.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Body copy lives in module constants so a Prettier reflow cannot alter a frozen
 * string through JSX whitespace collapsing. `carrier's` in section 4 uses an
 * ASCII apostrophe (U+0027), verified by codepoint scan of the source; the only
 * non-ASCII characters in this file's legal copy are U+2014 EM DASH and U+00B7
 * MIDDLE DOT.
 *
 * Entity names, the licence number and the registered brand string are
 * interpolated from `@/content/compliance`, never retyped.
 */

import type { Metadata } from "next";
import Link from "next/link";

import {
  LEGAL_LINK_CLASS,
  LegalContactBlock,
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
/*  Metadata — sms-terms.html:6-8                                              */
/* -------------------------------------------------------------------------- */

/*
  PLACEHOLDER:counsel — page title/description still name Dino Monteverde only;
  update to The Hokuten Group when the KW / Forward Wilshire naming gate clears.
  (docs/port/06-legal-pages.md P-10 / flag F-3.)
*/

/**
 * The source `<title>` holds the entity `&amp;` and the source `<meta
 * description>` holds a bare `&`; both render as one `&`. Next escapes what it
 * is given, so passing the entity would emit `&amp;amp;`. These are the RENDERED
 * strings, with a bare ampersand — do not "restore" the entity.
 */
const FROZEN_TITLE = "SMS Terms & Conditions — Dino Monteverde";
const FROZEN_DESCRIPTION =
  "SMS / text-messaging Terms & Conditions for Dino Monteverde (KW Commercial): message types, frequency, rates, opt-out, and help.";

/**
 * `title.absolute` bypasses the root layout's `%s — The Hokuten Group` template
 * so the frozen string ships byte-exact. See app/privacy/page.tsx for the
 * verification notes on Next's title resolver. `robots` comes from
 * `pageMetadata()` → `robotsMeta()` — `noindex, nofollow` until
 * `INDEXING_ENABLED` flips in lib/seo.ts.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    title: FROZEN_TITLE,
    description: FROZEN_DESCRIPTION,
    path: LEGAL_ROUTES.smsTerms,
  }),
  title: { absolute: FROZEN_TITLE },
};

/* -------------------------------------------------------------------------- */
/*  Frozen body copy — sms-terms.html:140-177                                  */
/* -------------------------------------------------------------------------- */

/** sms-terms.html:142. Mixed case in the DOM; `micro-label` uppercases visually. */
const LAST_UPDATED = "Last updated: June 4, 2026";

/**
 * sms-terms.html:145. Composed from the frozen register rather than retyped:
 * `SMS_CONSENT.brand` is the registered campaign brand (S-4), and
 * `BROKERAGE_OF_RECORD` + `DRE_BROKERAGE` are S-1 and S-2. The assembled string
 * is byte-identical to the source.
 */
const S1_BODY = `By providing your mobile number and checking the consent box on our valuation or contact form, you agree to receive SMS text messages from ${SMS_CONSENT.brand}, whose brokerage services are provided through ${BROKERAGE_OF_RECORD} (${DRE_BROKERAGE}). This is an informational and conversational messaging program related to hotel valuations, property inquiries, and scheduling.`;

/** sms-terms.html:148. */
const S2_BODY =
  "Messages may include replies to your inquiry, broker opinion of value follow-ups, appointment and consultation scheduling, and related real-estate information you request.";

/** sms-terms.html:151. The "up to 6 messages per month" casing is registered. */
const S3_BODY =
  "Message frequency varies. You will receive up to 6 messages per month, depending on your interaction with us.";

/**
 * sms-terms.html:154. A THIRD rate-disclosure variant — comma, not period, and
 * it continues into the carrier's-plan clause. Do not conflate it with the
 * period-terminated form on the privacy page. `carrier's` is an ASCII apostrophe.
 */
const S4_BODY =
  "Message and data rates may apply, according to your mobile carrier's plan. We do not charge for the messages themselves.";

/** sms-terms.html:157. `STOP` is a registered keyword literal — always uppercase. */
const S5_BODY =
  "You can cancel the SMS service at any time by replying STOP to any message. After you send STOP, we will send a one-time confirmation message and then stop sending messages. To resume, sign up again as you did initially.";

/** sms-terms.html:160, split at the two anchors. */
const S6_BEFORE_EMAIL = "For help, reply HELP to any message, or contact us at ";
const S6_BETWEEN = " or ";
const S6_AFTER_PHONE = ".";

/** sms-terms.html:163. */
const S7_BODY =
  "Consent to receive SMS messages is not a condition of any purchase or of receiving a valuation. Your consent is optional and independent of your valuation request.";

/** sms-terms.html:166. */
const S8_BODY = "Carriers are not liable for delayed or undelivered messages.";

/**
 * sms-terms.html:169, split at the anchor. Sentences 2 and 3 duplicate the
 * carrier-mandated disclaimer from the privacy page's section 4. The duplication
 * is intentional — carriers check both pages — so both copies stay.
 */
const S9_BEFORE_LINK =
  "For information on how we handle your data, see our ";
const S9_AFTER_LINK =
  ". No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.";

/**
 * sms-terms.html:173 — register row S-5. `—` is U+2014, `·` is U+00B7.
 * Byte-identical to the privacy page's contact block.
 */
const CONTACT_ENTITY_LINE = "Dino Monteverde — KW Commercial · Larchmont";

/**
 * sms-terms.html:174 — register row S-6. No trailing period, and no second
 * "Dino Monteverde, CA DRE #01948432." sentence, unlike the footer form (S-7,
 * which the footer renders from `BROKERAGE_DISCLOSURE`). Preserve the asymmetry.
 */
const CONTACT_DISCLOSURE_LINE = `Brokerage services are provided through ${BROKERAGE_OF_RECORD} (${DRE_BROKERAGE})`;

export default function SmsTermsPage() {
  return (
    <LegalPage title="SMS Terms & Conditions" updated={LAST_UPDATED}>
      {/* PLACEHOLDER:counsel — VERBATIM PORT from kwc-dinomonteverde (privacy.html / sms-terms.html, 2026-06-04). Permitted legal-string substitutions: NONE. See docs/port/06-legal-pages.md §6. */}

      {/* PLACEHOLDER:compliance — A2P 10DLC registered sample messages; source sms-terms.html:87-114. Frozen until a Hokuten 10DLC campaign is registered. Do not edit strings. */}
      {/*
        ─────────────────────────────────────────────────────────────────────────────
        SAMPLE MESSAGES for the A2P 10DLC / Campaign Registry submission.
        Paste these into the Google Form VERBATIM (brand, frequency, STOP/HELP must match).

        OPT-IN CONFIRMATION:
          Dino Monteverde (KW Commercial): You're now subscribed to text updates about
          your hotel valuation. Msg freq varies, up to 6 msgs/month. Msg & data rates may
          apply. Reply HELP for help, STOP to cancel.

        HELP REPLY:
          Dino Monteverde (KW Commercial): For help, email dino.monteverde@kw.com or call
          +1 650 720 6995. Msg freq varies, up to 6 msgs/month. Msg & data rates may apply.
          Reply STOP to cancel.

        STOP / OPT-OUT REPLY:
          Dino Monteverde (KW Commercial): You have been unsubscribed and will receive no
          further messages. Reply START to resubscribe.

        EXAMPLE CONVERSATIONAL MESSAGES (use-case samples):
          1. Dino Monteverde (KW Commercial): Thanks for your valuation request on the
             Larchmont property. I can call you tomorrow AM — does 10am PT work? Reply STOP
             to cancel, HELP for help. Msg & data rates may apply.
          2. Dino Monteverde (KW Commercial): Your broker opinion of value is ready. I'll
             email the full PDF now; reply here with any questions. Up to 6 msgs/month. Reply
             STOP to cancel.
        ─────────────────────────────────────────────────────────────────────────────

        The line breaks above are source-file wrapping, not part of the SMS bodies.
        These were never rendered on the old site and are not rendered here.

        REPORTED DEPENDENCY: docs/port/06-legal-pages.md §5 additionally asks for these
        five strings to be exported as `SMS_10DLC_SAMPLES` from `site/content/sms-10dlc.ts`
        so they are machine-readable. `site/content/` is not this route's to write; the
        file does not exist yet.
      */}

      {/* PLACEHOLDER:counsel — 10DLC program owner + effective date: campaign is registered to "Dino Monteverde (KW Commercial)". Frozen byte-exact until a Hokuten campaign is registered with TCR; counsel resets "Last updated" at that time. */}
      <LegalSection id="program" heading="1. Program Description">
        <LegalP>{S1_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="message-types" heading="2. Message Types">
        <LegalP>{S2_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="frequency" heading="3. Message Frequency">
        <LegalP>{S3_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="costs" heading="4. Costs">
        <LegalP>{S4_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="opt-out" heading="5. Opt-Out">
        <LegalP>{S5_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="help" heading="6. Help">
        <LegalP>
          {S6_BEFORE_EMAIL}
          <a href={CONTACT.emailHref} className={LEGAL_LINK_CLASS}>
            {CONTACT.email}
          </a>
          {S6_BETWEEN}
          <a href={CONTACT.phoneHref} className={LEGAL_LINK_CLASS}>
            {CONTACT.phoneInternational}
          </a>
          {S6_AFTER_PHONE}
        </LegalP>
      </LegalSection>

      <LegalSection id="consent" heading="7. Consent">
        <LegalP>{S7_BODY}</LegalP>
      </LegalSection>

      <LegalSection id="carrier-liability" heading="8. Carrier Liability">
        <LegalP>{S8_BODY}</LegalP>
      </LegalSection>

      {/* PLACEHOLDER:counsel — confirm the mobile-data-sharing disclaimer duplicated here and in privacy §4 still matches current carrier/TCR requirements at Hokuten launch. */}
      <LegalSection id="privacy" heading="9. Privacy">
        <LegalP>
          {S9_BEFORE_LINK}
          <Link href={LEGAL_ROUTES.privacy} className={LEGAL_LINK_CLASS}>
            {SMS_CONSENT.links.privacyLabel}
          </Link>
          {S9_AFTER_LINK}
        </LegalP>
      </LegalSection>

      <LegalSection id="contact" heading="10. Contact">
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
    </LegalPage>
  );
}
