# PORT PACK 05 — Forms, City Picker, Phone Input, Ticker, Micro-interactions

**Source of record (read-only):** `~/Documents/Dino/dino-sites/kwc-dinomonteverde/`
Files read for this document: `index.html` (2290 lines), `api/ticker-data.js` (72 lines), `us-cities.min.json`, `vercel.json`, `README.md`.

**Status:** `provisional` — verbatim extraction complete; voice/brand rewrites flagged but NOT applied.

**Reading rules for the builder**
- Everything inside a fenced block is **byte-exact source**. Do not reflow, re-punctuate, or "fix" it.
- The old site speaks as one person (Dino, "I/my", "Dino will…"). Hokuten is team-first ("we/our"). Every place voice must change is marked **VOICE →**. The original is always quoted first.
- Brand is **HOKUTEN** / **THE HOKUTEN GROUP**. No misspelling of it ships in any artifact.
- Sarhan Hotel Group appears in this source. It is **flagged, never ported**.
- Web3Forms access key value is **redacted** here on purpose. See §A.3.

---

## 0. Global context this doc depends on

### 0.1 Design tokens referenced by every block below (`index.html:43-57`)

```css
  :root {
    --ground: #FFFFFF;
    --surface: #F7F4ED;
    --surface-deep: #EFE9DA;
    --ink: #1A1C1F;
    --ink-muted: #4A4D52;
    --meta: #8B8680;
    --gold: #B8943D;
    --gold-dim: #C9A04A;
    --rule: #E2DCCC;
    --dark: #16181B;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'JetBrains Mono', 'Courier New', monospace;
  }
```

> **GUARDRAIL:** the source `--gold` is `#B8943D` (kit gold). The Hokuten **website** gold is `#B8902E`. Do NOT copy `#B8943D` into `site/app/globals.css`. Hex values live only in design-skill reference 01 and `site/app/globals.css`.

### 0.2 External assets loaded in `<head>` (`index.html:806-812`)

```html
<!-- Calendly embed assets (client-side only; no API key). Powers the
     "Book a free consultation" popup on the calculator result + BOV section. -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>

<!-- intl-tel-input: country picker + per-country phone formatting/validation for the BOV form. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.2/build/css/intlTelInput.css">
```

### 0.3 Base form-field styling inherited by the BOV form (`index.html:403-411`)

```css
  .field { margin-bottom: 18px; }
  .field label { font-family: var(--sans); font-size: 9.5px; color: var(--gold); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500; margin-bottom: 6px; display: block; }
  .field input, .field select {
    width: 100%; padding: 11px 12px; background: var(--surface);
    border: 1px solid var(--rule); font-family: var(--sans); font-size: 14px;
    color: var(--ink); border-radius: 0; outline: none; transition: border-color 200ms;
  }
  .field input:focus, .field select:focus { border-bottom: 1px solid var(--gold); }
  .field input::placeholder { color: var(--meta); }
```

---

## A) BOV FORM (`index.html:1158-1215`)

### A.1 Full verbatim markup (`index.html:1158-1215`)

```html
<!-- BOV FORM -->
<section class="bov-section" id="bov">
  <div class="content">
    <div class="bov-grid">
      <div>
        <div class="eyebrow" style="margin-bottom: 18px;">Broker Opinion of Value</div>
        <h2 style="font-family: var(--serif); font-size: clamp(28px, 3.4vw, 46px); font-weight: 400; line-height: 1.1; margin-bottom: 18px;">What's your hotel <span style="font-style: italic; color: var(--gold);">worth</span>?</h2>
        <p style="font-family: var(--serif); font-style: italic; font-size: 16px; color: var(--ink-muted); max-width: 32em; margin-bottom: 40px;">Initial BOV delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data. No cost, no obligation.</p>

        <form class="bov-form" id="bovForm" action="https://api.web3forms.com/submit" method="POST">
          <!-- Web3Forms access key (public client-side key — safe to expose). Submissions email the inbox on Dino's Web3Forms account. -->
          <input type="hidden" name="access_key" value="<REDACTED — env var NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY>">
          <input type="hidden" name="subject" value="New BOV request — kwc-dinomonteverde.com">
          <input type="hidden" name="from_name" value="Dino Monteverde Website">
          <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
          <!-- SMS opt-in audit trail (records consent context per 10DLC/TCR) -->
          <input type="hidden" name="sms_consent_text" value="Up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent not a condition of purchase.">
          <input type="hidden" name="consent_timestamp" id="consentTimestamp" value="">
          <div class="field"><label>Name *</label><input type="text" name="name" placeholder="Your name" required></div>
          <div class="field"><label>Hotel Name *</label><input type="text" name="hotel_name" placeholder="Property name" required></div>
          <div class="field full city-search-field">
            <label for="citySearch">City, State *</label>
            <!-- Search input: shown until a city is picked -->
            <div class="city-combo" id="cityCombo">
              <input type="text" id="citySearch" autocomplete="off" placeholder="Start typing a city…" role="combobox" aria-expanded="false" aria-controls="cityList" aria-autocomplete="list">
              <ul class="city-list" id="cityList" role="listbox" hidden></ul>
            </div>
            <!-- Selected chip: shown after a city is picked (non-editable + reset) -->
            <div class="city-selected" id="citySelected" hidden>
              <span class="city-selected-text" id="citySelectedText"></span>
              <button type="button" class="city-reset" id="cityReset" aria-label="Change city">Reset</button>
            </div>
            <div class="field-err" id="cityErr"></div>
            <input type="hidden" name="city" id="cityField">
            <input type="hidden" name="state" id="stateField">
          </div>
          <div class="field"><label>Phone (optional)</label><input type="tel" id="bovPhone" placeholder="Phone number"><div class="field-err" id="phoneErr"></div></div>
          <div class="field"><label>Email *</label><input type="email" name="email" id="bovEmail" placeholder="name@company.com" required><div class="field-err" id="emailErr"></div></div>
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
          <button type="submit" id="bovSubmit">Send valuation request</button>
          <div class="bov-status" id="bovStatus" role="status" aria-live="polite"></div>
        </form>
      </div>
      <div>
        <p class="bov-disclaimer" id="contact">Thinking about selling your hotel, now or down the road? Most owners hesitate to inquire until they're already committed to a sale. We'd rather meet you earlier than that. Prefer email? Send the property name, location, and available T-12 / STR information to <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a>. A call is optional.</p>
      </div>
    </div>
  </div>
</section>
```

> **REDACTION NOTE:** `index.html:1169` carries a literal Web3Forms access key value. It is **not** reproduced here. In the Hokuten build it becomes an env var (see §A.3). The source's own comment claims the key is "public … safe to expose"; treat it as a config value regardless — never hardcode it in the repo.

### A.2 Field-by-field table (exact attributes as authored)

| # | Src line | Element | `name` | `id` | `type` | Label text (verbatim) | Placeholder (verbatim) | `autocomplete` | Required | Validation / pattern | `maxlength` | `inputmode` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1169 | `input` | `access_key` | — | `hidden` | — | — | — | — | JS guard: rejects literal `YOUR_WEB3FORMS_ACCESS_KEY` (line 2231) | — | — |
| 2 | 1170 | `input` | `subject` | — | `hidden` | — | — | — | — | value overwritten at runtime (line 1270) | — | — |
| 3 | 1171 | `input` | `from_name` | — | `hidden` | — | — | — | — | static | — | — |
| 4 | 1172 | `input` | `botcheck` | — | `checkbox` | — | — | `off` | — | **honeypot** — see §A.4 | — | — |
| 5 | 1174 | `input` | `sms_consent_text` | — | `hidden` | — | — | — | — | static audit-trail string | — | — |
| 6 | 1175 | `input` | `consent_timestamp` | `consentTimestamp` | `hidden` | — | — | — | — | stamped `new Date().toISOString()` on submit (line 2241) | — | — |
| 7 | 1176 | `input` | `name` | — | `text` | `Name *` | `Your name` | *(none)* | ✅ `required` | native only | *(none)* | *(none)* |
| 8 | 1177 | `input` | `hotel_name` | — | `text` | `Hotel Name *` | `Property name` | *(none)* | ✅ `required` | native only | *(none)* | *(none)* |
| 9 | 1182 | `input` | *(none — display only)* | `citySearch` | `text` | `City, State *` (`<label for="citySearch">`) | `Start typing a city…` (U+2026 ellipsis) | `off` | ❌ (JS-enforced, see §A.6) | must match a picked list item | *(none)* | *(none)* |
| 10 | 1191 | `input` | `city` | `cityField` | `hidden` | — | — | — | JS-required | non-empty checked at submit | — | — |
| 11 | 1192 | `input` | `state` | `stateField` | `hidden` | — | — | — | — | set by picker only | — | — |
| 12 | 1194 | `input` | *(none in markup — injected at submit as `phone`)* | `bovPhone` | `tel` | `Phone (optional)` | `Phone number` (replaced at runtime by intl-tel-input `autoPlaceholder: "aggressive"`) | *(none)* | ❌ optional | intl-tel-input `isValidNumber()`; fallback ≥7 digits | *(none — `strictMode` caps per country)* | *(none)* |
| 13 | 1195 | `input` | `email` | `bovEmail` | `email` | `Email *` | `name@company.com` | *(none)* | ✅ `required` | JS regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | *(none)* | *(none)* |
| 14 | 1199 | `input` | `sms_consent` | — | `checkbox` | see §A.5 | — | — | ❌ optional, unchecked by default | — | — | — |

There are **no `<select>` and no `<textarea>` elements in the BOV form.** (`<select>`s exist only in the calculator — out of scope for this doc.)

**Grid placement:** the form is a 2-column CSS grid (`index.html:605`). Fields 7, 8, 12, 13 occupy one column each in DOM order (Name, Hotel Name / Phone, Email). Fields with `.field.full` (city block, consent block) span `grid-column: 1 / -1`. Submit button and status span full width. On `max-width: 640px` the grid collapses to `1fr` (`index.html:779`).

### A.3 Web3Forms wiring

- **Endpoint / method:** `action="https://api.web3forms.com/submit"`, `method="POST"` (`index.html:1167`).
- **Actual transport:** NOT a native form POST. `submit` is `preventDefault()`ed and the payload is sent as `FormData` via `fetch` with `Accept: application/json` (`index.html:2212-2248`). **No redirect, no `redirect` hidden field, no `_next` field** — it is an AJAX/inline-status form. Success/failure is rendered inline into `#bovStatus`.
- **Access key:** source line 1169 hardcodes the value. **Hokuten port:** move to `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (client-visible by nature of Web3Forms) **or**, preferred, proxy the POST through a Next.js Route Handler so the key stays server-side as `WEB3FORMS_ACCESS_KEY`. Either way: never commit the literal. Record the choice in PROJECT-MEMORY.md.
- **`subject` is rewritten at runtime** from the single site-domain constant (`index.html:1266-1270`):

```js
  /* ============ CONFIG ============ */
  /* SET THIS: the live domain. Single source of truth — change here only. */
  var SITE_DOMAIN = "kwc-dinomonteverde.com";
  document.getElementById("siteDomain").textContent = SITE_DOMAIN;
  document.querySelector('input[name=subject]').value = "New BOV request — " + SITE_DOMAIN;
