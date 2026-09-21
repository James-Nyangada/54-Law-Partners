"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, ScrollTrigger, EASE, DURATION, prefersReducedMotion } from "@/lib/motion";
import { AFRICA_PATH, MADAGASCAR_PATH, MAP_VIEWBOX, NAIROBI, PLACES, type Place, type PlaceKind } from "./geo";
import { useLocale } from "@/i18n/useLocale";
import type { Locale } from "@/i18n/types";

/** Where a label sits relative to its dot, and the box that catches hover. */
function labelLayout(place: Place, locale: Locale) {
  const width = place.label[locale].length * 11 + 28;
  switch (place.side) {
    case "left":
      return { x: place.x - 12, y: place.y, anchor: "end" as const, box: { x: place.x - width - 4, y: place.y - 16, width } };
    case "right":
      return { x: place.x + 12, y: place.y, anchor: "start" as const, box: { x: place.x + 4, y: place.y - 16, width } };
    case "above":
      return { x: place.x, y: place.y - 20, anchor: "middle" as const, box: { x: place.x - width / 2, y: place.y - 36, width } };
    case "below":
      return { x: place.x, y: place.y + 22, anchor: "middle" as const, box: { x: place.x - width / 2, y: place.y + 6, width } };
  }
}

/** A curve from Nairobi to a place, bowed upward by a share of its length. */
function arcTo(place: Place) {
  const dx = place.x - NAIROBI.x;
  const dy = place.y - NAIROBI.y;
  const length = Math.hypot(dx, dy);
  let nx = -dy / length;
  let ny = dx / length;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bend = length * 0.28;
  const cx = (NAIROBI.x + place.x) / 2 + nx * bend;
  const cy = (NAIROBI.y + place.y) / 2 + ny * bend;
  return `M${NAIROBI.x},${NAIROBI.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${place.x},${place.y}`;
}

const ARCS = PLACES.map(arcTo);
/**
 * Three kinds of destination, told apart by colour and by marker: the region in
 * emerald, francophone jurisdictions in forest, forums in onyx with a square.
 */
const COLOR: Record<PlaceKind, string> = {
  region: "var(--color-emerald)",
  francophone: "var(--color-forest)",
  forum: "var(--color-onyx)",
};

/**
 * Labels carry a thin bone halo drawn beneath the letters, so a coastline or
 * arc passing behind a name never cuts through it.
 */
const LABEL_STYLE = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "var(--map-label)",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  stroke: "var(--color-bone)",
  strokeWidth: "calc(var(--map-label) * 0.35)",
  strokeLinejoin: "round",
  paintOrder: "stroke fill",
} as const;

/**
 * Section 4, part two — the reach map.
 *
 * The coastline strokes itself into existence as the visitor scrolls. Once it
 * is complete, Nairobi pulses once and arcs travel out one by one to the
 * region and then the international forums. Scrolling back up rewinds the
 * network and undraws the coastline; scrolling down plays it all again.
 * Hovering a label brightens its arc while the rest recede.
 */
