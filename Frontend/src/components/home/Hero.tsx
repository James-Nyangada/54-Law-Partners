"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ensureGsap, EASE, finePointer, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { PATHS } from "@/lib/routes";
import { buttonClass } from "@/components/ui/Button";
import { Arrow } from "@/components/ui/Arrow";

/** The point the arcs leave from: Nairobi, in the hero's own coordinates. */
const ORIGIN = { x: 250, y: 470 };

/**
 * Destinations sweep out to the right and fan up and down, like routes leaving
 * a hub. Coordinates are in a 1440 × 900 field that covers the hero.
 */
const ARCS = [
  { x: 1440, y: 140, bend: 0.32 },
  { x: 1440, y: 300, bend: 0.22 },
  { x: 1240, y: 40, bend: 0.3 },
  { x: 1440, y: 520, bend: 0.12 },
  { x: 1000, y: 900, bend: -0.2 },
  { x: 1440, y: 760, bend: -0.12 },
  { x: -40, y: 140, bend: -0.25 },
  { x: 40, y: 900, bend: 0.2 },
  { x: 700, y: -20, bend: 0.18 },
].map(({ x, y, bend }) => {
  const dx = x - ORIGIN.x;
  const dy = y - ORIGIN.y;
  const cx = ORIGIN.x + dx / 2 - dy * bend;
  const cy = ORIGIN.y + dy / 2 + dx * bend * -1;
  return `M${ORIGIN.x},${ORIGIN.y} Q${cx.toFixed(0)},${cy.toFixed(0)} ${x},${y}`;
});

