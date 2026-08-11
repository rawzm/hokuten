/**
 * components/sections/ListingsSection.tsx — `#listings`, "Hotels for sale",
 * the twelve-panel chassis's Screen 4.
 *
 * Governed by docs/DESIGN-REVISIT-2.md D9 (stage-shell), D10/§3.1 (page-panel,
 * the twelve-panel contract), D13 + §5.4 ("02 — Hotels for sale" — THIS
 * section's own spec: compact header, a first row of three tickets, a second
 * row of two CENTRED tickets at the same width as row one, full stage, fit
 * 1440x900 without scrolling), and hokuten-design-director ref 04
 * (`#listings`). Server Component — `Reveal` and `PhotoFrame` (inside
 * `ListingCard`/`Ticket`) already carry the only client-side code on this
 * page (AGENT-BRIEF: push the client boundary down, don't mark a whole
 * section client for it).
 *
 * ── THIS WAVE: page-panel + stage-shell replace section-fit + container-hk ──
 * The twelve-panel contract (AGENT-BRIEF, this round's task brief) requires
 * every one of the twelve screen roots to carry `page-panel` (participates in
 * the route's native scroll-snap set, globals.css §6b — `section-fit` alone
 * does not) and `stage-shell` (the fluid, max-width-free stage — REPLACES
 * `container-hk` on this route; D9). Both utilities are min-height/padding
 * only and deliberately set no `display`, so the existing
 * `lg:flex lg:flex-col lg:justify-center` centring pattern (unchanged,
 * carried forward from the D6 density pass) still does the actual vertical
 * distribution inside the panel.
 *
 * ── THE 3+2 CENTRED COMPOSITION (§5.4 point 1) ──────────────────────────────
 * "A first row of THREE tickets; a second row of TWO CENTRED tickets at THE
 * SAME WIDTH as row one. Do NOT stretch the last two into oversized cards."
 * A naive `grid-cols-3` leaves a trailing partial row LEFT-aligned (item 4
 * under item 1, item 5 under item 2) — not centred, and if the grid instead
 * stretched that last row to fill the width, the two remaining tickets would
 * balloon to 1.5x the width of row one, which the spec explicitly forbids.
 * `tileGridClass()` below solves both at once by doubling the grid's
 * resolution to SIX columns at `lg:` — every tile still spans two of those
 * six columns (`lg:col-span-2`, i.e. exactly one visual column of three, the
 * SAME width row one uses), but a trailing partial row's tiles get an
 * explicit `lg:col-start-*` that centres them within the six-column row
 * instead of just stacking under row one's leftmost columns:
 *   remainder 0 (a full multiple of 3, not today's case but handled anyway)
 *     → every tile is a plain `lg:col-span-2`, normal left-to-right flow.
 *   remainder 1 (one tile left over)
 *     → that tile gets `lg:col-start-3`, landing in the row's true centre
 *       (columns 3–4 of 6).
 *   remainder 2 (TODAY'S CASE — five listings, 3+2)
 *     → the two tiles get `lg:col-start-2` and `lg:col-start-4` (columns
 *       2–3 and 4–5 of 6), leaving exactly one empty sub-column on each
 *       side — centred, same width as row one, nothing stretched.
 * `total % 3` can only ever be 0, 1 or 2, so these three literal, pre-written
 * Tailwind strings are EXHAUSTIVE — the function never needs to interpolate
 * a computed number into a class name (the codebase's own established rule
 * against that, see `PhotoFrame.tsx`'s `ASPECT_CLASS` comment: "Literal
 * class strings so Tailwind's source scan can see them. Never build these by
 * interpolation — the utility would not be generated"). This also means the
 * composition self-corrects if the seed's listing count ever changes (a
 * Phase 2 feed swap, or Razim adding/removing a listing) without anyone
 * having to touch this file's grid logic again.
 * Below `lg:` this plays no role — mobile stays 1-up, tablet 2-up, both
 * unchanged from before; the 3+2 centring is a desktop-only composition
 * concern per §5.4's own "Desktop composition" framing (compare §5.1's
 * hero spec, which uses the identical "Desktop composition:" heading for the
 * same reason).
 *
 * ── Compact header + tightened rhythm, to help make the 1440x900 fit ────────
 * `section-pad` → `section-pad-tight` (matches the density pass every other
 * fit-to-viewport section already carries — `ClosingsSection`,
 * `CalculatorSection`'s siblings) and the header-to-grid gap drops from
 * `mt-10/lg:mt-8` to `mt-8/lg:mt-6`. Landscape tickets are naturally shorter
 * per unit width than the old vertical cards were (the row's height is set
 * by the content column, not a tall photo band — see `Ticket.tsx`'s own
 * "Landscape image zone" note), which is what makes fitting 3+2 rows of
 * tickets at 1440x900 plausible in the first place; this section spends its
 * own share of that budget by trimming chrome, not ticket content.
 * NOT independently verified against a real 1440x900 render — `pnpm dev`/
 * `pnpm build` are off-limits this round (agents share `.next`). Flagged for
 * the W7 screenshot pass.
 *
 * `#listings` sits between `#closings` (`surface-paper`) and `#calculator`
 * (`surface-paper`) — this section's own `surface-deep` matches neither
 * neighbour, so `section-join` does not apply here (that utility is for two
 * ADJACENT sections sharing one surface; check the real order/surfaces in
 * app/page.tsx before reaching for it — this section did, and doesn't
 * qualify).
 *
 * ── D8/D20 typography ────────────────────────────────────────────────────
 * No headline-size change here — `SectionHeader`'s default `display2` step
 * plus its one italic accent word (`*quietly*`) already carries this
 * section's hierarchy. D20's four-level device for this section lives inside
 * `Ticket`'s own structured slots (micro serial → serif title → mono money
 * price → compact mono facts), not in the section chrome.
 *
 * ── Content gap (see spec "Content gap — flagged, not invented") ───────────
 * Ref 04 §#listings gives the sub-line "Powered by our confidential channel"
 * verbatim but `content/listings.ts` — a file this agent does not own — has no
 * export for it or for a headline. Both are authored as local constants below
 * with this citation rather than invented from nothing; the content owner
 * should promote them into `content/listings.ts` next time that file is
 * touched, matching the `content/doors.ts` / `content/mandates.ts` pattern of
 * section-chrome copy living beside its section's data.
 */

