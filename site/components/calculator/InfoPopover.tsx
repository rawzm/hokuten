"use client";

/**
 * components/calculator/InfoPopover.tsx — the calculator's eleven educational
 * ⓘ popovers.
 *
 * Copy is a VERBATIM port of the `data-tip` attributes at
 * ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html:937, :946, :950,
 * :959, :974, :983, :992, :996, :1010, :1012, :1013 — extracted in
 * docs/port/01-calculator.md §B (all eleven strings quoted in full there).
 * Design-skill reference 06 sanctions the calculator's ⓘ copy as a verbatim
 * port: "Calculator copy: port verbatim (step titles, ⓘ popovers, disclaimer,
 * insights HTML) — it is field-tested; rebrand only names."
 *
 * Prose is written as JSX string expressions rather than bare text nodes so the
 * source's plain ASCII apostrophes (U+0027) survive untouched — no smart quotes,
 * no entity substitution, no lint-driven rewrite. The load-bearing non-ASCII
 * characters are preserved exactly: — U+2014, – U+2013, ÷ U+00F7, ≈ U+2248,
 * × U+00D7, % and & as literal characters (the source stored `&amp;` inside an
 * HTML attribute; it renders as a single `&`).
 *
 * TWO DELIBERATE DEVIATIONS, both a11y (see docs/design/specs/calculator.md):
 *
 *  1. The source nested the trigger INSIDE the <label> (`<label>Keys<button
 *     class="calc-info">i</button></label>`). Nested interactive elements are a
 *     P0 failure — here the trigger is rendered as a SIBLING of the label by
 *     CalculatorSteps, and this file only owns the popover itself.
 *  2. The source gave ten of the eleven triggers the identical accessible name
 *     "What's this?". Each trigger now names what it explains. Those strings are
 *     accessible names, not visible copy — no rendered text changed.
 *
 * The source's bullet list used literal `•` U+2022 characters inside one long
 * attribute; it is rendered here as a real <ul>, which reads identically and
 * announces as a five-item list.
 *
 * Un-animated by inheritance from ui/popover.tsx: an explanatory popover carries
 * information, so it appears at once on every device and under every motion
 * setting (ref 05). Nothing here needs a reduced-motion gate.
 */

import type { ReactNode } from "react";

