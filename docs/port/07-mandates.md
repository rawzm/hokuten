# Port Pack 07 — `#mandates` (Capital & Standing Mandates)

**Source of record (READ-ONLY):** `~/Documents/Dino/dino-sites/kwc-dinomonteverde/marketplace.html` (433 lines + trailing newline).
**Target:** Hokuten landing section `#mandates` — dark, condensed, 3–4 cards (skill ref 04 §`#mandates`; decision 2026-08-07). The full Marketplace page stays **Phase 3**.
**Type contract (from PHASE-1-IMPLEMENTATION §5):** `type Mandate = { headline: string; criteria: string; source: 'kwc-marketplace' }`.

**Character fidelity — verified by codepoint, do not normalize:**
- **EM DASH `—` U+2014** — complete inventory: lines 6, 82, 209, 222, 238, 242, 252, 256, 260, 281, 282, 352. Of these the *mandate headlines* are 222, 242, 252, 256, 260, 281; 282 is a body line (`Seeking one asset — not portfolios.`); 6/82/209/238/352 are title, a CSS comment, hero sub, requirements deck, and a Featured-Opportunities card.
- Numeric ranges are **EN DASH `–` U+2013** — complete inventory: lines 248, 278, 282, 310, 316.
- Tag separators are **MIDDLE DOT `·` U+00B7** — complete inventory: lines 221, 226, 302, 308, 314, 317, 320, 326, 332, 338, 344, 350, 400 (400 is the footer legal line — do not port, see F-02).
- Line 284 contains **`≥` U+2265**.
- Source HTML escapes ampersands as `&amp;`. In TS/TSX content files the character is a literal `&`.

---

## 1. Page frame (context only — not shipped)

### 1.1 `<head>` metadata — `marketplace.html:6-12`

```html
<title>Marketplace | Dino Monteverde — Hospitality Investment Sales</title>
<meta name="description" content="Active buy-side mandates, capital requirements, and featured development & JV hotel opportunities. Submit your asset or requirement to Dino Monteverde.">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:title" content="Marketplace | Dino Monteverde">
<meta property="og:description" content="Live buy-side capital, standing requirements, and featured development & joint-venture hotel opportunities.">
<meta property="og:url" content="https://kwc-dinomonteverde.com/marketplace.html">
```

**Do not port.** Person-branded, points at the old domain. Phase 3 only, and rewritten Hokuten-first.

### 1.2 Hero — `marketplace.html:206-210`

```html
<section class="hero">
  <div class="eyebrow">Active Mandates &amp; Opportunities</div>
  <h1 class="display-headline">The <span class="accent">Marketplace</span></h1>
  <p class="hero-sub">Live buy-side capital, standing requirements, and featured development &amp; joint-venture opportunities. If you hold an asset — or a requirement — that fits, let's talk.</p>
</section>
```

Rendered text, verbatim:

```
Active Mandates & Opportunities
The Marketplace
Live buy-side capital, standing requirements, and featured development & joint-venture opportunities. If you hold an asset — or a requirement — that fits, let's talk.
```

**Phase 3.** The eyebrow phrase "Active Mandates & Opportunities" and the sub's first clause "Live buy-side capital, standing requirements" are reusable as Phase-1 `#mandates` deck copy *if* Razim approves — they assert no unverified fact. Note the apostrophe in `let's` is ASCII `'` (U+0027), not a typographic apostrophe.

---

## 2. SECTION A — "Capital Actively Deploying" (the two capital-deploying entries)

### 2.1 Section head — `marketplace.html:213-218`

```html
<section class="content" id="immediate">
  <div class="section-head">
    <div class="kicker">Immediate Needs</div>
    <h2>Capital Actively <span class="accent">Deploying</span></h2>
    <p>Mandates we are working directly. Third-party valuation is required before any asset is presented.</p>
  </div>
```

Rendered text, verbatim:

```
Immediate Needs
Capital Actively Deploying
Mandates we are working directly. Third-party valuation is required before any asset is presented.
```

**Voice:** already team-first ("we are working"). Ports to Hokuten with **zero** voice surgery. This is the single best discretion line on the page and is recommended as the `#mandates` deck line (see §5.1).

### 2.2 Entry A1 — Japanese fund — `marketplace.html:220-224`

```html
    <div class="spot">
      <span class="tag">Buy-Side · National</span>
      <h3>Japanese Fund — US Hotel Portfolio Build</h3>
      <p>A Japanese fund is acquiring hotels across the US to build a portfolio. Location and class agnostic, with a purchase-price range from $2M up to $300M. Third-party valuation required before presentation.</p>
    </div>
```

Field breakdown (verbatim):

