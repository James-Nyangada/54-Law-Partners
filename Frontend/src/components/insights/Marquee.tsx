"use client";

import { Fragment, useEffect, useRef } from "react";
import { ensureGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { AREAS } from "@/components/practice/data";
import { useLocale } from "@/i18n/useLocale";

/** Pixels per second at rest. Slow enough to read as a breath. */
const SPEED = 45;

/**
 * The marquee band: the eight practice areas in outlined type, drifting right
 * to left on their own and reversing while the visitor scrolls up. The page's
 * one piece of pure decoration, so it is hidden from assistive technology.
 */
export function Marquee() {
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // The track holds two identical runs; wrapping at half its width is seamless.
    let half = track.scrollWidth / 2;
    const setX = gsap.quickSetter(track, "x", "px");
    let x = 0;
    let velocity = -SPEED;
    let target = -SPEED;

    const tick = () => {
      const seconds = gsap.ticker.deltaRatio(60) / 60;
      velocity += (target - velocity) * 0.06;
      x = gsap.utils.wrap(-half, 0, x + velocity * seconds);
      setX(x);
    };

    // Re-measure whenever the run changes width: a resize, or a language switch.
    const observer = new ResizeObserver(() => {
      half = track.scrollWidth / 2;
    });
    observer.observe(track);

    // Runs only while on screen; scroll direction steers it.
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      },
      onUpdate: (self) => {
        target = self.direction === -1 ? SPEED : -SPEED;
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(tick);
      observer.disconnect();
    };
  }, []);

  const run = (copy: number) => (
    <div key={copy} className="flex shrink-0 items-center">
      {AREAS.map((area) => (
        <Fragment key={area.id}>
          <span
            className="whitespace-nowrap px-10 font-serif text-[clamp(3rem,6vw,5rem)] leading-none tracking-[-0.01em] text-onyx"
            style={{
              WebkitTextStroke: "2px var(--color-bone)",
              // Stroke under an onyx fill: a clean 1px outline, no contour seams.
              paintOrder: "stroke fill",
            }}
          >
            {area.name[locale]}
          </span>
          <span className="block size-2 shrink-0 rounded-full bg-emerald" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="overflow-hidden border-y border-bone/10 bg-onyx py-16 lg:py-24"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {run(0)}
        {run(1)}
      </div>
    </section>
  );
}
