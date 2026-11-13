"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ensureGsap,
  ScrollTrigger,
  SplitText,
  EASE,
  DURATION,
  STAGGER,
  prefersReducedMotion,
  whenRevealed,
} from "@/lib/motion";

/**
 * Declarative scroll motion for every page. Server-rendered markup opts in with
 * data attributes, and this layer brings them to life once the page is visible:
 *
 *   data-reveal="up"      rises 28px and fades in; neighbours entering together stagger
 *   data-reveal="lines"   text splits into lines that rise from behind masks
 *   data-reveal="image"   a frame opens upward while the image settles from 1.2 scale
 *   data-reveal="rule"    a rule draws from the left
 *   data-reveal="fade"    fades in
 *   data-delay="0.2"      seconds to wait after entering
 *   data-parallax="10"    drifts ±10% of its height while crossing the viewport
 *
 * Elements rendered later on the client (filtered lists) must not use these:
 * they animate themselves.
 */
export function RouteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const gsap = ensureGsap();
    const main = document.getElementById("main");
    if (!main) return;

    if (prefersReducedMotion()) {
      document.documentElement.classList.add("motion-static");
      return;
    }

    let ctx: gsap.Context | null = null;
    const splits: SplitText[] = [];

    const cancel = whenRevealed(() => {
      ctx = gsap.context(() => {
        const at = (el: Element) => Number((el as HTMLElement).dataset.delay ?? 0);

        // Rising groups. Batched so items that enter together stagger.
        const ups = gsap.utils.toArray<HTMLElement>('[data-reveal="up"]', main);
        gsap.set(ups, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(ups, {
          start: "top 90%",
          once: true,
          interval: 0.12,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: DURATION.entrance,
              ease: EASE,
              stagger: STAGGER.group,
              delay: at(batch[0]),
              overwrite: true,
            }),
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]', main).forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1.2, ease: "power2.out", delay: at(el), scrollTrigger: { trigger: el, start: "top 92%", once: true } },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]', main).forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          splits.push(split);
          gsap.set(el, { autoAlpha: 1 });
          gsap.fromTo(
            split.lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.05,
              ease: EASE,
              stagger: STAGGER.lines,
              delay: at(el),
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="image"]', main).forEach((el) => {
          const media = el.querySelector("img, video, [data-media]");
          gsap.set(el, { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" });
          if (media) gsap.set(media, { scale: 1.2 });
          const tl = gsap.timeline({
            delay: at(el),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
          tl.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: DURATION.reveal, ease: EASE }, 0);
          if (media) tl.to(media, { scale: 1, duration: DURATION.reveal + 0.3, ease: EASE }, 0);
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="rule"]', main).forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 1.3, ease: EASE, delay: at(el), scrollTrigger: { trigger: el, start: "top 94%", once: true } },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]", main).forEach((el) => {
          const amount = Number(el.dataset.parallax) || 10;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }, main);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancel();
      splits.forEach((split) => split.revert());
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
