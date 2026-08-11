/**
 * components/sections/BovSection.tsx — `#bov`, the Broker Opinion of Value request.
 *
 * Spec: design-skill reference 04 → `#bov` (surface-deep). Copy: docs/port/04-copy.md
 * §7a (chrome) and §7b (the disclaimer paragraph, verbatim). Layout: DESIGN-REVISIT.md
 * §4.9 — "same treatment as the calculator: a LANDSCAPE split that fits the viewport" —
 * as revised by docs/DESIGN-REVISIT-2.md D9/D10/§5.7 below.
 *
 * SERVER COMPONENT. `<BovForm>` is dynamically imported (D7) rather than statically
 * imported, so its JS chunk never sits on the hero's critical path — only this
 * section's chrome (heading, micro-label, disclaimer, the designed loading
 * skeleton) is part of the initial bundle. See "THE DYNAMIC IMPORT" below.
 *
 * ── DESIGN REVISIT 2 (2026-08-10) — screen 11 of 12, D9/D10/§5.7 ────────────
 * Two chassis swaps, both mechanical, neither touching a field/state/string:
 *   1. `container-hk` (max-width 1200px) → `stage-shell` (D9): the full-width,
 *      fluid-gutter shell every one of the twelve landing screens now shares.
 *      §5.7's own words are "use the FULL STAGE" — this section's defect was
 *      never the landscape split itself, it was `container-hk`'s hard 1200px
 *      ceiling squeezing that split into a narrow column.
 *   2. `section-fit` (min-height only, D6) → `page-panel` (min-height only,
 *      same `--screen-fit` token, D10): identical non-clipping mechanism —
 *      see "THE TCPA BLOCK" below, unchanged by this swap — but `page-panel`
 *      is the specific selector the route-level `:root:has(main[data-page=
 *      "home"]) .page-panel` scroll-snap rule in globals.css targets, so this
 *      section now participates in the twelve-screen paged mode as screen 11.
 *      `lg:flex lg:flex-col lg:justify-center` is unchanged from the prior
 *      pass — it is what actually vertically CENTRES the pitch/form pair
 *      inside the panel's usable height once `page-panel` reserves it, per
 *      §5.7's "no nested scroll region… a short/zoomed viewport grows the
 *      page" (still true: `justify-center` only redistributes slack that
 *      already exists; it cannot compress content, so a genuinely tall TCPA
 *      block still pushes the section past one screen and the document
 *      scrolls, exactly as before).
 *
 * ── LANDSCAPE SPLIT (§4.9, §5.7) ─────────────────────────────────────────────
 * Pitch/context LEFT (micro-label, headline, the 48h-promise sub, the "reach out
 * early" disclaimer paragraph) with `<KanjiAccent>` behind it; the form's own
 * 2-column field grid RIGHT. `lg:grid-cols-[2fr_3fr]` stays fr-based (not a
 * fixed split) so the pair genuinely uses the stage at typical desktop widths
 * instead of stopping at a hardcoded number — but an fr-based right column on
 * a full-stage shell can reach 900–1400px+ wide, and letting a text input
 * stretch that wide is not "using the stage," it is a legibility bug. D9's own
 * text differentiates: use the full stage for the COMPOSITION, give the FORM
 * "its own field measure." That measure is capped on `<BovForm>`'s own root
 * (`lg:max-w-[42rem] lg:ml-auto` — see that file's header for the exact
 * reasoning and pixel math), not here, so this file does not know or care how
 * wide the form renders — it only places the two columns. The disclaimer
 * paragraph's own `border-l-2 pl-6` pull-quote treatment keeps it inside the
 * LEFT column's natural fr-share, which is materially wider now than the old
 * 1200px layout's ~416px — still comfortably inside prose measure at every
 * qualifying desktop width (verified at 1440/1920/2560: the left column never
 * exceeds ~65ch even uncapped, because the RIGHT column's own cap eventually
 * claims the leftover stage width as the gap between the two, not as extra
 * left-column growth — the grid track sizes are independent, the LEFT track's
 * `2fr` share is what actually bounds it).
 *
 * ── THE TCPA BLOCK STAYS FULLY VISIBLE, ALWAYS (non-negotiable) ─────────────
 * `page-panel` sets a MINIMUM height, never a maximum, and nothing in this file
 * sets `overflow-hidden`, `overflow-y-auto`/`scroll-well`, or a fixed `height` on
 * the section, the grid, or the form column. If the SMS-consent block (rendered
 * inside `<BovForm>`, imported byte-exact from `content/compliance.ts`) makes the
 * right column taller than one screen, the `<section>` simply grows past
 * `--screen-fit` to contain it — per the brief: "the SECTION gets taller, the
 * legal text does not get smaller." Nothing here can truncate, scroll-well, or
 * shrink that text; only `BovForm` itself renders it, and this file does not
 * touch that part of `BovForm`.
 *
 * ── THE DYNAMIC IMPORT (D7) ──────────────────────────────────────────────────
 * `next/dynamic` is called here WITHOUT `ssr: false` — that option throws in a
 * Server Component ("`ssr: false` is not allowed with `next/dynamic` in Server
 * Components", per Next's own docs). Omitting it keeps the default `ssr: true`
 * behaviour: Next still renders `<BovForm>`'s real markup into the HTML (so
 * `<noscript>` users and crawlers see the genuine form, not a stub), while the
 * client JS still code-splits into its own chunk, off the critical bundle. The
 * `loading` fallback is what a client-side hydration pass shows in the brief
 * window before that chunk has streamed in — verified against
 * `node_modules/next/dist/build/create-compiler-aliases.js`, which aliases
 * `next/dynamic` to the Suspense/RSC-safe implementation for anything compiled
 * inside `app/` (a different file from the one plain Node module resolution
 * would find outside Next's own bundler — do not "fix" the import path).
 *
 * `<BovFormSkeleton>` below is that fallback. It is not a generic spinner: every
 * bar reuses the REAL field/label/button classes from `ui/field.tsx`,
 * `ui/input.tsx`, `ui/checkbox.tsx` and `ui/button.tsx` so its row heights match
 * the hydrated form to the pixel, and it branches on `isWeb3FormsConfigured()` —
 * read here at the SERVER, same env value the client component itself reads —
 * because the unconfigured state (current: `NEXT_PUBLIC_WEB3FORMS_KEY` is not
 * yet provisioned) renders one extra message line and a second button that the
 * configured state does not. Guessing wrong here is exactly the kind of
 * reflow the "designed loading state, height reserved" instruction exists to
 * prevent.
 *
 * TWO CONTENT DECISIONS CARRIED FORWARD FROM THE PRIOR VERSION OF THIS FILE:
 *
 * 1. The headline is NOT the source's `What's your hotel worth?`. That exact
 *    string is used twice on the source page — once in the calculator section
 *    (index.html:917) and once here (:1164) — and docs/port/04-copy.md §7a flags
 *    the duplicate as an information-architecture problem to resolve, not to
 *    port. `#calculator` keeps the question; `#bov` answers it, and the italic
 *    accent word stays `worth` so the family resemblance survives.
 *
 * 2. The 48-hour promise is IMPORTED from content/methodology.ts (`bovPromise`)
 *    rather than retyped. It is an evidence-gated service-level claim that the
 *    source stated twice in two different wordings; docs/port/04-copy.md §7 marks
 *    keeping them in sync as a P0. One export, one wording, everywhere.
 *
 * The source's `No cost, no obligation.` sentence is deliberately absent: it is a
 * commercial commitment (P1 evidence flag) and it is not exported from
 * `site/content/`. Add it to a content module and it can render here.
 *
 * The source hung `id="contact"` on the disclaimer paragraph (index.html:1211).
 * That anchor is not reproduced — content/site.ts already resolves the nav's
 * Contact entry to `#bov`, and an id on a `<p>` inside a section is the IA mess
 * docs/port/04-copy.md §7 asks to untangle.
 */

