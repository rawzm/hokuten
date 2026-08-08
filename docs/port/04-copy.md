# Port Pack 04 — Copy (all user-visible prose, verbatim)

**Source of record (read-only):** `~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html` (2290 lines, build stamp "Production build · kwc-dinomonteverde.com · May 2026").
**Status:** `provisional` — verbatim extraction complete; every rewrite decision below is a proposal, not an approved spec.
**Scope owned by this document:** `<head>` metadata, nav, hero, `#closings` / `#listings` section chrome, `#methodology`, `#team`, `#bov` section chrome + disclaimer + status strings, `.a100-arms`, `footer`, and the FAQ harvest.
**Explicitly NOT owned here (other extractors):** the calculator wizard (`#calculator`, index.html:912–1087 and its JS at 1350–1745), the BOV form fields/labels/consent copy (index.html:1167–1208), and the legal blocks (`privacy.html`, `sms-terms.html`, the TCPA/SMS consent paragraph at :1200, the footer legal line is quoted here only because it is the footer's own tracked brand line — treat the legal extractor's version as authoritative if they conflict).

### Conventions used in this file

- Everything inside a fenced block is **byte-exact** from the source, HTML entities included (`&amp;`, `&nbsp;`). Do not normalize. Two documented exceptions: (a) where a single element is quoted on its own, the source's leading indentation is stripped; (b) fenced blocks labelled "Rendered text" show the resolved text node, not raw markup, and are labelled as such.
- **The source escapes ampersands inconsistently — preserved as-is, never harmonized.** Escaped `&amp;` occurs on 8 lines (:937, :974, :992, :1137 `M&amp;A`, :1200, :1203, :1404, :1790). Raw, unescaped `&` occurs in user-visible text at :903 and :904 (`Budget Inn & Rodeway Inn`), :1100 (`Listing & Marketing`), :1102 (`LOI & Negotiation`), and inside the Google Maps query strings at :1139 and :1239. If a fenced block in this document shows a raw `&`, that is the source, not a transcription slip.
- All apostrophes in the source are ASCII `'` (verified: zero U+2019 in the file). Non-ASCII characters present: `–` U+2013, `—` U+2014, `•` U+2022, `…` U+2026, `→` U+2192, `≈` U+2248, `ⓘ` U+24D8, `✓` U+2713, `§` U+00A7, `©` U+00A9, `·` U+00B7, `×` U+00D7, `÷` U+00F7.
- **VOICE** flags = sentences that are Dino-singular / personal-practice-site framing and must become team-first "we" for HOKUTEN.
- **EVIDENCE** flags = factual claims (number, award, timeframe, license) that need a `verified-current` row in the design skill's claims register (reference 06) before shipping.
- **SARHAN** flags = Sarhan Hotel Group branding. Per the hard guardrail, **none of it carries over.** Flagged, never ported.
- **SECRET** — the Web3Forms access key at index.html:1169 is a live credential value. It is deliberately **not reproduced** anywhere in this document: `<REDACTED — env var WEB3FORMS_ACCESS_KEY>`.

---

## 1. `<head>` — title, meta, OG/Twitter, canonical, structured data

**index.html:16–38** — metadata + icons. Accounting for the rest of `<head>`: **39–41** font loading (quoted separately below), **42–804** the inline `<style>` block, 805 blank, 806–807 an HTML comment, **808** the Calendly stylesheet, **809** the Calendly widget script, 810 blank, 811 a comment, **812** the intl-tel-input stylesheet, 813 `</head>`.

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dino Monteverde — Hospitality Investment Sales</title>
<meta name="description" content="Hospitality investment sales across the United States. Data-grounded pricing, disciplined open-market execution, closed deals. Sarhan Hotel Group at Keller Williams Commercial.">
<meta property="og:title" content="Dino Monteverde — Hospitality Investment Sales">
<meta property="og:description" content="Hospitality investment sales across the United States. Data-grounded pricing. Disciplined open-market execution. Closed deals.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://kwc-dinomonteverde.com/">
<meta property="og:site_name" content="Dino Monteverde — KW Commercial · Sarhan Hotel Group">
<!-- Link-preview thumbnail (1200x630). Shows when the site URL is shared in iMessage, WhatsApp, LinkedIn, X, Facebook, etc. -->
<meta property="og:image" content="https://kwc-dinomonteverde.com/og-card-v2.jpg">
<meta property="og:image:secure_url" content="https://kwc-dinomonteverde.com/og-card-v2.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Dino Monteverde — Senior Associate, Hospitality Investment Sales. Keller Williams Commercial · National Hospitality Division. 650.720.6995 · dino.monteverde@kw.com">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Dino Monteverde — Hospitality Investment Sales">
<meta name="twitter:description" content="Hospitality investment sales across the United States. Data-grounded pricing. Disciplined open-market execution. Closed deals.">
<meta name="twitter:image" content="https://kwc-dinomonteverde.com/og-card-v2.jpg">
<meta name="twitter:image:alt" content="Dino Monteverde — Senior Associate, Hospitality Investment Sales.">
<link rel="icon" type="image/png" sizes="48x48" href="favicon-48.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```

**Font loading — index.html:39–41**, verbatim (not copy, but part of `<head>` and load-bearing for the type port — the three families here are the whole typographic system of the source site):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Family | Weights / styles requested | Role in the source |
|---|---|---|
| `Cormorant Garamond` | 400/500/600 upright + 400/500 italic | `--serif` — display headlines, the gold italic `.accent` spans, BOV subhead |
| `Inter` | 300/400/500/600/700 | `--sans` — body, nav, labels |
| `JetBrains Mono` | 400/500 | mono — figures, ticker, small-caps metrics |

> Port note: HOKUTEN's type stack is its own decision (see the design skill, reference 01). This block is recorded so nobody re-derives the source's families by guesswork — it is **not** an instruction to keep them. Also note the source loads fonts from a third-party CDN with `display=swap`; a Next.js port should use `next/font` (self-hosted, no external request) rather than reproducing these `<link>` tags.

**Source HTML comment above the doctype — index.html:2–13** (build/maintenance note, not user-visible; recorded because it documents the two "SET THIS" values and the card-editing convention):

```html
<!--
  Dino Monteverde — Hospitality Investment Sales
  Production build · kwc-dinomonteverde.com · May 2026

  TWO THINGS TO SET BEFORE GOING LIVE (search for "SET THIS"):
    1. Web3Forms access key for the BOV form  (free key at https://web3forms.com)
    2. Site domain string (one place, in the <script> config block at the bottom)

  TO EDIT CLOSINGS / LISTINGS: each card is a self-contained block in the
  "RECENT CLOSINGS" and "ACTIVE LISTINGS" sections. Copy a block, change the
  text/photo, done. Photos sit next to this file (e.g. cover_lasthotel.jpg).
-->
```

### Gaps found in `<head>` (net-new work for HOKUTEN, nothing to port)

| Missing | Verified | Action |
|---|---|---|
| `<link rel="canonical">` | absent — zero `<link rel="canonical">` tags. (The string `canonical` does occur once in the file, at :1564, but only inside a JS comment — `// Canonical disclaimer language …` — which is unrelated.) | Add in Next.js `metadata.alternates.canonical`. |
| JSON-LD structured data (`application/ld+json`) | **absent — zero `ld+json` blocks anywhere in index.html.** There is no `Organization`, `RealEstateAgent`, `LocalBusiness`, `BreadcrumbList`, or `FAQPage` markup. | Net-new. Author fresh for HOKUTEN; do not "port" anything. |
| `<meta name="robots">`, `author`, `keywords`, `theme-color` | all absent | Net-new. |
| `og:locale`, `twitter:site`/`twitter:creator` | absent | Net-new. |

### Flags — head

- **SARHAN** — `meta name="description"` (`:19`) ends `Sarhan Hotel Group at Keller Williams Commercial.` and `og:site_name` (`:24`) is `Dino Monteverde — KW Commercial · Sarhan Hotel Group`. **Both strings die.** Replace with HOKUTEN framing.
- **VOICE** — the whole metadata set is one named individual. HOKUTEN title/description must be team-first (`THE HOKUTEN GROUP — Hospitality Investment Sales` shape), person-agnostic.
- **EVIDENCE** — `og:image:alt` (`:31`) asserts the title "Senior Associate", the division name "National Hospitality Division", and the phone `650.720.6995`. Any of these that carry over need a register row.
- The OG image asset is `og-card-v2.jpg` (1200×630) and hard-codes the old name/phone in raster; it cannot be reused — a new HOKUTEN card must be produced.

---

## 2. Nav — index.html:817–840

Full block, verbatim:

```html
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

### Nav strings table

| Element | Verbatim string | Destination | Line |
|---|---|---|---|
| Logo `alt` | `Keller Williams Commercial` | `#` (brand lockup links to top) | :820 |
| Wordmark | `Dino Monteverde` (second word in `<span class="amp">`, rendered italic gold) | — | :823 |
| Wordmark descriptor | `Keller Williams Commercial` | — | :824 |
| Nav link 1 | `Hotels for Sale` | `#listings` | :831 |
| Nav link 2 | `Hotel Worth Calculator` | `#calculator` | :832 |
| Nav link 3 | `Methodology` | `#methodology` | :833 |
| Nav link 4 | `Team` | `#team` | :834 |
| Nav link 5 | `Contact` | `#bov` | :835 |
| Nav link 6 | `Marketplace` | `marketplace.html` | :836 |
| Nav CTA | `Request a Written BOV` | `#bov` | :837 |
| Mobile toggle | `aria-label="Menu"`, `aria-expanded="false"` — **no visible text label**; three bare `<span>` bars form the hamburger | — | :827–829 |

