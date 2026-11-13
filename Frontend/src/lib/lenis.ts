import type Lenis from "lenis";

/**
 * The single Lenis instance, shared so that the menu, the curtain and in-page
 * links can lock scrolling or travel to a target.
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

/** Jumps to the top with no travel, used when a new page arrives. */
export function resetScroll() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