import dynamic from "next/dynamic";

import { SectionHeader } from "@/components/atoms/SectionHeader";
import { KanjiAccent } from "@/components/art/KanjiAccent";
import { Reveal } from "@/components/motion/Reveal";
import { bovPromise } from "@/content/methodology";
import { CONTACT } from "@/content/site";
import { isWeb3FormsConfigured } from "@/lib/web3forms";
import { cn } from "@/lib/utils";

const HEADING_ID = "bov-heading";

const COPY = {
  /** index.html:1163 eyebrow, verbatim. */
  microLabel: "Broker opinion of value",
  /** See decision 1 in the header note. One italic accent word: `worth`. */
  headline: { before: "What your hotel is ", accent: "worth", after: ", in writing." },
  /**
   * index.html:1211, verbatim, with the address rendered from CONTACT rather
   * than typed in. docs/port/04-copy.md §7 calls this paragraph "the best
   * existing model for HOKUTEN voice on the whole page" — it is already
   * team-first, so nothing in it changes.
   */
  disclaimer: {
    lead: "Thinking about selling your hotel, now or down the road? Most owners hesitate to inquire until they're already committed to a sale. We'd rather meet you earlier than that. Prefer email? Send the property name, location, and available T-12 / STR information to ",
    tail: ". A call is optional.",
  },
  /**
   * NET-NEW. Rendered inside <noscript> — the form is a client island, so with
   * scripting off it renders but cannot send. Saying so beats a control that
   * silently does nothing.
   */
  noscript: `Sending this form needs JavaScript. Email ${CONTACT.email} with the property name, the location, and the available T-12 / STR information.`,
} as const;

