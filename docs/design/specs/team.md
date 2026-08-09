> **✓ Re-verified current — Design Revisit round (2026-08-08/09).** Checked
> against `site/components/sections/TeamSection.tsx`'s own header comment on
> 2026-08-09 (not skimmed): the IA, component plan and every Decision below
> still hold — this section was not structurally rebuilt, only compressed.
> D6 density: `section-fit` (desktop-only min-height) +
> `lg:flex lg:flex-col lg:justify-center` centres the content block when it's
> shorter than the fit-viewport floor (same pattern as `MethodSection`);
> header-to-content and grid gaps compress at `lg:` only, mobile is
> untouched, per D6's "do not compress below `lg`" rule. D8: no change beyond
> spacing — the section's one focal step is still `SectionHeader`'s
> Display-2 headline. Confirms the portrait-vs-glyph-plate decision (§"Portrait
> vs. glyph plate") is unaffected — see `docs/PLACEHOLDERS.md` row 40a for
> the current-state record of that gap.

# `#team` — The Principals

**Section/Route:** `#team` (landing page, section 10 of 13 per ref 04 — between `#mandates` and `#faq`)
**Status:** **approved** (ref 04 §`#team` already scopes this section's IA — "TeamCards: portrait (B&W→color), name, role, two-line bio, mono contact row… Dino… Razim, William; Jae & Donna listed as operations" — this spec adds implementation-level token detail and resolves the open shape questions ref 04 leaves implicit, flagged under Decisions below)
**Intent:** A visitor scrolls past four real names — not an anonymous "our team" grid — and can reach any of them (copy an email, dial a number) inside the same five seconds a Crexi/LoopNet regular expects a contact route to take. This is where "named experts with faces" (AGENT-BRIEF) does its trust work: warmth and air, not a compact staff directory.

## IA

```
<section id="team" aria-labelledby="team-heading" class="surface-paper section-pad">
  <div class="container-hk">
    <Reveal>                                    -- header, no stagger
      SectionHeader  label="The principals"  headline="Named people, not a *desk*."
    <Reveal as="ul" stagger>                      -- 3 children, well under the ref-05 cap of 6
      3 × <Reveal.Item as="li">
            <TeamCard>
              portrait (Dino: PhotoFrame aspect 3/4) | glyph plate (Razim, William)
              name (h3) → role → DRE (Dino only) → bio → contact row (email + phone, when present)
    <Reveal delay={0.1}>                          -- Operations, its own reveal, NOT inside the stagger group
      hairline-t block: MicroLabel "Operations" → h3 "Jae Hun Jeong & Donna Grace Yangyang" → bio
  </div>
</section>
```

`content/team.ts` ships exactly four rows in this order: Dino, Razim, William, then the combined Jae + Donna "Operations" row. `principals = team.slice(0, 3)`; `operations = team[3]`.

## Component plan

- `SectionHeader` (atom, unmodified) — `id="team-heading"`, `label="The principals"` **no `index`** — see "Unindexed micro-label" below. Headline `"Named people, not a *desk*."` (one italic word: *desk*; no claim, no number — pure voice line, consistent with `#doors`' non-numeric headline precedent).
- `TeamCard` (new, owned) — one principal tile. Composes `PhotoFrame`, `CopyButton`, a local `NorthStarGlyph`/`GlyphPlate` pair, and `lucide-react`'s `Mail`. **Does not compose `CardShell`** — see "Not using CardShell" below. Exported as `TeamCard`, named only.
- The Operations row is bespoke JSX inside `TeamSection.tsx` itself (`MicroLabel` + a plain `h3` + `p`), not a `TeamCard` variant — see "Operations is not a TeamCard variant" below.
- `Reveal` / `RevealItem` (motion, unmodified) — one stagger container (3 children) for the principal grid, plus one standalone (non-stagger) `Reveal` for the header and one for the Operations block, mirroring `MandatesSection`'s three-Reveal shape (header / stagger grid / trailing block).

## Decisions

### Unindexed micro-label

Ref 04 assigns a numbered micro-label only to `#closings` (`[ 01 — TRACK RECORD ]`) and, by the same pattern, `#listings` carries `"02"`. `#brands`, `#doors`, `#mandates`, `#stats` and `#faq` all ship unindexed (confirmed by reading every already-built `SectionHeader` call site — none besides `#closings`/`#listings` pass an `index`). No shared index registry exists across the concurrent build (the same gap `FaqSection`'s spec flagged 2026-08-08). `#team` follows that majority precedent: `[ THE PRINCIPALS ]`, unindexed. Flagged here for the same future revisit once one agent assembles every section's index in order.

### Not using `CardShell`

`CardShell`'s `meta` slot line-clamps to 2 lines and reserves `3.2em` — sized for a short caption ("Lake Harmony, PA · Full-Service · 450 keys"), not prose. A person's bio is prose, and Dino's real content (`content/team.ts`) is 3–4 sentences of verified, register-tracked figures ("$200M+ … Three-time CoStar Power Broker … USMC veteran. Former hotel owner-operator."). Clamping it would visually truncate a claim ref 06's register lists as one verified unit ("Dino bio (creds line) — `verified-current`"), and `CardShell.tsx` is not a file this task owns, so its clamp cannot be relaxed for this one caller. `CardShell` also has no fourth slot for a compliance-adjacent DRE line, and its `data` slot forces mono type — wrong for prose. This file instead applies the same chassis TOKENS `CardShell` itself is built from (`rounded-card`, `border-hairline`, `surface-card`, the `card-hit` hover marker, `transition-colors duration-base ease-out`) directly to a purpose-built layout, rather than duplicating a second generic card abstraction. `MandatesSection.tsx` documents the identical call for mandate cards ("no photo, no meta line, no badge… a different shape ref 04 asks for explicitly, not a duplicated primitive") — this is the same reasoning applied to a fourth card shape.

### Portrait vs. glyph plate

Only Dino has a sourced photo (ref 04; ref 06 "Team bios"; `content/team.ts` — Razim/William/Operations carry no `photo`). Every card without one renders a `GlyphPlate`: the identical `aspect-[3/4]` box `PhotoFrame` would occupy (so the 3-up grid row stays visually aligned whichever cards land where), toned `surface-deep`, holding the north-star/compass motif ref 01's Motif system names explicitly: "the site mark accent; usable as bullet, section stamp, loading indicator." This is that sanctioned use — a scarce, deliberate brand-mark placement, not the "decorative fill" ref 03 bans (that rule targets colour washes and gold-as-background, not a single small glyph occupying one card's empty portrait slot in ~2% of the viewport). It is drawn as an inline `<svg>` (ref 03 Iconography: "an SVG asset, not an icon-font hack" — a hand-authored vector path satisfies "SVG asset"; nothing here uses an icon font). Never initials-in-a-circle — that pattern **is** the "grey avatar" AGENT-BRIEF names as banned by name for this exact section.

### Contact row — both halves of the "AND" gate

Ref 07: "Phone number visible in plain text (not icon-only); email copy-to-clipboard AND mailto." `TeamCard` renders, when a field is present:
- **Email**: `CopyButton` (the "Copied" flash) beside a separate real `<a href="mailto:…">` icon-link (`Mail`, `lucide-react`, 44×44px tap target, `aria-label="Email {name}"`) — two independent affordances, matching `CopyButton.tsx`'s own file-header gate ("a copy button alone is not reachable by a keyboard user who wants to open their mail client").
- **Phone**: the dotted display string as real visible text, wrapped in a real `<a href="tel:+1…">` — never icon-only. The kwc source stores phone in dotted display form only; `content/team.ts`'s own renderer note says the E.164 `tel:` href is "derived at render time, not stored here," so `TeamCard.tsx` carries a small local `telHref()` (dotted digits → `tel:+1XXXXXXXXXX`) rather than reading `CONTACT.phoneHref` from `content/site.ts` (that constant is Dino-specific and would be wrong if a future team member's phone differs).

**Content gap, not a code defect (report, don't invent — AGENT-BRIEF content law):** in the current `content/team.ts`, only Dino has both `email` and `phone`. Razim's and William's rows carry `email: ""` and no `phone` at all, so — correctly, per the CONTRACT GAP note already written into `content/team.ts` ("a falsy `email` renders nothing — never an empty `mailto:`") — their cards ship **with no contact row at all** until real addresses are sourced. This is expected behaviour of the code as specified, not a bug; flagged again here so it is visible from the spec, not only from a code comment.

### `TeamMember.email: string` (required) vs. three empty rows

`lib/types.ts` types `email` as required (`email: string`), but `content/team.ts`'s own header already documents the gap and proposes the fix (`email?: string`) without making it, since `lib/types.ts` is not that file's own task either. `TeamCard.tsx` does not touch `lib/types.ts` (not an owned file this task can edit) and instead treats `Boolean(member.email)` as the presence check, matching the content file's explicit instruction to its consumers. Reported again here per "report needed changes instead," not fixed.

### Operations is not a `TeamCard` variant

Ref 04: "Jae & Donna listed together under 'Operations', a lighter treatment than the three principals." Rather than adding a `tier`/`variant` prop to `TeamCard` to reproduce a one-off shape (no portrait slot, no card border, no `p-6` chassis, no contact row today), the Operations row is composed directly in `TeamSection.tsx` as its own small block — the same choice `DoorsSection.tsx` already made for its two non-repeating panels (a local, section-owned layout rather than a generalised card variant). It sits below the 3-up grid behind a `hairline-t` divider, in a smaller display size (`text-body-lg` vs. the principal cards' `text-heading`) with no image slot at all — "lighter" in both size and absence of chassis, not merely in colour. `operations.role` ("Operations") is not repeated as body text since the adjacent `MicroLabel` already says "Operations" — redundant field, not a dropped one.

### DRE placement (CA B&P §10140.6)

`content/team.ts`'s own note: Dino's `dre` field is `"CA DRE #01948432"`, sourced from `docs/port/02-compliance.md` §1.1/§5.1 and ref 06's compliance block, and is present — **not** the "report, do not type it in yourself" blocker case the task brief warned about. `TeamCard` renders it directly beneath the role line, in `data-line text-fg-meta` (mono, matching the license-number-as-data convention, distinct from `SiteFooter.tsx`'s `DisclosureLine`, which sets the long-form two-sentence prose disclosure in plain `text-data` — a short code reads better in mono, a paragraph reads better in sans). This satisfies "wherever Dino appears in a broker capacity it must render with his name" by keeping the number in the same visual block as the name, on every render of the card — it is not conditional on anything. The full two-sentence brokerage disclosure stays exclusively in the footer (`content/compliance.ts`, unmodified, unrepeated here).

## States

- **Default**: glyph plate or grayscale portrait, hairline card border, mono DRE line (Dino), body-weight bio, contact row bottom-aligned via `mt-auto`.
- **Hover** (pointer, `hover: hover`): portrait/photo → colour + `scale(1.02)` (`photo-reveal`, keyed off the root's `card-hit` marker class, `duration-base`/`ease-out`); card hairline → accent at 40% opacity (`hover:border-accent-text/40`, applied directly since — like `ClosingCard` — these tiles carry no `href` for `CardShell`'s own conditional to key off). The glyph plate does not carry `photo-reveal` (it holds no photograph); it does not react to hover — a static, deliberate plate at every state, never a hover-only reveal (nothing about it is information-bearing regardless).
- **Touch / tapped**: `PhotoFrame`'s own tap toggle reveals colour on Dino's card without navigation (kwc parity).
- **Focus**: each interactive element inside the contact row (`CopyButton`, the mailto icon-link, the tel link) carries its own visible 2px `var(--focus)` ring from the base layer (`globals.css`) — no card-level `has-[a:focus-visible]` ring is added, unlike `CardShell`; there is no single "the card is a link" affordance to ring here, only several independent small controls, and each already clears the P0 "missing focus state" gate on its own.
- **Reduced motion**: hover/tap colour-reveal transitions collapse to instant (global `prefers-reduced-motion` block); reveals render their final visible state — see Motion.
- **Missing contact fields**: no row rendered at all for a member with neither field present (Razim, William today) — never a broken `mailto:`/`tel:` with an empty target. See Decisions.
- **Print**: `img { filter: none !important }` (globals.css §8) restores colour on Dino's photo when printed; `.surface-card`-equivalent stays legible (no colour override needed here — this file never sets a raw fill). No print-specific class added; nothing here degrades under `@media print`'s existing global rules.

## Accessibility

- `<section id="team" aria-labelledby="team-heading">` → `SectionHeader`'s own `h2` carries the matching id.
- Principals render as a real `<ul>`/`<li>` (`Reveal as="ul"` / `Reveal.Item as="li"`) — "list of 3 items." The Operations block is a single non-repeating entity, not a fourth list item.
- Each principal name is an `h3`, sibling to the section's `h2` and to the Operations block's own `h3` — one honest document outline, no skipped levels.
- No hover-only information: the portrait colour reveal is decoration only (per `PhotoFrame`'s own contract); nothing about a person's identity, role, licence or contact route depends on hover or touch state.
- Phone renders as real visible text (never icon-only) alongside its `tel:` link; email gets both a copy affordance and a real `mailto:` link — both P0 gates in ref 07 satisfied per-field, not assumed.
- The glyph plate's `<svg>` is `aria-hidden="true"`; nothing it would communicate is missing from adjacent real text (name/role already identify the card).
- Body/role/bio/data type never drops below the 16px floor (`text-body`, `text-data` ramp tokens only — no new sizes introduced; the section already sits at 3 sizes: `text-heading`, `text-body`/`text-body-lg`, `text-data`/`text-micro`, within the 4-size cap).

## Motion

Three motion layers, all existing tokens, nothing new:
1. Header `Reveal` (no stagger) — standard reveal variant, `duration-reveal` (600ms), `ease-out`, once at 20% intersection.
2. `<Reveal as="ul" stagger>` around exactly 3 `<Reveal.Item as="li">` children — well under the ref-05 cap of 6 (no dev-console warning possible at this count). `STAGGER` = 70ms per child.
3. A third, standalone `<Reveal delay={0.1}>` around the Operations block — matching `MandatesSection`'s own "header / stagger grid / trailing block" three-Reveal shape, so the block reveals as its own single event rather than joining (and complicating the count of) the principal stagger group.

Card-internal hover/tap transitions are `duration-base` (300ms) `ease-out`, from `photo-reveal`'s existing CSS — nothing reimplemented.

## Acceptance criteria

- [ ] Exactly 3 principal cards render from `team.slice(0, 3)` (Dino, Razim, William, in that order) plus one Operations block from `team[3]` — no retyped copy; name, role, bio, `dre`, `email`, `phone` all read directly off the `TeamMember` object.
- [ ] Dino's card shows a portrait (`PhotoFrame`, `aspect="3/4"`) that starts grayscale and turns to colour on hover/tap; Razim's and William's cards show the `GlyphPlate` (north-star glyph on a `surface-deep` plate), never a grey circular avatar, never a stock photo, never initials.
- [ ] Dino's card renders `CA DRE #01948432` directly beneath his role, on every render (not conditional on anything besides `member.dre` being present).
- [ ] Dino's card renders a `CopyButton` for his email (flashes "Copied") **and** a separate real `mailto:dino.monteverde@kw.com` icon-link, **and** his phone as visible text `650.720.6995` wrapped in a real `tel:+16507206995` link.
- [ ] Razim's and William's cards render no contact row at all (both fields empty/absent in current content) — no broken `mailto:`/`tel:` link, no placeholder text.
- [ ] Razim's and William's bios and titles carry zero numbers, awards, or licence claims — verified by reading `content/team.ts` directly, nothing added by this component.
- [ ] Operations block renders "Jae Hun Jeong & Donna Grace Yangyang" and its bio beneath an "Operations" `MicroLabel`, visually smaller and chrome-free next to the three bordered principal cards — no portrait/glyph slot, no card border.
- [ ] Grid is 1-up mobile → 2-up `md:` (≥768px) → 3-up `lg:` (≥1024px), matching `ClosingsSection`'s established grid classes.
- [ ] Hover: portrait/photo grayscale→colour + `scale(1.02)`, card ring → hairline accent 40% — verified against `photo-reveal`'s existing CSS, not re-implemented. No translate, no shadow, no size change.
- [ ] Stagger group holds exactly 3 children (well under the ref-05 cap of 6; no dev-console warning).
- [ ] No hex/`rgb()`/Tailwind-default-palette colour anywhere in `TeamSection.tsx` / `TeamCard.tsx` — every visual value is an existing token/utility (`surface-paper`, `surface-deep`, `surface-card`, `section-pad`, `container-hk`, `text-accent-text`, `text-fg-meta`, `data-line`, `rounded-card`, `rounded-pill`, `hairline`, `hairline-t`).
- [ ] `<section aria-labelledby>` points at the section's own `h2`; every interactive element (`CopyButton`, mailto link, tel link) has its own visible focus ring and a 44px tap target.
- [ ] `npx tsc --noEmit --incremental false` clean for both owned files.
