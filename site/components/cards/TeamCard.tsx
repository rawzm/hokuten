/**
 * components/cards/TeamCard.tsx — one principal tile in the `#team` grid.
 *
 * Governed by hokuten-design-director ref 04 (`#team`), ref 06 (Team bios,
 * evidence gate, Dino's CA DRE), ref 07 (P0: phone visible in plain text +
 * `tel:`, email copy-to-clipboard AND `mailto:`) and
 * docs/design/specs/team.md — read that file for the full IA/states/motion
 * rationale before touching this one.
 *
 * Server Component — the only client boundaries in the tree are `PhotoFrame`
 * (touch tap-reveal) and `CopyButton` (clipboard), both existing, unmodified
 * modules.
 *
 * ── Not using `CardShell` (decision — mirrors `MandatesSection`'s own call)─
 * `CardShell`'s `meta` slot line-clamps to 2 lines / reserves `3.2em` — sized
 * for a short caption ("Lake Harmony, PA · Full-Service · 450 keys"), not
 * prose. A person's bio is prose, and Dino's real content (`content/team.ts`)
 * runs 3–4 sentences of verified, register-tracked figures ("$200M+ …
 * USMC veteran. Former hotel owner-operator."). Clamping it would visually
 * truncate a claim ref 06's register lists as one verified unit, and
 * `CardShell.tsx` is not a file this task owns, so its clamp can't be relaxed
 * for this one caller. `CardShell` also has no fourth slot for a
 * compliance-adjacent DRE line and forces its `data` slot to mono type —
 * wrong for prose. So this file applies the same chassis TOKENS `CardShell`
 * itself is built from (`rounded-card`, `border-hairline`, `surface-card`,
 * the `card-hit` hover marker) directly, rather than duplicating a second
 * generic card abstraction — see `MandatesSection.tsx` for the identical
 * precedent with mandate cards ("a different shape ref 04 asks for
 * explicitly, not a duplicated primitive").
 *
 * ── Portrait vs. glyph plate ────────────────────────────────────────────
 * Only Dino has a sourced photo (ref 04; ref 06; `content/team.ts`). Every
 * other card renders `GlyphPlate`: the same `aspect-[3/4]` box `PhotoFrame`
 * would occupy (so the grid row stays visually aligned), toned
 * `surface-deep`, holding the north-star/compass motif ref 01's Motif system
 * sanctions by name: "the site mark accent; usable as bullet, section stamp,
 * loading indicator." That is this use — a scarce, deliberate brand-mark
 * placement, not the "decorative fill" ref 03 bans (that targets colour
 * washes, not a single small glyph in one card's empty portrait slot). Never
 * initials-in-a-circle — that pattern IS the "grey avatar" AGENT-BRIEF names
 * as banned for this exact section.
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
 * `content/team.ts`'s CONTRACT GAP note: `TeamMember.email` is typed
 * `string` (required) but three of four rows have no sourced address and
 * carry `""`. This file treats a falsy `email` as "no channel" and renders
 * nothing for that row — never `mailto:` with an empty address. Reported,
 * not fixed here (`lib/types.ts` is not an owned file).
 */

import { Mail } from "lucide-react";

import type { TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PhotoFrame } from "@/components/atoms/PhotoFrame";
import { CopyButton } from "@/components/motion/CopyButton";

export type TeamCardProps = {
  member: TeamMember;
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
function NorthStarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path
        d="M24 6 C25.5 17 26.5 21.5 42 24 C26.5 26.5 25.5 31 24 42 C22.5 31 21.5 26.5 6 24 C21.5 21.5 22.5 17 24 6 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** No-portrait plate — the same box `PhotoFrame` would fill. Deliberate, not decorative. */
function GlyphPlate() {
  return (
    <div className="surface-deep relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-none">
      {/* `text-fg-meta`, not `text-accent-text` (changed 2026-08-08, coherence
          audit). This is a FILLED shape at 40–48px, and ref 03's colour rule is
          "accent = action/exclusivity only; never decorative fills". Worse, it
          is not scarce in practice: three of four rows in content/team.ts have
          no portrait, so two of the three principal cards render this plate
          side by side — two solid accent stars in one grid, out-accenting the
          section's own CTAs and reading as a placeholder badge. At meta tone on
          the `surface-deep` plate it reads as a quiet watermark, which is what
          an absent portrait should look like. */}
      <NorthStarGlyph className="size-10 text-fg-meta sm:size-12" />
    </div>
  );
}

export function TeamCard({ member, className }: TeamCardProps) {
  const hasEmail = Boolean(member.email);
  const hasPhone = Boolean(member.phone);
  const hasContact = hasEmail || hasPhone;

  return (
    <article
      className={cn(
        // `card-hit` is the marker `photo-reveal` (globals.css) hovers off —
        // the same convention `CardShell` uses, applied directly here since
        // this file doesn't compose `CardShell` (see file header).
        "card-hit flex h-full flex-col rounded-card border border-hairline surface-card",
        "transition-colors duration-base ease-out hover:border-accent-text/40",
        className,
      )}
    >
      {member.photo ? (
        <div className="overflow-hidden rounded-none">
          <PhotoFrame
            src={member.photo}
            alt={member.photoAlt ?? member.name}
            aspect="3/4"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      ) : (
        <GlyphPlate />
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-heading text-fg">{member.name}</h3>

        <p className="mt-2 text-body text-fg-muted">{member.role}</p>

        {member.dre ? <p className="data-line text-fg-meta mt-1">{member.dre}</p> : null}

        <p className="mt-4 text-body text-fg-muted">{member.bio}</p>

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
