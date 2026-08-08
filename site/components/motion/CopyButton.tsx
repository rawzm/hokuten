/**
 * CopyButton — the kwc copy-to-clipboard micro-interaction, ported.
 * Governed by .agents/skills/hokuten-design-director/references/07-audit.md
 * ("Phone number visible in plain text (not icon-only); email copy-to-clipboard
 * AND mailto") and 03-visual-system.md for the chrome.
 *
 * THE GATE IS "AND", NOT "OR". This button satisfies only half of it. Whatever
 * contact block renders it MUST also render the same value as a real link
 * beside it — `<a href="mailto:…">` for an address, `<a href="tel:+1…">` for a
 * phone. A copy button alone is not reachable by a keyboard user who wants to
 * open their mail client, and it is not a link to assistive tech. Do not ship
 * this component on its own.
 *
 * Motion is CSS-only (label cross-fade + hover colour, both on `duration-fast`
 * / `ease-out`), so the reduced-motion block in globals.css already gives it
 * its designed static state: the swap happens instantly, never not at all.
 * That is why there is no useReducedMotion() call here — there is no JS
 * animation to gate.
 */

"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** How long "Copied" holds before the address comes back. */
const RESET_MS = 1600;

type Status = "idle" | "copied" | "failed";

export type CopyButtonProps = {
  /** The literal string that lands on the clipboard. */
  value: string;
  /** Resting visible label — normally the address or number itself. */
  label: string;
  /** What the button DOES, for the accessible name: "Copy email address". */
  actionLabel: string;
  /** Visible + announced on success. */
  copiedLabel?: string;
  /** Visible + announced when the clipboard is unavailable. */
  failedLabel?: string;
  className?: string;
};

/** Legacy path for non-secure contexts and browsers without the async API. */
function copyWithSelection(text: string): boolean {
  if (typeof document.execCommand !== "function") return false;

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "0";
  field.style.left = "-9999px";
  document.body.appendChild(field);

  const selection = document.getSelection();
  const previousRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  field.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(field);

  // Put the visitor's own selection back where it was.
  if (selection && previousRange) {
    selection.removeAllRanges();
    selection.addRange(previousRange);
  }

  return copied;
}

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or non-secure context — fall through.
  }
  return copyWithSelection(text);
}

export function CopyButton({
  value,
  label,
  actionLabel,
  copiedLabel = "Copied",
  failedLabel = "Copy unavailable",
  className,
}: CopyButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const onClick = useCallback(() => {
    void writeToClipboard(value).then((copied) => {
      setStatus(copied ? "copied" : "failed");
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus("idle"), RESET_MS);
    });
  }, [value]);

  const idle = status === "idle";
  const flashLabel = status === "failed" ? failedLabel : copiedLabel;

  const Icon = status === "copied" ? Check : status === "failed" ? TriangleAlert : Copy;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        // Stable accessible name that contains the visible label (WCAG 2.5.3),
        // so it never changes under the user mid-interaction.
        aria-label={`${actionLabel}: ${label}`}
        data-copy-state={status}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-pill hairline px-4",
          "data-line text-fg",
          // Surface-relative hover only. `accent-text` is the one accent role
          // proven against every surface scope in both themes; an absolute fill
          // like accent-chip would invert on .surface-dark.
          "transition-colors duration-fast ease-out",
          "hover:border-accent-text hover:text-accent-text",
          className,
        )}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0 text-accent-text" />
        {/* Both labels share one grid cell, so the button is sized by the wider
            of the two and the swap costs zero layout shift. */}
        <span className="grid">
          <span
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-fast ease-out",
              idle ? "opacity-100" : "opacity-0",
            )}
          >
            {label}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-fast ease-out",
              idle ? "opacity-0" : "opacity-100",
            )}
          >
            {flashLabel}
          </span>
        </span>
      </button>

      {/* Announced once, politely, without disturbing the button's own name. */}
      <span role="status" aria-live="polite" className="visually-hidden">
        {idle ? "" : `${flashLabel}: ${label}`}
      </span>
    </>
  );
}
