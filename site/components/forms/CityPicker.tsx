"use client";

/**
 * components/forms/CityPicker.tsx — the searchable US city → City + State control.
 *
 * Ported from ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html:2027-2132
 * via docs/port/05-forms-and-ticker.md §B. Section spec: design-skill reference
 * 04 → `#bov` ("searchable City/State picker (us-cities dataset)").
 *
 * BEHAVIOUR CARRIED OVER EXACTLY (§B.3)
 *   • Dataset loads LAZILY on first focus, never at import. `/data/us-cities.min.json`
 *     is 552 KB raw; importing it would blow the 180 KB landing-route budget on
 *     its own, and the overwhelming majority of visitors never focus this field.
 *   • Minimum query length 2. Prefix matches rank above substring matches. The
 *     scan stops early at 400 collected matches; at most 60 rows render.
 *   • Matching is on the CITY NAME only — the state is never searched, so "CA"
 *     finds cities whose *name* contains "ca", not Californian ones.
 *   • Selection sets city = `"Albany"` and state = the FULL state name
 *     `"New York"` (falling back to the raw USPS code when the map lacks it).
 *     That two-field split is the wire format the destination inbox parses.
 *   • A failed fetch leaves the cache empty on purpose, so the next focus retries.
 *   • Options are picked on `mousedown`, not `click`, so the pick lands before
 *     the input's blur tears the list down.
 *
 * DELIBERATE IMPROVEMENTS (logged as decisions)
 *   • Full ARIA 1.2 combobox semantics. The source set `role="combobox"` and
 *     `aria-expanded` but no `aria-activedescendant`, and its rows carried no
 *     `id` — a screen-reader user could move the highlight and hear nothing.
 *     Rows now carry ids and the input points at the active one.
 *   • The source's "selected chip" swapped the whole input out of the DOM for a
 *     `<span>`, which orphaned the `<label for>`. Here the input STAYS mounted
 *     and becomes read-only, showing `"Albany, New York"`, with a Change control
 *     beside it — same confirmed-selection feel, label binding intact.
 *   • Names are lower-cased ONCE when the dataset arrives instead of on every
 *     keystroke (the source lower-cased up to 29,856 names per keypress). Pure
 *     performance; the match order is unchanged.
 *   • Designed loading and failure rows, and a polite live count — the source
 *     rendered nothing at all while the 552 KB file was in flight.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

/** What the form submits. `stateCode` is display/QA only — the wire takes `state`. */
export type CitySelection = {
  /** City name only, e.g. `Albany`. */
  city: string;
  /** Full state name, e.g. `New York`. */
  state: string;
  /** USPS code, e.g. `NY`. Shown in the result rows. */
  stateCode: string;
};

/** Shape verified against the shipped file: 61 states, 29,856 `[city, ST]` tuples. */
type RawCityData = {
  states: Record<string, string>;
  cities: [string, string][];
};

export type CityIndex = RawCityData & {
  /** `cities[i][0].toLowerCase()`, precomputed. Same length, same order. */
  lower: string[];
};

const DATA_URL = "/data/us-cities.min.json";

/** Minimum characters before the list opens (source: `q.length < 2` closes it). */
const MIN_QUERY = 2;
/** Stop scanning once this many matches are collected (source: 400). */
const SCAN_CAP = 400;
/** Maximum rendered rows (source: `.slice(0, 60)`). */
const MAX_ROWS = 60;

/**
 * Module-scoped so a remount (or a second picker) reuses the parse. Left `null`
 * after a failure so the next focus genuinely retries, per the source comment.
 */
let cache: CityIndex | null = null;
let inflight: Promise<CityIndex> | null = null;

function loadCityIndex(): Promise<CityIndex> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = fetch(DATA_URL, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`us-cities.min.json → ${response.status}`);
      return response.json() as Promise<RawCityData>;
    })
    .then((raw) => {
      const index: CityIndex = {
        states: raw.states,
        cities: raw.cities,
        lower: raw.cities.map((row) => row[0].toLowerCase()),
      };
      cache = index;
      inflight = null;
      return index;
    })
    .catch((error: unknown) => {
      inflight = null;
      throw error;
    });

  return inflight;
}

/** Prefix matches first, then substring matches. Exported for tests. */
export function matchCities(index: CityIndex, query: string): [string, string][] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY) return [];

  const starts: number[] = [];
  const contains: number[] = [];
  const total = index.lower.length;

  for (let i = 0; i < total && starts.length + contains.length < SCAN_CAP; i += 1) {
    const at = index.lower[i].indexOf(q);
    if (at === 0) starts.push(i);
    else if (at > 0) contains.push(i);
  }

  return starts
    .concat(contains)
    .slice(0, MAX_ROWS)
    .map((i) => index.cities[i]);
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

type LoadStatus = "idle" | "loading" | "ready" | "error";

export interface CityPickerProps {
  /** From <Field>'s render prop — the <label for> target. */
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true | undefined;
  required?: true | undefined;
  value: CitySelection | null;
  onChange: (next: CitySelection | null) => void;
  /** Fires when focus leaves the whole control (not when moving to the list). */
  onBlur?: () => void;
  className?: string;
}

/** Copy deck. Ported strings are marked; the rest is net-new (see build report). */
const COPY = {
  /** index.html:1182, U+2026 ellipsis. */
  placeholder: "Start typing a city…",
  /** index.html:2049 empty state. */
  empty: "No matching city",
  loading: "Loading cities",
  failed: "The city list did not load. Type again to retry.",
  change: "Change",
  changeLabel: "Change city",
  listLabel: "City matches",
} as const;

