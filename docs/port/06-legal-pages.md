# PORT PACK 06 — Legal Pages (`/privacy`, `/sms-terms`)

**Status:** `approved` (extraction) — content is a **verbatim freeze**, not a rewrite.
**Source of record (READ-ONLY):** `~/Documents/Dino/dino-sites/kwc-dinomonteverde/privacy.html` (174 lines), `~/Documents/Dino/dino-sites/kwc-dinomonteverde/sms-terms.html` (204 lines).
**Targets:** `site/app/privacy/page.tsx` → `/privacy`, `site/app/sms-terms/page.tsx` → `/sms-terms`.
**Governing decisions:** PROJECT-MEMORY.md line 62 (port verbatim as placeholders + `PLACEHOLDER:counsel` markers + `docs/PLACEHOLDERS.md` register; **permitted legal-string substitutions: currently NONE**); `docs/PHASE-1-EXECUTION.md` §8.3.

> **Builder contract.** Every character of body copy in §3 and §4 below is frozen. Do **not** re-wrap sentences, do not convert straight quotes to curly quotes, do not change `—` to `-`, do not renumber sections, do not "fix" the Dino-singular voice inside legal copy. Voice/entity changes are gated behind the KW / Forward Wilshire paperwork item and are listed as flags in §7, never applied.

---

## 1. Routing, chrome, and file-level facts

| Fact | `privacy.html` | `sms-terms.html` |
|---|---|---|
| Source lines | 174 | 204 |
| `<html lang>` | `en` (line 2) | `en` (line 2) |
| `<title>` | line 6 | line 6 |
| `<meta name="description">` | line 7 | line 7 |
| `<meta name="robots">` | `index, follow` (line 8) | `index, follow` (line 8) |
| Nav block | lines 88–107 | lines 117–136 |
| Main content | lines 110–148 | lines 139–178 |
| Footer | lines 151–156 | lines 181–186 (180 is the `<!-- FOOTER -->` comment) |
| Nav-toggle script | lines 158–171 | lines 188–201 |
| Extra block | — | A2P 10DLC sample-message HTML comment, lines 87–114 |

Old-site URL shape: `vercel.json` sets `"cleanUrls": true, "trailingSlash": false`, so the live URLs are already `/privacy` and `/sms-terms` — Next.js route segments match 1:1. No redirects needed for these two paths.

### 1.1 `<title>` / meta — byte-exact

`privacy.html:6-8`
```html
<title>Privacy Policy — Dino Monteverde</title>
<meta name="description" content="Privacy Policy for Dino Monteverde (KW Commercial), including SMS / text-messaging data practices.">
<meta name="robots" content="index, follow">
```

`sms-terms.html:6-8` — **raw source bytes, unmodified:**
```html
<title>SMS Terms &amp; Conditions — Dino Monteverde</title>
<meta name="description" content="SMS / text-messaging Terms & Conditions for Dino Monteverde (KW Commercial): message types, frequency, rates, opt-out, and help.">
<meta name="robots" content="index, follow">
```
⚠️ **The two lines differ in the source and the difference is real, not a transcription artifact.** Line 6 (`<title>`) contains the literal five-character entity `&amp;`. Line 7 (`<meta description>`) contains a **bare `&`**. Both render as a single `&`.

**Builder — do not copy either form into `metadata`.** Next.js escapes what you put in `metadata.title` / `metadata.description`, so passing `&amp;` would emit `&amp;amp;` and render the literal text "&amp;". Pass the **rendered** strings below as plain JS strings with a bare `&`. The rendered description text is:
```
SMS / text-messaging Terms & Conditions for Dino Monteverde (KW Commercial): message types, frequency, rates, opt-out, and help.
```
The rendered `<title>` texts are:
```
Privacy Policy — Dino Monteverde
SMS Terms & Conditions — Dino Monteverde
```
🚩 **Titles/descriptions name Dino only** — these are the *only* strings on these two pages that are marketing metadata rather than legal copy, so they are the first candidates for a Hokuten rewrite. Still **do not change them** without a dated PROJECT-MEMORY entry (§7, flag F-3). If Razim approves later, the Hokuten forms would be `Privacy Policy — The Hokuten Group` / `SMS Terms & Conditions — The Hokuten Group`.

### 1.2 Header (nav) — same markup on both pages

