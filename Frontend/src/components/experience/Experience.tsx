"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, EASE, DURATION, prefersReducedMotion } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { areaName } from "@/components/practice/data";
import { MATTERS, SAMPLE_MATTERS } from "./data";

const IS_DEV = process.env.NODE_ENV !== "production";

/** The firm's matters; samples stand in during development only. */
const SHOWN = MATTERS.length
  ? MATTERS.map((matter) => ({ ...matter, isSample: false }))
  : IS_DEV
    ? SAMPLE_MATTERS.map((matter) => ({ ...matter, isSample: true }))
    : [];

/**
 * The experience synopsis: a forest section of four to six representative
 * matters, closed by a visible disclaimer. Replaces the credibility figures.
 */
export function Experience() {
  const { locale, t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const once = (trigger: string) => ({ trigger, start: "top 85%", once: true });
      gsap.fromTo(
        "[data-line]",
        { yPercent: 110 },
        { yPercent: 0, duration: DURATION.entrance, ease: EASE, stagger: 0.1, scrollTrigger: once("[data-head]") },
      );
      gsap.fromTo(
        "[data-head-rise]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: DURATION.entrance, ease: EASE, delay: 0.2, scrollTrigger: once("[data-head]") },
      );
      gsap.fromTo(
        "[data-matter]",
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: DURATION.entrance, ease: EASE, stagger: 0.1, scrollTrigger: once("[data-matters]") },
      );
      gsap.fromTo(
        "[data-matter-rule]",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.1, ease: EASE, stagger: 0.1, scrollTrigger: once("[data-matters]") },
      );
      gsap.fromTo(
        "[data-disclaimer]",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: DURATION.entrance, ease: EASE, scrollTrigger: once("[data-disclaimer]") },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  if (SHOWN.length === 0) return null;

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-title"
      className="bg-forest px-[clamp(1.5rem,5vw,7rem)] py-28 text-bone lg:py-40"
    >
      <div data-head className="grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="lg:col-span-6">
          <p className="line-mask">
            <span data-line className="text-[14px] uppercase tracking-[0.22em] text-mint">
              {t.experience.eyebrow}
            </span>
          </p>
          <h2
            id="experience-title"
            className="mt-6 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1] tracking-[-0.02em]"
          >
            <span className="line-mask">
              <span data-line>{t.experience.title}</span>
            </span>
          </h2>
        </div>
        <p
          data-head-rise
          className="text-[clamp(1.125rem,1.4vw,1.25rem)] leading-[1.55] text-sage lg:col-span-5 lg:col-start-8"
        >
          {t.experience.synopsis}
        </p>
      </div>

      <ol data-matters className="mt-16 grid gap-x-6 md:grid-cols-2 lg:mt-24 lg:grid-cols-3">
        {SHOWN.map((matter) => (
          <li key={matter.id} data-matter className="relative pb-12 pt-8">
            <span data-matter-rule aria-hidden="true" className="absolute inset-x-0 top-0 block h-px bg-bone/25" />
            <p className="text-[12px] uppercase tracking-[0.2em] text-mint">
              {areaName(matter.practice)[locale]}
            </p>
            <p className="mt-4 font-serif text-[clamp(1.25rem,1.7vw,1.5rem)] leading-[1.35]">
              {matter.summary[locale]}
            </p>
            {matter.context ? (
              <p className="mt-4 text-[13px] uppercase tracking-[0.14em] text-sage">{matter.context[locale]}</p>
            ) : null}
            {matter.isSample ? (
              <p className="mt-4 inline-block border border-bone/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-bone/80">
                {t.experience.sample}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      {/* The disclaimer is part of the section, not small print hidden elsewhere. */}
      <p
        data-disclaimer
        className="mt-8 max-w-[80ch] border-t border-bone/25 pt-6 text-[14px] leading-[1.7] text-sage"
      >
        {t.experience.disclaimer}
      </p>
    </section>
  );
}
