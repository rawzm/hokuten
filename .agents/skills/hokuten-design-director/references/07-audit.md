# 07 — Audit

## Table Of Contents
Severity model · P0 gates · P1 gates · P2 checks · Anti-AI-slop gates · 40+ usability gates · Pre-deploy QA script · Output

## Severity model

P0 = clarity, accessibility, correctness, compliance, performance-gate failure — blocks ship.
P1 = hierarchy, spacing, consistency, motion discipline — fix before the section is called done.
P2 = polish — batch into polish passes.
Any P0 ⇒ verdict `fail`. Findings name the violated gate + file/evidence. Append every audit to `docs/design/AUDIT_LOG.md` (dated, never deleted).

## P0 gates (fail if violated)

- Any user-visible "Hakuten", any kit-gold `#B8943D` in CSS, any accent other than `--accent` in UI. **Updated 2026-08-17 (L2/R3):** the website gold is `#B08D3F` (`--accent`) / `#C8A552` (`--accent-dim`) — prior gate text, kept visible: ~~"any gold other than `--gold`"~~ at `#B8902E`. **A surviving `#B8902E` or `#F7F4ED` anywhere — CSS, component, generator script, or a regenerated raster — is a P0**, not a leftover.
- **Wrong type faces — new 2026-08-17 (L3/R13).** Any `Fraunces` or `IBM Plex Mono` reference in `app/`, `components/`, `content/`, `lib/` or the generator scripts. The three faces are Cormorant Garamond / Inter / JetBrains Mono; an `axes:` declaration carried over from Fraunces is a build error (Cormorant has no optical-size axis). Grep: `grep -rn "Fraunces\|IBM Plex" app components content lib scripts`.
- **北天 standing in for the English name — new 2026-08-17 (`GUIDE` line 37, binding).** 北天 is an accent mark only: it may not appear as a headline, brand line, wordmark, `<title>`, OG string or nav mark in place of "The Hokuten Group". Glyph-mosaic artwork and `<KanjiAccent>` stay legitimate — decorative, with the English name reading adjacent in real text. Grep: `grep -rn "北天" content components/brand` → review every hit for standing-in, don't blind-fail.
- **Award-set compression — new 2026-08-17 (L6).** Any `5×` / `5x` / `five-time` / `Annual 2026` string; the 2025 Annual Top Firm rendered inside the individual strip, merged into a count, or framed as Hokuten team recognition; any award caption not matching its `verified-current` register row; a badge that is cropped, recoloured, redrawn, combined, or wrapped in a link. The only legitimate multiplier on the site is the mandates EBITDA range `8x–10x`.
- **Forbidden copy — new 2026-08-17.** `12 closed hotel sales` · `hotel investment platform` · `from Asia to the Americas` · `Sarhan`/`Mheni`/`Schulman` in shipped copy · the Cy-Fair `$2.85M`/debt/lender/owner details · the Yulee "Costco anecdote" · the `$200M+`/`12` figures rendered **without** the locked hedge beneath them.
- **Tagline sprawl — new 2026-08-17 (R15).** "True north for hotel owners" anywhere other than the single footer brand line. Grep: `grep -rn "True north" site/` → exactly one hit.
- **A listing outside the three-property allowlist rendering — new 2026-08-17 (L8).** `content/listings.ts` is the rendered source of truth; a `/api/public-listings` record outside the allowlist must be dropped and logged, never rendered, and no browser code may point at the a100 endpoint. A Monday or any other server token reachable from the client bundle is the same P0 as the FRED key.
- Missing footer compliance disclosure, paraphrased compliance/TCPA text, or more than one KW Commercial compliance-mark instance sitewide — exactly one, in the footer (D1, 2026-08-08; the pre-revisit audit found it twice; re-confirmed unchanged 2026-08-10, D18).
- **Header/Trust/footer lockup gate — sizing superseded 2026-08-10 (D18, Design Revisit 2; supersedes and removes the old "KW lockup in the header" P0 from 2026-08-07, which D1 already killed 2026-08-08).** The theme-matched KW/Hokuten lockup (blue lockup on Theme B, gold on Theme G) is required in all three placements. Fails if: the lockup doesn't match the active theme in any placement; header height (`--nav-h`, now 72px desktop / 64px mobile) changes across nav states (scrolled/unscrolled, menu open/closed — "height-stable"); the header lockup does not render at its corrected ~52px desktop / ~46–48px mobile height; the Trust (`#stats`) lockup is not visibly larger than the header lockup; there is no real-text brand line adjacent to any lockup instance, or visually-hidden, for SEO/AT — a brand name that exists only inside a raster still fails.
- A public claim not in the verified register, or a `pending-verification` claim rendered live.
- Stats/names/awards baked into images, or stat counters that show 0/placeholder without JS.
- Body text <16px; tap target <44px; keyboard trap; missing focus state; contrast below WCAG AA (check gold-on-dark specifically, and the money/live green tokens on every surface they bind on — ref 01).
- Hover-only information on touch; consent modal closable by outside click (spec: shake, not close).
- Performance gate breach ([05-motion.md](05-motion.md)): LCP ≥2.5s, CLS ≥0.02, INP ≥200ms, critical-path JS >200KB gzip, full landing-route JS >340KB gzip (D7, 2026-08-08 — supersedes the unreachable 180KB single figure; measured basis: 272KB actual against a 129KB gzip framework floor), hero jank >12ms frames.
- **D5/D11 gate (2026-08-08, hero-slideshow language superseded 2026-08-10):** `AsciiCanvas`, its shimmer layer, or the frame-sequence morph loop present or running on any route — still absolutely banned, no exception. Hero art must be a real image-based slideshow: slide 1 is a real server-rendered `<picture>`/`next/image` with `priority` and explicit width/height (never a canvas snapshot, never hidden pending hydration); the transition between slides is a deterministic CSS mosaic-tile reveal only (no WebGL, no GSAP, no third-party slider package); at most 5 slides; slide-1-only under reduced-motion/Save-Data with no autoplay and no mosaic. Fails on any canvas-based hero render, any hero slideshow exceeding 5 slides, or a non-static reduced-motion state.
- Calculator math or defaults altered from the ported `CONFIG` without a dated PROJECT-MEMORY.md decision.
- Secrets in client code or repo (only public keys allowed: Web3Forms access key; FRED key must stay server-side env).
- Layout-property animation; reveals that re-fire; missing reduced-motion state.
- **No production path beginning with `Ref/` — new 2026-08-10 (D21, Design Revisit 2).** No browser route, `next/image` loader, `import`, or deployed bundle may read `Ref/` directly. All runtime imagery resolves through the public manifest under `site/public/`. QA grep: `grep -rn '"Ref/\|from "\.\./Ref\|/Ref/' site/app site/components site/content site/lib`.
- **No `scroll-well`, section `overflow-y-auto`, fixed result height, masked overflow, or sticky subpanel inside `#calculator` — new 2026-08-10 (D14, reverses the D6-era exception that used to live here).** The five-step valuation section has no internal section scrollbar under any circumstance; a nested scroll region here is now a defect, not a density solution. QA grep: `grep -rn 'scroll-well\|overflow-y-auto' site/components/calculator site/components/sections/CalculatorSection.tsx`.
- **No CoStar asset outside `#stats` — new 2026-08-10 (D12, reverses D3's split placement); extended 2026-08-17 (L6) to the 4+1 split** — inside `#stats` the four dated INDIVIDUAL awards form one strip and the 2025 Annual **Top Firm** renders in its own separately-labelled prior-firm/team block after them, never merged into the strip and never counted. The shipped artwork must be the Social Media Kit **Winner Badges** (near-square medallions), never the 600×135 email-signature banners the CoStar README marks *"Not for website use"*. All five verified CoStar assets (2 Annual + 3 Quarterly) render inside `#stats` and nowhere else on the landing page — specifically, none may render inside `#closings`/Track Record. `RecognitionStrip` (or any replacement performing the same job) must not be imported by the closings section.
- **No `& INDEPENDENTS` string or independent-mark node anywhere on the page — new 2026-08-10 (D9/D11).** The brand-chip marquee ships only the supplied franchise chips. QA grep: `grep -rni "independent" site/content/brands.ts site/components` (review hits for the literal marketing string/node, not incidental code comments).
- **The twelve-panel order is fixed — reordered 2026-08-17 (L5 / R5, Dino's named sequence).** Current: hero (with the `#brands` rail inside it) → `#stats` → `[01] #closings` → `[02] #listings` → `[03] #calculator` → `[04] #method` → `[05] #faq` → `[06] #bov` → `[07] #team` → `[08] #doors` → `[09] #mandates` → footer. Prior order, kept visible: ~~hero → `#stats` → `[01] #closings` → `[02] #listings` → `[03] #calculator` → `[04] #method` → `[05] #doors` → `[06] #mandates` → `[07] #team` → `[08] #faq` → `[09] #bov` → footer~~ (2026-08-10). No section invented, removed, or renumbered relative to [04-page-anatomy.md](04-page-anatomy.md) → Section order — and `content/nav.ts`'s `navLinks` **and** `menuItems` must match the shipped order, with indices 01–09 unique and unbroken.
- **Menu overlay full-bleed gate — new 2026-08-10 (D17).** `MenuOverlay`'s root carries no generic dialog inset/margin/max-width/rounded-corner class — `fixed inset-0`, `100dvh`×`100vw`, zero outer gap, at every device-pixel zoom in Chromium, Safari, and Firefox. At normal acceptance viewports `scrollHeight === clientHeight` on the overlay (no normal-case scrollbar); a scrollbar is acceptable only in the documented short-height/200%-zoom exceptional fallback, never at a standard desktop or mobile size.
- **LIVE occurs exactly once, outside the ticker's animated half — new 2026-08-10 (D19).** The `LIVE` string/status dot lives in the ticker's fixed, non-animated status block; it must never also appear duplicated inside the moving/cloned metric content (including inside an `aria-hidden` clone, which would still be a duplicate DOM node even if not separately announced).
- **Money green is currency-only — new 2026-08-10 (D13/D19, restates ref 01's binding scope as an audit gate).** `text-money`/`--money`/`--color-live` render a ticket price, a valuation result, or the ticker's LIVE dot and nothing else. Fails if a button, border, badge, success/error state, occupancy figure, cap rate, or any decorative element binds to `--money`, `--color-money`, or `--color-live`.

## P1 gates

- More than 4 type sizes in a section; hierarchy attempted via size where weight/color/spacing would do.
- Deal data not in mono / not tabular-nums; stat numerals set in mono (they're serif).
- Gold exceeding accent scarcity (~5% of viewport); texture on UI chrome; two signature effects in one viewport.
- Non-Lucide icons, emoji, text-glyph arrows outside mono labels.
- Section missing its micro-label index; anchor without `scroll-margin-top`; card grids breaking the 3/1-up rule.
- Copy violating voice rules (banned words, vague CTAs, adjective-padded metrics).
- Empty/loading/error states unstyled (listings empty state, ticker dashes, form errors in `--brick`).
- **Brands marquee (D2, 2026-08-08 — supersedes any grayscale-only check; chip-height figure superseded again 2026-08-10, D9/D11):** chips rendering in grayscale instead of color; chip height outside the **current** target — ~64px desktop / 52–56px tablet / 42–44px mobile (the D2-era 44–52px/36px figure is retired, see ref 01/04) — or an uneven row (not uniform optical height); the row missing its "flags we transact across" label (never "partners"/"clients"); trademark microcopy that isn't byte-exact, or that renders as more than one tiny asterisked line; insufficient repetitions to cover an ultrawide screen (D19's measured-half principle applied to the brand loop).
- **Card shadows (D4, 2026-08-08; hover-reveal scope corrected 2026-08-10, D13):** any card *other than* a deal ticket carrying a shadow — hairline-border is still the rule for everything else; or a deal ticket whose shadow changes on hover, uses a gray blur halo instead of `--shadow-ticket`/`--shadow-ticket-dark`, or that translates/lifts/scales beyond the existing 1.02 cap on hover. **Reversed direction, D13:** a SOLD/closing ticket that does *not* reveal full color on hover/focus/touch is now itself the finding — D4's original "SOLD tickets stay muted forever" exemption is dead (ref 03/05).
- **Density (D6, 2026-08-08; calculator exception removed 2026-08-10, D14):** a dead band between two adjacent same-surface sections (missing `section-join`); a desktop section that neither fits its viewport (`section-fit`) nor scrolls internally with a visible affordance (`scroll-well`) when its content genuinely exceeds it — **except `#calculator`, which may never use `scroll-well` as of D14 (that specific case is now a P0 gate above, not a P1 density check).**
- **Stage-shell adoption (D9, new 2026-08-10):** a landing-route section wrapped in `container-hk`/`container-wide` instead of `stage-shell` (those utilities are scoped to legal/editorial routes and locally-narrow prose now, not the landing route); a `stage-shell` composition whose prose exceeds a locally-constrained measure (a paragraph with no `max-w-[68ch]`-equivalent constraint, reading as a 180-character line at full viewport width).
- **Native paging (D10, new 2026-08-10; snap itself REMOVED 2026-08-10 evening by D22 — corrected here 2026-08-17).** The snap system this gate policed no longer exists, so the gate now reads as the plain no-scroll-jacking rule — and **the presence of any scroll-snap CSS, `PagedMode` island or Lenis paged-mode gate on the landing route is itself the finding.** Original text, kept for the record: any wheel/touch listener, `preventDefault`, delta threshold, or synthetic scroll jump anywhere on the landing route (scroll-jacking is still absolutely banned — see the P0 no-scroll-jacking language throughout); mandatory snap still active outside its qualifying tier (below 1024×760, coarse pointer, reduced motion, or a zoomed/reflowed layout that no longer fits); a `page-panel` taller than the usable screen that is missing its `data-tall` measurement, making its middle unreachable under mandatory snap.
- **Loader condition matrix (D16, new 2026-08-10):** the loader firing on soft in-page navigation, an anchor click, a `bfcache` restoration, or a section snap; the loader failing to release body scroll on a timeout or error path; a fake numeric percentage; duration exceeding the 2s hard cap.

## P2 checks

- Stagger caps (≤6 children), hover polish, "Copied" flash present, italic accent word exactly one per headline, badge set consistency, OG image matches cover recipe.

## Anti-AI-slop gates (fail if present)

Centered-gradient hero with three feature cards · default purple/violet glow · uniform pill-card grids · glassmorphism without cause · stock or AI-generated photography · fake/rounded metrics ("500+ happy clients") · emoji bullets · generic CTAs ("Get Started") · Inter-only typography with no display voice · dark mode toggle nobody asked for.

**Clarification, not a loophole (D5, 2026-08-08):** "stock or AI-generated photography" bans fake *photography presented as real* — fabricated properties, fake people, stock-looking scenes standing in for the track record. It does not ban stylized art. The Razim-approved 「北天」 glyph-mosaic treatment (ref 03 §Imagery) is the house signature and passes cleanly: it is typographic halftone art, sole primitive the repeated 「北天」 unit, never presented as a photograph. Alt text is the tell either way — it must describe the depicted subject (the hotel, the scene), never the treatment ("glyph-mosaic rendering of…" inside alt text is itself a finding).
Cross-check the built page against vibecoded-design-tells patterns and copy against no-ai-slop before launch.

## 40+ / CRE-familiarity gates

- A LoopNet/Crexi user finds price, keys, cap rate, and how to contact within 5 seconds of `#listings`.
- Body text 16px minimum, 18px preferred in reading sections; line length 60–75ch; no low-contrast "luxury gray" body text.
- Nav labels are literal (Listings, Track Record, Valuation) — no cleverness in wayfinding; cleverness lives in art and headlines.
- Phone number visible in plain text (not icon-only); email copy-to-clipboard AND mailto.
- Nothing requires drag, long-press, or gesture knowledge; scroll and click/tap complete every journey.
- Print of `#closings` + `#listings` is legible (owners print things).

## Pre-deploy QA script (run all; all must pass)

```bash
# from site/ — extend as sections land
for d in app components content lib; do [ -d "$d" ] || echo "MISSING $d"; done      # absent dirs must be visible, not silently OK
grep -ri "hakuten" app components content lib && echo FAIL || echo OK               # spelling
grep -ri "B8943D" app components content lib && echo FAIL || echo OK                # kit gold in code
grep -ri "sarhan" app components content lib && echo FAIL || echo OK                # brand scrub (allowed only in PROJECT-MEMORY/BRAINSTORM)
grep -rq "Forward Wilshire" app components && echo OK || echo FAIL                  # compliance line present
grep -ri "FRED_API_KEY" app components lib --exclude-dir=api && echo FAIL || echo OK  # key referenced only in app/api
grep -rEi "(sk_live|pk_live|AKIA[0-9A-Z]{16}|-----BEGIN|password\s*=)" app components content lib && echo FAIL || echo OK  # secret-shaped strings

# — Design Revisit 2 additions (2026-08-10) —
grep -rn '"Ref/\|from "\.\./Ref\|/Ref/' app components content lib && echo FAIL || echo OK           # D21: no production path into Ref/
grep -rn "scroll-well\|overflow-y-auto" components/calculator components/sections/CalculatorSection.tsx 2>/dev/null && echo FAIL || echo OK  # D14: no nested scroll in the calculator
grep -rn "RecognitionStrip" components/sections/ClosingsSection.tsx components/cards/ClosingCard.tsx 2>/dev/null && echo FAIL || echo OK       # D12: no CoStar award component wired into Closings
grep -rni "independent" content/brands.ts components/sections/*.tsx components/hero 2>/dev/null && echo "REVIEW HITS" || echo OK               # D9/D11: no "& INDEPENDENTS" marketing string (review, don't blind-fail — code comments may legitimately say "independently")
grep -rn "container-hk\|container-wide" app/page.tsx components/hero components/sections 2>/dev/null && echo "REVIEW HITS" || echo OK           # D9: landing route should use stage-shell, not the legacy container

# — Launch round additions (2026-08-17) —
grep -rn "B8902E\|b8902e\|F7F4ED\|f7f4ed" app components content lib scripts && echo FAIL || echo OK   # L2: retired gold / retired paper
grep -rn "Fraunces\|IBM Plex" app components content lib scripts && echo FAIL || echo OK                  # L3: retired faces
grep -rn "5×\|5x\|Annual 2026\|five-time" app components content && echo REVIEW || echo OK               # L6: award compression (8x–10x mandates row is the one legal multiplier)
grep -rin "investment platform\|12 closed hotel sales\|from Asia to the Americas" app components content && echo FAIL || echo OK  # forbidden descriptors
grep -rn "PLACEHOLDER:confirm" content && echo FAIL || echo OK                                             # D3: no unanswered FAQ ships
grep -rn "True north" app components content | wc -l                                                       # R15: must be exactly 1 (footer brand line)
grep -rn "chat.whatsapp" app components content | wc -l                                                    # exactly 1 invite; zero `CyEa`
grep -rn "北天" content components/brand && echo REVIEW || echo OK                                          # kanji accent-only rule — review each hit
grep -rn "scroll-snap\|PagedMode" app components && echo FAIL || echo OK                                   # D22: snap stays removed
grep -rn "MONDAY_\|monday.com" components content && echo FAIL || echo OK                                  # intake token/endpoint must be server-side only

npx next build                                                                       # zero errors, check route JS sizes vs D7 budgets (critical path <=200KB gz, full route <=340KB gz)
grep -r "FRED_API_KEY" .next/static 2>/dev/null && echo FAIL || echo OK             # post-build: key absent from client bundles
```

Plus manual: JS-disabled pass (stats/nav/content readable), keyboard-only pass, iPhone SE + 13" laptop + 27" desktop viewports, reduced-motion pass, Lighthouse mobile ≥90/95.

**Manual passes — the snap pass is retired 2026-08-17 (D22 removed snap; the measurement it implied survives as the panel-fit and horizontal-overflow passes, and overflow is a hard release gate at 375/768/1440/1920/2560).** Prior text, kept visible: ~~qualifying-desktop snap pass at 1440×900/1920×1080/2560×1440 (each of the twelve panels settles at a boundary, no wheel interception, Page Up/Down and browser find still work); mobile/touch/short-viewport/200%-zoom pass confirms normal flow with no snap and no clipped content; loader matrix (first session shows it, reload shows it, soft nav/anchor/bfcache do not, timeout releases at 2s); ticker soak (≥10 minutes, 1920/2560/3840 widths, no blank rail/stuck pause/growing seam); hero slideshow pass (keyboard/touch/mouse controls, pause on hover/focus/hidden-tab/offscreen, reduced-motion shows a static first slide); menu overlay at every mandatory viewport plus one short-height/zoomed case (no scrollbar at standard sizes, accessible fallback at the exceptional one); print pass on `#closings`/`#listings` (SOLD tickets print full color, not the grayscale rest state — `globals.css` §8 already forces this, verify it still holds).

## Output

Use the Audit Output format from [SKILL.md](../SKILL.md). Append to `docs/design/AUDIT_LOG.md`.
