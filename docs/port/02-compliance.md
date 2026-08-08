# PORT PACK 02 — Compliance & Legal Strings

**Source of record (read-only):** `~/Documents/Dino/dino-sites/kwc-dinomonteverde/`
**Files examined:** `index.html` (2290 lines), `sms-terms.html` (204), `privacy.html` (174), `marketplace.html` (433), `api/ticker-data.js` (72)
**Status:** `provisional` — awaiting Razim + KW / Forward Wilshire paperwork sign-off before any Hokuten-branded deploy.

> **Reading rule for builders:** every fenced block in this document is a BYTE-EXACT copy of the source. Do not retype from memory, do not "fix" punctuation, do not convert em dashes to hyphens, do not swap `&amp;` for `&` or vice versa. Copy-paste from the fences.
>
> **Character notes that matter:** the source uses U+2014 EM DASH (`—`), U+00B7 MIDDLE DOT (`·`), U+00A9 (`©`), U+2192 (`→`). All apostrophes in the legal/microcopy strings are ASCII `'` (U+0027) — there are **no** curly quotes anywhere in the compliance text. Verified by codepoint scan.

---

## 0. Executive inventory (what has to survive the port)

| # | Block | Source | Frozen? |
|---|---|---|---|
| 1 | Brokerage-of-record disclosure (2 sentences) | `index.html:1140`, `index.html:1241`, `index.html:1249`, `privacy.html:153`, `sms-terms.html:183`, `marketplace.html:383,400` | **byte-exact frozen** |
| 2 | SMS / TCPA consent checkbox label | `index.html:1200` | **byte-exact frozen** |
| 3 | SMS hidden audit-trail fields | `index.html:1173-1175`, `index.html:2240-2241` | **byte-exact frozen** |
| 4 | Consent links row (Privacy + SMS Terms) | `index.html:1202-1204` | **byte-exact frozen** |
| 5 | Calculator indicative-range disclaimer | `index.html:920`, `index.html:1564-1570` | **byte-exact frozen** |
| 6 | Footer legal row | `index.html:1248-1250` | frozen text, **Dino/Sarhan segments must be replaced** — see §7 |
| 7 | KW Commercial mark + alt text | `index.html:820`, `marketplace.html:184` | mark usage frozen, alt text frozen |
| 8 | 10DLC / TCR registered brand string + sample messages | `sms-terms.html:87-114` | **byte-exact frozen (registry-matched)** |
| 9 | SMS Terms page, 10 sections | `sms-terms.html:144-177` | **byte-exact frozen** |
| 10 | Privacy Policy page, 9 sections | `privacy.html:115-147` | **byte-exact frozen** |
| 11 | "Each office independently owned and operated." | `marketplace.html:400` **only** | frozen; missing from `index.html` — see §4.6 |

**Not carried over:** every "Sarhan Hotel Group" / `sarhanhotelgroup.com` occurrence (§8). Every Web3Forms access-key value (redacted, §9).

---

## 1. Footer brokerage-of-record disclosure

### 1.1 Canonical rendered text (the two-sentence block)

This exact two-sentence string appears **7 times across 4 files**. It is the single most-repeated compliance string on the site.

```
Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.
```

Note: **no comma** after "Forward Wilshire Inc"; **no period** inside the parenthetical; `dba` is lowercase; `CA DRE #` has one space before `#` and none after.

### 1.2 Raw HTML — team card (`index.html:1140`)

Renders with a hard line break between the two sentences. Uses `<br>` (unclosed).

```html
        <div class="team-license">Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).<br>Dino Monteverde, CA DRE #01948432.</div>
```

Supporting CSS (`index.html:594-595`):

```css
  /* Brokerage disclosure runs long — constrain the measure and let it wrap. */
  .team-license { font-family: var(--mono); font-size: 10px; color: var(--meta); letter-spacing: 0.04em; line-height: 1.8; margin-top: 12px; max-width: 46em; }
```

### 1.3 Raw HTML — footer contact address (`index.html:1241`)

Same text, but `<br/>` (self-closed) inside an `<address>` element.

```html
        <span class="fc-block fc-license">Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).<br/>Dino Monteverde, CA DRE #01948432.</span>
```

Full enclosing `<address>` (`index.html:1235-1242`):

```html
      <address class="footer-contact">
        <span class="fc-line"><a href="#" class="copy-email" data-email="dino.monteverde@kw.com">dino.monteverde@kw.com</a><span class="copy-email-note" aria-live="polite"></span></span>
        <span class="fc-line"><a href="tel:+16507206995">650.720.6995</a></span>
        <span class="fc-block">
          <a href="https://www.google.com/maps/search/?api=1&query=118+N+Larchmont+Blvd%2C+Los+Angeles%2C+CA+90004" target="_blank" rel="noopener">118 N Larchmont Blvd<br/>Los Angeles<br/>California 90004<br/>United States</a>
        </span>
        <span class="fc-block fc-license">Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).<br/>Dino Monteverde, CA DRE #01948432.</span>
      </address>
```

Supporting CSS (`index.html:711`):

```css
  .footer-contact .fc-license { font-family: var(--mono); font-size: 10px; letter-spacing: 0.04em; color: var(--meta); line-height: 1.8; }
```

### 1.4 Raw HTML — "The Brokerage of Record" team card (`index.html:1149-1154`)

This is the named-entity callout. `— The Brokerage of Record` opens with U+2014 + one space. The link glyph is U+2192.

```html
    <div class="team-open">
      <div class="label">— The Brokerage of Record</div>
      <div class="role">Forward Wilshire Inc dba Keller Williams Larchmont</div>
      <p>Nationwide referral network and formal partner-brokerage relationships in every U.S. state for out-of-California engagements. Brokerage of record for all listings.</p>
      <a href="#bov">CA DRE #01870534 →</a>
    </div>
```

### 1.5 Cross-check — the same string on the legal pages

`privacy.html:153` (footer, `<br>` unclosed):

```html
    Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.<br>
```

`sms-terms.html:183` — **identical byte-for-byte** to `privacy.html:153`.

`marketplace.html:383` (list item, single line, no `<br>`):

```html
        <li>Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.</li>
```

### 1.6 Cross-check — the in-body variant on the legal pages

`privacy.html:115` and `sms-terms.html:145` embed the disclosure as a relative clause. Both quoted verbatim in §5 and §6 below.

### 1.7 Contact block on both legal pages (`privacy.html:139-144`, `sms-terms.html:172-177`)

Byte-identical between the two files except for the surrounding heading number. Uses `·` (U+00B7) and `—` (U+2014).

