"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, EASE, prefersReducedMotion } from "@/lib/motion";
import { FIGURES, FORUMS } from "./data";

const IS_DEV = process.env.NODE_ENV !== "production";

/** Confirmed figures, plus clearly marked samples while developing. */
const SHOWN = FIGURES.flatMap((figure) => {
  if (figure.value !== null) return [{ ...figure, n: figure.value, isSample: false }];
  if (IS_DEV) return [{ ...figure, n: figure.sample, isSample: true }];
  return [];
}).slice(0, 4);

/** Digits 0 to 9 and a second 0, so the ones column can wrap seamlessly. */
const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const CELL = 100 / STRIP.length;

/**
 * Section 7 — the credibility band.
 *
 * Each figure is a set of digit columns that turn like a mechanical counter:
 * the ones column spins, and each higher column only moves while the column
 * below it rolls from 9 to 0. The final digit settles with a small overshoot,
 * the only overshoot on the page.
 */
export function Credibility() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const figures = gsap.utils.toArray<HTMLElement>("[data-figure]");
      const ease = gsap.parseEase(EASE);

      const counters = figures.map((figure) => {
        const target = Number(figure.dataset.value);
        const strips = [...figure.querySelectorAll<HTMLElement>("[data-strip]")];
        // The server renders each strip at its final digit (for no-JS and
        // reduced motion). Clear that offset, or GSAP would add to it.
        gsap.set(strips, { clearProps: "transform" });
        gsap.set(strips, { y: 0, yPercent: 0 });
        const setters = strips.map((strip) => gsap.quickSetter(strip, "yPercent"));
        const columns = strips.length;

        const render = (v: number) => {
          setters.forEach((set, i) => {
            const place = 10 ** (columns - 1 - i);
            let position: number;
            if (place === 1) {
              position = v % 10;
            } else {
              // A higher column turns only while the one below goes 9 to 0.
              const lower = v % place;
              const carry = lower > place - 1 ? lower - (place - 1) : 0;
              position = (Math.floor(v / place) % 10) + carry;
            }
            set(-position * CELL);
          });
        };

        render(0);
        return { target, render };
      });

      gsap.set(section.querySelectorAll("[data-rise]"), { autoAlpha: 0, y: 16 });

      const play = () => {
        counters.forEach(({ target, render }, index) => {
          const proxy = { p: 0 };
          gsap.to(proxy, {
            p: 1,
            duration: 1.2,
            ease: "none",
            delay: index * 0.15,
            onUpdate: () => {
              const p = proxy.p;
              // A small bump past the final digit and back, in the last quarter.
              const bump = p > 0.72 ? 0.35 * Math.sin((Math.PI * (p - 0.72)) / 0.28) : 0;
              render(target * ease(p) + bump);
            },
            onComplete: () => render(target),
          });
        });
        gsap.to(section.querySelectorAll("[data-rise]"), {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.15,
          delay: 0.2,
        });
      };

      gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%", once: true, onEnter: play },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Too few confirmed figures: a quiet line of forums, or nothing at all.
  if (SHOWN.length < 3) {
    if (FORUMS.length === 0) return null;
    return (
      <section aria-label="Where we appear" className="bg-red-earth px-[clamp(1.5rem,5vw,7rem)] py-20 text-ivory">
        <p className="mx-auto max-w-[60rem] text-center font-serif text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.5]">
          Appearing before {FORUMS.join(" · ")}
        </p>
      </section>
    );
  }

  const columns = SHOWN.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="credibility-title"
      className="flex min-h-[60svh] items-center bg-red-earth px-[clamp(1.5rem,5vw,7rem)] py-20 text-ivory"
    >
      <h2 id="credibility-title" className="sr-only">
        The firm in figures
      </h2>
      <ul
        className={`grid w-full grid-cols-1 divide-y divide-ivory/25 sm:grid-cols-2 sm:divide-y-0 ${columns} lg:divide-x`}
      >
        {SHOWN.map((figure) => (
          <li
            key={figure.label}
            data-figure
            data-value={figure.n}
            className="px-6 py-10 text-center sm:py-8 lg:py-4"
          >
            <p className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-none tabular-nums">
              <span className="sr-only">
                {figure.n}
                {figure.suffix}
              </span>
              <span aria-hidden="true" className="inline-flex">
                {String(figure.n)
                  .split("")
                  .map((digit, index) => (
                    <span key={index} className="relative inline-block h-[1.1em] overflow-hidden">
                      <span
                        data-strip
                        className="block"
                        style={{ transform: `translateY(${-Number(digit) * CELL}%)` }}
                      >
                        {STRIP.map((n, cell) => (
                          <span key={cell} className="block h-[1.1em] leading-[1.1em]">
                            {n}
                          </span>
                        ))}
                      </span>
                    </span>
                  ))}
                {figure.suffix ? <span className="leading-[1.1em]">{figure.suffix}</span> : null}
              </span>
            </p>
            <p data-rise className="mt-5 text-[13px] uppercase tracking-[0.2em] text-ivory/85">
              {figure.label}
            </p>
            {figure.isSample ? (
              <p className="mt-3 inline-block border border-ivory/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-ivory/70">
                Sample, not confirmed
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