/**
 * Read once at module scope, on the server: `isWeb3FormsConfigured()` is a pure
 * `process.env.NEXT_PUBLIC_WEB3FORMS_KEY` read (see lib/web3forms.ts — "Inlined
 * at build time by Next; identical on the server and in the browser"), so this
 * is the same value `<BovForm>` itself will compute once its chunk hydrates.
 * Reading it here — rather than inside the component function — keeps the
 * `dynamic()` call below at true module scope, which Next requires.
 */
const bovConfigured = isWeb3FormsConfigured();

/**
 * D7: off the hero's critical path. No `ssr: false` (disallowed in a Server
 * Component — see the file header). `.then((mod) => mod.BovForm)` extracts the
 * named export; `BovForm.tsx` keeps its own "use client" pragma and is
 * otherwise untouched by this file.
 */
const BovForm = dynamic(() => import("@/components/forms/BovForm").then((mod) => mod.BovForm), {
  loading: () => <BovFormSkeleton configured={bovConfigured} />,
});

export interface BovSectionProps {
  /**
   * Bracketed micro-label index. Default `09` — the last entry in the
   * definitive sitewide run fixed by the 2026-08-08 coherence audit:
   * 01 #closings · 02 #listings · 03 #calculator · 04 #method · 05 #doors ·
   * 06 #mandates · 07 #team · 08 #faq · 09 #bov, with #hero / #stats /
   * #brands deliberately unindexed above it (ref 04 pins #closings to 01, so
   * nothing earlier in the page may take a number). The earlier `07` guess
   * predated the registry. Do not change this without renumbering the run.
   */
  index?: string;
  className?: string;
}

export function BovSection({ index = "09", className }: BovSectionProps) {
  return (
    <section
      id="bov"
      aria-labelledby={HEADING_ID}
      className={cn(
        "surface-deep section-pad-tight",
        // D10: screen 11 of 12. `page-panel` is min-height ONLY (globals.css
        // §6) — it cannot clip the TCPA block; it can only ever make the
        // section AT LEAST one screen tall, never cap it shorter.
        "page-panel lg:flex lg:flex-col lg:justify-center",
        className,
      )}
    >
      <div className="stage-shell">
        <div className="grid items-start gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {/* LEFT — pitch + context. Its own positioning context for KanjiAccent,
              which needs nothing more than that (see components/art/KanjiAccent.tsx). */}
          <div className="relative isolate">
            <KanjiAccent />

            <Reveal>
              <SectionHeader
                id={HEADING_ID}
                index={index}
                label={COPY.microLabel}
                headline={COPY.headline}
                sub={bovPromise}
              />
            </Reveal>

            {/* Pull-quote treatment: Fraunces Light against an accent rule — the
                source's own device (`.bov-disclaimer`, index.html:625) translated
                to tokens. NOT italic (changed 2026-08-08, coherence audit): the
                typography program spends italic as a scarce one-word accent per
                headline, and a ~60-word italic serif run is the single loudest
                way to spend it wrong — it reads as a wedding invitation rather
                than a brokerage, and long italic at `--fg-muted` is the harder
                read. The serif face plus the accent rule already separate this
                from the form beside it. */}
            <Reveal delay={0.08}>
              <p className="mt-8 border-l-2 border-accent pl-6 font-display text-body-lg font-light text-fg-muted lg:mt-10">
                {COPY.disclaimer.lead}
                <a
                  href={CONTACT.emailHref}
                  className="text-accent-text underline underline-offset-4"
                >
                  {CONTACT.email}
                </a>
                {COPY.disclaimer.tail}
              </p>
            </Reveal>

            {/* Plain string child on purpose: React treats <noscript> children as
                text content, so an element child would hydrate inconsistently
                (the browser parses the tag as text when scripting is on). */}
            <noscript>{COPY.noscript}</noscript>
          </div>

          {/* RIGHT — the form's own 2-column field grid. `<BovForm>` renders its
              own `grid gap-6 sm:grid-cols-2` chassis; nothing here duplicates it. */}
          <Reveal delay={0.12}>
            <BovForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   BovFormSkeleton — the designed, height-matched loading state (D7).

   Every bar below reuses the REAL primitive classes it stands in for:
     - field label  → ui/label.tsx `"block font-sans text-body font-semibold
                       leading-snug"` (colour swapped for `text-transparent` —
                       same box, invisible ink — so the reserved line height is
                       exact, not a guess).
     - field control → ui/input.tsx `FIELD_SHELL` geometry: `rounded-card
                       border border-hairline bg-field`, `min-h-11`.
     - checkbox      → ui/checkbox.tsx's 44px (`size-11`) hit box.
     - submit button → ui/button.tsx `size="lg"`: `min-h-13`, `rounded-pill`.
     - status row    → BovForm.tsx's own `min-h-5` reserved status line.

   `configured` mirrors BovForm's own `isWeb3FormsConfigured()` branch: the
   unconfigured state renders one extra explanatory line AND a second
   (mailto) button beside Send, which the configured state does not. Guessing
   the wrong branch here is precisely the reflow "height reserved, no layout
   shift" exists to prevent — see the file header's "THE DYNAMIC IMPORT" note.

   `aria-hidden` on every decorative bar; one visually-hidden status line
   speaks for the whole thing so a screen-reader user isn't left in silence
   during the (typically sub-second) chunk fetch.
   --------------------------------------------------------------------------- */

const SKELETON_LABEL_CLASS =
  "block font-sans text-body font-semibold leading-snug text-transparent select-none";
const SKELETON_CONTROL_CLASS = "block min-h-11 w-full rounded-card border border-hairline bg-field";

function SkeletonField({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden="true">
      <span className={SKELETON_LABEL_CLASS}>Field label</span>
      <span className={SKELETON_CONTROL_CLASS} />
    </div>
  );
}

/** Mirrors PhoneField's own row shape: a dial-code control beside the national
 *  number field (`flex flex-wrap items-start gap-2`, `basis-32` + `flex-1`). */
function SkeletonPhoneField() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <span className={SKELETON_LABEL_CLASS}>Field label</span>
      <span className="flex flex-wrap items-start gap-2">
        <span className="block h-11 w-32 shrink-0 rounded-card border border-hairline bg-field" />
        <span className="block min-h-11 min-w-40 flex-1 rounded-card border border-hairline bg-field" />
      </span>
    </div>
  );
}