```html
  <p class="contact-block">
    Dino Monteverde — KW Commercial · Larchmont<br>
    Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)<br>
    Email: <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a><br>
    Phone: <a href="tel:+16507206995">+1 650 720 6995</a>
  </p>
```

Note: in this contact block the disclosure sentence has **no trailing period** and **omits** the "Dino Monteverde, CA DRE #01948432." sentence. That is intentional in the source — do not normalize it.

---

## 2. SMS / TCPA consent block on the BOV form

### 2.1 The complete form, hidden fields through consent links (`index.html:1167-1208`)

Web3Forms access key value is **redacted** per repo law. The source comment calls it a public client-side key; it is still an account credential and does not belong in a port doc.

```html
        <form class="bov-form" id="bovForm" action="https://api.web3forms.com/submit" method="POST">
          <!-- Web3Forms access key (public client-side key — safe to expose). Submissions email the inbox on Dino's Web3Forms account. -->
          <input type="hidden" name="access_key" value="<REDACTED — env var WEB3FORMS_ACCESS_KEY>">
          <input type="hidden" name="subject" value="New BOV request — kwc-dinomonteverde.com">
          <input type="hidden" name="from_name" value="Dino Monteverde Website">
          <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
          <!-- SMS opt-in audit trail (records consent context per 10DLC/TCR) -->
          <input type="hidden" name="sms_consent_text" value="Up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent not a condition of purchase.">
          <input type="hidden" name="consent_timestamp" id="consentTimestamp" value="">
```

### 2.2 Hidden field 1 — `sms_consent_text` (`index.html:1174`)

The value attribute contains a **raw ampersand** (`&`), not `&amp;`. When ported to JSX/React this is a plain JS string; the character on the wire must remain a single `&`.

```
Up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent not a condition of purchase.
```

Raw HTML:

```html
          <input type="hidden" name="sms_consent_text" value="Up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent not a condition of purchase.">
```

Preceding comment (`index.html:1173`) — carry it into the port as a code comment so the intent survives:

```html
          <!-- SMS opt-in audit trail (records consent context per 10DLC/TCR) -->
```

### 2.3 Hidden field 2 — `consent_timestamp` (`index.html:1175`)

```html
          <input type="hidden" name="consent_timestamp" id="consentTimestamp" value="">
```

Stamped at submit time in the form handler (`index.html:2240-2241`):

```js
      // Stamp the moment of submission as opt-in evidence (only meaningful when the box is checked).
      var ts = document.getElementById("consentTimestamp"); if (ts) ts.value = new Date().toISOString();
```

**Timestamp format:** JavaScript `Date.prototype.toISOString()` — ISO 8601 extended, always UTC, millisecond precision, `Z` suffix:

```
YYYY-MM-DDTHH:mm:ss.sssZ
```

Example shape (illustrative, not from source): `2026-06-04T18:22:07.431Z`.

**Port note:** the stamp is written on *every* submit, regardless of whether the consent box is checked — see the source comment "only meaningful when the box is checked". Preserve that behavior exactly; do not add conditional logic. In a React port, set the value in the submit handler *before* constructing `FormData`, matching source order at `index.html:2241` → `index.html:2244`.

### 2.4 The consent checkbox — input `value` attribute (`index.html:1199`)

This string is what gets emailed when the box is checked. Unchecked checkboxes submit nothing.

```
I consent to receive SMS text messages from Dino Monteverde (KW Commercial).
```

Raw HTML:

```html
              <input type="checkbox" name="sms_consent" value="I consent to receive SMS text messages from Dino Monteverde (KW Commercial).">
```

### 2.5 The consent checkbox — visible label / fine print (`index.html:1200`)

**Rendered text** (what a user reads — `&amp;` resolves to `&`):

```
I agree to receive informational and conversational SMS text messages from Dino Monteverde (KW Commercial) about my hotel valuation and related real-estate matters. Message frequency varies (up to 6 msgs/month). Message & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase or of receiving a valuation. This is separate from the valuation request above and is optional.
```

**Raw HTML source** (note `<strong>` around the brand name and the `&amp;` entity):

```html
              <span>I agree to receive informational and conversational SMS text messages from <strong>Dino Monteverde</strong> (KW Commercial) about my hotel valuation and related real-estate matters. Message frequency varies (up to 6 msgs/month). Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase or of receiving a valuation. This is separate from the valuation request above and is optional.</span>
```

Required-element checklist inside this one string (all seven are 10DLC/TCR mandatory):

1. Program identity — `Dino Monteverde` `(KW Commercial)`
2. Message type — `informational and conversational SMS text messages`
3. Purpose scope — `about my hotel valuation and related real-estate matters`
4. Frequency — `Message frequency varies (up to 6 msgs/month).`
5. Cost — `Message & data rates may apply.`
6. Opt-out + help — `Reply STOP to opt out, HELP for help.`
7. Non-condition — `Consent is not a condition of any purchase or of receiving a valuation.` + `This is separate from the valuation request above and is optional.`

### 2.6 Full consent field markup (`index.html:1196-1205`)

```html
          <!-- SMS opt-in (10DLC/TCR compliant): unchecked, SMS-only, optional, separate intent -->
          <div class="field full bov-consent">
            <label class="consent-check">
              <input type="checkbox" name="sms_consent" value="I consent to receive SMS text messages from Dino Monteverde (KW Commercial).">
              <span>I agree to receive informational and conversational SMS text messages from <strong>Dino Monteverde</strong> (KW Commercial) about my hotel valuation and related real-estate matters. Message frequency varies (up to 6 msgs/month). Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase or of receiving a valuation. This is separate from the valuation request above and is optional.</span>
            </label>
            <p class="consent-links">
              See our <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> and <a href="sms-terms.html" target="_blank" rel="noopener">SMS Terms &amp; Conditions</a>.
            </p>
          </div>
```

**Behavioral invariants that are themselves compliance requirements** (encoded in the markup, do not change):

- Checkbox has **no** `checked` attribute — must render unchecked. Pre-checking is a TCPA violation.
- Checkbox has **no** `required` attribute — consent must be optional.
- Consent is a **separate** checkbox from form submission; there is exactly one SMS consent control and it covers SMS only.
- The whole label is a `<label class="consent-check">` wrapping the input — clicking the text toggles the box (a11y + provable consent UI).
- Links open in a new tab with `rel="noopener"`, so the user never loses form state to read the terms.

Supporting CSS (`index.html:622-627`):

