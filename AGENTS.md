# AGENTS — The Hokuten Group Platform

Working rules for every agent (Claude Code, Cursor, or human) in this workspace. `CLAUDE.md` is a symlink to this file — one rulebook, every tool.

## Read these first, in order

1. This file.
2. [PROJECT-MEMORY.md](PROJECT-MEMORY.md) — standing decisions + dated log. Never re-litigate a decision silently; propose changes as new dated entries.
3. The skill relevant to your task (`.agents/skills/`): design/UI/brand/copy → `hokuten-design-director` (load only the reference files its verbs tell you to).
4. [docs/PHASE-1-IMPLEMENTATION.md](docs/PHASE-1-IMPLEMENTATION.md) — current scope. [BRAINSTORM.md](BRAINSTORM.md) is ideas, not scope.

## Workspace map

- `site/` — the Next.js app (created in Phase 1, M0). All product code lives here.
- `.agents/skills/` — canonical skills; `.claude/skills` and `.cursor/skills` are symlinks to it. Edit skills only in `.agents/skills/`.
- `.cursor/rules/*.mdc` — thin enforcement pointers; the substance lives in skills/docs. Keep them in sync when tokens or rules change.
- `The_Hokuten_Group_Brand_Addon_2/` — brand masters (read-only; export copies into `site/public/brand/`).
- `Ref/` — hand-picked design references, source material only; never import into production.
- `chat-context.md` — private team chat. Never commit, quote in public artifacts, or copy credentials from it.
- Port source: `~/Documents/Dino/dino-sites/kwc-dinomonteverde/` (read-only — never edit Dino's live-site repo from here).

## Working rules

- **Memory protocol** (non-negotiable, from the expo/razim-co convention): before every push — and after every decision, scope change, or shipped section — add a dated entry to PROJECT-MEMORY.md. Newest first. Convert relative dates to absolute.
- **Evidence gate**: no public claim (stat, award, testimonial, logo) ships without a `verified-current` row in the design skill's claims register (reference 06).
- **Decision protocol**: pre-resolve decisions in plans before implementing; a plan with open questions is not ready to execute.
- **Status vocabulary** everywhere: `provisional | approved | blocked: <reason>` for specs; `P0/P1/P2` for findings; `parked | exploring | approved | building | shipped | rejected` for ideas.
- **References are translated, never cloned.** New inspiration goes through the `study` verb into reference 02.
- **Trendy-library quarantine**: liquid-dom, threecn, and similar are study-only until a compatibility/a11y/perf spike passes and is logged.
- **Verify APIs against `node_modules` docs, not memory** — especially Next.js and Tailwind v4.

## Hard guardrails — do not change without Razim's explicit OK

- Spelling: HOKUTEN. Brand: THE HOKUTEN GROUP. Never "Hakuten" in any artifact.
- Website gold `#B8902E`; kit gold `#B8943D` only inside raster assets. Hex values live in skill reference 01 and `site/app/globals.css` only.
- Hokuten-first branding; KW Commercial only as footer compliance mark + verbatim disclosure line; compliance/TCPA blocks are byte-exact ports.
- Calculator math, defaults, and cap-rate `CONFIG` are a frozen port from the kwc site — changes require a dated PROJECT-MEMORY.md decision.
- No Sarhan Hotel Group branding anywhere on the new site.
- Secrets: `FRED_API_KEY` is a Vercel env var, server-side only. Never commit `.env*`. Never use Dino's Vercel/a100arms accounts from a local CLI; deploys go through GitHub → Vercel integration.
- Do not deploy publicly under the Hokuten name until the KW / Forward Wilshire paperwork gate clears (tracked in PROJECT-MEMORY.md open items).
- git: repo root is this folder; remote is `https://github.com/rawzm/hokuten.git` (branch `main`); `chat-context.md` stays gitignored. Commits authored as rawzm. **No Co-Authored-By or any AI/co-author attribution trailers in commit messages — ever** (Razim, 2026-08-07).

## Definition of done (any user-visible work)

Spec `approved` → built to tokens → passes the design skill's `audit` (no P0) → perf gates green (reference 05) → QA greps pass (reference 07) → PROJECT-MEMORY.md entry written.
