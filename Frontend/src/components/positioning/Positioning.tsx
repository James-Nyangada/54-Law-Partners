"use client";

import { Fragment, useEffect, useRef } from "react";
import {
  ensureGsap,
  ScrollTrigger,
  EASE,
  DURATION,
  STAGGER,
  prefersReducedMotion,
} from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";

/**
 * Section 2 — the positioning statement.
 *
 * The quiet scene after the hero. The sentence is read into existence word by
 * word as the visitor scrolls, the word AFRICA drifts behind it as texture,
 * and the institutional audience line and three facts rise into place once the
 * sentence is complete.
 */
export function Positioning() {
  const { locale, t } = useLocale();
  const words = t.positioning.statement.split(" ");

  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const africaRef = useRef<HTMLSpanElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  // The word-by-word scrub. Rebuilt when the language changes, because the
  // sentence has a different number of words.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    const statement = statementRef.current;
    if (!section || !statement) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        statement.querySelectorAll("[data-word]"),
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          duration: 0.3,
          stagger: 0.1,
          scrollTrigger: {
            trigger: statement,
            start: "top 90%",
            endTrigger: section,
            end: "top top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [locale]);

  // The backdrop drift and the one-time entrance of what follows the sentence.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    const africa = africaRef.current;
    const after = afterRef.current;
    if (!section || !africa || !after) return;

    const items = after.querySelectorAll<HTMLElement>("[data-rise]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        africa,
        { x: () => window.innerWidth * 0.12 },
        {
          x: () => -window.innerWidth * 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.set(items, { autoAlpha: 0, y: 24 });
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        once: true,
        onEnter: () => {
          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.entrance,
            ease: EASE,
            stagger: STAGGER.group,
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="positioning"
      ref={sectionRef}
      className="surface-light relative flex min-h-svh items-center overflow-hidden bg-bone px-[clamp(1.5rem,5vw,7rem)] py-28 text-onyx"
    >
      {/* The backdrop word, in outline only, at 4% opacity. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          ref={africaRef}
          className="select-none whitespace-nowrap font-serif text-[clamp(8rem,28vw,25rem)] leading-none tracking-[0.02em] text-bone opacity-[0.04]"
          style={{
            WebkitTextStroke: "4px var(--color-onyx)",
            // Stroke under a bone fill: a clean outline, no contour seams.
            paintOrder: "stroke fill",
          }}
        >
          {t.positioning.backdrop}
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-[1000px]">
        <p
          ref={statementRef}
          className="text-center font-serif text-[clamp(1.75rem,4.4vw,4.5rem)] leading-[1.14] tracking-[-0.015em]"
        >
          {words.map((word, index) => (
            <Fragment key={index}>
              <span data-word>{word}</span>
              {index < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>

        <div ref={afterRef}>
          {/* The institutional audience, named in one line. */}
          <p
            data-rise
            className="mx-auto mt-12 max-w-[46ch] text-center text-[clamp(1.125rem,1.5vw,1.375rem)] leading-[1.5] text-onyx/75"
          >
            {t.positioning.audience}
          </p>

          <ul className="mt-16 grid grid-cols-1 divide-y divide-onyx/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {t.positioning.facts.map((fact, index) => (
              <li key={index} data-rise className="px-6 py-6 text-center sm:py-2">
                <p className="text-[12px] uppercase tracking-[0.22em] text-forest">{fact.label}</p>
                <p className="mt-3 font-serif text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug">
                  {fact.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
