"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ensureGsap,
  ScrollTrigger,
  EASE,
  EASE_INOUT,
  prefersReducedMotion,
  markRevealed,
  markCovered,
} from "@/lib/motion";
import { getLenis, resetScroll } from "@/lib/lenis";
import { useLocale } from "@/i18n/useLocale";

const SEEN_KEY = "54lp-intro";

/**
 * One curtain, two jobs.
 *
 * First visit of a session: the opening sequence. The wordmark rises letter by
 * letter over onyx, an emerald rule measures the load, and two panels lift away
 * to reveal the page.
 *
 * Every page change after that: the panels close over the page being left, the
 * next page renders beneath them, and they lift again. Entrances on the new
 * page wait for the lift (see whenRevealed in lib/motion).
 */
export function Curtain() {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement>(null);
  const forestRef = useRef<HTMLDivElement>(null);
  const onyxRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  /** The path a transition is heading for, while one is running. */
  const pendingRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  // The lift: panels travel up and off, the onyx panel trailing the forest one.
  const lift = (fast = false) => {
    const gsap = ensureGsap();
    const root = rootRef.current;
    if (!root) return;
    markRevealed();
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { autoAlpha: 0 });
        busyRef.current = false;
      },
    });
    tl.to(markRef.current, { autoAlpha: 0, y: -24, duration: 0.45, ease: EASE }, 0);
    tl.to(onyxRef.current, { yPercent: -100, duration: fast ? 0.8 : 1.05, ease: EASE_INOUT }, 0.05);
    tl.to(forestRef.current, { yPercent: -100, duration: fast ? 0.8 : 1.05, ease: EASE_INOUT }, 0.14);
    getLenis()?.start();
  };

  // First load.
  useEffect(() => {
    const gsap = ensureGsap();
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      gsap.set(root, { autoAlpha: 0 });
      markRevealed();
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage unavailable: play the sequence.
    }

    getLenis()?.stop();
    gsap.set(root, { autoAlpha: 1 });
    gsap.set([forestRef.current, onyxRef.current], { yPercent: 0 });

    if (seen) {
      // Returning within the session, or arriving from the other language.
      gsap.set(markRef.current, { autoAlpha: 0 });
      const id = window.setTimeout(() => lift(true), 120);
      return () => window.clearTimeout(id);
    }

    const chars = markRef.current?.querySelectorAll("[data-char]") ?? [];
    const progress = { value: 0 };

    const tl = gsap.timeline();
    tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.035, ease: EASE }, 0.15);
    tl.fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0.3);
    tl.to(
      progress,
      {
        value: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
        },
      },
      0.3,
    );
    tl.to(chars, { yPercent: -115, duration: 0.7, stagger: 0.02, ease: "power3.in" }, "+=0.15");
    tl.to(ruleRef.current, { scaleX: 0, transformOrigin: "right center", duration: 0.6, ease: "power3.in" }, "<");
    tl.add(() => lift(), "-=0.15");

    return () => {
      tl.kill();
    };
  }, []);

  const cover = (target: string, hard: boolean) => {
    const gsap = ensureGsap();
    const root = rootRef.current;
    if (!root) return;
    busyRef.current = true;
    pendingRef.current = target.split(/[?#]/)[0];
    markCovered();
    getLenis()?.stop();

    gsap.set(root, { autoAlpha: 1 });
    gsap.set(markRef.current, { autoAlpha: 0, y: 24 });
    const chars = markRef.current?.querySelectorAll("[data-char]") ?? [];
    gsap.set(chars, { yPercent: 0 });
    gsap.set(ruleRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        if (hard) {
          window.location.assign(target);
          return;
        }
        router.push(target, { scroll: false });
        // A navigation that never lands must not strand the visitor.
        const expected = pendingRef.current;
        window.setTimeout(() => {
          if (pendingRef.current && pendingRef.current === expected) {
            pendingRef.current = null;
            lift(true);
          }
        }, 6000);
      },
    });
    tl.fromTo(forestRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: EASE_INOUT }, 0);
    tl.fromTo(onyxRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: EASE_INOUT }, 0.1);
    tl.to(markRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE }, 0.5);
  };

  // Page transitions: intercept internal links before Next.js handles them.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.dataset.transition === "off") return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page: let anchors work
      if (busyRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      cover(url.pathname + url.search + url.hash, isOtherLanguage(url.pathname));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // Installed once: `cover` works only through refs and the stable router.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The new page has rendered beneath the curtain: reset and lift.
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) {
      // Back/forward navigation: no curtain, just start at the right place.
      return;
    }
    if (pathname !== pending && decodeURI(pathname) !== pending) return;
    pendingRef.current = null;
    resetScroll();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      lift(true);
    });
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      data-curtain
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <div ref={forestRef} className="absolute inset-0 bg-forest" />
      <div ref={onyxRef} className="absolute inset-0 bg-onyx">
        <div ref={markRef} className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="flex overflow-hidden pb-[0.12em] font-serif text-[clamp(28px,4vw,44px)] leading-none tracking-[-0.01em] text-bone">
            {"54 Law Partners".split("").map((char, index) => (
              <span key={index} data-char className="inline-block whitespace-pre">
                {char}
              </span>
            ))}
          </p>
          <span ref={ruleRef} className="mt-6 block h-px w-[min(280px,60vw)] origin-left scale-x-0 bg-emerald" />
        </div>
        <span
          ref={countRef}
          className="absolute bottom-[var(--pad-x)] right-[var(--pad-x)] font-sans text-[12px] tabular-nums tracking-[0.18em] text-sage"
        >
          000
        </span>
        <span className="absolute bottom-[var(--pad-x)] left-[var(--pad-x)] eyebrow text-mint">{t.hero.eyebrow}</span>
      </div>
    </div>
  );
}

function isOtherLanguage(pathname: string) {
  const toFrench = pathname === "/fr" || pathname.startsWith("/fr/");
  const inFrench = document.documentElement.lang === "fr";
  return toFrench !== inFrench;
}