```css
  .bov-form .bov-consent { grid-column: 1 / -1; margin-top: 6px; }
  .bov-form .consent-check { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
  .bov-form .consent-check input[type=checkbox] { width: 16px; height: 16px; margin-top: 3px; flex: 0 0 auto; accent-color: var(--gold); }
  .bov-form .consent-check span { font-family: var(--sans); font-size: 12px; line-height: 1.55; color: var(--ink-muted); }
  .bov-form .consent-links { font-family: var(--sans); font-size: 11.5px; margin-top: 8px; color: var(--ink-muted); }
  .bov-form .consent-links a { color: var(--gold); text-decoration: underline; }
```

### 2.7 Consent links row — rendered text (`index.html:1203`)

```
See our Privacy Policy and SMS Terms & Conditions.
```

### 2.8 The registered 10DLC / TCR brand string and sample messages (`sms-terms.html:87-114`)

This is an HTML comment in the source. It is the copy that was submitted to The Campaign Registry; the on-site consent language must keep matching it or the campaign fails vetting. **The brand string is `Dino Monteverde (KW Commercial):`** — brand name, space, parenthetical, colon.

```html
<!--
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
-->
```

The horizontal rule characters are U+2500 BOX DRAWINGS LIGHT HORIZONTAL. The dash in "10am PT work?" is U+2014.

**Keywords registered:** `STOP` (cancel), `HELP` (help), `START` (resubscribe). All three must be honored by whatever messaging provider Hokuten registers.

### 2.9 SMS Terms page — all 10 sections verbatim (`sms-terms.html:139-178`)

```html
<main class="legal">
  <div class="eyebrow">Legal</div>
  <h1>SMS Terms &amp; Conditions</h1>
  <div class="updated">Last updated: June 4, 2026</div>

  <h2>1. Program Description</h2>
  <p>By providing your mobile number and checking the consent box on our valuation or contact form, you agree to receive SMS text messages from Dino Monteverde (KW Commercial), whose brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). This is an informational and conversational messaging program related to hotel valuations, property inquiries, and scheduling.</p>

  <h2>2. Message Types</h2>
  <p>Messages may include replies to your inquiry, broker opinion of value follow-ups, appointment and consultation scheduling, and related real-estate information you request.</p>

  <h2>3. Message Frequency</h2>
  <p>Message frequency varies. You will receive up to 6 messages per month, depending on your interaction with us.</p>

  <h2>4. Costs</h2>
  <p>Message and data rates may apply, according to your mobile carrier's plan. We do not charge for the messages themselves.</p>

  <h2>5. Opt-Out</h2>
  <p>You can cancel the SMS service at any time by replying STOP to any message. After you send STOP, we will send a one-time confirmation message and then stop sending messages. To resume, sign up again as you did initially.</p>

  <h2>6. Help</h2>
  <p>For help, reply HELP to any message, or contact us at <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a> or <a href="tel:+16507206995">+1 650 720 6995</a>.</p>

  <h2>7. Consent</h2>
  <p>Consent to receive SMS messages is not a condition of any purchase or of receiving a valuation. Your consent is optional and independent of your valuation request.</p>

  <h2>8. Carrier Liability</h2>
  <p>Carriers are not liable for delayed or undelivered messages.</p>

  <h2>9. Privacy</h2>
  <p>For information on how we handle your data, see our <a href="privacy.html">Privacy Policy</a>. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.</p>

  <h2>10. Contact</h2>
  <p class="contact-block">
    Dino Monteverde — KW Commercial · Larchmont<br>
    Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)<br>
    Email: <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a><br>
    Phone: <a href="tel:+16507206995">+1 650 720 6995</a>
  </p>
</main>
```

Page `<title>` and meta (`sms-terms.html:6-8`):

```html
<title>SMS Terms &amp; Conditions — Dino Monteverde</title>
<meta name="description" content="SMS / text-messaging Terms & Conditions for Dino Monteverde (KW Commercial): message types, frequency, rates, opt-out, and help.">
<meta name="robots" content="index, follow">
```

> `robots: index, follow` is deliberate — carrier/registry vetting requires the SMS terms page to be publicly indexable. Keep it indexable on the Hokuten site.

---

## 3. Calculator disclaimer

The disclaimer exists in **two places with deliberately identical opening language**. The source calls this out at `index.html:1564`:

```js
      // Canonical disclaimer language — used consistently here and in the methodology note.
```

### 3.1 Methodology note beside the calculator (`index.html:919-921`)

Rendered text (one line in source; leading/trailing whitespace is markup indentation):

```
Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value. A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation. Request a written BOV below.
```

Raw HTML:

```html
        <div class="calc-methodology-note">
          Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value. A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation. Request a written BOV below.
        </div>
```

### 3.2 Result-panel disclaimer, injected at render (`index.html:1564-1570`)

```js
      // Canonical disclaimer language — used consistently here and in the methodology note.
      document.getElementById("resHonest").textContent =
        "Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.";
      document.getElementById("resContext").innerHTML =
        "A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below." +
        (usedDefaults ? " <em>This range uses typical figures for your market tier; your real numbers will sharpen it.</em>" : "") +
        (usedNoiOverride ? " <em>Using your actual NOI — the most accurate input you can give us.</em>" : "");
```

The four distinct strings, isolated:

```
Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.
```

```
A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below.
```

```
This range uses typical figures for your market tier; your real numbers will sharpen it.
```

```
Using your actual NOI — the most accurate input you can give us.
```

> **Difference the builder must preserve:** the methodology note (§3.1) ends the second sentence with a period and starts a new sentence — `...pricing recommendation. Request a written BOV below.` The result panel (§3.2) joins them with an em dash and lowercases the verb — `...pricing recommendation — request a written BOV below.` These are NOT the same string. Do not unify them.

### 3.3 Result-panel host markup (`index.html:1027-1032`)

```html
          <div class="result-display">
            <div class="result-label">Here's where the market would likely start</div>
            <div class="result-figure" id="resRange">—</div>
            <div class="result-honest" id="resHonest"></div>
            <div class="result-context" id="resContext"></div>
          </div>
```

Supporting CSS (`index.html:397`, `489`, `532`):

```css
  .calc-methodology-note { font-family: var(--sans); font-size: 11.5px; color: var(--meta); line-height: 1.6; margin-top: 28px; padding-top: 22px; border-top: 0.5px solid var(--rule); max-width: 30em; }
  .result-honest { font-family: var(--sans); font-size: 11.5px; color: var(--meta); margin: 10px 0 14px; letter-spacing: 0.01em; }
  .result-context { font-family: var(--sans); font-size: 10.5px; color: var(--meta); margin-top: 12px; letter-spacing: 0.02em; }
```

### 3.4 Source's own note on why the calculator is deliberately non-authoritative (`index.html:1353`)

```
     teaser — NOT transaction-derived. The disclaimer routes serious owners to a
```

