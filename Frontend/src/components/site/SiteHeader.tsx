"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ensureGsap, ScrollTrigger, EASE, prefersReducedMotion } from "@/lib/motion";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { MobileMenu } from "./MobileMenu";
import { useLocale } from "@/i18n/useLocale";
import { LanguageToggle } from "@/i18n/LanguageToggle";

const LABEL_SWAP =
  "block transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * There is no header during the hero. Once the visitor passes it, a slim bar
 * slides down and stays. Below 1024px the links move into a full-screen menu.
 */
export function SiteHeader() {
  const { t } = useLocale();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const gsap = ensureGsap();

    // Without motion the header is simply always present.
    if (prefersReducedMotion()) {
      gsap.set(header, { yPercent: 0, autoAlpha: 1 });
      return;
    }

    // The hero lives outside this component, so it is looked up by element.
    // A selector string would be scoped to the header by gsap.context.
    const hero = document.getElementById("hero");
    if (!hero) return;

    const ctx = gsap.context(() => {
      // autoAlpha also sets visibility, which keeps the hidden header out of
      // the tab order.
      gsap.set(header, { yPercent: -100, autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        onEnter: () =>
          gsap.to(header, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: EASE }),
        onLeaveBack: () =>
          gsap.to(header, { yPercent: -100, autoAlpha: 0, duration: 0.5, ease: EASE }),
      });
    }, header);

    return () => ctx.revert();
  }, []);

  // While the menu is open: the page is still and unreachable, Escape closes.
  useEffect(() => {
    // The page and footer sit behind the menu; neither should be reachable.
    const behind = document.querySelectorAll<HTMLElement>("main, body > footer, footer");

    if (menuOpen) {
      wasOpenRef.current = true;
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
      behind.forEach((element) => (element.inert = true));

      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setMenuOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }

    getLenis()?.start();
    document.documentElement.style.overflow = "";
    behind.forEach((element) => (element.inert = false));
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      menuButtonRef.current?.focus({ preventScroll: true });
    }
  }, [menuOpen]);

  // Widening past the breakpoint with the menu open closes it.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (wide.matches) setMenuOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  const navigate = useCallback((href: string) => {
    setMenuOpen(false);
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    // Travel begins as the menu closes, so the page is already moving beneath.
    requestAnimationFrame(() => scrollToTarget(target));
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-bone/10 bg-onyx/90 backdrop-blur-md"
      >
        <div className="flex h-[var(--header-h)] items-center justify-between px-[clamp(1.5rem,5vw,7rem)]">
          <a href="#hero" className="flex items-baseline gap-3">
            <span className="font-serif text-2xl leading-none text-bone">54</span>
            <span className="text-[11px] uppercase tracking-[0.24em] text-sage">
              Law Partners
            </span>
          </a>

          {/* The EN / FR toggle sits at the far right of the nav. */}
          <div className="hidden items-center gap-10 lg:flex">
            <nav aria-label={t.nav.primary}>
              <ul className="flex items-center gap-9">
                {t.nav.items.map((item) => (
                  <li key={item.href}>
                    <NavLink {...item} />
                  </li>
                ))}
              </ul>
            </nav>
            <span aria-hidden="true" className="block h-4 w-px bg-bone/20" />
            <LanguageToggle />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="group flex items-center gap-3 py-2 text-[12px] uppercase tracking-[0.16em] text-bone lg:hidden"
          >
            {/* Menu slides up and out while Close slides in from below. */}
            {/* Both labels share one grid cell, so the wider one sets the width. */}
            <span className="grid justify-items-end overflow-hidden">
              <span className={`${LABEL_SWAP} [grid-area:1/1] ${menuOpen ? "-translate-y-full" : ""}`}>{t.nav.menu}</span>
              <span
                aria-hidden="true"
                className={`${LABEL_SWAP} [grid-area:1/1] text-mint ${menuOpen ? "translate-y-0" : "translate-y-full"}`}
              >
                {t.nav.close}
              </span>
            </span>
            {/* Two rules that fold into one as the menu opens. */}
            <span aria-hidden="true" className="relative block h-2.5 w-6">
              <span
                className={`absolute left-0 top-1/2 block h-px w-full bg-current transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[5px]"}`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-full bg-current transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"}`}
              />
            </span>
            <span className="sr-only">{menuOpen ? t.nav.closeMenu : t.nav.openMenu}</span>
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onNavigate={navigate} />
    </>
  );
}

/**
 * On hover the label slides up and out while a duplicate slides in from below,
 * and a 1px rule wipes in from the left.
 */
function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group relative block py-1 text-[12px] uppercase tracking-[0.16em] text-bone"
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full text-mint transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        >
          {label}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 block h-px w-full origin-left scale-x-0 bg-emerald transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
  );
}
