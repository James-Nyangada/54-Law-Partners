"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, EASE, DURATION } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ARTICLES } from "./data";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const SWIPE_QUERY = "(max-width: 1023.98px), (prefers-reduced-motion: reduce)";

/**
 * Section 6 — insights.
 *
 * Signature move 4, used only here: the section locks while a row of article
 * cards travels right to left in direct proportion to scroll, a progress rule
 * filling beneath it, then releases. On narrow screens, and with reduced
 * motion, the row is an ordinary horizontal swipe with the same progress rule.
 */
export function Insights() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const gsap = ensureGsap();
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !viewport || !track || !progress) return;

    const mm = gsap.matchMedia();

    // Entrances, wherever motion is allowed.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
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
            stagger: 0.1,
            delay: 0.2,
            scrollTrigger: { trigger: head, start: "top 85%", once: true },
          },
        );
      }
      gsap.fromTo(
        track.children,
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: viewport, start: "top 85%", once: true },
        },
      );
    });

    // Wide screens: pin the section and drive the row with the scroll.
    mm.add(PIN_QUERY, () => {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      gsap.set(viewport, { overflow: "hidden" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      tl.to(track, { x: () => -distance(), ease: "none" }, 0);
      tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
    });

    // Everywhere else: a native swipe, with the rule tracking it.
    mm.add(SWIPE_QUERY, () => {
      const update = () => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        gsap.set(progress, { scaleX: max > 0 ? viewport.scrollLeft / max : 1 });
      };
      update();
      viewport.addEventListener("scroll", update, { passive: true });
      return () => viewport.removeEventListener("scroll", update);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="insights"
      ref={sectionRef}
      aria-labelledby="insights-title"
      className="relative bg-ivory text-ink"
    >
      <div className="flex min-h-svh flex-col justify-center py-28 lg:pb-12 lg:pt-[calc(var(--header-h)+2.5rem)]">
        <div
          ref={headRef}
          className="grid gap-y-8 px-[clamp(1.5rem,5vw,7rem)] lg:grid-cols-12 lg:items-end lg:gap-x-6"
        >
          <div className="lg:col-span-7">
            <h2
              id="insights-title"
              className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1] tracking-[-0.02em]"
            >
              <span className="line-mask">
                <span data-line>Insights</span>
              </span>
            </h2>
            <p className="line-mask mt-5">
              <span data-line className="text-[clamp(1.125rem,1.4vw,1.25rem)] text-ink/70">
                Legal analysis, alerts and publications.
              </span>
            </p>
          </div>
          <div data-rise className="lg:col-span-5 lg:justify-self-end">
            <ArrowLink href="#insights">The full archive</ArrowLink>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="mt-14 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:mt-16 [&::-webkit-scrollbar]:hidden"
        >
          <ul
            ref={trackRef}
            className="flex w-max gap-8 px-[clamp(1.5rem,5vw,7rem)]"
            aria-label="Latest articles"
          >
            {ARTICLES.map((article) => (
              <li
                key={article.title}
                className="w-[min(80vw,420px)] shrink-0 snap-start scroll-ml-[clamp(1.5rem,5vw,7rem)]"
              >
                <a href={article.href} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt=""
                      loading="lazy"
                      className={`h-full w-full object-cover transition-[scale] duration-700 ${EASE_CLASS} group-hover:scale-[1.06]`}
                    />
                  </div>
                  <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] uppercase tracking-[0.18em]">
                    <span className="text-red-earth">{article.tag}</span>
                    <span className="text-ink/50">
                      <time>{article.date}</time>
                    </span>
                  </p>
                  <h3 className="mt-4 font-serif text-[clamp(1.5rem,2vw,1.75rem)] font-normal leading-[1.2] tracking-[-0.01em]">
                    {/* The arrow stays attached to the last word, never alone on a line. */}
                    {article.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="whitespace-nowrap">
                      {article.title.split(" ").at(-1)}
                      <Arrow
                        className={`ml-3 inline-block align-middle transition-transform duration-500 ${EASE_CLASS} group-hover:translate-x-2`}
                      />
                    </span>
                  </h3>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* The progress rule fills as the row travels. */}
        <div className="mx-[clamp(1.5rem,5vw,7rem)] mt-12 h-px bg-ink/15">
          <span ref={progressRef} className="block h-full origin-left scale-x-0 bg-red-earth" />
        </div>
      </div>
    </section>
  );
}