And `index.html:1399`:

```
       asset type, NOT a local comp set. (Display/education only; not in the valuation.) */
```

Carry both comments into the Hokuten calculator source. They are the recorded rationale for the disclaimer.

### 3.5 NOI-override asterisk (`index.html:1560`)

When the user supplies actual NOI, the NOI/key metric renders with a trailing `*`:

```js
      document.getElementById("resNoi").textContent = usedNoiOverride ? "$" + groupInt(String(Math.round(noiPerKey))) + "*" : "$" + groupInt(String(Math.round(noiPerKey)));
```

**Ambiguity flagged:** the `*` marker has **no corresponding footnote text anywhere in `index.html`.** Grep confirms no orphan-asterisk legend exists. Either port the `*` as-is (matching source) or add a footnote — but adding one is new copy and needs a claims-register row + Razim's sign-off. Do not invent it silently.

---

## 4. Other legal / disclaimer microcopy

### 4.1 Footer legal row (`index.html:1248-1250`) — the densest legal block on the page

Raw HTML:

```html
  <div class="footer-legal">
    <a href="privacy.html">Privacy Policy</a> · <a href="sms-terms.html">SMS Terms</a> · Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group · Keller Williams Commercial · Larchmont. Nationwide coverage delivered through formal partner-brokerage relationships in every U.S. state. Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432. · sarhanhotelgroup.com · <span id="siteDomain">kwc-dinomonteverde.com</span> · © 2026 Dino Monteverde. All rights reserved.
  </div>
```

Rendered text:

```
Privacy Policy · SMS Terms · Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group · Keller Williams Commercial · Larchmont. Nationwide coverage delivered through formal partner-brokerage relationships in every U.S. state. Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432. · sarhanhotelgroup.com · kwc-dinomonteverde.com · © 2026 Dino Monteverde. All rights reserved.
```

Separator is ` · ` — space, U+00B7, space. Copyright glyph is U+00A9.

Supporting CSS (`index.html:722-724`):

```css
  .footer-legal { border-top: 1px solid var(--rule); padding-top: 28px; font-family: var(--mono); font-size: 10px; color: var(--meta); letter-spacing: 0.06em; line-height: 1.65; max-width: 1280px; margin: 0 auto; }
  .footer-legal a { color: var(--meta); text-decoration: underline; }
  .footer-legal a:hover { color: var(--ink); }
```

The domain is injected from a single config constant (`index.html:1266-1270`):

```js
  /* ============ CONFIG ============ */
  /* SET THIS: the live domain. Single source of truth — change here only. */
  var SITE_DOMAIN = "kwc-dinomonteverde.com";
  document.getElementById("siteDomain").textContent = SITE_DOMAIN;
  document.querySelector('input[name=subject]').value = "New BOV request — " + SITE_DOMAIN;
```

**Port note:** keep the single-source-of-truth pattern (one env/constant feeding both the footer domain and the form subject line).

### 4.2 Footer legal row on the legal pages (`privacy.html:152-155`, `sms-terms.html:182-185`)

Byte-identical between the two files:

```html
  <div class="footer-legal">
    Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.<br>
    <a href="privacy.html">Privacy Policy</a> · <a href="sms-terms.html">SMS Terms</a> · kwc-dinomonteverde.com · © 2026 Dino Monteverde. All rights reserved.
  </div>
```

### 4.3 KW Commercial mark — usage + alt text

Nav lockup (`index.html:819-826`):

```html
    <a href="#" class="brand-lockup" style="text-decoration: none; color: inherit;">
      <img class="kw-mark" src="kw-commercial.png" alt="Keller Williams Commercial">
      <span class="brand-divider" aria-hidden="true"></span>
      <div class="brand-text">
        <div class="wordmark">Dino <span class="amp">Monteverde</span></div>
        <div class="wordmark-descriptor">Keller Williams Commercial</div>
      </div>
    </a>
```

Identical lockup at `marketplace.html:184` and `marketplace.html:188`.

**Alt text, byte-exact:**

```
Keller Williams Commercial
```

Source's own description of the lockup (`index.html:94`):

```
  /* Co-brand lockup: KW Commercial mark + divider + Dino wordmark (desktop + mobile) */
```

Footer affiliation stack (`index.html:1234`, `marketplace.html:375` — identical):

```html
      <div class="footer-affil">Keller Williams Commercial<br/>National Hospitality Division<br/>Sarhan Hotel Group</div>
```

**Hokuten port rule (repo law, `AGENTS.md`):** the KW Commercial mark drops out of the header entirely. It survives **only** as a footer compliance mark, alongside the verbatim disclosure line. The `alt="Keller Williams Commercial"` string is retained wherever the raster mark ships. The `National Hospitality Division` / `Sarhan Hotel Group` lines do **not** carry over (§8).

Image asset: `kw-commercial.png` (9,190 bytes) at the source repo root.

### 4.4 Privacy Policy page — all 9 sections verbatim (`privacy.html:110-148`)

```html
<main class="legal">
  <div class="eyebrow">Legal</div>
  <h1>Privacy Policy</h1>
  <div class="updated">Last updated: June 4, 2026</div>

  <p>This Privacy Policy describes how Dino Monteverde (KW Commercial), whose brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534) ("we," "us," or "our"), collects, uses, and protects information you provide through this website and our SMS text-messaging program.</p>

  <h2>1. Information We Collect</h2>
  <p>We collect information you voluntarily provide, including your name, hotel or property name, location (city and state), email address, and — if you choose to provide it — your phone number. We may also collect non-identifying technical information such as browser type and pages visited.</p>

  <h2>2. How We Use Your Information</h2>
  <p>We use your information to respond to valuation requests and inquiries, to provide a broker opinion of value, to schedule consultations, and — only if you have expressly opted in — to send you SMS text messages relevant to your inquiry.</p>

  <h2>3. SMS / Text Messaging</h2>
  <p>If you opt in to our SMS program, we will send you informational and conversational text messages related to your hotel valuation and real-estate matters. Message frequency varies (up to 6 messages per month). Message and data rates may apply. You can opt out at any time by replying STOP, or get help by replying HELP. For full details, see our <a href="sms-terms.html">SMS Terms &amp; Conditions</a>.</p>

  <h2>4. Mobile Information and Data Sharing</h2>
  <p>No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties. This excludes service providers and subcontractors who help us operate the SMS program and deliver messages on our behalf (for example, messaging platforms and carriers); these providers are restricted from using your information for any purpose other than delivering our messages. This disclaimer governs over any other statement in this policy regarding data sharing.</p>

  <h2>5. How We Share Information</h2>
  <p>Apart from the messaging service providers described above, we do not sell, rent, or share your personal information with third parties for their marketing purposes. We may disclose information if required by law or to protect our legal rights.</p>

  <h2>6. Data Retention and Security</h2>
  <p>We retain information only as long as necessary to fulfill the purposes described here and to maintain records of consent, and we use reasonable safeguards to protect it.</p>

  <h2>7. Your Choices</h2>
  <p>You may request access to, correction of, or deletion of your information, and you may withdraw SMS consent at any time by replying STOP. Contact us using the details below.</p>

  <h2>8. Contact Us</h2>
  <p class="contact-block">
    Dino Monteverde — KW Commercial · Larchmont<br>
    Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)<br>
    Email: <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a><br>
    Phone: <a href="tel:+16507206995">+1 650 720 6995</a>
  </p>

  <h2>9. Changes to This Policy</h2>
  <p>We may update this Privacy Policy from time to time. The "Last updated" date above reflects the most recent revision.</p>
</main>
```