```

  **VOICE / BRAND →** `SITE_DOMAIN` becomes the Hokuten domain; `from_name` `"Dino Monteverde Website"` becomes the Hokuten site name; subject prefix stays the pattern `"New BOV request — " + SITE_DOMAIN`. Note the em dash `—` (U+2014) with surrounding spaces.

### A.4 Honeypot

```html
          <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
```
(`index.html:1172`)

Hidden via **inline `style="display:none"`** (not a visually-hidden/off-screen class), removed from tab order via `tabindex="-1"`, and `autocomplete="off"`. `botcheck` is Web3Forms' own convention — Web3Forms rejects the submission server-side if it is truthy. It is included in the `FormData` automatically because it lives inside `#bovForm`. **Port as-is**, including the `name` (renaming it breaks the Web3Forms contract).

### A.5 SMS consent block — BYTE-EXACT COMPLIANCE COPY (do not edit)

Checkbox `value` attribute (`index.html:1199`):

```
I consent to receive SMS text messages from Dino Monteverde (KW Commercial).
```

Checkbox label span (`index.html:1200`, raw HTML incl. entities):

```html
              <span>I agree to receive informational and conversational SMS text messages from <strong>Dino Monteverde</strong> (KW Commercial) about my hotel valuation and related real-estate matters. Message frequency varies (up to 6 msgs/month). Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase or of receiving a valuation. This is separate from the valuation request above and is optional.</span>
```

Hidden audit-trail string (`index.html:1174`):

```
Up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent not a condition of purchase.
```

Consent links paragraph (`index.html:1202-1204`):

```html
            <p class="consent-links">
              See our <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> and <a href="sms-terms.html" target="_blank" rel="noopener">SMS Terms &amp; Conditions</a>.
            </p>
```

> **COMPLIANCE HOLD.** `README.md:60-64` states the brand string **"Dino Monteverde (KW Commercial)"** is the *registered A2P 10DLC / TCR campaign brand* and must stay byte-identical across the consent checkbox, `sms-terms.html` sample messages, and `privacy.html`. It therefore **cannot be swapped to a Hokuten string by an implementer**. Port the *structure* verbatim; the brand string inside it is `blocked: awaiting new 10DLC/TCR registration for THE HOKUTEN GROUP`. Do not ship an SMS consent box with a mismatched brand string. Track in PROJECT-MEMORY.md open items alongside the KW / Forward Wilshire paperwork gate.

### A.6 Submit handler, validation order, and every status string (`index.html:2212-2266`)

```js
    form.addEventListener("submit", function(e){
      e.preventDefault();

      var okPhone = validatePhone();
      var okEmail = validateEmail();
      var cityFieldEl = document.getElementById("cityField");
      var citySearchEl = document.getElementById("citySearch");
      var cityErrEl = document.getElementById("cityErr");
      var okCity = !!(cityFieldEl && cityFieldEl.value.trim());
      if (!okCity && cityErrEl){ cityErrEl.textContent = "Please pick a city from the list."; if (citySearchEl) citySearchEl.classList.add("invalid"); }
      else if (cityErrEl){ cityErrEl.textContent = ""; if (citySearchEl) citySearchEl.classList.remove("invalid"); }
      if (!okPhone || !okEmail || !okCity){
        status.className = "bov-status err";
        status.textContent = "Please fix the highlighted fields.";
        (!okCity ? citySearchEl : (!okPhone ? phoneInput : emailInput)).focus();
        return;
      }

      var key = form.querySelector('input[name=access_key]').value;
      if (key === "YOUR_WEB3FORMS_ACCESS_KEY"){
        status.className = "bov-status err";
        status.textContent = "Form not yet connected — add the Web3Forms access key to go live.";
        return;
      }

      status.className = "bov-status"; status.textContent = "Sending…";
      submit.disabled = true;

      // Stamp the moment of submission as opt-in evidence (only meaningful when the box is checked).
      var ts = document.getElementById("consentTimestamp"); if (ts) ts.value = new Date().toISOString();

      // Build the payload; inject the FULL international phone number (E.164) only when one was entered.
      var data = new FormData(form);
      var phoneVal = (phoneInput.value || "").trim();
      data.set("phone", phoneVal ? (iti && iti.getNumber ? iti.getNumber() : phoneVal) : "");

      fetch(form.action, { method: "POST", body: data, headers: { "Accept": "application/json" } })
        .then(function(r){ return r.json(); })
        .then(function(d){
          if (d.success){
            status.className = "bov-status ok";
            status.textContent = "Thank you — your request is in. Your initial BOV is delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data.";
            form.reset();
            clearErr(phoneInput, phoneErr); clearErr(emailInput, emailErr);
          } else {
            status.className = "bov-status err";
            status.textContent = "Something went wrong. Please email dino.monteverde@kw.com directly.";
          }
        })
        .catch(function(){
          status.className = "bov-status err";
          status.textContent = "Network error. Please email dino.monteverde@kw.com directly.";
        })
        .finally(function(){ submit.disabled = false; });
    });
```

**Behaviour to reimplement exactly:**

1. `preventDefault()` always.
2. Run `validatePhone()` then `validateEmail()` (both always run — no short-circuit, so both fields get their inline errors painted in one pass), then the city check.
3. City check is truthiness of the **hidden `#cityField`**, not the visible search text.
4. Focus priority on failure: **city → phone → email**.
5. Status element `#bovStatus` has three class states: `bov-status` (neutral/sending), `bov-status ok`, `bov-status err`. It is `role="status" aria-live="polite"`.
6. `submit.disabled = true` during flight; re-enabled in `.finally()` **even on success** (so the button becomes clickable again after a successful send).
7. `consent_timestamp` is stamped **at submit time**, unconditionally (whether or not the SMS box is checked).
8. `data.set("phone", …)` — the phone field has **no `name` attribute in markup**, so `phone` is injected into the `FormData` only here. Empty string when blank.
9. On success: `form.reset()` **plus** manual `clearErr()` on phone and email (reset does not clear the `.invalid` class or the `.field-err` text).

**Verbatim status strings (copy deck):**

| State | String |
|---|---|
| Validation failure | `Please fix the highlighted fields.` |
| Unconfigured key | `Form not yet connected — add the Web3Forms access key to go live.` |
| In flight | `Sending…` |
| Success | `Thank you — your request is in. Your initial BOV is delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data.` |
| API returned `success:false` | `Something went wrong. Please email dino.monteverde@kw.com directly.` |
| Network/throw | `Network error. Please email dino.monteverde@kw.com directly.` |
| City not picked (inline, `#cityErr`) | `Please pick a city from the list.` |
| Phone invalid (inline, `#phoneErr`) | `Enter a valid phone number for the selected country.` |
| Phone invalid, utils not loaded (inline) | `Enter a valid phone number.` |
| Email empty (inline, `#emailErr`) | `Email is required.` |
| Email malformed (inline) | `Enter a valid email address.` |

**VOICE →** the two failure strings hardcode `dino.monteverde@kw.com`. Hokuten substitutes the team inbox. The success string is already team-neutral ("your request is in") and its 48-hour SLA language matches the section intro verbatim — keep them in sync.

### A.7 Error-state helpers + email validation (`index.html:2188-2210`)

```js
    function setErr(input, errEl, msg){ input.classList.add("invalid"); if (errEl) errEl.textContent = msg; }
    function clearErr(input, errEl){ input.classList.remove("invalid"); if (errEl) errEl.textContent = ""; }

    function validatePhone(){
      var v = (phoneInput.value || "").trim();
      if (!v){ clearErr(phoneInput, phoneErr); return true; }  // phone is optional now → empty is valid
      // If utils loaded, use the library's per-country validation; else basic length check.
      if (iti && typeof iti.isValidNumber === "function"){
        if (!iti.isValidNumber()){ setErr(phoneInput, phoneErr, "Enter a valid phone number for the selected country."); return false; }
      } else if (v.replace(/\D/g, "").length < 7){
        setErr(phoneInput, phoneErr, "Enter a valid phone number."); return false;
      }
      clearErr(phoneInput, phoneErr); return true;
    }

    function validateEmail(){
      var v = (emailInput.value || "").trim();
      if (!v){ setErr(emailInput, emailErr, "Email is required."); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ setErr(emailInput, emailErr, "Enter a valid email address."); return false; }
      clearErr(emailInput, emailErr); return true;
    }
    emailInput.addEventListener("blur", validateEmail);
    emailInput.addEventListener("input", function(){ if (emailInput.classList.contains("invalid")) validateEmail(); });
```

Email UX contract: validate on **blur**; on **input** re-validate **only if already in the error state** (i.e. errors clear as you type but never appear while typing a fresh value).

### A.8 BOV form CSS (`index.html:602-630`)

```css
  /* ==================== BOV FORM ==================== */
  section.bov-section { background: var(--ground); border-top: 1px solid var(--rule); }
  .bov-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 64px; align-items: start; }
  .bov-form { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .bov-form .field { margin-bottom: 0; }
  .bov-form .field.full { grid-column: 1 / -1; }
  /* Scope to the submit button only — must NOT style the intl-tel-input
     country-selector button (which is also a <button> inside .bov-form). */
  .bov-form > button[type=submit], .bov-form #bovSubmit {
    background: var(--gold); color: var(--ink); border: 1px solid var(--gold);
    padding: 16px 28px; font-family: var(--sans); font-size: 11px; letter-spacing: 0.22em;
    text-transform: uppercase; font-weight: 500; cursor: pointer; grid-column: 1 / -1; margin-top: 18px; justify-self: start;
    transition: background 200ms;
  }
  .bov-form #bovSubmit:hover { background: var(--gold-dim); }
  .bov-form #bovSubmit:disabled { opacity: 0.55; cursor: default; }
  .bov-status { grid-column: 1 / -1; font-family: var(--sans); font-size: 13px; margin-top: 16px; min-height: 20px; }
  .bov-status.ok { color: #3a6b3a; }
  .bov-status.err { color: #9a3a2a; }
  .bov-disclaimer { font-family: var(--serif); font-style: italic; font-size: 14px; color: var(--ink-muted); line-height: 1.6; padding-left: 24px; border-left: 2px solid var(--gold); }
  .bov-form .bov-consent { grid-column: 1 / -1; margin-top: 6px; }
  .bov-form .consent-check { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
  .bov-form .consent-check input[type=checkbox] { width: 16px; height: 16px; margin-top: 3px; flex: 0 0 auto; accent-color: var(--gold); }
  .bov-form .consent-check span { font-family: var(--sans); font-size: 12px; line-height: 1.55; color: var(--ink-muted); }
  .bov-form .consent-links { font-family: var(--sans); font-size: 11.5px; margin-top: 8px; color: var(--ink-muted); }
  .bov-form .consent-links a { color: var(--gold); text-decoration: underline; }
  /* per-field inline validation (phone + email) */
  .field-err { font-family: var(--sans); font-size: 11px; color: #9a3a2a; min-height: 13px; margin-top: 5px; }
  .bov-form input.invalid, .calc-emailcap input.invalid { border-color: #c0392b !important; box-shadow: 0 0 0 2px rgba(192,57,43,0.12); }
```