export function Hero() {
  const { locale, t } = useLocale();
  const rootRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // The entrance, played once the curtain lifts.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const root = rootRef.current;
    if (!root) return;

    let ctx: gsap.Context | null = null;
    const cancel = whenRevealed(() => {
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const arcs = q("[data-arc]");
        const pulses = q("[data-pulse]");

        gsap.set(q("[data-hero]"), { autoAlpha: 1 });
        gsap.set(q("[data-hero-line]"), { yPercent: 112 });
        gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 24 });
        gsap.set(frameRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(imageRef.current, { scale: 1.25 });
        gsap.set(arcs, { drawSVG: "0%" });
        gsap.set(q("[data-origin]"), { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(pulses, { autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: EASE } });
        tl.to(q("[data-hero-eyebrow]"), { autoAlpha: 1, y: 0, duration: 0.9 }, 0.1);
        tl.to(q("[data-hero-line]"), { yPercent: 0, duration: 1.2, stagger: 0.11 }, 0.15);
        tl.to(frameRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 }, 0.3);
        tl.to(imageRef.current, { scale: 1, duration: 2 }, 0.3);
        tl.to(q("[data-hero-copy]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.7);
        tl.to(q("[data-origin]"), { scale: 1, duration: 0.8, stagger: 0.1 }, 0.4);
        tl.to(arcs, { drawSVG: "100%", duration: 2.4, stagger: 0.09, ease: "power2.inOut" }, 0.5);
        tl.add(() => startPulses(), 2.2);

        // Light travelling along the routes, endlessly and unhurried.
        function startPulses() {
          pulses.forEach((pulse, index) => {
            const path = arcs[index % arcs.length] as unknown as SVGPathElement;
            gsap.timeline({ repeat: -1, delay: index * 1.1, repeatDelay: 2.5 + (index % 3) })
              .set(pulse, { autoAlpha: 0 })
              .to(pulse, { autoAlpha: 1, duration: 0.4, ease: "none" }, 0)
              .to(pulse, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 4.5, ease: "power1.inOut" }, 0)
              .to(pulse, { autoAlpha: 0, duration: 0.6, ease: "none" }, 3.9);
          });
          gsap.to(q("[data-ring]"), { scale: 3.2, autoAlpha: 0, duration: 2.8, repeat: -1, ease: "power2.out", transformOrigin: "50% 50%" });
        }

        // On scroll the copy lifts away a little faster than the page, and the
        // photograph drifts the other way.
        gsap.to(contentRef.current, {
          yPercent: -18,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(imageRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(fieldRef.current, {
          scale: 1.12,
          autoAlpha: 0.2,
          transformOrigin: `${(ORIGIN.x / 1440) * 100}% ${(ORIGIN.y / 900) * 100}%`,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      }, root);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  // The field leans toward the cursor; the glow follows it, slowly.
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const gsap = ensureGsap();
    const root = rootRef.current;
    const field = fieldRef.current;
    const glow = glowRef.current;
    if (!root || !field || !glow) return;
    const fx = gsap.quickTo(field, "x", { duration: 1.6, ease: EASE });
    const fy = gsap.quickTo(field, "y", { duration: 1.6, ease: EASE });
    const gx = gsap.quickTo(glow, "x", { duration: 1.2, ease: EASE });
    const gy = gsap.quickTo(glow, "y", { duration: 1.2, ease: EASE });
    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const nx = (event.clientX - box.left) / box.width - 0.5;
      const ny = (event.clientY - box.top) / box.height - 0.5;
      fx(nx * -28);
      fy(ny * -20);
      gx(event.clientX - box.left);
      gy(event.clientY - box.top);
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="surface-dark relative overflow-hidden bg-onyx pt-[var(--header-h)] lg:min-h-[max(100svh,720px)]"
    >
      {/* A forest bloom around the origin, so the black is never flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] top-[10%] h-[90vmin] w-[90vmin] rounded-full bg-[radial-gradient(closest-side,rgb(31_138_95/0.22),rgb(15_59_42/0.18)_45%,transparent)]"
      />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(111_207_160/0.07),transparent)] roomy:block"
      />

      <svg
        ref={fieldRef}
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="arc-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1f8a5f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1f8a5f" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {ARCS.map((d, index) => (
          <path key={index} data-arc d={d} fill="none" stroke="url(#arc-fade)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        {ARCS.slice(0, 6).map((_, index) => (
          <circle key={index} data-pulse r="2.4" fill="#6fcfa0" style={{ visibility: "hidden" }} />
        ))}
        <circle data-origin data-ring cx={ORIGIN.x} cy={ORIGIN.y} r="10" fill="none" stroke="#6fcfa0" strokeOpacity="0.6" />
        <circle data-origin cx={ORIGIN.x} cy={ORIGIN.y} r="16" fill="none" stroke="#1f8a5f" strokeOpacity="0.5" />
        <circle data-origin cx={ORIGIN.x} cy={ORIGIN.y} r="5" fill="#6fcfa0" />
      </svg>

      <div className="shell relative grid items-center gap-y-12 py-[clamp(48px,8vh,96px)] lg:min-h-[calc(max(100svh,720px)-var(--header-h))] lg:grid-cols-12 lg:gap-x-6">
        <div ref={contentRef} className="@container lg:col-span-8 lg:pr-6">
          <p data-hero data-hero-fade data-hero-eyebrow className="eyebrow text-mint">
            {t.hero.eyebrow}
          </p>
          {/* Sized from its own column so the three lines always fit, capped at the
              UI kit's 82px. The longest line runs to about 11.2em. */}
          <h1 data-hero className="type-hero mt-7 text-bone lg:text-[min(82px,8.6cqi)]" key={locale}>
            {t.hero.headline.map((line, index) => (
              <span key={index} className="line-mask">
                <span data-hero-line className="lg:whitespace-nowrap">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p data-hero data-hero-fade data-hero-copy className="type-lead mt-8 max-w-[44ch] text-sage">
            {t.hero.support}
          </p>
          <div data-hero data-hero-fade data-hero-copy className="mt-10 flex flex-wrap gap-3">
            <Link href={PATHS.practice[locale]} className={buttonClass("primary")}>
              {t.hero.practice}
              <Arrow />
            </Link>
            <Link href={PATHS.contact[locale]} className={buttonClass("secondary")}>
              {t.hero.speak}
            </Link>
          </div>
        </div>

        <div
          ref={frameRef}
          data-hero
          className="relative aspect-[4/3] overflow-hidden border border-line-raised bg-forest-deep sm:aspect-[16/10] lg:col-span-4 lg:col-start-9 lg:aspect-auto lg:h-[min(68vh,640px)]"
        >
          <div ref={imageRef} className="absolute -inset-y-[8%] inset-x-0">
            <Image
              src="/images/nairobi-night.jpg"
              alt={t.hero.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover object-[58%_50%] saturate-[0.8]"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_14_12/0.05),rgb(11_14_12/0.55)),linear-gradient(135deg,rgb(15_59_42/0.45),transparent_60%)]" />
          <p className="absolute bottom-5 left-5 right-5 flex items-center justify-between eyebrow text-bone/80">
            <span>Nairobi</span>
            <span className="tabular-nums tracking-[0.12em]">1.29° S · 36.82° E</span>
          </p>
        </div>
      </div>
    </section>
  );
}
