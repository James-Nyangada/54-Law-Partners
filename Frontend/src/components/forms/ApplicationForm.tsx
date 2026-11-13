"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ensureGsap, EASE, prefersReducedMotion } from "@/lib/motion";
import { submitForm, EMAIL_PATTERN } from "@/lib/forms";
import { useLocale } from "@/i18n/useLocale";
import { getOpenings } from "@/content/careers";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const MAX_BYTES = 5 * 1024 * 1024;

/** The application form with CV upload (site map decision 03, option A). */
export function ApplicationForm() {
  const { locale, t } = useLocale();
  const params = useSearchParams();
  const f = t.form.fields;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [file, setFile] = useState<File | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const openings = getOpenings();
  const preset = params.get("role") ?? "";

  const validators: Record<string, (value: string) => string | null> = {
    name: (v) => (v ? null : f.name.error),
    email: (v) => (!v ? f.email.error : EMAIL_PATTERN.test(v) ? null : f.email.invalid),
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(
      [...new FormData(form).entries()].filter(([key]) => key !== "cv").map(([key, value]) => [key, String(value).trim()]),
    ) as Record<string, string>;
    const found: Record<string, string | null> = {};
    for (const [key, validate] of Object.entries(validators)) found[key] = validate(data[key] ?? "");
    found.cv = file && file.type === "application/pdf" && file.size <= MAX_BYTES ? null : f.cv.error;
    setErrors(found);
    const first = [...Object.keys(validators), "cv"].find((key) => found[key]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitForm("application", { ...data, language: locale }, file);
      setStatus("sent");
      requestAnimationFrame(() => {
        const done = doneRef.current;
        if (!done) return;
        done.focus({ preventScroll: true });
        if (!prefersReducedMotion()) {
          ensureGsap().fromTo(done.querySelectorAll("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE, stagger: 0.1 });
        }
      });
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="outline-none">
        <span className="mb-8 block h-[2px] w-16 bg-mint" />
        <p className="line-mask"><span data-line className="type-section block">{t.apply.sentTitle}</span></p>
        <p className="line-mask mt-4"><span data-line className="type-lead block text-sage">{t.apply.sentText}</span></p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <Field name="name" label={f.name.label} autoComplete="name" required validate={validators.name} error={errors.name} />
      <Field name="email" type="email" label={f.email.label} autoComplete="email" required validate={validators.email} error={errors.email} />
      <Field name="phone" type="tel" label={f.phone.label} autoComplete="tel" optionalLabel={t.form.optional} />
      <RoleSelect label={f.role.label} speculative={f.role.speculative} preset={preset} options={openings.map((o) => ({ value: o.id, label: o.title[locale] }))} />

      <div className="sm:col-span-2">
        <span className="eyebrow block text-sage">{f.cv.label}</span>
        <label
          className={`group mt-3 flex min-h-20 cursor-pointer items-center justify-between gap-4 border border-dashed px-5 py-4 transition-colors duration-300 hover:border-mint ${
            errors.cv ? "border-error" : "border-line-raised"
          }`}
        >
          <span className="text-[15px] text-bone">{file ? file.name : f.cv.choose}</span>
          <span className="text-[13.5px] font-medium text-mint">{file ? f.cv.replace : "PDF"}</span>
          <input
            type="file"
            name="cv"
            accept="application/pdf"
            className="sr-only"
            aria-invalid={errors.cv ? true : undefined}
            onChange={(event) => {
              const chosen = event.target.files?.[0] ?? null;
              setFile(chosen);
              if (chosen?.type === "application/pdf" && chosen.size <= MAX_BYTES) setErrors((e) => ({ ...e, cv: null }));
            }}
          />
        </label>
        {errors.cv ? <p className="mt-2 text-[13px] text-error">{errors.cv}</p> : null}
      </div>

      <Field name="note" label={f.note.label} multiline optionalLabel={t.form.optional} className="sm:col-span-2" />

      <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
        <Button type="submit" arrow disabled={status === "sending"}>
          {status === "sending" ? t.form.sending : t.apply.send}
        </Button>
        {status === "failed" ? <p role="alert" className="text-[14px] text-error">{t.form.failed}</p> : null}
      </div>
    </form>
  );
}

function RoleSelect({ label, speculative, preset, options }: { label: string; speculative: string; preset: string; options: { value: string; label: string }[] }) {
  return (
    <div className="relative pt-6">
      <select
        id="apply-role"
        name="role"
        defaultValue={options.some((o) => o.value === preset) ? preset : ""}
        className="peer block w-full appearance-none bg-transparent pb-2.5 pt-2 pr-6 text-[16px] text-bone outline-none focus-visible:outline-none [&>option]:bg-onyx"
      >
        <option value="">{speculative}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <label htmlFor="apply-role" className="eyebrow pointer-events-none absolute left-0 top-0 text-sage peer-focus:text-mint">
        {label}
      </label>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line-raised" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-mint transition-transform duration-300 peer-focus:scale-x-100" />
    </div>
  );
}