`privacy.html:88-107` (identical to `sms-terms.html:117-136`)
```html
<nav class="topnav">
  <div class="nav-inner">
    <a href="index.html" style="text-decoration: none; color: inherit;">
      <div class="wordmark">Dino <span class="amp">Monteverde</span></div>
      <div class="wordmark-descriptor">Hospitality Investment Sales</div>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html#listings">Hotels for Sale</a></li>
      <li><a href="index.html#calculator">Hotel Worth Calculator</a></li>
      <li><a href="index.html#methodology">Methodology</a></li>
      <li><a href="index.html#team">Team</a></li>
      <li><a href="index.html#contact">Contact</a></li>
      <li><a href="marketplace.html">Marketplace</a></li>
      <li><a href="index.html#bov" class="nav-cta">Get Your Valuation</a></li>
    </ul>
  </div>
</nav>
```
**Builder:** do **not** port this nav. Use the shared Hokuten `<SiteHeader />`. The only things to carry are the **back-link targets**: wordmark → `/`, and the nav anchors resolve to `/#listings`, `/#calculator`, `/#methodology`, `/#team`, `/#contact`, `/marketplace` (Phase 1 has no `/marketplace` route — see flag F-5), `/#bov`. The inline nav-toggle IIFE (`privacy.html:158-171`, `sms-terms.html:188-201`) is superseded by the Hokuten header component; do not port it.

### 1.3 Footer — legal pages use the **reduced** footer

`index.html` and `marketplace.html` render a full multi-column footer; the two legal pages render only the `.footer-legal` strip:

`privacy.html:151-156` (byte-identical to `sms-terms.html:181-186` — verified by `diff`)
```html
<footer>
  <div class="footer-legal">
    Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.<br>
    <a href="privacy.html">Privacy Policy</a> · <a href="sms-terms.html">SMS Terms</a> · kwc-dinomonteverde.com · © 2026 Dino Monteverde. All rights reserved.
  </div>
</footer>
```
**Builder:** use the shared Hokuten `<SiteFooter />`. The two-sentence brokerage disclosure above is the byte-exact compliance line required on **every** page (`docs/PHASE-1-EXECUTION.md` §8.2) — it is already owned by the footer component; do not duplicate it inside the legal `<main>`. The `kwc-dinomonteverde.com` domain string and `© 2026 Dino Monteverde. All rights reserved.` are flagged in §7 (F-4).

### 1.4 Layout / typographic spec of the legal template

Source CSS is inlined and byte-identical in both files (`privacy.html:12-83`, `sms-terms.html:12-83`). Rebuild with Hokuten tokens, not these literals. Recorded here only so the builder reproduces the *measure and rhythm*:

| Element | Source rule (`privacy.html:50-58`) | Notes |
|---|---|---|
| `.legal` container | `max-width: 860px; margin: 0 auto; padding: 96px 48px;` | mobile `padding: 64px 24px` at ≤640px (line 80) |
| `.eyebrow` | mono, `10px`, gold, `letter-spacing: 0.2em`, uppercase, `margin-bottom: 14px` | text is `Legal` |
| `h1` | serif, `clamp(30px,4vw,48px)`, weight 400, `line-height: 1.1`, `margin-bottom: 10px` | one `h1` per page |
| `.updated` | mono, `11px`, meta grey, `.08em`, uppercase, `margin-bottom: 36px` | the "Last updated" line |
| `h2` | serif, `24px`, weight 500, `margin: 38px 0 12px` | numbered sections |
| `p, li` | `14.5px`, `--ink-muted`, `line-height: 1.7`, `margin-bottom: 12px` | |
| `a` (in body) | gold, `text-decoration: underline` | |
| `.contact-block` | mono, `12.5px`, `--ink-muted`, `line-height: 1.9` | the §8 / §10 address blocks |

⚠️ **Gold guardrail:** the source `--gold` is `#B8943D` (line 20) — that is the **kit** gold, permitted only inside raster assets. Hokuten website gold is `#B8902E`. Use the Hokuten token; never copy `#B8943D` into `site/`.
⚠️ `.legal ul { padding-left: 22px; margin-bottom: 12px; }` (line 56) exists in the CSS but **neither page renders a `<ul>` inside `.legal`** — the entire body of both pages is `<p>` under `<h2>`. (Each page does render exactly one `<ul>`, `ul.nav-links` in the nav, which is outside `.legal` and is not ported.) Counsel-enriched sections (§8 below) will introduce the first legal-body lists; the rule is already there for them.

---

## 2. Heading hierarchy (both pages)

Both pages use exactly: `.eyebrow` (not a heading) → one `h1` → a flat run of `h2` numbered sections. **No `h3` exists on either page.** Preserve this: one `h1`, no skipped levels, sections keep their source numbers `1.`–`9.` (privacy) and `1.`–`10.` (sms-terms). New counsel sections must be appended (see §5 for exact insertion points) so existing numbers never shift.

---

## 3. `/privacy` — complete verbatim body

Source: `privacy.html:110-148`. Reproduced in document order. Markdown headings below mirror the source `h1`/`h2`.

### 3.0 Eyebrow + H1 + updated line

