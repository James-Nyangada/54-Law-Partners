"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, ScrollTrigger, EASE, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { AFRICA_PATH, MADAGASCAR_PATH, MAP_VIEWBOX, NAIROBI, PLACES, type Place, type PlaceKind } from "./geo";

const KINDS: PlaceKind[] = ["region", "francophone", "regional", "forum"];

const STYLE: Record<PlaceKind, { color: string; dash?: string; square?: boolean }> = {
  region: { color: "var(--color-emerald)" },
  francophone: { color: "var(--color-forest)" },
  regional: { color: "var(--color-forest)", dash: "5 6", square: true },
  forum: { color: "var(--color-onyx)", dash: "2 6", square: true },
};

/** A route from Nairobi, bowed upward by a share of its length. */
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
  const bend = length * 0.26;
  const cx = (NAIROBI.x + place.x) / 2 + nx * bend;
  const cy = (NAIROBI.y + place.y) / 2 + ny * bend;
  return `M${NAIROBI.x},${NAIROBI.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${place.x},${place.y}`;
}

const ARCS = PLACES.map(arcTo);

/**
 * The reach map (wireframe 04b). The coastline draws itself as the visitor
 * scrolls, and undraws when they scroll back. Once it is complete, Nairobi
 * pulses and routes travel out to each kind of destination, then light keeps
 * moving along them. Hovering a kind in the list isolates its routes.
 */