### Mobile menu behaviour — index.html:1337–1348 (there is **no** separate mobile menu copy)

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

The mobile menu reuses the **same seven `<ul>` items**, in the same order, with the same labels. `aria-expanded` toggles; the menu closes on any link tap. No "Close", no "Menu" visible text, no overlay heading.

### Flags — nav

- **VOICE** — `Dino Monteverde` wordmark + `Team` label. On HOKUTEN the wordmark becomes THE HOKUTEN GROUP and the `#team` section is genuinely plural, so `Team` finally earns its label.
- **BRAND GUARDRAIL** — the KW Commercial mark is the *lead* element of this lockup (`kw-mark` first, then divider, then the personal wordmark). Per PROJECT-MEMORY: HOKUTEN-first branding, KW Commercial only as a **footer** compliance mark. **The nav co-brand lockup does not port.** Nav gets the HOKUTEN mark alone.
- **A11y note to preserve** — `aria-label="Menu"` + `aria-expanded` toggling is the accessible name pattern; keep the equivalent in the React nav.

---

## 3. Hero — index.html:843–863

Full block, verbatim:

```html
<section class="hero">
  <video class="hero-video" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="poster.jpg" disablepictureinpicture>
    <!-- MP4/H.264 first so iOS Safari (no WebM support) picks a playable source
         immediately and autoplays inline; WebM second for browsers that prefer it. -->
    <source src="hero.mp4" type="video/mp4">
    <source src="hero.webm" type="video/webm">
  </video>
  <div class="eyebrow">National Hospitality Division · 2026</div>
  <h1 class="display-headline">The <span class="accent">signal</span> underneath every hotel transaction.</h1>
  <p class="hero-sub">Hospitality investment sales across the United States. Data-grounded pricing. Disciplined open-market execution. Closed deals.</p>
  <div class="cta-row">
    <a href="#bov" class="btn-primary">Request a written BOV</a>
    <a href="#closings" class="btn-secondary">See recent closings</a>
  </div>
  <div class="trust-strip">
    <div class="trust-stat"><div class="label">Aggregate Volume</div><div class="figure">$<span class="accent">200</span>M+</div></div>
    <div class="trust-stat"><div class="label">Closed Transactions</div><div class="figure"><span class="accent">12</span></div></div>
    <div class="trust-stat"><div class="label">Total Square Feet</div><div class="figure">836<span class="accent">K+</span></div></div>
    <div class="trust-stat"><div class="label">CoStar Power Broker</div><div class="figure quarters">Q3&nbsp;'25 · Q1&nbsp;'26 · Q2&nbsp;'26</div></div>
  </div>
</section>
```

### Hero strings table

| Slot | Verbatim | Line |
|---|---|---|
| Eyebrow | `National Hospitality Division · 2026` | :850 |
| Headline (plain text) | `The signal underneath every hotel transaction.` — the word `signal` is wrapped in `<span class="accent">` (italic gold) | :851 |
| Subhead | `Hospitality investment sales across the United States. Data-grounded pricing. Disciplined open-market execution. Closed deals.` | :852 |
| Primary CTA | `Request a written BOV` → `#bov` (note: **lowercase "written"** here; the nav CTA at :837 uses title-case `Request a Written BOV` — inconsistent in source, preserve or normalize deliberately) | :854 |
| Secondary CTA | `See recent closings` → `#closings` | :855 |

### Value rail (`.trust-strip`) — four small-caps label / figure pairs

| Label (verbatim) | Figure (verbatim, rendered) | Raw markup nuance | Line |
|---|---|---|---|
| `Aggregate Volume` | `$200M+` | `200` is gold-accented | :858 |
| `Closed Transactions` | `12` | whole figure gold-accented | :859 |
| `Total Square Feet` | `836K+` | `K+` is gold-accented | :860 |
| `CoStar Power Broker` | `Q3 '25 · Q1 '26 · Q2 '26` | non-breaking spaces after `Q3`/`Q1`/`Q2` (`&nbsp;`); separators are `·` U+00B7 with normal spaces | :861 |

### Video / poster usage

- `poster="poster.jpg"`; sources `hero.mp4` (H.264, 2.78 MB) then `hero.webm` (2.38 MB) — **MP4 first is deliberate** so iOS Safari picks a playable source and autoplays inline.
- Attributes: `autoplay muted loop playsinline webkit-playsinline preload="auto" disablepictureinpicture`.
- Reduced-motion guard exists in JS at index.html:1305–1330: if `prefers-reduced-motion: reduce`, the script removes `autoplay` and pauses; otherwise it forces `hv.muted = true` (property form, required by iOS), sets `playsInline`, calls `play()`, and retries on first tap/scroll. **Port this behaviour** — it is an a11y and mobile-correctness requirement, not decoration.

### Scroll cue

**There is no scroll cue in the hero.** No chevron, no "Scroll" text, no `.scroll-cue`/`.scroll-hint` element anywhere in the file. The hero ends at the trust strip. If HOKUTEN wants one, it is net-new.

### Flags — hero

- **EVIDENCE (all four rail stats are P0 claims):**
  - `$200M+` aggregate volume
  - `12` closed transactions
  - `836K+` total square feet
  - `CoStar Power Broker` for `Q3 '25 · Q1 '26 · Q2 '26` — an **award claim**, the highest-risk item on the page. Also restated in `.team-creds` (:1137) as "Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026" (note the two blocks use different date formats: `Q3 '25` vs `Q3 2025`).
  - The eyebrow's `2026` is a dated stamp that will go stale.
- **VOICE** — hero body copy is already impersonal (no "I"/"my"), so the subhead and headline port almost cleanly. But the four stats are **one person's** production record. On a team-first site they must either (a) be re-scoped as the group's aggregate with a fresh register row, or (b) move into the individual's team-card. Do not silently re-attribute personal numbers to the group.
- `National Hospitality Division` is a KW Commercial division name — decide whether HOKUTEN claims it or drops it.

---

## 4. `#closings` and `#listings` — section chrome only

> Card data (property names, cities, keys, LP/SP %, days, prices, photos) is **not** in this document — it belongs to the cards/data extractor. Only the chrome is below.

### 4a. `#closings` — index.html:866–871, 908–909

```html
<section class="content" id="closings">
  <div class="section-head">
    <div class="section-head-text"><h2>Recent <span class="accent">closings</span>.</h2><p>Real transactions, real numbers.</p></div>
    <a href="https://www.crexi.com/profile/dino-monteverde-dinomon" target="_blank" rel="noopener" class="btn-outline">View all</a>
  </div>
  <div class="closings-grid">
```

| Slot | Verbatim | Line |
|---|---|---|
| Heading | `Recent closings.` (`closings` gold-italic accent; trailing period is part of the house style) | :868 |
| Subhead | `Real transactions, real numbers.` | :868 |
| Head CTA | `View all` → `https://www.crexi.com/profile/dino-monteverde-dinomon` (`target="_blank" rel="noopener"`) | :869 |
| Card badge (repeats on all six cards) | `Recently Closed` | :873, 879, 885, 891, 897, 903 |
| Card affordance | `→` (U+2192) in `.card-title-arrow` | per card |
| Broken-image placeholder caption | `Photo · 4:3` (second `<span>` inside `.placeholder`, `style="opacity:.6;"`; the first span repeats the property name). Revealed by the card image's inline `onerror` handler. **Present on only two of the six cards** — Carte (:873) and Renaissance (:879); the other four cards have no `.placeholder` at all, so a failed image on them leaves an empty box | :873, :879 |
| Empty state | **none** — closings are hand-authored static blocks, so there is no loading/empty/error state | — |

### 4b. `#listings` — index.html:1114–1124

```html
<!-- ACTIVE LISTINGS  (LIVE — Keller Williams Commercial listings; cards link to Crexi. See the LISTINGS script block) -->
<section class="content" id="listings" style="padding-top: 0;">
  <div class="section-head">
    <div class="section-head-text"><h2>Active <span class="accent">listings</span>.</h2><p>Current public hotel listings represented through Keller Williams Commercial. Open any listing on Crexi for full details and offering materials.</p></div>
    <a href="https://www.crexi.com/profile/dino-monteverde-dinomon" target="_blank" rel="noopener" class="btn-outline">View all listings on Crexi</a>
  </div>
  <!-- Renderer fills this grid. Default state is a graceful loading message; on error it falls back to a static CTA. -->
  <div class="listings-grid" id="listingsGrid">
    <div class="listings-status" id="listingsStatus">Loading current listings…</div>
  </div>
</section>
```

| Slot | Verbatim | Line |
|---|---|---|
| Heading | `Active listings.` (`listings` accented) | :1117 |
| Subhead | `Current public hotel listings represented through Keller Williams Commercial. Open any listing on Crexi for full details and offering materials.` | :1117 |
| Head CTA | `View all listings on Crexi` → `https://www.crexi.com/profile/dino-monteverde-dinomon` | :1118 |
| **Loading state** | `Loading current listings…` (trailing `…` is U+2026, not three dots) | :1122 |

