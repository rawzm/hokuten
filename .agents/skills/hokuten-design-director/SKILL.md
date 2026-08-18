---
name: hokuten-design-director
description: Canonical design direction for The Hokuten Group website — studying references, specifying pages, redesigning, implementation-readiness review, and audits of anything user-visible in site/. Use for any UI/UX, brand, motion, copy-voice, or design-system work on the Hokuten platform, including the ASCII hero, listing/closing cards, valuation calculator UI, ticker, and forms. Do not trigger it for pure data/backend work (a100arms feed logic, FRED proxy internals) or ops/deploy tasks.
---

# Hokuten Design Director

First stop for all design work on The Hokuten Group platform. Simple yet luxurious; enterprise-grade; familiar to 40+ CRE buyers who live on Crexi/LoopNet/CoStar — elevated, never alien. The look is "heritage through a digital sieve": classical hotel imagery through ASCII/dither/engraving treatments, on hyper-clean warm-paper chrome.

## Operating Model

This skill is a director, not a component cookbook. It decides which lens applies, loads only the relevant reference files, and defers to:

- [references/01-brand.md](references/01-brand.md) for brand facts (palette hex, lockups, type, compliance) — the only place hex values live.
- [docs/PHASE-1-IMPLEMENTATION.md](../../../docs/PHASE-1-IMPLEMENTATION.md) for what is in scope right now.
- [docs/LAUNCH-IMPLEMENTATION.md](../../../docs/LAUNCH-IMPLEMENTATION.md) (`approved`, 2026-08-17) for the launch delta on top of it — the Brand Design Guide v1.3 retune (palette, faces, vocabulary), Theme G lock, Dino's locked content, and every recorded deviation from his master directive.
- [PROJECT-MEMORY.md](../../../PROJECT-MEMORY.md) for standing decisions — never re-litigate one silently.

## Command Verbs

### `study`

1. Load [02-reference-digest.md](references/02-reference-digest.md).
2. For a new reference (URL, image, site), digest it in that file's format: Borrow / Avoid / Hokuten translation / Acceptance check.
3. Translate into principles; never clone a reference. Ref images and inspiration sites are source material only — no production import.
4. Append the digest to 02-reference-digest.md and note it in PROJECT-MEMORY.md.

### `spec`

1. Load [04-page-anatomy.md](references/04-page-anatomy.md) and [03-visual-system.md](references/03-visual-system.md).
2. Write the section/page spec in the Output Format below: intent → IA → component plan → states → motion → accessibility → acceptance criteria.
3. Every visual value must be a token name from 03-visual-system.md, never a raw hex/px invented on the spot.
4. Status is `provisional` until Razim approves; implementation starts only from `approved`.

### `redesign`

1. Load [02-reference-digest.md](references/02-reference-digest.md), [03-visual-system.md](references/03-visual-system.md), and [04-page-anatomy.md](references/04-page-anatomy.md).
2. State what is broken in the current version with evidence (screenshot, file path, gate violated) before proposing anything.
3. Produce a spec (see `spec`), not loose ideas.

### `implement-readiness`

1. Load [03-visual-system.md](references/03-visual-system.md) and [05-motion.md](references/05-motion.md).
2. Confirm the spec is `approved`, tokens exist in `site/` code, assets are in `site/public/`, and copy passed [06-content-and-proof.md](references/06-content-and-proof.md) evidence gates.
3. Return `ready` or `blocked: <reason>` with the exact missing item.

### `audit`

1. Load [07-audit.md](references/07-audit.md).
2. Run the gates against the artifact (route, screenshot, or PR diff).
3. Return findings ordered P0, P1, P2 with file paths or visible evidence; append to `docs/design/AUDIT_LOG.md` (create on first audit).
4. No taste-only feedback — every finding names the violated gate.

### `polish`

1. Load [05-motion.md](references/05-motion.md) and [07-audit.md](references/07-audit.md).
2. Fix P1/P2 items only; never restructure IA in a polish pass.
3. Cite which gate or token each fix serves.

## Reference Navigation

- Read [01-brand.md](references/01-brand.md) when the work touches logos, colors, typography choice, the hanko/north-star motif, KW compliance marks, or OG/social assets.
- Read [02-reference-digest.md](references/02-reference-digest.md) when studying inspiration, questioning a pattern's origin, or adding new references.
- Read [03-visual-system.md](references/03-visual-system.md) when writing any CSS/Tailwind, choosing type sizes, spacing, surfaces, or imagery treatment.
- Read [04-page-anatomy.md](references/04-page-anatomy.md) when building or reordering landing-page sections, nav, footer, or modals.
- Read [05-motion.md](references/05-motion.md) when touching animation, scroll, the ASCII hero, the ticker, hovers, or anything that could drop frames.
- Read [06-content-and-proof.md](references/06-content-and-proof.md) when writing or editing any user-visible copy, stats, claims, or compliance text.
- Read [07-audit.md](references/07-audit.md) when reviewing, before any deploy, and after any section is called "done".

## Non-Negotiables