| Field | Verbatim value | Line |
|---|---|---|
| Tag | `Buy-Side · National` | 221 |
| Headline | `Japanese Fund — US Hotel Portfolio Build` | 222 |
| Body | `A Japanese fund is acquiring hotels across the US to build a portfolio. Location and class agnostic, with a purchase-price range from $2M up to $300M. Third-party valuation required before presentation.` | 223 |
| Dollar range | `from $2M up to $300M` (per asset / purchase price) | 223 |
| Geography | `across the US` · `National` | 221, 223 |
| Class | `Location and class agnostic` | 223 |
| Gate | `Third-party valuation required before presentation.` | 223 |

**Register status:** `verified-current` — skill ref 06 row *"Mandate: Japanese fund, US portfolio build, $2M–$300M per asset"*. **SHIPS (card 1).**

### 2.3 Entry A2 — $1B+ family-office Co-GP — `marketplace.html:225-229`

```html
    <div class="spot">
      <span class="tag">Co-GP · $1B+</span>
      <h3>Luxury Hotel &amp; Mixed-Use JV Search</h3>
      <p>A beverage-industry family office is deploying $1B+ into luxury hotel and mixed-use development on a Co-GP basis. Sole requirement: sponsor owns land free and clear. Project minimum $50M.</p>
    </div>
```

Field breakdown (verbatim):

| Field | Verbatim value | Line |
|---|---|---|
| Tag | `Co-GP · $1B+` | 226 |
| Headline | `Luxury Hotel & Mixed-Use JV Search` (source escapes `&amp;`) | 227 |
| Body | `A beverage-industry family office is deploying $1B+ into luxury hotel and mixed-use development on a Co-GP basis. Sole requirement: sponsor owns land free and clear. Project minimum $50M.` | 228 |
| Capital | `$1B+` | 226, 228 |
| Structure | `on a Co-GP basis` | 228 |
| Sole criterion | `Sole requirement: sponsor owns land free and clear.` | 228 |
| Project minimum | `Project minimum $50M.` | 228 |

**Register status:** `verified-current` — ref 06 row *"Mandate: $1B+ family-office JV capital, luxury/mixed-use, $50M project min"*. **SHIPS (card 2)** — with the counterparty-narrowing descriptor removed, see §4 flag F-05.

---

## 3. SECTION B — "Standing Buyer & Investor Criteria" (all eight standing requirements)

### 3.1 Section head — `marketplace.html:234-239`

```html
<section class="content" id="requirements">
  <div class="section-head">
    <div class="kicker">Client Requirements</div>
    <h2>Standing Buyer &amp; Investor <span class="accent">Criteria</span></h2>
    <p>Active mandates from groups we represent. Have your requirement listed on the bulletin — submit it below.</p>
  </div>
```

Rendered text, verbatim:

```
Client Requirements
Standing Buyer & Investor Criteria
Active mandates from groups we represent. Have your requirement listed on the bulletin — submit it below.
```

**Voice:** already "we". The second sentence ("Have your requirement listed on the bulletin — submit it below.") presumes a submission form that does not exist in Phase 1 — **Phase 3 only**.

### 3.2 B1 — Select-Service & Above — $200M+ — `marketplace.html:241-250`

```html
    <div class="req">
      <h4>Select-Service &amp; Above — $200M+</h4>
      <p>Investment group targeting select-service and above; portfolios welcome.</p>
      <ul>
        <li>Hilton, Hyatt, Marriott, or independent that can be branded</li>
        <li>Drive-to leisure markets, multiple demand drivers, high barrier to entry</li>
        <li>RevPAR ~$100, unencumbered by management</li>
        <li>Primary markets 6–7 cap; secondary/tertiary 8–10 cap</li>
      </ul>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Select-Service & Above — $200M+` | 242 |
| Body | `Investment group targeting select-service and above; portfolios welcome.` | 243 |
| Flags | `Hilton, Hyatt, Marriott, or independent that can be branded` | 245 |
| Market type | `Drive-to leisure markets, multiple demand drivers, high barrier to entry` | 246 |
| RevPAR | `RevPAR ~$100, unencumbered by management` | 247 |
| Cap rates | `Primary markets 6–7 cap; secondary/tertiary 8–10 cap` | 248 |

(Block layout: 241 `<div class="req">` · 242 `<h4>` · 243 `<p>` · 244 `<ul>` · 245–248 the four `<li>` · 249 `</ul>` · 250 `</div>`.)

**Register status:** `verified-current` — ref 06 row *"Mandate: select-service portfolio criteria ($200M+, RevPAR ~$100)"*. **SHIPS (card 3).** The cap-rate line (248) and flag list (245) sit in the same source block but are **not itemized** in the register row — see flags F-06 and F-07.

### 3.3 B2 — Japanese Style Onsen Resort — Land Site — `marketplace.html:251-254`

```html
    <div class="req">
      <h4>Japanese Style Onsen Resort — Land Site</h4>
      <p>International resort group entering the US market, seeking a hot-spring location for a Japanese-style onsen resort hotel. No stated hard cap; evaluated case by case. Open to JV partners.</p>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Japanese Style Onsen Resort — Land Site` | 252 |
