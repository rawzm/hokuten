"use client";

/**
 * components/calculator/OptionTiles.tsx — the calculator's selectable-option
 * primitive: image squares, wide panels, and text segment chips, all three
 * driven by ONE real radio group.
 *
 * Spec: docs/DESIGN-REVISIT.md §3.8 (the locked option-tile shape contract) and
 * §4.6 ("every dropdown becomes selectable option tiles… tiles are real radio
 * groups"). Shapes:
 *
 *   square — 1:1 image tile, five across desktop / 2-up mobile. The artwork
 *            fills the tile; the label bar is UI painted over it.
 *   wide   — 5:2 source artwork rendered as a stacked full-width band, muted
 *            behind a scrim, label overlaid by UI.
 *   chip   — text segment chip, NO imagery. Condition / brand / ground lease
 *            are two-, three- and four-way choices; pictures on a choice like
 *            that read as noise, not craft (§3.8, a deliberate decision).
 *
 * ── THE MANY-TO-ONE TRAP (read before you touch `items`) ────────────────────
 * Two of the frozen option lists in lib/valuation.ts map SEVERAL labels onto
 * the SAME CONFIG value:
 *   BRAND_OPTIONS      3 labels → 2 values ("Soft-brand / lifestyle" → branded)
 *   CONDITION_OPTIONS  4 labels → 3 values ("15+ yrs / renovation (PIP) due"
 *                                            → over8)
 * A tile group keyed on `value` would collapse those pairs and silently delete
 * two user-visible options. This component is therefore keyed on the LABEL and
 * identified by the option's INDEX:
 *   - `item.id` is built by the caller from the array index, never the value;
 *   - `value`/`checked` compare `item.label`, never `item.value` (this
 *     component is not even given the CONFIG value — it cannot make that
 *     mistake);
 *   - the group's selected state is the raw display string, which is also
 *     exactly what `CalculatorForm` already stores and what the lead prefill
 *     carries (index.html:1606-1608).
 * All 18 shipped labels are unique strings, so label identity is total.
 *
 * ── WHY NATIVE RADIOS, NOT AN ARIA RADIOGROUP ───────────────────────────────
 * A visually-hidden native `<input type="radio">` inside its `<label>` gives us
 * arrow-key navigation, roving focus, the checked state, form semantics and
 * label-click activation for free, with zero keyboard code to get wrong. The
 * wrapper carries `role="radiogroup"` + `aria-labelledby` so the group itself
 * announces its own visible label. `sr-only` (not `display:none`) keeps every
 * input focusable.
 *
 * ── CHECKED STATE SURVIVES GRAYSCALE (ref 07 P0: never colour alone) ────────
 * Selected adds THREE independent signals: a 2px accent ring, a Lucide `Check`
 * glyph in a slot that is reserved at rest (so selecting shifts nothing), and
 * a solid label bar / scrim step. Print and grayscale both keep the ring and
 * the glyph.
 *
 * ── FOCUS ───────────────────────────────────────────────────────────────────
 * The selected ring is a box-shadow (`ring-2`) and the focus ring is a real
 * `outline`, so they never fight: a focused, checked tile shows both. The
 * `peer-focus-visible:` variant needs the input to be a PRECEDING SIBLING of
 * the styled element, which is why every shape is `<label><input/><span/></label>`
 * and all state classes live on that one span.
 *
 * ── CLASS STRINGS ARE PLAIN TEMPLATES, NEVER cn() ───────────────────────────
 * These tiles need a font-size token and a colour token on the same element
 * (`text-micro` + `text-paper`). `cn()`'s tailwind-merge treats `text-*` as one
 * group and would silently drop one of them — the same trap CalculatorResult's
 * `TERTIARY_LINK` documents. Template literals are not merged, so nothing is
 * dropped. `cn()` is used ONLY on the group container, which carries no colour.
 *
 * ── CONTRAST OF LABEL-OVER-IMAGE (verified, not hoped) ──────────────────────
 * Scrims are `color-mix` of `--ink` with transparency, so they are token-only
 * and identical in both themes. Worst case is a pure-white pixel under the
 * scrim, which is what these three mixes were chosen against: `--paper` on the
 * composite measures ≈12:1 at 92% ink, ≈9.0:1 at 82%, and ≈5.8:1 at 70%. All
 * three clear AA for the label size. Selected bars swap to `bg-accent` /
 * `text-on-accent`, an
 * opaque pair whose ratio is fixed by the palette (5.99:1 Theme G, 7.12:1
 * Theme B — docs/design/CONTRAST.md).
 */

import * as React from "react";
import { Check } from "lucide-react";

import { PhotoFrame } from "@/components/atoms/PhotoFrame";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

