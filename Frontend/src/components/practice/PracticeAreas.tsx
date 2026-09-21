"use client";

import { useEffect, useRef, useState } from "react";
import {
  ensureGsap,
  ScrollTrigger,
  EASE,
  DURATION,
  prefersReducedMotion,
} from "@/lib/motion";
import { scrollToTarget } from "@/lib/lenis";
import { AREAS, PILLARS } from "./data";

/** Areas grouped under their pillar, each carrying its 01 to 07 number. */
const GROUPS = PILLARS.map((pillar) => ({
  pillar,
  areas: AREAS.map((area, index) => ({ ...area, index })).filter(
    (area) => area.pillar === pillar.id,
  ),
}));

const PREVIEW = { width: 280, height: 360 };
const ROOMY_QUERY = "(hover: hover) and (min-width: 1024px)";
const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * Section 3 — practice areas.
 *
 * With a mouse on a wide screen: a pinned column of pillar names beside a list
 * of full-width rows, each of which fills with ochre on hover while a
 * photograph follows the cursor. On touch screens and narrow windows: a sticky
 * label bar, and each row carries its thumbnail at the right edge.
 */
export function PracticeAreas() {
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLUListElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Active pillar tracking, and the entrances.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // The pillar switches as each group crosses 40% of the viewport, close to
      // the pinned column's eye line.
      groupRefs.current.forEach((group, index) => {
        if (!group) return;
        ScrollTrigger.create({
          trigger: group,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });

      if (reduced) return;

      // The pillar names rise from their masks as the section arrives.
      const pillarLines = pillarsRef.current?.querySelectorAll("[data-reveal]");
      if (pillarLines?.length) {
        gsap.fromTo(
          pillarLines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: DURATION.entrance,
            ease: EASE,
            stagger: 0.1,
            scrollTrigger: { trigger: pillarsRef.current, start: "top 85%", once: true },
          },
        );
      }

      // Rows arrive with a mask reveal, 80ms apart, while their rules draw
      // outward from the left. Batched, so rows below the fold wait their turn.
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      // Plain arrays, so empty parts (a closing rule has no text or thumbnail)
      // can be skipped rather than handed to GSAP, which warns about them.
      const partsOf = (row: HTMLElement) => ({
        lines: [...row.querySelectorAll("[data-reveal]")],
        rules: row.matches("[data-rule]") ? [row] : [...row.querySelectorAll("[data-rule]")],
        thumbs: [...row.querySelectorAll("[data-thumb]")],
      });

      rows.forEach((row) => {
        const { lines, rules, thumbs } = partsOf(row);
        if (lines.length) gsap.set(lines, { yPercent: 110 });
        if (rules.length) gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
        if (thumbs.length) gsap.set(thumbs, { clipPath: "inset(100% 0% 0% 0%)" });
      });

      ScrollTrigger.batch(rows, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => {
          (batch as HTMLElement[]).forEach((row, i) => {
            const { lines, rules, thumbs } = partsOf(row);
            const delay = i * 0.08;
            if (lines.length) gsap.to(lines, { yPercent: 0, duration: DURATION.entrance, ease: EASE, delay });
            if (rules.length) gsap.to(rules, { scaleX: 1, duration: 1.1, ease: EASE, delay });
            if (thumbs.length) gsap.to(thumbs, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: EASE,
              delay: delay + 0.1,
            });
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // The cursor-following photograph, only where there is a real hover.
  useEffect(() => {
    const query = window.matchMedia(ROOMY_QUERY);
    let teardown: (() => void) | null = null;

    const attach = () => {
      teardown?.();
      teardown = null;
      if (!query.matches) return;

      const list = listRef.current;
      const preview = previewRef.current;
      const strip = stripRef.current;
      if (!list || !preview || !strip) return;

      const gsap = ensureGsap();
      const reduced = prefersReducedMotion();

      gsap.set(preview, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.9, rotation: 0 });

      // A heavier lag than a button: the photograph trails the cursor.
      const lag = reduced ? 0 : 0.8;
      const xTo = gsap.quickTo(preview, "x", { duration: lag, ease: EASE });
      const yTo = gsap.quickTo(preview, "y", { duration: lag, ease: EASE });
      const rotateTo = gsap.quickTo(preview, "rotation", { duration: 0.6, ease: EASE });

      let pointerX = 0;
      let pointerY = 0;
      let lastX = 0;
      let visible = false;
      let current = -1;

      // Tilt a degree or two with horizontal cursor speed, settling when still.
      const tilt = () => {
        const speed = pointerX - lastX;
        lastX = pointerX;
        rotateTo(gsap.utils.clamp(-2.5, 2.5, speed * 0.12));
      };

      const showImage = (index: number, instant: boolean) => {
        if (index === current) return;
        current = index;
        gsap.to(strip, {
          yPercent: (-100 * index) / AREAS.length,
          duration: instant || reduced ? 0 : 0.6,
          ease: EASE,
        });
      };

      const show = () => {
        if (visible) return;
        visible = true;
        xTo(pointerX, pointerX);
        yTo(pointerY, pointerY);
        lastX = pointerX;
        gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: EASE, overwrite: "auto" });
        if (!reduced) gsap.ticker.add(tilt);
      };

      const hide = () => {
        if (!visible) return;
        visible = false;
        gsap.to(preview, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: EASE, overwrite: "auto" });
        gsap.ticker.remove(tilt);
        rotateTo(0);
      };

      const onMove = (event: PointerEvent) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (visible) {
          xTo(pointerX);
          yTo(pointerY);
        }
      };

      const onOver = (event: PointerEvent) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        const row = (event.target as Element).closest<HTMLElement>("[data-index]");
        if (!row) {
          hide();
          return;
        }
        showImage(Number(row.dataset.index), !visible);
        show();
      };

      list.addEventListener("pointermove", onMove);
      list.addEventListener("pointerover", onOver);
      list.addEventListener("pointerleave", hide);

      teardown = () => {
        list.removeEventListener("pointermove", onMove);
        list.removeEventListener("pointerover", onOver);
        list.removeEventListener("pointerleave", hide);
        gsap.ticker.remove(tilt);
        gsap.killTweensOf([preview, strip]);
        gsap.set(preview, { autoAlpha: 0 });
      };
    };

    attach();
    query.addEventListener("change", attach);
    return () => {
      query.removeEventListener("change", attach);
      teardown?.();
    };
  }, []);

  const goToGroup = (index: number) => {
    const group = groupRefs.current[index];
    if (!group) return;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const bar = barRef.current?.offsetHeight ?? 0;
    scrollToTarget(group, -(header + bar + 48));
  };

  return (
    <section
      id="practice-areas"
      ref={sectionRef}
      aria-labelledby="practice-areas-title"
      className="relative bg-ink pb-32 text-ivory roomy:py-40"
    >
      {/* Touch and narrow screens: the pillars become a sticky label bar. */}
      <div
        ref={barRef}
        className="sticky top-[var(--header-h)] z-20 border-b border-ivory/10 bg-ink/95 backdrop-blur-md roomy:hidden"
      >
        <div className="flex gap-7 overflow-x-auto px-[clamp(1.5rem,5vw,7rem)] py-4 [scrollbar-width:none]">
          {PILLARS.map((pillar, index) => (
            <button
              key={pillar.id}
              type="button"
              onClick={() => goToGroup(index)}
              aria-current={active === index ? "true" : undefined}
              className={`shrink-0 text-[11px] uppercase tracking-[0.18em] transition-[color,opacity] duration-500 ${EASE_CLASS} ${
                active === index ? "text-ochre opacity-100" : "text-ivory opacity-30"
              }`}
            >
              {pillar.short}
            </button>
          ))}
        </div>
      </div>

      <div className="px-[clamp(1.5rem,5vw,7rem)] roomy:grid roomy:grid-cols-12 roomy:gap-x-6">
        {/* Wide screens with a mouse: the pinned pillar column. */}
        <aside className="hidden roomy:col-span-3 roomy:block">
          <div className="sticky top-[calc(var(--header-h)+4rem)]">
            <h2
              id="practice-areas-title"
              className="text-[14px] uppercase leading-none tracking-[0.22em] text-ochre"
            >
              Practice areas
            </h2>
            <ul ref={pillarsRef} className="mt-10 space-y-5">
              {PILLARS.map((pillar, index) => (
                <li key={pillar.id}>
                  <button
                    type="button"
                    onClick={() => goToGroup(index)}
                    aria-current={active === index ? "true" : undefined}
                    className="line-mask text-left"
                  >
                    <span
                      data-reveal
                      className={`font-serif text-[clamp(1.375rem,1.8vw,1.75rem)] leading-[1.15] transition-[color,opacity] duration-500 ${EASE_CLASS} ${
                        active === index ? "text-ochre opacity-100" : "text-ivory opacity-30 hover:opacity-60"
                      }`}
                    >
                      {pillar.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div ref={listRef} className="pt-16 roomy:col-span-8 roomy:col-start-5 roomy:pt-0">
          <p className="mb-10 text-[14px] uppercase leading-none tracking-[0.22em] text-ochre roomy:hidden">
            Practice areas
          </p>

          {GROUPS.map(({ pillar, areas }, groupIndex) => (
            <div
              key={pillar.id}
              ref={(element) => {
                groupRefs.current[groupIndex] = element;
              }}
              className={groupIndex > 0 ? "mt-16 roomy:mt-24" : undefined}
            >
              <h3 className="sr-only">{pillar.name}</h3>
              <ul>
                {areas.map((area) => (
                  <li key={area.name} data-row data-index={area.index} className="group relative">
                    <span
                      data-rule
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 block h-px bg-ivory/15"
                    />
                    {/* The ochre fill grows from the left edge in 0.5s. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 block origin-left scale-x-0 bg-ochre transition-transform duration-500 ${EASE_CLASS} roomy:group-hover:scale-x-100`}
                    />
                    <div
                      className={`relative flex items-center gap-5 py-6 transition-[translate,color] duration-500 ${EASE_CLASS} roomy:gap-8 roomy:py-8 roomy:group-hover:translate-x-6 roomy:group-hover:text-ink`}
                    >
                      <span className="line-mask w-7 shrink-0 roomy:w-10">
                        <span
                          data-reveal
                          className={`text-[13px] tabular-nums tracking-[0.12em] text-ivory/50 transition-colors duration-500 ${EASE_CLASS} roomy:group-hover:text-ink`}
                        >
                          {String(area.index + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <span className="line-mask min-w-0 flex-1">
                        <span
                          data-reveal
                          className="font-serif text-[clamp(1.5rem,4.6vw,2.5rem)] leading-[1.1] tracking-[-0.01em]"
                        >
                          {area.name}
                        </span>
                      </span>
                      {/* On touch the thumbnail lives permanently at the right edge. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        data-thumb
                        src={area.image}
                        alt=""
                        loading="lazy"
                        className="h-[92px] w-[72px] shrink-0 object-cover roomy:hidden"
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <span
                data-row
                data-rule
                aria-hidden="true"
                className="block h-px bg-ivory/15"
              />
            </div>
          ))}
        </div>
      </div>

      {/* The photograph that follows the cursor: one frame, a strip of seven. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed left-0 top-0 z-30 hidden overflow-hidden roomy:block"
        style={{ width: PREVIEW.width, height: PREVIEW.height }}
      >
        <div ref={stripRef}>
          {AREAS.map((area) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={area.name}
              src={area.image}
              alt=""
              className="block object-cover"
              style={{ width: PREVIEW.width, height: PREVIEW.height }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