`privacy.html:111-113`
```html
<div class="eyebrow">Legal</div>
<h1>Privacy Policy</h1>
<div class="updated">Last updated: June 4, 2026</div>
```
Rendered text, byte-exact:
```
Legal
Privacy Policy
Last updated: June 4, 2026
```
(The `.updated` line is CSS-uppercased at render — the **source string is mixed case** as shown. Keep the source casing in the DOM and let CSS transform it, so the accessible name and any copy/paste stays `Last updated: June 4, 2026`.)

### 3.1 Intro paragraph (unnumbered)

`privacy.html:115`
```
This Privacy Policy describes how Dino Monteverde (KW Commercial), whose brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534) ("we," "us," or "our"), collects, uses, and protects information you provide through this website and our SMS text-messaging program.
```
Quote characters are **ASCII straight** `"` and the commas sit **inside** the quotes (`("we," "us," or "our")`). Do not smarten.

### 3.2 H2 — `1. Information We Collect`

`privacy.html:117-118`
```
1. Information We Collect
```
```
We collect information you voluntarily provide, including your name, hotel or property name, location (city and state), email address, and — if you choose to provide it — your phone number. We may also collect non-identifying technical information such as browser type and pages visited.
```
Two em dashes (U+2014) with surrounding spaces.

### 3.3 H2 — `2. How We Use Your Information`

`privacy.html:120-121`
```
2. How We Use Your Information
```
```
We use your information to respond to valuation requests and inquiries, to provide a broker opinion of value, to schedule consultations, and — only if you have expressly opted in — to send you SMS text messages relevant to your inquiry.
```

### 3.4 H2 — `3. SMS / Text Messaging`

`privacy.html:123-124`
```
3. SMS / Text Messaging
```
```html
<p>If you opt in to our SMS program, we will send you informational and conversational text messages related to your hotel valuation and real-estate matters. Message frequency varies (up to 6 messages per month). Message and data rates may apply. You can opt out at any time by replying STOP, or get help by replying HELP. For full details, see our <a href="sms-terms.html">SMS Terms &amp; Conditions</a>.</p>
```
Rendered text:
```
If you opt in to our SMS program, we will send you informational and conversational text messages related to your hotel valuation and real-estate matters. Message frequency varies (up to 6 messages per month). Message and data rates may apply. You can opt out at any time by replying STOP, or get help by replying HELP. For full details, see our SMS Terms & Conditions.
```
Link: anchor text `SMS Terms & Conditions` → `/sms-terms` (source `sms-terms.html`). `STOP` and `HELP` are uppercase literals — frozen (10DLC).

### 3.5 H2 — `4. Mobile Information and Data Sharing`

`privacy.html:126-127`
```
4. Mobile Information and Data Sharing
```
```
No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties. This excludes service providers and subcontractors who help us operate the SMS program and deliver messages on our behalf (for example, messaging platforms and carriers); these providers are restricted from using your information for any purpose other than delivering our messages. This disclaimer governs over any other statement in this policy regarding data sharing.
```
🔒 This is the **carrier-mandated 10DLC mobile-data-sharing disclaimer**. The first two sentences are the exact wording carriers/TCR look for. Byte-exact, no exceptions, no counsel marker inside it.

### 3.6 H2 — `5. How We Share Information`

`privacy.html:129-130`
```
5. How We Share Information
```
```
Apart from the messaging service providers described above, we do not sell, rent, or share your personal information with third parties for their marketing purposes. We may disclose information if required by law or to protect our legal rights.
```

### 3.7 H2 — `6. Data Retention and Security`

`privacy.html:132-133`
```
6. Data Retention and Security
```
```
We retain information only as long as necessary to fulfill the purposes described here and to maintain records of consent, and we use reasonable safeguards to protect it.
```

### 3.8 H2 — `7. Your Choices`

`privacy.html:135-136`
```
7. Your Choices
```
```
You may request access to, correction of, or deletion of your information, and you may withdraw SMS consent at any time by replying STOP. Contact us using the details below.
```

### 3.9 H2 — `8. Contact Us`

`privacy.html:138-144`
```html
<h2>8. Contact Us</h2>
<p class="contact-block">
  Dino Monteverde — KW Commercial · Larchmont<br>
  Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)<br>
  Email: <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a><br>
  Phone: <a href="tel:+16507206995">+1 650 720 6995</a>
</p>
```
Rendered lines, byte-exact (4 lines, `<br>`-separated, monospace `.contact-block`):
```
Dino Monteverde — KW Commercial · Larchmont
Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)
Email: dino.monteverde@kw.com
Phone: +1 650 720 6995
```
Separators: `—` is U+2014 EM DASH, `·` is U+00B7 MIDDLE DOT. Note this instance of the disclosure sentence has **no trailing period** and **no `Dino Monteverde, CA DRE #01948432.` second sentence** — unlike the footer version (§1.3). That asymmetry is in the source; preserve it.
`href` values are frozen: `mailto:dino.monteverde@kw.com`, `tel:+16507206995`.