Page `<title>` and meta (`privacy.html:6-8`):

```html
<title>Privacy Policy — Dino Monteverde</title>
<meta name="description" content="Privacy Policy for Dino Monteverde (KW Commercial), including SMS / text-messaging data practices.">
<meta name="robots" content="index, follow">
```

Note: §4 of the Privacy Policy contains the carrier-mandated "governs over any other statement" clause — that sentence is the one carriers grep for. It is load-bearing.

Note: the quotation marks in `("we," "us," or "our")` and `The "Last updated" date` are ASCII `"` (U+0022), and the commas sit **inside** the quotes. Verified by codepoint scan.

### 4.5 Both legal pages share a "Last updated" date

```
Last updated: June 4, 2026
```

Appears at `privacy.html:113` and `sms-terms.html:142`, class `.updated`. **Ambiguity flagged:** a Hokuten-rebranded version of these pages is materially revised text, which means this date has to change. That is a legal-content decision for Razim, not a builder decision. Ship the port with the old date preserved and a `blocked: awaiting legal review date` marker until told otherwise.

### 4.6 "Each office independently owned and operated." — `marketplace.html:400` ONLY

This is the standard Keller Williams franchise mark. It appears **exactly once in the entire source site**, and **not** in `index.html`, `privacy.html`, or `sms-terms.html`. Verified by grep.

```html
  <div class="footer-legal">
    <span>© 2026 Dino Monteverde · Sarhan Hotel Group · KW Commercial. Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432. Each office independently owned and operated.</span>
    <span>All figures preliminary and subject to verification.</span>
  </div>
```

Isolated strings:

```
Each office independently owned and operated.
```

```
All figures preliminary and subject to verification.
```

**Ambiguity flagged for Razim:** the franchise mark being present on the marketplace page but absent from the homepage looks like an oversight in the source, not a deliberate choice. Whether the Hokuten homepage footer must carry it is a KW-compliance question, not a port question. Do not add it to the homepage on a builder's initiative — raise it at the paperwork gate.

### 4.7 No "Equal Housing Opportunity" mark exists in the source

Grep across all four HTML files returns **zero** hits for "equal housing", "Equal Opportunity", the Fair Housing logo, or any HUD mark. The site is commercial hospitality investment sales only. **Do not add one** to the Hokuten port on your own — if it's required, it comes through the paperwork gate as a new claims-register row.

### 4.8 No cookie / consent banner exists in the source

Grep returns zero hits for cookie banners, GDPR/CCPA notices, consent-management platforms, or analytics-consent gates. The site sets no cookies of its own. If the Hokuten build adds analytics, a cookie notice becomes a new requirement — flag it, don't silently inherit "no banner".

### 4.9 Form-status and error microcopy that carries legal weight

Submission success message (`index.html:2253`) — this is a **service-level promise**, treat it as a claim:

```
Thank you — your request is in. Your initial BOV is delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data.
```

The same 48-hour promise in the form intro (`index.html:1165`):

```html
        <p style="font-family: var(--serif); font-style: italic; font-size: 16px; color: var(--ink-muted); max-width: 32em; margin-bottom: 40px;">Initial BOV delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data. No cost, no obligation.</p>
```

Isolated:

```
Initial BOV delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data. No cost, no obligation.
```

Error states routing to a human (`index.html:2258`, `2263`, `1972`, `2015`, `2021`):

```
Something went wrong. Please email dino.monteverde@kw.com directly.
```

```
Network error. Please email dino.monteverde@kw.com directly.
```

```
Email isn't connected yet — please send your details to dino.monteverde@kw.com.
```

```
Couldn't send — please email dino.monteverde@kw.com.
```

```
Network error — please email dino.monteverde@kw.com.
```

Not-connected guard (`index.html:2233`):

```
Form not yet connected — add the Web3Forms access key to go live.
```

Validation strings (`index.html:2196`, `2198`, `2205`, `2206`, `2221`, `2225`):

```
Enter a valid phone number for the selected country.
```

```
Enter a valid phone number.
```

```
Email is required.
```

```
Enter a valid email address.
```

```
Please pick a city from the list.
```

```
Please fix the highlighted fields.
```

Calculator email-capture confirmation (`index.html:2011`) — **note the Dino-singular third-person reference; this one is marketing copy, not legal text, and must become team-first for Hokuten:**

```
Done — Dino will send your estimate and comp set shortly.
```

### 4.10 BOV-section disclaimer paragraph (`index.html:1211`)

Styled `.bov-disclaimer` but it is persuasion copy, not legal text. Already uses "we" — the only Dino-first-person block on the page is absent here. Note the `id="contact"` anchor lives on this paragraph.

```html
        <p class="bov-disclaimer" id="contact">Thinking about selling your hotel, now or down the road? Most owners hesitate to inquire until they're already committed to a sale. We'd rather meet you earlier than that. Prefer email? Send the property name, location, and available T-12 / STR information to <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a>. A call is optional.</p>
```

CSS (`index.html:621`):

```css
  .bov-disclaimer { font-family: var(--serif); font-style: italic; font-size: 14px; color: var(--ink-muted); line-height: 1.6; padding-left: 24px; border-left: 2px solid var(--gold); }
```

**Naming collision to watch:** `.bov-disclaimer` is a marketing paragraph, while `.calc-methodology-note` / `.result-honest` are the actual legal disclaimers. Do not let the class name mislead a builder into treating §4.10 as frozen legal text — it is not (see §7).

### 4.11 Confidentiality microcopy (informational, not frozen)

`index.html:918`:

```
Get a confidential range from comp data in under 60 seconds. No email required to see the result.
```

