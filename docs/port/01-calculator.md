# PORT PACK 01 — Hotel Valuation Calculator (verbatim extraction)

**Status:** `approved` (extraction complete — no open questions on the math; the source defects listed in §0.5 need a Razim decision before they are "fixed" rather than ported).

**Adversarial fidelity verification — 2026-08-08.** Independently re-checked against the source: every cited code block diffed line-by-line against `index.html` (44/56 exact; the other 12 are the marked `data-tip="…"` elisions); every source line of the calculator IIFE (`1350-1687`) and the tooltip IIFE (`1689-1733`) confirmed present in this document (100% coverage); all 11 popover `data-tip` strings byte-compared; all 75 visible strings and all 33 element ids in the markup region (`911-1087`) confirmed present; all 20 cap-rate cells re-derived; all four key-map regexes re-run against all 18 shipped option labels; and **all 25 golden cases re-computed with a source-faithful JS re-implementation — every published range, per-key, cap string, bar percentage, `firedCodes` list and CTA variant matched.** Ten documentation defects were found and corrected (see the version history at the end of this file); **none of them changed a single golden-case output.**

**Source of record (read-only):** `~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html` (2290 lines).
Every quote below is byte-exact from that file with the cited line range, with **one deliberate, always-marked exception**: in the §B markup quotes the long `data-tip` popover attributes are elided as `data-tip="…"` for readability, and the FULL attribute value is then quoted byte-exact in its own block immediately under the same field. All 11 popover strings are reproduced in full; nothing else is abridged. §B markup quotes also omit the enclosing `<div class="field-grid">` / `<div class="calc-panel">` layout wrappers where the citation says so — those carry no copy and no behaviour. Non-ASCII characters are load-bearing: the file uses **em dash U+2014 (—)**, **en dash U+2013 (–)**, **ellipsis U+2026 (…)**, **≈ U+2248**, **× U+00D7**, **÷ U+00F7**. All apostrophes in the source are plain ASCII `'` (U+0027) — do **not** smart-quote them on port.

**Downstream builders: implement from this document. Do not re-read the source.**

---

## §0 — Port preamble

### 0.1 Frozen-port guardrail

Per `CLAUDE.md`: *"Calculator math, defaults, and cap-rate `CONFIG` are a frozen port from the kwc site — changes require a dated PROJECT-MEMORY.md decision."* Everything in **§A** is frozen. **§B** copy is the place where Hokuten voice changes are allowed (see §0.3). **§C** is the implementation contract.

### 0.2 Redactions

The calculator's email-capture path reads the Web3Forms access key out of the BOV form's hidden input:

```js
    var ACCESS_KEY = (document.querySelector('#bovForm input[name=access_key]') || {}).value || "";
```
> `index.html:1959`

The literal key value at `index.html:1169` is **NOT** reproduced here: `<REDACTED — public Web3Forms access key; on the Hokuten port supply it server-side or via env var WEB3FORMS_ACCESS_KEY>`. The source comments call it "safe to expose"; that is a decision for the Hokuten build, not an assumption to inherit.

Calendly URL is not a secret and is quoted verbatim in §B.4.8, but it is **Dino's personal URL** and must be replaced for Hokuten.

### 0.3 Voice: Dino-singular → Hokuten team-first

The old site is written in a hybrid voice — the calculator strings are already mostly "we", but several are Dino-personal. Original is quoted verbatim first everywhere below; these are the specific places the Hokuten build must change (flagged inline as **[VOICE]** at each occurrence):

| Where | Original (verbatim) | Hokuten change needed |
|---|---|---|
| `index.html:1972`, `:2015`, `:2021` | `dino.monteverde@kw.com` | Hokuten inbox |
| `index.html:1983` | `"KWC Valuation Tool"` | Hokuten sender name |
| `index.html:2011` | `"Done — Dino will send your estimate and comp set shortly."` | `"we"` team-first |
| `index.html:1335` | `var CALENDLY_URL = "https://calendly.com/dino-monteverde-kw";` | Hokuten scheduling URL |
| `index.html:1982`, `:1268` | `SITE_DOMAIN = "kwc-dinomonteverde.com"` | Hokuten domain |
| `index.html:1600`, `:1921`, `:1975` | global `window.__kwcEstimate` | rename (e.g. `window.__hokutenEstimate`) |
| `index.html:1523` code comment | `// ---- Dino's generic teaser model (calcValuation) ----` | drop the personal attribution in comments |

Everything else in the calculator UI is already "we/your" and ports unchanged.

### 0.4 Sarhan Hotel Group — flagged, not ported

Per the guardrail "No Sarhan Hotel Group branding anywhere on the new site." **Zero occurrences inside the calculator section or its scripts.** For completeness, the **five** occurrences elsewhere in the source file are at `index.html:19` (meta description), `:24` (og:site_name), `:1145` (team card role), `:1234` (footer affiliation) and `:1249` (footer legal line) — verified with `grep -c "Sarhan" index.html` → `5`. **None carry over.** No action needed inside this port pack.

### 0.5 Defects found in the source (flag before porting — do NOT silently "fix")

| # | Severity | Defect | Detail |
|---|---|---|---|
| D1 | P1 | `keys = 0` + NOI override produces `$InfinityK` | `vHigh = Math.round((valueHigh / keys) / 1000) * 1000` divides by `keys` with no guard (`index.html:1553-1554`). `noiPerKey` **is** guarded (`index.html:1532`) but the per-key value is not. With `keys=0, NOI=1,000,000, cap 7.75–9.0%`: `resRange` renders `"$11.1M – $12.9M"` while `resPerKey` renders `"$InfinityK – $InfinityK"`. Reachable only if `validate(2)` is bypassed (deep-link to step 3, or the priming `calculate()` call if the seeded `88` default is removed). |
| D2 | P1 | `keys = 0` without NOI override produces `$NaNK` | `noi = 0` → `0/0 = NaN` → `resPerKey` renders `"$NaNK"`, `resRange` renders `"$0K – $0K"`. Same reachability as D1. |
| D3 | P2 | Hidden F&B value still affects the cap rate | `fbRow` is only `display:none`-toggled (`index.html:1669-1673`); the `#cFb` input keeps its value. Enter 40% F&B on Full-Service, switch to Limited-Service, and the +25 bps `fbHighAdj` still applies even though the field is invisible. |
| D4 | P2 | Benchmark bands are keyed by raw UI display string | `OCC_BAND` / `ADR_BAND` / `REVPAR_BAND` (`index.html:1400-1402`) are keyed by `"Full-Service"` etc. — the literal `<option>` text, not the `CONFIG` key. Renaming any option label silently yields `undefined` and throws at `ob[0]`. The port must key these off the same enum as `CONFIG`. |
| D5 | P3 | Dead code | The `4.5%` cap floor and the `high ≥ low + 0.5%` rule can **never** fire with the shipped `CONFIG` (proof in §C.6). `money()` (`:1465-1468`), `perKey()` (`:1469`) and this IIFE's local `esc()` (`:1404`) are defined but never called inside the calculator IIFE. |
| D6 | P3 | Double rounding on `Value / key` | `vLow`/`vHigh` are rounded to the nearest `$1,000` (`:1553-1554`) and then `roundKey()` rounds the *already-rounded* number to the nearest `$5,000` (`:1477`). E.g. `$255,971.70 → $256,000 → "$255K"`. Preserve exactly; do not collapse to a single rounding step. |

---

# §A — THE MATH ENGINE

All of §A lives inside one IIFE: `index.html:1355-1687`, opened by the comment at `:1350-1354`.

### A.0 Section comment (verbatim)

```js
  /* ============ VALUATION CALCULATOR ============
     Generic teaser valuation logic per Dino's spec. Self-contained, no external
     data. All bands are GENERALIZED industry assumptions for a top-of-funnel
     teaser — NOT transaction-derived. The disclaimer routes serious owners to a
     real BOV (CoStar + RCA comps). Tune everything in CONFIG below. */
  (function(){
```
> `index.html:1350-1355`

---

## A.1 `CONFIG` — the frozen config object (every key)

```js
    var CONFIG = {
      // Cap-rate bands [low, high] by property type → market tier. Low cap = higher value.
      capRates: {
        limitedService: { gateway:[0.0700,0.0825], secondary:[0.0775,0.0900], suburban:[0.0825,0.0975], tertiary:[0.0925,0.1100] },
        selectService:  { gateway:[0.0675,0.0800], secondary:[0.0750,0.0875], suburban:[0.0800,0.0950], tertiary:[0.0900,0.1050] },
        fullService:    { gateway:[0.0625,0.0750], secondary:[0.0725,0.0850], suburban:[0.0800,0.0925], tertiary:[0.0900,0.1050] },
        resortBoutique: { gateway:[0.0600,0.0750], secondary:[0.0700,0.0850], suburban:[0.0800,0.0950], tertiary:[0.0875,0.1050] },
        extendedStay:   { gateway:[0.0675,0.0800], secondary:[0.0750,0.0875], suburban:[0.0800,0.0925], tertiary:[0.0875,0.1025] }
      },
      // Stabilized NOI as % of total revenue, by property type (used unless actual NOI entered).
      noiMargin:    { limitedService:0.38, selectService:0.34, fullService:0.28, resortBoutique:0.30, extendedStay:0.40 },
      // Rooms revenue ÷ this = total revenue (full-service/resort earn more non-rooms revenue).
      roomsToTotal: { limitedService:0.95, selectService:0.88, fullService:0.65, resortBoutique:0.62, extendedStay:0.96 },
      // Optional refiners — additive bps to BOTH ends of the cap band (positive = lower value).
      renovationAdj:{ under4:-0.0050, base4to8:0.0000, over8:0.0075 },
      landAdj:      { feeSimple:0.0000, groundLease:0.0100 },
      brandAdj:     { branded:-0.0025, independent:0.0025 },
      fbThreshold:  0.25,
      fbHighAdj:    0.0025
    };
```
> `index.html:1356-1375`

**Cap-rate matrix, flattened for verification (all 20 cells):**

| type key | gateway | secondary | suburban | tertiary |
|---|---|---|---|---|
| `limitedService` | 7.00 – 8.25% | 7.75 – 9.00% | 8.25 – 9.75% | 9.25 – 11.00% |
| `selectService` | 6.75 – 8.00% | 7.50 – 8.75% | 8.00 – 9.50% | 9.00 – 10.50% |
| `fullService` | 6.25 – 7.50% | 7.25 – 8.50% | 8.00 – 9.25% | 9.00 – 10.50% |
| `resortBoutique` | 6.00 – 7.50% | 7.00 – 8.50% | 8.00 – 9.50% | 8.75 – 10.50% |
| `extendedStay` | 6.75 – 8.00% | 7.50 – 8.75% | 8.00 – 9.25% | 8.75 – 10.25% |

**Constants not in `CONFIG` but hard-coded in `calculate()` (`index.html:1547-1548, 1552-1554`):**

| Constant | Value | Line |
|---|---|---|
| Cap floor | `0.045` | `:1547` |
| Minimum cap spread | `0.005` | `:1548` |
| Total-value rounding increment | `50000` | `:1552` |
| Per-key rounding increment (stage 1) | `1000` | `:1553-1554` |
| Per-key display rounding (stage 2, in `roundKey`) | `5000` → printed in `K` as `*5` | `:1477` |
| `roundTotal` sub-$1M increment | `5000` → `*5` `K` | `:1475` |
| `roundTotal` ≥$1M precision | `1e5` then `/10`, `toFixed(1)` `M` | `:1474` |
| Days per year | `365` | `:1528` |

---

## A.2 `TYPICAL` — typical-figures autofill table

```js
    // Generic occupancy/ADR fallbacks by tier for the "use typical figures" link.
    var TYPICAL = {
      gateway:   { occupancy:0.74, adr:245 },
      secondary: { occupancy:0.70, adr:165 },
      suburban:  { occupancy:0.66, adr:125 },
      tertiary:  { occupancy:0.58, adr:95 }
    };
```
> `index.html:1376-1382`

Keyed by **tier**, never by property type. Rendered as `{ occ: Math.round(occupancy * 100), adr }` → gateway `74 / 245`, secondary `70 / 165`, suburban `66 / 125`, tertiary `58 / 95`.

---

## A.3 UI-string → CONFIG-key maps

```js
    // ---- Map the UI's display strings to CONFIG keys ----
    function typeKey(v){
      if (/limited/i.test(v)) return "limitedService";
      if (/select/i.test(v)) return "selectService";
      if (/resort|boutique/i.test(v)) return "resortBoutique";
      if (/extended/i.test(v)) return "extendedStay";
      return "fullService";
    }
    function tierKey(v){ return /gateway/i.test(v) ? "gateway" : /secondary|resort dest/i.test(v) ? "secondary" : /tertiary|rural|highway/i.test(v) ? "tertiary" : "suburban"; }
    function brandKeyCfg(v){ return /independent|unbranded/i.test(v) ? "independent" : "branded"; }   // soft-brand → branded band
    function condKeyCfg(v){ return /last 3|<\s*3|renovated/i.test(v) ? "under4" : (/9.?15/i.test(v) || /15\+|pip/i.test(v)) ? "over8" : "base4to8"; }
```
> `index.html:1384-1394`

**Resolved mapping for every shipped option label (traced against the regexes above):**

| Select | Option label (verbatim) | Resolved key |
|---|---|---|
| `#cType` | `Limited-Service` | `limitedService` |
| `#cType` | `Select-Service` | `selectService` |
| `#cType` | `Full-Service` | `fullService` (fall-through) |
| `#cType` | `Resort / Boutique` | `resortBoutique` |
| `#cType` | `Extended-Stay` | `extendedStay` |
| `#cTier` | `Gateway / urban core (NYC, SF, LA, Miami…)` | `gateway` |
| `#cTier` | `Strong secondary / resort destination` | `secondary` |
| `#cTier` | `Standard / suburban` | `suburban` (fall-through) |
| `#cTier` | `Tertiary / rural / highway` | `tertiary` |
| `#cBrandFlag` | `Branded (franchise)` | `branded` |
| `#cBrandFlag` | `Soft-brand / lifestyle` | `branded` ← **soft-brand maps to branded** |
| `#cBrandFlag` | `Independent / unbranded` | `independent` |
| `#cCond` | `Renovated / built in last 3 yrs` | `under4` |
| `#cCond` | `4–8 yrs (baseline)` | `base4to8` (fall-through) |
| `#cCond` | `9–15 yrs` | `over8` — `/9.?15/` matches `9–15` because `.` matches the en dash |
| `#cCond` | `15+ yrs / renovation (PIP) due` | `over8` — matches `/15\+/` and `/pip/i`. **Note:** it does *not* match `/renovated/i` because the string contains "renovation", not "renovated". |
| `#cGround` | `Fee Simple (own the land)` | `feeSimple` |
| `#cGround` | `Ground lease` | `groundLease` |

Ground is not resolved by a helper — it is an inline regex inside `calculate()`:
```js
      var ground = /ground lease/i.test(document.getElementById("cGround").value);
```
> `index.html:1512`

**Port note (D4 companion):** these regexes are *display-string sniffing*. In the Next.js port, drive the selects from a typed enum and keep these regexes only as a compatibility shim for any URL/query prefill.

---

## A.4 Benchmark bands (display/education only — NOT in the valuation)

```js
    /* Benchmarks for the educational bars/insights — GENERALIZED reference for the
       asset type, NOT a local comp set. (Display/education only; not in the valuation.) */
    var OCC_BAND = { "Limited-Service":[58,68,78], "Select-Service":[62,72,80], "Full-Service":[60,70,78], "Resort / Boutique":[55,65,75], "Extended-Stay":[70,78,85] };
    var ADR_BAND = { "Limited-Service":[95,135,190], "Select-Service":[130,175,240], "Full-Service":[175,240,360], "Resort / Boutique":[220,340,650], "Extended-Stay":[110,150,210] };
    var REVPAR_BAND = { "Limited-Service":[55,90,140], "Select-Service":[80,125,185], "Full-Service":[105,165,275], "Resort / Boutique":[120,210,460], "Extended-Stay":[80,120,175] };
```
> `index.html:1398-1402`

Each band is `[low, mid, high]`. Only `OCC_BAND` and `REVPAR_BAND` render bars; `ADR_BAND` is used solely by the `pricingPower` ADVICE rule (its `[1]` mid value).

---

## A.5 Helpers, formatters and rounding

### A.5.1 `roundTo`, `clamp`, `esc`

```js
    function roundTo(value, increment){ return Math.round(value / increment) * increment; }
```
> `index.html:1396`

```js
    function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
    function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]; }); }
    var usedDefaults = false;
```
> `index.html:1403-1405`

`esc()` is **unused inside this IIFE** (a second, identical-purpose `esc` at `:1788` serves the listings feed). `usedDefaults` is module-scoped mutable state — set `true` by `validate(3)` and by the autofill click handler; **never reset to `false`**. Once a visitor uses typical figures, the "typical figures" caveat sticks for the rest of the session. Preserve that behaviour (or log a decision to change it).

### A.5.2 Step switcher

```js
    function show(step){
      document.querySelectorAll(".calc-step").forEach(function(s){ s.classList.toggle("active", s.dataset.step == step); });
      document.querySelectorAll(".dot").forEach(function(d){ d.classList.toggle("active", Number(d.dataset.dot) <= Number(step)); });
      document.getElementById("stepLabel").textContent = "Step " + step + " of 3";
    }
```
> `index.html:1407-1411`

