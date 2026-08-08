/**
 * Field — the composition wrapper: label + control + hint + error.
 * Governed by hokuten-design-director reference 03 "Components → Forms",
 * reference 07 P0 (contrast, colour-alone, focus) and P1 (form errors in
 * --brick).
 *
 * What it guarantees so the caller cannot forget:
 * - a visible <Label> bound by htmlFor/id (never placeholder-as-label);
 * - `aria-describedby` wired to whichever of hint/error exist, error first so
 *   it is announced first;
 * - `aria-invalid` on the control when there is an error;
 * - the error rendered as icon + text + role="alert" — colour alone is a P0
 *   fail (ref 07), so the Lucide AlertCircle glyph is not decoration.
 *
 * Dark-surface note: raw --brick is 5.93:1 on --paper but only 2.75:1 on
 * --dark, which would fail WCAG AA wherever a form sits on a dark chapter.
 * Inside .surface-dark / .surface-black the error text (and the icon, which
 * inherits currentColor) mixes 45% toward --paper: 6.54:1 on Theme G --dark,
 * 6.50:1 on Theme B --dark, 7.65:1 on --black. If globals.css ever gains a
 * surface-scoped --danger-text token, replace these two arbitrary values with
 * it and delete this paragraph.
 */

import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

/** The wiring a control needs. Spread it straight onto Input/Textarea/Select. */
export interface FieldControlProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  required: true | undefined;
}

/**
 * Stable ids for a label/control/hint/error group. Use it directly when a
 * control is too bespoke for <Field> (the calculator's slider rows, the
 * SMS-consent checkbox) and you still need the same ARIA wiring.
 */
export function useFieldIds(idProp?: string): {
  id: string;
  hintId: string;
  errorId: string;
} {
  const generated = React.useId();
  const id = idProp ?? `hk-field-${generated}`;
  return { id, hintId: `${id}-hint`, errorId: `${id}-error` };
}

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: React.ReactNode;
  /** Supply one to keep the id stable across renders (form libraries). */
  id?: string;
  /** Persistent helper copy. Stays visible alongside an error. */
  hint?: React.ReactNode;
  /** Truthy switches the field into its error state. */
  error?: React.ReactNode;
  required?: boolean;
  /**
   * Preferred form is the render function — it hands you the wired props:
   *   <Field label="Email" error={err}>{(c) => <Input {...c} type="email" />}</Field>
   * A plain node is accepted for controls you wire yourself with useFieldIds.
   */
  children: React.ReactNode | ((control: FieldControlProps) => React.ReactNode);
}

function Field({
  label,
  id: idProp,
  hint,
  error,
  required = false,
  className,
  children,
  ...props
}: FieldProps) {
  const { id, hintId, errorId } = useFieldIds(idProp);
  const hasError = Boolean(error);

  const describedBy =
    [hasError ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  const control: FieldControlProps = {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": hasError ? true : undefined,
    required: required ? true : undefined,
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      {typeof children === "function" ? children(control) : children}

      {hint ? (
        <p id={hintId} className="font-sans text-data text-fg-meta">
          {hint}
        </p>
      ) : null}

      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className={cn(
            "flex items-start gap-1.5 font-sans text-data",
            "text-brick",
            "[.surface-dark_&]:text-[color-mix(in_srgb,var(--brick)_55%,var(--paper))]",
            "[.surface-black_&]:text-[color-mix(in_srgb,var(--brick)_55%,var(--paper))]",
          )}
        >
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export { Field };
