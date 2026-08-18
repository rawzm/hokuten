/**
 * contrast.mjs — the evidence behind the P0 contrast gate.
 *
 *   node docs/design/contrast.mjs        (from the repo root)
 *
 * Run it after ANY palette change and paste the whole transcript into
 * docs/design/CONTRAST.md. The hexes below are hardcoded COPIES of
 * site/app/globals.css — they must be edited in the same commit as the CSS or
 * this transcript lies about what ships.
 *
 * Source of the values: Dino's Brand Design Guide v1.3, adopted 2026-08-17
 * (L2 / R3 Option 1, docs/LAUNCH-IMPLEMENTATION.md §2.1).
 *
 * THREE CLASSES OF LINE, because "zero FAIL" only means something if the run
 * also proves the decorative tokens are still unusable as text:
 *
 *   PASS / FAIL   a pair the site actually BINDS — a foreground token on a
 *                 ground it is really rendered against. Any FAIL here is a
 *                 ship-stopper; the fix is to re-derive the token the
 *                 documented way (same hue and saturation, lightness moved
 *                 until the floor clears) and record it below.
 *   GUARD         a pair that must STAY below the floor. These are the
 *                 decorative tokens — brand gold on light, ivory-gray, the
 *                 retired ref-03 values. The line exists so nobody promotes
 *                 one to text on the grounds that "nothing failed".
 *   CONTINGENCY   a ground nothing is bound to today, recorded because a
 *                 documented alternative would bind it (cream as --surface-deep).
 *                 Below-floor here is information, not a failure.
 *
 * Thresholds: WCAG 2.1 AA — 4.5:1 normal text, 3:1 large text and UI.
 */

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const L = (h) => {
  const n = parseInt(h.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};
const CR = (a, b) => {
  const x = L(a),
    y = L(b);
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};
/** Mirrors CSS `color-mix(in srgb, A p%, B)`. */
const mix = (a, b, p) => {
  const A = parseInt(a.slice(1), 16),
    B = parseInt(b.slice(1), 16);
  const r = Math.round(((A >> 16) & 255) * p + ((B >> 16) & 255) * (1 - p)),
    g = Math.round(((A >> 8) & 255) * p + ((B >> 8) & 255) * (1 - p)),
    bl = Math.round((A & 255) * p + (B & 255) * (1 - p));
  return "#" + [r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
};
const f = (n) => n.toFixed(2);
/**
 * Two decimals rounds 4.4957 to "4.50", and a human reading "4.50, need 4.5"
 * marks it PASS — which is exactly how --accent-ink on cream got written up as
 * passing while this plan was drafted. Every verdict in this file is computed
 * on the raw float, never on the printed string, and any pair inside 0.05 of
 * its threshold also prints the signed margin so the rounding cannot mislead.
 */
const margin = (c, t) => (Math.abs(c - t) < 0.05 ? `  [margin ${(c - t >= 0 ? "+" : "") + (c - t).toFixed(4)}]` : "");

let bindings = 0,
  failures = 0,
  guards = 0,
  guardNotes = 0,
  contingency = 0;

/** A pair the site binds. Must clear `min`. */
const chk = (label, fg, bg, min = 4.5) => {
  const c = CR(fg, bg);
  bindings += 1;
  if (c < min) failures += 1;
  console.log(
    `${c >= min ? "PASS" : "FAIL"}  ${f(c)}:1  ${label}  (${fg} on ${bg}, need ${min})${margin(c, min)}`,
  );
};

/** A decorative pair that must STAY below the floor. */
const guard = (label, fg, bg, floor = 4.5) => {
  const c = CR(fg, bg);
  guards += 1;
  if (c >= floor) guardNotes += 1;
  console.log(
    `${c < floor ? "GUARD" : "NOTE "}  ${f(c)}:1  ${label}  (${fg} on ${bg}, must stay under ${floor})${margin(c, floor)}`,
  );
};

/** An unbound ground, recorded for a documented alternative. */
const cty = (label, fg, bg, min = 4.5) => {
  const c = CR(fg, bg);
  contingency += 1;
  console.log(
    `CONTINGENCY  ${f(c)}:1  ${label}  (${fg} on ${bg}, would need ${min}) — ${c >= min ? "clears" : "SHORT"}${margin(c, min)}`,
  );
};

const hr = (s) => console.log(`\n-- ${s} --`);

/* ══════════════════════════════════════════════════════════════════════════
   THEME G — Brand Guide v1.3. This is what production renders.
   ══════════════════════════════════════════════════════════════════════════ */
console.log("=== THEME G — Brand Guide v1.3 (production, [data-theme=\"gold\"]) ===");

const PAPER = "#FBF9F3", // --paper        guide: paper
  IVORY = "#F4EFE3", // --surface-deep / --accent-chip   guide: ivory
  CREAM = "#EDE7D8", // --rule / --accent-wash           guide: cream
  CARD = "#FFFFFF", // --card
  DARK = "#1A1C1F", // --dark   (pixel-sampled charcoal, = --ink)
  BLACK = "#000000", // --black / --art-ground / --hero-ground
  GOLD = "#B08D3F", // --accent / --accent-on-dark / --art-ink
  GOLD_DIM = "#C8A552", // --accent-dim / --art-mid
  GOLD_DEEP = "#675325", // --accent-deep   (derived)
  GOLD_INK = "#7E652D", // --accent-ink    (derived)
  INK = "#1A1C1F", // --ink
  INK_MUTED = "#4A4D52", // --ink-muted
  META = "#6E6862", // --meta
  META_SOFT = "#8B8680", // --meta-soft     (decorative)
  BRICK = "#A33B2C", // --brick         (form errors only)
  MONEY_L = "#1F6A4A", // --money-on-light
  MONEY_D = "#58A66E", // --money-on-dark / --live-on-dark
  DFIELD = "#F5F1E8", // --ink-dark-field / --hero-fg
  DMUTED = "#D0C9BC"; // --ink-dark-muted

/* The color-mix() steps the dark scopes still compute, resolved here exactly
   as the browser resolves them. */
const METAonDARK = mix(DFIELD, DARK, 0.52); // .surface-dark  --fg-meta
const METAonBLACK = mix(DFIELD, BLACK, 0.52); // .surface-black --fg-meta
const FIELDonDARK = mix(DFIELD, DARK, 0.07); // .surface-dark  --field
const FIELDonBLACK = mix(DFIELD, BLACK, 0.07); // .surface-black --field

hr("light scopes — .surface-paper (paper) · .surface-deep (ivory) · .surface-card (white)");
chk("--ink on --paper", INK, PAPER);
chk("--ink on --surface-deep (ivory)", INK, IVORY);
chk("--ink on --card", INK, CARD);
chk("--ink-muted on --paper", INK_MUTED, PAPER);
chk("--ink-muted on --surface-deep", INK_MUTED, IVORY);
chk("--ink-muted on --card", INK_MUTED, CARD);
chk("--meta on --paper", META, PAPER);
chk("--meta on --surface-deep", META, IVORY);
chk("--meta on --card", META, CARD);
chk("--accent-ink as text on --paper", GOLD_INK, PAPER);
chk("--accent-ink as text on --surface-deep", GOLD_INK, IVORY);
chk("--accent-ink as text on --card", GOLD_INK, CARD);
chk("--accent-ink as focus ring / UI on --paper", GOLD_INK, PAPER, 3);
chk("--accent-ink as focus ring / UI on --surface-deep", GOLD_INK, IVORY, 3);
chk("--accent-deep on --paper (pressed / dense stroke)", GOLD_DEEP, PAPER);
chk("--accent-deep on --card", GOLD_DEEP, CARD);
chk("--money-on-light on --paper", MONEY_L, PAPER);
chk("--money-on-light on --card (--field)", MONEY_L, CARD);
chk("--brick form error on --paper", BRICK, PAPER);
chk("--brick form error on --card (--field)", BRICK, CARD);

hr("dark scopes — .surface-dark (charcoal) · .surface-black");
chk("--fg = --ink-dark-field on --dark", DFIELD, DARK);
chk("--fg = --ink-dark-field on --black", DFIELD, BLACK);
chk("--fg-muted = --ink-dark-muted on --dark", DMUTED, DARK);
chk("--fg-muted = --ink-dark-muted on --black", DMUTED, BLACK);
console.log(`   color-mix 52% dark = ${METAonDARK} · 52% black = ${METAonBLACK}`);
chk("--fg-meta (dark-field ink @52%) on --dark", METAonDARK, DARK);
chk("--fg-meta (dark-field ink @52%) on --black", METAonBLACK, BLACK);
chk("--accent-on-dark as text on --dark", GOLD, DARK);
chk("--accent-on-dark as text on --black", GOLD, BLACK);
chk("--accent-dim hover / secondary on --dark", GOLD_DIM, DARK);
chk("--accent-dim hover / secondary on --black", GOLD_DIM, BLACK);
chk("--money-on-dark on --dark", MONEY_D, DARK);
chk("--money-on-dark on --black", MONEY_D, BLACK);
console.log(`   color-mix 7% dark = ${FIELDonDARK} · 7% black = ${FIELDonBLACK}`);
chk("--fg on a dark --field (input ground)", DFIELD, FIELDonDARK);
chk("--fg on a black --field", DFIELD, FIELDonBLACK);
chk("--accent-text as UI on a dark --field", GOLD, FIELDonDARK, 3);

hr("accent fill and hero");
chk("--on-accent on an --accent fill (pill / chip)", INK, GOLD);
chk("--hero-fg on --hero-ground", DFIELD, BLACK);

hr("guards — these must NOT clear the floor; nothing binds them as text");
guard("--accent brand gold as text on --paper", GOLD, PAPER);
guard("--accent brand gold as text on --surface-deep", GOLD, IVORY);
guard("--accent brand gold as text on --card", GOLD, CARD);
guard("--accent-dim as text on --paper", GOLD_DIM, PAPER);
guard("--paper as text on an --accent fill (never light-on-gold)", PAPER, GOLD);
guard("--meta-soft ivory-gray as text on --paper", META_SOFT, PAPER);
guard("ref-03's retired 'dark-field ink @40%' on --dark", mix(DFIELD, DARK, 0.4), DARK);

hr("contingency — cream #EDE7D8 is --rule / --accent-wash, NOT a text ground");
cty("--ink on cream", INK, CREAM);
cty("--accent-deep on cream", GOLD_DEEP, CREAM);
cty("--meta on cream", META, CREAM);
cty("--accent-ink on cream", GOLD_INK, CREAM);
cty("--accent-ink RE-DERIVED for cream — the one-line fix if cream is adopted", "#7A622C", CREAM);

/* ══════════════════════════════════════════════════════════════════════════
   THEME B — PARKED 2026-08-17 (L1). Unreachable: DEFAULT_THEME is gold and no
   switch exists. Its [data-theme="blue"] block is byte-identical to 2026-08-10
   and was NOT retuned to v1.3. Recorded so a future revival starts from
   measured ground rather than from scratch.
   ══════════════════════════════════════════════════════════════════════════ */
console.log("\n=== THEME B — Hokuten Blue (PARKED, unreachable, not retuned) ===");
const PAPERB = "#F7F8F5",
  DARKB = "#12172B",
  BLUE = "#2F4FA3",
  BLUE_MID = "#7E96D0",
  BLUE_DEEP = "#1F3C8C",
  CHIPB = "#DCE3F7",
  WASHB = "#C9D4EE";

hr("light scopes");
chk("--accent-ink blue on cool paper", BLUE, PAPERB);
chk("--accent-ink blue on card white", BLUE, CARD);
chk("--accent-ink blue on chip", BLUE, CHIPB);
chk("--accent-ink blue on wash", BLUE, WASHB);
chk("--accent-deep blue on cool paper", BLUE_DEEP, PAPERB);
chk("--on-accent cool paper on a blue fill", PAPERB, BLUE);
chk("--ink on cool paper", INK, PAPERB);
chk("--ink-muted on cool paper", INK_MUTED, PAPERB);
chk("--meta on cool paper", META, PAPERB);
chk("--accent-deep blue as art stroke on wash", BLUE_DEEP, WASHB, 3);

hr("dark scope — now inherits the SHARED --ink-dark-* rebinding, not --paper");
chk("--accent-on-dark blue-mid on indigo", BLUE_MID, DARKB);
chk("--fg = --ink-dark-field on indigo", DFIELD, DARKB);
chk("--fg-muted = --ink-dark-muted on indigo", DMUTED, DARKB);
console.log(`   color-mix 52% indigo = ${mix(DFIELD, DARKB, 0.52)}`);
chk("--fg-meta (dark-field ink @52%) on indigo", mix(DFIELD, DARKB, 0.52), DARKB);

hr("guards");
guard("--accent blue as text on indigo (why --accent-on-dark exists)", BLUE, DARKB);

/* ══════════════════════════════════════════════════════════════════════════ */
console.log("\n=== SUMMARY ===");
console.log(`bindings    ${String(bindings).padStart(3)} checked · ${failures} FAIL`);
console.log(
  `guards      ${String(guards).padStart(3)} checked · ${guardNotes} now clearing the floor (informational)`,
);
console.log(`contingency ${String(contingency).padStart(3)} recorded · unbound grounds`);
console.log(failures === 0 ? "GATE: PASS — zero FAIL." : `GATE: BLOCKED — ${failures} FAIL.`);
process.exitCode = failures === 0 ? 0 : 1;