Note: dots are **cumulative** (`<=`), so on step 3 all three dots are active.

### A.5.3 Input parsing + live formatting (verbatim, complete)

```js
    /* ---- INPUT FORMATTING ----
       num(el): the clean numeric value of a formatted field (commas/$/% stripped).
       Live formatters keep money fields comma-grouped ($1,000,000), integers
       comma-grouped (1,200), percents 0–100 with one decimal — and never let a
       field break the math (only digits + a single dot survive). */
    function num(el){
      var v = parseFloat(String(el.value).replace(/[^0-9.]/g, ""));
      return isNaN(v) ? 0 : v;
    }
    function groupInt(intStr){ return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    // Sanitize raw text to "digits + at most one dot + at most `dec` decimals"
    function clean(raw, dec){
      raw = String(raw).replace(/[^0-9.]/g, "");
      var firstDot = raw.indexOf(".");
      if (firstDot !== -1){
        raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, ""); // only first dot
        if (dec === 0){ raw = raw.slice(0, firstDot); }                                  // ints: drop dot
        else { var p = raw.split("."); raw = p[0] + "." + (p[1] || "").slice(0, dec); }  // cap decimals
      }
      return raw;
    }
    function formatField(el, opts){
      var hadDotEnd = /\.$/.test(el.value);                 // preserve a trailing dot mid-typing
      var raw = clean(el.value, opts.dec);
      if (raw === "" || raw === "."){ el.value = raw; return; }
      var n = parseFloat(raw);
      if (isNaN(n)) { el.value = ""; return; }
      if (opts.max != null && n > opts.max){ n = opts.max; raw = String(n); }
      var parts = raw.split(".");
      var intPart = groupInt(parts[0].replace(/^0+(?=\d)/, ""));   // strip leading zeros, group
      var out = intPart || "0";
      if (parts.length > 1 || (hadDotEnd && opts.dec > 0)) out += "." + (parts[1] || "");
      el.value = out;
    }
    // Wire formatters by data-fmt
    var fmtMap = {
      int:   { dec: 0 },
      money: { dec: 2 },
      pct:   { dec: 1, max: 100 }
    };
    document.querySelectorAll("[data-fmt]").forEach(function(el){
      var opts = fmtMap[el.getAttribute("data-fmt")];
      el.addEventListener("input", function(){ formatField(el, opts); });
      el.addEventListener("blur",  function(){
        // tidy on blur: trim trailing dot, ensure something valid
        el.value = el.value.replace(/\.$/, "");
        if (el.value === "" ) return;
        formatField(el, opts);
      });
      formatField(el, opts);   // format the seeded default value on load
    });
```
> `index.html:1413-1463`

**Behavioural contract of `data-fmt`:**

| `data-fmt` | dec | max | Applied to | Effect |
|---|---|---|---|---|
| `int` | `0` | none | `#cKeys` | digits only, comma-grouped, decimal point dropped entirely |
| `money` | `2` | none | `#cAdr`, `#cNoi` | comma-grouped, up to 2 decimals |
| `pct` | `1` | `100` | `#cOcc`, `#cFb` | comma-grouped, 1 decimal, **hard-capped at 100 on every keystroke** |

`num()` is deliberately lossy: it strips `,` `$` `%` and any letters, then `parseFloat`s. Empty / unparseable → `0`. **`num()` never returns `NaN`.**

### A.5.4 Money / rounding formatters (verbatim, complete)

```js
    function money(v){
      if (v >= 1e6) return "$" + (v/1e6).toFixed(1) + "M";
      return "$" + Math.round(v/1e3) + "K";
    }
    function perKey(v){ return "$" + Math.round(v/1e3) + "K"; }
    // Full comma-grouped dollars for the prefill/context, e.g. $1,000,000
    function dollarsFull(v){ return "$" + groupInt(String(Math.round(v))); }

    function roundTotal(v){
      if (v >= 1e6) return "$" + (Math.round(v/1e5)/10).toFixed(1) + "M";
      return "$" + (Math.round(v/5000)*5) + "K";
    }
    function roundKey(v){ return "$" + Math.round(v/5000)*5 + "K"; }
    function pctBar(val, band){ return clamp((val - band[0]) / (band[2] - band[0]), 0, 1) * 100; }
```
> `index.html:1465-1478`

| Fn | Called from | Notes |
|---|---|---|
| `money(v)` | **nowhere** (dead — D5) | |
| `perKey(v)` | **nowhere** (dead — D5) | |
| `dollarsFull(v)` | `:1601` (`__kwcEstimate.range`) | Full grouped dollars, no `M`/`K` |
| `roundTotal(v)` | `:1558` (`#resRange`) | ≥$1M → 1 decimal `M`; else nearest $5K printed as `K` |
| `roundKey(v)` | `:1561` (`#resPerKey`) | nearest $5K printed as `K`; input is already $1K-rounded (D6) |
| `pctBar(val, band)` | `:1575-1576` | `(val − band[0]) / (band[2] − band[0])`, clamped `0..1`, ×100. Uses `band[0]` and `band[2]` only — the mid `band[1]` is not a bar landmark |

`groupInt` is also used directly at `:1442` (inside `formatField`), `:1560`, `:1604`, `:1633` and `:1661` — five call sites besides `dollarsFull` (`:1471`).

---

## A.6 `ADVICE` — the full insights array (verbatim, all 9 rules)

```js
    /* ---- Insights engine: {code, prio, test(ctx), html}. Show top 2 by priority. ---- */
    var ADVICE = [
      { code:"pip", prio:1, test:function(c){ return c.cond === "old"; },
        html:"A near-term renovation (a brand-required <strong>PIP</strong>) is the most common reason a quoted price gets re-traded. Pricing it correctly up front protects your number — this is where a BOV earns its keep." },
      { code:"ground", prio:1, test:function(c){ return c.ground; },
        html:"A ground lease can reduce value 15–30% depending on the remaining term — we'd need the lease itself to price it precisely. It's the first thing a buyer will ask about, so it's worth getting ahead of." },
      { code:"revparTop", prio:2, test:function(c){ return c.revpar >= c.rb[2]; },
        html:"Your RevPAR is in the top tier for this asset type — buyers compete on hotels like this and price them aggressively, at a tighter cap. These are strong, sellable numbers." },
      { code:"revparLow", prio:2, test:function(c){ return c.revpar <= c.rb[0] && c.revpar > 0; },
        html:"Your RevPAR is below the typical band for this type — and that gap is upside a value-add buyer will pay to capture. Buyers underwrite the <em>stabilized</em> number, not just today's." },
      { code:"pricingPower", prio:3, test:function(c){ return c.occPct >= c.ob[2] && c.adr <= c.ab[1]; },
        html:"You're filling rooms but leaving rate on the table — high occupancy with a below-typical ADR often signals unrealized pricing power. Even a modest rate lift drops almost entirely to the bottom line." },
      { code:"valueAdd", prio:3, test:function(c){ return c.occPct <= c.ob[0]; },
        html:"Soft occupancy is usually demand or distribution upside, not a low ceiling. Buyers price the stabilized occupancy a good operator can reach — a credible path there is worth real money." },
      { code:"independent", prio:3, test:function(c){ return c.brand === "indep"; },
        html:"Independent hotels typically trade ~50–100bps wider on cap than branded — a well-fitted flag or soft-brand can lift value roughly 8–15%. Almost always worth pricing both ways before you sell as-is." },
      { code:"smallKeys", prio:4, test:function(c){ return c.keys < 60; },
        html:"A hotel this size sits in the sweet spot for SBA-financed and owner-operator buyers — a deep, motivated pool that prices differently than the funds chasing larger assets. Targeting the right buyers is often worth more than the headline range." },
      { code:"bigKeys", prio:4, test:function(c){ return c.keys >= 150; },
        html:"At this size you're in institutional-buyer territory — larger buyer pools, often tighter pricing. Positioning to the right capital matters." }
    ];
```
> `index.html:1480-1500`

**Rule table (declaration order is also the tie-break order — `Array.prototype.sort` is stable):**

| # | `code` | `prio` | Test | Reads from ctx |
|---|---|---|---|---|
| 1 | `pip` | 1 | `cond === "old"` (i.e. `condCfg === "over8"`) | `cond` |
| 2 | `ground` | 1 | `ground` truthy | `ground` |
| 3 | `revparTop` | 2 | `revpar >= rb[2]` | `revpar`, `REVPAR_BAND[type][2]` |
| 4 | `revparLow` | 2 | `revpar <= rb[0] && revpar > 0` | `revpar`, `REVPAR_BAND[type][0]` |
| 5 | `pricingPower` | 3 | `occPct >= ob[2] && adr <= ab[1]` | `occPct`, `OCC_BAND[type][2]`, `adr`, `ADR_BAND[type][1]` |
| 6 | `valueAdd` | 3 | `occPct <= ob[0]` | `occPct`, `OCC_BAND[type][0]` |
| 7 | `independent` | 3 | `brand === "indep"` | `brand` |
| 8 | `smallKeys` | 4 | `keys < 60` | `keys` |
| 9 | `bigKeys` | 4 | `keys >= 150` | `keys` |

Note `occPct` is the **percent number** (e.g. `74`), matching `OCC_BAND`'s percent scale. `revpar` is dollars.

### A.6.1 Fallback advice (rendered when zero rules fire) — verbatim

```js
        top = [{ html: "Your numbers land in a healthy, sellable range for this asset type — no single red flag, no obvious gap. Hotels like this reward a disciplined, well-run process more than any one pricing trick. The next move is matching the right buyers to your story." }];
```
> `index.html:1592`

Note the fallback object has **no `code`** — so it contributes nothing to `firedCodes` and cannot influence `ctaLine`.

### A.6.2 CTA lines — verbatim (3 variants)

```js
      var ctaLine = firedCodes.some(function(c){ return ["revparLow","valueAdd","independent"].indexOf(c) !== -1; })
        ? "Your numbers tell a value-add story — let's pressure-test the upside before you list."
        : (firedCodes.indexOf("revparTop") !== -1
            ? "You're running this well — let's make sure the pricing captures it."
            : "Request a written BOV to turn this estimate into a real pricing strategy.");
```
> `index.html:1585-1589`

**Selection order matters:** the value-add branch is tested against **all** fired codes (not just the rendered top 2), and it wins over `revparTop` if both conditions hold.

---

## A.7 `calculate()` — complete, verbatim

```js
    function calculate(){
      var type  = document.getElementById("cType").value;          // display string
      var pt    = typeKey(type);                                    // CONFIG key
      var keys  = num(document.getElementById("cKeys"));
      var occPct = num(document.getElementById("cOcc"));            // percent number
      var occ   = occPct / 100;
      var adr   = num(document.getElementById("cAdr"));
      var tier  = tierKey(document.getElementById("cTier").value);  // CONFIG tier key
      var brandCfg = brandKeyCfg(document.getElementById("cBrandFlag").value);
      var condCfg  = condKeyCfg(document.getElementById("cCond").value);
      var ground = /ground lease/i.test(document.getElementById("cGround").value);
      var fbPct = num(document.getElementById("cFb")) / 100;        // as decimal
      var noiOverride = num(document.getElementById("cNoi"));
      var mkt   = (document.getElementById("cMarket").value.match(/\d{5}/) || [""])[0];   // 5-digit ZIP if present

      // ctx keys used by the insights engine (kept stable)
      var cond  = (condCfg === "over8") ? "old" : (condCfg === "under4" ? "new" : "base");
      var brand = (brandCfg === "independent") ? "indep" : "branded";

      var revpar = adr * occ;

      // ---- Dino's generic teaser model (calcValuation) ----
      // 1. NOI — actual if provided, else build it from rooms revenue.
      var noi, usedNoiOverride = false;
      if (noiOverride > 0){ noi = noiOverride; usedNoiOverride = true; }
      else {
        var roomRevenue  = keys * adr * 365 * occ;
        var totalRevenue = roomRevenue / CONFIG.roomsToTotal[pt];
        noi = totalRevenue * CONFIG.noiMargin[pt];
      }
      var noiPerKey = keys > 0 ? noi / keys : 0;

      // 2. Base cap band by type + tier.
      var band = CONFIG.capRates[pt][tier];
      var capLow = band[0], capHigh = band[1];

      // 3. Optional refiner adjusters (additive bps to both ends).
      var adj = 0;
      adj += CONFIG.renovationAdj[condCfg] || 0;
      adj += CONFIG.landAdj[ground ? "groundLease" : "feeSimple"] || 0;
      adj += CONFIG.brandAdj[brandCfg] || 0;
      if (fbPct > 0 && fbPct > CONFIG.fbThreshold) adj += CONFIG.fbHighAdj;
      capLow += adj; capHigh += adj;

      // Floor the cap so adjusters can't drive it absurdly low.
      capLow  = Math.max(capLow, 0.045);
      capHigh = Math.max(capHigh, capLow + 0.005);

      // 4. Value range (low cap → high value). 5. Per key.
      var valueHigh = noi / capLow, valueLow = noi / capHigh;
      var totalHigh = roundTo(valueHigh, 50000), totalLow = roundTo(valueLow, 50000);
      var vHigh = Math.round((valueHigh / keys) / 1000) * 1000;
      var vLow  = Math.round((valueLow / keys) / 1000) * 1000;
      var keyClampFired = false;

      // ---- Render ----
      document.getElementById("resRange").textContent = roundTotal(totalLow) + " – " + roundTotal(totalHigh);
      document.getElementById("resRevpar").textContent = "$" + Math.round(revpar);
      document.getElementById("resNoi").textContent = usedNoiOverride ? "$" + groupInt(String(Math.round(noiPerKey))) + "*" : "$" + groupInt(String(Math.round(noiPerKey)));
      document.getElementById("resPerKey").textContent = roundKey(vLow) + " – " + roundKey(vHigh);
      document.getElementById("resCap").textContent = (capLow*100).toFixed(1) + "% – " + (capHigh*100).toFixed(1) + "%";

      // Canonical disclaimer language — used consistently here and in the methodology note.
      document.getElementById("resHonest").textContent =
        "Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.";
      document.getElementById("resContext").innerHTML =
        "A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below." +
        (usedDefaults ? " <em>This range uses typical figures for your market tier; your real numbers will sharpen it.</em>" : "") +
        (usedNoiOverride ? " <em>Using your actual NOI — the most accurate input you can give us.</em>" : "");

      // Benchmark bars
      var ob = OCC_BAND[type], rb = REVPAR_BAND[type];
      document.getElementById("resBars").innerHTML =
        bar("Occupancy", occPct + "%", pctBar(occPct, ob), ob[0] + "–" + ob[2] + "% typical") +
        bar("RevPAR", "$" + Math.round(revpar), pctBar(revpar, rb), "$" + rb[0] + "–$" + rb[2] + " typical");

      // Insights
      var ctx = { type:type, keys:keys, occ:occ, occPct:occPct, adr:adr, revpar:revpar, tier:tier, brand:brand, cond:cond, ground:ground,
                  rb:REVPAR_BAND[type], ob:OCC_BAND[type], ab:ADR_BAND[type] };
      var fired = ADVICE.filter(function(a){ try { return a.test(ctx); } catch(e){ return false; } })
                        .sort(function(a,b){ return a.prio - b.prio; });
      var firedCodes = fired.map(function(a){ return a.code; });
      var top = fired.slice(0, 2);
      var ctaLine = firedCodes.some(function(c){ return ["revparLow","valueAdd","independent"].indexOf(c) !== -1; })
        ? "Your numbers tell a value-add story — let's pressure-test the upside before you list."
        : (firedCodes.indexOf("revparTop") !== -1
            ? "You're running this well — let's make sure the pricing captures it."
            : "Request a written BOV to turn this estimate into a real pricing strategy.");
      // Always show at least one substantive read — if no rule fired, give a balanced one.
      if (!top.length){
        top = [{ html: "Your numbers land in a healthy, sellable range for this asset type — no single red flag, no obvious gap. Hotels like this reward a disciplined, well-run process more than any one pricing trick. The next move is matching the right buyers to your story." }];
      }
      var adviceHtml = top.map(function(a){ return '<p class="result-advice">' + a.html + '</p>'; }).join("");
      adviceHtml += '<p class="result-cta-line">' + ctaLine + '</p>';
      document.getElementById("resAdvice").innerHTML = adviceHtml;

      // Prefill for Calendly + Web3Forms
      var topAdviceText = top.length ? top[0].html.replace(/<[^>]*>/g, "") : "";
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
    }
```
> `index.html:1502-1612`

**Line-level notes a port must not lose:**

1. `var keyClampFired = false;` (`:1555`) is declared and **never read or written again** — dead. Do not port.
2. `mkt` (`:1515`) grabs the **first run of 5 consecutive digits anywhere** in `#cMarket`. `"90210"` → `"90210"`; `"abc 902101 x"` → `"90210"`; `"Los Angeles"` → `""`; `"9021"` → `""`.
3. Separators are **en dash with spaces** — `" – "` — in `#resRange`, `#resPerKey`, `#resCap` and `__kwcEstimate.range`; but **en dash with NO spaces** — `"%–"` — in `__kwcEstimate.capRangeUsed` (`:1605`) and in the bar sub-labels (`:1575-1576`). Byte-exact difference; preserve it.
4. `#resNoi` appends a literal `*` only when the NOI override path is used (`:1560`).
5. `#resHonest` uses `.textContent`; `#resContext` and `#resAdvice` and `#resBars` use `.innerHTML`. ADVICE bodies contain `<strong>` / `<em>`, so the port must render them as rich text (a typed `ReactNode` or sanitized HTML — never raw user data).
6. `topAdvice` strips all tags via `/<[^>]*>/g` then truncates to **140 chars** (`:1609`).
7. `summary` joins with `" · "` (U+00B7 middle dot, space-padded) and includes the ZIP only when non-empty.
8. `calculate()` reads occupancy **without clamping**. The 0–100 clamp lives in `formatField` (live, `pct.max = 100`) and in `validate(3)` (write-back). See §B.7.