### 3.10 H2 — `9. Changes to This Policy`

`privacy.html:146-147`
```
9. Changes to This Policy
```
```
We may update this Privacy Policy from time to time. The "Last updated" date above reflects the most recent revision.
```
ASCII straight quotes around `"Last updated"`.

---

## 4. `/sms-terms` — complete verbatim body

Source: `sms-terms.html:139-178`.

### 4.0 Eyebrow + H1 + updated line

`sms-terms.html:140-142`
```html
<div class="eyebrow">Legal</div>
<h1>SMS Terms &amp; Conditions</h1>
<div class="updated">Last updated: June 4, 2026</div>
```
Rendered text:
```
Legal
SMS Terms & Conditions
Last updated: June 4, 2026
```

### 4.1 H2 — `1. Program Description`

`sms-terms.html:144-145`
```
1. Program Description
```
```
By providing your mobile number and checking the consent box on our valuation or contact form, you agree to receive SMS text messages from Dino Monteverde (KW Commercial), whose brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). This is an informational and conversational messaging program related to hotel valuations, property inquiries, and scheduling.
```
🔒 `Dino Monteverde (KW Commercial)` here is the **registered 10DLC campaign brand string** — see §6.

### 4.2 H2 — `2. Message Types`

`sms-terms.html:147-148`
```
2. Message Types
```
```
Messages may include replies to your inquiry, broker opinion of value follow-ups, appointment and consultation scheduling, and related real-estate information you request.
```

### 4.3 H2 — `3. Message Frequency`

`sms-terms.html:150-151`
```
3. Message Frequency
```
```
Message frequency varies. You will receive up to 6 messages per month, depending on your interaction with us.
```

### 4.4 H2 — `4. Costs`

`sms-terms.html:153-154`
```
4. Costs
```
```
Message and data rates may apply, according to your mobile carrier's plan. We do not charge for the messages themselves.
```
`carrier's` uses an **ASCII apostrophe** `'` (U+0027), not `’`. Verified by codepoint scan.

### 4.5 H2 — `5. Opt-Out`

`sms-terms.html:156-157`
```
5. Opt-Out
```
```
You can cancel the SMS service at any time by replying STOP to any message. After you send STOP, we will send a one-time confirmation message and then stop sending messages. To resume, sign up again as you did initially.
```

### 4.6 H2 — `6. Help`

`sms-terms.html:159-160`
```html
<h2>6. Help</h2>
<p>For help, reply HELP to any message, or contact us at <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a> or <a href="tel:+16507206995">+1 650 720 6995</a>.</p>
```
Rendered text:
```
For help, reply HELP to any message, or contact us at dino.monteverde@kw.com or +1 650 720 6995.
```

### 4.7 H2 — `7. Consent`

`sms-terms.html:162-163`
```
7. Consent
```
```
Consent to receive SMS messages is not a condition of any purchase or of receiving a valuation. Your consent is optional and independent of your valuation request.
```

### 4.8 H2 — `8. Carrier Liability`

`sms-terms.html:165-166`
```
8. Carrier Liability
```
```
Carriers are not liable for delayed or undelivered messages.
```

### 4.9 H2 — `9. Privacy`

`sms-terms.html:168-169`
```html
<h2>9. Privacy</h2>
<p>For information on how we handle your data, see our <a href="privacy.html">Privacy Policy</a>. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.</p>
```
Rendered text:
```
For information on how we handle your data, see our Privacy Policy. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.
```
Link: anchor text `Privacy Policy` → `/privacy`. Sentences 2–3 duplicate the mandated disclaimer from privacy §4 — that duplication is intentional (carriers check both pages). Keep both copies.

### 4.10 H2 — `10. Contact`

`sms-terms.html:171-177`
```html
<h2>10. Contact</h2>
<p class="contact-block">
  Dino Monteverde — KW Commercial · Larchmont<br>
  Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)<br>
  Email: <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a><br>
  Phone: <a href="tel:+16507206995">+1 650 720 6995</a>
</p>
```
Byte-identical to privacy §8 (§3.9 above), including the missing trailing period.

---

## 5. The A2P 10DLC sample-message block (`sms-terms.html:87-114`)

An **HTML comment in the source `<body>`, before the nav.** `README.md:60-64` requires it be kept: *"`privacy.html` and `sms-terms.html` must keep the opt-in, message-frequency (up to 6/month), carrier-rate, STOP, and HELP disclosures, and the registered sample-message comment block in `sms-terms.html`. The brand string **"Dino Monteverde (KW Commercial)"** must stay identical across the sample messages, the on-site consent checkbox, and the SMS/privacy body copy — it is the registered campaign brand."*

Verbatim (`sms-terms.html:87-114`) — the rule lines are 77× U+2500 BOX DRAWINGS LIGHT HORIZONTAL:
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

