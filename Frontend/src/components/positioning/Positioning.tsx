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

const STATEMENT =
  "A modern African law firm delivering commercially grounded, cross-border advice for businesses, investors and institutions operating across Africa.";

/**
 * Placeholder copy for the three facts. Swap in the firm's confirmed wording;
 * no figures are stated here because none have been supplied.
 */
const FACTS = [
  { label: "Base", value: "Headquartered in Nairobi" },
  { label: "Practice", value: "Transactions and disputes" },
  { label: "Reach", value: "Across Africa and beyond" },
];

const WORDS = STATEMENT.split(" ");

/**
 * Section 2 — the positioning statement.
 *
 * The quiet scene after the hero. The sentence is read into existence word by
 * word as the visitor scrolls, the word AFRICA drifts behind it as texture, and
 * three facts rise into place once the sentence is complete.
 */
export function Positioning() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const africaRef = useRef<HTMLSpanElement>(null);
  const factsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Without motion, the server-rendered state is the finished state.
    if (prefersReducedMotion()) return;

    const gsap = ensureGsap();
    const section = sectionRef.current;
    const statement = statementRef.current;
    const africa = africaRef.current;
    const facts = factsRef.current;
    if (!section || !statement || !africa || !facts) return;

    const words = statement.querySelectorAll<HTMLSpanElement>("[data-word]");
    const factItems = facts.querySelectorAll<HTMLLIElement>("[data-fact]");

    const ctx = gsap.context(() => {
      // Signature move 3 — scroll scrub. Each word runs from 15% to full ink in
      // turn, a few words overlapping, so the sentence reads itself in. It
      // completes as the section settles at the top of the viewport, and
      // reverses when the visitor scrolls back up.
      gsap.fromTo(
        words,
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

      // AFRICA drifts right to left across the whole time the section is on
      // screen. Slow enough to read as texture, never as a word.
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

      // The facts rise into place once, at the moment the sentence completes.
      gsap.set(factItems, { autoAlpha: 0, y: 24 });
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        once: true,
        onEnter: () => {
          gsap.to(factItems, {
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
      className="relative flex min-h-svh items-center overflow-hidden bg-ivory px-[clamp(1.5rem,5vw,7rem)] py-28 text-ink"
    >
      {/* AFRICA, in outline only, at 4% opacity behind the statement. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          ref={africaRef}
          className="select-none whitespace-nowrap font-serif text-[clamp(8rem,28vw,25rem)] leading-none tracking-[0.02em] text-ivory opacity-[0.04]"
          style={{
            WebkitTextStroke: "4px var(--color-ink)",
            // Stroke under an ivory fill: a clean outline, no contour seams.
            paintOrder: "stroke fill",
          }}
        >
          AFRICA
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-[1000px]">
        <p
          ref={statementRef}
          className="text-center font-serif text-[clamp(1.75rem,4.4vw,4.5rem)] leading-[1.14] tracking-[-0.015em]"
        >
          {WORDS.map((word, index) => (
            <Fragment key={index}>
              <span data-word>{word}</span>
              {index < WORDS.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>

        <ul
          ref={factsRef}
          className="mt-20 grid grid-cols-1 divide-y divide-ink/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {FACTS.map((fact) => (
            <li key={fact.label} data-fact className="px-6 py-6 text-center sm:py-2">
              <p className="text-[12px] uppercase tracking-[0.22em] text-red-earth">
                {fact.label}
              </p>
              <p className="mt-3 font-serif text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug">
                {fact.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