Note `.field-err { min-height: 13px; }` and `.bov-status { min-height: 20px; }` — space is reserved so appearing errors never shift layout. Preserve that in React.

### A.9 Related: calculator email-capture mini-form (same Web3Forms key)

Markup (`index.html:1071-1080`):

```html
          <!-- Optional email capture → Web3Forms (sends the estimate + inputs to Dino as a lead) -->
          <div class="calc-emailcap" id="calcEmailcap">
            <label for="calcEmail">Email me this estimate + the comp set we'd use</label>
            <div class="calc-emailcap-row">
              <input type="email" id="calcEmail" placeholder="you@company.com" autocomplete="email" inputmode="email">
              <button type="button" id="calcEmailSend">Send it</button>
            </div>
            <div class="calc-emailcap-status" id="calcEmailStatus" role="status" aria-live="polite"></div>
          </div>
          <button type="button" id="calcBook" class="result-altcta" style="display:block; width:100%; text-align:center; margin-bottom: 12px; background:none; border:none; cursor:pointer;">Prefer a call? Book 15 minutes →</button>
```

This is the **only** field on the page with `autocomplete` + `inputmode` set (`autocomplete="email" inputmode="email"`).

Handler (`index.html:1949-2025`) — key points, quoted:

```js
    var ACCESS_KEY = (document.querySelector('#bovForm input[name=access_key]') || {}).value || "";
```

```js
      var email = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        statusEl.className = "calc-emailcap-status err";
        statusEl.textContent = "Please enter a valid email.";
        input.focus(); return;
      }
      if (!ACCESS_KEY || ACCESS_KEY.indexOf("YOUR_") === 0){
        statusEl.className = "calc-emailcap-status err";
        statusEl.textContent = "Email isn't connected yet — please send your details to dino.monteverde@kw.com.";
        return;
      }
```

```js
      var payload = {
        access_key: ACCESS_KEY,
        subject: "Valuation lead — " + SITE_DOMAIN,
        from_name: "KWC Valuation Tool",
        email: email,
        property_type: val("cType"),
        keys: val("cKeys"),
        market: val("cMarket"),
        market_tier: val("cTier"),
        brand_flag: val("cBrandFlag"),
        condition: val("cCond"),
        occupancy_pct: val("cOcc"),
        adr: "$" + val("cAdr"),
        revpar: est.revpar || "",
        noi_per_key: est.noiPerKey || "",
        cap_range: est.capRangeUsed || "",
        estimated_range: est.range || "",
        summary: est.summary || "",
        insights: (est.insightCodes || []).join(", "),
        top_advice: est.topAdvice || ""
      };

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
```

Note: this one posts **JSON** (`Content-Type: application/json`), unlike the BOV form which posts `FormData`. Status strings, verbatim:

| State | String |
|---|---|
| Invalid email | `Please enter a valid email.` |
| Key not configured | `Email isn't connected yet — please send your details to dino.monteverde@kw.com.` |
| In flight | `Sending…` |
| Success | `Done — Dino will send your estimate and comp set shortly.` |
| `success:false` | `Couldn't send — please email dino.monteverde@kw.com.` |
| Network/throw | `Network error — please email dino.monteverde@kw.com.` |

On success the input is `disabled` and the button label becomes `Sent`; `send.disabled = false` on every failure path (but stays disabled on success).

**VOICE →** `"Done — Dino will send your estimate and comp set shortly."` must become team-first, e.g. "Done — we'll send your estimate and comp set shortly." `from_name: "KWC Valuation Tool"` becomes a Hokuten string. Label copy `"Email me this estimate + the comp set we'd use"` is already "we" — keep.

---

## B) THE CITY / STATE PICKER (`index.html:2027-2132`)

### B.1 Data file shape — `us-cities.min.json`

Verified by parsing the file (552,845 bytes on disk):

```json
{"states":{"KY":"Kentucky","PA":"Pennsylvania","CA":"California","GA":"Georgia", … },"cities":[["88","KY"],["Aaronsburg","PA"],["AARP","CA"],["ABAC","GA"],["Abbeville","AL"], … ,["Zurich","MT"],["Zwingle","IA"],["Zwolle","LA"]]}
```

- Top-level keys: exactly `states` and `cities`.
- `states`: **61 entries**, `{ USPS code → full state name }` (61 > 50 because territories/DC/military codes are present).
- `cities`: **29,856 entries**, each a 2-tuple `[cityName, stateCode]`. Sorted case-insensitively ascending by city name. The list is raw USPS place data and contains junk entries (`"88"`, `"AARP"`, `"ABAC"`) — note for QA, but the source ships them as-is.

**Port note:** copy the file into `site/public/` unchanged (it is 540 KB raw; the source comment says "~130KB-gzipped"). It is self-hosted deliberately — "no third-party API, fully private."

### B.2 Full picker source (`index.html:2027-2132`)

```js
  /* ============ CITY PICKER (searchable US city -> City + State) ============
     Type a city, pick "Albany, NY" from the list, and the City ("Albany") and
     State ("New York") fields fill automatically. The ~130KB-gzipped city
     dataset (us-cities.min.json) loads lazily on first focus, so it never
     affects initial page load. Self-hosted — no third-party API, fully private. */
  (function(){
    var search = document.getElementById("citySearch");
    var listEl = document.getElementById("cityList");
    var cityField = document.getElementById("cityField");
    var stateField = document.getElementById("stateField");
    var cityErr = document.getElementById("cityErr");
    var combo = document.getElementById("cityCombo");
    var selected = document.getElementById("citySelected");
    var selectedText = document.getElementById("citySelectedText");
    var resetBtn = document.getElementById("cityReset");
    if (!search || !listEl || !cityField || !stateField) return;

    var DATA = null, loading = false, activeIdx = -1, current = [];

    function loadData(){
      if (DATA || loading) return;
      loading = true;
      fetch("us-cities.min.json", { cache: "force-cache" })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function(j){ DATA = j; if (document.activeElement === search && search.value.trim()) render(search.value); })
        .catch(function(){ loading = false; });  // allow a retry on next focus
    }

    function close(){ listEl.hidden = true; listEl.innerHTML = ""; activeIdx = -1; current = []; search.setAttribute("aria-expanded","false"); }

    function pick(item){
      var full = DATA.states[item[1]] || item[1];
      cityField.value = item[0];
      stateField.value = full;
      if (cityErr) cityErr.textContent = "";
      close();
      // Swap the search input for the non-editable selected chip.
      selectedText.textContent = item[0] + ", " + full;   // e.g. "Albany, New York"
      if (combo) combo.hidden = true;
      if (selected) selected.hidden = false;
      search.classList.remove("invalid");
    }

    function reset(){
      cityField.value = ""; stateField.value = ""; search.value = "";
      if (selected) selected.hidden = true;
      if (combo) combo.hidden = false;
      close();
      search.focus();
    }
    if (resetBtn) resetBtn.addEventListener("click", reset);

    function render(q){
      q = (q || "").trim().toLowerCase();
      if (!DATA){ loadData(); return; }
      if (q.length < 2){ close(); return; }
      // Match city names that start with the query (then contains), cap to 60.
      var starts = [], contains = [];
      for (var i = 0; i < DATA.cities.length && (starts.length + contains.length) < 400; i++){
        var name = DATA.cities[i][0].toLowerCase();
        if (name.indexOf(q) === 0) starts.push(DATA.cities[i]);
        else if (name.indexOf(q) > 0) contains.push(DATA.cities[i]);
      }
      current = starts.concat(contains).slice(0, 60);
      if (!current.length){
        listEl.innerHTML = '<li class="city-empty">No matching city</li>';
        listEl.hidden = false; activeIdx = -1; search.setAttribute("aria-expanded","true");
        return;
      }
      listEl.innerHTML = current.map(function(c, i){
        return '<li role="option" data-i="'+i+'">'+c[0]+'<span class="st">, '+c[1]+'</span></li>';
      }).join("");
      listEl.hidden = false; activeIdx = -1; search.setAttribute("aria-expanded","true");
    }

    function setActive(i){
      var items = listEl.querySelectorAll('li[role=option]');
      if (!items.length) return;
      if (i < 0) i = items.length - 1; if (i >= items.length) i = 0;
      items.forEach(function(el){ el.classList.remove("active"); });
      items[i].classList.add("active"); items[i].scrollIntoView({ block: "nearest" });
      activeIdx = i;
    }

    search.addEventListener("focus", loadData);
    search.addEventListener("input", function(){
      // typing invalidates a previous selection until a new pick is made
      cityField.value = ""; stateField.value = "";
      render(search.value);
    });
    search.addEventListener("keydown", function(e){
      if (listEl.hidden) return;
      if (e.key === "ArrowDown"){ e.preventDefault(); setActive(activeIdx + 1); }
      else if (e.key === "ArrowUp"){ e.preventDefault(); setActive(activeIdx - 1); }
      else if (e.key === "Enter"){ if (activeIdx > -1 && current[activeIdx]){ e.preventDefault(); pick(current[activeIdx]); } }
      else if (e.key === "Escape"){ close(); }
    });
    listEl.addEventListener("mousedown", function(e){
      // mousedown (not click) so it fires before the input blur closes the list
      var li = e.target.closest("li[role=option]");
      if (li){ e.preventDefault(); pick(current[+li.getAttribute("data-i")]); }
    });
    document.addEventListener("click", function(e){
      if (!e.target.closest(".city-combo")) close();
    });
  })();
```

### B.3 Behaviour spec (reimplement without re-reading source)

**Loading — lazy, on first focus.**
- `loadData()` is bound to the search input's `focus` event, and is also called from `render()` when `DATA` is still null.
- Guarded by `if (DATA || loading) return;` so it fires at most once while in flight.
- `fetch("us-cities.min.json", { cache: "force-cache" })` — relative path, aggressive HTTP cache.
- Non-`r.ok` → `Promise.reject(r.status)` → `.catch` sets `loading = false` **but leaves `DATA` null**, so the next focus retries. (Deliberate — comment says so.)
- On success, if the input is still focused **and** already has non-blank text, it immediately re-renders (handles "user typed while the JSON was downloading").

**Search / filter algorithm.**
1. Normalize: `q = (q||"").trim().toLowerCase()`.
2. If `DATA` is null → kick `loadData()` and bail (render nothing).
3. If `q.length < 2` → `close()` (list hidden). **Minimum query length is 2.**
4. Single pass over all 29,856 cities, lowercasing each city name:
   - `indexOf(q) === 0` → push to `starts` (prefix match)
   - `indexOf(q) > 0` → push to `contains` (substring match, not at position 0)
   - Loop **stops early** once `starts.length + contains.length >= 400`.
5. `current = starts.concat(contains).slice(0, 60)` — prefix matches always rank above substring matches; **max 60 rendered rows**.
6. Match is on **city name only** — the state code is never searched. Typing "CA" matches cities whose *name* contains "ca", not California cities.
7. No debounce. Runs synchronously on every `input`. (For React: this is ~30k lowercase+indexOf per keystroke. Acceptable, but a memoized pre-lowercased index is a safe, behaviour-preserving optimization.)

