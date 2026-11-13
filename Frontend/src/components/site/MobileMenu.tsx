"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ensureGsap, EASE, EASE_INOUT, prefersReducedMotion } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { LanguageToggle } from "@/i18n/LanguageToggle";
import { PATHS, type PageKey } from "@/lib/routes";
import { buttonClass } from "@/components/ui/Button";

/**
 * The menu below 1024px. The panel wipes down from beneath the header, the
 * links rise from behind their masks while their rules draw, and the footer
 * row arrives last. Closing plays it backwards, faster.
 */
export function MobileMenu({ open, active }: { open: boolean; active: PageKey | null }) {
  const { locale, t } = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLAnchorElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const tl = gsap.timeline({ paused: true, onReverseComplete: () => void gsap.set(root, { autoAlpha: 0 }) });
    tl.fromTo(root, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE_INOUT }, 0);
    tl.fromTo(root.querySelectorAll("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: EASE, stagger: 0.06 }, 0.3);
    tl.fromTo(root.querySelectorAll("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: EASE, stagger: 0.06 }, 0.3);
    tl.fromTo(root.querySelector("[data-foot]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE }, 0.6);
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const tl = tlRef.current;
    if (!tl) gsap.set(root, { autoAlpha: open ? 1 : 0 });
    else if (open) {
      gsap.set(root, { autoAlpha: 1 });
      tl.timeScale(1).play();
    } else if (tl.progress() > 0) tl.timeScale(1.7).reverse();
    if (open) {
      const id = window.setTimeout(() => firstRef.current?.focus({ preventScroll: true }), 350);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.primary}
      className="surface-dark invisible fixed inset-0 z-40 flex flex-col bg-onyx pt-[var(--header-h)] lg:hidden"
    >
      <nav className="shell flex-1 overflow-y-auto pt-8" data-lenis-prevent>
        <ul>
          {t.nav.items.map((item, index) => {
            const key = item.key as PageKey;
            return (
              <li key={key} className="relative">
                <Link
                  ref={index === 0 ? firstRef : undefined}
                  href={PATHS[key][locale]}
                  aria-current={active === key ? "page" : undefined}
                  className="flex items-baseline gap-5 py-5"
                >
                  <span className="line-mask">
                    <span data-line className="text-[12px] tabular-nums tracking-[0.14em] text-mint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="line-mask">
                    <span
                      data-line
                      className={`font-serif text-[clamp(32px,9vw,48px)] leading-[1.05] tracking-[-0.015em] ${active === key ? "text-mint" : "text-bone"}`}
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
                <span data-rule className="absolute inset-x-0 bottom-0 block h-px origin-left bg-line-dark" />
              </li>
            );
          })}
        </ul>
      </nav>
      <div data-foot className="shell flex items-center justify-between gap-6 py-8">
        <LanguageToggle />
        <Link href={PATHS.contact[locale]} className={buttonClass("primary")}>
          {t.nav.speak}
        </Link>
      </div>
    </div>
  );
}
