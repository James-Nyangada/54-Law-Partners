import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

/**
 * The motion system, in one place. Every animation draws on these constants so
 * the site reads as one composed piece.
 */

/** The UI kit's single curve: cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE = "settle";
/** A symmetric curve for things that cover and uncover (the curtain). */
export const EASE_INOUT = "cover";
export const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  /** Interface response: hovers, fields, small state changes. */
  ui: 0.3,
  entrance: 0.9,
  reveal: 1.3,
} as const;

export const STAGGER = { group: 0.08, lines: 0.1 } as const;

let registered = false;

/** Registers plugins and custom eases once, on the client only. */
export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, MotionPathPlugin);
    CustomEase.create(EASE, "0.16, 1, 0.3, 1");
    CustomEase.create(EASE_INOUT, "0.76, 0, 0.24, 1");
    gsap.defaults({ ease: EASE });
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }
  return gsap;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function finePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/* ---------------------------------------------------------------------------
   The "page is visible" signal.

   A curtain covers the screen on first load and between pages. Entrances must
   not play underneath it, so anything that animates in waits for this signal.
--------------------------------------------------------------------------- */

let covered = true;
const waiting = new Set<() => void>();

/** Called by the curtain as it starts to lift off a page. */
export function markRevealed() {
  covered = false;
  const callbacks = [...waiting];
  waiting.clear();
  callbacks.forEach((callback) => callback());
}

/** Called by the curtain as it closes over the page being left. */
export function markCovered() {
  covered = true;
}

/** Runs `callback` once the page is visible. Returns a cancel function. */
export function whenRevealed(callback: () => void): () => void {
  if (!covered) {
    callback();
    return () => {};
  }
  waiting.add(callback);
  return () => waiting.delete(callback);
}

export { gsap, ScrollTrigger, SplitText };
