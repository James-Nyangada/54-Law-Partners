"use client";

import { useId, useState, type ReactNode } from "react";

export type Validator = (value: string) => string | null;

/**
 * A form field, per the UI kit. Fields are underlines, never boxes. On focus
 * the rule thickens to 2px and turns mint, drawing left to right, and the label
 * lifts and turns mint. Errors appear on blur, never while typing, and clear as
 * soon as the value becomes valid. Every field has a real <label for>.
 */
export function Field({
  name,
  label,
  type = "text",
  multiline,
  options,
  autoComplete,
  required,
  optionalLabel,
  validate,
  error: forcedError,
  onValid,
  className = "",
  tone = "dark",
}: {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  options?: { value: string; label: string }[];
  autoComplete?: string;
  required?: boolean;
  optionalLabel?: string;
  validate?: Validator;
  /** An error raised by the form on submit. */
  error?: string | null;
  onValid?: () => void;
  className?: string;
  tone?: "dark" | "light";
}) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const shown = error ?? forcedError ?? null;

  const check = (value: string) => (validate ? validate(value.trim()) : null);

  const shared = {
    id,
    name,
    required,
    autoComplete,
    "aria-invalid": shown ? true : undefined,
    "aria-describedby": shown ? `${id}-error` : undefined,
    onBlur: (event: { currentTarget: { value: string } }) => setError(check(event.currentTarget.value)),
    onInput: (event: { currentTarget: { value: string } }) => {
      if (shown && !check(event.currentTarget.value)) {
        setError(null);
        onValid?.();
      }
    },
    className: `peer block w-full resize-none bg-transparent pb-2.5 pt-2 text-[16px] outline-none placeholder:text-transparent focus-visible:outline-none ${
      tone === "dark" ? "text-bone" : "text-onyx"
    } disabled:opacity-40`,
  };

  const rest = tone === "dark" ? "bg-line-raised" : "bg-onyx/20";

  let control: ReactNode;
  if (options) {
    control = (
      <select {...shared} defaultValue="" className={`${shared.className} appearance-none pr-6 [&>option]:bg-onyx`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (multiline) {
    control = <textarea {...shared} rows={4} placeholder=" " />;
  } else {
    control = <input {...shared} type={type} placeholder=" " />;
  }

  return (
    <div className={className}>
      <div className="relative pt-6">
        {control}
        <label
          htmlFor={id}
          className={`eyebrow pointer-events-none absolute left-0 top-0 origin-left font-semibold transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:-translate-y-0.5 ${
            shown ? "text-error" : tone === "dark" ? "text-sage peer-focus:text-mint" : "text-muted peer-focus:text-forest"
          }`}
        >
          {label}
          {!required && optionalLabel ? <span className="ml-2 font-normal normal-case tracking-normal opacity-70">{optionalLabel}</span> : null}
        </label>
        {options ? (
          <svg aria-hidden="true" viewBox="0 0 10 6" width="10" height="6" className="pointer-events-none absolute bottom-4 right-1 text-sage" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="m1 1 4 4 4-4" />
          </svg>
        ) : null}
        <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 block h-px ${shown ? "bg-error" : rest}`} />
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 block h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100 ${
            shown ? "bg-error" : tone === "dark" ? "bg-mint" : "bg-forest"
          }`}
        />
      </div>
      {shown ? (
        <p id={`${id}-error`} className="mt-2 text-[13px] text-error">
          {shown}
        </p>
      ) : null}
    </div>
  );
}
