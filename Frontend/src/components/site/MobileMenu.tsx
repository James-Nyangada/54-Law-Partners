"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, EASE, DURATION, prefersReducedMotion } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { LanguageToggle } from "@/i18n/LanguageToggle";

/**
 * The menu for touch screens and narrow windows.
 *
 * An onyx panel opens downward from beneath the header, the links rise from
 * behind their masks 80ms apart while their rules draw from the left, and the
 * footer line arrives last. Closing plays the same sequence backwards, faster.
 */
export function MobileMenu({
  open,
  onNavigate,
}: {
  open: boolean;
  /** Called with the chosen anchor; the header closes the menu and travels. */
  onNavigate: (href: string) => void;
}) {
  const { t } = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Build the sequence once, paused.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const gsap = ensureGsap();
    const lines = root.querySelectorAll<HTMLElement>("[data-line] > span");
    const rules = root.querySelectorAll<HTMLElement>("[data-rule]");
    const footer = root.querySelector<HTMLElement>("[data-footer]");

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: EASE },
      onReverseComplete: () => {
        gsap.set(root, { autoAlpha: 0 });
      },
    });

    tl.fromTo(
      root,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 },
      0,
    );
    tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: DURATION.entrance, stagger: 0.08 }, 0.25);
    tl.fromTo(
      rules,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, stagger: 0.08 },
      0.25,
    );
    tl.fromTo(footer, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: DURATION.entrance }, 0.6);

    tlRef.current = tl;
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  // Play forward to open, backward to close.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const tl = tlRef.current;

    if (!tl) {
      // Reduced motion: the menu simply appears and disappears.
      gsap.set(root, { autoAlpha: open ? 1 : 0 });
    } else if (open) {
      gsap.set(root, { autoAlpha: 1 });
      tl.timeScale(1).play();
    } else if (tl.progress() > 0) {
      tl.timeScale(1.6).reverse();
    }

    if (open) {
      const id = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 350);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.siteMenu}
      className="invisible fixed inset-0 z-40 flex flex-col bg-onyx pt-[var(--header-h)] lg:hidden"
    >
      <nav aria-label={t.nav.primary} className="flex-1 overflow-y-auto px-[clamp(1.5rem,5vw,7rem)] pt-10">
        <ul>
          {t.nav.items.map((item, index) => (
            <li key={item.href} className="relative">
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.href);
                }}
                className="group flex items-baseline gap-5 py-5"
              >
                <span data-line className="line-mask">
                  <span className="text-[12px] tabular-nums tracking-[0.16em] text-mint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <span data-line className="line-mask">
                  <span className="font-serif text-[clamp(2.25rem,9vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-bone transition-colors duration-300 group-active:text-mint">
                    {item.label}
                  </span>
                </span>
              </a>
              <span data-rule className="absolute inset-x-0 bottom-0 block h-px bg-bone/15" />
            </li>
          ))}
        </ul>
      </nav>

      <div
        data-footer
        className="flex flex-col items-start gap-4 px-[clamp(1.5rem,5vw,7rem)] py-8 text-[12px] uppercase tracking-[0.22em] sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="text-sage">{t.nav.tagline}</span>
        <LanguageToggle />
        <a
          href="#contact"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("#contact");
          }}
          className="text-mint"
        >
          {t.nav.speak}
        </a>
      </div>
    </div>
  );
}
