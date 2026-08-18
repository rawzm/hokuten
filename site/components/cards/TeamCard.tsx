/**
 * components/cards/TeamCard.tsx — one FEATURED seat in the `#team` grid.
 *
 * Governed by hokuten-design-director ref 04 (`#team`), ref 06 (Team bios,
 * evidence gate, licence lines) and ref 07 (P0: phone visible in plain text +
 * `tel:`, email copy-to-clipboard AND `mailto:`).
 *
 * Server Component — the only client boundaries in the tree are `PhotoFrame`
 * (touch tap-reveal) and `CopyButton` (clipboard), both existing, unmodified
 * modules.
 *
 * ── Featured seats only (LAUNCH-IMPLEMENTATION §3.9, R7/D6) ─────────────────
 * The roster is six seats split by `content/team.ts`'s `featured` flag. This
 * card renders the three featured seats (Dino, Razim, William) — full bio,
 * portrait, licence line, contact row. The other three render as a compact
 * roster row composed inside `TeamSection`, NOT as a variant prop here: the
 * lighter row is a different shape, and the precedent this section already set
 * (and `MandatesSection`/`DoorsSection` before it) is that a section composes
 * its own lighter-weight local block rather than overloading a card component
 * with a variant it only half fits.
 *
 * ── Not using `CardShell` (decision — mirrors `MandatesSection`'s own call)─
 * `CardShell`'s `meta` slot line-clamps to 2 lines / reserves `3.2em` — sized
 * for a short caption ("Lake Harmony, PA · Full-Service · 450 keys"), not
 * prose. A person's bio is prose. `CardShell` also has no slot for a
 * compliance-adjacent licence line and forces its `data` slot to mono type —
 * wrong for prose. So this file applies the same chassis TOKENS `CardShell`
 * itself is built from (`border-hairline`, `surface-card`, the `card-hit`
 * hover marker) directly, rather than duplicating a second generic card
 * abstraction — see `MandatesSection.tsx` for the identical precedent.
 *
 * ── D4 ticket kinship — a LIGHT borrow, deliberately not the full anatomy ──
 * Design-revisit §4.8 offers the deal-ticket system (colour header band,
 * perforated tear line, metrics grid) and says "adopt it only if it
 * genuinely improves the cards … don't force it." Verdict: the tear-line-
 * and-metrics-grid anatomy is built to say "this is a transaction" — a
 * person is not a deal, and stamping a bio card with a perforation reads as
 * a category error, not a system. What DOES transfer cleanly: the `ticket`
 * utility's resting ink-tinted dimensional shadow (replacing the flat
 * `rounded-card`, whose radius `ticket` already supplies) and the D8
 * mono/caps micro-voice for the role line, below. That is the full borrow —
 * no header band, no tear line, no `ticket-perf`/`ticket-notch`.
 *
 * ── Portrait: one CSS aspect, and a hard publication gate ──────────────────
 * `aspect="4/5"` (0.800) is the one rendered aspect for every portrait on the
 * page — featured card and roster row alike — so the grid stays even. The
 * canonical masters are NOT one aspect (Jae Hun's is 0.750, the rest 0.800);
 * they are normalised to exactly 900×1125 on export and still ride
 * `object-fit: cover`, so a future master at a third aspect degrades to a crop
 * rather than a broken row.
 *
 * A seat renders a portrait only when `content/team.ts`'s `seatPortrait()` says
 * so — the G8 subject-approval gate, evaluated in exactly one place. **William
 * Betancourt's card renders WITHOUT a portrait** until C17 clears (he objected
 * to his image having been AI-processed, team chat 2026-08-17). Do not route
 * around it by reading `member.photo` directly.
 *
 * Ungated seats fall back to `GlyphPlate`: the same box `PhotoFrame` would
 * occupy (so the grid row stays visually aligned), toned `surface-deep`,
 * holding the north-star/compass motif ref 01's Motif system sanctions by name.
 * Never initials-in-a-circle — that pattern IS the "grey avatar" AGENT-BRIEF
 * names as banned for this exact section.
 *
 * ── Licence line: `licence`, never `dre` ───────────────────────────────────
 * `content/team.ts` keeps `dre` as the CALIFORNIA DRE field because
 * `components/seo/JsonLd.tsx` emits it under the label "California DRE
 * license". The printed line comes from `licence` (+ `brokerageLicence` for
 * Dino's brokerage of record), so William's Florida number can print here
 * without being mislabelled in the structured data. A seat with no `licence`
 * makes NO licence claim — that is a decision per seat (R8 for Razim, D9 for
 * William), not an omission to be tidied up.
 *
 * ── Contact row (ref 07: "email copy-to-clipboard AND mailto") ──────────
 * `CopyButton` gives the "Copied" flash; a separate real
 * `<a href="mailto:…">` icon-link sits beside it so a keyboard/AT user who
 * wants their mail client has a real link, not just a clipboard write
 * (`CopyButton.tsx`'s own file-header gate). Phone renders as plain visible
 * text (ref 07: "not icon-only") plus a real `tel:` link — E.164 is derived
 * here from the source's dotted display format; `content/team.ts`'s own
 * renderer note: "the `tel:` href is E.164 … derived at render time, not
 * stored here." `CONTACT.phoneHref` (content/site.ts) is Dino-specific and
 * deliberately not reused for that reason.
 *
 * ── Empty email is "no contact channel," never an empty mailto ──────────
 * Only Dino has a published address; every other seat carries `email: ""`
 * (`content/team.ts`'s CONTACT note, X25). This file treats a falsy `email` as
 * "no channel" and renders nothing for that row — never `mailto:` with an empty
 * address. The seats with no channel are covered by `TEAM_ROUTING`, rendered
 * once by `TeamSection`, which names Dino Monteverde as the destination.
 *
 * ── Design Revisit 2 (2026-08-10, D9/D13/D20) — landscape at `lg:`, spatial
 *    only, nothing invented ──────────────────────────────────────────────
 * `TeamSection` moved off `container-hk` (1200px cap) onto `stage-shell`
 * (D9: full-width, fluid gutter, no max-width). Left unchanged, the OLD
 * portrait-on-top card would have taken that width literally: a 3-up grid
 * on a 2560px stage gives each column ~700–800px, and a full-bleed image at
 * that width renders a >1000px-tall headshot — grotesque, and it
 * single-handedly blows the section past one usable screen at 1440×900.
 *
 * The fix is the same one `Ticket.tsx` already proved for the deal grids
 * (D13): flip to a landscape row at `lg:` — a FIXED-width portrait/glyph
 * column (`lg:w-44`, 176px; not proportional, so it never grows with the
 * stage) beside a fluid content column that absorbs 100% of the extra
 * width. That fluid column is what actually answers the brief's "use the
 * width for a credible role/contact hierarchy": more room for the bio to
 * breathe at a locally-constrained prose measure (D9: "constrain prose
 * locally," `max-w-[46ch]`, matching `DoorsSection`'s own body-copy
 * convention) and for the contact row to lay email + phone side by side
 * instead of wrapping. Below `lg:` the card is the original column.
 *
 * Mechanism, copied verbatim from `Ticket.tsx`'s own "Landscape image zone"
 * note (same problem, same fix, this file has no reason to reinvent it):
 * `aspect-ratio` only constrains a box when at least one of width/height is
 * `auto`. So rather than fight the child's own aspect utility (baked into
 * `PhotoFrame`'s frame div and into `GlyphPlate`'s own div — two different
 * components this file does not want to teach a new prop), a wrapper here
 * carries `lg:w-44 lg:shrink-0` (the fixed column) and reaches into
 * `lg:[&>:first-child]:aspect-auto lg:[&>:first-child]:h-full
 * lg:[&>:first-child]:w-full` — a descendant selector, so it works
 * identically whichever of the two components is the wrapper's one child.
 * `lg:h-full` on the wrapper itself gives that override a real height to
 * fill: `article` is `lg:flex-row` with default `align-items: stretch`, so
 * the wrapper's cross-axis size already stretches to the row's height (set
 * by the taller content column) before the child fills it.
 */