**Result-list markup.**
- Container: `<ul class="city-list" id="cityList" role="listbox" hidden>`.
- Row: `<li role="option" data-i="{index}">{City}<span class="st">, {ST}</span></li>` — note the list shows the **two-letter code**, e.g. `Albany, NY`.
- Empty state: `<li class="city-empty">No matching city</li>` (no `role="option"`, not selectable, `cursor: default`, italic).
- Rows are **not escaped** in the source (`c[0]` interpolated raw). Data is trusted/static, but in React just render text nodes.
- Open/close is driven by the `hidden` attribute plus `aria-expanded` on the input (`"true"` / `"false"`).
- **A11y gap to fix in the port:** the source never sets `aria-activedescendant`, and `<li>` rows have no `id`. Add `id` + `aria-activedescendant` in the Hokuten build (behaviour-preserving improvement; log it).

**Keyboard behaviour** (only active while `!listEl.hidden`):
- `ArrowDown` → `setActive(activeIdx + 1)`, `preventDefault()`. Wraps to index 0 past the end.
- `ArrowUp` → `setActive(activeIdx - 1)`, `preventDefault()`. Wraps to last item from -1/0.
- `Enter` → only if `activeIdx > -1` and that item exists: `preventDefault()` + `pick()`. **If nothing is highlighted, Enter falls through to native form submit** — which then fails the city check and shows `Please pick a city from the list.`
- `Escape` → `close()` (list only; does not clear the input).
- `setActive` also calls `items[i].scrollIntoView({ block: "nearest" })`.
- Highlight class is `.active`.
- Initial `activeIdx` after every render is `-1` (nothing pre-selected).

**Mouse behaviour.**
- Selection is bound to **`mousedown`, not `click`** — deliberately, so it fires before the input's blur tears the list down. `e.preventDefault()` inside also stops focus loss.
- A document-level `click` listener closes the list whenever the click target is not inside `.city-combo`.

**Pick → selected-chip state machine.**
- `pick(item)`: `full = DATA.states[item[1]] || item[1]` (falls back to the raw code if the state map lacks it).
- Sets hidden `#cityField` = **city name only** (`"Albany"`), hidden `#stateField` = **full state name** (`"New York"`).
- Clears `#cityErr`, closes the list, removes `.invalid` from the input.
- **Swaps UI:** `#cityCombo` gets `hidden`, `#citySelected` loses `hidden`. The chip text is `` `${city}, ${fullState}` `` — e.g. `Albany, New York` (full name in the chip, two-letter code in the list rows).
- `reset()` (the `Reset` button, `aria-label="Change city"`): clears both hidden fields **and** the search input's text, un-hides the combo, hides the chip, closes the list, refocuses the search input.
- Typing in the search input **immediately invalidates any prior selection** (`cityField.value = ""; stateField.value = "";`) before rendering.

**Value format submitted to Web3Forms:** two separate fields — `city` = `"Albany"`, `state` = `"New York"`. The combined `"Albany, New York"` string is display-only.

### B.4 City picker CSS (`index.html:664-688`)

```css
  /* ---- Searchable city picker (BOV form) ---- */
  .city-combo { position: relative; }
  .city-list {
    position: absolute; top: calc(100% + 2px); left: 0; right: 0; z-index: 70;
    margin: 0; padding: 4px 0; list-style: none; max-height: 260px; overflow-y: auto;
    background: var(--ground); border: 1px solid var(--rule); box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  }
  .city-list[hidden] { display: none; }
  .city-list li {
    padding: 9px 14px; font-family: var(--sans); font-size: 14px; color: var(--ink);
    cursor: pointer; line-height: 1.3;
  }
  .city-list li .st { color: var(--meta); }
  .city-list li.active, .city-list li:hover { background: var(--surface); }
  .city-list li.city-empty { color: var(--meta); cursor: default; font-style: italic; }
  /* Selected city chip (shown after a pick, replaces the search input) */
  .city-selected[hidden] { display: none; }
  .city-combo[hidden] { display: none; }
  .city-selected { display: flex; align-items: center; justify-content: space-between; gap: 12px;
    background: var(--surface); border: 1px solid var(--rule); padding: 11px 14px; }
  .city-selected-text { font-family: var(--sans); font-size: 15px; color: var(--ink); }
  .city-reset { background: none; border: none; cursor: pointer; flex-shrink: 0;
    font-family: var(--sans); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--gold); border-bottom: 1px solid var(--gold); padding: 0 0 1px; }
  .city-reset:hover { color: var(--ink); border-color: var(--ink); }
```

Note the explicit `[hidden] { display: none; }` rules — needed because `.city-list`/`.city-selected`/`.city-combo` carry `display` values that would otherwise beat the UA `[hidden]` rule.

---

## C) THE PHONE INPUT — intl-tel-input (`index.html:2134-2186`)

### C.1 Version + CDN

- **Library:** `intl-tel-input@25.11.2`
- **CSS** — eagerly in `<head>` (`index.html:812`): `https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.2/build/css/intlTelInput.css`
- **JS** — injected lazily by script (`index.html:2152`): `https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.2/build/js/intlTelInput.min.js`, appended to `document.head` as a plain `<script>` (no `async`/`defer` attribute set explicitly; dynamically-inserted scripts are async by default).
- **utils** — dynamic `import()` inside `loadUtils` (`index.html:2164`): `https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.2/build/js/utils.js`

> **PORT NOTE:** for Hokuten, prefer the npm package `intl-tel-input@25.11.2` with `loadUtils` pointed at a self-hosted `utils.js` (or `import("intl-tel-input/build/js/utils")`). Third-party CDN scripts are a CSP/perf liability; log the swap. Pin the exact version — the option names below are 25.x-specific (`countrySearch`, `useFullscreenPopup`, `strictMode`, `loadUtils` all changed shape in v18→v19→v21→v24).

### C.2 Init source (`index.html:2149-2186`)

```js
    // Load intl-tel-input from CDN, then initialise the phone field.
    (function loadITI(){
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.2/build/js/intlTelInput.min.js";
      s.onload = function(){
        if (!window.intlTelInput || !phoneInput) return;
        iti = window.intlTelInput(phoneInput, {
          initialCountry: "us",             // default US
          strictMode: true,                 // digits only + per-country max length
          nationalMode: true,               // national format, e.g. (123) 234-5678 for US
          formatOnDisplay: true,            // format the number as it's shown
          autoPlaceholder: "aggressive",    // show the country's example format as placeholder
          separateDialCode: true,           // flag + dial code box, then the national number
          countrySearch: false,             // plain inline dropdown under the field (no search overlay)
          useFullscreenPopup: false,        // never take over the whole screen — dropdown stays anchored
          loadUtils: function(){ return import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.11.2/build/js/utils.js"); }
        });
        // Live-format the national number as the user types (e.g. US -> (123) 456-7890).
        // utils.js loads async, so guard on it; re-run on each input.
        function formatAsYouType(){
          if (!iti) return;
          var u = (window.intlTelInput && window.intlTelInput.utils) || window.intlTelInputUtils;
          if (!u || typeof u.formatNumberAsYouType !== "function") return;
          var raw = phoneInput.value;
          var dial = "+" + (iti.getSelectedCountryData().dialCode || "1");
          var formatted = u.formatNumberAsYouType(raw, iti.getSelectedCountryData().iso2 ? iti.getSelectedCountryData().iso2.toUpperCase() : "US");
          if (formatted && formatted !== raw) {
            var atEnd = phoneInput.selectionStart === raw.length;
            phoneInput.value = formatted;
            if (atEnd) { phoneInput.selectionStart = phoneInput.selectionEnd = formatted.length; }
          }
        }
        phoneInput.addEventListener("input", formatAsYouType);
        phoneInput.addEventListener("blur", validatePhone);
        phoneInput.addEventListener("countrychange", function(){ clearErr(phoneInput, phoneErr); formatAsYouType(); });
      };
      document.head.appendChild(s);
    })();
```

### C.3 Options — exact values

| Option | Value | Effect |
|---|---|---|
| `initialCountry` | `"us"` | default flag/dial code |
| `strictMode` | `true` | digits-only typing + per-country max length (10 for US) |
| `nationalMode` | `true` | user types the national number, e.g. `(123) 234-5678` |
| `formatOnDisplay` | `true` | library formats on display |
| `autoPlaceholder` | `"aggressive"` | **overwrites** the markup placeholder `Phone number` with the country's example format |
| `separateDialCode` | `true` | flag + dial-code box rendered left of the input |
| `countrySearch` | `false` | plain inline dropdown, no search overlay |
| `useFullscreenPopup` | `false` | dropdown stays anchored even on mobile |
| `loadUtils` | dynamic `import()` of `utils.js` | validation + as-you-type formatting arrive async |

No `preferredCountries`, `onlyCountries`, `excludeCountries`, or `dropdownContainer` are set.

### C.4 As-you-type formatting

`formatAsYouType()` runs on every `input` event and on `countrychange`:
- Resolves the utils object defensively: `window.intlTelInput.utils` **or** legacy `window.intlTelInputUtils`; **no-ops silently if utils has not loaded yet.**
- Calls `u.formatNumberAsYouType(raw, ISO2_UPPERCASE)`, defaulting to `"US"` when `iso2` is missing.
- Only writes back if `formatted !== raw`.
- Caret preservation is **naive**: it captures `atEnd = phoneInput.selectionStart === raw.length` **before** the write and, if the caret was at the end, restores it to `formatted.length`. Mid-string edits will jump the caret to wherever the browser puts it. Port as-is or improve, but note the behaviour.
- The local `var dial` is computed and **never used** — dead code. Do not port it.

### C.5 E.164 normalization on submit

```js
      var data = new FormData(form);
      var phoneVal = (phoneInput.value || "").trim();
      data.set("phone", phoneVal ? (iti && iti.getNumber ? iti.getNumber() : phoneVal) : "");
```
(`index.html:2244-2246`)

- The `<input type="tel">` has **no `name` attribute**, so nothing phone-related is in the `FormData` until this line.
- `iti.getNumber()` returns full **E.164** (e.g. `+16507206995`). It is used whenever the library initialised; otherwise the raw trimmed national string is sent (graceful degradation when the CDN script fails).
- Blank input → `phone` is set to `""` (the key is always present in the payload).

### C.6 Validation

- Optional field: empty is valid, clears any error, returns `true`.
- If `iti.isValidNumber` exists → per-country validity. Error: `Enter a valid phone number for the selected country.`
- Else (utils/library not loaded) → digit count `v.replace(/\D/g,"").length < 7` fails with `Enter a valid phone number.`
- Bound to `blur`; also run on submit; `countrychange` clears the error and reformats.

### C.7 intl-tel-input theming CSS (`index.html:631-662`)