export function ReachMap() {
  const { locale, t } = useLocale();
  const [focus, setFocus] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const gsap = ensureGsap();
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const ctx = gsap.context(() => {
      const outline = svg.querySelectorAll("[data-outline]");
      const arcs = svg.querySelectorAll("[data-arc]");
      const ends = svg.querySelectorAll("[data-end]");
      const labels = svg.querySelectorAll("[data-label]");
      const dot = svg.querySelector("[data-nairobi]");
      const ring = svg.querySelector("[data-ring]");

      // The intro column rises in as the section arrives.
      gsap.fromTo(
        introRef.current?.children ?? [],
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.entrance,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: introRef.current, start: "top 80%", once: true },
        },
      );

      gsap.set([...arcs, ...outline], { strokeDashoffset: 1 });
      gsap.set([...ends, dot], { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(ring, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { autoAlpha: 0, y: 8 });

      // The network: Nairobi first, then each arc 0.4s long with a 150ms gap.
      const network = gsap.timeline({ paused: true, defaults: { ease: EASE } });
      network.to(dot, { scale: 1, duration: 0.5 }, 0);
      network.fromTo(ring, { scale: 0.4, opacity: 0.7 }, { scale: 3.4, opacity: 0, duration: 1.4 }, 0.1);
      arcs.forEach((arc, index) => {
        const at = 0.6 + index * 0.55;
        network.to(arc, { strokeDashoffset: 0, duration: 0.4, autoRound: false }, at);
        network.to(ends[index], { scale: 1, duration: 0.3 }, at + 0.3);
        network.to(labels[index], { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35);
      });

      // Signature move 3 — the coastline drawn by scroll, and undrawn by it.
      // autoRound: false matters. The paths measure 1 unit long, and GSAP
      // otherwise rounds pixel values to whole numbers, so every line would
      // snap from hidden to complete halfway through instead of drawing.
      gsap.to(outline, {
        strokeDashoffset: 0,
        ease: "none",
        autoRound: false,
        scrollTrigger: { trigger: svg, start: "top 80%", end: "center 55%", scrub: true },
      });

      // The network plays when the outline completes. Scrolling back up past
      // that point rewinds it quickly, so the arcs are gone before the
      // coastline starts to undraw; scrolling down again replays it.
      ScrollTrigger.create({
        trigger: svg,
        start: "center 55%",
        onEnter: () => {
          network.timeScale(1).play();
        },
        onLeaveBack: () => {
          network.timeScale(3.5).reverse();
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const dimmed = (index: number) => focus !== null && focus !== index;

  return (
    <section
      id="reach"
      ref={sectionRef}
      aria-labelledby="reach-title"
      className="surface-light relative bg-bone px-[clamp(1.5rem,5vw,7rem)] py-28 text-onyx [--map-label:24px] [--map-stroke:3px] sm:[--map-label:22px] sm:[--map-stroke:2px] lg:py-36 lg:[--map-label:15px] lg:[--map-stroke:1.5px]"
    >
      <div className="grid gap-y-14 lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div ref={introRef} className="lg:col-span-4">
          <h2
            id="reach-title"
            className="text-[14px] uppercase leading-none tracking-[0.22em] text-forest"
          >
            {t.reach.title}
          </h2>
          <p className="mt-8 font-serif text-[clamp(1.875rem,3.2vw,3rem)] leading-[1.1] tracking-[-0.015em]">
            {t.reach.statement}
          </p>
          <ul className="mt-10 space-y-3 text-[12px] uppercase tracking-[0.2em] text-onyx/75">
            {(["region", "francophone", "forum"] as const).map((kind) => (
              <li key={kind} className="flex items-center gap-3">
                <span aria-hidden="true" className="flex w-8 items-center">
                  <span className="block h-[1.5px] flex-1" style={{ background: COLOR[kind] }} />
                  <span
                    className={`block size-2 ${kind === "forum" ? "" : "rounded-full"}`}
                    style={{ background: COLOR[kind] }}
                  />
                </span>
                {t.reach.legend[kind]}
              </li>
            ))}
          </ul>
          <ul className="sr-only">
            {PLACES.map((place) => (
              <li key={place.id}>
                {place.label[locale]}, {t.reach.legend[place.kind]}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-8">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
            role="img"
            aria-label={t.reach.mapLabel}
            className="mx-auto block h-auto max-h-[86svh] w-full overflow-visible"
          >
            {/* The coastline. pathLength=1 lets the dash offset run 1 to 0. */}
            {[AFRICA_PATH, MADAGASCAR_PATH].map((d) => (
              <path
                key={d.slice(0, 12)}
                data-outline
                d={d}
                pathLength={1}
                strokeDasharray="1"
                fill="none"
                stroke="var(--color-onyx)"
                strokeOpacity={0.55}
                strokeLinejoin="round"
                style={{ strokeWidth: "var(--map-stroke)" }}
              />
            ))}

            {ARCS.map((d, index) => {
              const place = PLACES[index];
              return (
                <path
                  key={place.id}
                  data-arc
                  d={d}
                  pathLength={1}
                  strokeDasharray="1"
                  fill="none"
                  stroke={COLOR[place.kind]}
                  style={{
                    strokeWidth:
                      focus === index
                        ? "calc(var(--map-stroke) * 1.8)"
                        : "calc(var(--map-stroke) * 1.1)",
                    opacity: dimmed(index) ? 0.15 : focus === index ? 1 : 0.75,
                    transition: "opacity 0.3s, stroke-width 0.3s",
                  }}
                />
              );
            })}

            {PLACES.map((place, index) => {
              const label = labelLayout(place, locale);
              return (
                <g key={place.id}>
                  {/* Forums are institutions, so they are marked with a square. */}
                  {place.kind === "forum" ? (
                    <rect data-end x={place.x - 5} y={place.y - 5} width={10} height={10} fill={COLOR.forum} />
                  ) : (
                    <circle data-end cx={place.x} cy={place.y} r={5} fill={COLOR[place.kind]} />
                  )}
                  {/* GSAP moves the outer group; hover dims the inner one. */}
                  <g data-label>
                    <g
                      onPointerEnter={() => setFocus(index)}
                      onPointerLeave={() => setFocus(null)}
                      style={{
                        opacity: dimmed(index) ? 0.35 : 1,
                        transition: "opacity 0.3s",
                        cursor: "default",
                      }}
                    >
                      <rect
                        x={label.box.x}
                        y={label.box.y}
                        width={label.box.width}
                        height={32}
                        fill="transparent"
                      />
                      <text
                        x={label.x}
                        y={label.y}
                        dominantBaseline="middle"
                        textAnchor={label.anchor}
                        fill="var(--color-onyx)"
                        style={{ ...LABEL_STYLE }}
                      >
                        {place.label[locale]}
                      </text>
                    </g>
                  </g>
                </g>
              );
            })}

            {/* Nairobi, with the ring that widens once. */}
            <circle
              data-ring
              cx={NAIROBI.x}
              cy={NAIROBI.y}
              r={10}
              fill="none"
              stroke="var(--color-emerald)"
              strokeWidth={2}
              opacity={0}
            />
            <circle data-nairobi cx={NAIROBI.x} cy={NAIROBI.y} r={8} fill="var(--color-emerald)" />
            {/* Above and to the right: the one side of Nairobi no arc or label uses. */}
            <text
              x={NAIROBI.x + 14}
              y={NAIROBI.y - 16}
              fill="var(--color-forest)"
              style={{ ...LABEL_STYLE, fontWeight: 600 }}
            >
              Nairobi
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