---

## A.8 `bar()` — benchmark-bar markup, verbatim

```js
    function bar(label, valTxt, pct, sub){
      return '<div class="bench-row"><div class="bench-top"><span class="bench-label">' + label + '</span><span class="bench-val">' + valTxt + '</span></div>'
        + '<div class="bench-track"><div class="bench-fill" style="width:' + pct.toFixed(0) + '%"></div></div>'
        + '<div class="bench-sub">' + sub + '</div></div>';
    }
```
> `index.html:1614-1618`

**Bar position formula:** `width = clamp((value − band[0]) / (band[2] − band[0]), 0, 1) × 100`, printed with `toFixed(0)` (integer percent string, no decimals).

**Exactly two bars are rendered, in this order:**

| Order | `label` | `valTxt` | `pct` source | `sub` |
|---|---|---|---|---|
| 1 | `Occupancy` | `occPct + "%"` (raw number + `%`, e.g. `"74%"`) | `pctBar(occPct, OCC_BAND[type])` | `ob[0] + "–" + ob[2] + "% typical"` e.g. `"60–78% typical"` |
| 2 | `RevPAR` | `"$" + Math.round(revpar)` | `pctBar(revpar, REVPAR_BAND[type])` | `"$" + rb[0] + "–$" + rb[2] + " typical"` e.g. `"$105–$275 typical"` |

Bar CSS (`index.html:499-505`):
```css
  .bench-row { margin-bottom: 14px; }
  .bench-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
  .bench-label { font-family: var(--sans); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-muted); }
  .bench-val { font-family: var(--mono); font-size: 13px; color: var(--gold); }
  .bench-track { height: 5px; background: var(--rule); position: relative; }
  .bench-fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--gold); }
  .bench-sub { font-family: var(--sans); font-size: 10px; color: var(--meta); margin-top: 4px; }
```
The fill has **no transition** in the source. Hokuten may add one (design-skill call), but note there is no `aria` on the bar — the port should add `role="meter"` / `aria-valuenow` per the a11y gate.

---

## A.9 `validate()` — verbatim, with all error copy

```js
    function validate(step){
      if (step == 2){
        var keys = num(document.getElementById("cKeys"));
        if (!keys || keys < 1){ document.getElementById("err1").textContent = "How many rentable rooms does the hotel have?"; return false; }
        document.getElementById("err1").textContent = "";
      }
      if (step == 3){
        var occEl = document.getElementById("cOcc"), adrEl = document.getElementById("cAdr");
        var occ = num(occEl), adr = num(adrEl);
        var bm = typicalFor();
        // Auto-correct where safe rather than blocking; reserve errors for truly empty.
        if (!occ){ occEl.value = String(bm.occ); usedDefaults = true; occ = bm.occ; }
        if (occ > 100){ occEl.value = "100"; occ = 100; }
        if (!adr){ adrEl.value = groupInt(String(bm.adr)); usedDefaults = true; }
        document.getElementById("err2").textContent = "";
      }
      return true;
    }
```
> `index.html:1620-1637`

**The one and only blocking error string in the whole calculator:**
```
How many rentable rooms does the hotel have?
```
> `index.html:1623` → rendered into `#err1`

`#err2` is only ever cleared, never populated — step 2 has **no blocking validation**. Empty occupancy or ADR is silently auto-filled from `typicalFor()` and `usedDefaults` flips to `true`.

**`validate` bug to note (P3):** the `occ > 100` branch writes `occEl.value = "100"` but the local `occ` correction happens *after* the write; harmless because `calculate()` re-reads the DOM. It is also unreachable through the UI because `formatField`'s `pct.max = 100` already caps on input. Keep the clamp in the port as defence-in-depth (see golden case G8).

---

## A.10 `typicalFor()` — verbatim

```js
    // Typical occupancy(%)/ADR for the current MARKET TIER (Dino's tier-based fallbacks).
    function typicalFor(){
      var t = tierKey(document.getElementById("cTier").value);
      var v = TYPICAL[t] || TYPICAL.suburban;
      return { occ: Math.round(v.occupancy * 100), adr: v.adr };
    }
```
> `index.html:1639-1644`

---

## A.11 Live RevPAR preview — verbatim

```js
    // Live RevPAR preview on Step 2
    function updateRevparLive(){
      var occ = num(document.getElementById("cOcc")) / 100, adr = num(document.getElementById("cAdr"));
      var el = document.getElementById("cRevparLive");
      if (el) el.innerHTML = (occ > 0 && adr > 0)
        ? 'RevPAR ≈ <strong>$' + Math.round(adr * occ) + '</strong>  <span>(ADR × occupancy — the number buyers anchor on)</span>'
        : '';
    }
    ["cOcc","cAdr"].forEach(function(id){ var e = document.getElementById(id); if (e) e.addEventListener("input", updateRevparLive); });
```
> `index.html:1646-1654`

Note: **two spaces** between `</strong>` and `<span>`. The `≈` is U+2248 and the `×` is U+00D7. Empty string when either occupancy or ADR is 0 — the row collapses to `min-height: 16px` (`index.html:483`).

---

## A.12 Typical-figures autofill handler — verbatim

```js
    // Auto-fill typical numbers (by market tier)
    var autofill = document.getElementById("cAutofill");
    if (autofill) autofill.addEventListener("click", function(){
      var bm = typicalFor();
      var occEl = document.getElementById("cOcc"), adrEl = document.getElementById("cAdr");
      occEl.value = String(bm.occ); adrEl.value = groupInt(String(bm.adr));
      usedDefaults = true;
      document.getElementById("cAutofillNote").textContent = "Filled with typical figures for your market tier — adjust if you know your own.";
      updateRevparLive();
    });
```
> `index.html:1656-1665`

Autofill note copy, byte-exact:
```
Filled with typical figures for your market tier — adjust if you know your own.
```

**Contract:** autofill writes the ADR through `groupInt` (so `245` stays `"245"` but a 4-digit ADR would become `"1,000"`), sets `usedDefaults = true` permanently, and re-renders the live RevPAR line. It does **not** trigger `calculate()`.

---

## A.13 Property-type → F&B row sync, and nav wiring — verbatim

```js
    // Show/hide F&B row + refresh defaults when property type changes
    var typeEl = document.getElementById("cType");
    function syncType(){
      var t = typeEl.value;
      var fbRow = document.getElementById("fbRow");
      if (fbRow) fbRow.style.display = (t === "Full-Service" || t === "Resort / Boutique") ? "" : "none";
    }
    typeEl.addEventListener("change", syncType);
    syncType();

    document.querySelectorAll(".calc-btn").forEach(function(b){
      b.addEventListener("click", function(){
        var go = b.dataset.go;
        if ((go == "2" && !validate(2)) || (go == "3" && !validate(3))) return;
        if (go == "3") calculate();
        show(go);
      });
    });
    updateRevparLive();
    calculate(); // prime Step 3 so it's correct the moment the user reaches it
  })();
```
> `index.html:1667-1687`

**F&B visibility rule:** strict `===` equality against the two literal display strings `"Full-Service"` and `"Resort / Boutique"` — not a regex. Hidden value still counts (D3).

**Navigation contract:**
- `data-go="2"` → run `validate(2)` (keys required); if it fails, abort — do **not** change step.
- `data-go="3"` → run `validate(3)` (auto-fill occ/ADR); it always returns `true`; then `calculate()`; then `show(3)`.
- `data-go="1"` ("Back" / "Start over") → **no validation, no recalculation**, just `show(1)`. "Start over" does *not* reset any field.
- On IIFE init: `updateRevparLive()` then `calculate()` prime step 3 with the seeded defaults.

---

## A.14 Info-popover engine (ⓘ trigger) — verbatim

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
> `index.html:1689-1733`

**Behaviour contract:** click-toggle only (no hover, no focus-open). One popover at a time. Closes on: click the same trigger again, click anywhere outside the popover, `Escape`, `resize`, any `scroll` (capture phase). Positioned centred under the trigger, clamped to a `12px` viewport margin, flipped above if it would overflow the bottom. Only `aria-expanded` is managed — **no `aria-describedby`, no focus management, no `role`**. The Hokuten port must add those to clear the a11y gate.

Popover CSS (`index.html:441-451`, trigger at `:428-438`):
```css
  .calc-info {
    display: inline-flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; margin-left: 7px; padding: 0;
    border-radius: 50%; border: 1px solid var(--gold);
```
```css
  .calc-info:hover, .calc-info[aria-expanded="true"] { background: var(--gold); color: var(--ink); }
  .calc-info.inline { width: 15px; height: 15px; margin: 0 2px; transform: translateY(-1px); }
```
```css
  .calc-popover.open { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .calc-popover strong { color: var(--gold); font-weight: 600; }
  .calc-popover .tip-eg { display: block; margin: 4px 0 9px; color: var(--meta); font-style: italic; font-size: 12px; }
```
Mobile overrides (`index.html:795-796`): `.calc-info { width: 18px; height: 18px; }` and `.calc-popover { max-width: 84vw; }`.

The trigger's visible glyph is the ASCII letter **`i`**, not a `ⓘ` character — the circle is CSS `border-radius`.

---

# §B — THE WIZARD UI

Section shell: `index.html:911-1087`.

```html
<!-- CALCULATOR (interactive 3-step wizard, logic per brief §4.4) -->
<section class="calculator-section" id="calculator">
  <div class="content" style="padding-top: 100px; padding-bottom: 100px;">
    <div class="calculator-grid">
      <div class="calc-intro">
        <div class="eyebrow" style="margin-bottom: 18px;">Valuation Calculator</div>
        <h2>What's your hotel <span class="accent">worth</span>?</h2>
        <p>Get a confidential range from comp data in under 60 seconds. No email required to see the result.</p>
        <div class="calc-methodology-note">
          Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value. A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation. Request a written BOV below.
        </div>
      </div>
```
> `index.html:911-922`

Layout: `.calculator-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: start; }` (`index.html:393`), collapsing to `1fr` / `gap: 40px` at the mobile breakpoint (`index.html:744`).

## B.1 Stepper

```html
        <div class="step-indicator">
          <span class="step-label" id="stepLabel">Step 1 of 3</span>
          <div style="flex:1"></div>
          <span class="dot active" data-dot="1"></span>
          <span class="dot" data-dot="2"></span>
          <span class="dot" data-dot="3"></span>
        </div>
```
> `index.html:924-930`

- Label copy is generated by `show()`: `"Step " + step + " of 3"` → `Step 1 of 3` / `Step 2 of 3` / `Step 3 of 3`. Initial server-rendered value is `Step 1 of 3`.
- Dots are **cumulative**: on step 2, dots 1 and 2 are gold; on step 3 all three are.
- No text labels per dot; no click-to-jump. Dots are decorative (`6px` circles) — **no `aria` at all**; the Hokuten port needs `aria-current`/`role="list"` treatment.

---

## B.2 STEP 1 — "First, the basics."

```html
        <!-- Step 1 -->
        <div class="calc-step active" data-step="1">
          <p class="calc-step-head">First, the basics.<span>No financials yet — just what kind of hotel it is.</span></p>
```
> `index.html:932-934`

| | Verbatim |
|---|---|
| Title | `First, the basics.` |
| Subtitle (inside `<span>`) | `No financials yet — just what kind of hotel it is.` |

### B.2.1 Field — Property Type

```html
            <div class="field">
              <label>Property Type<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label>
              <select id="cType">
                <option>Limited-Service</option>
                <option>Select-Service</option>
                <option selected>Full-Service</option>
                <option>Resort / Boutique</option>
                <option>Extended-Stay</option>
              </select>
            </div>
```
> `index.html:936-945` (data-tip elided here; full text below)

| Property | Value |
|---|---|
| `id` | `cType` |
| Control | `<select>` |
| Label | `Property Type` |
| Default | `Full-Service` (3rd option, `selected`) |
| Required | implicitly — a select always has a value |
| Validation | none |
| Side effects on change | `syncType()` toggles `#fbRow` visibility |
| Info button `aria-label` | `What's this?` |

**Option list, in order, byte-exact:**
```
Limited-Service
Select-Service
Full-Service      ← selected
Resort / Boutique
Extended-Stay
```

**FULL popover copy (`data-tip`, `index.html:937`) — byte-exact HTML:**
```html
<strong>Pick what best fits your hotel:</strong><br>• <strong>Limited-Service</strong> — no restaurant or room service; maybe a breakfast bar.<span class='tip-eg'>Hampton Inn, La Quinta</span>• <strong>Select-Service</strong> — limited food &amp; beverage, a small meeting room, maybe a bar.<span class='tip-eg'>Courtyard, Hilton Garden Inn</span>• <strong>Full-Service</strong> — restaurant, room service, banquet space.<span class='tip-eg'>Marriott, Hilton flagship</span>• <strong>Resort / Boutique</strong> — destination or design-led independent.<span class='tip-eg'>Resort with pools, lifestyle hotel</span>• <strong>Extended-Stay</strong> — kitchenettes, longer / weekly guests.<span class='tip-eg'>Residence Inn, Homewood Suites</span>
```
(Bullets are `•` U+2022; the attribute uses single-quoted inner class names because the attribute itself is double-quoted; `&amp;` is an HTML entity in the attribute value and renders as `&`.)

### B.2.2 Field — Keys

```html
            <div class="field"><label>Keys<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label><input type="text" id="cKeys" value="88" inputmode="numeric" autocomplete="off" data-fmt="int"></div>
```
> `index.html:946`

| Property | Value |
|---|---|
| `id` | `cKeys` |
| Control | `<input type="text">` |
| Label | `Keys` |
| Default value | `88` |
| `inputmode` | `numeric` |
| `autocomplete` | `off` |
| `data-fmt` | `int` (dec 0, no max) |
| Placeholder | none |
| `min`/`max`/`step` | **none in the markup** — bounds come from `data-fmt` + `validate(2)` only |
| Required | **yes** — the only required field |
| Validation | `validate(2)`: `if (!keys \|\| keys < 1)` → error |
| Error copy | `How many rentable rooms does the hotel have?` → `#err1` |
| Adornment | none |

**FULL popover copy (`index.html:946`):**
```html
<strong>Keys</strong> = the total number of rentable guest rooms in the hotel.<span class='tip-eg'>A suite counts as one key.</span>
```

### B.2.3 Field — Where is it? (market tier)

```html
            <div class="field">
              <label>Where is it?<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label>
              <select id="cTier">
                <option>Gateway / urban core (NYC, SF, LA, Miami…)</option>
                <option>Strong secondary / resort destination</option>
                <option selected>Standard / suburban</option>
                <option>Tertiary / rural / highway</option>
              </select>
            </div>
```
> `index.html:949-957` (the enclosing `<div class="field-grid">` is `:948`)

| Property | Value |
|---|---|
| `id` | `cTier` |
| Label | `Where is it?` |
| Default | `Standard / suburban` (3rd, `selected`) |
| Validation | none |
| Downstream | `tierKey()` → cap band; `typicalFor()` → autofill values |

**Option list, in order, byte-exact** (note the ellipsis is U+2026, a single character):
```
Gateway / urban core (NYC, SF, LA, Miami…)
Strong secondary / resort destination
Standard / suburban      ← selected
Tertiary / rural / highway
```

**FULL popover copy (`index.html:950`):**
```html
<strong>Market type</strong> — location drives price more than almost anything. Pick the bucket that best fits; it's used to set the cap rate (the going price of hotel income) for your area.<span class='tip-eg'>Not sure? 'Standard / suburban' is the safe middle.</span>
```

### B.2.4 Field — Brand

```html
            <div class="field">
              <label>Brand<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label>
              <select id="cBrandFlag">
                <option selected>Branded (franchise)</option>
                <option>Soft-brand / lifestyle</option>
                <option>Independent / unbranded</option>
              </select>
            </div>
```
> `index.html:958-965`

| Property | Value |
|---|---|
| `id` | `cBrandFlag` |
| Label | `Brand` |
| Default | `Branded (franchise)` (1st, `selected`) |
| Validation | none |

**Option list, byte-exact:**
```
Branded (franchise)       ← selected  → brandAdj.branded     (−25 bps)
Soft-brand / lifestyle                → brandAdj.branded     (−25 bps)  ← same band as branded
Independent / unbranded               → brandAdj.independent (+25 bps)
```

**FULL popover copy (`index.html:959`):**
```html
<strong>Brand / flag</strong> — branded hotels usually sell at a friendlier price because their cash flow reads as lower-risk to buyers and lenders.<span class='tip-eg'>Soft-brands: Autograph, Tapestry, Curio.</span>
```

### B.2.5 Field — ZIP code (optional)

```html
          <div class="field" style="margin-top:18px;"><label>ZIP code <span style="text-transform:none;letter-spacing:0;color:var(--meta);font-weight:400;">— optional</span></label><input type="text" id="cMarket" placeholder="5-digit ZIP" inputmode="numeric" maxlength="5" autocomplete="postal-code"></div>
```
> `index.html:967`

