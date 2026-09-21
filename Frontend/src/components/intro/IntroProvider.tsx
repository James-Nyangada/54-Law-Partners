"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * `loading`   — the ivory curtain is up, the counter is running.
 * `revealing` — the curtain has started to slide off; the hero plays its entrance.
 * `done`      — the opening sequence is over and the page is interactive.
 */
export type IntroPhase = "loading" | "revealing" | "done";

interface IntroValue {
  phase: IntroPhase;
  /** True once fonts and the hero photograph have finished loading. */
  assetsReady: boolean;
  /** The hero calls this when its photograph has decoded. */
  reportHeroImageReady: () => void;
  /** The preloader calls this as the curtain begins to move. */
  beginReveal: () => void;
  /** The preloader calls this once the curtain is fully off screen. */
  finishIntro: () => void;
}

const IntroContext = createContext<IntroValue | null>(null);

export function useIntro(): IntroValue {
  const value = useContext(IntroContext);
  if (!value) {
    throw new Error("useIntro must be used inside an IntroProvider");
  }
  return value;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [sequencePhase, setPhase] = useState<IntroPhase>("loading");
  const [fontsReady, setFontsReady] = useState(false);
  const [heroImageReady, setHeroImageReady] = useState(false);

  const reportHeroImageReady = useCallback(() => setHeroImageReady(true), []);
  const beginReveal = useCallback(() => setPhase("revealing"), []);
  const finishIntro = useCallback(() => setPhase("done"), []);

  // Visitors who asked for reduced motion skip the sequence entirely, so the
  // phase is derived rather than stored.
  const reducedMotion = useReducedMotion();
  const phase: IntroPhase = reducedMotion ? "done" : sequencePhase;

  // Wait for webfonts. The headline is the page, so it must not swap mid-reveal.
  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setFontsReady(true);
    };

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(done).catch(done);
    } else {
      done();
    }

    // Never let a stalled font request hold the page hostage.
    const failsafe = window.setTimeout(done, 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
    };
  }, []);

  // A broken or very slow photograph must never strand the curtain.
  useEffect(() => {
    const failsafe = window.setTimeout(() => setHeroImageReady(true), 5000);
    return () => window.clearTimeout(failsafe);
  }, []);

  // One class on <html> tells every section to render its finished state.
  useEffect(() => {
    document.documentElement.classList.toggle("motion-static", reducedMotion);
  }, [reducedMotion]);

  // Expose the phase to CSS so the scroll lock lives in the stylesheet.
  useEffect(() => {
    document.documentElement.dataset.intro = phase;
  }, [phase]);

  const value = useMemo<IntroValue>(
    () => ({
      phase,
      assetsReady: fontsReady && heroImageReady,
      reportHeroImageReady,
      beginReveal,
      finishIntro,
    }),
    [phase, fontsReady, heroImageReady, reportHeroImageReady, beginReveal, finishIntro],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
