"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";

/**
 * Kenyan grounding. A full-bleed photograph of Nairobi holds still while the
 * statement panel passes over it (wireframe 04a). Behind the panel the city
 * settles from 1.18 scale and its wash lifts, so it clears as the visitor
 * reads. Below 1024px there is no holding: image and panel simply stack.
 */
export function Grounding() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const cancel = whenRevealed(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px)", () => {
          const scrub = { trigger: section, start: "top bottom", end: "bottom bottom", scrub: true };
          gsap.fromTo(imageRef.current, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: scrub });
          gsap.fromTo(washRef.current, { opacity: 0.92 }, { opacity: 0.45, ease: "none", scrollTrigger: scrub });
        });
        mm.add("(max-width: 1023.98px)", () => {
          gsap.fromTo(
            imageRef.current,
            { yPercent: -8 },
            { yPercent: 8, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      }, section);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="surface-dark relative bg-onyx lg:h-[210svh]" aria-label={t.grounding.eyebrow}>
      <div className="relative h-[72svh] overflow-hidden lg:sticky lg:top-0 lg:h-svh">
        <div ref={imageRef} className="absolute -inset-y-[10%] inset-x-0 lg:inset-0">
          <Image src="/images/nairobi-skyline.jpg" alt={t.grounding.imageAlt} fill sizes="100vw" className="object-cover object-[50%_60%] saturate-[0.7]" />
        </div>
        <div
          ref={washRef}
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_14_12/0.9),rgb(12_43_31/0.55)_55%,rgb(11_14_12/0.35)),linear-gradient(0deg,rgb(11_14_12/0.85),transparent_40%)] opacity-70"
        />
      </div>

      <div className="relative lg:-mt-[100svh]">
        <div className="hidden h-[70svh] lg:block" />
        <div className="shell -mt-40 pb-[var(--pad-y)] lg:mt-0 lg:pb-[45svh]">
          <div
            className="max-w-[600px] border border-line-raised bg-onyx/90 p-[clamp(28px,3.5vw,48px)] backdrop-blur-sm"
          >
            <p className="eyebrow text-mint">{t.grounding.eyebrow}</p>
            <h2 className="mt-5 font-serif text-[clamp(30px,3.2vw,44px)] leading-[1.14] tracking-[-0.012em]">
              <span data-reveal="lines" className="block">{t.grounding.title}</span>
              <em data-reveal="lines" data-delay="0.15" className="block text-mint">{t.grounding.accent}</em>
            </h2>
            <p className="mt-6 max-w-[48ch] text-[15.5px] leading-[1.65] text-sage" data-reveal="fade" data-delay="0.3">
              {t.grounding.support}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