| Property | Value |
|---|---|
| `id` | `cMarket` |
| Label | `ZIP code ` + a styled `<span>` reading `— optional` |
| Placeholder | `5-digit ZIP` |
| `maxlength` | `5` |
| `inputmode` | `numeric` |
| `autocomplete` | `postal-code` |
| `data-fmt` | **none** — no live formatting |
| Default | empty |
| Required | no |
| Validation | none. Only consumed as `(value.match(/\d{5}/) \|\| [""])[0]` for the `summary` prefill string. **Never affects the math.** |
| Info popover | none |

### B.2.6 "Refine my estimate (optional)" disclosure

```html
          <details class="calc-refine">
            <summary>Refine my estimate <span>(optional)</span></summary>
            <div class="calc-refine-body">
```
> `index.html:969-971`

Closed by default (no `open` attribute). CSS replaces the marker with `+ ` / `– ` (`index.html:475-481`):
```css
  details.calc-refine summary::before { content: "+ "; }
  details.calc-refine[open] summary::before { content: "– "; }
```
(`– ` is en dash U+2013 + space.)

#### B.2.6.1 Field — Condition / last renovation

```html
                <div class="field">
                  <label>Condition / last renovation<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label>
                  <select id="cCond">
                    <option>Renovated / built in last 3 yrs</option>
                    <option selected>4–8 yrs (baseline)</option>
                    <option>9–15 yrs</option>
                    <option>15+ yrs / renovation (PIP) due</option>
                  </select>
                </div>
```
> `index.html:973-981`

| Property | Value |
|---|---|
| `id` | `cCond` |
| Label | `Condition / last renovation` |
| Default | `4–8 yrs (baseline)` (2nd, `selected`) — en dash U+2013 in `4–8` |

**Option list, byte-exact → adjuster:**
```
Renovated / built in last 3 yrs   → under4    −50 bps
4–8 yrs (baseline)      ← selected → base4to8   0 bps
9–15 yrs                          → over8     +75 bps
15+ yrs / renovation (PIP) due    → over8     +75 bps
```

**FULL popover copy (`index.html:974`):**
```html
<strong>Age &amp; condition</strong> — an upcoming brand-required renovation (a <strong>PIP</strong>) is one of the biggest silent value factors. Older assets carry capital risk buyers price in.
```

#### B.2.6.2 Field — Land

```html
                <div class="field">
                  <label>Land<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label>
                  <select id="cGround">
                    <option selected>Fee Simple (own the land)</option>
                    <option>Ground lease</option>
                  </select>
                </div>
```
> `index.html:982-988`

| Property | Value |
|---|---|
| `id` | `cGround` |
| Label | `Land` |
| Default | `Fee Simple (own the land)` (1st, `selected`) |

**Option list, byte-exact → adjuster:**
```
Fee Simple (own the land)  ← selected → feeSimple     0 bps
Ground lease                          → groundLease +100 bps
```

**FULL popover copy (`index.html:983`):**
```html
<strong>Fee simple</strong> = you own the land. <strong>Ground lease</strong> = the land is leased — this can reduce value 15–30% depending on the remaining term, and buyers always ask.
```
(`15–30%` uses en dash U+2013.)

#### B.2.6.3 Field — F&B as % of revenue (conditionally visible)

```html
                <div class="field" id="fbRow" style="display:none;">
                  <label>F&amp;B as % of revenue<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label>
                  <div class="input-adorn pct"><input type="text" id="cFb" placeholder="optional" inputmode="decimal" autocomplete="off" data-fmt="pct"></div>
                </div>
```
> `index.html:991-994` (the enclosing `<div class="field-grid">` is `:990`)

| Property | Value |
|---|---|
| Row `id` | `fbRow` — **`display:none` in the markup**, revealed by `syncType()` |
| Visible when | `#cType.value === "Full-Service"` OR `=== "Resort / Boutique"` (strict equality) |
| Input `id` | `cFb` |
| Label | `F&B as % of revenue` (source writes `F&amp;B`) |
| Placeholder | `optional` |
| Default | empty |
| `inputmode` | `decimal` |
| `data-fmt` | `pct` → dec 1, **max 100** |
| Adornment | `.input-adorn.pct` → `%` suffix rendered inside the box via `::after` (`index.html:420-421`) |
| Required | no |
| Validation | none |
| Effect | `if (fbPct > 0 && fbPct > 0.25) adj += 0.0025` — **strictly greater than 25%**; exactly 25 does **not** fire |
| Defect | D3 — value persists and still applies when the row is hidden |

**FULL popover copy (`index.html:992`):**
```html
<strong>Food &amp; beverage share</strong> — restaurants/banquets run at thinner margins than rooms, so a high F&amp;B mix slightly lowers the income margin we assume.<span class='tip-eg'>Leave blank if unsure.</span>
```
**Copy-accuracy flag (P2, for the Hokuten claims/QA pass):** this popover says a high F&B mix "lowers the income margin we assume" — the code does **not** touch `noiMargin`; it widens the **cap rate** by 25 bps. The copy and the math disagree. Port verbatim, then log a copy fix.

#### B.2.6.4 Field — I know my actual NOI

```html
                <div class="field">
                  <label>I know my actual NOI<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label>
                  <div class="input-adorn cur"><input type="text" id="cNoi" placeholder="annual, optional" inputmode="decimal" autocomplete="off" data-fmt="money"></div>
                </div>
```
> `index.html:995-998`

| Property | Value |
|---|---|
| `id` | `cNoi` |
| Label | `I know my actual NOI` |
| Placeholder | `annual, optional` |
| Default | empty |
| `data-fmt` | `money` → dec 2, no max |
| Adornment | `.input-adorn.cur` → `$` prefix inside the box via `::before` (`index.html:418-419`) |
| Required | no |
| Validation | none |
| Effect | any value `> 0` **replaces the entire revenue model** — `roomsToTotal` and `noiMargin` are skipped |
| Result marker | appends `*` to `#resNoi` and adds the "Using your actual NOI" caveat sentence |

**FULL popover copy (`index.html:996`):**
```html
<strong>NOI = Net Operating Income</strong> — the income the hotel throws off after operating expenses (before debt). If you know it, enter the annual figure and we'll use it directly — the most accurate input you can give us.
```

### B.2.7 Step 1 footer

```html
          <div class="calc-error" id="err1"></div>
          <div class="calc-nav"><button type="button" class="calc-btn next" data-go="2">Continue</button></div>
```
> `index.html:1003-1004`

| Element | Copy | `data-go` |
|---|---|---|
| Next button | `Continue` | `2` |

No Back button on step 1. Error slot `#err1` reserves `min-height: 14px` (`index.html:527`).

---

## B.3 STEP 2 — "Now, how's it doing?"

```html
        <!-- Step 2 -->
        <div class="calc-step" data-step="2">
          <p class="calc-step-head">Now, how's it doing?<span>Your last 12 months. Estimates are fine — we'll show you a range.</span></p>
          <p class="calc-step-note" style="margin-bottom:18px;">These are your <strong>TTM</strong> <button type="button" class="calc-info inline" aria-label="What is TTM?" data-tip="…">i</button> numbers — your most recent 12 months.</p>
```
> `index.html:1007-1010`

| | Verbatim |
|---|---|
| Title | `Now, how's it doing?` |
| Subtitle | `Your last 12 months. Estimates are fine — we'll show you a range.` |
| Note (before the ⓘ) | `These are your ` + `<strong>TTM</strong>` + ` ` |
| Note (after the ⓘ) | ` numbers — your most recent 12 months.` |
| Inline ⓘ `aria-label` | `What is TTM?` |
| Inline ⓘ class | `calc-info inline` (15×15px, `translateY(-1px)`) |

**FULL TTM popover copy (`index.html:1010`):**
```html
<strong>TTM = Trailing Twelve Months</strong> — your most recent 12 months of actual performance (not a calendar year). Buyers price a hotel off its TTM numbers because they show how it's running right now.
```

### B.3.1 Field — Occupancy (TTM)

```html
            <div class="field"><label>Occupancy (TTM)<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label><div class="input-adorn pct"><input type="text" id="cOcc" value="74" inputmode="decimal" autocomplete="off" data-fmt="pct"></div></div>
```
> `index.html:1012`

| Property | Value |
|---|---|
| `id` | `cOcc` |
| Label | `Occupancy (TTM)` |
| Default value | `74` |
| `inputmode` | `decimal` |
| `data-fmt` | `pct` → dec 1, **max 100 enforced on every keystroke** |
| Adornment | `%` suffix inside the box |
| Placeholder | none |
| Required | no (auto-filled from tier if empty) |
| Validation | `validate(3)`: `if (!occ)` → set to `typicalFor().occ`, `usedDefaults = true`; `if (occ > 100)` → set to `"100"` |
| Error copy | none — never blocks |
| Live effect | `input` → `updateRevparLive()` |

**FULL popover copy (`index.html:1012`)** (`÷` is U+00F7, `≈` is U+2248):
```html
<strong>Occupancy</strong> — the average % of your rooms filled over the last 12 months.<br>Room-nights sold ÷ room-nights available.<span class='tip-eg'>e.g. 27,000 sold out of 32,000 available ≈ 84%. Enter just the number.</span>
```

### B.3.2 Field — ADR (TTM)

```html
            <div class="field"><label>ADR (TTM)<button type="button" class="calc-info" aria-label="What's this?" data-tip="…">i</button></label><div class="input-adorn cur"><input type="text" id="cAdr" value="198" inputmode="decimal" autocomplete="off" data-fmt="money"></div></div>
```
> `index.html:1013`

| Property | Value |
|---|---|
| `id` | `cAdr` |
| Label | `ADR (TTM)` |
| Default value | `198` |
| `inputmode` | `decimal` |
| `data-fmt` | `money` → dec 2, no max |
| Adornment | `$` prefix inside the box |
| Placeholder | none |
| Required | no (auto-filled from tier if empty) |
| Validation | `validate(3)`: `if (!adr)` → set to `groupInt(String(typicalFor().adr))`, `usedDefaults = true` |
| Live effect | `input` → `updateRevparLive()` |

**FULL popover copy (`index.html:1013`):**
```html
<strong>ADR — Average Daily Rate</strong> — your average room revenue per <em>sold</em> room, before taxes.<br>Total room revenue ÷ rooms sold.<span class='tip-eg'>e.g. enter 198 for $198. (Occupancy × ADR = RevPAR.)</span>
```

### B.3.3 Live RevPAR preview

```html
          <div class="calc-revpar-live" id="cRevparLive"></div>
```
> `index.html:1015`

**Rendered HTML when `occ > 0 && adr > 0`** (from `index.html:1651` — note **two spaces** before `<span>`):
```html
RevPAR ≈ <strong>${Math.round(adr * occ)}</strong>  <span>(ADR × occupancy — the number buyers anchor on)</span>
```
Empty string otherwise. Styling (`index.html:483-484`): mono, 13px, gold, `min-height: 16px`; the inner `<span>` is sans, 11px, `--meta`.

**With the seeded defaults (74%, $198): `RevPAR ≈ $147`** — `198 × 0.74 = 146.52 → Math.round → 147`.

Recomputed on: every `input` event on `#cOcc` or `#cAdr` (`index.html:1654`), the autofill click (the handler calls it explicitly, `index.html:1664`), and once on IIFE init (`index.html:1685`). It is **not** recomputed by `validate(3)`'s empty-field backfill — but that path is immediately followed by `show(3)`, so the stale step-2 line is never seen.

### B.3.4 Typical-figures autofill

```html
          <button type="button" class="calc-autofill" id="cAutofill">I'm not sure of my exact numbers — use typical figures</button>
          <div class="calc-autofill-note" id="cAutofillNote"></div>
```
> `index.html:1016-1017`

| | Verbatim |
|---|---|
| Button copy | `I'm not sure of my exact numbers — use typical figures` |
| Note after click | `Filled with typical figures for your market tier — adjust if you know your own.` |

Rendered as an underlined text link (`index.html:485-487`): `background: none; border: none;` `text-decoration: underline; text-underline-offset: 3px;`, hover → gold. Note slot reserves `min-height: 14px`.

**What it fills, by the currently selected `#cTier`:**

| Tier | `#cOcc` gets | `#cAdr` gets |
|---|---|---|
| Gateway / urban core | `74` | `245` |
| Strong secondary / resort destination | `70` | `165` |
| Standard / suburban | `66` | `125` |
| Tertiary / rural / highway | `58` | `95` |

### B.3.5 Step 2 footer

```html
          <div class="calc-error" id="err2"></div>
          <div class="calc-nav">
            <button type="button" class="calc-btn back" data-go="1">Back</button>
            <button type="button" class="calc-btn next" data-go="3">Calculate</button>
          </div>
```
> `index.html:1018-1022`

| Element | Copy | `data-go` |
|---|---|---|
| Back button | `Back` | `1` |
| Next button | `Calculate` | `3` |

`#err2` is never populated (see §A.9).

---

## B.4 STEP 3 — RESULTS

```html
        <!-- Step 3 -->
        <div class="calc-step" data-step="3">
```
> `index.html:1025-1026`

Step 3 has **no `calc-step-head`** — it opens straight into the result display.

### B.4.1 Value-range display

```html
          <div class="result-display">
            <div class="result-label">Here's where the market would likely start</div>
            <div class="result-figure" id="resRange">—</div>
            <div class="result-honest" id="resHonest"></div>
            <div class="result-context" id="resContext"></div>
          </div>
```
> `index.html:1027-1032`

| Slot | Initial markup | Filled by | Content |
|---|---|---|---|
| `.result-label` | `Here's where the market would likely start` | static | — |
| `#resRange` | `—` (em dash U+2014) | `.textContent` at `:1558` | `roundTotal(totalLow) + " – " + roundTotal(totalHigh)` |
| `#resHonest` | empty | `.textContent` at `:1565-1566` | disclaimer, §B.5 |
| `#resContext` | empty | `.innerHTML` at `:1567-1570` | BOV sentence + up to two conditional `<em>` caveats |

Styling: `.result-figure` is serif italic gold, `44px` desktop / `36px` ≤ tablet / `30px` ≤ small phone (`index.html:530, 789, 802`); the block is centre-aligned (`index.html:528`).

**`#resContext` composition (byte-exact concatenation, `index.html:1567-1570`):**

Base (always):
```
A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below.
```
`+` if `usedDefaults` (leading space is part of the string):
```
 <em>This range uses typical figures for your market tier; your real numbers will sharpen it.</em>
```
`+` if `usedNoiOverride` (leading space is part of the string):
```
 <em>Using your actual NOI — the most accurate input you can give us.</em>
```
Both can appear together, in that order.

### B.4.2 "How we got there" chips

```html
          <!-- Band 1: How we got there (metric chips) -->
          <div class="result-band">
            <div class="result-band-label">How we got there</div>
            <div class="metric-chips">
              <div class="metric-chip"><span class="metric-val" id="resRevpar">—</span><span class="metric-key">RevPAR</span><span class="metric-gloss">revenue per available room — what buyers anchor on</span></div>
              <div class="metric-chip"><span class="metric-val" id="resNoi">—</span><span class="metric-key">NOI / key / yr</span><span class="metric-gloss">income left after operating costs</span></div>
              <div class="metric-chip"><span class="metric-val" id="resPerKey">—</span><span class="metric-key">Value / key</span><span class="metric-gloss">per-room value range</span></div>
              <div class="metric-chip"><span class="metric-val" id="resCap">—</span><span class="metric-key">Cap rate</span><span class="metric-gloss">the going price of income (lower = higher value)</span></div>
            </div>
          </div>
```
> `index.html:1034-1043`

**Four chips, fixed order — band label `How we got there`:**

| # | `id` | `metric-key` | `metric-gloss` (verbatim) | Value format | Source line |
|---|---|---|---|---|---|
| 1 | `resRevpar` | `RevPAR` | `revenue per available room — what buyers anchor on` | `"$" + Math.round(revpar)` | `:1559` |
| 2 | `resNoi` | `NOI / key / yr` | `income left after operating costs` | `"$" + groupInt(String(Math.round(noiPerKey)))`, plus `"*"` iff NOI override | `:1560` |
| 3 | `resPerKey` | `Value / key` | `per-room value range` | `roundKey(vLow) + " – " + roundKey(vHigh)` | `:1561` |
| 4 | `resCap` | `Cap rate` | `the going price of income (lower = higher value)` | `(capLow*100).toFixed(1) + "% – " + (capHigh*100).toFixed(1) + "%"` | `:1562` |

Each initial value is `—` (em dash). Grid: `1fr 1fr` desktop and tablet, single column at the smallest breakpoint (`index.html:493, 785, 801`).

**There is no on-page legend for the `*` on `#resNoi`** — the only explanation is the `<em>Using your actual NOI…</em>` sentence in `#resContext`. Flag for the Hokuten copy pass.

### B.4.3 Benchmark bars

```html
          <!-- Band 2: Where you sit (benchmark bars) -->
          <div class="result-band">
            <div class="result-band-label">Where you sit <span class="result-band-sub">— broad national reference for this type, not your local comp set</span></div>
            <div id="resBars"></div>
          </div>
```
> `index.html:1045-1049`

| | Verbatim |
|---|---|
| Band label | `Where you sit ` |
| Band sub (styled `.result-band-sub`) | `— broad national reference for this type, not your local comp set` |

