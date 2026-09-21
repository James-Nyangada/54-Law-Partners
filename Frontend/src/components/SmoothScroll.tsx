"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { ensureGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/lenis";
import { useIntro } from "./intro/IntroProvider";

/**
 * Smooth scrolling, driven from the GSAP ticker so that Lenis and ScrollTrigger
 * advance on the same frame. Scroll stays locked until the opening sequence is
 * over.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { phase } = useIntro();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const gsap = ensureGsap();

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
      // The GSAP ticker owns the frame loop, so Lenis must not run its own.
      autoRaf: false,
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (phase === "done") lenis.start();
    else lenis.stop();
  }, [phase]);

  return <>{children}</>;
}
