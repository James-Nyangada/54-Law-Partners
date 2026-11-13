"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ensureGsap, EASE, prefersReducedMotion } from "@/lib/motion";
import { submitForm, EMAIL_PATTERN } from "@/lib/forms";
import { useLocale } from "@/i18n/useLocale";
import { FIRM } from "@/content/firm";
import { AREAS } from "@/content/practice";
import { PATHS, href } from "@/lib/routes";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * The enquiry form. On the home page it is the short version and gives way, in
 * place, to a confirmation. On the contact page it asks for a little more and
 * moves on to the confirmation page.
 */
export function EnquiryForm({ variant = "short" }: { variant?: "short" | "full" }) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const f = t.form.fields;

  const validators: Record<string, (value: string) => string | null> = {
    name: (v) => (v ? null : f.name.error),
    email: (v) => (!v ? f.email.error : EMAIL_PATTERN.test(v) ? null : f.email.invalid),
    matter: (v) => (v ? null : f.matter.error),
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(
      [...new FormData(form).entries()].map(([key, value]) => [key, String(value).trim()]),
    ) as Record<string, string>;

    const found: Record<string, string | null> = {};
    for (const [key, validate] of Object.entries(validators)) found[key] = validate(data[key] ?? "");
    setErrors(found);
    const first = Object.keys(validators).find((key) => found[key]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      await submitForm("enquiry", { ...data, language: locale });
    } catch {
      setStatus("failed");
      return;
    }

    if (variant === "full") {
      router.push(PATHS.received[locale]);
      return;
    }

    const wrap = wrapRef.current;
    if (wrap) wrap.style.minHeight = `${wrap.offsetHeight}px`;
    if (prefersReducedMotion() || !formRef.current) {
      setStatus("sent");
      return;
    }
    const gsap = ensureGsap();
    gsap.to(formRef.current, {
      autoAlpha: 0,
      y: -16,
      duration: 0.5,
      ease: EASE,
      onComplete: () => {
        setStatus("sent");
        requestAnimationFrame(() => {
          const done = doneRef.current;
          if (!done) return;
          done.focus({ preventScroll: true });
          gsap.fromTo(done.querySelectorAll("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE, stagger: 0.1 });
          gsap.fromTo(done.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE, delay: 0.2 });
        });
      },
    });
  };

  const clear = (key: string) => setErrors((current) => ({ ...current, [key]: null }));

  if (status === "sent") {
    return (
      <div ref={wrapRef}>
        <div ref={doneRef} tabIndex={-1} role="status" className="outline-none">
          <span data-rule className="mb-8 block h-[2px] w-16 origin-left bg-mint" />
          <p className="line-mask">
            <span data-line className="type-section block">{t.form.sentTitle}</span>
          </p>
          <p className="line-mask mt-4">
            <span data-line className="type-lead block text-sage">{t.form.sentText}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef}>
      <form ref={formRef} noValidate onSubmit={onSubmit} aria-label={t.contactPage.form}>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          <Field name="name" label={f.name.label} autoComplete="name" required validate={validators.name} error={errors.name} onValid={() => clear("name")} />
          <Field name="organisation" label={f.organisation.label} autoComplete="organization" optionalLabel={t.form.optional} />
          <Field
            name="email"
            type="email"
            label={f.email.label}
            autoComplete="email"
            required
            validate={validators.email}
            error={errors.email}
            onValid={() => clear("email")}
            className={variant === "short" ? "sm:col-span-2" : ""}
          />
          {variant === "full" ? (
            <>
              <Field name="phone" type="tel" label={f.phone.label} autoComplete="tel" optionalLabel={t.form.optional} />
              <Field
                name="area"
                label={f.area.label}
                optionalLabel={t.form.optional}
                className="sm:col-span-2"
                options={[{ value: "", label: f.area.any }, ...AREAS.map((area) => ({ value: area.id, label: area.name[locale] }))]}
              />
            </>
          ) : null}
          <Field
            name="matter"
            label={f.matter.label}
            multiline
            required
            validate={validators.matter}
            error={errors.matter}
            onValid={() => clear("matter")}
            className="sm:col-span-2"
          />
        </div>

        <p className="mt-8 max-w-[62ch] border-l border-line-raised pl-4 text-[13px] leading-[1.6] text-sage">
          {FIRM.enquiryNotice?.[locale] ?? t.form.notice}{" "}
          <Link href={href.legal("privacy", locale)} className="text-mint underline-offset-4 hover:underline">
            {t.form.privacy}
          </Link>
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button type="submit" disabled={status === "sending"} arrow>
            {status === "sending" ? t.form.sending : t.form.send}
          </Button>
          {status === "failed" ? (
            <p role="alert" className="text-[14px] text-error">
              {FIRM.email ? (
                <>
                  {t.form.failedWithEmail}{" "}
                  <a href={`mailto:${FIRM.email}`} className="text-mint underline underline-offset-4">
                    {FIRM.email}
                  </a>
                </>
              ) : (
                t.form.failed
              )}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