| Body | `International resort group entering the US market, seeking a hot-spring location for a Japanese-style onsen resort hotel. No stated hard cap; evaluated case by case. Open to JV partners.` | 253 |
| Dollar range | *none stated* — `No stated hard cap; evaluated case by case.` | 253 |
| Geography | `entering the US market` · `a hot-spring location` | 253 |

**Register status: NOT in the register.** Needs a new `verified-current` row before it can ship. Listed in §7 as a bench option (thematically the strongest fit for the 北天 / Japan thread).

### 3.4 B3 — Luxury Select-Service Deployment — $300M+ — `marketplace.html:255-258`

```html
    <div class="req">
      <h4>Luxury Select-Service Deployment — $300M+</h4>
      <p>Group deploying $300M+ into select-service and above; preference for luxury and Hilton, Hyatt, Marriott. Average deal size ~$50M.</p>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Luxury Select-Service Deployment — $300M+` | 256 |
| Body | `Group deploying $300M+ into select-service and above; preference for luxury and Hilton, Hyatt, Marriott. Average deal size ~$50M.` | 257 |
| Capital | `$300M+` | 256, 257 |
| Avg deal size | `Average deal size ~$50M.` | 257 |

**Register status: NOT in the register.** Bench option (§7).

### 3.5 B4 — Conversion Stock — Economy to Upper-Midscale — `marketplace.html:259-262`

```html
    <div class="req">
      <h4>Conversion Stock — Economy to Upper-Midscale</h4>
      <p>Group seeking economy, midscale, and upper-midscale hotels in the urban core for conversion to supportive/transitional housing.</p>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Conversion Stock — Economy to Upper-Midscale` | 260 |
| Body | `Group seeking economy, midscale, and upper-midscale hotels in the urban core for conversion to supportive/transitional housing.` | 261 |
| Dollar range | *none stated* | — |
| Geography | `in the urban core` | 261 |

**Register status: NOT in the register.** Bench option (§7). Note the political sensitivity of `supportive/transitional housing` — Razim's call.

### 3.6 B5 — Campus-Adjacent Hotels — `marketplace.html:263-266`

```html
    <div class="req">
      <h4>Campus-Adjacent Hotels</h4>
      <p>Group seeking hotels within a half-mile radius of college campuses, ideally Power-conference universities.</p>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Campus-Adjacent Hotels` | 264 |
| Body | `Group seeking hotels within a half-mile radius of college campuses, ideally Power-conference universities.` | 265 |
| Geography | `within a half-mile radius of college campuses` | 265 |

**Register status: NOT in the register.** Bench option (§7).

### 3.7 B6 — Land, Entitled Sites & Office Conversions — `marketplace.html:267-275`

```html
    <div class="req">
      <h4>Land, Entitled Sites &amp; Office Conversions for Hotels</h4>
      <p>Group focused on Phoenix (Scottsdale) and Atlanta (Midtown), plus a tiered national list:</p>
      <ul>
        <li>Tier 1 (very active): Los Angeles, Nashville, Austin, New York</li>
        <li>Tier 2 (case-by-case): Vancouver, Toronto, Boston, Chicago, San Diego</li>
        <li>Tier 3 (reactive): DC, Denver, Miami, Seattle, San Francisco</li>
      </ul>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Land, Entitled Sites & Office Conversions for Hotels` | 268 |
| Body | `Group focused on Phoenix (Scottsdale) and Atlanta (Midtown), plus a tiered national list:` | 269 |
| Tier 1 | `Tier 1 (very active): Los Angeles, Nashville, Austin, New York` | 271 |
| Tier 2 | `Tier 2 (case-by-case): Vancouver, Toronto, Boston, Chicago, San Diego` | 272 |
| Tier 3 | `Tier 3 (reactive): DC, Denver, Miami, Seattle, San Francisco` | 273 |

**Register status: NOT in the register.** Bench option (§7). Note Tier 2 includes non-US cities (Vancouver, Toronto) — check against any "United States"-only coverage copy elsewhere on the Hokuten site.

### 3.8 B7 — Hotel Management Company Acquisition — `marketplace.html:276-279`

```html
    <div class="req">
      <h4>Hotel Management Company Acquisition</h4>
      <p>Buyers seeking further management-company acquisitions, with offers in the 8x–10x EBITDA range.</p>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Hotel Management Company Acquisition` | 277 |
| Body | `Buyers seeking further management-company acquisitions, with offers in the 8x–10x EBITDA range.` | 278 |
| EBITDA multiple | `8x–10x EBITDA` (EN DASH) | 278 |

**Register status:** `verified-current` — ref 06 row *"Mandate: management-company acquisitions, 8x–10x EBITDA"*. **SHIPS (card 4).** Pairs well with the closings stat "1 hotel-management-company M&A" (ref 06 team bios) — proof that the desk has actually executed this trade.

### 3.9 B8 — Japanese Buyer — Single Asset, Off-Market — `marketplace.html:280-289`