**Unwrapped message strings** (the line breaks above are source-file wrapping, not part of the SMS bodies). These are what was submitted to TCR — frozen:
```
Dino Monteverde (KW Commercial): You're now subscribed to text updates about your hotel valuation. Msg freq varies, up to 6 msgs/month. Msg & data rates may apply. Reply HELP for help, STOP to cancel.
```
```
Dino Monteverde (KW Commercial): For help, email dino.monteverde@kw.com or call +1 650 720 6995. Msg freq varies, up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel.
```
```
Dino Monteverde (KW Commercial): You have been unsubscribed and will receive no further messages. Reply START to resubscribe.
```
```
Dino Monteverde (KW Commercial): Thanks for your valuation request on the Larchmont property. I can call you tomorrow AM — does 10am PT work? Reply STOP to cancel, HELP for help. Msg & data rates may apply.
```
```
Dino Monteverde (KW Commercial): Your broker opinion of value is ready. I'll email the full PDF now; reply here with any questions. Up to 6 msgs/month. Reply STOP to cancel.
```
Apostrophes in `You're` and `I'll` are ASCII `'`. The dash in `tomorrow AM — does 10am PT work?` is U+2014.

**Builder — how to port a comment into JSX.** A `{/* … */}` JSX comment is stripped at build and would be invisible in view-source, defeating the point (the block exists so a human can copy it into the TCR form). Port it as a **JSX comment in the source file** *and* keep a machine-readable copy so it survives. Required implementation:

```tsx
{/* PLACEHOLDER:compliance — A2P 10DLC registered sample messages; source sms-terms.html:87-114.
    Frozen until a Hokuten 10DLC campaign is registered. Do not edit strings. */}
```
plus export the five strings from `site/content/sms-10dlc.ts` as a `const` array (`SMS_10DLC_SAMPLES`) with the same `PLACEHOLDER:compliance` header comment, so the copy is greppable and diffable in the repo. Do **not** render them to the page — they were never visible on the old site.

🚩 **Voice flag:** samples 1 and 2 use Dino-singular first person (`I can call you tomorrow AM`, `I'll email the full PDF now`). Hokuten voice is team-first `we`. **Do not change them** — they are registered with the carriers. Rewriting requires a new 10DLC campaign registration (§7, flag F-1).

---

## 6. Frozen-string register — BYTE-EXACT, permitted substitutions: **NONE**

Per PROJECT-MEMORY.md line 62 and `docs/PHASE-1-EXECUTION.md` §8.3. Any change to a row below requires a dated PROJECT-MEMORY decision from Razim.

| # | Frozen string | Type | Source lines |
|---|---|---|---|
| S-1 | `Forward Wilshire Inc dba Keller Williams Larchmont` | Legal entity (broker of record) | privacy 115, 141, 153; sms 145, 174, 183 |
| S-2 | `CA DRE #01870534` | Broker license № | privacy 115, 141, 153; sms 145, 174, 183 |
| S-3 | `CA DRE #01948432` | Salesperson license № (Dino) | privacy 153; sms 183 |
| S-4 | `Dino Monteverde (KW Commercial)` | **Registered A2P 10DLC campaign brand** | privacy 115 (as `Dino Monteverde (KW Commercial),`), 7; sms 7, 145, and 5× in the comment block 93/98/103/107/110 |
| S-5 | `Dino Monteverde — KW Commercial · Larchmont` | Contact-block entity line (em dash + middle dot) | privacy 140; sms 173 |
| S-6 | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)` | Disclosure, **no trailing period** (contact-block form) | privacy 141; sms 174 |
| S-7 | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.` | Disclosure, **two-sentence footer form, with periods** | privacy 153; sms 183 |
| S-8 | `dino.monteverde@kw.com` | Email (display text) | privacy 142 ×2 (href + link text); sms 160 ×2, 175 ×2 (href + link text), 98 (comment block) |
| S-9 | `mailto:dino.monteverde@kw.com` | Email href | privacy 142; sms 160, 175 |
| S-10 | `+1 650 720 6995` | Phone (display text) | privacy 143; sms 160, 176, 99 |
| S-11 | `tel:+16507206995` | Phone href | privacy 143; sms 160, 176 |
| S-12 | `Last updated: June 4, 2026` | Effective date, both pages | privacy 113; sms 142 |
| S-13 | `up to 6 messages per month` / `up to 6 msgs/month` / `Up to 6 msgs/month` | 10DLC frequency disclosure — **three distinct casings, all registered** | `up to 6 messages per month`: privacy 124, sms 151 · `up to 6 msgs/month`: sms 94, 99 · `Up to 6 msgs/month`: sms **111** |
| S-14 | `STOP` / `HELP` / `START` | 10DLC keyword literals, always uppercase | **In rendered body copy:** `STOP` privacy 124, 136; sms 157 ×2 · `HELP` privacy 124; sms 160. **In the 10DLC comment block:** `STOP` sms 95, 100, 108, 112 · `HELP` sms 95, **109** · `START` sms 104. **Non-message mentions in the same comment** (instruction + labels, do not treat as message copy): sms 90 (`STOP/HELP must match`), 97 (`HELP REPLY:`), 102 (`STOP / OPT-OUT REPLY:`) |
| S-15 | `Message and data rates may apply.` / `Msg & data rates may apply.` | Rate disclosure — both forms registered | `Message and data rates may apply.` (period-terminated): **privacy 124 only** · `Msg & data rates may apply.`: sms 94–95 (wrapped across two source lines), 99, 109. ⚠️ **sms 154 is a third variant** — `Message and data rates may apply, according to your mobile carrier's plan.` — **comma, not period.** Do not conflate it with the privacy-124 form |
| S-16 | `No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.` | Carrier-mandated disclaimer, appears on **both** pages | privacy 127; sms 169 |
| S-17 | `kwc-dinomonteverde.com` | Old-site domain in footer strip | privacy 154; sms 184 |
| S-18 | `© 2026 Dino Monteverde. All rights reserved.` | Copyright line | privacy 154; sms 184 |
| S-19 | `Privacy Policy` / `SMS Terms & Conditions` / `SMS Terms` | Page titles + cross-link anchor texts | `Privacy Policy`: privacy 6 (title), 7 (description), 112 (`h1`), 115, 147, 154 (footer link); sms 169 (cross-link), 184 (footer link) · `SMS Terms &amp; Conditions`: privacy 124 (cross-link); sms 6 (title), 141 (`h1`) · bare `SMS Terms`: privacy 154; sms 184 (footer links). ⚠️ sms 7 (description) uses the **bare-`&`** form `SMS / text-messaging Terms & Conditions` — see §1.1 |