`#resBars.innerHTML` is replaced wholesale on each `calculate()` with exactly two `bar(...)` strings — see §A.8 for the markup and the position formula.

### B.4.4 Insights

```html
          <!-- Band 3: What this means for you (insights / advice) -->
          <div class="result-band">
            <div class="result-band-label">What this means for you</div>
            <div id="resAdvice"></div>
          </div>
```
> `index.html:1051-1055`

**Rendering contract (`index.html:1581-1596`):**

1. Filter all 9 `ADVICE` rules by `test(ctx)` — exceptions are swallowed and treated as `false`.
2. Stable-sort ascending by `prio` (1 → 4). Ties keep **declaration order** (`pip` before `ground`; `revparTop` before `revparLow`; `pricingPower` before `valueAdd` before `independent`; `smallKeys` before `bigKeys`).
3. `firedCodes` = **all** matching codes, in sorted order — used for the CTA line and for the lead payload.
4. `top = fired.slice(0, 2)` — **at most 2 advice paragraphs render**, never more.
5. If nothing fired, `top` becomes a single anonymous fallback object (§A.6.1).
6. Each renders as `<p class="result-advice">{html}</p>`, joined with no separator.
7. Exactly one `<p class="result-cta-line">{ctaLine}</p>` is appended last.

So `#resAdvice` always contains **1 or 2 `.result-advice` paragraphs + exactly 1 `.result-cta-line`**.

Styling (`index.html:507-509`): `.result-advice` is serif italic `14.5px` (`13.5px` on mobile), `--ink-muted`; `strong` inside it flips to non-italic gold. `.result-cta-line` is sans `12px`, `--ink`.

### B.4.5 "What happens next" band

```html
          <!-- Band 4: What happens next -->
          <div class="result-band result-callinfo">
            <div class="result-band-label">What happens next</div>
            <p class="callinfo-intro">A written BOV, fully confidential, no obligation. Here's what it covers:</p>
            <ul class="callinfo-list">
              <li>We pressure-test this estimate against your real numbers and a true comp set, then tell you straight if the range should be higher or lower.</li>
              <li>We walk through your specific value levers: rate, occupancy, brand, capital needs, and timing.</li>
              <li>You get a clearer number and a read on the market, whether you sell this year, in five, or never.</li>
              <li>No listing agreement, no pressure to sell. If now isn't the time, we'll tell you that too.</li>
            </ul>
          </div>
```
> `index.html:1057-1067`

Fully static — no JS touches it. Already team-first "we" — **ports unchanged**. List markers are a CSS `content: "—"` in gold (`index.html:514`).

### B.4.6 Primary CTA

```html
          <a href="#bov" class="btn-primary" style="display:block; width:100%; text-align:center; margin: 4px 0 10px; box-sizing:border-box;">Request a written BOV</a>
```
> `index.html:1069`

An anchor to the on-page BOV form — no JS, no prefill of the BOV form from the estimate (the estimate only reaches the inbox via the separate email-capture path, §B.4.7).

### B.4.7 Email-capture form

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
```
> `index.html:1071-1079`

| Property | Value |
|---|---|
| Label (`for="calcEmail"`) | `Email me this estimate + the comp set we'd use` |
| Input `id` | `calcEmail`, `type="email"` |
| Placeholder | `you@company.com` |
| `autocomplete` | `email` |
| `inputmode` | `email` |
| Default | empty |
| Required | no (the field is optional; validation runs only on submit click) |
| Button `id` / copy | `calcEmailSend` / `Send it` |
| Status `id` | `calcEmailStatus`, `role="status"`, `aria-live="polite"` |
| **Not** a `<form>` | it's a `<div>`; the button is `type="button"` and the request is a manual `fetch` |

**All status copy, byte-exact** (`index.html:1963-2023`):

| Trigger | Class | Copy |
|---|---|---|
| Invalid email (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) | `calc-emailcap-status err` | `Please enter a valid email.` |
| Missing/placeholder access key | `calc-emailcap-status err` | `Email isn't connected yet — please send your details to dino.monteverde@kw.com.` **[VOICE]** |
| In flight | `calc-emailcap-status` | `Sending…` (ellipsis U+2026) |
| Success | `calc-emailcap-status ok` | `Done — Dino will send your estimate and comp set shortly.` **[VOICE]** |
| API returned `success: false` | `calc-emailcap-status err` | `Couldn't send — please email dino.monteverde@kw.com.` **[VOICE]** |
| Network throw | `calc-emailcap-status err` | `Network error — please email dino.monteverde@kw.com.` **[VOICE]** |

On the invalid-email branch the handler also calls `input.focus()` and returns without disabling the button (`index.html:1968`). On success the input is `disabled` and the button label becomes `Sent` (`index.html:2012`). On either failure the button re-enables. Status colours: `ok` → `#4a7c3f`, `err` → `#9a3a2a` (`index.html:469-470`). The generic invalid-field style is shared with the BOV form — the source rule is `.bov-form input.invalid, .calc-emailcap input.invalid { border-color: #c0392b !important; box-shadow: 0 0 0 2px rgba(192,57,43,0.12); }` (`index.html:630`) — but nothing in the calculator ever adds `.invalid`; that class is driven by the BOV form only.

**Lead payload sent to Web3Forms (`index.html:1980-2000`) — verbatim keys:**

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
```
> `index.html:1980-2000`

Endpoint: `https://api.web3forms.com/submit`, `POST`, `Content-Type: application/json`, `Accept: application/json` (`index.html:2002-2006`). **Note the payload omits `#cGround`, `#cFb` and `#cNoi`** — ground lease, F&B share, and the NOI override never reach the inbox even though they moved the number. Flag as a P2 for the Hokuten lead schema.

### B.4.8 Calendly CTA + step-3 footer

```html
          <button type="button" id="calcBook" class="result-altcta" style="display:block; width:100%; text-align:center; margin-bottom: 12px; background:none; border:none; cursor:pointer;">Prefer a call? Book 15 minutes →</button>
          <div class="calc-nav"><button type="button" class="calc-btn back" data-go="1">Start over</button></div>
```
> `index.html:1080-1081`

| Element | Copy | Note |
|---|---|---|
| Calendly button | `Prefer a call? Book 15 minutes →` | `→` is U+2192 |
| Back button | `Start over` | `data-go="1"` — **navigates only; resets nothing** |

**Calendly prefill (`index.html:1913-1932`), verbatim:**

```js
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
```
> `index.html:1913-1932`

**How the button is wired (verbatim) — the doc must not lose this, it is the only binding:**
```js
    var bookBtn = document.getElementById("calcBook");
    if (bookBtn) bookBtn.addEventListener("click", openCalendly);
```
> `index.html:1934-1935`

**Exactly what is prefilled** — a single Calendly custom answer `a1`, built as:
```
Self-estimated {range} ({summary}) · RevPAR {revpar} · NOI {noiPerKey} · cap {capRangeUsed} · {topAdvice}
```
Each ` · ` segment is omitted when its source value is falsy. Separator is space + U+00B7 + space.

**Worked example from the seeded defaults (golden case G1 — no ADVICE rule fires, so `topAdvice` is the fallback paragraph):**
```
Self-estimated $22,550,000 – $26,150,000 (Full-Service · 88 keys) · RevPAR $147 · NOI $23,037/key · cap 7.8%–9.0% · Your numbers land in a healthy, sellable range for this asset type — no single red flag, no obvious gap. Hotels like this reward a disciplin
```
`topAdvice` is tag-stripped (`/<[^>]*>/g`) then hard-`slice(0, 140)`'d. Verified: the fallback text truncates mid-word at exactly 140 chars, ending `...reward a disciplin`. **No ellipsis is appended.** Flag as P3 for the Hokuten copy pass (truncate on a word boundary and append `…`).

**Booking confirmation listener (`index.html:1941-1946`) — writes into the BOV form's status element, not the calculator's:**
```js
    window.addEventListener("message", function(e){
      if (e.origin === "https://calendly.com" && e.data && e.data.event === "calendly.event_scheduled"){
        var s = document.getElementById("bovStatus");
        if (s){ s.className = "bov-status ok"; s.textContent = "Your consultation is booked — see your email for the calendar invite."; }
      }
    });
```

Calendly assets are loaded from a CDN in `<head>` (`index.html:806-809`):
```html
<!-- Calendly embed assets (client-side only; no API key). Powers the
     "Book a free consultation" popup on the calculator result + BOV section. -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```
**Port note:** a third-party CDN script/stylesheet is a perf-gate and CSP consideration for the Hokuten build.

---

## B.5 The calculator disclaimer — byte-exact, both occurrences

**1 — Static methodology note in the left intro column (`index.html:919-921`), one continuous string:**
```
Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value. A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation. Request a written BOV below.
```

**2 — `#resHonest`, set by `calculate()` (`index.html:1565-1566`):**
```
Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.
```

**3 — `#resContext` base sentence (`index.html:1568`):**
```
A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below.
```

**Do not normalise these three.** Occurrence 1 splits the second half with `. Request` (capital R, full stop); occurrence 3 joins it with ` — request` (em dash, lowercase r). Both spellings ship. All dashes are em dash U+2014.

Conditional caveats (verbatim, including the leading space, `index.html:1569-1570`):
```
 <em>This range uses typical figures for your market tier; your real numbers will sharpen it.</em>
```
```
 <em>Using your actual NOI — the most accurate input you can give us.</em>
```

**Evidence gate:** "verified comps backed by CoStar and RCA" is a capability claim about the brokerage. It needs a `verified-current` row in the design skill's claims register (reference 06) before it ships on a Hokuten page.

---

## B.6 Intro-column copy, byte-exact

| Element | Verbatim |
|---|---|
| Eyebrow | `Valuation Calculator` |
| H2 | `What's your hotel ` + `<span class="accent">worth</span>` + `?` |
| Sub | `Get a confidential range from comp data in under 60 seconds. No email required to see the result.` |

**Evidence gate flag:** "from comp data" is a claim the math does not support — the model is explicitly generalized assumptions ("*All bands are GENERALIZED industry assumptions … NOT transaction-derived*", `index.html:1352-1353`). Port verbatim, then raise a copy correction before the Hokuten page ships.

---

## B.7 Occupancy clamping — the complete picture

Three independent mechanisms; all three must be ported:

| Layer | Where | Behaviour |
|---|---|---|
| 1. Live input cap | `formatField` + `fmtMap.pct.max = 100` (`index.html:1440, 1451`) | any keystroke pushing `#cOcc` above `100` rewrites the field to `100` immediately. Same for `#cFb`. |
| 2. Advance-time clamp | `validate(3)` (`index.html:1632`) | `if (occ > 100){ occEl.value = "100"; occ = 100; }` |
| 3. Zero backfill | `validate(3)` (`index.html:1631, 1633`) | empty occupancy or ADR is replaced by the tier's `TYPICAL` value and `usedDefaults` is latched `true` |

`calculate()` itself does **no** clamping: `occ = num(#cOcc) / 100` straight through. If the port ever renders a controlled input without layer 1, layer 2 is the only guard — keep it.

---

# §C — TYPESCRIPT PORT CONTRACT

## C.1 Frozen config types

```ts
export type PropertyTypeKey =
  | "limitedService" | "selectService" | "fullService" | "resortBoutique" | "extendedStay";

export type MarketTierKey = "gateway" | "secondary" | "suburban" | "tertiary";
export type ConditionKey  = "under4" | "base4to8" | "over8";
export type LandKey       = "feeSimple" | "groundLease";
export type BrandKey      = "branded" | "independent";

/** [low, high] as decimals, e.g. [0.0800, 0.0925] === 8.00%–9.25% */
export type CapBand = readonly [low: number, high: number];
/** [low, mid, high] display bands. mid is used only by the pricingPower rule. */
export type Benchmark = readonly [low: number, mid: number, high: number];

export interface CalculatorConfig {
  readonly capRates:      Readonly<Record<PropertyTypeKey, Readonly<Record<MarketTierKey, CapBand>>>>;
  readonly noiMargin:     Readonly<Record<PropertyTypeKey, number>>;
  readonly roomsToTotal:  Readonly<Record<PropertyTypeKey, number>>;
  readonly renovationAdj: Readonly<Record<ConditionKey, number>>;
  readonly landAdj:       Readonly<Record<LandKey, number>>;
  readonly brandAdj:      Readonly<Record<BrandKey, number>>;
  readonly fbThreshold:   number;   // 0.25
  readonly fbHighAdj:     number;   // 0.0025
}

/** Hard-coded in calculate(); lifted here so tests can reference them by name. */
export const CAP_FLOOR = 0.045 as const;
export const MIN_CAP_SPREAD = 0.005 as const;
export const TOTAL_ROUND_INCREMENT = 50_000 as const;
export const PER_KEY_ROUND_INCREMENT = 1_000 as const;
export const PER_KEY_DISPLAY_INCREMENT = 5_000 as const;
export const DAYS_PER_YEAR = 365 as const;

export interface TypicalFigures { readonly occupancy: number; readonly adr: number; }
export type TypicalTable = Readonly<Record<MarketTierKey, TypicalFigures>>;
```

`CONFIG` and `TYPICAL` must be `Object.freeze`d (or `as const`) and live in **one** module. No other module may hold a cap-rate literal.

## C.2 Pure `calculate()` — input and output types

```ts
export interface ValuationInput {
  /** CONFIG key, resolved from the UI select before entering this function. */
  propertyType: PropertyTypeKey;
  /** Rentable rooms. Must be >= 1 — the caller enforces this (validate step 2). */
  keys: number;
  /** Occupancy as a PERCENT number, 0–100 (e.g. 74, not 0.74). */
  occupancyPct: number;
  /** Average Daily Rate in dollars. */
  adr: number;
  tier: MarketTierKey;
  brand: BrandKey;
  condition: ConditionKey;
  /** true when the land is ground-leased. */
  groundLease: boolean;
  /** F&B share as a PERCENT number, 0–100. 0 / undefined = not supplied. */
  fbPct?: number;
  /** Annual NOI in dollars. Any value > 0 REPLACES the revenue model. 0 / undefined = derive. */
  noiOverride?: number;
  /** Free text; only a /\d{5}/ match is ever used, and only for the lead summary. */
  marketZipRaw?: string;
  /** Latched true once typical figures were auto-filled. Drives one caveat sentence. */
  usedDefaults?: boolean;
}

export interface ValuationResult {
  // --- derived economics ---
  revpar: number;              // adr * occupancyPct/100
  roomRevenue: number | null;  // null when the NOI override path is taken
  totalRevenue: number | null; // null when the NOI override path is taken
  noi: number;
  noiPerKey: number;           // 0 when keys <= 0
  usedNoiOverride: boolean;

  // --- cap band ---
  baseCapBand: CapBand;        // before adjusters
  capAdj: number;              // total additive adjustment (can be negative)
  capLow: number;              // post-adjuster, post-floor
  capHigh: number;             // post-adjuster, post-min-spread
  capFloorFired: boolean;      // capLow was raised to CAP_FLOOR
  capSpreadFired: boolean;     // capHigh was raised to capLow + MIN_CAP_SPREAD

  // --- value ---
  valueLow: number;            // unrounded: noi / capHigh
  valueHigh: number;           // unrounded: noi / capLow
  totalLow: number;            // roundTo(valueLow, 50_000)
  totalHigh: number;           // roundTo(valueHigh, 50_000)
  perKeyLow: number;           // round((valueLow / keys) / 1000) * 1000
  perKeyHigh: number;          // round((valueHigh / keys) / 1000) * 1000

  // --- benchmarks ---
  occBandPct: number;          // 0..100, pre-toFixed(0)
  revparBandPct: number;       // 0..100, pre-toFixed(0)
  occBand: Benchmark;
  revparBand: Benchmark;
  adrBand: Benchmark;

  // --- insights ---
  firedCodes: AdviceCode[];    // ALL matches, prio-sorted, declaration-order tie-break
  topAdvice: AdviceEntry[];    // firedCodes.slice(0,2) resolved, or [FALLBACK] when empty
  ctaVariant: "valueAdd" | "runningWell" | "default";

  // --- formatted display strings (must match the source byte for byte) ---
  display: {
    range: string;        // "$22.6M – $26.2M"          → #resRange
    revpar: string;       // "$147"                      → #resRevpar
    noiPerKey: string;    // "$23,037" or "$28,409*"      → #resNoi
    perKey: string;       // "$255K – $295K"             → #resPerKey
    capRange: string;     // "7.8% – 9.0%"               → #resCap
  };

  // --- lead / scheduling prefill (was window.__kwcEstimate) ---
  prefill: {
    range: string;         // "$22,550,000 – $26,150,000"
    summary: string;       // "Full-Service · 88 keys" [+ " · 90210"]
    revpar: string;        // "$147"
    noiPerKey: string;     // "$23,037/key"
    capRangeUsed: string;  // "7.8%–9.0%"   ← NO spaces around the en dash
    marketTier: string;    // raw UI display string
    condition: string;     // raw UI display string
    brandFlag: string;     // raw UI display string
    topAdvice: string;     // tag-stripped, sliced to 140 chars
    insightCodes: AdviceCode[];
  };
}

export type AdviceCode =
  | "pip" | "ground" | "revparTop" | "revparLow"
  | "pricingPower" | "valueAdd" | "independent" | "smallKeys" | "bigKeys";

export interface AdviceEntry {
  code?: AdviceCode;          // absent on the fallback entry
  prio?: 1 | 2 | 3 | 4;       // absent on the fallback entry
  html: string;               // may contain <strong> / <em>
}

export interface AdviceContext {
  type: PropertyTypeKey;
  keys: number;
  occ: number;                // decimal fraction — carried by the source ctx, read by no rule
  occPct: number;             // percent number
  adr: number;
  revpar: number;
  tier: MarketTierKey;        // carried by the source ctx, read by no rule
  brand: "branded" | "indep"; // NOTE: ctx uses "indep", NOT the BrandKey "independent"
  cond: "new" | "base" | "old";
  ground: boolean;
  ob: Benchmark;              // OCC_BAND
  ab: Benchmark;              // ADR_BAND
  rb: Benchmark;              // REVPAR_BAND
}

export declare function calculate(input: ValuationInput, config?: CalculatorConfig): ValuationResult;
```

