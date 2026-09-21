"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, EASE, DURATION, prefersReducedMotion } from "@/lib/motion";
import { ContactForm } from "./ContactForm";
import { FIRM } from "./firm";
import { useLocale } from "@/i18n/useLocale";

/**
 * Section 8 — the invitation. One line fills the upper half; beneath it the
 * form on the left and the firm's details on the right.
 */
export function Contact() {
  const { locale, t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-line-head]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: EASE,
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-line-head]", start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        "[data-field], [data-detail]",
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.entrance,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-split]", start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        "[data-detail-rule]",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.1,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-split]", start: "top 85%", once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const details = [
    { label: t.contact.details.office, value: FIRM.address[locale] },
    { label: t.contact.details.phone, value: FIRM.phone.display, href: FIRM.phone.href },
    { label: t.contact.details.email, value: FIRM.email, href: `mailto:${FIRM.email}` },
    { label: t.contact.details.hours, value: FIRM.hours[locale] },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="bg-onyx px-[clamp(1.5rem,5vw,7rem)] pb-28 text-bone"
    >
      <div className="flex min-h-[48svh] items-center pt-[calc(var(--header-h)+3rem)] pb-12">
        <h2
          id="contact-title"
          className="font-serif text-[clamp(2.75rem,5.6vw,5rem)] font-normal leading-[1.02] tracking-[-0.02em]"
        >
          <span className="line-mask">
            <span data-line-head>{t.contact.title}</span>
          </span>
        </h2>
      </div>

      <div data-split className="grid gap-y-20 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-6">
          <ContactForm />
        </div>

        <address className="not-italic lg:col-span-5 lg:col-start-8">
          <ul>
            {details.map((detail) => (
              <li key={detail.label} data-detail className="relative py-6">
                <span data-detail-rule aria-hidden="true" className="absolute inset-x-0 top-0 block h-px bg-bone/15" />
                <p className="text-[12px] uppercase tracking-[0.2em] text-mint">{detail.label}</p>
                <p className="mt-2 font-serif text-[clamp(1.25rem,1.6vw,1.375rem)] leading-snug">
                  {detail.href ? (
                    <a href={detail.href} className="transition-colors duration-300 hover:text-mint">
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </p>
              </li>
            ))}
          </ul>
          <span data-detail-rule aria-hidden="true" className="block h-px bg-bone/15" />
        </address>
      </div>
    </section>
  );
}