export function ReachMap() {
  const { t } = useLocale();
  const [focus, setFocus] = useState<PlaceKind | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    let ctx: gsap.Context | null = null;
    const cancel = whenRevealed(() => {
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(svg);
        const outline = q("[data-outline]");
        const arcs = q("[data-arc]");
        const ends = q("[data-end]");
        const pulses = q("[data-pulse]");

        gsap.set(outline, { drawSVG: "0%", fillOpacity: 0 });
        gsap.set(arcs, { drawSVG: "0%" });
        gsap.set([...ends, ...q("[data-nairobi]")], { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(q("[data-ring]"), { scale: 0.4, autoAlpha: 0, transformOrigin: "50% 50%" });
        gsap.set(q("[data-city]"), { autoAlpha: 0, x: -6 });
        gsap.set(pulses, { autoAlpha: 0 });

        // The coastline, tied to scroll in both directions.
        const draw = gsap.timeline({
          scrollTrigger: { trigger: svg, start: "top 82%", end: "center 52%", scrub: 0.8 },
        });
        draw.to(outline, { drawSVG: "100%", ease: "none", duration: 1 }, 0);
        draw.to(outline, { fillOpacity: 1, ease: "none", duration: 0.35 }, 0.65);

        // The network.
        let loops: gsap.core.Timeline[] = [];
        const network = gsap.timeline({
          paused: true,
          defaults: { ease: EASE },
          onComplete: () => {
            loops = pulses.map((pulse, index) => {
              const path = arcs[index] as unknown as SVGPathElement;
              return gsap
                .timeline({ repeat: -1, delay: (index % 5) * 0.7, repeatDelay: 1.8 + (index % 4) * 0.6 })
                .set(pulse, { autoAlpha: 0 })
                .to(pulse, { autoAlpha: 1, duration: 0.3, ease: "none" }, 0)
                .to(pulse, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 2.6, ease: "power1.inOut" }, 0)
                .to(pulse, { autoAlpha: 0, duration: 0.4, ease: "none" }, 2.2);
            });
          },
        });
        network.to(q("[data-nairobi]"), { scale: 1, duration: 0.5 }, 0);
        network.to(q("[data-city]"), { autoAlpha: 1, x: 0, duration: 0.6 }, 0.1);
        network.fromTo(q("[data-ring]"), { scale: 0.4, autoAlpha: 0.8 }, { scale: 3.6, autoAlpha: 0, duration: 1.6 }, 0.1);
        arcs.forEach((arc, index) => {
          const at = 0.4 + index * 0.12;
          network.to(arc, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, at);
          network.to(ends[index], { scale: 1, duration: 0.4 }, at + 0.75);
        });

        ScrollTrigger.create({
          trigger: svg,
          start: "center 52%",
          onEnter: () => network.timeScale(1).play(),
          onLeaveBack: () => {
            loops.forEach((loop) => loop.kill());
            loops = [];
            gsap.set(pulses, { autoAlpha: 0 });
            network.timeScale(3).reverse();
          },
        });
      }, section);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  const dim = (kind: PlaceKind) => focus !== null && focus !== kind;

  return (
    <section ref={sectionRef} id="reach" className="surface-light bg-bone text-onyx section-y">
      <div className="shell grid items-center gap-y-14 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-6 lg:pr-8">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
            role="img"
            aria-label={t.reach.mapLabel}
            className="mx-auto block h-auto max-h-[80svh] w-full overflow-visible"
          >
            {[AFRICA_PATH, MADAGASCAR_PATH].map((d) => (
              <path
                key={d.slice(0, 14)}
                data-outline
                d={d}
                fill="#e3e8e3"
                stroke="var(--color-forest)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {ARCS.map((d, index) => {
              const place = PLACES[index];
              const style = STYLE[place.kind];
              return (
                <path
                  key={place.id}
                  data-arc
                  d={d}
                  fill="none"
                  stroke={style.color}
                  strokeWidth={focus === place.kind ? 2.4 : 1.5}
                  strokeDasharray={style.dash}
                  vectorEffect="non-scaling-stroke"
                  style={{ opacity: dim(place.kind) ? 0.12 : 0.9, transition: "opacity .4s, stroke-width .4s" }}
                />
              );
            })}

            {PLACES.map((place) => {
              const style = STYLE[place.kind];
              const common = { "data-end": true, fill: style.color, style: { opacity: dim(place.kind) ? 0.15 : 1, transition: "opacity .4s" } };
              return style.square ? (
                <rect key={place.id} x={place.x - 5} y={place.y - 5} width={10} height={10} {...common} />
              ) : (
                <circle key={place.id} cx={place.x} cy={place.y} r={5.5} {...common} />
              );
            })}

            {PLACES.map((place) => (
              <circle key={place.id} data-pulse r="4" fill="var(--color-mint)" stroke="var(--color-forest)" strokeWidth="1" style={{ visibility: "hidden" }} />
            ))}

            <circle data-ring cx={NAIROBI.x} cy={NAIROBI.y} r="12" fill="none" stroke="var(--color-emerald)" strokeWidth="2" />
            <circle data-nairobi cx={NAIROBI.x} cy={NAIROBI.y} r="18" fill="var(--color-emerald)" fillOpacity="0.18" />
            <circle data-nairobi cx={NAIROBI.x} cy={NAIROBI.y} r="8" fill="var(--color-emerald)" />
            <text
              data-city
              x={NAIROBI.x + 26}
              y={NAIROBI.y - 18}
              fill="var(--color-forest)"
              style={{ font: "600 18px var(--font-inter), sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", paintOrder: "stroke fill", stroke: "#f3f2ed", strokeWidth: 6, strokeLinejoin: "round" }}
            >
              Nairobi
            </text>
          </svg>
        </div>

        <div className="lg:col-span-6 lg:pl-6">
          <p className="eyebrow text-forest" data-reveal="fade">{t.reach.eyebrow}</p>
          <h2 className="type-section mt-5 max-w-[20ch]" data-reveal="lines">{t.reach.title}</h2>
          <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.65] text-muted" data-reveal="up">{t.reach.support}</p>
          <ul className="mt-10 border-t border-line-light" onPointerLeave={() => setFocus(null)}>
            {KINDS.map((kind) => {
              const style = STYLE[kind];
              return (
                <li key={kind} data-reveal="up">
                  <button
                    type="button"
                    onPointerEnter={() => setFocus(kind)}
                    onFocus={() => setFocus(kind)}
                    onBlur={() => setFocus(null)}
                    aria-pressed={focus === kind}
                    className="group flex w-full items-center gap-5 border-b border-line-light py-4 text-left text-[15.5px]"
                  >
                    <svg aria-hidden="true" width="34" height="10" viewBox="0 0 34 10" className="shrink-0">
                      <line x1="0" y1="5" x2="24" y2="5" stroke={style.color} strokeWidth="1.5" strokeDasharray={style.dash} />
                      {style.square ? <rect x="24" y="1" width="8" height="8" fill={style.color} /> : <circle cx="28" cy="5" r="4" fill={style.color} />}
                    </svg>
                    <span className={`transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 ${dim(kind) ? "text-muted" : "text-onyx"}`}>
                      {t.reach.kinds[kind]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