`index.html:1060`:

```
A written BOV, fully confidential, no obligation. Here's what it covers:
```

`index.html:1065`:

```
No listing agreement, no pressure to sell. If now isn't the time, we'll tell you that too.
```

### 4.12 Ticker data provenance

`index.html:1253`:

```html
<!-- LIVE MARKET TICKER (sticky bottom bar; data from /api/ticker-data, FRED) -->
```

`index.html:1254`:

```html
<div class="ticker-bar" id="tickerBar" aria-label="Live market data">
```

`index.html:1256`:

```html
    <span class="ticker-item"><span class="lead">LIVE DATA</span></span>
```

**No on-page FRED / St. Louis Fed attribution string exists**, and no "data delayed" notice. FRED's terms generally expect source attribution. **Flagged as a gap** — if Hokuten adds one, it is new copy requiring a claims-register row.

`api/ticker-data.js:15-16` documents the key; the value is never in source:

```js
 * Env: FRED_API_KEY — set in the Vercel project (Settings → Environment Variables).
 *      Free key: https://fredaccount.stlouisfed.org/apikeys
```

Read server-side only at `api/ticker-data.js:45`:

```js
  const apiKey = process.env.FRED_API_KEY;
```

This matches Hokuten repo law (`FRED_API_KEY` is a Vercel env var, server-side only). No key value appears anywhere in the source; nothing to redact here.

---

## 5. Every DRE number, legal entity, phone, and email

### 5.1 DRE license numbers

| Number | Belongs to | Every occurrence |
|---|---|---|
| `CA DRE #01870534` | Forward Wilshire Inc dba Keller Williams Larchmont (the brokerage) | `index.html:1140`, `index.html:1153` (as link text `CA DRE #01870534 →`), `index.html:1241`, `index.html:1249`, `privacy.html:115`, `privacy.html:141`, `privacy.html:153`, `sms-terms.html:145`, `sms-terms.html:174`, `sms-terms.html:183`, `marketplace.html:383`, `marketplace.html:400` |
| `CA DRE #01948432` | Dino Monteverde (the individual salesperson) | `index.html:1140`, `index.html:1241`, `index.html:1249`, `privacy.html:153`, `sms-terms.html:183`, `marketplace.html:383`, `marketplace.html:400` |

Format is invariant: `CA DRE #` + 8 digits, no spaces inside, `#` glued to the number.

**Port note:** `#01870534` (the brokerage) travels with Forward Wilshire and is expected to carry over to Hokuten if Forward Wilshire remains brokerage of record — pending the paperwork gate. `#01948432` is Dino's personal salesperson license and must **not** appear on a Hokuten site unless Dino is personally an agent of record there. Treat every occurrence of `01948432` as a hard review checkpoint.

### 5.2 Legal entity names

| Entity | Role | Occurrences |
|---|---|---|
| `Forward Wilshire Inc dba Keller Williams Larchmont` | Brokerage of record | 12 (see 5.1 row 1) |
| `Keller Williams Commercial` | Brand / affiliation | `index.html:19`, `:24`, `:31`, `:820` (alt), `:824`, `:1114` (comment), `:1117`, `:1234`; `marketplace.html:184` (alt), `:188`, `:375`, `:400` |
| `KW Commercial` | Short form, used in SMS/legal copy | `index.html:24`, `:94` (comment), `:1199`, `:1200`; `privacy.html:7`, `:115`, `:140`; `sms-terms.html:7`, `:93`, `:98`, `:103`, `:107`, `:110`, `:145`, `:173`; `marketplace.html:400` |
| `Sarhan Hotel Group` | **DOES NOT CARRY OVER** — see §8 | `index.html:19`, `:24`, `:1145`, `:1234`, `:1249`; `marketplace.html:375`, `:400` |
| `Dino Monteverde` | Individual licensee | throughout |
| `a100 Arms` / `a100arms.com` | Specialist channel (not a legal entity in the disclosures) | `index.html:1218-1226` |

### 5.3 Phone numbers

One phone number, three formats:

| Format | Context | Occurrences |
|---|---|---|
| `650.720.6995` | Display text | `index.html:31` (og:image:alt), `index.html:1138`, `index.html:1237`, `marketplace.html:381` |
| `+16507206995` | `tel:` href | `index.html:1138`, `index.html:1237`, `privacy.html:143`, `sms-terms.html:160`, `sms-terms.html:176`, `marketplace.html:381` |
| `+1 650 720 6995` | Legal-page display text + 10DLC HELP sample | `privacy.html:143`, `sms-terms.html:99`, `sms-terms.html:160`, `sms-terms.html:176` |

**Port note:** the `+1 650 720 6995` spaced form is what was submitted to the Campaign Registry HELP sample. If the Hokuten number differs, the registry submission must be re-filed — the on-page HELP contact and the registered HELP reply must match.

### 5.4 Email addresses

| Address | Occurrences | Notes |
|---|---|---|
| `dino.monteverde@kw.com` | `index.html:31, 1138, 1211, 1236, 1245, 1972, 2015, 2021, 2258, 2263`; `privacy.html:142`; `sms-terms.html:98, 160, 175`; `marketplace.html:364, 382` | Real contact address. 16 occurrences. |
| `name@company.com` | `index.html:1195` | Input placeholder only, not a real address. |
| `you@company.com` | `index.html:1075` | Input placeholder only, not a real address. |

The homepage email links are **copy-to-clipboard**, not `mailto:` (`index.html:1272-1274`):

```js
  /* ============ COPY-EMAIL ============ */
  /* Email links copy the address to the clipboard (instead of opening a mail
     client). A small "Copied" note appears next to the one that was clicked. */
```

Exceptions that ARE `mailto:` — `index.html:1211`, `index.html:1245`, `marketplace.html:364`, `privacy.html:142`, `sms-terms.html:160`, `sms-terms.html:175`.

### 5.5 Physical address (appears in the compliance neighborhood)

```
118 N Larchmont Blvd
Los Angeles
California 90004
United States
```

`index.html:1139` (team `<address>`), `index.html:1239` (footer `<address>`), both linked to Google Maps. Single-line form at `marketplace.html:380`:

```html
        <li>118 N Larchmont Blvd, Los Angeles, CA 90004, United States</li>
```

### 5.6 Domain strings

| String | Where |
|---|---|
| `kwc-dinomonteverde.com` | `index.html:1268` (config const), `index.html:1170` (form subject), `index.html:1249` (footer, via `#siteDomain`), `privacy.html:154`, `sms-terms.html:184` |
| `https://kwc-dinomonteverde.com/` | `index.html:23` (og:url) |
| `sarhanhotelgroup.com` | `index.html:1147`, `index.html:1249` — **does not carry over**, §8 |