**Runtime states rendered by JS — index.html:1866–1878.** These strings are user-visible and must port:

```js
      if (!listed.length){
        grid.innerHTML = '<div class="listings-status">No active listings right now — '
          + '<a href="' + SIGNUP_URL + '" target="_blank" rel="noopener">request off-market access</a>.</div>';
        return;
      }
```

```js
    function fail(){
      // Graceful fallback: never leave a broken/empty grid.
      grid.innerHTML = '<div class="listings-status">Listings are temporarily unavailable. '
        + '<a href="' + CREXI_PROFILE + '" target="_blank" rel="noopener">View all listings on Crexi →</a></div>';
    }
```

| State | Rendered text | Link target | Line |
|---|---|---|---|
| Empty | `No active listings right now — request off-market access.` (link text = `request off-market access`) | `SIGNUP_URL` = `https://a100arms.com/signup` | :1867–1868 |
| Error | `Listings are temporarily unavailable. View all listings on Crexi →` (link text includes the arrow) | `CREXI_PROFILE` = `https://www.crexi.com/profile/dino-monteverde-dinomon` | :1876–1877 |

**Per-card chrome strings generated by the renderer — index.html:1830–1856** (chrome only; the data is the other extractor's):

| Slot | Verbatim | Line |
|---|---|---|
| Badge | `Active` | :1849 |
| Hover overlay CTA | `View details` | :1850 |
| Card arrow | `→` | :1852 |
| Name fallback when the feed omits one | `Hospitality Asset` | :1832 |
| Photo placeholder | `Property Photo` | :1844 |
| Price fallback (price is `$0` / blank) | `Price on request` | :1812 |

### Flags — closings / listings

- **VOICE** — no first-person here; both subheads are already impersonal. Straight port apart from the brokerage attribution.
- **VOICE / BRAND** — `represented through Keller Williams Commercial` (:1117) is a brokerage attribution, not a brand statement. Re-express for HOKUTEN, keeping the compliance-accurate brokerage-of-record language.
- **EVIDENCE** — the `View all` links point at a *personal Crexi profile* (`/profile/dino-monteverde-dinomon`). HOKUTEN needs its own destination; if none exists, the CTA must change rather than deep-link a personal profile.
- The empty state funnels to `a100arms.com/signup` — the a100 Arms relationship is load-bearing for the empty state, see §8.
- **Behaviour note (not copy, recorded for parity)** — index.html:1735–1745: on `(hover: none)` devices, tapping a `.closing-card` or `.listing-card` anywhere except a link toggles a `.tapped` class, which is what reveals the card's colour/overlay treatment on touch. Without it the hover-only reveal is unreachable on phones. Same class of mobile-correctness requirement as the hero-video guard in §3.

---

## 5. `#methodology` — index.html:1090–1112

Full block, verbatim:

```html
<!-- PROCESS -->
<section class="content" id="methodology">
  <div class="section-head">
    <div class="section-head-text"><h2>How we run a <span class="accent">sale</span>.</h2><p>Most owners haven't sold a hotel before. Here's exactly what happens.</p></div>
    <a href="#bov" class="btn-outline">Request a written BOV</a>
  </div>
  <p class="process-framework">The listing term is 180 days, structured as two 90-day cycles. The first 90 days are the front-loaded campaign and diagnostic period, with market reads at Days 30 and 60. At Day 90, if the hotel is not under contract, the seller decides: accept a live offer, reprice and authorize a second 90-day cycle, or conclude the engagement. A qualified offer can move to LOI, diligence, and close at any time.</p>
```

### 5a. Section chrome

| Slot | Verbatim | Line |
|---|---|---|
| Heading | `How we run a sale.` (`sale` accented) | :1092 |
| Subhead | `Most owners haven't sold a hotel before. Here's exactly what happens.` | :1092 |
| Head CTA | `Request a written BOV` → `#bov` | :1093 |

### 5b. The 180-day / 90-day-cycle framing paragraph — index.html:1095

```
The listing term is 180 days, structured as two 90-day cycles. The first 90 days are the front-loaded campaign and diagnostic period, with market reads at Days 30 and 60. At Day 90, if the hotel is not under contract, the seller decides: accept a live offer, reprice and authorize a second 90-day cycle, or conclude the engagement. A qualified offer can move to LOI, diligence, and close at any time.
```

### 5c. The five numbered steps — index.html:1099–1103

Each step is `.timeline-circle` (number) + `.step-title` + `.step-headline` + `.step-body`.

**Step 01 — index.html:1099**
```html
<div class="timeline-step"><div class="timeline-circle">01</div><div class="step-title">BOV</div><div class="step-headline">Broker opinion of value</div><div class="step-body">Written BOV with comp set, market analysis, and pricing recommendation. Delivered before the listing agreement.</div></div>
```

**Step 02 — index.html:1100**
```html
<div class="timeline-step"><div class="timeline-circle">02</div><div class="step-title">Listing & Marketing</div><div class="step-headline">Confidential OM and campaign launch</div><div class="step-body">Custom OM and targeted buyer outreach. Public launch across CoStar, LoopNet, and Crexi, supported by direct database distribution and owner outreach — unless the seller's circumstances require a controlled confidential process.</div></div>
```
> Source note: at :1100 the title uses a **raw, unescaped ampersand** — `Listing & Marketing`, not `Listing &amp; Marketing`. The block above reproduces the source byte-for-byte. Rendered text is `Listing & Marketing`. (In JSX this must be written as `Listing &amp; Marketing` or `Listing {'&'} Marketing`; the raw form here is HTML-source fidelity, not a porting instruction.)

**Step 03 — index.html:1101**
```html
<div class="timeline-step"><div class="timeline-circle">03</div><div class="step-title">Buyer Vetting</div><div class="step-headline">Pre-qualify the capital</div><div class="step-body">You see real offers from real buyers. Inquiries that don't meet qualification standards don't reach the seller.</div></div>
```

**Step 04 — index.html:1102**
```html
<div class="timeline-step"><div class="timeline-circle">04</div><div class="step-title">LOI & Negotiation</div><div class="step-headline">Price, terms, contingencies</div><div class="step-body">Best-and-final rounds when warranted, single-buyer negotiations when not. The seller stays focused on running the hotel.</div></div>
```
> Source note: at :1102 the source likewise uses a raw, unescaped `&` — `LOI & Negotiation`. Reproduced byte-for-byte above; same JSX caveat as step 02.

**Step 05 — index.html:1103**
```html
<div class="timeline-step"><div class="timeline-circle">05</div><div class="step-title">Close</div><div class="step-headline">Title, lender, franchise</div><div class="step-body">Coordination through DD, re-trades, and wire. Average close: 60–90 days post-LOI.</div></div>
```
> `60–90` uses an en dash (U+2013).

### 5d. Reach-stats row — index.html:1106–1111

```html
  <div class="process-reach">
    <div><div class="figure">~400K</div><div class="desc">Hotel-investor reach — primarily CoStar, supplemented by Crexi distribution and direct outreach.</div></div>
    <div><div class="figure">~60K</div><div class="desc">Hotel owners reached through direct voice outreach.</div></div>
    <div><div class="figure">1,500</div><div class="desc">Direct hotel-owner relationships.</div></div>
    <div><div class="figure">30K</div><div class="desc">SMS-capable contacts.</div></div>
  </div>
```

| Figure (verbatim) | Caption (verbatim) | Line |
|---|---|---|
| `~400K` | `Hotel-investor reach — primarily CoStar, supplemented by Crexi distribution and direct outreach.` | :1107 |
| `~60K` | `Hotel owners reached through direct voice outreach.` | :1108 |
| `1,500` | `Direct hotel-owner relationships.` | :1109 |
| `30K` | `SMS-capable contacts.` | :1110 |

> Two of the four figures carry a `~` hedge (`~400K`, `~60K`); two are stated flat (`1,500`, `30K`). Preserve the hedges exactly — they are the difference between an estimate and an assertion.

### Flags — methodology

- **VOICE** — this section is **already team-first**: "How **we** run a sale", "You see real offers", "the seller decides". It is the cleanest port on the page. The only singular residue is contextual (a one-person practice implied by the rest of the site), not in the words themselves.
- **EVIDENCE (P0):** `180 days` term, `two 90-day cycles`, `Days 30 and 60` market reads, `Day 90` decision point, `Average close: 60–90 days post-LOI` — all timeframe commitments. If HOKUTEN's engagement terms differ from Dino's, these are contractual statements, not marketing copy. Re-verify against the actual listing agreement before shipping.
- **EVIDENCE (P0):** all four reach stats (`~400K`, `~60K`, `1,500`, `30K`) — database-size claims. Register rows required, with the source of each count named.
- **EVIDENCE (P1):** named third-party platforms `CoStar`, `LoopNet`, `Crexi` (:1100) and `CoStar` again in the reach caption (:1107) — verify HOKUTEN actually holds the subscriptions/distribution being claimed. (`RCA` is **not** named in this section; it appears only in the calculator's methodology note at :920 and its JS twin at :1568 — flagged there, not here.)
- The `30K SMS-capable contacts` figure interacts with the 10DLC/TCPA posture owned by the legal extractor — flag it to them.

---

## 6. `#team` — index.html:1127–1156

Full block, verbatim:

```html
<!-- TEAM -->
<section class="content" id="team">
  <div class="section-head">
    <div class="section-head-text"><h2>The <span class="accent">practitioner</span>.</h2><p>Operator turned broker — practical perspective on every transaction.</p></div>
  </div>
  <div class="team-grid">
    <div class="team-feature">
      <div class="portrait"><img src="portrait_final.jpg" alt="Dino Monteverde" loading="eager" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div class="placeholder" style="display:none; width:100%; height:100%; align-items:center; justify-content:center; color:var(--meta);"><span>Dino Monteverde</span></div></div>
      <div class="info">
        <div class="team-name">Dino <span class="accent">Monteverde</span></div>
        <div class="team-title">Senior Associate · Hospitality Investment Sales</div>
        <div class="team-creds">$200M+ across 12 hospitality transactions — 11 hotel-asset transactions + 1 hotel-management-company M&amp;A. Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026. USMC veteran. Former hotel owner-operator.</div>
        <div class="team-contact"><a href="#" class="copy-email" data-email="dino.monteverde@kw.com">dino.monteverde@kw.com</a><span class="copy-email-note" aria-live="polite"></span><br><a href="tel:+16507206995">650.720.6995</a></div>
        <address class="team-address"><a href="https://www.google.com/maps/search/?api=1&query=118+N+Larchmont+Blvd%2C+Los+Angeles%2C+CA+90004" target="_blank" rel="noopener">118 N Larchmont Blvd<br>Los Angeles<br>California 90004<br>United States</a></address>
        <div class="team-license">Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).<br>Dino Monteverde, CA DRE #01948432.</div>
      </div>
    </div>
```

### 6a. Section chrome

| Slot | Verbatim | Line |
|---|---|---|
| Heading | `The practitioner.` (`practitioner` accented) — **singular** | :1129 |
| Subhead | `Operator turned broker — practical perspective on every transaction.` | :1129 |
| Head CTA | none (this section head has no button) | — |

### 6b. Person 1 of 1 — Dino Monteverde

| Slot | Verbatim | Line |
|---|---|---|
| Portrait `alt` | `Dino Monteverde` (asset `portrait_final.jpg`, `loading="eager" decoding="async"`, with an `onerror` text placeholder that also reads `Dino Monteverde`) | :1133 |
| Name | `Dino Monteverde` (surname gold-italic) | :1135 |
| Role / title | `Senior Associate · Hospitality Investment Sales` | :1136 |

**FULL bio / creds text — index.html:1137, verbatim (rendered, `&amp;` resolved to `&`):**

```
$200M+ across 12 hospitality transactions — 11 hotel-asset transactions + 1 hotel-management-company M&A. Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026. USMC veteran. Former hotel owner-operator.
```

Raw source form (entity preserved):

```html
$200M+ across 12 hospitality transactions — 11 hotel-asset transactions + 1 hotel-management-company M&amp;A. Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026. USMC veteran. Former hotel owner-operator.
```

> That is the **entire** biography on the page. There is no long-form "about" paragraph anywhere in index.html — the four sentences above are it.

### 6c. Contact row

| Slot | Verbatim | Behaviour | Line |
|---|---|---|---|
| Email | `dino.monteverde@kw.com` | `href="#"` with `class="copy-email" data-email="dino.monteverde@kw.com"` — **click copies to clipboard, does not open a mail client** | :1138 |
| Copy flash | `✓ Copied` (U+2713 + space + `Copied`) | injected into `<span class="copy-email-note" aria-live="polite">`, `.show` class for 1800 ms, then fades | :1291, :1296, :1284 |
| Copy fallback | on `execCommand` failure the flash shows **the email address itself** (`flash(email)`) instead of a confirmation | :1292 |
| Phone | `650.720.6995` | `href="tel:+16507206995"` (display format is dotted, tel: is E.164) | :1138 |
| Address | `118 N Larchmont Blvd` / `Los Angeles` / `California 90004` / `United States` (four `<br>`-separated lines inside `<address>`) | links to Google Maps search for `118 N Larchmont Blvd, Los Angeles, CA 90004`, `target="_blank" rel="noopener"` | :1139 |
| License line | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).` `<br>` `Dino Monteverde, CA DRE #01948432.` | — | :1140 |

**Clipboard implementation — index.html:1272–1299** (copy behaviour and its exact flash strings):

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

> The same `.copy-email` pattern (and therefore the same `✓ Copied` flash) is used a second time in the footer at :1236.

### 6d. Team card 2 — "The Platform" — index.html:1143–1148

```html
    <div class="team-open">
      <div class="label">— The Platform</div>
      <div class="role">Sarhan Hotel Group</div>
      <p>Hospitality-only investment sales team. Senior broker collaboration on engagements requiring multi-broker coverage, deeper market reach, or co-listing depth.</p>
      <a href="https://sarhanhotelgroup.com" target="_blank" rel="noopener">sarhanhotelgroup.com →</a>
    </div>
```

| Slot | Verbatim | Line |
|---|---|---|
| Label | `— The Platform` (leading em dash is part of the string) | :1144 |
| Role | `Sarhan Hotel Group` | :1145 |
| Body | `Hospitality-only investment sales team. Senior broker collaboration on engagements requiring multi-broker coverage, deeper market reach, or co-listing depth.` | :1146 |
| Link | `sarhanhotelgroup.com →` → `https://sarhanhotelgroup.com` | :1147 |

> **SARHAN — DOES NOT PORT.** The role name, the body copy's framing, and the outbound link are all Sarhan Hotel Group. Per the hard guardrail no Sarhan branding appears anywhere on the HOKUTEN site. Quoted here only so the builder recognizes the slot and knows to delete or repurpose it. The *slot shape* (label / role / body / link) may be reused for a HOKUTEN-owned entity; the *content* may not.

### 6e. Team card 3 — "The Brokerage of Record" — index.html:1149–1154

```html
    <div class="team-open">
      <div class="label">— The Brokerage of Record</div>
      <div class="role">Forward Wilshire Inc dba Keller Williams Larchmont</div>
      <p>Nationwide referral network and formal partner-brokerage relationships in every U.S. state for out-of-California engagements. Brokerage of record for all listings.</p>
      <a href="#bov">CA DRE #01870534 →</a>
    </div>
```

| Slot | Verbatim | Line |
|---|---|---|
| Label | `— The Brokerage of Record` | :1150 |
| Role | `Forward Wilshire Inc dba Keller Williams Larchmont` | :1151 |
| Body | `Nationwide referral network and formal partner-brokerage relationships in every U.S. state for out-of-California engagements. Brokerage of record for all listings.` | :1152 |
| Link | `CA DRE #01870534 →` → `#bov` (the link text is a license number but the destination is the BOV form — an odd source choice, flagged for the builder) | :1153 |

### Flags — team

- **VOICE (P0)** — the entire section is built around one person: heading `The practitioner.` (singular), one portrait, one bio, `Email Dino` in the footer. **HOKUTEN needs a genuine plural section.** Proposed rewrite direction: heading becomes plural (`The practitioners.` / `The team.`), the subhead `Operator turned broker — practical perspective on every transaction.` survives almost intact as a group ethos line, and the personal creds move into an individual card.
- **VOICE** — `.team-creds` is written as a résumé fragment with no subject ("$200M+ across 12 hospitality transactions…"). It reads as neither "I" nor "we", which makes it easy to re-attribute *and* easy to accidentally mis-attribute. Whoever writes the HOKUTEN version must decide explicitly whether each stat is the individual's or the group's.
- **EVIDENCE (P0):** `$200M+`, `12 hospitality transactions`, the `11 + 1` split, `Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026`, `USMC veteran`, `Former hotel owner-operator`. The CoStar award and the veteran status are third-party-verifiable assertions; both need register rows with a source.
- **EVIDENCE (P0):** license numbers `CA DRE #01870534` (Forward Wilshire Inc dba Keller Williams Larchmont) and `CA DRE #01948432` (Dino Monteverde), and the claim of `formal partner-brokerage relationships in every U.S. state`. These are regulatory statements — coordinate with the legal extractor; do not restate them from this doc alone.
- **BLOCKED** — per PROJECT-MEMORY, the KW / Forward Wilshire paperwork gate must clear before any of the brokerage-of-record copy can ship publicly under the HOKUTEN name.
- **Asset note** — `portrait_final.jpg` is a personal portrait; new HOKUTEN portraits required.

---

## 7. `#bov` — section chrome, disclaimer, success states

> The form itself (index.html:1167–1208 — field labels, placeholders, SMS consent, privacy links) belongs to the BOV-form and legal extractors. Only the chrome, the disclaimer, and the status strings are below.

### 7a. Section chrome — index.html:1159–1165

```html
<!-- BOV FORM -->
<section class="bov-section" id="bov">
  <div class="content">
    <div class="bov-grid">
      <div>
        <div class="eyebrow" style="margin-bottom: 18px;">Broker Opinion of Value</div>
        <h2 style="font-family: var(--serif); font-size: clamp(28px, 3.4vw, 46px); font-weight: 400; line-height: 1.1; margin-bottom: 18px;">What's your hotel <span style="font-style: italic; color: var(--gold);">worth</span>?</h2>
        <p style="font-family: var(--serif); font-style: italic; font-size: 16px; color: var(--ink-muted); max-width: 32em; margin-bottom: 40px;">Initial BOV delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data. No cost, no obligation.</p>
```

| Slot | Verbatim | Line |
|---|---|---|
| Eyebrow | `Broker Opinion of Value` | :1163 |
| Heading | `What's your hotel worth?` (`worth` italic gold) | :1164 |
| Subhead | `Initial BOV delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data. No cost, no obligation.` | :1165 |

> Note: the heading `What's your hotel worth?` is **duplicated verbatim** at :917 in the calculator section. Two H2s with identical text on one page. Flag for the HOKUTEN information architecture — differentiate or consolidate.

### 7b. The disclaimer paragraph — index.html:1211, verbatim

Rendered text:

```
Thinking about selling your hotel, now or down the road? Most owners hesitate to inquire until they're already committed to a sale. We'd rather meet you earlier than that. Prefer email? Send the property name, location, and available T-12 / STR information to dino.monteverde@kw.com. A call is optional.
```

Raw source (note the element carries `id="contact"` — this paragraph **is** the `#contact` anchor target used by the nav's scroll-margin rule at :66):

```html
        <p class="bov-disclaimer" id="contact">Thinking about selling your hotel, now or down the road? Most owners hesitate to inquire until they're already committed to a sale. We'd rather meet you earlier than that. Prefer email? Send the property name, location, and available T-12 / STR information to <a href="mailto:dino.monteverde@kw.com">dino.monteverde@kw.com</a>. A call is optional.</p>
```

> Unlike the two `.copy-email` links, this one is a real `mailto:` — clicking opens a mail client. Preserve that difference.

### 7c. Success / error / status states — `#bovStatus`

All strings that can appear in `<div class="bov-status" id="bovStatus" role="status" aria-live="polite">` (:1207):

| Trigger | Verbatim string | Class | Line |
|---|---|---|---|
| Client validation fails | `Please fix the highlighted fields.` | `bov-status` | :2225 |
| City not chosen from the list | `Please pick a city from the list.` (renders in `#cityErr`, not `#bovStatus`) | `field-err` | :2221 |
| Access key not set | `Form not yet connected — add the Web3Forms access key to go live.` | `bov-status` | :2233 |
| In flight | `Sending…` (U+2026) | `bov-status` | :2237 |
| **Success** | `Thank you — your request is in. Your initial BOV is delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data.` | `bov-status ok` | :2253 |
| API returned `success: false` | `Something went wrong. Please email dino.monteverde@kw.com directly.` | `bov-status err` | :2258 |
| Network throw | `Network error. Please email dino.monteverde@kw.com directly.` | `bov-status err` | :2263 |
| Calendly booking completed (writes into the **same** status element) | `Your consultation is booked — see your email for the calendar invite.` | `bov-status ok` | :1944 |

Success handler verbatim — index.html:2250–2264:

```js
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
```

Calendly cross-write verbatim — index.html:1941–1946:

```js
    window.addEventListener("message", function(e){
      if (e.origin === "https://calendly.com" && e.data && e.data.event === "calendly.event_scheduled"){
        var s = document.getElementById("bovStatus");
        if (s){ s.className = "bov-status ok"; s.textContent = "Your consultation is booked — see your email for the calendar invite."; }
      }
    });
```

> Calendly URL constant: `var CALENDLY_URL = "https://calendly.com/dino-monteverde-kw";` (index.html:1335) — personal booking link, needs a HOKUTEN replacement.

### Flags — BOV chrome

- **SECRET** — index.html:1169 contains a live Web3Forms access key. **Value not reproduced here**: `<REDACTED — env var WEB3FORMS_ACCESS_KEY>`. The source comment claims it is "safe to expose"; for HOKUTEN, route submissions server-side and keep the key out of the client bundle regardless.
- **VOICE** — the `:1211` disclaimer is **already team-first** ("We'd rather meet you earlier than that"), which sits oddly against the singular site around it. It ports almost unchanged; only the email address swaps. This paragraph is the best existing model for HOKUTEN voice on the whole page.
- **VOICE** — all three error strings name a person's inbox ("Please email dino.monteverde@kw.com directly"). Swap to a HOKUTEN team address.
- **EVIDENCE (P0)** — `within 48 hours` is a **service-level promise**, stated twice (subhead :1165 and success message :2253). It must be one that HOKUTEN can actually meet, and both copies must stay in sync. Note the conditional is load-bearing: the clock starts *after receipt of the T-12, STR report, franchise / PIP information, and other material property data* — do not drop the condition when tightening the copy.
- **EVIDENCE (P1)** — `No cost, no obligation.` is a commercial commitment; confirm it holds for HOKUTEN engagements.
- **A11y** — `role="status" aria-live="polite"` on the status div; preserve.
- **IA** — the `#contact` anchor is attached to a `<p>`, not a section. Nav item `Contact` (:835) points at `#bov`, while the footer has no `#contact` link. Untangle for HOKUTEN.

---

## 8. `.a100-arms` — index.html:1218–1227

Full block, verbatim (every word in the section):

```html
<!-- A100 ARMS -->
<section class="a100-arms">
  <div class="a100-inner">
    <div>
      <div class="eyebrow" style="margin-bottom: 14px;">Specialist Channel</div>
      <h3>Looking for off-market <span class="accent">opportunities</span>?</h3>
      <p>a100 Arms is our invite-only platform for vetted hotel investors. Access to deals that require confidentiality — partnership wind-downs, lender NDAs, ownership transitions where public listing would damage value.</p>
    </div>
    <a href="https://a100arms.com/signup" target="_blank" rel="noopener" class="btn-secondary">Request invite to <span class="lc">a100</span> Arms</a>
  </div>
</section>
```

| Slot | Verbatim | Line |
|---|---|---|
| Eyebrow | `Specialist Channel` | :1221 |
| Heading | `Looking for off-market opportunities?` (`opportunities` accented) | :1222 |
| Body | `a100 Arms is our invite-only platform for vetted hotel investors. Access to deals that require confidentiality — partnership wind-downs, lender NDAs, ownership transitions where public listing would damage value.` | :1223 |
| CTA label | `Request invite to a100 Arms` — the token `a100` is wrapped in `<span class="lc">` to force lowercase rendering | :1225 |
| **CTA destination** | `https://a100arms.com/signup` (`target="_blank" rel="noopener"`) | :1225 |

**Other a100 Arms references elsewhere on the page** (same destination, different label):

| Location | Label | Destination | Line |
|---|---|---|---|
| Listings empty state | `request off-market access` | `https://a100arms.com/signup` (`SIGNUP_URL`) | :1868 |
| Footer, "For Buyers" | `Request Invite to a100 Arms` (title case, no `.lc` span) | `https://a100arms.com/signup` | :1246 |
| Listings feed comment | data source is `https://a100arms.com/api/public/kwc-listings` (`FEED_URL`) | — | :1767 |

### Flags — a100 Arms

- **VOICE** — already plural: "a100 Arms is **our** invite-only platform". Ports as-is.
- **CASING** — the brand is rendered lowercase `a100` in the section CTA via `<span class="lc">` but appears title-cased `a100 Arms` in the footer link at :1246 and in body prose at :1223. Pick one and enforce it; source is inconsistent.
- **EVIDENCE (P1)** — "invite-only platform for vetted hotel investors" and the specific deal categories (`partnership wind-downs, lender NDAs, ownership transitions`) are capability claims. Confirm the a100 Arms relationship survives into HOKUTEN and that these categories are accurate.
- **DEPENDENCY** — a100 Arms is not decorative: the listings grid's live feed *and* its empty state both depend on `a100arms.com`. Coordinate with the listings/data extractor.

---

## 9. Footer — index.html:1230–1251

Full block, verbatim:

```html
<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-wordmark">
      <div class="wordmark">Dino <span class="amp">Monteverde</span></div>
      <div class="footer-affil">Keller Williams Commercial<br/>National Hospitality Division<br/>Sarhan Hotel Group</div>
      <address class="footer-contact">
        <span class="fc-line"><a href="#" class="copy-email" data-email="dino.monteverde@kw.com">dino.monteverde@kw.com</a><span class="copy-email-note" aria-live="polite"></span></span>
        <span class="fc-line"><a href="tel:+16507206995">650.720.6995</a></span>
        <span class="fc-block">
          <a href="https://www.google.com/maps/search/?api=1&query=118+N+Larchmont+Blvd%2C+Los+Angeles%2C+CA+90004" target="_blank" rel="noopener">118 N Larchmont Blvd<br/>Los Angeles<br/>California 90004<br/>United States</a>
        </span>
        <span class="fc-block fc-license">Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).<br/>Dino Monteverde, CA DRE #01948432.</span>
      </address>
    </div>
    <div class="footer-col"><h4>Quick Links</h4><ul><li><a href="#listings">Hotels for Sale</a></li><li><a href="#calculator">Hotel Worth Calculator</a></li><li><a href="#closings">Recent Closings</a></li><li><a href="#methodology">Methodology</a></li><li><a href="#bov">Contact</a></li></ul></div>
    <div class="footer-col"><h4>For Owners</h4><ul><li><a href="#bov">Request a Written BOV</a></li><li><a href="mailto:dino.monteverde@kw.com">Email Dino</a></li><li><a href="marketplace.html">Marketplace</a></li><li><a href="#bov">Sell Your Hotel</a></li></ul></div>
    <div class="footer-col"><h4>For Buyers</h4><ul><li><a href="#listings">Active Listings</a></li><li><a href="marketplace.html">Marketplace</a></li><li><a href="https://a100arms.com/signup" target="_blank" rel="noopener">Request Invite to a100 Arms</a></li></ul></div>
  </div>
```

### 9a. Column 1 — brand block (`.footer-wordmark`)

| Slot | Verbatim | Line |
|---|---|---|
| Wordmark | `Dino Monteverde` (surname gold-italic, same component as nav) | :1233 |
| Affiliation, line 1 | `Keller Williams Commercial` | :1234 |
| Affiliation, line 2 | `National Hospitality Division` | :1234 |
| Affiliation, line 3 | `Sarhan Hotel Group` — **SARHAN, does not port** | :1234 |
| Email | `dino.monteverde@kw.com` — `.copy-email` (clipboard, `href="#"`), flashes `✓ Copied` | :1236 |
| Phone | `650.720.6995` → `tel:+16507206995` | :1237 |
| Address | `118 N Larchmont Blvd` / `Los Angeles` / `California 90004` / `United States` → Google Maps search | :1239 |
| License | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).` `<br/>` `Dino Monteverde, CA DRE #01948432.` | :1241 |

### 9b. Column 2 — `Quick Links` (:1244)

| Label | Destination |
|---|---|
| `Hotels for Sale` | `#listings` |
| `Hotel Worth Calculator` | `#calculator` |
| `Recent Closings` | `#closings` |
| `Methodology` | `#methodology` |
| `Contact` | `#bov` |

### 9c. Column 3 — `For Owners` (:1245)

| Label | Destination |
|---|---|
| `Request a Written BOV` | `#bov` |
| `Email Dino` | `mailto:dino.monteverde@kw.com` (**real mailto**, unlike the `.copy-email` links above) |
| `Marketplace` | `marketplace.html` |
| `Sell Your Hotel` | `#bov` |

### 9d. Column 4 — `For Buyers` (:1246)

| Label | Destination |
|---|---|
| `Active Listings` | `#listings` |
| `Marketplace` | `marketplace.html` |
| `Request Invite to a100 Arms` | `https://a100arms.com/signup` (`target="_blank" rel="noopener"`) |

### 9e. Footer legal / tracked brand line + copyright — index.html:1248–1250

Raw source:

```html
  <div class="footer-legal">
    <a href="privacy.html">Privacy Policy</a> · <a href="sms-terms.html">SMS Terms</a> · Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group · Keller Williams Commercial · Larchmont. Nationwide coverage delivered through formal partner-brokerage relationships in every U.S. state. Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432. · sarhanhotelgroup.com · <span id="siteDomain">kwc-dinomonteverde.com</span> · © 2026 Dino Monteverde. All rights reserved.
  </div>
```

Rendered text:

```
Privacy Policy · SMS Terms · Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group · Keller Williams Commercial · Larchmont. Nationwide coverage delivered through formal partner-brokerage relationships in every U.S. state. Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432. · sarhanhotelgroup.com · kwc-dinomonteverde.com · © 2026 Dino Monteverde. All rights reserved.
```

**The tracked domain** is injected at runtime from a single source of truth — index.html:1266–1270:

```js
  /* ============ CONFIG ============ */
  /* SET THIS: the live domain. Single source of truth — change here only. */
  var SITE_DOMAIN = "kwc-dinomonteverde.com";
  document.getElementById("siteDomain").textContent = SITE_DOMAIN;
  document.querySelector('input[name=subject]').value = "New BOV request — " + SITE_DOMAIN;
```

`<span id="siteDomain">` in the footer legal line is overwritten with `SITE_DOMAIN` on load; the same constant also builds the BOV email subject `New BOV request — kwc-dinomonteverde.com` (static fallback at :1170).

| Slot | Verbatim | Line |
|---|---|---|
| Legal link 1 | `Privacy Policy` → `privacy.html` | :1249 |
| Legal link 2 | `SMS Terms` → `sms-terms.html` | :1249 |
| Practice-site disclosure | `Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group · Keller Williams Commercial · Larchmont.` | :1249 |
| Coverage claim | `Nationwide coverage delivered through formal partner-brokerage relationships in every U.S. state.` | :1249 |
| Brokerage disclosure | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.` | :1249 |
| Tracked domain | `sarhanhotelgroup.com · kwc-dinomonteverde.com` (second value from `SITE_DOMAIN`) | :1249, :1268 |
| Copyright | `© 2026 Dino Monteverde. All rights reserved.` | :1249 |

### 9f. Live ticker bar (below the footer) — index.html:1253–1263

Sticky bottom bar; body has `padding-bottom: 40px` (:73) to clear it.

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

| Slot | Verbatim | Note |
|---|---|---|
| Region label | `aria-label="Live market data"` | :1254 |
| Lead chip | `LIVE DATA` | :1256 |
| Series labels | `10-Yr Treasury`, `SOFR`, `Prime Rate`, `Fed Funds Upper`, `Fed Funds Lower` | :1257–1261 |
| Placeholder value | `—` (U+2014) for each series, shown until `/api/ticker-data` responds | :1257–1261 |
| Failure behaviour | **On fetch failure the dashes simply remain — there is no error string.** The renderer early-returns on an empty payload (`if (!items || !items.length) return;` with the trailing comment `// keep placeholder dashes`, :2275) and the `.catch` body is a bare comment (`/* leave placeholder dashes */`, :2285) | :2270–2286 |

> Labels come from the server response at runtime (`it.label` / `it.value`, :2278); the five above are the static fallbacks. The ticker data contract belongs to the FRED/API extractor.

### Flags — footer

- **SARHAN (P0)** — three separate occurrences: the affiliation line 3 `Sarhan Hotel Group` (:1234), the practice-site disclosure `Senior Associate at Sarhan Hotel Group` (:1249), and the tracked domain `sarhanhotelgroup.com` (:1249). **None port.**
- **VOICE (P0)** — `Personal practice site of Dino Monteverde` is the single most Dino-singular sentence on the site. HOKUTEN is a group; this whole disclosure has to be rewritten from the ground up, not edited.
- **VOICE** — `Email Dino` (:1245) → a team-first label (`Email the team` / `Email us`).
- **VOICE** — `© 2026 Dino Monteverde. All rights reserved.` → `© 2026 THE HOKUTEN GROUP. All rights reserved.` (exact wording pending; note the guardrail spelling **HOKUTEN**, never "Hakuten").
- **BRAND GUARDRAIL** — the footer is where KW Commercial legitimately belongs (compliance mark + verbatim disclosure line). The disclosure sentences at :1241 and :1249 are byte-exact-port candidates **subject to the legal extractor's authority** — they own the final text.
- **EVIDENCE (P0)** — `Nationwide coverage delivered through formal partner-brokerage relationships in every U.S. state` (repeated from :1152). Fifty-state coverage is a strong, checkable claim.
- **EVIDENCE (P0)** — both DRE numbers.
- **ARCHITECTURE** — the `SITE_DOMAIN` single-source-of-truth pattern should survive the port as an env/config constant, not a hard-coded string in two places.
- **DEAD/INCONSISTENT LINKS to fix, not port:** footer `Contact` → `#bov` (the `#contact` id lives on a `<p>` inside `#bov`); `Sell Your Hotel` and `Request a Written BOV` both → `#bov`; `Marketplace` appears in two columns.

---

## 10. FAQ / diligence Q&A

### There is NO FAQ section on this page.

Verified: zero matches for `faq`, `FAQ`, or `frequently asked` in index.html. There is no `FAQPage` JSON-LD either (see §1). There is no "Questions", "Common questions", or diligence-Q&A block anywhere in the 2290 lines. **Nothing to port. A HOKUTEN FAQ is net-new copywriting.**

> Precision on the accordion question: index.html contains **exactly one `<details>` element**, at :969 — `<details class="calc-refine">` with `<summary>Refine my estimate <span>(optional)</span></summary>`. It is an optional-inputs disclosure inside the calculator wizard (the calculator extractor's scope), **not** a Q&A construct, and it is the only disclosure widget on the page. So the "no FAQ" conclusion stands, but the source is not `<details>`-free — a HOKUTEN FAQ accordion has one existing interaction precedent to match.

What follows is the **raw material harvest**: every sentence already on the page that speaks to a standard owner question, quoted verbatim with its line, so a copywriter can build an FAQ from real source claims and invent nothing. Where the page says nothing on a topic, that is stated plainly — **do not fill the gap from imagination; escalate it as an open question.**

### 10a. Confidentiality / NDA

| # | Verbatim source sentence | Line |
|---|---|---|
| 1 | `Custom OM and targeted buyer outreach. Public launch across CoStar, LoopNet, and Crexi, supported by direct database distribution and owner outreach — unless the seller's circumstances require a controlled confidential process.` | :1100 |
| 2 | `Confidential OM and campaign launch` (step 02 headline) | :1100 |
| 3 | `A written BOV, fully confidential, no obligation. Here's what it covers:` | :1060 |
| 4 | `Get a confidential range from comp data in under 60 seconds. No email required to see the result.` | :918 |
| 5 | `Access to deals that require confidentiality — partnership wind-downs, lender NDAs, ownership transitions where public listing would damage value.` | :1223 |
| 6 | `Confidential` — used as a closing card's LP/SP value where the figure is not disclosed (Holiday Inn Express Brooklyn) | :894 |

> **Gap:** the page never states an NDA *process* for buyers (who signs, when, what is gated behind it). The only NDA reference is `lender NDAs` as a deal *category* at :1223. Sources #1 and #3–5 support an answer about seller-side confidentiality and the confidential-process option; **an NDA-workflow answer would be invented.** Escalate.

### 10b. 1031 exchange timelines

**Nothing. Zero occurrences of `1031`, `exchange`, `like-kind`, `45-day`, `180-day exchange`, `qualified intermediary`, or `boot` in index.html.**

The only "180 days" on the page is the **listing term**, not an exchange deadline:

| # | Verbatim source sentence | Line |
|---|---|---|
| 1 | `The listing term is 180 days, structured as two 90-day cycles.` | :1095 |

> **Do not let a copywriter conflate these.** Any 1031 FAQ answer is 100% net-new, must be written by someone qualified, and must not be sourced from this page. Escalate as an open question; flag that 1031 content carries tax-advice exposure and needs the legal extractor's review.

### 10c. Off-market access

| # | Verbatim source sentence | Line |
|---|---|---|
| 1 | `Looking for off-market opportunities?` | :1222 |
| 2 | `a100 Arms is our invite-only platform for vetted hotel investors. Access to deals that require confidentiality — partnership wind-downs, lender NDAs, ownership transitions where public listing would damage value.` | :1223 |
| 3 | `Request invite to a100 Arms` (CTA → `https://a100arms.com/signup`) | :1225 |
| 4 | `No active listings right now — request off-market access.` (listings empty state; link → `https://a100arms.com/signup`) | :1867–1868 |
| 5 | `Specialist Channel` (eyebrow framing off-market as a distinct channel) | :1221 |
| 6 | `Hospitality-only investment sales team. Senior broker collaboration on engagements requiring multi-broker coverage, deeper market reach, or co-listing depth.` — **SARHAN block, content does not port**, listed only for completeness | :1146 |

> This topic is the best-sourced of the ten. An FAQ answer can be assembled from #1–#5 with no invention. **Open question:** what "vetted" means operationally (the page never defines the vetting bar).

### 10d. BOV requirements — T-12 / STR / PIP

| # | Verbatim source sentence | Line |
|---|---|---|
| 1 | `Initial BOV delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data. No cost, no obligation.` | :1165 |
| 2 | `Prefer email? Send the property name, location, and available T-12 / STR information to dino.monteverde@kw.com. A call is optional.` | :1211 |
| 3 | `Thank you — your request is in. Your initial BOV is delivered within 48 hours after receipt of the T-12, STR report, franchise / PIP information, and other material property data.` (success state) | :2253 |
| 4 | `Written BOV with comp set, market analysis, and pricing recommendation. Delivered before the listing agreement.` (methodology step 01) | :1099 |
| 5 | `A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation. Request a written BOV below.` (calculator methodology note) | :920 |
| 6 | `Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.` (canonical disclaimer, reused in JS at :1566) | :920, :1566 |
| 7 | `A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below.` (JS variant of #5, em-dash instead of period) | :1568 |
| 8 | `A written BOV, fully confidential, no obligation. Here's what it covers:` | :1060 |
| 9 | `We pressure-test this estimate against your real numbers and a true comp set, then tell you straight if the range should be higher or lower.` | :1062 |
| 10 | `We walk through your specific value levers: rate, occupancy, brand, capital needs, and timing.` | :1063 |
| 11 | `You get a clearer number and a read on the market, whether you sell this year, in five, or never.` | :1064 |
| 12 | `No listing agreement, no pressure to sell. If now isn't the time, we'll tell you that too.` | :1065 |

> Sources #8–#12 sit inside the calculator's results panel (index.html:1058–1067) and are formally the **calculator extractor's** territory; they are quoted here because they are the richest BOV-scope prose on the page and an FAQ writer will need them. Treat the calculator extractor's copy of these as authoritative if the two documents diverge.
>
> This topic is fully sourceable — a "What do you need from me for a BOV?" answer and a "How is a BOV different from the calculator estimate?" answer can both be built from #1–#7 verbatim.
>
> **Voice note:** #9–#12 are already team-first ("We pressure-test", "we'll tell you"). They are the strongest existing HOKUTEN-voice sentences on the page and should anchor the FAQ's tone.

### 10e. Fees / engagement terms

| # | Verbatim source sentence | Line |
|---|---|---|
| 1 | `No cost, no obligation.` (BOV subhead) | :1165 |
| 2 | `A written BOV, fully confidential, no obligation.` | :1060 |
| 3 | `No listing agreement, no pressure to sell. If now isn't the time, we'll tell you that too.` | :1065 |
| 4 | `Delivered before the listing agreement.` (BOV precedes engagement) | :1099 |
| 5 | `The listing term is 180 days, structured as two 90-day cycles.` | :1095 |
| 6 | `At Day 90, if the hotel is not under contract, the seller decides: accept a live offer, reprice and authorize a second 90-day cycle, or conclude the engagement.` | :1095 |
| 7 | `No email required to see the result.` (calculator) | :918 |
| 8 | `Senior broker collaboration on engagements requiring multi-broker coverage, deeper market reach, or co-listing depth.` — **SARHAN block, content does not port** | :1146 |
| 9 | `Nationwide referral network and formal partner-brokerage relationships in every U.S. state for out-of-California engagements.` | :1152 |

> **Gap — this is the biggest hole on the page.** There is **no commission rate, no fee schedule, no listing-agreement terms, no marketing-cost allocation, no exclusivity language, and no cancellation clause** anywhere in index.html. Zero occurrences of `commission`, `%` in a fee context, `retainer`, `exclusive`, or `termination`.
>
> The page's fee posture is entirely negative-space: *the BOV is free and pre-engagement* (#1–#4), and *the engagement has a defined term with seller off-ramps* (#5, #6). An FAQ can honestly say that much. **Anything about what HOKUTEN charges must come from Razim, not from this source.** Escalate as a `blocked: needs fee/engagement terms from Razim` open question.

### 10f. License / brokerage structure

| # | Verbatim source sentence | Line |
|---|---|---|
| 1 | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).` `<br>` `Dino Monteverde, CA DRE #01948432.` (team card) | :1140 |
| 2 | Same two sentences, repeated in the footer contact block | :1241 |
| 3 | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.` (footer legal, third occurrence) | :1249 |
| 4 | `— The Brokerage of Record` / `Forward Wilshire Inc dba Keller Williams Larchmont` | :1150–1151 |
| 5 | `Nationwide referral network and formal partner-brokerage relationships in every U.S. state for out-of-California engagements. Brokerage of record for all listings.` | :1152 |
| 6 | `Nationwide coverage delivered through formal partner-brokerage relationships in every U.S. state.` (footer legal) | :1249 |
| 7 | `Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group · Keller Williams Commercial · Larchmont.` — **SARHAN + singular; does not port** | :1249 |
| 8 | `Current public hotel listings represented through Keller Williams Commercial.` | :1117 |
| 9 | `Keller Williams Commercial` / `National Hospitality Division` / `Sarhan Hotel Group` (footer affiliation stack — third line does not port) | :1234 |
| 10 | `118 N Larchmont Blvd` / `Los Angeles` / `California 90004` / `United States` (office of record) | :1139, :1239 |

> The brokerage-structure answer is well-sourced (#1–#6, #8) but is **entirely gated on the KW / Forward Wilshire paperwork** tracked in PROJECT-MEMORY. Status: `blocked: KW / Forward Wilshire paperwork gate`. The legal extractor owns the final wording; treat everything above as reference, not as approved copy.
>
> The three-times repetition of the same disclosure (#1, #2, #3) is deliberate compliance redundancy in the source. Decide consciously whether HOKUTEN keeps all three placements.

### 10g. Recommended FAQ question set (derived, for the copywriter — questions only, no invented answers)

| Proposed question | Sourceability | Blocking dependency |
|---|---|---|
| What do you need from me to produce a BOV? | **Fully sourced** — §10d #1–#3 | none |
| How fast do I get the BOV, and what does it cost? | **Fully sourced** — §10d #1, §10e #1 | evidence gate on `48 hours` |
| How is the online estimate different from a real BOV? | **Fully sourced** — §10d #5–#7 | none |
| Is my inquiry confidential? Can you run a quiet process? | **Fully sourced** — §10a #1–#3 | none |
| What does the sale process look like, start to finish? | **Fully sourced** — §5c steps 01–05 | evidence gate on timeframes |
| How long is the listing term, and what happens at Day 90? | **Fully sourced** — §5b | evidence gate |
| Who actually sees my listing? How wide is the reach? | **Fully sourced** — §5d | evidence gate on all four figures |
| How do I get access to off-market deals? | **Fully sourced** — §10c #1–#5 | a100 Arms relationship confirmed |
| Who is the brokerage of record? Can you work outside California? | **Sourced but gated** — §10f #1–#6 | `blocked:` KW / Forward Wilshire paperwork |
| What do you charge? | **NOT sourced** — page is silent | `blocked:` needs terms from Razim |
| Can you handle a 1031 exchange? | **NOT sourced** — page is silent | `blocked:` needs qualified input + legal review |
| Do buyers sign an NDA? What's gated? | **NOT sourced** — page is silent | `blocked:` needs process definition |

---

## Appendix A — Voice rewrite index (Dino-singular → HOKUTEN team-first)

Ordered by severity. Everything not listed here is already voice-clean or voice-neutral.

| # | Line | Verbatim source | Problem | Direction |
|---|---|---|---|---|
| 1 | :1249 | `Personal practice site of Dino Monteverde, Senior Associate at Sarhan Hotel Group` | Explicitly a one-person site; also Sarhan | Full rewrite. HOKUTEN is a group, not a personal practice. |
| 2 | :1129 | `The practitioner.` | Singular section heading over a one-person grid | Plural heading; genuine multi-person section. |
| 3 | :1245 | `Email Dino` | Names an individual as the contact channel | `Email the team` / HOKUTEN address. |
| 4 | :2011 | `Done — Dino will send your estimate and comp set shortly.` (calculator email-capture success; calculator extractor owns it) | Names an individual as the actor | `we'll send` |
| 5 | :1249 | `© 2026 Dino Monteverde. All rights reserved.` | Personal copyright holder | `© 2026 THE HOKUTEN GROUP.` |
| 6 | :823, :1233 | `Dino Monteverde` wordmark (nav + footer) | Personal wordmark in the brand position | HOKUTEN wordmark; KW mark demoted to footer per guardrail. |
| 7 | :1137 | `.team-creds` (full block) | Subjectless résumé fragment — ambiguous attribution | Decide per-stat: individual card vs. group claim. Never silently re-attribute. |
| 8 | :2258, :2263, :2015, :2021 | `Please email dino.monteverde@kw.com directly.` / `Couldn't send — please email dino.monteverde@kw.com.` / `Network error — please email dino.monteverde@kw.com.` | Personal inbox in error paths | HOKUTEN team address. |
| 9 | :18, :20, :33, :24, :31 | title / og:title / twitter:title / og:site_name / og:image:alt | Personal name is the site identity | HOKUTEN metadata set. |
| 10 | :1016 | `I'm not sure of my exact numbers — use typical figures` (calculator; other extractor) | **The only true first-person-singular string on the page** — and it is the *visitor's* voice, not the brand's, so it is correct as written | **Keep the "I" here.** Do not "fix" it. |

**Already team-first, port as-is:** `How we run a sale.` (:1092) · `We'd rather meet you earlier than that.` (:1211) · `a100 Arms is our invite-only platform` (:1223) · `We pressure-test this estimate…` (:1062) · `We walk through your specific value levers…` (:1063) · `…we'll tell you that too.` (:1065) · every methodology step body (:1099–1103).

---

## Appendix B — Evidence-gate register candidates (reference 06 rows required)

Every factual claim in this document's scope. `P0` = blocks ship; `P1` = blocks ship of that block only.

| Sev | Claim (verbatim) | Where | Type |
|---|---|---|---|
| P0 | `$200M+` aggregate volume | :858, :1137 | stat |
| P0 | `12` closed transactions / `12 hospitality transactions` | :859, :1137 | stat |
| P0 | `836K+` total square feet | :860 | stat |
| P0 | `CoStar Power Broker` `Q3 '25 · Q1 '26 · Q2 '26` | :861 | award |
| P0 | `Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026` | :1137 | award (duplicate of above, different format) |
| P0 | `11 hotel-asset transactions + 1 hotel-management-company M&A` | :1137 | stat |
| P0 | `~400K` hotel-investor reach | :1107 | stat |
| P0 | `~60K` hotel owners reached | :1108 | stat |
| P0 | `1,500` direct hotel-owner relationships | :1109 | stat |
| P0 | `30K` SMS-capable contacts | :1110 | stat (also TCPA-adjacent) |
| P0 | `Initial BOV delivered within 48 hours after receipt of…` | :1165, :2253 | service-level promise |
| P0 | `The listing term is 180 days, structured as two 90-day cycles.` | :1095 | contractual timeframe |
| P0 | `market reads at Days 30 and 60` / `At Day 90…` | :1095 | contractual timeframe |
| P0 | `Average close: 60–90 days post-LOI.` | :1103 | timeframe |
| P0 | `formal partner-brokerage relationships in every U.S. state` | :1152, :1249 | coverage claim (2 places) |
| P0 | `CA DRE #01870534` (Forward Wilshire Inc dba Keller Williams Larchmont) | :1140, :1153, :1241, :1249 | license |
| P0 | `CA DRE #01948432` (individual) | :1140, :1241, :1249 | license |
| P1 | `USMC veteran.` | :1137 | biographical |
| P1 | `Former hotel owner-operator.` | :1137 | biographical |
| P1 | `Senior Associate · Hospitality Investment Sales` | :1136 | title |
| P1 | `National Hospitality Division` | :850, :1234 | division name |
| P1 | `No cost, no obligation.` | :1165 | commercial commitment |
| P1 | `Public launch across CoStar, LoopNet, and Crexi` | :1100 | platform/subscription claim |
| P1 | `verified comps backed by CoStar and RCA` | :920, :1568 | data-source claim |
| P1 | `invite-only platform for vetted hotel investors` | :1223 | capability claim |
| P1 | `118 N Larchmont Blvd, Los Angeles, California 90004` | :1139, :1239 | office of record |
| P1 | `650.720.6995` | :1138, :1237, :31 | contact |
| P1 | Eyebrow year `2026` | :850 | staleness risk |

---

## Appendix C — Kill list (flagged, never ported)

| Item | Verbatim | Where | Reason |
|---|---|---|---|
| Sarhan in meta description | `Sarhan Hotel Group at Keller Williams Commercial.` | :19 | Sarhan guardrail |
| Sarhan in og:site_name | `Dino Monteverde — KW Commercial · Sarhan Hotel Group` | :24 | Sarhan guardrail |
| Team card 2 role | `Sarhan Hotel Group` | :1145 | Sarhan guardrail |
| Team card 2 link | `sarhanhotelgroup.com →` → `https://sarhanhotelgroup.com` | :1147 | Sarhan guardrail |
| Footer affiliation line 3 | `Sarhan Hotel Group` | :1234 | Sarhan guardrail |
| Footer legal disclosure | `Senior Associate at Sarhan Hotel Group` | :1249 | Sarhan guardrail |
| Footer tracked domain | `sarhanhotelgroup.com` | :1249 | Sarhan guardrail |
| Nav co-brand lockup | KW mark leading the wordmark | :819–826 | HOKUTEN-first branding; KW is footer-only |
| Web3Forms access key | `<REDACTED — env var WEB3FORMS_ACCESS_KEY>` | :1169 | secret; never in the repo or client bundle |
| OG card asset | `og-card-v2.jpg` | :26–27 | raster contains old name + phone |
| Portrait asset | `portrait_final.jpg` | :1133 | personal portrait |
| Calendly link | `https://calendly.com/dino-monteverde-kw` | :1335 | personal booking link |
| Crexi profile link | `https://www.crexi.com/profile/dino-monteverde-dinomon` | :869, :1118, and the `CREXI_PROFILE` constant at :1768 (which is what renders at :1877 and is also the per-card fallback at :1840) | personal profile |

---

## Appendix D — Known gaps / ambiguities for the orchestrator

1. **No JSON-LD, no canonical, no robots meta anywhere in index.html** — all structured data is net-new work for HOKUTEN, not a port. Confirmed by exhaustive grep.
2. **No FAQ section exists.** §10 is a harvest, not a port. Three of twelve proposed FAQ questions (fees, 1031, NDA workflow) have **zero** source material and are marked `blocked:`.
3. **No scroll cue in the hero.** If the HOKUTEN design calls for one it is net-new.
4. **Duplicate H2 `What's your hotel worth?`** at :917 (calculator) and :1164 (BOV) — one page, two identical headings. Needs an IA decision.
5. **Casing inconsistencies in the source**, preserved verbatim above, needing a deliberate call: `Request a written BOV` (:854, :1093) vs `Request a Written BOV` (:837, :1245); `a100 Arms` lowercase-forced (:1225) vs title case (:1246); `Q3 '25` (:861) vs `Q3 2025` (:1137).
6. **`#contact` anchor is on a `<p>`**, not a section (:1211); nav "Contact" points at `#bov`. Structural cleanup needed.
7. **Overlap with the calculator extractor** at index.html:1058–1067 (`.result-callinfo` — the "What happens next" BOV bullets). Quoted in §10d #8–#12 because the FAQ needs them; their extractor is authoritative on final wording.
8. **Overlap with the legal extractor** on the footer disclosure sentences (:1241, :1249) and the license lines (:1140). Quoted here as footer structure; theirs is authoritative on text.
9. **`marketplace.html` is out of this document's scope** and was not read for copy. It is linked from nav (:836) and twice from the footer (:1245, :1246); whoever owns it must confirm whether a Marketplace page exists in HOKUTEN Phase 1 or whether those three links are dropped.
10. **The KW / Forward Wilshire paperwork gate** blocks all brokerage-of-record copy (§6e, §9e, §10f) from shipping publicly under the HOKUTEN name.
