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

- Website gold is `#B8902E` (`--gold`); kit gold `#B8943D` appears only inside raster lockup files, never as a UI color (README mandate; the two golds must not sit adjacent).
- Hokuten-first branding: THE HOKUTEN GROUP is the brand; KW Commercial appears only as the footer compliance mark + disclosure line (decision 2026-08-07).
- The spelling is HOKUTEN. Never "Hakuten" in any user-visible or code artifact.
- Type is three voices, no more: Fraunces (display serif), Inter (UI/body), IBM Plex Mono (data/micro-labels). 2–4 sizes per section; body ≥16px.
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
