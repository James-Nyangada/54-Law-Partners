"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, EASE, prefersReducedMotion } from "@/lib/motion";

/** Placeholder wording in the spec's three ideas; confirm with the firm. */
const PANELS = [
  {
    eyebrow: "01 · Foundation",
    lines: ["Kenya is", "our foundation."],
    support: "Rooted in Kenyan law, its courts and its regulators.",
  },
  {
    eyebrow: "02 · Horizon",
    lines: ["Africa is our", "operating horizon."],
    support: "Advice built for matters that cross the continent’s borders.",
  },
  {
    eyebrow: "03 · Standard",
    lines: ["International standards,", "throughout."],
    support: "Work that meets the expectations of global counterparties.",
  },
];

/** Scroll distance per panel, in viewport heights. */
const SCREENS = PANELS.length + 1;

/**
 * Section 4, part one — the image scene.
 *
 * A full-bleed photograph of Nairobi holds still while three panels pass over
 * it. Behind them the photograph settles from 1.2 to 1 and its ink overlay
 * lifts from 85% to 25%, so the city clears as the visitor reads.
 */
export function KenyaScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const gsap = ensureGsap();
    const section = sectionRef.current;
    const panelsRoot = panelsRef.current;
    if (!section || !panelsRoot) return;

    const panels = panelsRoot.querySelectorAll<HTMLElement>("[data-panel]");

    const ctx = gsap.context(() => {
      // One scrubbed timeline across the whole time the scene is held.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true },
      });

      panels.forEach((panel, index) => {
        const lines = panel.querySelectorAll("[data-line]");
        const at = index * 3 + 0.4;
        tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: EASE }, at);
        tl.to(lines, { yPercent: -110, duration: 0.8, stagger: 0.05, ease: EASE }, at + 2);
      });

      // A beat on the clear city before the scene releases.
      tl.to({}, { duration: 0.8 });

      const total = tl.duration();
      tl.fromTo(imageRef.current, { scale: 1.2 }, { scale: 1, duration: total, ease: "none" }, 0);
      tl.fromTo(overlayRef.current, { opacity: 0.85 }, { opacity: 0.25, duration: total, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="kenya"
      ref={sectionRef}
      data-scene
      aria-labelledby="kenya-title"
      className="relative bg-ink text-ivory in-[.motion-static]:h-auto"
      style={{ height: `${SCREENS * 100}svh` }}
    >
      <h2 id="kenya-title" className="sr-only">
        Kenyan grounding
      </h2>

      {/* Sticky, not pinned by script: the browser holds it, Lenis stays smooth. */}
      <div
        data-scene-sticky
        className="sticky top-0 h-svh overflow-hidden in-[.motion-static]:relative in-[.motion-static]:h-auto in-[.motion-static]:min-h-svh"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src="/nairobi-wide.svg"
          alt="The Nairobi skyline at dusk"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="absolute inset-0 bg-ink opacity-85 in-[.motion-static]:opacity-60"
        />

        <div className="relative z-10 flex h-full items-center px-[clamp(1.5rem,5vw,7rem)] in-[.motion-static]:py-40">
          {/* The panels share one grid cell, so they pass through the same place. */}
          <div ref={panelsRef} className="grid w-full max-w-[60rem] gap-y-28">
            {PANELS.map((panel) => (
              <div
                key={panel.eyebrow}
                data-panel
                className="col-start-1 row-start-1 in-[.motion-static]:row-start-auto"
              >
                <p className="line-mask">
                  <span data-line className="text-[14px] uppercase tracking-[0.22em] text-ochre">
                    {panel.eyebrow}
                  </span>
                </p>
                <h3 className="mt-6 font-serif text-[clamp(2.25rem,5.4vw,5rem)] font-normal leading-[1.02] tracking-[-0.02em]">
                  {panel.lines.map((line) => (
                    <span key={line} className="line-mask">
                      <span data-line>{line}</span>
                    </span>
                  ))}
                </h3>
                <p className="line-mask mt-7">
                  <span data-line className="max-w-[40ch] text-[18px] leading-[1.55] text-ivory/80 sm:text-[20px]">
                    {panel.support}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
