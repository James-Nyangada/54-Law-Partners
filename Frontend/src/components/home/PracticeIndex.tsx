"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ensureGsap, ScrollTrigger, EASE, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { scrollToTarget } from "@/lib/lenis";
import { useLocale } from "@/i18n/useLocale";
import { AREAS, PILLARS, areaNumber, type PillarId } from "@/content/practice";
import { href } from "@/lib/routes";
import { Arrow } from "@/components/ui/Arrow";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * Three pillars, eight areas. The pillar column is held in place while the
 * rows pass, and marks the pillar currently in view. Hovering a row sweeps it
 * forest from the left, draws a mint edge and opens the area's photograph.
 * On touch screens the thumbnails are always shown and the pillars become a
 * bar that sticks beneath the header.
 */
export function PracticeIndex() {
  const { locale, t } = useLocale();
  const [active, setActive] = useState<PillarId>("transactions");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    const triggers = PILLARS.map((pillar) =>
      ScrollTrigger.create({
        trigger: section.querySelector(`[data-group="${pillar.id}"]`),
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(pillar.id),
      }),
    );

    let ctx: gsap.Context | null = null;
    const cancel = prefersReducedMotion()
      ? () => {}
      : whenRevealed(() => {
          ctx = gsap.context(() => {
            const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
            gsap.set(rows, { autoAlpha: 0, y: 32 });
            ScrollTrigger.batch(rows, {
              start: "top 92%",
              once: true,
              onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.07 }),
            });
            gsap.fromTo(
              "[data-row-rule]",
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 1.2,
                ease: EASE,
                stagger: 0.07,
                scrollTrigger: { trigger: "[data-rows]", start: "top 85%", once: true },
              },
            );
          }, section);
        });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      cancel();
      ctx?.revert();
    };
  }, []);

  const goTo = (id: PillarId) => {
    const group = sectionRef.current?.querySelector<HTMLElement>(`[data-group="${id}"]`);
    if (group) scrollToTarget(group, -160);
  };

  return (
    <section ref={sectionRef} id="practice-areas" className="surface-dark relative bg-onyx section-y">
      <div className="shell grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <p className="eyebrow text-mint" data-reveal="fade">{t.practiceIndex.eyebrow}</p>
            <h2 className="type-section mt-5" data-reveal="lines">
              {t.practiceIndex.title[0]}
              <br />
              {t.practiceIndex.title[1]}
            </h2>
            <ul className="mt-9 hidden space-y-1 lg:block" data-reveal="up">
              {PILLARS.map((pillar) => (
                <li key={pillar.id}>
                  <button
                    type="button"
                    onClick={() => goTo(pillar.id)}
                    className={`relative block w-full py-2 pl-4 text-left text-[14.5px] transition-colors duration-300 ${
                      active === pillar.id ? "text-bone" : "text-sage/70 hover:text-bone"
                    }`}
                  >
                    <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px bg-line-raised" />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-1 left-0 w-[2px] origin-top bg-mint transition-transform duration-500 ${EASE_CLASS} ${
                        active === pillar.id ? "scale-y-100" : "scale-y-0"
                      }`}
                    />
                    {pillar.name[locale]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Below 1024px the pillars become a bar that sticks under the header. */}
        <div className="sticky top-[var(--header-h)] z-10 -mx-[var(--pad-x)] border-y border-line-dark bg-onyx/95 px-[var(--pad-x)] backdrop-blur lg:hidden">
          <ul className="flex gap-6 overflow-x-auto py-3 text-[14px]">
            {PILLARS.map((pillar) => (
              <li key={pillar.id}>
                <button
                  type="button"
                  onClick={() => goTo(pillar.id)}
                  className={`whitespace-nowrap py-1 ${active === pillar.id ? "text-mint" : "text-sage"}`}
                >
                  {pillar.short[locale]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-9" data-rows>
          {PILLARS.map((pillar) => (
            <ul key={pillar.id} data-group={pillar.id}>
              {AREAS.filter((area) => area.pillar === pillar.id).map((area) => (
                <li key={area.id} data-row className="relative">
                  <span data-row-rule aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-line-dark" />
                  <Link
                    href={href.area(area.id, locale)}
                    data-cursor={t.practicePage.explore}
                    className="group relative flex min-h-[88px] items-center gap-5 py-5 pr-4 sm:gap-8 lg:min-h-[104px]"
                  >
                    {/* The forest sweep and the mint edge. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 origin-left scale-x-0 bg-forest transition-transform duration-700 ${EASE_CLASS} roomy:group-hover:scale-x-100 group-focus-visible:scale-x-100`}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-[2px] origin-bottom scale-y-0 bg-mint transition-transform duration-500 ${EASE_CLASS} roomy:group-hover:scale-y-100`}
                    />
                    <span className={`relative w-8 shrink-0 pl-1 text-[12px] tabular-nums text-mint transition-transform duration-700 ${EASE_CLASS} roomy:group-hover:translate-x-4`}>
                      {areaNumber(area.id)}
                    </span>
                    <span className={`type-row relative flex-1 text-bone transition-transform duration-700 ${EASE_CLASS} roomy:group-hover:translate-x-4`}>
                      {area.name[locale]}
                    </span>
                    <span className="relative hidden h-[64px] w-[100px] shrink-0 overflow-hidden sm:block compact:block">
                      <span className={`absolute inset-0 block border border-line-raised transition-[clip-path] duration-700 ${EASE_CLASS} roomy:[clip-path:inset(0_0_0_100%)] roomy:group-hover:[clip-path:inset(0_0_0_0)]`}>
                        <Image
                          src={area.image}
                          alt=""
                          fill
                          sizes="100px"
                          className={`object-cover saturate-[0.7] transition-transform duration-[1.2s] ${EASE_CLASS} roomy:scale-125 roomy:group-hover:scale-100`}
                        />
                      </span>
                    </span>
                    <Arrow className={`relative hidden shrink-0 text-mint transition-[opacity,transform] duration-500 ${EASE_CLASS} roomy:block roomy:-translate-x-3 roomy:opacity-0 roomy:group-hover:translate-x-0 roomy:group-hover:opacity-100`} />
                  </Link>
                </li>
              ))}
            </ul>
          ))}
          <span aria-hidden="true" className="block h-px bg-line-dark" />
        </div>
      </div>
    </section>
  );
}
