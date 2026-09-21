"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, EASE, prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "./IntroProvider";

/**
 * Steps 1 and 2 of the opening sequence.
 *
 * A bone curtain covers the screen while fonts and the hero photograph load.
 * A counter runs 0 to 100 in the corner, the outlined numeral 54 sits centred,
 * and then the whole curtain eases up and off to reveal the hero behind it.
 */
export function Preloader() {
  const { assetsReady, beginReveal, finishIntro } = useIntro();

  const curtainRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  /** The animated counter value, shared between the two effects below. */
  const valueRef = useRef({ n: 0 });
  /** True once the counter has run its curve and parked at 99. */
  const [countSettled, setCountSettled] = useState(false);
  /** Guards against the exit timeline being built twice. */
  const exitedRef = useRef(false);

  // Step 1 — the counter runs while the real loading happens behind it.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const gsap = ensureGsap();
    const counter = counterRef.current;
    if (!counter) return;

    const value = valueRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        markRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.8, ease: EASE },
      );

      // Runs to 99 on a fixed curve, then waits for the assets to land.
      gsap.to(value, {
        n: 99,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          counter.textContent = String(Math.round(value.n));
        },
        onComplete: () => setCountSettled(true),
      });
    });

    return () => ctx.revert();
  }, []);

  // Step 2 — once the count has settled and the assets are in, close it out
  // and slide the curtain up and off.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!countSettled || !assetsReady || exitedRef.current) return;

    const gsap = ensureGsap();
    const counter = counterRef.current;
    const curtain = curtainRef.current;
    if (!counter || !curtain) return;

    exitedRef.current = true;
    const value = valueRef.current;

    const tl = gsap.timeline();

    tl.to(value, {
      n: 100,
      duration: 0.2,
      ease: "none",
      onUpdate: () => {
        counter.textContent = String(Math.round(value.n));
      },
    });

    tl.to(
      [counterWrapRef.current, markRef.current],
      { opacity: 0, duration: 0.4, ease: "none" },
      ">-0.05",
    );

    tl.to(
      curtain,
      {
        yPercent: -100,
        duration: 0.85,
        ease: EASE,
        // The hero entrance begins while the curtain is still travelling, so
        // the page is never momentarily empty.
        onStart: beginReveal,
        onComplete: finishIntro,
      },
      "<",
    );

    return () => {
      tl.kill();
    };
  }, [countSettled, assetsReady, beginReveal, finishIntro]);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className="preloader pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-bone motion-reduce:hidden"
    >
      {/*
        The outlined 54 — a stroke with no fill. Drawn with text-stroke rather
        than a stroked SVG glyph, which renders the outline cleanly.
      */}
      <div
        ref={markRef}
        className="select-none font-serif text-[clamp(5rem,26vmin,18rem)] leading-none tracking-[-0.02em] text-bone"
        style={{
          WebkitTextStroke: "2.5px var(--color-onyx)",
          // Stroke first, then fill over it, so the outer half of the stroke
          // survives and the glyph's internal contour seams are covered.
          paintOrder: "stroke fill",
        }}
      >
        54
      </div>

      {/* The counter, in the corner. */}
      <div
        ref={counterWrapRef}
        className="absolute bottom-8 right-8 font-sans text-onyx sm:bottom-12 sm:right-12"
      >
        <span
          ref={counterRef}
          className="text-[clamp(2rem,5vw,3.5rem)] leading-none tabular-nums"
        >
          0
        </span>
        <span className="ml-1 align-top text-xs tracking-[0.2em]">%</span>
      </div>
    </div>
  );
}