**Character-set note (verified by codepoint scan):** the only non-ASCII characters in either file are `©` U+00A9, `·` U+00B7, `—` U+2014, and `─` U+2500 (comment rules only). **All apostrophes and quotation marks are ASCII** — `'` U+0027 and `"` U+0022. Any curly quote appearing in the ported files is a defect.

**No secrets appear in either source file.** Nothing to redact on these two pages.

---

## 7. Flags — record, do **not** change

| ID | Flag | Where (source) | Disposition |
|---|---|---|---|
| **F-1** | **Dino-singular voice inside registered legal/10DLC copy.** `I can call you tomorrow AM`, `I'll email the full PDF now`. Hokuten voice is team-first `we`. | sms 108, 110 | **Frozen.** Changing requires re-registering the 10DLC campaign. Log in PLACEHOLDERS.md under the KW/Forward Wilshire gate. |
| **F-2** | **Dino-singular entity where a Hokuten team entity may later be needed.** The whole policy is written as "Dino Monteverde (KW Commercial) … ('we,' 'us,' or 'our')" — a single licensee acting as the data controller. A Hokuten team of three will eventually need the controller named as the team/brokerage. | privacy 115, 140, 141; sms 145, 173, 174 | **Frozen** pending KW/Forward Wilshire paperwork + DRE team-name registration. Counsel marker P-1 sits at the intro. |
| **F-3** | `<title>` and `<meta description>` name Dino only; no Hokuten mention. | privacy 6–7; sms 6–7 | **Frozen** until Razim approves. Ship a `PLACEHOLDER:counsel` note in the route's `metadata` export. |
| **F-4** | Footer strip hard-codes `kwc-dinomonteverde.com` and `© 2026 Dino Monteverde. All rights reserved.` — wrong domain and wrong owner for `thehokutengroup.com`. | privacy 154; sms 184 | Owned by the shared Hokuten `<SiteFooter />` port pack, **not** by these two routes. Do not resolve here. Flagged so the two packs don't disagree. |
| **F-5** | Nav links to `marketplace.html`; Phase 1 has **no** `/marketplace` route (single landing route `/` + `/privacy` + `/sms-terms`, per PHASE-1-IMPLEMENTATION line 40). | privacy 103; sms 132 | Header component's problem, not the legal routes'. Do not emit a dead link. |
| **F-6** | **Sarhan Hotel Group — does NOT appear on either legal page.** Confirmed by case-insensitive full-repo grep: occurrences are only in `index.html:19,24,1145,1147,1234,1249` (1147 is the lowercase link `sarhanhotelgroup.com`) and `marketplace.html:375,400`. | n/a | **Nothing to carry over from these two pages.** Guardrail: no Sarhan branding anywhere in `site/`. Handled by the index/marketplace port packs. |
| **F-7** | `Mitsukaido Holdings LLC` (Dino's LLC) — **does not appear** in either legal page; `README.md:64` states it "has been removed from all consumer-facing copy." | n/a | Nothing to port. Do not reintroduce. |
| **F-8** | Source `--gold: #B8943D` is the **kit** gold; Hokuten website gold is `#B8902E`. | privacy/sms 20 | Use Hokuten tokens. Never copy the hex. |
| **F-9** | `Last updated: June 4, 2026` will be **stale on the day the Hokuten site ships** (today is 2026-08-08). Changing a legal effective date is a counsel act, not a build act. | privacy 113; sms 142 | **Frozen.** Counsel marker P-4 / P-11 covers the revision. |

---

## 8. Counsel-enrichment placeholders

Marker format is exactly:
```
{/* PLACEHOLDER:counsel — <what is needed> */}
```
Em dash is U+2014. Every marker below must also be registered as a row in `docs/PLACEHOLDERS.md` (file, line-anchor, what's needed, owner) — that register is a Definition-of-Done item (`docs/PHASE-1-EXECUTION.md` §8.3, §11).

Rules for the builder:
- Markers are **JSX comments placed immediately before** the heading/paragraph they qualify. They must not render.
- Where a marker introduces a **new section** (P-5, P-6), append it **after** the last existing numbered section so source numbering never shifts, and give the new section the next number in sequence.
- Where counsel content is missing but a heading is required to exist (P-5, P-6), ship the heading + a single placeholder paragraph of the given draft text, marker above it. Draft text below is **provisional** and clearly marked — it is not frozen.

| # | Page | Anchor / heading | Marker text (exact) | What is needed | Owner |
|---|---|---|---|---|---|
| P-1 | `/privacy` | Intro paragraph, before `<p>` at privacy 115 | `{/* PLACEHOLDER:counsel — controller entity: policy names Dino Monteverde (KW Commercial) as sole controller; confirm whether The Hokuten Group / Forward Wilshire should be named once the DRE team-name + KW paperwork clears. Frozen until then. */}` | Correct legal controller name + capacity for a 3-person team | Counsel (Forward Wilshire compliance) + Razim |
| P-2 | `/privacy` | `1. Information We Collect` | `{/* PLACEHOLDER:counsel — CalOPPA: enumerate the exact categories of PII collected (identifiers, commercial/property info, internet activity, geolocation-by-city, inferences) and the collection point for each (BOV form, consent modal, calculator inputs, analytics). Current prose is a partial list. */}` | Full CalOPPA category enumeration mapped to each form/field | Counsel |
| P-3 | `/privacy` | `5. How We Share Information` | `{/* PLACEHOLDER:counsel — CalOPPA: name the third parties that receive data — Web3Forms (form delivery), Calendly (scheduling), Vercel (hosting + Analytics), FRED (server-side proxy, no user data transmitted). Confirm each processor's role and whether any qualifies as a "sale"/"share" under CPRA. */}` | Named third-party/processor list + CPRA sale/share characterization | Counsel |
| P-4 | `/privacy` | `9. Changes to This Policy` | `{/* PLACEHOLDER:counsel — CalOPPA: describe the update process (how material changes are announced, whether prior versions are retained) and set the effective date. "Last updated: June 4, 2026" is the frozen kwc date and will be stale at Hokuten launch — counsel sets the new one. */}` | Update-notification mechanism + new effective date | Counsel |
| P-5 | `/privacy` | **New** `h2` appended after §9: `10. Do Not Track and Global Privacy Control` | `{/* PLACEHOLDER:counsel — CalOPPA §22575(b)(5): required Do-Not-Track disclosure, plus how the site responds to Global Privacy Control (GPC) signals. Draft below is provisional and must be confirmed against actual analytics behavior before launch. */}` | DNT + GPC response statement matching real behavior. **Provisional draft:** `We do not currently respond to "Do Not Track" browser signals. We do not permit third parties to collect personally identifiable information about your online activities over time and across third-party websites when you use this site.` | Counsel (+ engineering to confirm behavior) |
| P-6 | `/privacy` | **New** `h2` appended after P-5: `11. California Privacy Rights` | `{/* PLACEHOLDER:counsel — CCPA/CPRA: thresholds are likely not met today, but include the section so counsel enriches rather than retrofits. Needs: rights to know/delete/correct/opt-out, non-discrimination, the two request channels, and verification method. */}` | CCPA/CPRA rights section + request channels + verification | Counsel |
| P-7 | `/privacy` | `3. SMS / Text Messaging` | `{/* PLACEHOLDER:counsel — 10DLC: brand string "Dino Monteverde (KW Commercial)" is the registered campaign brand. Any Hokuten rebrand of this copy requires a new TCR campaign registration first. Do not edit. */}` | Confirmation of when a Hokuten campaign is registered | Razim / Dino (TCR filing) |
| P-8 | `/privacy` | `6. Data Retention and Security` | `{/* PLACEHOLDER:counsel — specify concrete retention periods per data category (form submissions, SMS consent records, analytics) and the safeguards described. Current sentence is unquantified. */}` | Retention schedule per category | Counsel |
| P-9 | `/privacy` | `8. Contact Us` | `{/* PLACEHOLDER:counsel — privacy contact channel: confirm whether a dedicated privacy/DSAR address is required in addition to dino.monteverde@kw.com, and whether a postal address must be listed. */}` | DSAR intake channel; postal address decision | Counsel |
| P-10 | `/privacy` | Route `metadata` export (title/description) | `{/* PLACEHOLDER:counsel — page title/description still name Dino Monteverde only; update to The Hokuten Group when the KW / Forward Wilshire naming gate clears. */}` | Approved Hokuten metadata strings | Razim |
| P-11 | `/sms-terms` | `1. Program Description` + the `.updated` line | `{/* PLACEHOLDER:counsel — 10DLC program owner + effective date: campaign is registered to "Dino Monteverde (KW Commercial)". Frozen byte-exact until a Hokuten campaign is registered with TCR; counsel resets "Last updated" at that time. */}` | New brand registration + new effective date | Razim / Dino (TCR) + counsel |
| P-12 | `/sms-terms` | Sample-message block (`sms-terms.html:87-114`) | `{/* PLACEHOLDER:compliance — A2P 10DLC registered sample messages; source sms-terms.html:87-114. Frozen until a Hokuten 10DLC campaign is registered. Do not edit strings. */}` | Re-registration if strings ever change (note: `compliance`, not `counsel`) | Razim / Dino (TCR) |
| P-13 | `/sms-terms` | `9. Privacy` | `{/* PLACEHOLDER:counsel — confirm the mobile-data-sharing disclaimer duplicated here and in privacy §4 still matches current carrier/TCR requirements at Hokuten launch. */}` | Carrier-language currency check | Counsel |
| P-14 | both | Top of each route file | `{/* PLACEHOLDER:counsel — VERBATIM PORT from kwc-dinomonteverde (privacy.html / sms-terms.html, 2026-06-04). Permitted legal-string substitutions: NONE. See docs/port/06-legal-pages.md §6. */}` | Standing notice so no future agent "improves" the copy | Razim |

---

## 9. Builder checklist

- [ ] `site/app/privacy/page.tsx` and `site/app/sms-terms/page.tsx` exist; both are static (no `"use client"` needed — no interactivity on either page).
- [ ] Each route exports `metadata` with the **rendered** `<title>`/`description` strings from §1.1 (plain JS strings, bare `&`, **never** the `&amp;` entity — Next escapes on output) and `robots: { index: true, follow: true }`.
- [ ] Shared `<SiteHeader />` + `<SiteFooter />`; no per-page nav or footer markup, no inlined `<style>`.
- [ ] One `h1` per page; flat `h2` run; source numbering intact; no `h3`.
- [ ] `<main>` uses the Hokuten legal-page container (860px measure, §1.4 rhythm) with Hokuten tokens — **no `#B8943D`**.
- [ ] `/privacy` §3 links to `/sms-terms`; `/sms-terms` §9 links to `/privacy` (Next `<Link>`).
- [ ] `mailto:`/`tel:` hrefs byte-exact per S-9 / S-11.
- [ ] All 14 markers from §8 present; every one registered in `docs/PLACEHOLDERS.md`.
- [ ] `SMS_10DLC_SAMPLES` exported from `site/content/sms-10dlc.ts`, unrendered.
- [ ] axe-core clean; contrast ≥4.5:1 on `--meta`-toned "Last updated" line and gold body links **in both themes** (gold and `theme-blue`).
- [ ] QA grep gates pass: zero occurrences of `Hakuten`, `Sarhan`, `Mitsukaido`, `#B8943D`, `’`, `“`, `”` in either route file; `Dino Monteverde (KW Commercial)` present and unmodified.
- [ ] **Occurrence counts inside `<main>` (excluding the shared footer) are exactly these — do not de-duplicate:**

| String | `/privacy` `<main>` | `/sms-terms` `<main>` |
|---|---|---|
| S-1 `Forward Wilshire Inc dba Keller Williams Larchmont` | **2** — intro (src 115) + contact block (src 141) | **2** — §1 (src 145) + contact block (src 174) |
| S-2 `CA DRE #01870534` | **2** — same two lines | **2** — same two lines |
| S-3 `CA DRE #01948432` | **0** — footer only (src 153) | **0** — footer only (src 183) |
| S-16 carrier disclaimer | **1** (src 127) | **1** (src 169) |

  The repetition of S-1/S-2 within one page is in the source and is deliberate (the entity is named once in the operative clause and once in the contact block). Collapsing either instance is a byte-exactness failure, not a cleanup.
