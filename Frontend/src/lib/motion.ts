import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The motion system, in one place.
 *
 * Every animation on the site draws from these constants so the page reads as
 * one composed piece rather than a pile of separate effects.
 */

/** The single easing curve used everywhere. cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE = "power4.out";

/** The same curve, for CSS transitions. */
export const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  /** Standard entrance. */
  entrance: 0.9,
  /** Large image reveal. */
  reveal: 1.4,
  /** Cursor response. */
  cursor: 0.3,
} as const;

/** Grouped items stagger 100ms apart; headline lines 120ms. */
export const STAGGER = {
  group: 0.1,
  headline: 0.12,
} as const;

let registered = false;

/**
 * Registers GSAP plugins exactly once, on the client only. Safe to call from
 * any effect; a no-op on the server.
 */
export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Keep the ticker steady when the tab has been backgrounded.
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }
  return gsap;
}

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