**Purity requirement:** no DOM reads, no globals, no `window`. The React layer maps form state → `ValuationInput`, calls `calculate`, and renders `ValuationResult`. This is what makes §C.7 testable.

## C.3 Algorithm, restated unambiguously

```
1.  occ      = occupancyPct / 100
2.  revpar   = adr * occ
3.  if noiOverride > 0:
        noi = noiOverride ; usedNoiOverride = true
    else:
        roomRevenue  = keys * adr * 365 * occ
        totalRevenue = roomRevenue / roomsToTotal[propertyType]
        noi          = totalRevenue * noiMargin[propertyType]
4.  noiPerKey = keys > 0 ? noi / keys : 0
5.  [capLow, capHigh] = capRates[propertyType][tier]
6.  adj = renovationAdj[condition]
        + landAdj[groundLease ? "groundLease" : "feeSimple"]
        + brandAdj[brand]
        + ((fbPct/100 > 0 && fbPct/100 > 0.25) ? 0.0025 : 0)
7.  capLow += adj ; capHigh += adj
8.  capLow  = max(capLow, 0.045)
9.  capHigh = max(capHigh, capLow + 0.005)
10. valueHigh = noi / capLow      ← LOW cap gives the HIGH value
    valueLow  = noi / capHigh
11. totalHigh = round(valueHigh / 50000) * 50000
    totalLow  = round(valueLow  / 50000) * 50000
12. perKeyHigh = round((valueHigh / keys) / 1000) * 1000
    perKeyLow  = round((valueLow  / keys) / 1000) * 1000
```

Steps 8 and 9 apply in that order — the min-spread rule uses the **post-floor** `capLow`.

Rounding is JavaScript `Math.round` semantics: **half rounds toward +∞** (`Math.round(-0.5) === -0` and `Math.round(2.5) === 3`). All values here are positive, so "half up" is exact. A port to a language with banker's rounding must replicate half-up explicitly.

## C.4 Display formatter contract

```ts
function groupInt(intStr: string): string;   // "22550000" -> "22,550,000"
function roundTo(v: number, inc: number): number;                 // Math.round(v/inc)*inc

function roundTotal(v: number): string {
  // v >= 1e6 : "$" + (Math.round(v/1e5)/10).toFixed(1) + "M"
  // else     : "$" + (Math.round(v/5000)*5) + "K"
}
function roundKey(v: number): string {        // "$" + Math.round(v/5000)*5 + "K"
}
function dollarsFull(v: number): string {     // "$" + groupInt(String(Math.round(v)))
}
function pctBar(val: number, band: Benchmark): number {
  // clamp((val - band[0]) / (band[2] - band[0]), 0, 1) * 100
}
```

Composed display strings (separators are load-bearing):

| Field | Expression | Separator |
|---|---|---|
| `display.range` | `roundTotal(totalLow) + " – " + roundTotal(totalHigh)` | `space + U+2013 + space` |
| `display.perKey` | `roundKey(perKeyLow) + " – " + roundKey(perKeyHigh)` | `space + U+2013 + space` |
| `display.capRange` | `(capLow*100).toFixed(1) + "% – " + (capHigh*100).toFixed(1) + "%"` | `space + U+2013 + space` |
| `display.revpar` | `"$" + Math.round(revpar)` | — |
| `display.noiPerKey` | `"$" + groupInt(String(Math.round(noiPerKey))) + (usedNoiOverride ? "*" : "")` | — |
| `prefill.range` | `dollarsFull(totalLow) + " – " + dollarsFull(totalHigh)` | `space + U+2013 + space` |
| `prefill.capRangeUsed` | `(capLow*100).toFixed(1) + "%–" + (capHigh*100).toFixed(1) + "%"` | **`U+2013` with NO spaces** |
| `prefill.noiPerKey` | `"$" + groupInt(String(Math.round(noiPerKey))) + "/key"` | — |
| `prefill.summary` | `type + " · " + Math.round(keys) + " keys"` `+ (zip ? " · " + zip : "")` | `space + U+00B7 + space` |
| bar sub (occ) | `ob[0] + "–" + ob[2] + "% typical"` | **`U+2013` with NO spaces** |
| bar sub (revpar) | `"$" + rb[0] + "–$" + rb[2] + " typical"` | **`U+2013` with NO spaces** |

## C.5 Floating-point notes the tests must accommodate

`capLow`/`capHigh` are computed by float addition, so exact equality assertions are unsafe. Two observed cases:

