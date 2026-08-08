# RESUME — Phase 1 build handoff

**Purpose:** this file makes the build recoverable after a session cutoff. It is
updated as work lands, not at the end. If a session dies mid-flight, read this
file first, then `git log`, then continue.

**Last updated:** 2026-08-08, during the second execution session.
**Kickoff prompt to resume:** *"Read docs/RESUME.md and continue the Phase 1 build."*

---

## 1. How to resume an interrupted workflow

Every Workflow run persists its script and can replay completed agents from
cache — only unfinished agents re-run. Use these exact values:

| Workflow | Run ID | Script path |
|---|---|---|
| R1 — art program + heroes (Opus) | `wf_62770c0a-e4d` | `~/.claude/projects/-Users-razim-Documents-Hakuten/c33d8455-cf76-4fee-b056-7f5408c4ee8e/workflows/scripts/hokuten-r1-art-hero-wf_62770c0a-e4d.js` |
| R2 — calculator, ticker, forms, legal (Opus) | `wf_c24aba23-bae` | `~/.claude/projects/-Users-razim-Documents-Hakuten/c33d8455-cf76-4fee-b056-7f5408c4ee8e/workflows/scripts/hokuten-r2-calc-forms-wf_c24aba23-bae.js` |
| R3b — 11 sections (Sonnet) | `wf_070274f4-673` | `~/.claude/projects/-Users-razim-Documents-Hakuten-site/c33d8455-cf76-4fee-b056-7f5408c4ee8e/workflows/scripts/hokuten-r3b-sections-sonnet-wf_070274f4-673.js` |

```
Workflow({ scriptPath: "<path above>", resumeFromRunId: "<run id above>" })
```

Resume is same-session only. **Across a session reset the cache is gone** — so
after a reset, do NOT resume: check what is already on disk (§3), and relaunch
only the genuinely missing pieces as a fresh workflow. Disk state is the truth,
not the run history.

## 2. Budget protocol (agreed with Razim, 2026-08-08)

- Razim signals at ~87% session usage.
- On that signal: `TaskStop` every running workflow → `git add -A && git commit`
  → refresh this file → `git push`. Nothing in flight is worth more than a
  guaranteed-recoverable tree.
- Cost is ~entirely subagents, not the main loop. The main loop does integration
  and build-fixing, which is cheap and must stay on the strong model.
- Model split in use: precision work (frozen calculator math, byte-exact legal
  text, canvas perf) on Opus; pattern work (sections) on Sonnet.

## 3. What is DONE (on disk and committed)

- **M0 foundation** — `site/` scaffolded (Next 16.3 / React 19.2 / Tailwind v4.3 /
  TS strict / pnpm). `app/globals.css` is the token sheet: semantic tokens bound
  per theme by `[data-theme]`, plus five `.surface-*` scopes that rebind text /
  accent / hairline roles so one component is correct on every surface in both
  themes.
- **Contrast** — `docs/design/CONTRAST.md` + `contrast.mjs` (re-runnable). Three
  brand tones adjusted because they measurably failed AA as text; recorded in
  skill ref 01 → "Accessible tones".
- **Vercel** — Root Directory `site`, framework `nextjs`,
  `NEXT_PUBLIC_HOKUTEN_THEME` = `gold` (prod/preview/dev) and `blue`
  (branch-scoped to `theme-blue`). Branch `theme-blue` pushed, zero code diff.
  Preview deploys are SSO-protected; the public launch gate is untouched.
- **Port pack** — `docs/port/` 01–07, each written then attacked by an
  independent verifier against the source.
- **Content** — all 12 typed modules under `site/content/`.
- **Design system** — 10 primitives (`components/ui/`), 8 atoms
  (`components/atoms/`), `cards/CardShell`, 5 motion wrappers
  (`components/motion/`), `app/template.tsx`.
- **Calculator engine** — `site/lib/valuation.ts`, frozen port.
- **Art assets** — `public/art/ascii-{gold,blue}.{json,svg}` (28-frame morph
  loop, 406KB gzip of a 1536KB budget), `public/og/og-{gold,blue}.png`,
  `public/brand/hokuten-wordmark-{gold,blue}.svg`. Seam row fixed and verified
  legible: `T H E  H O K U T E N  G R O U P`.
- **Routes** — `app/robots.ts`, `app/sitemap.ts`; `lib/seo.ts`, `lib/web3forms.ts`.

## 4. What is NOT done

Check the filesystem before assuming any of these is still missing.

- `components/art/` — AsciiCanvas, AsciiStatic, HotelEngraving, OrbitalArcs, PlateChrome
- `components/hero/` — Hero, HeroCoverPanel, HeroPlate, heroContent
- `components/brand/Wordmark.tsx`
- hanko seal set — `public/brand/hanko-*.svg`, `favicon-*.svg`, `apple-touch-icon.png`, `favicon.ico`, `scripts/hanko-build.ts`
- `components/calculator/` + `sections/CalculatorSection.tsx`; `lib/valuation.test.ts`, `vitest.config.ts`
- `app/api/ticker-data/route.ts`, `lib/ticker.ts`, `components/ticker/`
- `components/forms/`, `sections/BovSection.tsx`, `components/modals/`, `lib/consent.ts`
- `app/privacy`, `app/sms-terms`, `app/accessibility`, `components/legal/`, `components/seo/JsonLd.tsx`
- all 11 sections + `components/nav/MenuOverlay.tsx` + `sections/SiteFooter.tsx`
- **page assembly** — `app/page.tsx` still holds the M0 placeholder
- `docs/PLACEHOLDERS.md`, `docs/design/AUDIT_LOG.md`, `app/specimen/`, `app/art/`
- the adversarial ship gate (audits, perf, a11y, compliance, content fidelity, anti-slop)

## 5. Known open defects

- `lib/valuation.ts:995` — `AdviceCode` union is missing `"pip"`; `tsc` fails.
  Owned by the R2 parity agent; verify it was fixed before integration.
- `scripts/ascii-gen.ts` — 4 `tsc` errors around a `{buckets, offsets}` return
  type. Build-time script only, does not ship, but should be cleaned.

## 6. Next steps, in order

1. Land the three in-flight workflows (or relaunch the missing pieces per §1/§4).
2. Assemble `app/page.tsx` — 13 sections in ref-04 order, `<main id="main">`,
   one `h1` (the hero), ticker height reserved at the foot.
3. `pnpm build` and fix to green. This is main-loop work, not subagent work.
4. Commit, push `main`, fast-forward `theme-blue`, confirm both deploys.
5. Consolidated audit pass; `docs/PLACEHOLDERS.md`; PROJECT-MEMORY entry.

## 7. Rules that do not change

Read `AGENTS.md` and `docs/AGENT-BRIEF.md`. The load-bearing ones:
HOKUTEN never "Hakuten" · semantic tokens only, no hex in components · both
themes must be correct · calculator math frozen · compliance strings byte-exact ·
`FRED_API_KEY` server-side only · no public deploy until the KW / Forward
Wilshire paperwork gate clears · commits authored as rawzm with **no
Co-Authored-By or AI attribution trailers, ever**.