```css
  /* intl-tel-input theming to match the BOV form fields (light boxed inputs) */
  .iti { width: 100%; display: block; }
  /* the tel input keeps the same boxed look as the other form fields.
     NOTE: only set vertical padding + a small right pad — the library manages
     the LEFT padding to clear the separate dial-code box, so don't override it
     (overriding it pushes the dial code over the first digits / cuts them off). */
  .bov-form .iti > input[type=tel] {
    width: 100%; padding-top: 12px; padding-bottom: 12px; padding-right: 12px; background: var(--surface);
    border: 1px solid var(--rule); font-family: var(--sans); font-size: 16px; color: var(--ink);
    border-radius: 0; outline: none;
  }
  .bov-form .iti > input[type=tel]:focus { border-color: var(--gold); }
  /* RESET the country-selector button so the form's gold submit-button rule can't bleed in */
  .iti__selected-country {
    background: var(--surface) !important; color: var(--ink) !important;
    border: 1px solid var(--rule) !important; border-right: none !important;
    padding: 0 10px !important; margin: 0 !important; height: auto !important;
    grid-column: auto !important; justify-self: auto !important; letter-spacing: 0 !important;
    text-transform: none !important; font-size: 14px !important; font-weight: 400 !important;
  }
  .iti__selected-country:hover, .iti__selected-country:focus { background: var(--ground) !important; }
  .iti__selected-dial-code { font-family: var(--sans); font-size: 14px; color: var(--ink); }
  /* dropdown panel */
  .iti__dropdown-content {
    font-family: var(--sans); font-size: 14px; z-index: 60;
    background: var(--ground); border: 1px solid var(--rule); box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  }
  .iti__country-list { color: var(--ink); }
  .iti__country.iti__highlight { background: var(--surface); }
  /* Leave room on the left for the library's magnifying-glass icon so the
     "Search" placeholder isn't hidden underneath it. */
  .iti__search-input { font-family: var(--sans); font-size: 14px; padding: 10px 12px 10px 34px; border-bottom: 1px solid var(--rule); box-sizing: border-box; width: 100%; }
```

**Two traps documented in the source comments — carry them into the port:**
1. Never override `padding-left` on `.iti > input[type=tel]`; the library owns it to clear the dial-code box.
2. The submit-button rule is scoped `.bov-form > button[type=submit], .bov-form #bovSubmit` **specifically** so it cannot style intl-tel-input's country-selector `<button>` (`index.html:608-610`). Preserve that scoping (or use CSS Modules / a scoped class) or the country picker turns into a gold uppercase block.

Mobile: `@media (max-width: 640px) { .iti__dropdown-content { max-width: 88vw; } }` (`index.html:797-798`).

---

## D) THE TICKER

### D.1 `api/ticker-data.js` — FULL VERBATIM (all 72 lines)

```js
/**
 * /api/ticker-data — live U.S. rate feed for the site ticker (Vercel serverless).
 *
 * Proxies the free FRED API so the API key stays server-side (this repo is public).
 * Returns one JSON payload the front-end ticker consumes:
 *   { updated: ISOString|null, items: [{ label, value, date }], error?: string }
 *
 * Series:
 *   DGS10     -> 10-Yr Treasury
 *   SOFR      -> SOFR
 *   DPRIME    -> Prime Rate (Bank Prime Loan Rate)
 *   DFEDTARU  -> Fed Funds Upper (target range upper limit)
 *   DFEDTARL  -> Fed Funds Lower (target range lower limit)
 *
 * Env: FRED_API_KEY — set in the Vercel project (Settings → Environment Variables).
 *      Free key: https://fredaccount.stlouisfed.org/apikeys
 * Node 18+ has global fetch; no dependencies.
 */

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

const SERIES = [
  { id: "DGS10",    label: "10-Yr Treasury" },
  { id: "SOFR",     label: "SOFR" },
  { id: "DPRIME",   label: "Prime Rate" },
  { id: "DFEDTARU", label: "Fed Funds Upper" },
  { id: "DFEDTARL", label: "Fed Funds Lower" },
];

// Latest *numeric* observation for one series. FRED returns "." on non-trading
// days, so we pull the most recent batch and take the first real value.
async function latest(seriesId, apiKey) {
  const url =
    `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey}` +
    `&file_type=json&sort_order=desc&limit=12`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED ${seriesId} -> ${res.status}`);
  const { observations = [] } = await res.json();
  const obs = observations.find((o) => o.value !== "." && o.value !== "");
  if (!obs) return { value: null, date: null };
  return { value: parseFloat(obs.value), date: obs.date };
}

export default async function handler(req, res) {
  const apiKey = process.env.FRED_API_KEY;
  // Always answer 200 so the client degrades gracefully (shows placeholder dashes).
  if (!apiKey) {
    res.status(200).json({ updated: null, items: [], error: "missing_key" });
    return;
  }

  try {
    const results = await Promise.all(SERIES.map((s) => latest(s.id, apiKey)));
    const items = SERIES.map((s, i) => {
      const r = results[i];
      return {
        label: s.label,
        value: r.value != null ? `${r.value.toFixed(2)}%` : "—",
        date: r.date,
      };
    });

    // Cache at the edge for 1h; serve stale up to 24h while revalidating.
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status(200).json({ updated: new Date().toISOString(), items });
  } catch (err) {
    res.status(200).json({ updated: null, items: [], error: "fetch_failed" });
  }
}
```

**Server contract to preserve verbatim in the Hokuten Route Handler:**

- **Env var name:** `FRED_API_KEY`, server-side only. Already provisioned on Vercel per PROJECT-MEMORY. **The key value never appears in this repo or this document.**
- **Series set + order (this order IS the render order):**
  1. `DGS10` → `10-Yr Treasury`
  2. `SOFR` → `SOFR`
  3. `DPRIME` → `Prime Rate`
  4. `DFEDTARU` → `Fed Funds Upper`
  5. `DFEDTARL` → `Fed Funds Lower`
- **Per-series query:** `?series_id=<ID>&api_key=<KEY>&file_type=json&sort_order=desc&limit=12` — descending, 12 observations, then the first entry whose `value` is neither `"."` nor `""`. This is how FRED's non-trading-day `"."` placeholders are skipped.
- **Value formatting is server-side:** `` `${r.value.toFixed(2)}%` `` — two decimals plus a literal `%` (e.g. `4.32%`). Null → the **em dash** `—` (U+2014).
- **Never non-200.** Three shapes, all HTTP 200:
  - OK: `{ updated: "<ISO>", items: [{label, value, date}, …] }`
  - No env var: `{ updated: null, items: [], error: "missing_key" }`
  - Any throw: `{ updated: null, items: [], error: "fetch_failed" }`
- **Caching header (success path only):** `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`.
- All five series are fetched in parallel via `Promise.all` — **one failing series rejects the whole batch** into the `fetch_failed` path. Faithful port keeps that; a resilience improvement (`Promise.allSettled`) would change behaviour, so log it as a decision if adopted.
- `date` is returned per item but the client never renders it.
- Next.js App Router port: this is a Pages-style `export default handler(req,res)`. In `app/api/ticker-data/route.ts` return `NextResponse.json(...)` with the same header and payload shapes.

### D.2 Ticker markup — verbatim (`index.html:1253-1263`)

```html
<!-- LIVE MARKET TICKER (sticky bottom bar; data from /api/ticker-data, FRED) -->
<div class="ticker-bar" id="tickerBar" aria-label="Live market data">
  <div class="ticker-track" id="tickerTrack">
    <span class="ticker-item"><span class="lead">LIVE DATA</span></span>
    <span class="ticker-item"><span class="lbl">10-Yr Treasury</span><span class="val">—</span></span>
    <span class="ticker-item"><span class="lbl">SOFR</span><span class="val">—</span></span>
    <span class="ticker-item"><span class="lbl">Prime Rate</span><span class="val">—</span></span>
    <span class="ticker-item"><span class="lbl">Fed Funds Upper</span><span class="val">—</span></span>
    <span class="ticker-item"><span class="lbl">Fed Funds Lower</span><span class="val">—</span></span>
  </div>
</div>
```

The bar lives **after** `</footer>` and before the `<script>`. It is the last body element besides the script. The static markup **is** the failure state — five labels with em-dash placeholders, in the same order as `SERIES`. Lead chip text is exactly `LIVE DATA` (uppercase in the source, not via CSS).

### D.3 Client fetch + render — verbatim (`index.html:2269-2286`)

```js
  /* ============ LIVE TICKER — /api/ticker-data (FRED via serverless) ============ */
  (function(){
    var track = document.getElementById("tickerTrack");
    if (!track) return;
    var ENDPOINT = "/api/ticker-data";   // Vercel function; cleanUrls strips .js
    function render(items){
      if (!items || !items.length) return;            // keep placeholder dashes
      var html = '<span class="ticker-item"><span class="lead">LIVE DATA</span></span>';
      items.forEach(function(it){
        html += '<span class="ticker-item"><span class="lbl">' + it.label + '</span><span class="val">' + it.value + '</span></span>';
      });
      track.innerHTML = html + html;                  // duplicate for seamless -50% loop
    }
    fetch(ENDPOINT, { headers: { "Accept": "application/json" } })
      .then(function(r){ return r.json(); })
      .then(function(j){ render(j && j.items); })
      .catch(function(){ /* leave placeholder dashes */ });
  })();
```

**Exact failure semantics:**

| Condition | What renders |
|---|---|
| `error: "missing_key"` (env var absent) | `items` is `[]` → `render()` returns early → **the static markup stays: five labels, five `—`, single (non-duplicated) track.** |
| `error: "fetch_failed"` (FRED threw / non-ok) | Same as above — static dashes. |
| Network error / non-JSON body | `.catch` swallows it — static dashes. |
| Success | Track's `innerHTML` is replaced with the lead chip + 5 live items, then that whole string **concatenated to itself** so the `translateX(-50%)` marquee loops seamlessly. |

Consequences to reproduce:
- In the failure state the track is **not** duplicated, so the `-50%` marquee scrolls the single copy off-screen and leaves a gap. That is the source's actual behaviour; if the Hokuten build renders the placeholders duplicated too, it is a (desirable) fix — log it.
- `it.label` and `it.value` are interpolated **raw** into `innerHTML`. Values come from our own server; in React render them as text.
- `ENDPOINT = "/api/ticker-data"` works because `vercel.json` sets `cleanUrls: true` (see §D.6). In Next.js App Router the route is `app/api/ticker-data/route.ts` and the path is already extensionless.
- The fetch is fired once at script-parse time (script is at the end of `<body>`, no `DOMContentLoaded` wrapper). No polling, no refresh interval.

### D.4 Ticker CSS — verbatim (`index.html:294-311`)

```css
  /* ==================== TICKER (live, sticky bottom bar) ==================== */
  .ticker-bar {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
    background: var(--dark); color: var(--ground);
    border-top: 1px solid #2a2c30; overflow: hidden;
    height: 40px; display: flex; align-items: center;
  }
  .ticker-track {
    display: flex; white-space: nowrap;
    animation: tickerscroll 45s linear infinite; padding: 0;
  }
  .ticker-bar:hover .ticker-track { animation-play-state: paused; }
  .ticker-item { font-family: var(--mono); font-size: 11px; margin-right: 56px; letter-spacing: 0.04em; }
  .ticker-item .lbl { color: var(--meta); margin-right: 8px; text-transform: uppercase; letter-spacing: 0.18em; font-size: 9.5px; }
  .ticker-item .val { color: var(--gold); }
  .ticker-item .lead { color: var(--gold-dim); font-weight: 500; letter-spacing: 0.2em; }
  @keyframes tickerscroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce){ .ticker-track { animation: none; } }