export function CityPicker({
  id,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  required,
  value,
  onChange,
  onBlur,
  className,
}: CityPickerProps) {
  const listId = `${id}-listbox`;
  const optionId = (i: number) => `${id}-option-${i}`;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<LoadStatus>(cache ? "ready" : "idle");
  const [index, setIndex] = React.useState<CityIndex | null>(cache);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);

  const selected = value !== null;

  const results = React.useMemo(
    () => (index ? matchCities(index, query) : []),
    [index, query],
  );

  /** Lazy load. Bound to focus, and re-armed after a failure. */
  const ensureData = React.useCallback(() => {
    if (cache) {
      setIndex(cache);
      setStatus("ready");
      return;
    }
    setStatus("loading");
    loadCityIndex().then(
      (loaded) => {
        setIndex(loaded);
        setStatus("ready");
      },
      () => {
        // Back to idle, not stuck in error: the next keystroke retries, which is
        // the source's documented recovery path.
        setStatus("error");
      },
    );
  }, []);

  /* Close on any pointer press outside the control. The list is not a modal —
     it must never trap the page. */
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
        setActive(-1);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  /* Keep the highlighted row in view. `block: "nearest"` never scrolls the page.
     Queried by data attribute rather than by id selector: React's generated ids
     contain characters that would need CSS.escape, and this avoids the trap. */
  React.useEffect(() => {
    if (active < 0) return;
    listRef.current
      ?.querySelector<HTMLLIElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const pick = React.useCallback(
    (row: [string, string]) => {
      const [city, stateCode] = row;
      const state = index?.states[stateCode] ?? stateCode;
      onChange({ city, state, stateCode });
      setQuery("");
      setOpen(false);
      setActive(-1);
    },
    [index, onChange],
  );

  const clear = React.useCallback(() => {
    onChange(null);
    setQuery("");
    setOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  }, [onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setQuery(next);
    setActive(-1);
    setOpen(next.trim().length >= MIN_QUERY);
    if (status === "error" || status === "idle") ensureData();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (selected) {
      // Read-only confirmation state: Backspace / Delete reopens editing so the
      // Change button is a convenience, not the only route back.
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        clear();
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!results.length) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => {
        const next = current + step;
        if (next < 0) return results.length - 1;
        if (next >= results.length) return 0;
        return next;
      });
      return;
    }

    if (event.key === "Enter") {
      // Nothing highlighted → fall through to the form's submit, which then
      // fails the city check and shows "Please pick a city from the list."
      if (open && active > -1 && results[active]) {
        event.preventDefault();
        pick(results[active]);
      }
      return;
    }

    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      setOpen(false);
      setActive(-1);
      return;
    }

    if (event.key === "Tab") {
      setOpen(false);
      setActive(-1);
    }
  };

  /** Only fires when focus leaves the whole control, not when it moves inside it. */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) return;
    setOpen(false);
    setActive(-1);
    onBlur?.();
  };

  const liveMessage = !open
    ? ""
    : status === "loading"
      ? COPY.loading
      : status === "error"
        ? COPY.failed
        : results.length === 0
          ? COPY.empty
          : `${results.length} ${results.length === 1 ? "match" : "matches"}`;

  return (
    <div ref={rootRef} className={cn("relative", className)} onBlur={handleBlur}>
      <div className="flex items-center gap-3">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          /* The source used autocomplete="off" here and it stays off: a browser
             address suggestion would fill text that matches no dataset row. */
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && active > -1 ? optionId(active) : undefined}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          required={required}
          readOnly={selected}
          placeholder={COPY.placeholder}
          value={selected ? `${value.city}, ${value.state}` : query}
          onFocus={() => {
            if (!selected && status === "idle") ensureData();
          }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {selected ? (
          <Button
            type="button"
            variant="link"
            aria-label={COPY.changeLabel}
            onClick={clear}
            className="shrink-0"
          >
            {COPY.change}
          </Button>
        ) : null}
      </div>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={COPY.listLabel}
          className={cn(
            "surface-card absolute inset-x-0 top-[calc(100%+2px)] z-40",
            "max-h-64 overflow-y-auto rounded-card p-1",
            "hairline shadow-overlay",
          )}
        >
          {status === "loading" ? (
            <li role="presentation" className="px-3 py-3 font-mono text-data text-fg-meta">
              {COPY.loading}
            </li>
          ) : status === "error" ? (
            <li role="presentation" className="px-3 py-3 font-sans text-data text-fg-meta">
              {COPY.failed}
            </li>
          ) : results.length === 0 ? (
            // Not italic (2026-08-08 coherence audit): Inter ships no italic
            // file via next/font, so this rendered as a synthesized oblique,
            // and the typography program does not italicise UI. `text-data`
            // + `text-fg-meta` already separate it from a real result row —
            // exactly how the `error` row one branch up is already styled.
            <li role="presentation" className="px-3 py-3 font-sans text-data text-fg-meta">
              {COPY.empty}
            </li>
          ) : (
            results.map((row, i) => (
              <li
                key={`${row[0]}-${row[1]}-${i}`}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                data-active={i === active ? "true" : undefined}
                /* mousedown, not click: it must land before the input blurs. */
                onMouseDown={(event) => {
                  event.preventDefault();
                  pick(row);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-card px-3 py-2",
                  "text-body text-fg",
                  i === active && "bg-accent-chip text-ink",
                )}
              >
                {row[0]}
                <span className="text-fg-meta">,&nbsp;{row[1]}</span>
              </li>
            ))
          )}
        </ul>
      ) : null}

      <span role="status" aria-live="polite" className="visually-hidden">
        {liveMessage}
      </span>
    </div>
  );
}