/** Mirrors the SMS-consent block: a 44px checkbox beside multi-line label
 *  copy, then the privacy/SMS-terms footnote line indented `pl-13` to clear
 *  the checkbox — same offset BovForm's real footnote paragraph uses. */
function SkeletonConsent() {
  return (
    <div className="sm:col-span-2" aria-hidden="true">
      <div className="flex items-start gap-2">
        <span className="block size-11 shrink-0 rounded-card border border-hairline bg-field" />
        <span className="min-h-11 flex-1 space-y-2 py-2">
          <span className="block h-4 w-full rounded-card bg-field" />
          <span className="block h-4 w-11/12 rounded-card bg-field" />
          <span className="block h-4 w-3/5 rounded-card bg-field" />
        </span>
      </div>
      <span className="mt-2 block pl-13">
        <span className="block h-4 w-2/3 rounded-card bg-field" />
      </span>
    </div>
  );
}

function BovFormSkeleton({ configured }: { configured: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      // Mirrors BovForm.tsx's own root exactly (`lg:ml-auto lg:max-w-[42rem]`,
      // D9) — the loading state must reserve the SAME box the hydrated form
      // will occupy, or the field-measure cap introduced this round becomes a
      // one-time layout shift the instant the real chunk streams in.
      className="grid gap-6 sm:grid-cols-2 lg:ml-auto lg:max-w-[42rem]"
    >
      <span className="visually-hidden">Loading the valuation request form…</span>

      <SkeletonField />
      <SkeletonField />
      <SkeletonField className="sm:col-span-2" />
      <SkeletonPhoneField />
      <SkeletonField />

      <SkeletonConsent />

      {!configured ? (
        <span aria-hidden="true" className="sm:col-span-2 flex items-start gap-2">
          <span className="mt-0.5 block size-4 shrink-0 rounded-card bg-field" />
          <span className="flex-1 space-y-1.5">
            <span className="block h-4 w-full rounded-card bg-field" />
            <span className="block h-4 w-2/3 rounded-card bg-field" />
          </span>
        </span>
      ) : null}

      <span aria-hidden="true" className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <span className="inline-block h-13 w-48 rounded-pill bg-field" />
        {!configured ? <span className="inline-block h-13 w-40 rounded-pill bg-field" /> : null}
      </span>

      <span aria-hidden="true" className="sm:col-span-2 block min-h-5" />
    </div>
  );
}