import { Mail } from "lucide-react";

import { seatPortrait, type TeamSeat } from "@/content/team";
import { cn } from "@/lib/utils";
import { PhotoFrame } from "@/components/atoms/PhotoFrame";
import { CopyButton } from "@/components/motion/CopyButton";

export type TeamCardProps = {
  member: TeamSeat;
  className?: string;
};

/**
 * "650.720.6995" → "tel:+16507206995". Local to this file — see file header.
 * Assumes a 10-digit US number (every phone in `content/team.ts` today is);
 * a future international number would need this taught a country code.
 */
function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

/**
 * The north-star / compass-point brand motif (ref 01 Motif system), drawn as
 * a hand-authored `<svg>` per ref 03 Iconography ("an SVG asset, not an
 * icon-font hack"). A four-point sparkle/compass star, symmetric on both
 * axes. Purely decorative — the adjacent name/role already carry the card's
 * identity, so this never needs a visible-text equivalent.
 */
export function NorthStarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path
        d="M24 6 C25.5 17 26.5 21.5 42 24 C26.5 26.5 25.5 31 24 42 C22.5 31 21.5 26.5 6 24 C21.5 21.5 22.5 17 24 6 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * No-portrait plate — the same `4/5` box `PhotoFrame` would fill, so a gated
 * seat leaves the grid row untouched. Deliberate, not decorative.
 *
 * `text-fg-meta`, not `text-accent-text` (coherence audit 2026-08-08): this is
 * a FILLED shape at 40–48px, and ref 03's colour rule is "accent =
 * action/exclusivity only; never decorative fills". At meta tone on the
 * `surface-deep` plate it reads as a quiet watermark, which is what an absent
 * portrait should look like. Only one featured seat renders it today
 * (William, gated) — it is scarce by construction, not by luck.
 */
