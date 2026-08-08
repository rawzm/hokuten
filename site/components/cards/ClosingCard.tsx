/**
 * components/cards/ClosingCard.tsx — one tile in the `#closings` track record.
 *
 * Governed by hokuten-design-director ref 04 (`#closings`), ref 05 (Hovers),
 * ref 06 (Copy patterns → data lines, "Confidential") and
 * docs/design/specs/closings.md. Composes `CardShell` — read that file before
 * touching this one; every layout/hover/focus/no-reflow rule (fixed slots,
 * hover ring, touch tap-reveal, single card-hit area) already lives there.
 *
 * Server Component — the only client boundary in the tree is `PhotoFrame`'s
 * touch tap-reveal handler.
 *
 * ── Metrics + price colour split ────────────────────────────────────────────
 * `closing.metrics` (e.g. "96% LP/SP · 74 days", "Confidential · $227K/key",
 * "Lease → Buy · 1 year") is already the fully-joined two-slot mono string
 * from content/closings.ts — never re-split it. `closing.price` is the third,
 * accented slot: CardShell's `data` wrapper sets `text-fg-meta` on the whole
 * line, so the price gets its own `text-accent-text font-medium` span to read
 * as the emphasised value (typography law: "mono 500 for emphasised data
 * values"). The separator mirrors DataLine's accessible pattern — an
 * aria-hidden nbsp-glued middot followed by a real breakable space — so the
 * line only ever wraps between values, never mid-value, and a screen reader
 * hears distinct figures rather than one run-on string.
 *
 * ── No card destination in Phase 1 (docs/design/specs/closings.md) ─────────
 * Ref 04's `#closings` spec lists no click-through target for a closing tile
 * (unlike `#listings`, which explicitly links to Crexi) — these are proof,
 * not inventory, and the kwc source's closing-grid link was Dino-personal and
 * flagged "do not ship" in the port pack. `CardShell` is therefore used
 * without `href`, so the title renders as plain text. Hover still needs the
 * accent-hairline ring per ref 05 even without a link, so that class is added
 * directly here rather than relying on CardShell's `href &&` gate — the photo
 * grayscale→colour reveal already fires regardless of `href` because it keys
 * off the `card-hit` marker class CardShell always applies.
 */

import CardShell from "@/components/cards/CardShell";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import { Badge } from "@/components/atoms/Badge";
import { cn, metaLine } from "@/lib/utils";
import type { Closing } from "@/lib/types";

export type ClosingCardProps = {
  closing: Closing;
  className?: string;
};

export default function ClosingCard({ closing, className }: ClosingCardProps) {
  const meta = metaLine([
    closing.location,
    closing.keys ? `${closing.keys} keys` : undefined,
    closing.segment,
    closing.note,
  ]);

  return (
    <CardShell
      as="article"
      titleAs="h3"
      surface="card"
      photo={
        <PhotoFrame
          src={closing.photo}
          alt={closing.photoAlt}
          aspect="4/3"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      }
      title={closing.name}
      meta={meta}
      data={
        <>
          <span className="whitespace-nowrap">{closing.metrics}</span>
          <span aria-hidden="true">&nbsp;&middot;</span>{" "}
          <span className="text-accent-text font-medium whitespace-nowrap">
            {closing.price}
          </span>
        </>
      }
      badge={<Badge status="closed" />}
      className={cn(
        // Forced on: CardShell only adds this hover ring when `href` is set,
        // but closing tiles are hrefless by design (see file header) and ref
        // 05 still calls for the ring on hover.
        "hover:border-accent-text/40",
        className,
      )}
    />
  );
}