- `0.08 + 0.0225 === 0.10250000000000001` → `(x*100).toFixed(1) === "10.3"` ✔
- `0.0925 + 0.0225 === 0.11499999999999999` (**not** `0.115`) → `"11.5"` ✔
- `0.075 - 0.0025 === 0.0725` (exact) but `0.0725 * 100 === 7.249999999999999` → `"7.2"`, **not** `"7.3"` ✔
- `0.0925 + 0.0075 === 0.1` (exact) → `"10.0"` ✔
- `0.0825 + 0.0075 === 0.09` (exact) → `"9.0"` ✔
- `0.0825 - 0.005 === 0.07500000000000001` → `"7.5"` ✔ (G9's `capLow`)

**Test rule:** assert cap rates against the **formatted string** (`"10.3%"`) or with `toBeCloseTo(x, 6)`. Never `toBe(0.1025)`.

## C.6 Proof: the cap floor and min-spread rules are unreachable

Exhaustive enumeration over all 20 cap bands × all **24** adjuster combinations (`renovationAdj` 3 × `landAdj` 2 × `brandAdj` 2 × F&B 2 = 24) — **480 band/adjuster pairs**:

```
min pre-floor capLow  = 0.052500   at resortBoutique.gateway with adj = -0.0075   → floor 0.045 fires: false
min band spread       = 0.012500                                                  → spread rule (needs < 0.005) fires: false
min pre-clamp capHigh = 0.067500
```

- **Floor:** the lowest base low is `resortBoutique.gateway = 0.0600`; the most negative reachable `adj` is `−0.0050 (under4) + 0.0000 (feeSimple) + −0.0025 (branded) + 0 (no F&B) = −0.0075`. Minimum `capLow = 0.0525 > 0.045`. **The `Math.max(capLow, 0.045)` line can never change a value with the shipped CONFIG.**
- **Min spread:** `adj` is added to *both* ends, so `capHigh − capLow ≡ band[1] − band[0]` for every input. The narrowest shipped band spread is `0.0125`, which is `> 0.005`. **The `Math.max(capHigh, capLow + 0.005)` line can never change a value either.**

**Both lines must still be ported** (they are the guardrail if `CONFIG` is ever retuned) and must be **unit-tested directly on the clamp function**, not through `calculate()` — see G23/G24.

## C.7 GOLDEN TEST CASES (25, hand-traced)

Case inventory (25 entries): G1–G10, G10b, G11–G22 (23 traced through `calculate()`), plus G23–G24 (2 synthetic unit tests on the clamp function).

Shared defaults unless a row overrides: `tier = Standard / suburban`, `brand = Branded (franchise)`, `condition = 4–8 yrs (baseline)`, `land = Fee Simple (own the land)`, no F&B, no NOI override, `usedDefaults = false`.

Every number below was produced by tracing `index.html:1502-1612` line by line. Arithmetic is shown so a test-writer can verify independently.

---

### G1 — Seeded defaults / the on-load prime (Full-Service, suburban)
`Full-Service, 88 keys, 74% occ, $198 ADR`

```
revpar        = 198 × 0.74                         = 146.52
roomRevenue   = 88 × 198 × 365 × 0.74              = 4,706,222.4
                (88×198 = 17,424 ; ×365 = 6,359,760 ; ×0.74 = 4,706,222.4)
totalRevenue  = 4,706,222.4 / 0.65                 = 7,240,342.153846154
noi           = 7,240,342.153846154 × 0.28         = 2,027,295.803076923
noiPerKey     = 2,027,295.803076923 / 88           = 23,037.45230769231
band          = capRates.fullService.suburban      = [0.0800, 0.0925]
adj           = 0 + 0 + (−0.0025) + 0              = −0.0025
capLow/High   = 0.0775 / 0.0900     (floor n/a, spread n/a)
valueHigh     = 2,027,295.803076923 / 0.0775       = 26,158,655.52357320
valueLow      = 2,027,295.803076923 / 0.0900       = 22,525,508.92307692
totalHigh     = round(26,158,655.52/50,000)=523    → 26,150,000
totalLow      = round(22,525,508.92/50,000)=451    → 22,550,000  (450.51 → 451)
perKeyHigh    = round(297,257.45/1,000)=297        → 297,000
perKeyLow     = round(255,971.69/1,000)=256        → 256,000
occ bar       = (74−60)/(78−60) = 0.7778           → 78
revpar bar    = (146.52−105)/(275−105) = 0.2442    → 24
```
| Output | Expected |
|---|---|
| `display.range` | `$22.6M – $26.2M` (`225.5 → 226 → 22.6` / `261.5 → 262 → 26.2`) |
| `display.revpar` | `$147` |
| `display.noiPerKey` | `$23,037` |
| `display.perKey` | `$255K – $295K` (`256,000/5,000=51.2→51×5=255`; `297,000/5,000=59.4→59×5=295`) |
| `display.capRange` | `7.8% – 9.0%` |
| `prefill.range` | `$22,550,000 – $26,150,000` |
| `firedCodes` | `[]` |
| Advice rendered | **fallback paragraph only** (§A.6.1) |
| `ctaVariant` | `default` |

---

### G2 — Limited-Service, **gateway** tier
`Limited-Service, 88 keys, 74% occ, $198 ADR, gateway`

```
roomRevenue  = 4,706,222.4  (same as G1)
totalRevenue = 4,706,222.4 / 0.95   = 4,953,918.315789474
noi          = × 0.38                = 1,882,488.96
noiPerKey    = / 88                  = 21,391.92
band = [0.0700, 0.0825] ; adj = −0.0025 → 0.0675 / 0.0800
valueHigh = 1,882,488.96 / 0.0675 = 27,888,725.33333333 → totalHigh 27,900,000 (557.77→558)
valueLow  = 1,882,488.96 / 0.0800 = 23,531,112          → totalLow  23,550,000 (470.62→471)
perKeyHigh = round(316,917.33/1,000)=317 → 317,000 ; perKeyLow = round(267,399/1,000)=267 → 267,000
```
| Output | Expected |
|---|---|
| `display.range` | `$23.6M – $27.9M` |
| `display.noiPerKey` | `$21,392` |
| `display.perKey` | `$265K – $315K` |
| `display.capRange` | `6.8% – 8.0%` (`6.75 → toFixed(1) → "6.8"`) |
| bars | occ `(74−58)/(78−58)=0.80` → `80`; revpar `146.52 ≥ 140` → clamped `100` |
| `firedCodes` | `["revparTop"]` (`146.52 ≥ REVPAR_BAND["Limited-Service"][2] = 140`) |
| `ctaVariant` | `runningWell` |

---

### G3 — Select-Service, **secondary** tier
`Select-Service, 120 keys, 70% occ, $165 ADR, secondary`

```
revpar = 165 × 0.70 = 115.5
roomRevenue  = 120 × 165 × 365 × 0.70 = 5,058,900
totalRevenue = / 0.88 = 5,748,750 ; noi = × 0.34 = 1,954,575 ; noiPerKey = /120 = 16,288.125
band = [0.0750, 0.0875] ; adj = −0.0025 → 0.0725 / 0.0850
valueHigh = 1,954,575 / 0.0725 = 26,959,655.17241379 → 26,950,000 (539.19→539)
valueLow  = 1,954,575 / 0.0850 = 22,995,000          → 23,000,000 (459.90→460)
perKeyHigh = round(224,663.79/1,000)=225 → 225,000 ; perKeyLow = round(191,625/1,000)=192 → 192,000
```
| Output | Expected |
|---|---|
| `display.range` | `$23.0M – $27.0M` |
| `display.noiPerKey` | `$16,288` |
| `display.perKey` | `$190K – $225K` (`192,000/5,000=38.4→38×5=190`) |
| `display.capRange` | **`7.2% – 8.5%`** ⚠ float trap — see note |
| `firedCodes` | `[]` → fallback advice, `ctaVariant = default` |

⚠ **Float trap (canonical case).** `0.075 − 0.0025` evaluates to exactly `0.0725`, but `0.0725 * 100 === 7.249999999999999` in IEEE-754 double, so `.toFixed(1)` yields **`"7.2"`, not `"7.3"`**. Decimal-exact arithmetic would print `7.3%`. **The source ships `7.2%` and the port must too** — a "mathematically correct" `7.3%` is a **regression**, not a fix. Assert the literal string `"7.2% – 8.5%"`. (Verify in a REPL: `(0.0725*100).toFixed(1)` → `"7.2"`.) Any cap band whose adjusted low lands on `0.0725` is affected — see also G6.

---

### G4 — Resort / Boutique, **tertiary** tier (small keys)
`Resort / Boutique, 45 keys, 58% occ, $95 ADR, tertiary`

```
revpar = 95 × 0.58 = 55.1
roomRevenue  = 45 × 95 × 365 × 0.58 = 905,017.5
totalRevenue = / 0.62 = 1,459,705.645161290 ; noi = × 0.30 = 437,911.6935483871
noiPerKey    = / 45 = 9,731.370967741935
band = [0.0875, 0.1050] ; adj = −0.0025 → 0.0850 / 0.1025
valueHigh = 437,911.69 / 0.0850  = 5,151,902.277039848 → 5,150,000 (103.04→103)
valueLow  = 437,911.69 / 0.1025  = 4,272,309.205350118 → 4,250,000 (85.45→85)
perKeyHigh = round(114,486.72/1,000)=114 → 114,000 ; perKeyLow = round(94,940.20/1,000)=95 → 95,000
```
| Output | Expected |
|---|---|
| `display.range` | `$4.3M – $5.2M` |
| `display.noiPerKey` | `$9,731` |
| `display.perKey` | `$95K – $115K` (`95,000/5,000=19→19×5=95`; `114,000/5,000=22.8→23×5=115`) |
| `display.capRange` | `8.5% – 10.3%` |
| bars | occ `(58−55)/(75−55)=0.15` → `15`; revpar `55.1 ≤ 120` → `0` |
| `firedCodes` | `["revparLow","smallKeys"]` (`55.1 ≤ 120` and `> 0`; `45 < 60`. `valueAdd` needs `58 ≤ 55` → false) |
| Advice rendered | both, in that order (prio 2 then prio 4) |
| `ctaVariant` | `valueAdd` |

---

### G5 — Extended-Stay, suburban, 150 keys
`Extended-Stay, 150 keys, 80% occ, $130 ADR`

```
revpar = 130 × 0.80 = 104
roomRevenue  = 150 × 130 × 365 × 0.80 = 5,694,000
totalRevenue = / 0.96 = 5,931,250 ; noi = × 0.40 = 2,372,500 ; noiPerKey = /150 = 15,816.66666666667
band = [0.0800, 0.0925] ; adj = −0.0025 → 0.0775 / 0.0900
valueHigh = 2,372,500 / 0.0775 = 30,612,903.22580645 → 30,600,000 (612.26→612)
valueLow  = 2,372,500 / 0.0900 = 26,361,111.11111111 → 26,350,000 (527.22→527)
perKeyHigh = round(204,086.02/1,000)=204 → 204,000 ; perKeyLow = round(175,740.74/1,000)=176 → 176,000
```
| Output | Expected |
|---|---|
| `display.range` | `$26.4M – $30.6M` |
| `display.noiPerKey` | `$15,817` |
| `display.perKey` | `$175K – $205K` |
| `display.capRange` | `7.8% – 9.0%` |
| bars | occ `(80−70)/(85−70)=0.667` → `67`; revpar `(104−80)/(175−80)=0.2526` → `25` |
| `firedCodes` | `["bigKeys"]` (`150 >= 150` — boundary). `pricingPower` needs `80 ≥ 85` → false |
| `ctaVariant` | `default` |

---

### G6 — Full-Service, gateway, institutional size
`Full-Service, 200 keys, 78% occ, $320 ADR, gateway`

```
revpar = 320 × 0.78 = 249.6
roomRevenue  = 200 × 320 × 365 × 0.78 = 18,220,800
totalRevenue = / 0.65 = 28,032,000 ; noi = × 0.28 = 7,848,960 ; noiPerKey = /200 = 39,244.8
band = [0.0625, 0.0750] ; adj = −0.0025 → 0.0600 / 0.0725
valueHigh = 7,848,960 / 0.0600 = 130,816,000            → 130,800,000 (2,616.32→2,616)
valueLow  = 7,848,960 / 0.0725 = 108,261,517.2413793    → 108,250,000 (2,165.23→2,165)
perKeyHigh = round(654,080/1,000)=654 → 654,000 ; perKeyLow = round(541,307.59/1,000)=541 → 541,000
```
| Output | Expected |
|---|---|
| `display.range` | `$108.3M – $130.8M` |
| `display.noiPerKey` | `$39,245` |
| `display.perKey` | `$540K – $655K` (`541,000/5,000=108.2→108×5=540`; `654,000/5,000=130.8→131×5=655`) |
| `display.capRange` | **`6.0% – 7.2%`** ⚠ same `0.0725 → "7.2"` float trap as G3 — assert the literal string |
| bars | occ `(78−60)/(78−60)=1.0` → `100`; revpar `(249.6−105)/(275−105)=0.8506` → `85` |
| `firedCodes` | `["bigKeys"]` |
| `ctaVariant` | `default` |

---

### G7 — **NOI override path** (same inputs as G1)
`Full-Service, 88 keys, 74% occ, $198 ADR, NOI = 2,500,000`

```
noi          = 2,500,000        (roomRevenue / totalRevenue NEVER computed → null)
usedNoiOverride = true
noiPerKey    = 2,500,000 / 88   = 28,409.09090909091
band/adj/caps identical to G1: 0.0775 / 0.0900
valueHigh = 2,500,000 / 0.0775 = 32,258,064.51612903 → 32,250,000 (645.16→645)
valueLow  = 2,500,000 / 0.0900 = 27,777,777.77777778 → 27,800,000 (555.56→556)
perKeyHigh = round(366,568.91/1,000)=367 → 367,000 ; perKeyLow = round(315,656.57/1,000)=316 → 316,000
```
| Output | Expected |
|---|---|
| `display.range` | `$27.8M – $32.3M` |
| `display.revpar` | `$147` — RevPAR is still computed from occ×ADR even on the override path |
| `display.noiPerKey` | `$28,409*` ← **trailing asterisk** |
| `display.perKey` | `$315K – $365K` |
| `display.capRange` | `7.8% – 9.0%` |
| `#resContext` | base sentence **+** ` <em>Using your actual NOI — the most accurate input you can give us.</em>` |
| `roomRevenue` / `totalRevenue` | `null` |
| `firedCodes` | `[]` → fallback, `default` |

---

### G8 — **Occupancy clamping** (input 150% → clamped to 100)
`Limited-Service, 88 keys, occupancy typed as 150 → clamped to 100, $198 ADR, suburban`

Two clamps must both be asserted:
- `formatField(el, {dec:1, max:100})` rewrites the field to `"100"` on the keystroke, **and**
- `validate(3)` re-clamps `occ > 100 → 100`.

```
after clamping: occPct = 100, occ = 1.0
revpar       = 198 × 1.0 = 198
roomRevenue  = 88 × 198 × 365 × 1.0 = 6,359,760
totalRevenue = / 0.95 = 6,694,484.210526316 ; noi = × 0.38 = 2,543,904 ; noiPerKey = /88 = 28,908
band = [0.0825, 0.0975] ; adj = −0.0025 → 0.0800 / 0.0950
valueHigh = 2,543,904 / 0.0800 = 31,798,800            → 31,800,000 (635.976→636)
valueLow  = 2,543,904 / 0.0950 = 26,777,936.84210526   → 26,800,000 (535.56→536)
perKeyHigh = round(361,350/1,000)=361 → 361,000 ; perKeyLow = round(304,294.74/1,000)=304 → 304,000
```
| Output | Expected |
|---|---|
| `display.range` | `$26.8M – $31.8M` |
| `display.revpar` | `$198` |
| `display.noiPerKey` | `$28,908` |
| `display.perKey` | `$305K – $360K` (`304,000/5,000=60.8→61×5=305`; `361,000/5,000=72.2→72×5=360`) |
| `display.capRange` | `8.0% – 9.5%` |
| occ bar | `(100−58)/(78−58) = 2.1` → **clamped to 1.0** → `100` |
| revpar bar | `198 ≥ 140` → `100` |
| `firedCodes` | `["revparTop"]`; `pricingPower` needs `adr ≤ 135` → `198 ≤ 135` false |
| `ctaVariant` | `runningWell` |

---

### Adjuster-isolation series (G9–G17)
**Two bases, not one.** G9–G14 (seven entries, counting G10b) share the Limited-Service base below, so the **only** delta inside that group is the adjuster. G15–G17 deliberately switch to a **Full-Service** base (`100 keys, 70% occ, $220 ADR, suburban` → `noi = 2,421,353.846153846`), because `fbHighAdj` is only reachable on a type whose F&B row is visible; that base is restated inline at G15.

**Common base for G9–G14 only — `Limited-Service, 100 keys, 70% occ, $150 ADR, suburban`:**
```
revpar       = 150 × 0.70 = 105
roomRevenue  = 100 × 150 × 365 × 0.70 = 3,832,500
totalRevenue = 3,832,500 / 0.95 = 4,034,210.526315789
noi          = × 0.38 = 1,533,000
noiPerKey    = / 100  = 15,330   → display.noiPerKey = "$15,330" in ALL of G9–G14
base band    = capRates.limitedService.suburban = [0.0825, 0.0975]
bars (same in all): occ (70−58)/(78−58) = 0.60 → 60 ; revpar (105−55)/(140−55) = 0.5882 → 59
```

#### G9 — `renovationAdj.under4` isolated (−50 bps)
Condition = `Renovated / built in last 3 yrs`, Brand = `Soft-brand / lifestyle` (→ `branded`, −25 bps).
```
adj = −0.0050 + 0 + (−0.0025) + 0 = −0.0075 → caps 0.0750 / 0.0900
       (capLow is float-dirty: 0.0825 − 0.0075 === 0.07500000000000001 → prints "7.5")
valueHigh = 1,533,000 / 0.0750 = 20,439,999.999999996    → 20,450,000 (408.7999…→409)
valueLow  = 1,533,000 / 0.0900 = 17,033,333.33333333     → 17,050,000 (340.67→341)
perKeyHigh = 204,400 → round(204.4)=204 → 204,000 ; perKeyLow = 170,333.33 → round(170.33)=170 → 170,000
```
| Output | Expected |
|---|---|
| `display.range` | `$17.1M – $20.5M` |
| `display.perKey` | `$170K – $205K` |
| `display.capRange` | `7.5% – 9.0%` |
| `firedCodes` | `[]` → fallback, `default` |

#### G10 — `renovationAdj.over8` isolated (+75 bps), via `15+ yrs / renovation (PIP) due`
```
adj = +0.0075 + 0 + (−0.0025) + 0 = +0.0050 → caps 0.0875 / 0.1025
valueHigh = 1,533,000 / 0.0875 = 17,520,000              → 17,500,000 (350.40→350)
valueLow  = 1,533,000 / 0.1025 = 14,956,097.56097561     → 14,950,000 (299.12→299)
perKeyHigh = 175,200 → 175,000 ; perKeyLow = 149,560.98 → round(149.56)=150 → 150,000
```
| Output | Expected |
|---|---|
| `display.range` | `$15.0M – $17.5M` |
| `display.perKey` | `$150K – $175K` |
| `display.capRange` | `8.8% – 10.3%` (`8.75 → "8.8"`) |
| `firedCodes` | `["pip"]` (`cond === "old"`) |
| `ctaVariant` | `default` — `pip` is **not** in the value-add trio |

#### G10b — same adjuster via the `9–15 yrs` label (regex-coverage case)
Condition = `9–15 yrs` (en dash). `/9.?15/` matches → `over8`. **All outputs identical to G10.** This case exists solely to lock `condKeyCfg`'s en-dash tolerance.

#### G11 — `landAdj.groundLease` isolated (+100 bps)
Land = `Ground lease`, Brand = `Soft-brand / lifestyle`.
```
adj = 0 + 0.0100 + (−0.0025) + 0 = +0.0075 → caps 0.0900 / 0.1050
valueHigh = 1,533,000 / 0.0900 = 17,033,333.33333333 → 17,050,000 (340.67→341)
valueLow  = 1,533,000 / 0.1050 = 14,599,999.999999998 → 14,600,000 (291.9999…→292)
perKeyHigh = 170,333.33 → 170,000 ; perKeyLow = 146,000 → 146,000
```
| Output | Expected |
|---|---|
| `display.range` | `$14.6M – $17.1M` |
| `display.perKey` | `$145K – $170K` (`146,000/5,000=29.2→29×5=145`) |
| `display.capRange` | `9.0% – 10.5%` |
| `firedCodes` | `["ground"]` |
| `ctaVariant` | `default` |

#### G12 — `brandAdj.independent` isolated (+25 bps)
Brand = `Independent / unbranded`.
```
adj = 0 + 0 + 0.0025 + 0 = +0.0025 → caps 0.0850 / 0.1000
valueHigh = 1,533,000 / 0.0850 = 18,035,294.11764706 → 18,050,000 (360.71→361)
valueLow  = 1,533,000 / 0.1000 = 15,330,000          → 15,350,000 (306.60→307)
perKeyHigh = 180,352.94 → 180,000 ; perKeyLow = 153,300 → 153,000
```
| Output | Expected |
|---|---|
| `display.range` | `$15.4M – $18.1M` |
| `display.perKey` | `$155K – $180K` (`153,000/5,000=30.6→31×5=155`) |
| `display.capRange` | `8.5% – 10.0%` |
| `firedCodes` | `["independent"]` |
| `ctaVariant` | `valueAdd` ← independent is in the trio |

#### G13 — `brandAdj.branded` isolated (−25 bps), the implicit baseline
Brand = `Branded (franchise)`.
```
adj = −0.0025 → caps 0.0800 / 0.0950
valueHigh = 1,533,000 / 0.0800 = 19,162,500          → 19,150,000 (383.25→383)
valueLow  = 1,533,000 / 0.0950 = 16,136,842.10526316 → 16,150,000 (322.74→323)
perKeyHigh = 191,625 → round(191.625)=192 → 192,000 ; perKeyLow = 161,368.42 → 161,000
```
| Output | Expected |
|---|---|
| `display.range` | `$16.2M – $19.2M` |
| `display.perKey` | `$160K – $190K` |
| `display.capRange` | `8.0% – 9.5%` |
| `firedCodes` | `[]` → fallback, `default` |

#### G14 — `Soft-brand / lifestyle` maps to `branded`
Brand = `Soft-brand / lifestyle`. **Every output byte-identical to G13.** This is the regression lock for `brandKeyCfg`'s soft-brand collapse.

#### G15 — `fbHighAdj` fires (F&B 26% > 25% threshold)
`Full-Service, 100 keys, 70% occ, $220 ADR, suburban, Brand = Soft-brand / lifestyle, F&B = 26`
```
revpar       = 220 × 0.70 = 154
roomRevenue  = 100 × 220 × 365 × 0.70 = 5,621,000
totalRevenue = / 0.65 = 8,647,692.307692308 ; noi = × 0.28 = 2,421,353.846153846
noiPerKey    = 24,213.53846153846
band = [0.0800, 0.0925]
adj  = 0 (base4to8) + 0 (feeSimple) + (−0.0025) (branded) + 0.0025 (F&B 0.26 > 0.25) = 0.0000
caps = 0.0800 / 0.0925
valueHigh = 2,421,353.85 / 0.0800 = 30,266,923.07692308 → 30,250,000 (605.34→605)
valueLow  = 2,421,353.85 / 0.0925 = 26,176,798.33679834 → 26,200,000 (523.54→524)
perKeyHigh = 302,669.23 → 303,000 ; perKeyLow = 261,767.98 → 262,000
```
| Output | Expected |
|---|---|
| `display.range` | `$26.2M – $30.3M` |
| `display.noiPerKey` | `$24,214` |
| `display.perKey` | `$260K – $305K` |
| `display.capRange` | `8.0% – 9.3%` |
| `capAdj` | `0.0000` — the F&B +25 bps exactly cancels the branded −25 bps |
| `firedCodes` | `[]` → fallback, `default` |

#### G16 — F&B at **exactly** 25% does NOT fire (boundary)
Identical to G15 but `F&B = 25`.
```
0.25 > 0.25  is FALSE  → no fbHighAdj
adj  = −0.0025 → caps 0.0775 / 0.0900
valueHigh = 2,421,353.85 / 0.0775 = 31,243,275.43424317 → 31,250,000 (624.87→625)
valueLow  = 2,421,353.85 / 0.0900 = 26,903,931.62393162 → 26,900,000 (538.08→538)
perKeyHigh = 312,432.75 → 312,000 ; perKeyLow = 269,039.32 → 269,000
```
| Output | Expected |
|---|---|
| `display.range` | `$26.9M – $31.3M` |
| `display.perKey` | `$270K – $310K` |
| `display.capRange` | `7.8% – 9.0%` |
| `capAdj` | `−0.0025` |

**G15 vs G16 is the boundary assertion:** the only delta is `capAdj` `0.0000` vs `−0.0025` (exactly +25 bps), producing a lower range for the higher-F&B hotel.

#### G17 — **All positive adjusters combined**
`Full-Service, 100 keys, 70% occ, $220 ADR, suburban, condition 15+ yrs / PIP due, Ground lease, Independent / unbranded, F&B = 40`
```
economics identical to G15/G16: noi = 2,421,353.846153846 , noiPerKey = 24,213.53846153846
adj = +0.0075 (over8) + 0.0100 (groundLease) + 0.0025 (independent) + 0.0025 (F&B 0.40 > 0.25)
    = +0.0225      ← the maximum reachable adjustment
caps = 0.08 + 0.0225 = 0.10250000000000001  and  0.0925 + 0.0225 = 0.11499999999999999
       (BOTH ends are float-dirty here — neither is the decimal-exact 0.1025 / 0.115)
valueHigh = 2,421,353.85 / 0.1025 = 23,622,964.35272045 → 23,600,000 (472.46→472)
valueLow  = 2,421,353.85 / 0.1150 = 21,055,250.83612040 → 21,050,000 (421.11→421)
perKeyHigh = 236,229.64 → 236,000 ; perKeyLow = 210,552.51 → 211,000
```
| Output | Expected |
|---|---|
| `display.range` | `$21.1M – $23.6M` |
| `display.perKey` | `$210K – $235K` (`211,000/5,000=42.2→42×5=210`; `236,000/5,000=47.2→47×5=235`) |
| `display.capRange` | `10.3% – 11.5%` — **assert the string**, `capLow` is `0.10250000000000001` (§C.5) |
| `firedCodes` | `["pip","ground","independent"]` — prio 1, 1, 3; `pip` before `ground` by declaration order |
| `topAdvice` | **only `pip` and `ground`** render — `independent` fires but is sliced off |
| `ctaVariant` | `valueAdd` — driven by `independent` in `firedCodes` even though it is **not** rendered |

**G17 is the critical `firedCodes` vs `topAdvice` divergence test.**

---

### G18 — Lowest reachable cap (floor probe — floor must NOT fire)
`Resort / Boutique, 80 keys, 70% occ, $400 ADR, gateway, Renovated / built in last 3 yrs, Branded (franchise)`
```
revpar       = 400 × 0.70 = 280
roomRevenue  = 80 × 400 × 365 × 0.70 = 8,176,000
totalRevenue = / 0.62 = 13,187,096.77419355 ; noi = × 0.30 = 3,956,129.032258065
noiPerKey    = / 80 = 49,451.61290322581
band = capRates.resortBoutique.gateway = [0.0600, 0.0750]   ← the lowest base band shipped
adj  = −0.0050 (under4) + 0 + (−0.0025) (branded) = −0.0075  ← the most negative adj reachable
caps pre-floor = 0.0525 / 0.0675
capFloorFired  = FALSE   (0.0525 > 0.045)
capSpreadFired = FALSE   (0.0675 ≥ 0.0525 + 0.005 = 0.0575)
valueHigh = 3,956,129.03 / 0.0525 = 75,354,838.70967741 → 75,350,000 (1,507.10→1,507)
valueLow  = 3,956,129.03 / 0.0675 = 58,609,318.99641577 → 58,600,000 (1,172.19→1,172)
perKeyHigh = 941,935.48 → 942,000 ; perKeyLow = 732,616.49 → 733,000
```
| Output | Expected |
|---|---|
| `display.range` | `$58.6M – $75.4M` |
| `display.noiPerKey` | `$49,452` |
| `display.perKey` | `$735K – $940K` (`733,000/5,000=146.6→147×5=735`; `942,000/5,000=188.4→188×5=940`) |
| `display.capRange` | `5.3% – 6.8%` |
| `capFloorFired` | `false` |
| `capSpreadFired` | `false` |
| `firedCodes` | `[]` → fallback, `default` |

**This is the global minimum `capLow` across the entire input space (5.25%). Assert it stays above `CAP_FLOOR`.**

---

### G19 — Value-add stack: `revparLow` + `valueAdd` + `smallKeys`
`Limited-Service, 40 keys, 50% occ, $100 ADR, tertiary`
```
revpar       = 100 × 0.50 = 50
roomRevenue  = 40 × 100 × 365 × 0.50 = 730,000
totalRevenue = / 0.95 = 768,421.0526315789 ; noi = × 0.38 = 292,000 ; noiPerKey = /40 = 7,300
band = [0.0925, 0.1100] ; adj = −0.0025 → 0.0900 / 0.1075
valueHigh = 292,000 / 0.0900 = 3,244,444.444444444 → 3,250,000 (64.89→65)
valueLow  = 292,000 / 0.1075 = 2,716,279.069767442 → 2,700,000 (54.33→54)
perKeyHigh = 81,111.11 → 81,000 ; perKeyLow = 67,906.98 → 68,000
```
| Output | Expected |
|---|---|
| `display.range` | `$2.7M – $3.3M` |
| `display.noiPerKey` | `$7,300` |
| `display.perKey` | `$70K – $80K` (`68,000/5,000=13.6→14×5=70`; `81,000/5,000=16.2→16×5=80`) |
| `display.capRange` | `9.0% – 10.8%` |
| bars | occ `(50−58)/(78−58)=−0.4` → **clamped to 0** → `0`; revpar `(50−55)/(140−55)` → clamped `0` |
| `firedCodes` | `["revparLow","valueAdd","smallKeys"]` (prio 2, 3, 4) |
| `topAdvice` | `revparLow`, `valueAdd` — `smallKeys` sliced off |
| `ctaVariant` | `valueAdd` |

**Also the negative-`pctBar` clamp test.**

---

### G20 — `pricingPower` (high occ, below-mid ADR)
`Extended-Stay, 100 keys, 88% occ, $140 ADR, suburban`
```
revpar       = 140 × 0.88 = 123.2
roomRevenue  = 100 × 140 × 365 × 0.88 = 4,496,800
totalRevenue = / 0.96 = 4,684,166.666666667 ; noi = × 0.40 = 1,873,666.666666667
noiPerKey    = 18,736.66666666667
band = [0.0800, 0.0925] ; adj = −0.0025 → 0.0775 / 0.0900
valueHigh = 1,873,666.67 / 0.0775 = 24,176,344.08602151 → 24,200,000 (483.53→484)
valueLow  = 1,873,666.67 / 0.0900 = 20,818,518.51851852 → 20,800,000 (416.37→416)
perKeyHigh = 241,763.44 → 242,000 ; perKeyLow = 208,185.19 → 208,000
```
| Output | Expected |
|---|---|
| `display.range` | `$20.8M – $24.2M` |
| `display.noiPerKey` | `$18,737` |
| `display.perKey` | `$210K – $240K` |
| `display.capRange` | `7.8% – 9.0%` |
| bars | occ `(88−70)/(85−70)=1.2` → clamped `100`; revpar `(123.2−80)/(175−80)=0.4547` → `45` |
| `firedCodes` | `["pricingPower"]` (`88 ≥ ob[2]=85` **and** `140 ≤ ab[1]=150`) |
| `ctaVariant` | `default` — `pricingPower` is in neither CTA list |

---

### G21 — `revparTop` alone
`Select-Service, 100 keys, 85% occ, $230 ADR, gateway`
```
revpar       = 230 × 0.85 = 195.5
roomRevenue  = 100 × 230 × 365 × 0.85 = 7,135,750
totalRevenue = / 0.88 = 8,108,806.818181818 ; noi = × 0.34 = 2,756,994.318181818
noiPerKey    = 27,569.94318181818
band = [0.0675, 0.0800] ; adj = −0.0025 → 0.0650 / 0.0775
valueHigh = 2,756,994.32 / 0.0650 = 42,415,297.20279720 → 42,400,000 (848.31→848)
valueLow  = 2,756,994.32 / 0.0775 = 35,574,120.23460410 → 35,550,000 (711.48→711)
perKeyHigh = 424,152.97 → 424,000 ; perKeyLow = 355,741.20 → 356,000
```
| Output | Expected |
|---|---|
| `display.range` | `$35.6M – $42.4M` |
| `display.noiPerKey` | `$27,570` |
| `display.perKey` | `$355K – $425K` (`356,000/5,000=71.2→71×5=355`; `424,000/5,000=84.8→85×5=425`) |
| `display.capRange` | `6.5% – 7.8%` |
| bars | occ `(85−62)/(80−62)=1.28` → clamped `100`; revpar `195.5 ≥ 185` → clamped `100` |
| `firedCodes` | `["revparTop"]` (`195.5 ≥ 185`); `pricingPower` needs `adr ≤ 175` → false |
| `ctaVariant` | `runningWell` |

---

### G22 — Zero rules fire → fallback advice + default CTA
`Full-Service, 100 keys, 70% occ, $250 ADR, suburban`
```
revpar       = 250 × 0.70 = 175
roomRevenue  = 100 × 250 × 365 × 0.70 = 6,387,500
totalRevenue = / 0.65 = 9,826,923.076923077 ; noi = × 0.28 = 2,751,538.461538462
noiPerKey    = 27,515.38461538462
band = [0.0800, 0.0925] ; adj = −0.0025 → 0.0775 / 0.0900
valueHigh = 2,751,538.46 / 0.0775 = 35,503,722.08436724 → 35,500,000 (710.07→710)
valueLow  = 2,751,538.46 / 0.0900 = 30,572,649.57264957 → 30,550,000 (611.45→611)
perKeyHigh = 355,037.22 → 355,000 ; perKeyLow = 305,726.50 → 306,000
```
| Output | Expected |
|---|---|
| `display.range` | `$30.6M – $35.5M` |
| `display.noiPerKey` | `$27,515` |
| `display.perKey` | `$305K – $355K` |
| `display.capRange` | `7.8% – 9.0%` |
| bars | occ `(70−60)/(78−60)=0.5556` → `56`; revpar `(175−105)/(275−105)=0.4118` → `41` |
| `firedCodes` | `[]` |
| `topAdvice` | exactly one entry — the **fallback** (§A.6.1), with `code === undefined` |
| `ctaVariant` | `default` |

**Checks:** `pip` no (`base`), `ground` no, `revparTop` `175 ≥ 275`? no, `revparLow` `175 ≤ 105`? no, `pricingPower` `70 ≥ 78`? no, `valueAdd` `70 ≤ 60`? no, `independent` no, `smallKeys` `100 < 60`? no, `bigKeys` `100 ≥ 150`? no. ✔

---

### G23 — **Cap floor unit test** (synthetic — unreachable via `calculate()`)
Test the clamp function directly, not through the UI path:
```ts
applyCapClamps(0.0400, 0.0420) // → { capLow: 0.045, capHigh: 0.050, floorFired: true,  spreadFired: true  }
applyCapClamps(0.0300, 0.0460) // → { capLow: 0.045, capHigh: 0.050, floorFired: true,  spreadFired: true  }
applyCapClamps(0.0450, 0.0900) // → { capLow: 0.045, capHigh: 0.090, floorFired: false, spreadFired: false }
```
Formatted: `applyCapClamps(0.0400, 0.0420)` → `"4.5% – 5.0%"`.

Arithmetic: `max(0.040, 0.045) = 0.045`; then `max(0.042, 0.045 + 0.005 = 0.050) = 0.050`.
Second: `max(0.030, 0.045) = 0.045`; then `max(0.046, 0.050) = 0.050` — note the floor raising `capLow` is what *forces* the spread rule here.

### G24 — **"high must be ≥ low + 0.5%" unit test** (synthetic)
```ts
applyCapClamps(0.0525, 0.0540) // → { capLow: 0.0525, capHigh: 0.0575, floorFired: false, spreadFired: true }
```
Formatted: `"5.3% – 5.8%"`. Arithmetic: `capLow` unchanged (`0.0525 > 0.045`); `max(0.0540, 0.0525 + 0.005 = 0.0575) = 0.0575`.

**Both G23 and G24 must be asserted against `applyCapClamps` in isolation.** Also add a guard test proving the §C.6 invariant, so a future `CONFIG` retune that makes the floor reachable trips a red test rather than silently changing every quoted price:
```ts
it("no shipped config/adjuster combination reaches the cap floor", () => {
  for (const pt of PROPERTY_TYPES) for (const tier of TIERS)
    for (const c of CONDITIONS) for (const l of LANDS) for (const b of BRANDS) for (const fb of [0, 40])
      expect(computeAdjustedCapLow(pt, tier, c, l, b, fb)).toBeGreaterThan(CAP_FLOOR);
});
```

---

## C.8 Coverage matrix

| Requirement | Covered by |
|---|---|
| Every property type | `fullService` G1/G6/G7/G15/G16/G17/G22 · `limitedService` G2/G8/G9–G14/G19 · `selectService` G3/G21 · `resortBoutique` G4/G18 · `extendedStay` G5/G20 |
| Every tier | `gateway` G2/G6/G18/G21 · `secondary` G3 · `suburban` G1/G5/G7/G8/G9–G17/G20/G22 · `tertiary` G4/G19 |
| NOI override path | G7 (plus `roomRevenue`/`totalRevenue` = `null`) |
| Occupancy clamping | G8 (upper, →100) · G19 (negative `pctBar` → 0) · G20/G21 (`pctBar` > 1 → 100) |
| `renovationAdj` isolated | G9 (`under4`) · G10 + G10b (`over8`, both labels) · G13 (`base4to8` implicit) |
| `landAdj` isolated | G11 |
| `brandAdj` isolated | G12 (`independent`) · G13 (`branded`) · G14 (soft-brand → branded) |
| `fbHighAdj` isolated + boundary | G15 (26% fires) · G16 (exactly 25% does not) |
| All adjusters combined | G17 (`+0.0225`, the maximum) |
| 4.5% cap floor | G18 (nearest approach, 5.25%, does not fire) · G23 (direct unit test) · §C.6 invariant test |
| `high ≥ low + 0.5%` | G23 / G24 (direct unit tests) · §C.6 invariant proof |
| Every ADVICE rule | `pip` G10/G17 · `ground` G11/G17 · `revparTop` G2/G8/G21 · `revparLow` G4/G19 · `pricingPower` G20 · `valueAdd` G19 · `independent` G12/G17 · `smallKeys` G4/G19 · `bigKeys` G5/G6 |
| `top 2` slicing vs full `firedCodes` | G17 (3 fired, 2 rendered) · G19 (3 fired, 2 rendered) |
| Fallback advice (no rule fires) | G1 · G3 · G7 · G9 · G13 · G14 · G15 · G16 · G18 · G22 |
| All 3 CTA variants | `valueAdd` G4/G12/G17/G19 · `runningWell` G2/G8/G21 · `default` G1/G3/G5/G6/G7/G9/G10/G11/G13–G16/G18/G20/G22 |
| Float-precision traps | G3 / G6 (`7.2%` not `7.3%`) · G17 (`0.10250000000000001` → `"10.3%"`) |
| `$50K` total rounding | every case |
| `$1K` then `$5K` per-key double rounding | every case; G1 and G21 are the clearest (`256,000 → "$255K"`, `356,000 → "$355K"`) |
| `roundTotal` sub-$1M branch | **not covered** — see §C.9 |

## C.9 Gaps and ambiguities

1. **`roundTotal`'s sub-$1M branch is not exercised by any golden case above.** The lowest case here (G19) is `$2.7M`. To reach `"$" + (Math.round(v/5000)*5) + "K"` you need a total under `$1,000,000` — e.g. `Limited-Service, 10 keys, 40% occ, $60 ADR, tertiary`. **Add direct unit tests on `roundTotal`.** Verified probes:

   | input | output |
   |---|---|
   | `0` | `$0K` |
   | `50_000` | `$50K` |
   | `950_000` | `$950K` |
   | `999_999` | `$1000K` ← ugly, but **unreachable** through `calculate()` |
   | `1_000_000` | `$1.0M` |

   `roundTotal` is only ever called with `totalLow`/`totalHigh`, which are already `roundTo(_, 50_000)` multiples — so the largest sub-$1M value it can actually receive is `950,000`. The `"$1000K"` output is a latent formatter wart, not a live bug. Do not "fix" it without a dated PROJECT-MEMORY.md entry.
2. **`window.__kwcEstimate` is a global side effect of a "pure" calculation.** The TS contract above moves it into `ValuationResult.prefill`; the React layer decides whether to also mirror it onto `window` for any legacy consumer. Recommend: do not.
3. **`usedDefaults` never resets.** Latched for the session once autofill or empty-field backfill runs. Ported as-is in the contract (`ValuationInput.usedDefaults`), but the React layer must decide where that state lives and whether "Start over" clears it. **Open question for the builder — the source's answer is "it does not clear".**
4. **`#resAdvice` / `#resContext` / `#resBars` use `innerHTML`.** All content is developer-authored (no user input reaches them), so it is not an XSS vector today — but the port should render these as React nodes rather than `dangerouslySetInnerHTML`.
5. **No `data-fmt` on `#cMarket`.** The `maxlength="5"` + `inputmode="numeric"` combination still permits letters. Harmless (only `/\d{5}/` is read), but the port should decide whether to enforce digits.
6. **`money()` and `perKey()` are dead.** Do not port unless a Hokuten surface needs them.
7. The Web3Forms lead payload (§B.4.7) omits ground lease, F&B share and the NOI override — three inputs that materially moved the quoted number. The Hokuten lead schema should include them (P2).

---

## C.10 Verification history

### 2026-08-08 — adversarial fidelity pass (defects found in **this document**, not in the source)

All fixed in place. None changed a golden-case output; the math extraction was correct throughout.

| # | Sev | Defect | Fix |
|---|---|---|---|
| V1 | **P1** | §C.2 typed `AdviceContext.brand` as `BrandKey` (`"branded" \| "independent"`). The source ctx sets `brand = (brandCfg === "independent") ? "indep" : "branded"` (`index.html:1519`) and the `independent` rule tests `c.brand === "indep"` (`:1494`). Building to the published type would have made that rule **permanently false** — the `independent` insight and its `valueAdd` CTA branch would silently never fire. | Retyped as `"branded" \| "indep"` with an explicit note. Added the two ctx keys the source carries but no rule reads (`occ`, `tier`). |
| V2 | P2 | §C.6 claimed "36 adjuster combinations (3 × 2 × 2 × 2)". `3 × 2 × 2 × 2 = 24`. | Corrected to 24 combinations / **480** band-adjuster pairs. Re-ran the enumeration: `minLow 0.0525` at `resortBoutique.gateway` (`adj −0.0075`), `minHigh 0.0675`, `minSpread 0.0125` — the published proof values were all correct. |
| V3 | P2 | §C.7's "Adjuster-isolation series (G9–G17) — **all nine** share the same economics base" was false twice over: G15–G17 use a **Full-Service $220-ADR** base (`noi = 2,421,353.85`), not the Limited-Service $150 base, and G9–G14 is seven entries, not nine. | Rewritten to state both bases and why G15–G17 must switch type (F&B is only reachable where `fbRow` is visible). |
| V4 | P2 | §C.7 header said "24 golden cases"; there are **25** (G1–G10, G10b, G11–G22, G23, G24). | Corrected, with an explicit inventory line. |
| V5 | P2 | §B.2.3 cited `index.html:948-957` and §B.2.6.3 cited `:990-994`; both quotes actually begin one line later (`:949` / `:991`) — `:948` and `:990` are `<div class="field-grid">` wrappers not present in the quote. | Citations corrected; wrapper lines called out. |
| V6 | P2 | G17 stated `0.0925 + 0.0225 = 0.115`. It is `0.11499999999999999` — in the very section that teaches float traps. G17's `valueHigh` digits were also transposed (`…272054` for `…272045`). | Both corrected; §C.5 expanded with the `0.115`, `0.0725`, and `0.07500000000000001` cases. |
| V7 | P2 | §0.4 said "the **four** occurrences" of "Sarhan" then listed five line numbers. `grep -c` → **5**. | Corrected to five, each labelled. |
| V8 | P3 | §B.4.8 quoted `openCalendly()` but never quoted the only line that binds it — `#calcBook`'s `addEventListener` (`index.html:1934-1935`). A builder reading only this doc would ship a dead CTA. | Wiring added verbatim. |
| V9 | P3 | §B.4.7's status table omitted `input.focus()` on the invalid-email branch (`index.html:1968`), and quoted the shared invalid-field CSS rule with its first selector (`.bov-form input.invalid`) silently dropped from an otherwise-verbatim rule (`:630`). | Both restored. |
| V10 | P3 | §A.5.4 listed four `groupInt` call sites, omitting `:1442` inside `formatField`. §B.4.8 prose cited `1912-1932` where the block is `1913-1932`. §0.2's `ACCESS_KEY` quote had its source indentation stripped. The "every quote is byte-exact" preamble did not disclose the `data-tip="…"` elisions. | All corrected; the preamble now names the one class of abridgement and confirms all 11 popover strings are quoted in full elsewhere. |

**Not defects — re-confirmed correct:** all 20 cap-rate cells; `TYPICAL`; all four key-map regexes across all 18 shipped option labels; `OCC_BAND` / `ADR_BAND` / `REVPAR_BAND`; all 9 `ADVICE` rules with bodies, priorities and declaration order; the complete `calculate()`, `bar()`, `validate()`, `typicalFor()`, `updateRevparLive()`, autofill and `syncType` quotes; the dead-code findings D5 (`money`/`perKey`/`esc` have zero call sites) and D6; every en-dash/em-dash/middle-dot separator claim (spot-checked by codepoint); the D1/D2 `$InfinityK` / `$NaNK` traces; the 140-char `topAdvice` truncation ending `…reward a disciplin`; all five `roundTotal` probes in §C.9; and **all 25 golden cases**. The Web3Forms access key is correctly redacted and appears nowhere in this document.