---

## 6. Secrets and redactions

| Item | Source location | Handling |
|---|---|---|
| Web3Forms access key | `index.html:1169` (attribute value) | **`<REDACTED — env var WEB3FORMS_ACCESS_KEY>`**. The source comment claims it is a public client-side key; it is nonetheless an account credential. In the Hokuten port, read it from an env var and inject server-side or at build time. Never hardcode. |
| Web3Forms key, reused by calculator capture | `index.html:1951` (comment) + `ACCESS_KEY` var used at `index.html:1970, 1981` | Same treatment — one env var, two consumers. |
| `FRED_API_KEY` | `api/ticker-data.js:45` (`process.env.FRED_API_KEY`) | No value in source. Already correct: Vercel env var, server-side only. Matches Hokuten repo law. |

**No other credentials found.** Grep over all four HTML files plus `api/ticker-data.js` and `vercel.json` returns no tokens, no bearer strings, no basic-auth.

---

## 7. Voice: what changes, what absolutely does not

The old site is **Dino-singular** in places. The Hokuten site is team-first ("we"). Here is the split.

### 7.1 Legal text — Dino-singular voice STAYS, because the text is a legal record

These strings name a specific licensee and a specific 10DLC-registered brand. Changing "Dino Monteverde" to "The Hokuten Group" inside them is not a voice edit — it is a **material change to a registered compliance disclosure** and to a licensee identification. That requires: (a) Razim's explicit OK, (b) the KW / Forward Wilshire paperwork gate, and (c) a re-filed Campaign Registry submission for anything in §2.

Frozen-as-written until that gate clears:

- §1 brokerage-of-record disclosure — all 7 occurrences
- §2.2 `sms_consent_text` hidden field
- §2.4 checkbox `value` attribute
- §2.5 checkbox visible label
- §2.8 10DLC brand string + all sample messages
- §2.9 SMS Terms page, all 10 sections
- §4.4 Privacy Policy page, all 9 sections
- §4.6 `Each office independently owned and operated.`
- §5.1 both DRE numbers

> The correct workflow is **not** find-and-replace. It is: file the new registration under the Hokuten brand, get the new registered brand string back, then regenerate these blocks from the new registration. The strings in this document are the *shape* to reproduce, not the values to keep, for anything naming Dino.

### 7.2 Legal text where the pronoun is already correct

The legal pages already use "we / us / our" throughout (`privacy.html:115` defines it: `("we," "us," or "our")`). Only the **entity name** in the parenthetical changes, and only through §7.1's gate. The body pronouns need no edit.

### 7.3 Marketing copy — Dino-singular voice MUST become team-first

Not legal text; safe to rewrite once the brand flips:

| Source | String | Change to |
|---|---|---|
| `index.html:2011` | `Done — Dino will send your estimate and comp set shortly.` | team-first "we" |
| `index.html:1245` | `<li><a href="mailto:dino.monteverde@kw.com">Email Dino</a></li>` | team-first |
| `index.html:1171` | `<input type="hidden" name="from_name" value="Dino Monteverde Website">` | Hokuten site name |
| `index.html:1983` | `from_name: "KWC Valuation Tool",` | Hokuten tool name |
| `index.html:1168` | comment: `...Submissions email the inbox on Dino's Web3Forms account.` | Hokuten account |
| `sms-terms.html:107-112` | Sample messages using `I can call you tomorrow AM` / `I'll email the full PDF now` | first-person singular is **registry-registered**; regenerate at re-filing, do not hand-edit |
| `index.html:1249` | `Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group` | replaced wholesale — see §8 |

Error strings in §4.9 that route users to `dino.monteverde@kw.com` all need the new address, but the sentence structure is fine as-is.

### 7.4 Already team-first in the source — no change needed

`index.html:1211`, `index.html:1060-1065`, `index.html:918`, all of §3's disclaimers (`...the most accurate input you can give us.`), and the entire methodology section already say "we". Leave them.

---

## 8. Sarhan Hotel Group — flagged, NOT copied

Repo law: **"No Sarhan Hotel Group branding anywhere on the new site."** Every occurrence below is reported for removal, not for porting.

| File:line | Context | Disposition |
|---|---|---|
| `index.html:19` | `<meta name="description">` ends `...Sarhan Hotel Group at Keller Williams Commercial.` | Rewrite meta description entirely. |
| `index.html:24` | `<meta property="og:site_name" content="Dino Monteverde — KW Commercial · Sarhan Hotel Group">` | Rewrite. |
| `index.html:1145` | `<div class="role">Sarhan Hotel Group</div>` — "The Platform" team card | Card is removed or re-authored for Hokuten. |
| `index.html:1147` | `<a href="https://sarhanhotelgroup.com" target="_blank" rel="noopener">sarhanhotelgroup.com →</a>` | Remove. |
| `index.html:1234` | `<div class="footer-affil">Keller Williams Commercial<br/>National Hospitality Division<br/>Sarhan Hotel Group</div>` | Third line removed; KW lines subject to §4.3. |
| `index.html:1249` | Footer legal row: `Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group` **and** the standalone `· sarhanhotelgroup.com ·` segment | Both segments removed. The brokerage-disclosure sentences inside the same row are kept (§1). |
| `marketplace.html:375` | Same footer-affil stack | Third line removed. |
| `marketplace.html:400` | `© 2026 Dino Monteverde · Sarhan Hotel Group · KW Commercial.` | Rewrite the copyright segment; keep the disclosure + franchise mark that follow it. |

**Careful surgery required at `index.html:1249` and `marketplace.html:400`:** in both lines a Sarhan segment sits *inside* the same text node as the frozen brokerage disclosure. Removing Sarhan must not disturb the disclosure sentences on either side. Build these two footers as composed segments, not as one string literal, so the frozen part is independently greppable.

---

## PORT RULES

### R1 — Everything in this document is byte-exact-frozen by default

Repo law: compliance/TCPA blocks are byte-exact ports. No paraphrase, no "cleanup", no Prettier reflow inside a legal string, no smart-quote conversion, no em-dash → hyphen, no `&amp;` ↔ `&` swaps. If a linter wants to change a legal string, disable the linter for that block.

### R2 — Entity-name changes go through the gate, not through a builder

Any string naming `Dino Monteverde`, `Sarhan Hotel Group`, or carrying `CA DRE #01948432` is frozen **in shape** but its **value** changes only via: Razim's explicit OK + the KW / Forward Wilshire paperwork gate + (for §2 strings) a re-filed A2P 10DLC/TCR registration. Ship the port with these values intact and a `blocked: paperwork gate` marker rather than guessing at replacements.

