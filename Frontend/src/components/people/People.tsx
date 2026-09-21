"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, EASE, DURATION, prefersReducedMotion } from "@/lib/motion";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { PEOPLE } from "./data";
import { areaName } from "@/components/practice/data";
import { useLocale } from "@/i18n/useLocale";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const ROOMY_QUERY = "(hover: hover) and (min-width: 1024px)";

/**
 * Section 5 — our people.
 *
 * Two lawyers made deliberate by scale: two very large cards side by side.
 * Hovering one brings its portrait into colour, draws a rule beneath the name,
 * sends a "View profile" label after the cursor, and lets the other card recede.
 */
export function People() {
  const [focus, setFocus] = useState<number | null>(null);
  const { locale, t } = useLocale();

  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  // Entrances.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      const head = headRef.current;
      if (head) {
        gsap.fromTo(
          head.querySelectorAll("[data-line]"),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: DURATION.entrance,
            ease: EASE,
            stagger: 0.1,
            scrollTrigger: { trigger: head, start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          head.querySelectorAll("[data-rise]"),
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.entrance,
            ease: EASE,
            delay: 0.2,
            scrollTrigger: { trigger: head, start: "top 85%", once: true },
          },
        );
      }

      // The cards rise 80px while their portraits settle from 1.15, the second
      // following the first by 150ms.
      const cards = grid.querySelectorAll("[data-card]");
      const portraits = grid.querySelectorAll("[data-portrait]");
      const trigger = { trigger: grid, start: "top 85%", once: true };
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 80 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.15, scrollTrigger: trigger },
      );
      gsap.fromTo(
        portraits,
        { scale: 1.15 },
        { scale: 1, duration: DURATION.reveal, ease: EASE, stagger: 0.15, scrollTrigger: { ...trigger } },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // The circular label that follows the cursor inside each card.
  useEffect(() => {
    const query = window.matchMedia(ROOMY_QUERY);
    let teardown: (() => void) | null = null;

    const attach = () => {
      teardown?.();
      teardown = null;
      setFocus(null);
      const grid = gridRef.current;
      if (!query.matches || !grid) return;

      const gsap = ensureGsap();
      const reduced = prefersReducedMotion();
      const cleanups: (() => void)[] = [];

      grid.querySelectorAll<HTMLAnchorElement>("[data-card-link]").forEach((card, index) => {
        const label = card.querySelector<HTMLElement>("[data-cursor-label]");
        if (!label) return;

        gsap.set(label, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });
        const options = { duration: reduced ? 0 : 0.6, ease: EASE };
        const xTo = gsap.quickTo(label, "x", options);
        const yTo = gsap.quickTo(label, "y", options);

        const local = (event: PointerEvent) => {
          const box = card.getBoundingClientRect();
          return { x: event.clientX - box.left, y: event.clientY - box.top };
        };
        const onEnter = (event: PointerEvent) => {
          const { x, y } = local(event);
          xTo(x, x);
          yTo(y, y);
          // overwrite: a hide still in flight must not win over this show.
          gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.5, ease: EASE, overwrite: true });
          setFocus(index);
        };
        const onMove = (event: PointerEvent) => {
          const { x, y } = local(event);
          xTo(x);
          yTo(y);
        };
        const onLeave = () => {
          gsap.to(label, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: EASE, overwrite: true });
          setFocus((current) => (current === index ? null : current));
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
          gsap.killTweensOf(label);
          gsap.set(label, { autoAlpha: 0 });
        });
      });

      teardown = () => cleanups.forEach((cleanup) => cleanup());
    };

    attach();
    query.addEventListener("change", attach);
    return () => {
      query.removeEventListener("change", attach);
      teardown?.();
    };
  }, []);

  const columns = PEOPLE.length > 2 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2";
  const nameSize = PEOPLE.length > 2 ? "text-[clamp(1.75rem,2.2vw,2.5rem)]" : "text-[clamp(2rem,3vw,2.5rem)]";

  return (
    <section
      id="people"
      ref={sectionRef}
      aria-labelledby="people-title"
      className="relative bg-onyx px-[clamp(1.5rem,5vw,7rem)] py-28 text-bone lg:py-40"
    >
      <div ref={headRef} className="grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="lg:col-span-5">
          <p className="line-mask">
            <span data-line className="text-[14px] uppercase tracking-[0.22em] text-mint">
              {t.people.eyebrow}
            </span>
          </p>
          <h2
            id="people-title"
            className="mt-6 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1] tracking-[-0.02em]"
          >
            <span className="line-mask">
              <span data-line>{t.people.title}</span>
            </span>
          </h2>
        </div>
        <p
          data-rise
          className="text-[clamp(1.125rem,1.4vw,1.25rem)] leading-[1.55] text-sage lg:col-span-6 lg:col-start-7"
        >
          {t.people.staffing}
        </p>
      </div>

      <ul ref={gridRef} className={`mt-16 grid grid-cols-1 gap-x-6 gap-y-16 lg:mt-24 ${columns}`}>
        {PEOPLE.map((person, index) => {
          const name = person.name[locale];
          const facts = [
            { term: t.people.admitted, value: person.admitted[locale] },
            { term: t.people.languages, value: person.languages[locale] },
            { term: t.people.forums, value: person.forums[locale] },
          ];
          return (
            <li key={person.id} data-card>
              <a
                href={person.href}
                data-card-link
                className="group relative block transition-opacity duration-500"
                style={{ opacity: focus !== null && focus !== index ? 0.5 : 1 }}
              >
                {/* The frame stays fixed; the portrait moves inside it. */}
                <div className="relative aspect-[4/5] overflow-hidden bg-onyx">
                  <div data-portrait className="h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={person.portrait}
                      alt={`${t.people.portrait} ${name}`}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-[filter,scale] duration-[600ms] ${EASE_CLASS} roomy:grayscale roomy:group-hover:scale-[1.04] roomy:group-hover:grayscale-0`}
                    />
                  </div>
                </div>

                <div className="relative mt-8 pb-5">
                  <h3 className={`font-serif ${nameSize} font-normal leading-[1.1] tracking-[-0.01em]`}>
                    {name}
                  </h3>
                  {/* The rule draws across the full width of the card on hover. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-emerald transition-transform duration-[600ms] ${EASE_CLASS} group-hover:scale-x-100 group-focus-visible:scale-x-100`}
                  />
                </div>
                <p className="mt-5 text-[14px] uppercase tracking-[0.2em] text-mint">{person.role[locale]}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {person.practices.map((practice) => (
                    <li
                      key={practice}
                      className="border border-bone/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-sage"
                    >
                      {areaName(practice)[locale]}
                    </li>
                  ))}
                </ul>

                {/* Admission, languages and forums, each on its own ruled line. */}
                <dl className="mt-8 border-t border-bone/15">
                  {facts.map((fact) => (
                    <div
                      key={fact.term}
                      className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-b border-bone/15 py-3 sm:grid-cols-[9rem_1fr]"
                    >
                      <dt className="pt-0.5 text-[11px] uppercase tracking-[0.18em] text-mint">{fact.term}</dt>
                      <dd className="text-[15px] leading-[1.5] text-bone/85">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <span
                  data-cursor-label
                  aria-hidden="true"
                  className="pointer-events-none invisible absolute left-0 top-0 z-10 flex size-28 items-center justify-center rounded-full bg-mint text-center text-[11px] uppercase leading-tight tracking-[0.16em] text-onyx"
                >
                  {t.people.viewProfile[0]}
                  <br />
                  {t.people.viewProfile[1]}
                </span>
                <span className="sr-only">{t.people.viewProfile.join(" ")}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-16 lg:mt-20">
        <ArrowLink href="#people" className="text-bone">
          {t.people.fullTeam}
        </ArrowLink>
      </div>
    </section>
  );
}