```

Supporting global rules the ticker depends on:

```css
  /* Prevent the fixed live-ticker marquee (and any wide child) from creating a
     horizontal scrollbar / min page width on mobile. */
  html, body { overflow-x: hidden; max-width: 100%; }
```
(`index.html:60-62`)

```css
    padding-bottom: 40px;   /* clearance for the fixed live-ticker bar */
```
(`index.html:73`, inside the `body` rule — matches the bar's `height: 40px`)

**Marquee mechanics:** `.ticker-track` is `display:flex; white-space:nowrap;` animated `translateX(0) → translateX(-50%)` over **45s, linear, infinite**. The `-50%` is only seamless because `render()` duplicates the content (`html + html`). Change one and you must change the other.

**Pause:** `.ticker-bar:hover .ticker-track { animation-play-state: paused; }` — hover only, on the whole bar. No click-to-pause, no focus-based pause. (A11y improvement worth logging: add `:focus-within` and a real pause control.)

**Reduced motion:** `@media (prefers-reduced-motion: reduce){ .ticker-track { animation: none; } }` — the track sits at `translateX(0)`, showing the first copy statically. There is **no** JS reduced-motion handling for the ticker.

### D.5 Ticker labels — canonical order and strings

Both the server (`api/ticker-data.js:22-28`) and the static fallback markup (`index.html:1256-1261`) use the same order and byte-identical strings:

```
LIVE DATA          (lead chip, not a data item)
10-Yr Treasury
SOFR
Prime Rate
Fed Funds Upper
Fed Funds Lower
```

Note `10-Yr Treasury` — hyphen, capital `Y`, lowercase `r`. Not "10-Year", not "10Y".

### D.6 `vercel.json` — verbatim (4 lines)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false
}
```

### D.7 Stale-doc flag

`README.md:48` says:

```
push. Vercel auto-redeploys. **Ticker values** are hardcoded by design — update quarterly.
```

This is **out of date** in the source repo — the ticker has been live/FRED-driven since `api/ticker-data.js` landed. Do not carry the README claim forward.

---

## E) MICRO-INTERACTIONS (`index.html:1265-2290` + supporting CSS)

Script structure: one non-module `<script>` at `index.html:1265-2287`, sitting **after** all markup. Blocks in source order:

| Lines | Block |
|---|---|
| 1266-1270 | CONFIG (`SITE_DOMAIN`) |
| 1272-1299 | Copy-email |
| 1301-1330 | Hero video autoplay |
| 1332-1335 | `CALENDLY_URL` constant |
| 1337-1348 | Mobile nav |
| 1350-1687 | Valuation calculator *(covered in another port doc)* |
| 1689-1733 | Calculator info tooltips |
| 1735-1745 | Touch reveal (B&W → color) |
| 1747-1906 | Active listings feed *(other port doc)* |
| 1908-1947 | Calendly |
| 1949-2025 | Calculator email capture *(see §A.9)* |
| 2027-2132 | City picker *(see §B)* |
| 2134-2267 | BOV form *(see §A, §C)* |
| 2269-2286 | Live ticker *(see §D)* |

**There is NO `IntersectionObserver` anywhere in `index.html`** (verified: 0 matches). The README's mention of "scroll reveal" is stale — there is no scroll-reveal implementation in the shipped file. Do not port one under the guise of a faithful port; if Hokuten wants reveal animation, that is new design work through the design skill.

### E.1 Copy-email "Copied" flash (`index.html:1272-1299`)

```js
  /* ============ COPY-EMAIL ============ */
  /* Email links copy the address to the clipboard (instead of opening a mail
     client). A small "Copied" note appears next to the one that was clicked. */
  document.querySelectorAll('.copy-email').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var email = el.getAttribute('data-email');
      var note = el.parentNode.querySelector('.copy-email-note');
      function flash(msg) {
        if (!note) return;
        note.textContent = msg;
        note.classList.add('show');
        setTimeout(function () { note.classList.remove('show'); }, 1800);
      }
      function legacyCopy() {
        var ta = document.createElement('textarea');
        ta.value = email; ta.setAttribute('readonly', '');
        ta.style.position = 'absolute'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); flash('✓ Copied'); }
        catch (err) { flash(email); }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { flash('✓ Copied'); }, legacyCopy);
      } else { legacyCopy(); }
    });
  });
```

Markup — **two instances**, identical pattern:

```html
        <div class="team-contact"><a href="#" class="copy-email" data-email="dino.monteverde@kw.com">dino.monteverde@kw.com</a><span class="copy-email-note" aria-live="polite"></span><br><a href="tel:+16507206995">650.720.6995</a></div>
```
(`index.html:1138` — team card)

```html
        <span class="fc-line"><a href="#" class="copy-email" data-email="dino.monteverde@kw.com">dino.monteverde@kw.com</a><span class="copy-email-note" aria-live="polite"></span></span>
```
(`index.html:1236` — footer contact)

CSS (`index.html:714-716`):

```css
  .footer-contact .copy-email { cursor: pointer; border-bottom: 1px dotted var(--rule); }
  .copy-email-note { margin-left: 8px; font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #1a8a4a; opacity: 0; transition: opacity 200ms; white-space: nowrap; }
  .copy-email-note.show { opacity: 1; }
```

**Reimplementation contract:**
- The anchor is `href="#"` and the handler `preventDefault()`s — clicking never opens a mail client and never jumps the page.
- The address lives in `data-email` **and** as the link text (both must stay in sync).
- The note element is found via `el.parentNode.querySelector('.copy-email-note')` — i.e. **scoped to the clicked link's parent**, so only the clicked instance flashes. In React: per-instance state, not global.
- Flash string is exactly `✓ Copied` (U+2713 CHECK MARK, space, `Copied`). On a legacy-copy exception the fallback flashes the **email address itself** so the user can select it manually.
- Flash duration: **1800 ms**, then `.show` is removed; opacity transitions 200 ms.
- The note is `aria-live="polite"` and always present in the DOM (opacity-only reveal) — screen readers announce the change.
- Legacy path: off-screen `<textarea>` at `left: -9999px`, `readonly`, `select()`, `document.execCommand('copy')`, then removed.
- Note colour `#1a8a4a` is a one-off green, not a token. Decide whether Hokuten tokenizes it.

**VOICE →** the email address itself changes to the Hokuten team inbox; the interaction is unchanged.

### E.2 Touch-reveal / tapped B&W → color photo (`index.html:1735-1745`)

```js
  /* ============ TOUCH REVEAL for B&W cards (no-hover devices) ============ */
  (function(){
    if (window.matchMedia && window.matchMedia("(hover: none)").matches){
      document.querySelectorAll(".closing-card, .listing-card").forEach(function(card){
        card.addEventListener("click", function(e){
          if (e.target.closest("a")) return;       // let the Request OM / link work
          card.classList.toggle("tapped");
        });
      });
    }
  })();
```

Supporting CSS — the desaturation baseline (`index.html:344-357`):

```css
  .card-photo {
    position: relative;
    aspect-ratio: 4 / 3;
    background: var(--surface-deep);
    overflow: hidden;
    margin-bottom: 14px;
    border: 1px solid var(--rule);
  }
  .card-photo img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    filter: grayscale(100%) contrast(1.04);
    transition: filter 0.4s ease;
  }
  .closing-card:hover .card-photo img { filter: grayscale(0%) contrast(1); }
```

Listing-card hover overlay (`index.html:561-568`):

```css
  .listing-card { cursor: pointer; }
  .listing-card .card-photo { aspect-ratio: 5 / 4; position: relative; }
  .listing-card .card-photo-overlay {
    position: absolute; inset: 0; background: rgba(26, 28, 31, 0.55);
    display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 240ms;
  }
  .listing-card:hover .card-photo-overlay { opacity: 1; }
  .listing-card:hover .card-photo img { filter: grayscale(0%) contrast(1); }
```

Touch-reveal CSS (`index.html:573-576`):

```css
  /* touch reveal (mobile / no-hover) */
  .closing-card.tapped .card-photo img,
  .listing-card.tapped .card-photo img { filter: grayscale(0%) contrast(1); }
  .listing-card.tapped .card-photo-overlay { opacity: 1; }
```

**Reimplementation contract:**
- Photos are **desaturated by default**: `filter: grayscale(100%) contrast(1.04)`, transitioning `filter 0.4s ease`.
- Reveal (`grayscale(0%) contrast(1)`) fires on `:hover` **on pointer devices**, and via a `.tapped` class **only** on `(hover: none)` devices.
- The listener is attached **once at init**, gated on `window.matchMedia("(hover: none)").matches`. It is *not* re-evaluated on media-query change. In React, prefer a `matchMedia` listener with a change subscription (behaviour-preserving superset) or replicate the one-shot check.
- Click on a descendant `<a>` (e.g. the "Request OM" CTA) bails out via `e.target.closest("a")` — the link wins, the card does not toggle.
- The class is **toggled**, so a second tap re-desaturates.
- Aspect ratios differ: closing cards `4 / 3`, listing cards `5 / 4`.
- Listing cards additionally reveal a `rgba(26, 28, 31, 0.55)` overlay (240 ms) containing a gold `.btn-primary`.
- `.closing-card:hover { transform: translateY(-2px); }` with `transition: transform 240ms ease` (`index.html:342-343`) and `.closing-card:hover .card-title-arrow { transform: translateX(4px); }` with `transition: transform 200ms` (`index.html:378-379`).

### E.3 iOS 16px anti-zoom handling (`index.html:757-764`)

```css
  @media (max-width: 640px) {
    /* iOS Safari/Chrome auto-zoom the page when a focused input's font-size is
       < 16px. Force all form controls to 16px on phones so tapping a field
       never zooms the page. Desktop sizing (14–15px) is unchanged. */
    .field input, .field select, .field textarea,
    .bov-form input, .bov-form select, .bov-form textarea,
    .bov-form .iti > input[type=tel], .calc-emailcap input,
    #citySearch, .iti__search-input, select { font-size: 16px !important; }
```

Pure CSS, no JS. The viewport meta is the standard non-locking one (`index.html:17`):

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Note:** `maximum-scale`/`user-scalable=no` are deliberately **not** used (that would break pinch-zoom a11y). The 16px floor is the correct fix. Carry the exact selector list — it explicitly covers the intl-tel-input search box (`.iti__search-input`) and the city search (`#citySearch`), which are outside `.field`/`.bov-form`. Also note `.bov-form .iti > input[type=tel]` is already `font-size: 16px` at desktop (`index.html:639`) — the tel field never zooms at any width.

### E.4 Scroll-margin-top anchor offsets (`index.html:63-66`)

```css
  html { scroll-behavior: smooth; }
  /* Offset anchor jumps so section headings land BELOW the sticky nav (~70px),
     not hidden under it. Applies to every in-page nav target. */
  #listings, #closings, #calculator, #methodology, #team, #bov, #contact { scroll-margin-top: 88px; }
```