```html
    <div class="req">
      <h4>Japanese Buyer — Single Asset, Off-Market</h4>
      <p>$75M–$150M for B/B+ assets in B-and-above neighborhoods. Strong preference for off-market. Seeking one asset — not portfolios.</p>
      <ul>
        <li>Wood frame 22+ yrs (≥50% wood frame), brick 39+ yrs, reinforced concrete 47+ yrs</li>
        <li>Top-2 cities of each state near well-known universities/school districts</li>
        <li>Target IRR 15%</li>
        <li>Multifamily &amp; hotels in FL, TX, NV, LA, GA, SC, NC, NY, WA</li>
      </ul>
    </div>
```

| Field | Verbatim value | Line |
|---|---|---|
| Headline | `Japanese Buyer — Single Asset, Off-Market` | 281 |
| Body | `$75M–$150M for B/B+ assets in B-and-above neighborhoods. Strong preference for off-market. Seeking one asset — not portfolios.` | 282 |
| Dollar range | `$75M–$150M` (EN DASH) | 282 |
| Vintage rules | `Wood frame 22+ yrs (≥50% wood frame), brick 39+ yrs, reinforced concrete 47+ yrs` | 284 |
| Geography (city) | `Top-2 cities of each state near well-known universities/school districts` | 285 |
| Return target | `Target IRR 15%` | 286 |
| Geography (state) | `Multifamily & hotels in FL, TX, NV, LA, GA, SC, NC, NY, WA` | 287 |

**Register status: NOT in the register.** Bench option (§7) — strongest bench candidate after B2 (hard numbers, IRR target, off-market posture). Note the vintage rules are depreciation-schedule tells (Japanese tax treatment of used US real estate); they are precise and quotable, but confirm they are still current before shipping.

**Timeframe note:** *no* entry on this page carries an explicit timeframe (no "by Q4", no "within 90 days"). The only temporal words on the page are the standing/immediacy framings: `Immediate Needs` (215), `Capital Actively Deploying` (216), `Standing Buyer & Investor Criteria` (237), `Active mandates` (238), `Tier 1 (very active)` (271), `Tier 3 (reactive)` (273). Do not invent one.

---

## 4. SECTION C — "Featured Opportunities" (9 deal cards) — **DO NOT SHIP IN PHASE 1**

Quoted for completeness of the port pack only. **None of these nine has a register row**; every one is a specific live/off-market deal naming assets, prices, or third parties. Phase 3, marketplace page, subject to a fresh evidence pass.

### 4.1 Section head — `marketplace.html:294-299`

```html
<section class="content" id="opportunities">
  <div class="section-head">
    <div class="kicker">Development &amp; JV</div>
    <h2>Featured <span class="accent">Opportunities</span></h2>
    <p>Current development sites and joint-venture opportunities available through our network.</p>
  </div>
```

### 4.2 The nine cards — `marketplace.html:301-354`

(Wrapper `<div class="grid three">` is line 300, its `</div>` is line 355; the nine `.card` blocks occupy 301–354, six lines each.)

```html
    <div class="card">
      <span class="tag">CA · San Diego</span>
      <h3>Downtown Entitled Mixed-Use Site</h3>
      <p>1.5-acre downtown site entitled for an upper-upscale 300-room hotel, ~25,168 sf leasable retail, and 48 for-sale condominiums.</p>
      <div class="price">~$180M project cost</div>
    </div>
    <div class="card">
      <span class="tag">CO · Frisco</span>
      <h3>Upscale Hotel Development</h3>
      <p>27-key hotel with ~3,500 sf in-house F&amp;B. Adjacent lot available to expand to 80–90 keys via skybridge.</p>
      <div class="price">~$70M total project cost</div>
    </div>
    <div class="card">
      <span class="tag">TN · Pigeon Forge</span>
      <h3>Hotel Development Site</h3>
      <p>5 acres off-market, ~$450–500/sf, adjacent to a proposed Ritz-Carlton. Partial take-down available.</p>
      <div class="price">Off-market · inquire</div>
    </div>
    <div class="card">
      <span class="tag">TX · Austin</span>
      <h3>Hotel Development Site</h3>
      <p>8.2 acres across two parcels, LI-PDA zoning permitting 95-ft heights. Guidance ~$40,000/unit per the yield study.</p>
      <div class="price">~$25.5M</div>
    </div>
    <div class="card">
      <span class="tag">TX · Houston</span>
      <h3>Entitled Mixed-Use Site</h3>
      <p>~2.77-acre triangular site for a 405-room hotel, ~61,644 sf retail, and 120 for-sale condos. Open to JV.</p>
      <div class="price">$35M</div>
    </div>
    <div class="card">
      <span class="tag">TX · Houston · JV</span>
      <h3>Downtown Residential/Hotel JV</h3>
      <p>Sponsor redeveloping a vacant downtown building into ~400 apartments + a 400-room hotel. Seeking a partner for the hotel component; sponsor retains residential.</p>
      <div class="price">JV partnership</div>
    </div>
    <div class="card">
      <span class="tag">UT · Virgin (Zion)</span>
      <h3>Ultra-Luxury Resort</h3>
      <p>45+ acre parcel at Zion National Park entitled for 80 keys.</p>
      <div class="price">~$82M capital investment</div>
    </div>
    <div class="card">
      <span class="tag">JPN · Niseko, Hokkaido</span>
      <h3>Ski-Out Hotel &amp; Condo</h3>
      <p>Redevelopment of an existing hot-spring ryokan into a modern extended-stay hotel.</p>
      <div class="price">~$73M total project cost</div>
    </div>
    <div class="card">
      <span class="tag">JPN · Hakuba, Nagano</span>
      <h3>Iwatake Village Mixed-Use Renewal</h3>
      <p>Renewal of Iwatake Village in Hakuba, Japan — mixed-use resort development.</p>
      <div class="price">¥3.3B (~$22M)</div>
    </div>
```

