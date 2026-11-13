"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/lenis";

/**
 * Smooth scrolling, driven from the GSAP ticker so Lenis and ScrollTrigger
 * advance on the same frame. Lives in the root layout, so it persists across
 * page changes.
 */
export function SmoothScroll() {
  useEffect(() => {
    const gsap = ensureGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.095,
      smoothWheel: true,
      anchors: { offset: -96 },
      autoRaf: false,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    // Fonts change line lengths, and so every trigger position.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