export function GlyphPlate({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "surface-deep relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-none",
        className,
      )}
    >
      <NorthStarGlyph className="size-10 text-fg-meta sm:size-12" />
    </div>
  );
}

export function TeamCard({ member, className }: TeamCardProps) {
  const portrait = seatPortrait(member);
  const hasEmail = Boolean(member.email);
  const hasPhone = Boolean(member.phone);
  const hasContact = hasEmail || hasPhone;

  return (
    <article
      className={cn(
        // `card-hit` is the marker `photo-reveal` (globals.css) hovers off —
        // the same convention `CardShell` uses, applied directly here since
        // this file doesn't compose `CardShell` (see file header). `ticket`
        // (D4, light borrow — see file header) supplies both the card
        // radius and the resting ink-tinted shadow, so `rounded-card` is not
        // repeated separately. `lg:flex-row` is the Design Revisit 2
        // landscape flip (see file header) — mobile/tablet stay the
        // original column.
        "card-hit ticket flex h-full flex-col border border-hairline surface-card",
        "transition-colors duration-base ease-out hover:border-accent-text/40",
        "lg:flex-row",
        className,
      )}
    >
      {/* Portrait/glyph column. Fixed `lg:w-44` — deliberately NOT
          proportional to the card, so it never grows with the stage (see
          file header). `lg:[&>:first-child]:…` overrides whichever single
          child (`PhotoFrame`'s frame div or `GlyphPlate`'s own div) is
          inside, exactly the mechanism `Ticket.tsx` already uses for its
          own landscape image zone. */}
      <div
        className={cn(
          "overflow-hidden rounded-none",
          "lg:h-full lg:w-44 lg:shrink-0",
          "lg:[&>:first-child]:aspect-auto lg:[&>:first-child]:h-full lg:[&>:first-child]:w-full",
        )}
      >
        {portrait ? (
          <PhotoFrame
            src={portrait}
            alt={member.photoAlt ?? member.name}
            aspect="4/5"
            sizes="(min-width: 1024px) 176px, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <GlyphPlate />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        {/* D8: the name is this card's one firm moment, never 600+ (ref 03
            type ramp). */}
        <h3 className="font-display font-medium text-heading text-fg">{member.name}</h3>

        {/* D8 + D4 light-borrow: the role reads as the tiny-caps micro-voice
            (the raw `micro-label` utility, not the `<MicroLabel>` component —
            no bracket/index device belongs on a job title) rather than a
            second block of prose competing with the bio below. */}
        <p className="micro-label mt-2">{member.role}</p>

        {/* Licence line — `licence`, never `dre` (see file header). Absent is
            a decision per seat, not an omission. */}
        {member.licence ? (
          <p className="data-line text-fg-meta mt-1">
            {member.licence}
            {member.brokerageLicence ? ` · brokerage ${member.brokerageLicence}` : ""}
          </p>
        ) : null}

        {/* D9: prose is constrained LOCALLY, not by the card's own width —
            the fluid content column earned by the landscape flip should
            widen the CARD's breathing room, not stretch the bio into a
            180-character line. `max-w-[46ch]` matches `DoorsSection`'s own
            body-copy measure. */}
        {member.bio ? (
          <p className="mt-4 max-w-[46ch] text-body text-fg-muted">{member.bio}</p>
        ) : null}

        {hasContact ? (
          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
            {hasEmail ? (
              <div className="flex items-center gap-1">
                <CopyButton
                  value={member.email}
                  label={member.email}
                  actionLabel={`Copy ${member.name}'s email`}
                />
                <a
                  href={`mailto:${member.email}`}
                  aria-label={`Email ${member.name}`}
                  className="inline-flex size-11 items-center justify-center rounded-pill text-fg-muted transition-colors duration-fast ease-out hover:text-accent-text"
                >
                  <Mail aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </a>
              </div>
            ) : null}

            {hasPhone && member.phone ? (
              <a
                href={telHref(member.phone)}
                className="data-line inline-flex min-h-11 items-center text-fg-muted transition-colors duration-fast ease-out hover:text-accent-text"
              >
                {member.phone}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