Key counts/prices index (verbatim, for Phase 3): `300-room hotel` · `~25,168 sf` · `48 for-sale condominiums` · `~$180M project cost` (303-305) — `27-key` · `~3,500 sf` · `80–90 keys` · `~$70M total project cost` (309-311) — `5 acres` · `~$450–500/sf` · `Off-market · inquire` (315-317) — `8.2 acres` · `95-ft heights` · `~$40,000/unit` · `~$25.5M` (321-323) — `~2.77-acre` · `405-room hotel` · `~61,644 sf retail` · `120 for-sale condos` · `$35M` (327-329) — `~400 apartments + a 400-room hotel` · `JV partnership` (333-335) — `45+ acre parcel` · `80 keys` · `~$82M capital investment` (339-341) — `~$73M total project cost` (345-347) — `¥3.3B (~$22M)` (351-353).

---

## 5. Discretion / confidentiality copy + CTA copy (verbatim inventory)

### 5.1 Discretion lines — every occurrence

| Verbatim line | Source | Phase-1 use |
|---|---|---|
| `Mandates we are working directly. Third-party valuation is required before any asset is presented.` | `marketplace.html:217` | **Recommended `#mandates` deck line.** Team-voice already; no unverified claim. |
| `Third-party valuation required before presentation.` | `marketplace.html:223` | Optional micro-line under card 1; redundant if 217 is used as the deck. |
| `Active mandates from groups we represent. Have your requirement listed on the bulletin — submit it below.` | `marketplace.html:238` | Sentence 1 only is portable; sentence 2 is Phase 3 (no bulletin form in Phase 1). |
| `Strong preference for off-market.` | `marketplace.html:282` | Ships only with B8 (not registered). |
| `Current development sites and joint-venture opportunities available through our network.` | `marketplace.html:298` | Phase 3. |
| `Off-market · inquire` | `marketplace.html:317` | Phase 3 (price-slot vocabulary; note Hokuten's registered fallback string is `Price on Request` per ref 06). |
| `All inquiries are handled confidentially.` | `marketplace.html:362` | Portable. |
| `All figures preliminary and subject to verification.` | `marketplace.html:401` | **Portable** — strong footer/section micro-disclaimer, no brand entanglement. |

Skill ref 04 specifies one line of discretion copy for the section, its own example being `Access and disclosure happen in stages.` — that string is **NOT** in the kwc source; it is Hokuten-authored. Use `marketplace.html:217` if the requirement is "verbatim from source"; use the ref-04 line if the requirement is "Hokuten voice." Both are acceptable; do not blend them into a third invented sentence.

### 5.2 CTA block — `marketplace.html:359-368`

```html
<section class="content" id="submit">
  <div class="cta">
    <h2>Have an Asset or a <span class="accent">Requirement</span>?</h2>
    <p>Submit your hotel for valuation, or list a buyer requirement on the bulletin. All inquiries are handled confidentially.</p>
    <div class="cta-row">
      <a href="mailto:dino.monteverde@kw.com?subject=Marketplace%20Submission" class="btn-primary">Submit an Opportunity</a>
      <a href="index.html#bov" class="btn-secondary">Contact Dino</a>
    </div>
  </div>
</section>
```

Rendered text, verbatim:

```
Have an Asset or a Requirement?
Submit your hotel for valuation, or list a buyer requirement on the bulletin. All inquiries are handled confidentially.
Submit an Opportunity
Contact Dino
```

**Phase-1 disposition:** none of these buttons ports as-is.
- `Submit an Opportunity` — ref 06 copy pattern bans bare "Submit"; the mailto is person-addressed.
- `Contact Dino` — singular voice; must become team-first.
- Ref 04 mandates the section close with the ghost CTA `PRIVATE ACCESS →` → `https://a100arms.com/signup`. Use that. Retain `All inquiries are handled confidentially.` (362) as the supporting line if a second line is wanted.

---

## 6. MUST-NOT-SHIP / flag register for this page

| # | Item | Source | Reason |
|---|---|---|---|
| F-01 | `Sarhan Hotel Group` in the footer affiliation stack | `marketplace.html:375` | **Hard guardrail** — no Sarhan Hotel Group branding anywhere on the new site. Do not port the `footer-affil` block. |
| F-02 | `© 2026 Dino Monteverde · Sarhan Hotel Group · KW Commercial. …` | `marketplace.html:400` | Same guardrail. The *brokerage disclosure* inside this sentence is canonical and already lives in ref 06 §Compliance text — port the disclosure from ref 06, **not** from this line, so Sarhan never enters the repo. |
| F-03 | `Dino Monteverde` wordmark lockup + `Keller Williams Commercial` descriptor in nav/footer | `marketplace.html:183-190, 374-375` | Hokuten-first branding; KW Commercial is footer compliance mark only. (Nav: wordmark 187, descriptor 188, `alt="Keller Williams Commercial"` on the mark 184. Footer: wordmark 374, KW descriptor is the first line of the `footer-affil` stack at 375.) |
| F-04 | Page `<title>` / meta / OG referencing Dino + `kwc-dinomonteverde.com` | `marketplace.html:6-12` | Old domain + person brand. |
| F-05 | `A beverage-industry family office` | `marketplace.html:228` | **Counterparty-narrowing descriptor.** "Beverage-industry family office deploying $1B+" is a small enough set to be identifiable. The cleared register row says only *"$1B+ family-office JV capital"*. Ship as `A family office` (see §7 card 2) or drop the sentence — this is the one editorial deletion in the four shipped cards, and it needs Razim's OK to be logged as a decision. |
| F-06 | `Primary markets 6–7 cap; secondary/tertiary 8–10 cap` | `marketplace.html:248` | Same source block as the cleared select-service row, but the register row itemizes only `$200M+, RevPAR ~$100`. Either extend that register row to cover the cap band, or omit the line. **Default in §7: omitted.** |
| F-07 | `Hilton, Hyatt, Marriott, or independent that can be branded` (245) and `preference for luxury and Hilton, Hyatt, Marriott` (257) | `marketplace.html:245, 257` | Third-party trademarks in body copy. Permitted as nominative use, but the `#brands` trademark microcopy (ref 06) must be present on the page, and the phrasing must never imply partnership/endorsement. **Default in §7: omitted from card criteria.** |
| F-08 | All nine Featured Opportunities cards | `marketplace.html:301-354` | Specific live deals; **zero register rows**; pricing/entitlement figures unverified for Hokuten; several are third-party sponsor deals. Phase 3. |
| F-09 | `adjacent to a proposed Ritz-Carlton` | `marketplace.html:316` | Third-party luxury trademark used to add value to an off-market land pitch, based on an unconfirmed *proposed* project. Highest-risk single claim on the page. |
| F-10 | `Iwatake Village` / `Niseko, Hokkaido` / `Hakuba, Nagano` project names | `marketplace.html:344-353` | Named counterparty projects in Japan; attractive for the 北天 narrative and therefore tempting — still unverified, still Phase 3. |
| F-11 | `Have your requirement listed on the bulletin — submit it below.` (238) and `list a buyer requirement on the bulletin` (362) | `marketplace.html:238, 362` | Promises a submission bulletin that does not exist in Phase 1. Do not ship the promise without the form. |
| F-12 | `--gold: #B8943D;` / `--gold-dim: #C9A04A;` | `marketplace.html:26-27` | kwc gold is the **kit** gold. Hokuten website gold is `#B8902E` (ref 01, `globals.css`). Never copy this CSS. |
| F-13 | Google Fonts `<link>` (Cormorant Garamond / Inter / JetBrains Mono) | `marketplace.html:15-17` | External CDN; Phase 1 self-hosts pinned variable fonts. |
| F-14 | `118 N Larchmont Blvd, Los Angeles, CA 90004, United States` · `650.720.6995` · `dino.monteverde@kw.com` | `marketplace.html:380-382` | Not prohibited (Dino's contact is `verified-current` in ref 06), but this is *Dino's* footer, not the group's. Take contact data from ref 06 / the contact port pack, not from here. |
| F-15 | `Marketplace` nav item + `marketplace.html` links | `marketplace.html:198, 393` | No marketplace route exists in Phase 1. `#mandates` is an on-page anchor; the menu overlay entry is `06 Mandates → #mandates` (ref 04). |
| F-16 | `$200M+` in the B1 headline | `marketplace.html:242` | **Collision risk:** `$200M+` is also the Hokuten aggregate-volume stat (ref 06). Two different meanings of `$200M+` on one page. Card 3's criteria must make the buy-side meaning unmistakable, and `#stats` and `#mandates` should not be visually adjacent. |
| F-17 | `supportive/transitional housing` | `marketplace.html:261` | Politically charged for a luxury-hospitality brand; also not registered. Bench only, Razim's call. |
| F-18 | `Vancouver, Toronto` in Tier 2 | `marketplace.html:272` | Non-US geography; check against any "across the United States" coverage copy before shipping B6. |
| F-19 | `Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534). Dino Monteverde, CA DRE #01948432.` — **second, separate occurrence** in the footer Contact column | `marketplace.html:383` | Same disclosure text as inside line 400, but a distinct source line, and the one F-02 does *not* cite. It names a **person's** DRE (`Dino Monteverde, CA DRE #01948432`) as the licensee of record. Hokuten's compliance block is a **team** block — port the byte-exact disclosure from ref 06 §Compliance text, and do not carry the personal-licensee sentence into a group-branded footer without Razim's call on whose license is named. |

**Not found on this page (verified by grep):** the Sarhan-era `~$1B total hotel sales` claim, the Caliber / Whispering Pines / Juniper testimonials, and any KW corporate award — all of which are `pending-verification` or `prohibited` in ref 06. Nothing on marketplace.html reintroduces them.

**Secrets:** none. No API keys, tokens, or credentials appear in `marketplace.html` (its only script is nav toggle + clipboard copy, lines 405-430).

---

## 7. SHIP LIST — ready-to-use TypeScript

Target file: `site/content/mandates.ts`. Every `headline` is byte-exact from source (with `&amp;` → `&`). Every `criteria` string is assembled **only from words that appear verbatim in the source line cited** — clauses are lifted whole and joined with the ` · ` middot separator from ref 06's data-line copy pattern. No word is invented, reordered within a clause, or rephrased.

```ts
// site/content/mandates.ts
// Source: kwc-dinomonteverde/marketplace.html (read-only port). Every claim below has a
// `verified-current` row in design-skill reference 06. Do not add a card without one.

export type Mandate = {
  headline: string;
  criteria: string;
  source: 'kwc-marketplace';
};

export const mandates: Mandate[] = [
  {
    // marketplace.html:222-223 · register: "Japanese fund, US portfolio build, $2M–$300M per asset"
    headline: 'Japanese Fund — US Hotel Portfolio Build',
    criteria:
      'Location and class agnostic · $2M up to $300M · Third-party valuation required before presentation',
    source: 'kwc-marketplace',
  },
  {
    // marketplace.html:227-228 · register: "$1B+ family-office JV capital, luxury/mixed-use, $50M project min"
    // "beverage-industry" descriptor intentionally dropped — see port pack 07 flag F-05.
    headline: 'Luxury Hotel & Mixed-Use JV Search',
    criteria:
      '$1B+ into luxury hotel and mixed-use development on a Co-GP basis · Sole requirement: sponsor owns land free and clear · Project minimum $50M',
    source: 'kwc-marketplace',
  },
  {
    // marketplace.html:242-247 · register: "select-service portfolio criteria ($200M+, RevPAR ~$100)"
    // Cap band (line 248) and flag list (line 245) omitted — see flags F-06, F-07.
    headline: 'Select-Service & Above — $200M+',
    criteria:
      'Investment group targeting select-service and above; portfolios welcome · RevPAR ~$100, unencumbered by management',
    source: 'kwc-marketplace',
  },
  {
    // marketplace.html:277-278 · register: "management-company acquisitions, 8x–10x EBITDA"
    headline: 'Hotel Management Company Acquisition',
    criteria:
      'Buyers seeking further management-company acquisitions · Offers in the 8x–10x EBITDA range',
    source: 'kwc-marketplace',
  },
];

// Section deck line — marketplace.html:217, verbatim, already team-voice.
export const mandatesDeck =
  'Mandates we are working directly. Third-party valuation is required before any asset is presented.';
```

**The one case change (declare it, don't hide it):** card 4's second clause ships as `Offers in the 8x–10x EBITDA range`; source line 278 reads `…, with offers in the 8x–10x EBITDA range.` — lowercase `offers`, preceded by `with`. Lifting the clause to the head of a `·`-separated segment forces the initial capital. No other word in any `criteria` string differs from source in any respect, including case. (Card 1 likewise drops the leading `from` of `from $2M up to $300M`; no letter changes.)

**Dash check before commit:** `—` in cards 1/3 headlines is U+2014; `8x–10x` in card 4 is U+2013. A QA grep for `8x-10x` (ASCII hyphen) must return zero hits.

If only **three** cards fit the layout, drop card 3 (`Select-Service & Above — $200M+`) — it carries flag F-16's `$200M+` collision with the aggregate-volume stat, and the remaining three (Japan / $1B+ Co-GP / management-co M&A) give better range: cross-border, structured equity, platform M&A.

### 7.1 Bench — additional mandates available if we want more cards

Each is real source content that reads as verified, but **none has a register row**. Adding any one requires a new `verified-current` row in skill ref 06 plus a dated PROJECT-MEMORY.md entry.

| # | Verbatim headline | Verbatim criteria material | Source | Why it's a good bench card |
|---|---|---|---|---|
| 1 | `Japanese Buyer — Single Asset, Off-Market` | `$75M–$150M for B/B+ assets in B-and-above neighborhoods · Strong preference for off-market · Seeking one asset — not portfolios` (+ `Target IRR 15%`) | `marketplace.html:281-286` | Hardest numbers on the bench; the off-market posture is exactly the Hokuten thesis. |
| 2 | `Japanese Style Onsen Resort — Land Site` | `International resort group entering the US market, seeking a hot-spring location for a Japanese-style onsen resort hotel · No stated hard cap; evaluated case by case · Open to JV partners` | `marketplace.html:252-253` | Best narrative fit with 北天 / the Japan corridor; no dollar figure to verify. |
| 3 | `Luxury Select-Service Deployment — $300M+` | `Group deploying $300M+ into select-service and above · Average deal size ~$50M` (flags omitted per F-07) | `marketplace.html:256-257` | Clean capital + deal-size pair; overlaps card 3 thematically. |
| 4 | `Land, Entitled Sites & Office Conversions for Hotels` | `Group focused on Phoenix (Scottsdale) and Atlanta (Midtown), plus a tiered national list` (+ Tier 1/2/3 city lists) | `marketplace.html:268-273` | Shows national reach; needs the F-18 non-US-cities check. |
| 5 | `Campus-Adjacent Hotels` | `Group seeking hotels within a half-mile radius of college campuses, ideally Power-conference universities` | `marketplace.html:264-265` | Memorable, tight, no numbers to verify. |
| 6 | `Conversion Stock — Economy to Upper-Midscale` | `Group seeking economy, midscale, and upper-midscale hotels in the urban core for conversion to supportive/transitional housing` | `marketplace.html:260-261` | Real mandate; carries the F-17 tone question. |

---

## 8. Structure worth translating (not cloning)

The source pattern is sound and maps cleanly onto ref 04's dark `#mandates`: **kicker (mono, gold, tracked) → serif H2 with one italic accent word → italic serif deck → cards**. Two card grammars exist and the Hokuten section should pick **one**:

- **Spot card** (`marketplace.html:87-90`, used for the two capital entries): dark panel, mono uppercase tag, serif headline, muted body. This is already the dark treatment `#mandates` calls for — translate its *hierarchy*, not its CSS.
- **Req row** (`marketplace.html:94-99`, used for the eight standing criteria): hairline top rule, serif H4, muted paragraph, gold-square bullet list.

Ref 04 resolves the collision: hairline border on dark, serif headline, **mono criteria row**, no logos, no names. That is why §7 emits a single mono `criteria` string per card rather than the source's bullet lists.

Anchors in source: `#immediate`, `#requirements`, `#opportunities`, `#submit`, with `scroll-margin-top: 88px` (`marketplace.html:37`). Hokuten collapses all of it into the single anchor `#mandates`.

---

## 9. Voice conversion notes (Dino-singular → Hokuten team-first)

This page is the **least** singular of the kwc set — it is already written in "we". Verbatim originals are quoted above; conversions needed are limited to:

| Original (verbatim) | Source | Conversion |
|---|---|---|
| `Contact Dino` | 365 | Team-first CTA. Phase 1 uses ref 04's `PRIVATE ACCESS →` here instead. |
| `Submit an Opportunity` → `mailto:dino.monteverde@kw.com` | 364 | Person-addressed mailto; route to the group contact per the contact port pack. |
| `Dino <span class="amp">Monteverde</span>` wordmark | 187, 374 | THE HOKUTEN GROUP lockup. |
| `Personal practice site of…` framing implied by title/meta | 6-11 | Group framing. |

Already correct and portable unchanged: `Mandates we are working directly.` (217) · `groups we represent` (238) · `available through our network` (298) · `All inquiries are handled confidentially.` (362).

---

## 10. Open items / ambiguities for Razim

1. **F-05** — deleting `beverage-industry` from card 2 is an editorial change to source copy. Needs an explicit OK + a dated PROJECT-MEMORY entry (or a decision to keep it).
2. **F-06 / F-07** — extend the ref-06 select-service register row to cover the cap band (`6–7` / `8–10`) and the flag names, or ship card 3 without them. §7 defaults to *without*.
3. **F-16** — `$200M+` means two different things on the Hokuten landing page. Confirm card 3 ships at all, and that `#stats` and `#mandates` are not adjacent.
4. **Currency of the mandates** — all eight standing requirements are undated on the source page and none carries a timeframe. Ref 06 status `verified-current` was set 2026-08-07 for four of them; confirm with Dino that the buyers are still live before the section goes public (a stale mandate is worse than no mandate).
5. **Discretion line choice** — `marketplace.html:217` (verbatim from source) vs ref 04's Hokuten-authored `Access and disclosure happen in stages.` §7 exports the former as `mandatesDeck`; swap if the Hokuten-authored line is preferred.
