"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { AREAS } from "@/content/practice";

/**
 * The practice names in outline, travelling steadily. Scrolling quickens them
 * in the direction of travel, and they ease back to their own pace.
 */
export function Marquee() {
  const { locale } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  const words = AREAS.map((area) => area.tag[locale]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const track = trackRef.current;
    if (!track) return;

    const loop = gsap.to(track, { xPercent: -50, duration: 48, ease: "none", repeat: -1 });
    let direction = 1;
    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction !== direction) direction = self.direction;
        const boost = Math.min(Math.abs(self.getVelocity()) / 220, 6);
        gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.25, overwrite: true });
        gsap.to(loop, { timeScale: direction, duration: 1.4, delay: 0.25, ease: "power2.out" });
      },
    });
    return () => {
      loop.kill();
      trigger.kill();
    };
  }, []);

  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b" ? true : undefined}>
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span
            className="whitespace-nowrap px-[0.35em] font-serif text-[clamp(56px,8vw,120px)] leading-none tracking-[-0.01em] text-transparent [-webkit-text-stroke:1px_var(--color-emerald)]"
          >
            {word}
          </span>
          <span className="size-2 rounded-full bg-emerald/70" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-t border-line-dark bg-onyx py-[clamp(28px,4vw,48px)]" aria-hidden="true">
      <div ref={trackRef} className="flex w-max">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
