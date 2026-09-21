import type Lenis from "lenis";

/**
 * The single Lenis instance, shared so that components outside the smooth
 * scroll provider (the mobile menu, the practice pillars) can lock scrolling or
 * travel to an anchor.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Scrolls to an element with the site's weight, or instantly without Lenis. */
export function scrollToTarget(target: HTMLElement, offset = 0) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "auto" });
}