/** Exactly the shape `getArt()` in content/artwork.ts resolves to. */
export type OptionTileArt = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
};

export type OptionTileItem = {
  /**
   * Stable DOM id. Callers MUST derive it from the option's array INDEX —
   * never from its CONFIG value (see the many-to-one note in the header).
   */
  id: string;
  /** The byte-exact frozen display label. Doubles as the group's value. */
  label: string;
  /**
   * Resolved artwork, or null/undefined when the placement is
   * `blocked: awaiting-artwork` — the tile then renders the designed
   * typographic interim, never an empty slot and never stock imagery.
   */
  art?: OptionTileArt | null;
  /**
   * Word set large behind the interim tile. Defaults to `label`. Decorative
   * and `aria-hidden` — the label bar carries the real text.
   */
  interimWord?: string;
};

export type OptionTileShape = "square" | "wide" | "chip";

export type OptionTilesProps = {
  /** Radio group name. Unique per group on the page. */
  name: string;
  /** id of the element holding the group's visible label. */
  labelledBy: string;
  /** id of an optional description element. */
  describedBy?: string;
  items: readonly OptionTileItem[];
  /** The currently selected LABEL (not a CONFIG value). */
  value: string;
  onValueChange: (label: string) => void;
  shape: OptionTileShape;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Class vocabulary — template strings only, never merged (see header)        */
/* -------------------------------------------------------------------------- */

const FOCUS_RING =
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus";

/** Ink scrims. Token-only (`--ink` + transparent), so both themes match. */
const SCRIM_92 = "bg-[color-mix(in_srgb,var(--ink)_92%,transparent)]";
const SCRIM_82 = "bg-[color-mix(in_srgb,var(--ink)_82%,transparent)]";
const SCRIM_70 = "bg-[color-mix(in_srgb,var(--ink)_70%,transparent)]";

const TILE_BASE =
  "relative block overflow-hidden rounded-card transition-shadow duration-fast ease-out";

const SQUARE_BASE = `${TILE_BASE} aspect-square`;
const WIDE_BASE = `${TILE_BASE} flex h-16 items-center lg:h-14`;

const RING_ON = "ring-2 ring-accent";
const RING_OFF = "ring-1 ring-hairline";

/** Bottom label bar of a square tile. Height is UI, not a tap target — the
 *  whole 1:1 tile is the control and clears 44px on its own. */
const BAR_BASE =
  "absolute inset-x-0 bottom-0 flex min-h-10 items-center gap-1.5 px-2 py-1.5";
const BAR_ON = `${BAR_BASE} bg-accent text-on-accent`;
const BAR_OFF = `${BAR_BASE} ${SCRIM_92} text-paper`;

const TILE_LABEL_TEXT = "font-mono text-micro leading-tight uppercase";

const CHIP_BASE =
  "inline-flex min-h-11 items-center gap-2 rounded-pill border px-4 py-2 text-start font-sans text-data transition-colors duration-fast ease-out";
const CHIP_ON = `${CHIP_BASE} border-accent bg-accent-chip text-accent-text`;
const CHIP_OFF = `${CHIP_BASE} border-hairline text-fg-muted hover:border-accent-text hover:text-fg`;

/** Reserved 16px glyph slot: selecting adds a mark, never a layout shift. */
const CHECK_SLOT = "grid size-4 shrink-0 place-items-center";

const GROUP_CLASS: Record<OptionTileShape, string> = {
  square: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5",
  wide: "flex flex-col gap-2",
  chip: "flex flex-wrap gap-2",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function OptionTiles({
  name,
  labelledBy,
  describedBy,
  items,
  value,
  onValueChange,
  shape,
  className,
}: OptionTilesProps) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={cn(GROUP_CLASS[shape], className)}
    >
      {items.map((item, index) => (
        <OptionTile
          /* Index-keyed on purpose: two frozen labels may resolve to the same
             CONFIG value, so `value` is never an identity here. */
          key={item.id}
          index={index}
          item={item}
          name={name}
          shape={shape}
          selected={item.label === value}
          onSelect={onValueChange}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  One option                                                                 */
/* -------------------------------------------------------------------------- */

type OptionTileProps = {
  index: number;
  item: OptionTileItem;
  name: string;
  shape: OptionTileShape;
  selected: boolean;
  onSelect: (label: string) => void;
};

function OptionTile({ index, item, name, shape, selected, onSelect }: OptionTileProps) {
  return (
    <label className={shape === "chip" ? "relative inline-flex cursor-pointer" : "relative block cursor-pointer"}>
      {/*
        `sr-only`, never `hidden`: the input has to stay focusable for the
        native arrow-key roving to work. `aria-label` pins the accessible name
        to the frozen option string, so a tile's artwork alt text (which
        describes the depicted hotel, per the alt-text law) does not get
        concatenated into the radio's name.
      */}
      <input
        type="radio"
        id={item.id}
        name={name}
        value={item.label}
        checked={selected}
        onChange={() => onSelect(item.label)}
        aria-label={item.label}
        data-option-index={index}
        className="peer sr-only"
      />

      {shape === "square" ? (
        <SquareBody item={item} selected={selected} />
      ) : shape === "wide" ? (
        <WideBody item={item} selected={selected} />
      ) : (
        <span className={`${selected ? CHIP_ON : CHIP_OFF} ${FOCUS_RING}`}>
          <span className={CHECK_SLOT}>
            {selected ? <Check aria-hidden="true" strokeWidth={2} className="size-4" /> : null}
          </span>
          {item.label}
        </span>
      )}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Square (1:1 image tile)                                                    */
/* -------------------------------------------------------------------------- */

function SquareBody({ item, selected }: { item: OptionTileItem; selected: boolean }) {
  const art = item.art;

  return (
    <span className={`${SQUARE_BASE} ${selected ? RING_ON : RING_OFF} ${FOCUS_RING}`}>
      {art ? (
        <PhotoFrame
          src={art.src}
          alt={art.alt}
          aspect="1/1"
          sizes={art.sizes}
          /* The artwork carries its own colour — a grayscale-at-rest treatment
             would read as "disabled" on a chooser, and the touch toggle would
             fight the radio for the same tap. */
          reveal={false}
          tapReveal={false}
          className="absolute inset-0 rounded-card"
        />
      ) : (
        /* THE DESIGNED TYPOGRAPHIC INTERIM (never a blank slot, never stock).
           A dark star-grain ground with the option word cropped like art, so
           the tile holds the same weight in the row as the four photographic
           ones. Swapping in a delivered square is a data edit in
           content/artwork.ts — nothing here changes. */
        <span className="surface-dark absolute inset-0 overflow-hidden rounded-card">
          {/* `star-grain` declares `position: relative`, so it must never share
              an element with a positioning utility of ours — it gets its own
              full-size span, which also becomes the containing block for the
              typographic plate below. */}
          <span className="star-grain block size-full">
            <span
              aria-hidden="true"
              className="absolute inset-x-3 top-3 block font-display text-heading leading-[1.05] font-light text-fg-muted"
            >
              {item.interimWord ?? item.label}
            </span>
          </span>
        </span>
      )}

      <span className={selected ? BAR_ON : BAR_OFF}>
        <span className={CHECK_SLOT}>
          {selected ? <Check aria-hidden="true" strokeWidth={2} className="size-3.5" /> : null}
        </span>
        <span className={TILE_LABEL_TEXT}>{item.label}</span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Wide (5:2 source artwork as a stacked band)                                */
/* -------------------------------------------------------------------------- */

function WideBody({ item, selected }: { item: OptionTileItem; selected: boolean }) {
  const art = item.art;

  if (!art) {
    /* Text-panel fallback (§4.6: acceptable while imagery is missing). Keeps
       the exact same geometry so a later artwork drop changes nothing else. */
    return (
      <span
        className={`${WIDE_BASE} bg-field ${selected ? RING_ON : RING_OFF} ${FOCUS_RING}`}
      >
        <span className="relative flex min-w-0 items-center gap-2.5 px-4">
          <span className={CHECK_SLOT}>
            {selected ? (
              <Check aria-hidden="true" strokeWidth={2} className="size-4 text-accent-text" />
            ) : null}
          </span>
          <span className="font-sans text-data leading-tight text-fg">{item.label}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`${WIDE_BASE} ${selected ? RING_ON : RING_OFF} ${FOCUS_RING}`}>
      <PhotoFrame
        src={art.src}
        alt={art.alt}
        aspect="16/9"
        sizes={art.sizes}
        reveal={false}
        tapReveal={false}
        className="absolute inset-0 rounded-card"
      />
      {/* Muted at rest; selecting lifts the scrim so the art brightens — a
          second, colour-independent confirmation alongside ring + glyph. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 ${selected ? SCRIM_70 : SCRIM_82}`}
      />
      {/* `text-paper` sits on the WRAPPER, not just the label: the Check glyph
          is `currentColor`, and left to inherit from the surface scope it would
          paint dark ink onto a dark scrim and vanish. */}
      <span className="relative flex min-w-0 items-center gap-2.5 px-4 text-paper">
        <span className={CHECK_SLOT}>
          {selected ? <Check aria-hidden="true" strokeWidth={2} className="size-4" /> : null}
        </span>
        <span className="font-sans text-data leading-tight">{item.label}</span>
      </span>
    </span>
  );
}