### R3 — The consent UI's *behavior* is compliance, not styling

Unchecked by default · not `required` · separate from form submission · SMS-scope only · full-label click target · terms open in a new tab. A refactor that pre-checks the box, makes it required, bundles it with a general "I agree to terms", or drops the `<label>` wrapper is a TCPA regression, regardless of how the copy reads.

### R4 — Consent timestamp is `new Date().toISOString()`, stamped on every submit

Format `YYYY-MM-DDTHH:mm:ss.sssZ`, UTC. Stamp before building the payload. Do not make it conditional on the checkbox; the source deliberately stamps unconditionally.

### R5 — Two calculator disclaimers, one canon, two endings

The methodology-note version and the result-panel version share the first sentence exactly and diverge in the second. Store the shared sentence once (mirroring the source's "canonical disclaimer language" comment), but keep both endings distinct. Do not unify.

### R6 — Redact the Web3Forms key; keep `FRED_API_KEY` server-side

No credential values in port docs, repo files, or client bundles. `FRED_API_KEY` stays a Vercel env var read only in server code.

### R7 — Do not invent compliance copy

There is no Equal Housing mark, no cookie banner, no FRED attribution line, and no footnote for the calculator's NOI asterisk in the source. Absences are recorded facts, not gaps for a builder to fill. Additions are new claims requiring a `verified-current` row in the claims register.

### R8 — Legal pages stay indexable

Both carry `<meta name="robots" content="index, follow">`. Carrier and registry vetting requires publicly reachable, indexable SMS terms + privacy pages. Do not `noindex` them, do not gate them behind auth, do not lazy-render them client-side.

### R9 — Compose footers from segments

`index.html:1249` and `marketplace.html:400` interleave frozen disclosure text with to-be-removed Sarhan text in a single node. Implement as composed segments so the frozen sentences remain individually greppable after the Sarhan removal.

### R10 — `.bov-disclaimer` is not a disclaimer

`index.html:1211` is persuasion copy despite the class name. The real disclaimers are `.calc-methodology-note`, `.result-honest`, `.team-license`, `.fc-license`, and `.footer-legal`. Rename in the port if it helps, but never treat `.bov-disclaimer` content as frozen legal text or vice versa.

---

## Builder grep checklist

Run against the built Hokuten output (`site/`). Each line must return the stated count or condition.

**Must be present, byte-exact:**

```
# The disclosure — expect >= 2 hits (footer + a legal page footer), 0 near-misses
grep -rn "Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)." site/

# Brokerage DRE
grep -rn "CA DRE #01870534" site/

# SMS consent label, full sentence spot-checks
grep -rn "Consent is not a condition of any purchase or of receiving a valuation." site/
grep -rn "This is separate from the valuation request above and is optional." site/
grep -rn "Message frequency varies (up to 6 msgs/month)." site/
grep -rn "Reply STOP to opt out, HELP for help." site/

# Hidden audit-trail field value (raw ampersand, not &amp;)
grep -rn "Up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent not a condition of purchase." site/

# Hidden field names
grep -rn "sms_consent_text" site/
grep -rn "consent_timestamp" site/
grep -rn "toISOString" site/

# Calculator disclaimer — both variants
grep -rn "Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value." site/
grep -rn "pricing recommendation. Request a written BOV below." site/
grep -rn "pricing recommendation — request a written BOV below." site/

# Carrier-mandated privacy clauses
grep -rn "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes." site/
grep -rn "Text messaging originator opt-in data and consent will not be shared with any third parties." site/
grep -rn "This disclaimer governs over any other statement in this policy regarding data sharing." site/

# KW mark alt text, wherever the raster ships
grep -rn 'alt="Keller Williams Commercial"' site/

# Legal pages indexable
grep -rn 'content="index, follow"' site/
```

**Must return ZERO hits:**

```
# Brand spelling law
grep -rni "hakuten" site/

# Sarhan
grep -rni "sarhan" site/
grep -rn "sarhanhotelgroup" site/

# Personal salesperson license — only if Dino is not an agent of record on the Hokuten site
grep -rn "01948432" site/

# Old domain
grep -rn "kwc-dinomonteverde" site/

# Hardcoded credential
grep -rniE "access_key\s*[:=]\s*[\"'][0-9a-f]{8}-" site/
grep -rn "FRED_API_KEY" site/app site/components 2>/dev/null   # must not appear in client code

# Pre-checked or required consent box — both are TCPA regressions
grep -rn "sms_consent" site/ | grep -iE "checked|required|defaultChecked"

# Gold hex law — kit gold must not appear outside raster assets
grep -rn "B8943D" site/app site/components 2>/dev/null
```

**Manual review checkpoints (grep cannot decide these):**

1. Consent checkbox renders unchecked on first paint and after a form reset.
2. Consent checkbox is not `required`; form submits successfully with it unchecked.
3. Privacy Policy and SMS Terms links open in a new tab and do not clear form state.
4. `consent_timestamp` is populated in the submitted payload and matches `YYYY-MM-DDTHH:mm:ss.sssZ`.
5. Footer disclosure survives intact after Sarhan segment removal (visual diff `index.html:1249` vs the built footer).
6. "Last updated: June 4, 2026" — decision from Razim before publishing revised legal pages (§4.5).
7. `Each office independently owned and operated.` — homepage inclusion decision (§4.6).
8. Calculator NOI `*` — footnote decision (§3.5).
9. FRED attribution line — add-or-not decision (§4.12).
10. 10DLC/TCR re-registration filed under the Hokuten brand before any SMS consent box goes live under Hokuten branding (§2.8, §7.1).

---

## Open items / ambiguities for Razim

| # | Item | Blocking |
|---|---|---|
| 1 | Does `CA DRE #01948432` (Dino, personal) appear on the Hokuten site at all? | Yes — §5.1 |
| 2 | Does Forward Wilshire remain brokerage of record, keeping `#01870534`? | Yes — §1, paperwork gate |
| 3 | New A2P 10DLC/TCR brand string for Hokuten — who files, and when? | Yes — §2.8, blocks the SMS consent box |
| 4 | "Last updated" date on the rewritten legal pages | Yes — §4.5 |
| 5 | `Each office independently owned and operated.` on the homepage footer? | No, but flag at gate — §4.6 |
| 6 | FRED / St. Louis Fed attribution line for the ticker | No — §4.12 |
| 7 | Calculator NOI asterisk footnote text | No — §3.5 |
| 8 | Web3Forms vs. a server-side form handler for the Hokuten build | No, but §6/R6 apply either way |