- Website gold is `#B08D3F` (`--accent`), gold-dim `#C8A552` (`--accent-dim`); kit/raster gold `#B8943D` appears only inside raster lockup files, never as a UI colour. **Superseded 2026-08-17 (L2 / R3, Razim).** Prior rule, kept visible: ~~"Website gold is `#B8902E` (`--gold`)… (README mandate; the two golds must not sit adjacent)"~~. Dino's Brand Design Guide v1.3 (line 19) and the Work Manual §13 (line 679) both print Hokuten Gold `#B08D3F`, and the guide governs design over every other document by its own rule; the Brand-Addon README's `#B8902E` line is the superseded source. The "must not sit adjacent" caution is **not** repealed but is knowingly traded: all eight kit lockup PNGs bake `#B8943D`, so a rendered lockup now sits beside a `#B08D3F` rule with a ~2-unit delta (accepted, D14 — Dino eyeballs it on production). Full text: ref 01 → Palette, and docs/LAUNCH-IMPLEMENTATION.md §9 X4.
- Hokuten-first branding: THE HOKUTEN GROUP is the brand. **Superseded 2026-08-08 (D1) and again 2026-08-17 (L4 / R14)** — prior rule, kept visible: ~~"KW Commercial appears only as the footer compliance mark + disclosure line (decision 2026-08-07)"~~. The KW/Hokuten lockup **is** the header mark (D1); on production it is the **linear on-charcoal** cut on the dark nav bar (R14 — a recorded deviation from `V2` §1 line 8's white bar, resolved by the on-charcoal lettering rather than by inverting the chassis). The **stacked** badge stays the client-facing mark everywhere else — menu overlay, `#stats` identity anchor, footer, OG card — per the guide's own "linear is variety only, never primary on client-facing work" rule. Favicon/apple-touch are the hanko glyph, never a lockup. Unchanged: exactly ONE KW Commercial compliance-mark instance sitewide (footer) plus the byte-exact disclosure line, and a real-text brand line adjacent to any raster mark.
- The spelling is HOKUTEN. Never "Hakuten" in any user-visible or code artifact.
- **北天 is an accent mark only, never a replacement for the English name — new 2026-08-17 (Brand Design Guide v1.3 line 37, binding).** No headline, brand line, wordmark, `<title>`, OG string or nav mark may render 北天 in place of "The Hokuten Group". Glyph-mosaic artwork and `<KanjiAccent>` are decorative and stay legitimate; wherever they appear the English name reads adjacent in real text. Audit check + grep: ref 07.
- **Tagline discipline — new 2026-08-17 (R15).** "True north for hotel owners" ships in exactly one place, the footer brand line beneath the footer lockup, and nowhere else — not the hero, not a headline, not metadata, not the OG card.
- Type is three voices, no more: **Cormorant Garamond** (display serif), **Inter** (UI/body), **JetBrains Mono** (data/micro-labels). 2–4 sizes per section; body ≥16px. **Superseded 2026-08-17 (L3 / R13, Razim).** Prior rule, kept visible: ~~"Fraunces (display serif), Inter (UI/body), IBM Plex Mono (data/micro-labels)"~~ — approved 2026-08-10 (Design Revisit 2) and carried here as a non-negotiable. Replaced by Brand Design Guide v1.3 lines 10–16, corroborated by the kwc port source, which declares the same three faces (`--serif: 'Cormorant Garamond'`, `--sans: 'Inter'`, `--mono: 'JetBrains Mono'`) — this is the kwc lineage, not a new system. Ramp consequences (Cormorant's smaller x-height and narrower set): display sizes go up, leading loosens, Light 300 stays the default display weight. Mono micro-labels are uppercase, tracked 0.18–0.32em. Full ramp: ref 03 → Type ramp.
- Deal data (price, keys, cap rate, ADR, RevPAR, $/key, dates) is always mono, always tabular-num.
- Warm neutrals only: no pure-white page ground, no untinted grays; dark sections are the `--dark`/`--black` cover-panel, never a mid-gray.
- One signature effect per viewport; ASCII hero is the signature — nothing else competes on that screen.
- Transform/opacity-only animation; entrance reveals fire once; `prefers-reduced-motion` always honored with a designed static state; no bounce easing anywhere (finance/trust surface).
- 44px minimum tap targets; keyboard navigable; visible focus states; WCAG AA contrast on all text including gold-on-dark.
- Lucide icons only; no emoji, no text-glyph arrows in UI.
- Every public claim (stat, award, testimonial, logo) passes the evidence gate in 06-content-and-proof.md before it ships.
- No AI-slop tells: no centered-gradient hero + three cards, no default purple glow, no uniform pill grids, no stock photography, no fake metrics.

## Output Formats

### Spec Output

```markdown
**Section/Route:** [anchor or path]
**Status:** provisional | approved | blocked: <reason>
**Intent:** [one sentence — what this section must make the visitor feel/do]
**IA:** [content slots in order]
**Component plan:** [component → tokens used → source of truth for content]
**States:** [default / hover / loading / empty / error / reduced-motion]
**Motion:** [tokens from 05-motion.md, trigger, duration]
**Accessibility:** [focus order, labels, contrast notes]
**Acceptance criteria:** [ ] checkboxes, each checkable in the browser
```

### Audit Output

```markdown
**Artifact:** [route, screenshot, or PR]
**Date:** YYYY-MM-DD
**P0 (blocker):** finding — gate violated — file/evidence
**P1 (hierarchy/spacing):** …
**P2 (polish):** …
**Verdict:** pass | fail (any P0 = fail)
```

## Tone

Direct, evidence-based, implementation-ready. Reference token names and file paths, not adjectives.