import { Popover, PopoverContent, PopoverInfoTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                            */
/* -------------------------------------------------------------------------- */

/** The source's `<strong>` inside a popover. Weight steps, colour holds. */
function Term({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-fg">{children}</strong>;
}

/**
 * The source's `<span class='tip-eg'>` — an italic example line in --meta
 * (index.html:451). Rendered as a block so it reads as an aside, not as prose.
 */
function Example({ children }: { children: ReactNode }) {
  return <span className="mt-1 block font-sans text-data italic text-fg-meta">{children}</span>;
}

/** One paragraph of popover prose. */
function Line({ children }: { children: ReactNode }) {
  return <p className="font-sans text-body text-fg-muted">{children}</p>;
}

/* -------------------------------------------------------------------------- */
/*  The eleven tips                                                            */
/* -------------------------------------------------------------------------- */

export type CalculatorTipId =
  | "propertyType"
  | "keys"
  | "tier"
  | "brand"
  | "condition"
  | "land"
  | "fb"
  | "noi"
  | "ttm"
  | "occupancy"
  | "adr";

type Tip = {
  /** Accessible name of the trigger — names what the popover explains. */
  label: string;
  body: ReactNode;
};

/** One row of the property-type list: term — description, then an example. */
function TypeItem({ term, text, example }: { term: string; text: string; example: string }) {
  return (
    <li className="font-sans text-body text-fg-muted">
      <Term>{term}</Term>
      {text}
      <Example>{example}</Example>
    </li>
  );
}

const TIPS: Record<CalculatorTipId, Tip> = {
  /* index.html:937 */
  propertyType: {
    label: "What property type means",
    body: (
      <>
        <p className="font-sans text-body text-fg">
          <Term>{"Pick what best fits your hotel:"}</Term>
        </p>
        <ul className="mt-3 flex list-disc flex-col gap-3 pl-5 marker:text-fg-meta">
          <TypeItem
            term="Limited-Service"
            text={" — no restaurant or room service; maybe a breakfast bar."}
            example="Hampton Inn, La Quinta"
          />
          <TypeItem
            term="Select-Service"
            text={" — limited food & beverage, a small meeting room, maybe a bar."}
            example="Courtyard, Hilton Garden Inn"
          />
          <TypeItem
            term="Full-Service"
            text={" — restaurant, room service, banquet space."}
            example="Marriott, Hilton flagship"
          />
          <TypeItem
            term="Resort / Boutique"
            text={" — destination or design-led independent."}
            example="Resort with pools, lifestyle hotel"
          />
          <TypeItem
            term="Extended-Stay"
            text={" — kitchenettes, longer / weekly guests."}
            example="Residence Inn, Homewood Suites"
          />
        </ul>
      </>
    ),
  },

  /* index.html:946 */
  keys: {
    label: "What keys means",
    body: (
      <Line>
        <Term>Keys</Term>
        {" = the total number of rentable guest rooms in the hotel."}
        <Example>{"A suite counts as one key."}</Example>
      </Line>
    ),
  },

  /* index.html:950 */
  tier: {
    label: "What market type means",
    body: (
      <Line>
        <Term>Market type</Term>
        {
          " — location drives price more than almost anything. Pick the bucket that best fits; it's used to set the cap rate (the going price of hotel income) for your area."
        }
        <Example>{"Not sure? 'Standard / suburban' is the safe middle."}</Example>
      </Line>
    ),
  },

  /* index.html:959 */
  brand: {
    label: "What brand or flag means",
    body: (
      <Line>
        <Term>{"Brand / flag"}</Term>
        {
          " — branded hotels usually sell at a friendlier price because their cash flow reads as lower-risk to buyers and lenders."
        }
        <Example>{"Soft-brands: Autograph, Tapestry, Curio."}</Example>
      </Line>
    ),
  },

  /* index.html:974 */
  condition: {
    label: "What age and condition means",
    body: (
      <Line>
        <Term>{"Age & condition"}</Term>
        {" — an upcoming brand-required renovation (a "}
        <Term>PIP</Term>
        {
          ") is one of the biggest silent value factors. Older assets carry capital risk buyers price in."
        }
      </Line>
    ),
  },

  /* index.html:983 */
  land: {
    label: "What fee simple and ground lease mean",
    body: (
      <Line>
        <Term>Fee simple</Term>
        {" = you own the land. "}
        <Term>Ground lease</Term>
        {
          " = the land is leased — this can reduce value 15–30% depending on the remaining term, and buyers always ask."
        }
      </Line>
    ),
  },

  /* index.html:992 */
  fb: {
    label: "What food and beverage share means",
    body: (
      <Line>
        <Term>{"Food & beverage share"}</Term>
        {
          " — restaurants/banquets run at thinner margins than rooms, so a high F&B mix slightly lowers the income margin we assume."
        }
        <Example>{"Leave blank if unsure."}</Example>
      </Line>
    ),
  },

  /* index.html:996 */
  noi: {
    label: "What NOI means",
    body: (
      <Line>
        <Term>{"NOI = Net Operating Income"}</Term>
        {
          " — the income the hotel throws off after operating expenses (before debt). If you know it, enter the annual figure and we'll use it directly — the most accurate input you can give us."
        }
      </Line>
    ),
  },

  /* index.html:1010 */
  ttm: {
    label: "What TTM means",
    body: (
      <Line>
        <Term>{"TTM = Trailing Twelve Months"}</Term>
        {
          " — your most recent 12 months of actual performance (not a calendar year). Buyers price a hotel off its TTM numbers because they show how it's running right now."
        }
      </Line>
    ),
  },

  /* index.html:1012 — the source used a <br> between the two sentences. */
  occupancy: {
    label: "What occupancy means",
    body: (
      <>
        <Line>
          <Term>Occupancy</Term>
          {" — the average % of your rooms filled over the last 12 months."}
        </Line>
        <Line>
          {"Room-nights sold ÷ room-nights available."}
          <Example>
            {"e.g. 27,000 sold out of 32,000 available ≈ 84%. Enter just the number."}
          </Example>
        </Line>
      </>
    ),
  },

  /* index.html:1013 — the source used a <br> between the two sentences. */
  adr: {
    label: "What ADR means",
    body: (
      <>
        <Line>
          <Term>{"ADR — Average Daily Rate"}</Term>
          {" — your average room revenue per "}
          <em className="italic">sold</em>
          {" room, before taxes."}
        </Line>
        <Line>
          {"Total room revenue ÷ rooms sold."}
          <Example>{"e.g. enter 198 for $198. (Occupancy × ADR = RevPAR.)"}</Example>
        </Line>
      </>
    ),
  },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export type InfoPopoverProps = {
  tip: CalculatorTipId;
  className?: string;
};

/**
 * A 44px ⓘ trigger plus its popover. Render it as a SIBLING of the field's
 * <label>, never inside it.
 */
export function InfoPopover({ tip, className }: InfoPopoverProps) {
  const { label, body } = TIPS[tip];

  return (
    <Popover>
      <PopoverInfoTrigger label={label} className={cn(className)} />
      <PopoverContent className="max-h-[min(70vh,28rem)] space-y-3 overflow-y-auto">
        {body}
      </PopoverContent>
    </Popover>
  );
}