import { Lock } from "lucide-react";

import { A100_ARMS_SIGNUP_URL } from "@/content/site";
import { listings, listingsEmptyState } from "@/content/listings";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { ListingCard } from "@/components/cards/ListingCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

/** ref 04 §#listings — no verbatim headline given; new copy in the established voice. */
const LISTINGS_HEADLINE = "On the market, handled *quietly*.";
/** ref 04 §#listings, verbatim: "Header + 'Powered by our confidential channel' subline." */
const LISTINGS_SUB = "Powered by our confidential channel.";

/** Every tile at `lg:` — see file header "3+2 centred composition." */
const GRID_COLS = 3;
const TILE_NORMAL = "lg:col-span-2";
const TILE_CENTER_SOLO = "lg:col-span-2 lg:col-start-3";
const TILE_CENTER_PAIR_FIRST = "lg:col-span-2 lg:col-start-2";
const TILE_CENTER_PAIR_SECOND = "lg:col-span-2 lg:col-start-4";

/**
 * Which `lg:` grid-placement class a tile at `index` gets, given `total`
 * tickets in the grid. See file header for the full derivation — this is
 * pure layout arithmetic, no rendering here.
 */
function tileGridClass(index: number, total: number): string {
  const remainder = total % GRID_COLS;
  if (remainder === 0) return TILE_NORMAL;

  const fullRows = Math.floor(total / GRID_COLS);
  const firstPartialRowIndex = fullRows * GRID_COLS;
  if (index < firstPartialRowIndex) return TILE_NORMAL;

  if (remainder === 1) return TILE_CENTER_SOLO;

  // remainder === 2 — today's five-listing case.
  const positionInRow = index - firstPartialRowIndex;
  return positionInRow === 0 ? TILE_CENTER_PAIR_FIRST : TILE_CENTER_PAIR_SECOND;
}

export function ListingsSection() {
  return (
    <section
      id="listings"
      aria-labelledby="listings-heading"
      className="surface-deep section-pad-tight page-panel lg:flex lg:flex-col lg:justify-center"
    >
      <div className="stage-shell">
        <SectionHeader
          id="listings-heading"
          index="02"
          label="Hotels for sale"
          headline={LISTINGS_HEADLINE}
          sub={LISTINGS_SUB}
        />

        {listings.length > 0 ? (
          <Reveal
            as="ul"
            stagger
            // 2-up starts at `md`, not `sm` (ref 03: "2-up only ≥640px if
            // cards stay ≥320px wide"). `lg:` doubles to a six-column grid
            // so the 3+2 centred composition can place tiles at half-column
            // resolution — see `tileGridClass()` above; every tile still
            // spans two of the six columns, i.e. one visual column of three.
            className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-6 lg:grid-cols-6 lg:gap-6"
          >
            {listings.map((listing, index) => (
              <RevealItem
                key={listing.id}
                as="li"
                className={tileGridClass(index, listings.length)}
              >
                <ListingCard listing={listing} index={index} className="h-full" />
              </RevealItem>
            ))}
          </Reveal>
        ) : (
          <Reveal
            as="div"
            className="surface-card hairline rounded-card mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center lg:mt-6"
          >
            <Lock aria-hidden="true" strokeWidth={1.5} className="size-6 text-fg-muted" />
            <p className="font-display text-heading text-fg max-w-[32ch]">
              {listingsEmptyState}
            </p>
            <Button asChild variant="primary">
              <a href={A100_ARMS_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
                Request invite to a100 Arms
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default ListingsSection;