Seven anchor targets, all `scroll-margin-top: 88px`, paired with `scroll-behavior: smooth` on `html`. `#contact` is on the `.bov-disclaimer` paragraph (`index.html:1211`), not on a section — it is a sibling anchor inside the same BOV section.

**Note:** there is **no** `@media (prefers-reduced-motion) { html { scroll-behavior: auto; } }` in the source. Smooth scrolling fires regardless of the user's motion preference. That is an a11y gap — fix it in the Hokuten build and log it.

### E.5 Sticky nav (`index.html:77-84`, `816-840`, `1337-1348`)

CSS:

```css
  nav.topnav {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--rule);
    z-index: 100;
  }
```

There is **no scroll listener and no shrink/hide-on-scroll behaviour**. The nav is a plain CSS `position: sticky` bar with a translucent white background and a 10px backdrop blur, `z-index: 100` (above the ticker's `z-index: 90`, above the city list's `70`, above the intl-tel dropdown's `60`).

Markup (`index.html:816-840`):

```html
<!-- NAV -->
<nav class="topnav">
  <div class="nav-inner">
    <a href="#" class="brand-lockup" style="text-decoration: none; color: inherit;">
      <img class="kw-mark" src="kw-commercial.png" alt="Keller Williams Commercial">
      <span class="brand-divider" aria-hidden="true"></span>
      <div class="brand-text">
        <div class="wordmark">Dino <span class="amp">Monteverde</span></div>
        <div class="wordmark-descriptor">Keller Williams Commercial</div>
      </div>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li><a href="#listings">Hotels for Sale</a></li>
      <li><a href="#calculator">Hotel Worth Calculator</a></li>
      <li><a href="#methodology">Methodology</a></li>
      <li><a href="#team">Team</a></li>
      <li><a href="#bov">Contact</a></li>
      <li><a href="marketplace.html">Marketplace</a></li>
      <li><a href="#bov" class="nav-cta">Request a Written BOV</a></li>
    </ul>
  </div>
</nav>
```

> **BRAND →** the nav lockup is `KW Commercial mark + divider + Dino wordmark`. Hokuten is **Hokuten-first**: KW Commercial appears only as a footer compliance mark. This lockup **does not port as-is** — it is quoted only to document the interaction.

Mobile nav JS (`index.html:1337-1348`):

```js
  /* ============ MOBILE NAV ============ */
  (function(){
    var t = document.getElementById("navToggle"), l = document.getElementById("navLinks");
    t.addEventListener("click", function(){
      var open = l.classList.toggle("open");
      t.classList.toggle("open", open);
      t.setAttribute("aria-expanded", open ? "true" : "false");
    });
    l.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ l.classList.remove("open"); t.classList.remove("open"); t.setAttribute("aria-expanded","false"); });
    });
  })();
```

Hamburger → X animation (`index.html:151-166`):

```css
  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
  }
  .nav-toggle span {
    width: 24px; height: 1.5px; background: var(--ink);
    transition: transform 250ms, opacity 250ms;
  }
  .nav-toggle.open span:nth-child(1){ transform: translateY(6.5px) rotate(45deg); }
  .nav-toggle.open span:nth-child(2){ opacity: 0; }
  .nav-toggle.open span:nth-child(3){ transform: translateY(-6.5px) rotate(-45deg); }
```

Breakpoint + drawer (`index.html:727-740`) — note the **1299px** collapse point, with the reason documented:

```css
  /* Collapse the nav to the hamburger earlier (<=1299px): the full link row
     (with Marketplace and the longer BOV CTA) needs ~1300px to sit comfortably
     on one line without squeezing the brand lockup. */
  @media (max-width: 1299px) {
    .nav-toggle { display: flex; }
    .nav-links {
      display: none; position: absolute; top: 100%; left: 0; right: 0;
      flex-direction: column; align-items: flex-start; gap: 20px;
      background: var(--ground); border-bottom: 1px solid var(--rule);
      padding: 24px 48px 28px; margin: 0;
    }
    .nav-links.open { display: flex; }
    .nav-cta { padding: 10px 16px; }
  }
```

**Reimplementation contract:** toggle sets `.open` on both the `<ul>` and the `<button>`, plus `aria-expanded`. Clicking **any** link inside closes the drawer. There is no Escape-to-close, no focus trap, no click-outside-to-close, and no body scroll lock. The drawer is `position: absolute; top: 100%` relative to `.nav-inner` (which is `position: relative`).

### E.6 Reduced-motion handling — the complete inventory

Only three places in the entire source:

1. Hero video hidden (`index.html:195-198`):

```css
  /* Respect reduced-motion: hide the video, fall back to the poster image. */
  @media (prefers-reduced-motion: reduce) {
    section.hero > .hero-video { display: none; }
  }
```

2. Ticker animation off (`index.html:311`):

```css
  @media (prefers-reduced-motion: reduce){ .ticker-track { animation: none; } }
```

3. Hero video JS bail-out (`index.html:1308-1310`):

```js
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hv.removeAttribute('autoplay'); hv.pause(); return;
    }
```

**Not covered by reduced motion in the source (gaps to close in the Hokuten build, each worth a logged decision):** `html { scroll-behavior: smooth }`, card `transform`/`filter` transitions, the calculator step transitions, the hamburger transform, the listing overlay fade.

### E.7 Hero video autoplay (mobile-safe) — full block (`index.html:1301-1330`)

```js
  /* ============ HERO VIDEO AUTOPLAY (mobile-safe) ============ */
  /* iOS Safari can leave a muted autoplay video paused on its poster. Force
     muted (as a property, which iOS requires) and call play(); if the browser
     still blocks it, retry on the first user interaction. */
  (function () {
    var hv = document.querySelector('.hero-video');
    if (!hv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hv.removeAttribute('autoplay'); hv.pause(); return;
    }
    hv.muted = true;            // property form — required for iOS inline autoplay
    hv.setAttribute('muted', ''); hv.playsInline = true;
    function tryPlay() {
      var p = hv.play();
      if (p && typeof p.catch === 'function') { p.catch(function () {}); }
    }
    tryPlay();
    hv.addEventListener('canplay', tryPlay, { once: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tryPlay(); });
    // Last resort: kick playback on the first tap/scroll if it's still paused.
    function onFirstInteract() {
      if (hv.paused) tryPlay();
      window.removeEventListener('touchstart', onFirstInteract);
      window.removeEventListener('scroll', onFirstInteract);
      window.removeEventListener('click', onFirstInteract);
    }
    window.addEventListener('touchstart', onFirstInteract, { passive: true });
    window.addEventListener('scroll', onFirstInteract, { passive: true });
    window.addEventListener('click', onFirstInteract);
  })();
```

Video element (`index.html:844-849`):

```html
  <video class="hero-video" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="poster.jpg" disablepictureinpicture>
    <!-- MP4/H.264 first so iOS Safari (no WebM support) picks a playable source
         immediately and autoplays inline; WebM second for browsers that prefer it. -->
    <source src="hero.mp4" type="video/mp4">
    <source src="hero.webm" type="video/webm">
  </video>
```

Reimplementation notes: set `muted` as a **DOM property** (React's `muted` prop is unreliable — set it in a ref effect), keep MP4 **before** WebM, and keep the four retry hooks (immediate, `canplay` once, `visibilitychange`, first interaction). Interaction listeners are `{ passive: true }` for touch/scroll and remove themselves after firing once. Hokuten's hero is an ASCII hero, not a video — port this only if a video element survives the redesign.

### E.8 Calendly — invocation, URL, prefill params (`index.html:1332-1335`, `1908-1947`)

URL constant (`index.html:1332-1335`):

```js
  /* Dino's public Calendly scheduling URL for the free consultation. If this is
     ever blanked/invalid, every "Book a free consultation" button gracefully
     falls back to the BOV form (#bov) — nothing breaks. */
  var CALENDLY_URL = "https://calendly.com/dino-monteverde-kw";
```

Full block (`index.html:1908-1947`):

```js
  /* ============ CALENDLY → free consultation booking ============
     Pure client-side (no API key). Opens Dino's Calendly in a popup modal,
     prefilled with whatever the visitor just modeled in the calculator. If
     CALENDLY_URL isn't set yet, buttons gracefully fall back to the BOV form. */
  (function(){
    var isSet = CALENDLY_URL && CALENDLY_URL.indexOf("calendly.com") !== -1;

    function openCalendly(){
      if (!isSet || !window.Calendly){
        // Fallback: jump to the BOV form so the CTA always does something useful.
        window.location.hash = "#bov";
        return;
      }
      var est = window.__kwcEstimate || null;
      var opts = { url: CALENDLY_URL + (CALENDLY_URL.indexOf("?") === -1 ? "?" : "&") + "hide_gdpr_banner=1" };
      if (est){
        opts.prefill = { customAnswers: { a1: "Self-estimated " + est.range + " (" + est.summary + ")"
          + (est.revpar ? " · RevPAR " + est.revpar : "")
          + (est.noiPerKey ? " · NOI " + est.noiPerKey : "")
          + (est.capRangeUsed ? " · cap " + est.capRangeUsed : "")
          + (est.topAdvice ? " · " + est.topAdvice : "") } };
      }
      window.Calendly.initPopupWidget(opts);
      return false;
    }

    var bookBtn = document.getElementById("calcBook");
    if (bookBtn) bookBtn.addEventListener("click", openCalendly);

    // Booking a call is the secondary path — the primary CTA above it links
    // straight to the BOV form, which is also where openCalendly() falls back.

    // Detect a completed booking (client-side only) for a light confirmation.
    window.addEventListener("message", function(e){
      if (e.origin === "https://calendly.com" && e.data && e.data.event === "calendly.event_scheduled"){
        var s = document.getElementById("bovStatus");
        if (s){ s.className = "bov-status ok"; s.textContent = "Your consultation is booked — see your email for the calendar invite."; }
      }
    });
  })();
```

**Contract:**
- **Scheduling URL:** `https://calendly.com/dino-monteverde-kw` — **Dino-specific; replace with the Hokuten team URL. `blocked: awaiting Hokuten Calendly link.`**
- **Guard:** `isSet` is a substring test for `"calendly.com"`. If false, or if `window.Calendly` never loaded (widget.js is `async` and could fail), the handler sets `window.location.hash = "#bov"` and returns — the CTA always does something.
- **Query param appended:** `hide_gdpr_banner=1`, joined with `?` or `&` depending on whether the URL already has a query string.
- **Prefill:** only `customAnswers.a1` (Calendly's first custom question). Built from `window.__kwcEstimate` (set by the calculator, `index.html:1600-1611`):

```js
      window.__kwcEstimate = {
        range:   dollarsFull(totalLow) + " – " + dollarsFull(totalHigh),
        summary: type + " · " + Math.round(keys) + " keys" + (mkt ? " · " + mkt : ""),
        revpar:  "$" + Math.round(revpar),
        noiPerKey: "$" + groupInt(String(Math.round(noiPerKey))) + "/key",
        capRangeUsed: (capLow*100).toFixed(1) + "%–" + (capHigh*100).toFixed(1) + "%",
        marketTier: document.getElementById("cTier").value,
        condition: document.getElementById("cCond").value,
        brandFlag: document.getElementById("cBrandFlag").value,
        topAdvice: topAdviceText.slice(0, 140),
        insightCodes: firedCodes
      };
```

  Resulting `a1` string shape (each ` · ` segment conditional):
  `Self-estimated $1,200,000 – $1,450,000 (Limited-Service · 82 keys · 90210) · RevPAR $118 · NOI $14,600/key · cap 7.5%–9.0% · <first 140 chars of top advice, tags stripped>`
  Separator is ` · ` (space, U+00B7 MIDDLE DOT, space). `range` uses ` – ` (space, U+2013 EN DASH, space); `capRangeUsed` uses a bare `–` with no spaces. `topAdvice` is HTML-stripped via `top[0].html.replace(/<[^>]*>/g, "")` then `.slice(0, 140)`.
- **Trigger:** exactly **one** button, `#calcBook` (`index.html:1080`), label `Prefer a call? Book 15 minutes →`. The source comment notes the primary CTA above it is a plain `<a href="#bov">`, not a Calendly trigger.
- **Booking confirmation:** a `window` `message` listener, origin-checked against `"https://calendly.com"`, event `"calendly.event_scheduled"`. On match it writes into `#bovStatus` — the **BOV form's** status element, even though the booking happened up in the calculator panel. String, verbatim:

```
Your consultation is booked — see your email for the calendar invite.
```

  **Port note:** writing a Calendly confirmation into the BOV form's live region is odd (the user may be nowhere near it). Faithful port keeps it; a UX fix should be logged as a decision.
- `openCalendly` `return false` after `initPopupWidget` is vestigial — it is an `addEventListener` handler, so the return value is ignored.

### E.9 Calculator info tooltips / popovers (`index.html:1689-1733`)

```js
  /* ============ CALCULATOR INFO TOOLTIPS (educational popovers) ============
     Click an ⓘ next to a field label → a themed popover explains the term in
     plain language for owners who don't know ADR / TTM / occupancy / hotel
     categories. Click-out / Esc / scroll / resize closes it. Mobile-friendly
     (positions within the viewport, flips above if it would overflow). */
  (function(){
    var openPop = null, openBtn = null;

    function closePop(){
      if (openPop){ openPop.classList.remove("open"); openPop.remove(); }
      if (openBtn){ openBtn.setAttribute("aria-expanded", "false"); }
      openPop = null; openBtn = null;
    }
    function place(btn, pop){
      var r = btn.getBoundingClientRect();
      var sx = window.scrollX, sy = window.scrollY, margin = 12;
      pop.style.visibility = "hidden"; pop.classList.add("open");
      var pw = pop.offsetWidth, ph = pop.offsetHeight;
      var left = sx + r.left + r.width/2 - pw/2;
      left = Math.max(sx + margin, Math.min(left, sx + document.documentElement.clientWidth - pw - margin));
      var top = sy + r.bottom + 8;
      if (r.bottom + ph + 16 > window.innerHeight) top = sy + r.top - ph - 8;  // flip above
      pop.style.left = left + "px"; pop.style.top = top + "px"; pop.style.visibility = "visible";
    }
    document.addEventListener("click", function(e){
      var btn = e.target.closest(".calc-info");
      if (btn){
        e.preventDefault(); e.stopPropagation();
        if (openBtn === btn){ closePop(); return; }
        closePop();
        var pop = document.createElement("div");
        pop.className = "calc-popover";
        pop.innerHTML = btn.getAttribute("data-tip") || "";
        document.body.appendChild(pop);
        place(btn, pop);
        btn.setAttribute("aria-expanded", "true");
        openPop = pop; openBtn = btn;
        return;
      }
      if (openPop && !e.target.closest(".calc-popover")) closePop();
    });
    window.addEventListener("resize", closePop);
    window.addEventListener("scroll", closePop, true);
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") closePop(); });
  })();
```

**Contract:** single delegated `click` listener on `document`. One popover at a time (`openPop`/`openBtn` singletons). Clicking the same ⓘ again toggles closed. Content comes from the button's `data-tip` attribute, injected as **raw HTML** (authored content, but render as sanitized/JSX in React). Positioning is absolute in **page** coordinates (`scrollX/scrollY` added), centered under the button, clamped to a **12px** viewport margin, flipping above (`top - ph - 8`) when `r.bottom + ph + 16 > window.innerHeight`. Measured while `visibility: hidden` + `.open` so `offsetWidth/offsetHeight` are real. Closes on: click-out, Escape, `resize`, and **`scroll` captured on window (`true` — captures scrolls in any nested scroller)**. `aria-expanded` is toggled on the trigger. Mobile: `.calc-info { width: 18px; height: 18px; }` and `.calc-popover { max-width: 84vw; }` at ≤640px (`index.html:795-796`).

### E.10 Micro-interaction inventory — quick reference

| Interaction | Trigger | Duration / easing | Source |
|---|---|---|---|
| Copy-email flash | click `.copy-email` | 1800 ms visible; opacity 200 ms | 1272-1299, 714-716 |
| Card B&W → color (hover) | `:hover` | `filter 0.4s ease` | 352-357, 568 |
| Card B&W → color (touch) | click, `(hover: none)` only | same 0.4s | 1735-1745, 573-576 |
| Closing-card lift | `:hover` | `transform 240ms ease`, `translateY(-2px)` | 342-343 |
| Card arrow nudge | `:hover` | `transform 200ms`, `translateX(4px)` | 378-379 |
| Listing overlay fade | `:hover` / `.tapped` | `opacity 240ms` | 563-567, 576 |
| Ticker marquee | always | `45s linear infinite`, 0 → −50% | 301-310 |
| Ticker pause | `.ticker-bar:hover` | `animation-play-state: paused` | 305 |
| Nav CTA / submit hover | `:hover` | `background 200ms` → `--gold-dim` | 148-150, 614-616 |
| Hamburger → X | `.open` class | `transform 250ms, opacity 250ms` | 160-166 |
| Field focus | `:focus` | `border-color 200ms` (bottom border → gold) | 405-410 |
| Step dot fill | `.active` | `background 200ms` | 400-401 |
| Info popover | click ⓘ | instant, no transition on placement | 1689-1733 |
| Smooth anchor scroll | in-page link | `scroll-behavior: smooth`, `scroll-margin-top: 88px` | 63-66 |

### E.11 Z-index ladder (needed to keep overlays stacking correctly)

| Layer | z-index | Source |
|---|---|---|
| `nav.topnav` | 100 | 83 |
| `.ticker-bar` | 90 | 296 |
| `.city-list` | 70 | 667 |
| `.iti__dropdown-content` | 60 | 655 |
| hero overlay | 1 | 191 |
| hero content | 2 | 194 |

`.calc-popover` z-index is defined in the calculator CSS block (outside this doc's assigned range) — the builder of the calculator doc should confirm it sits above 100 or the sticky nav will cover a popover opened near the top of the viewport.

---

## F) FLAGS, GAPS, AND OPEN ITEMS

### F.1 Sarhan Hotel Group — occurrences flagged, NOT ported

Present in this file at `index.html:1145`, `1147`, `1234`, `1249`, and in `<meta property="og:site_name">` at line 24. Per the hard guardrail, **no Sarhan Hotel Group branding carries over.** None of it is quoted as port material here. The "The Platform" team card (1143-1148) and the footer affiliation line have no Hokuten equivalent and must be dropped or replaced by design decision, not by an implementer's guess.

### F.2 Secrets

| Secret | Source location | Handling |
|---|---|---|
| Web3Forms access key | `index.html:1169` (literal value) | `<REDACTED — env var NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY or server-side WEB3FORMS_ACCESS_KEY>` — decide which, log it |
| FRED API key | never literal in source; read from `process.env.FRED_API_KEY` (`api/ticker-data.js:45`) | already an env var; provisioned on Vercel. Never commit `.env*` |

No other keys appear. The a100 Arms listings feed and Calendly are explicitly key-free.

### F.3 Voice changes required (original quoted above in each section)

| Where | Original | Needs |
|---|---|---|
| `from_name` hidden field | `Dino Monteverde Website` | Hokuten site name |
| Calc-capture `from_name` | `KWC Valuation Tool` | Hokuten equivalent |
| Calc-capture success | `Done — Dino will send your estimate and comp set shortly.` | team-first "we" |
| BOV error strings ×2 | `…email dino.monteverde@kw.com directly.` | Hokuten team inbox |
| Calc-capture error strings ×3 | `…dino.monteverde@kw.com` | Hokuten team inbox |
| Copy-email `data-email` + link text | `dino.monteverde@kw.com` | Hokuten team inbox |
| `SITE_DOMAIN` | `kwc-dinomonteverde.com` | Hokuten domain |
| `CALENDLY_URL` | `https://calendly.com/dino-monteverde-kw` | Hokuten scheduling link — **blocked, not yet known** |
| Nav brand lockup | KW mark + Dino wordmark | Hokuten-first lockup; KW only as footer compliance mark |
| SMS consent brand string | `Dino Monteverde (KW Commercial)` | **blocked** — registered 10DLC/TCR brand; cannot change without re-registration |

Already team-first and safe to keep: the BOV intro paragraph, the BOV success message, the `.bov-disclaimer` copy ("We'd rather meet you earlier than that."), and the calc-capture label.

### F.4 Behaviour gaps worth fixing in the port (each needs a logged decision)

1. No `aria-activedescendant` / row `id`s on the city listbox.
2. No `prefers-reduced-motion` override for `scroll-behavior: smooth`.
3. Ticker pauses on hover only — no keyboard/focus pause, no explicit control.
4. Ticker failure state renders a non-duplicated track (marquee gap).
5. Calendly confirmation writes into `#bovStatus`, potentially far off-screen.
6. Card touch-reveal `matchMedia` check is evaluated once, never re-subscribed.
7. Phone caret restoration is end-of-string only.
8. `Promise.all` in `/api/ticker-data` makes one bad series kill all five.
9. Mobile nav drawer: no Escape close, no click-outside close, no focus trap, no scroll lock.
10. `.city-list` rows and ticker items are built via `innerHTML` string concatenation — render as text in React.

### F.5 Stale documentation in the source (do not carry forward)

- `README.md:48` — "**Ticker values** are hardcoded by design — update quarterly." False; the ticker is FRED-driven.
- `README.md:3-5` — mentions "scroll reveal"; there is no `IntersectionObserver` or scroll-reveal code in `index.html`.
- `README.md:13` — points at "~line 770" for the access key; it is actually at line 1169.
- `README.md:42-43` — refers to `CAP` / `MARGIN` objects; the shipped names are `CONFIG.capRates` / `CONFIG.noiMargin`.

### F.6 Explicitly out of scope for this document

The valuation calculator engine (`index.html:1350-1687`: `CONFIG`, `TYPICAL`, `ADVICE`, `calculate()`, step navigation, benchmark bars, number formatters) and the a100 Arms active-listings renderer (`index.html:1747-1906`) are large blocks that live in other port-pack documents. Only their touch points with this document — `window.__kwcEstimate`, the `#calcEmailcap` mini-form, the `#calcBook` button, the tooltip system, and the `.listing-card` touch-reveal — are covered here.
