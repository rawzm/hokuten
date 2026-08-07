# 07 — Audit

## Table Of Contents
Severity model · P0 gates · P1 gates · P2 checks · Anti-AI-slop gates · 40+ usability gates · Pre-deploy QA script · Output

## Severity model

P0 = clarity, accessibility, correctness, compliance, performance-gate failure — blocks ship.
P1 = hierarchy, spacing, consistency, motion discipline — fix before the section is called done.
P2 = polish — batch into polish passes.
Any P0 ⇒ verdict `fail`. Findings name the violated gate + file/evidence. Append every audit to `docs/design/AUDIT_LOG.md` (dated, never deleted).

## P0 gates (fail if violated)

- Any user-visible "Hakuten", any kit-gold `#B8943D` in CSS, any gold other than `--gold` in UI.
- KW lockup in the header, or missing footer compliance disclosure, or paraphrased compliance/TCPA text.
- A public claim not in the verified register, or a `pending-verification` claim rendered live.
- Stats/names/awards baked into images, or stat counters that show 0/placeholder without JS.
- Body text <16px; tap target <44px; keyboard trap; missing focus state; contrast below WCAG AA (check gold-on-dark specifically).
- Hover-only information on touch; consent modal closable by outside click (spec: shake, not close).
- Performance gate breach ([05-motion.md](05-motion.md)): LCP ≥2.5s, CLS ≥0.02, INP ≥200ms, landing JS >180KB gzip, hero jank >12ms frames.
- Calculator math or defaults altered from the ported `CONFIG` without a dated PROJECT-MEMORY.md decision.
- Secrets in client code or repo (only public keys allowed: Web3Forms access key; FRED key must stay server-side env).
- Layout-property animation; reveals that re-fire; missing reduced-motion state.

## P1 gates

- More than 4 type sizes in a section; hierarchy attempted via size where weight/color/spacing would do.
- Deal data not in mono / not tabular-nums; stat numerals set in mono (they're serif).
- Gold exceeding accent scarcity (~5% of viewport); texture on UI chrome; two signature effects in one viewport.
- Non-Lucide icons, emoji, text-glyph arrows outside mono labels.
- Section missing its micro-label index; anchor without `scroll-margin-top`; card grids breaking the 3/1-up rule.
- Copy violating voice rules (banned words, vague CTAs, adjective-padded metrics).
- Empty/loading/error states unstyled (listings empty state, ticker dashes, form errors in `--brick`).

## P2 checks

- Stagger caps (≤6 children), hover polish, "Copied" flash present, italic accent word exactly one per headline, badge set consistency, OG image matches cover recipe.

## Anti-AI-slop gates (fail if present)

Centered-gradient hero with three feature cards · default purple/violet glow · uniform pill-card grids · glassmorphism without cause · stock or AI-generated photography · fake/rounded metrics ("500+ happy clients") · emoji bullets · generic CTAs ("Get Started") · Inter-only typography with no display voice · dark mode toggle nobody asked for.
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
npx next build                                                                       # zero errors, check route JS sizes vs 180KB budget
grep -r "FRED_API_KEY" .next/static 2>/dev/null && echo FAIL || echo OK             # post-build: key absent from client bundles
```

Plus manual: JS-disabled pass (stats/nav/content readable), keyboard-only pass, iPhone SE + 13" laptop + 27" desktop viewports, reduced-motion pass, Lighthouse mobile ≥90/95.

## Output

Use the Audit Output format from [SKILL.md](../SKILL.md). Append to `docs/design/AUDIT_LOG.md`.
