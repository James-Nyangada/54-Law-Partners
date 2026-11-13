"use client";

import { Fragment, useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";

/**
 * The positioning statement, read into existence word by word as the visitor
 * scrolls (wireframe: "words darken one by one"), then the three facts beneath
 * a rule that draws across.
 */
export function Positioning() {
  const { t } = useLocale();
  const words = t.positioning.statement.split(" ");
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    const statement = statementRef.current;
    if (!section || !statement) return;

    let ctx: gsap.Context | null = null;
    const cancel = whenRevealed(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          statement.querySelectorAll("[data-word]"),
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 45%", scrub: 0.5 },
          },
        );
      }, section);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="surface-light bg-bone text-onyx section-y">
      <div className="shell">
        <p
          ref={statementRef}
          className="mx-auto max-w-[1040px] text-center font-serif text-[clamp(28px,3.5vw,48px)] leading-[1.22] tracking-[-0.012em]"
        >
          {words.map((word, index) => (
            <Fragment key={index}>
              <span data-word>{word}</span>
              {index < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>

        <div className="mx-auto mt-[clamp(56px,7vw,96px)] max-w-[1040px]">
          <span data-reveal="rule" className="block h-px bg-line-light" />
          <ul className="grid gap-10 pt-10 sm:grid-cols-3 sm:gap-8">
            {t.positioning.facts.map((fact) => (
              <li key={fact.label} data-reveal="up">
                <p className="eyebrow text-forest">{fact.label}</p>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-muted">{fact.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
