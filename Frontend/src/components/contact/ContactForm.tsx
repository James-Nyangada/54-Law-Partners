"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ensureGsap, EASE, prefersReducedMotion } from "@/lib/motion";
import { submitEnquiry, type Enquiry } from "@/lib/enquiry";
import { FIRM } from "./firm";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

type FieldName = keyof Enquiry;

const FIELDS: {
  name: FieldName;
  label: string;
  type?: string;
  autoComplete?: string;
  required: boolean;
  multiline?: boolean;
  error: string;
}[] = [
  { name: "name", label: "Your name", autoComplete: "name", required: true, error: "Please add your name." },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", required: true, error: "Please add an email address we can reply to." },
  { name: "organisation", label: "Organisation", autoComplete: "organization", required: false, error: "" },
  { name: "matter", label: "The matter, in a few lines", required: true, multiline: true, error: "Please tell us a little about the matter." },
];

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * The enquiry form. No boxes: each field is a label above a 1px rule. On focus
 * the rule thickens to 2px and turns ochre, drawing from the left, while the
 * label shrinks and lifts. On success the form gives way, in place, to a line
 * of confirmation.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const wrapRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // The magnetic send button: within 100px it eases up to 12px toward the
  // cursor, and returns to centre when the cursor moves away.
  useEffect(() => {
    const button = buttonRef.current;
    if (!button || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const gsap = ensureGsap();
    const xTo = gsap.quickTo(button, "x", { duration: 0.3, ease: EASE });
    const yTo = gsap.quickTo(button, "y", { duration: 0.3, ease: EASE });

    const onMove = (event: PointerEvent) => {
      const box = button.getBoundingClientRect();
      // Measure from the button's resting position, not where it has drifted.
      const cx = box.left + box.width / 2 - Number(gsap.getProperty(button, "x"));
      const cy = box.top + box.height / 2 - Number(gsap.getProperty(button, "y"));
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const gapX = Math.max(0, Math.abs(dx) - box.width / 2);
      const gapY = Math.max(0, Math.abs(dy) - box.height / 2);

      if (Math.hypot(gapX, gapY) > 100) {
        xTo(0);
        yTo(0);
        return;
      }
      const length = Math.hypot(dx, dy) || 1;
      const pull = Math.min(12, length * 0.15);
      xTo((dx / length) * pull);
      yTo((dy / length) * pull);
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(button);
    };
  }, []);

  // The confirmation rises from its mask once the form has gone.
  useEffect(() => {
    if (status !== "sent") return;
    const confirm = confirmRef.current;
    if (!confirm) return;
    confirm.focus({ preventScroll: true });
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    gsap.fromTo(
      confirm.querySelectorAll("[data-line]"),
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: EASE, stagger: 0.1 },
    );
  }, [status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const enquiry = Object.fromEntries(
      FIELDS.map((field) => [field.name, String(data.get(field.name) ?? "").trim()]),
    ) as unknown as Enquiry;

    const found: Partial<Record<FieldName, string>> = {};
    for (const field of FIELDS) {
      const value = enquiry[field.name];
      if (field.required && !value) found[field.name] = field.error;
      else if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        found[field.name] = "That email address does not look complete.";
      }
    }
    setErrors(found);
    const firstInvalid = FIELDS.find((field) => found[field.name]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      await submitEnquiry(enquiry);
    } catch {
      setStatus("failed");
      return;
    }

    const wrap = wrapRef.current;
    // Hold the space so the page does not jump when the form leaves.
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
      onComplete: () => setStatus("sent"),
    });
  };

  return (
    <div ref={wrapRef}>
      {status === "sent" ? (
        <div ref={confirmRef} tabIndex={-1} role="status" className="outline-none">
          <p className="line-mask">
            <span data-line className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.2]">
              Thank you. Your message is with us.
            </span>
          </p>
          <p className="line-mask mt-4">
            <span data-line className="text-[18px] text-ivory-muted">
              We will be in touch shortly.
            </span>
          </p>
        </div>
      ) : (
        <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Enquiry" className="space-y-8">
          {FIELDS.map((field) => {
            const id = `enquiry-${field.name}`;
            const error = errors[field.name];
            const shared = {
              id,
              name: field.name,
              placeholder: " ",
              required: field.required,
              "aria-invalid": error ? true : undefined,
              "aria-describedby": error ? `${id}-error` : undefined,
              // A field's message clears as soon as the visitor starts fixing it.
              onInput: error
                ? () => setErrors((current) => ({ ...current, [field.name]: undefined }))
                : undefined,
              className:
                "peer block w-full resize-none bg-transparent pb-3 pt-2 text-[18px] text-ivory outline-none placeholder:text-transparent focus-visible:outline-none",
            } as const;

            return (
              <div key={field.name} data-field>
                <div className="relative pt-7">
                  {field.multiline ? (
                    <textarea {...shared} rows={3} />
                  ) : (
                    <input {...shared} type={field.type ?? "text"} autoComplete={field.autoComplete} />
                  )}
                  {/* The label rests on the rule, and lifts and shrinks on focus or once filled. */}
                  <label
                    htmlFor={id}
                    className={`pointer-events-none absolute left-0 top-9 origin-left text-[18px] text-ivory-muted transition-[translate,scale,color] duration-500 ${EASE_CLASS} peer-focus:-translate-y-7 peer-focus:scale-[0.72] peer-focus:text-ochre peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-[0.72]`}
                  >
                    {field.label}
                    {field.required ? null : <span className="text-ivory/40"> (optional)</span>}
                  </label>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 block h-px bg-ivory/25" />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 block h-[2px] origin-left scale-x-0 bg-ochre transition-transform duration-[600ms] ${EASE_CLASS} peer-focus:scale-x-100`}
                  />
                </div>
                {error ? (
                  <p id={`${id}-error`} className="mt-2 text-[13px] text-ochre">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button
              ref={buttonRef}
              type="submit"
              disabled={status === "sending"}
              className="group relative overflow-hidden border border-ivory/40 px-10 py-5 text-[13px] uppercase tracking-[0.16em] text-ivory transition-colors duration-500 hover:text-ink focus-visible:text-ink disabled:opacity-60"
            >
              {/* The ochre fill rises from the bottom as the label crosses to ink. */}
              <span
                aria-hidden="true"
                className={`absolute inset-0 block origin-bottom scale-y-0 bg-ochre transition-transform duration-500 ${EASE_CLASS} group-hover:scale-y-100 group-focus-visible:scale-y-100`}
              />
              <span className="relative">{status === "sending" ? "Sending" : "Send enquiry"}</span>
            </button>
            {status === "failed" ? (
              <p role="alert" className="text-[14px] text-ochre">
                Your message could not be sent. Please email us at{" "}
                <a href={`mailto:${FIRM.email}`} className="underline underline-offset-4">
                  {FIRM.email}
                </a>
                .
              </p>
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
}
