"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ensureGsap, ScrollTrigger, EASE, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { getLenis } from "@/lib/lenis";
import { useLocale } from "@/i18n/useLocale";
import { LanguageToggle } from "@/i18n/LanguageToggle";
import { PATHS, sectionOf, type PageKey } from "@/lib/routes";
import { buttonClass } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

/**
 * The header, per the visual design: wordmark, five sections, EN / FR and
 * "Speak to us". It steps out of the way while the visitor reads down a page
 * and returns the moment they scroll back up.
 */
export function SiteHeader() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const active = sectionOf(pathname, locale);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const wasOpen = useRef(false);

  // Entrance once the page is visible, then hide on the way down.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const gsap = ensureGsap();
    if (prefersReducedMotion()) return;

    const items = header.querySelectorAll("[data-header-item]");
    gsap.set(items, { autoAlpha: 0, y: -12 });
    const cancel = whenRevealed(() =>
      gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.05, delay: 0.25 }),
    );

    let hidden = false;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const shouldHide = self.direction === 1 && y > 240;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          gsap.to(header, { yPercent: hidden ? -100 : 0, duration: hidden ? 0.5 : 0.7, ease: EASE, overwrite: true });
        }
        header.dataset.scrolled = y > 8 ? "true" : "false";
      },
    });
    return () => {
      cancel();
      trigger.kill();
    };
  }, []);

  // A new page closes the menu…
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // …and always starts with the header in view.
  useEffect(() => {
    const header = headerRef.current;
    if (header) ensureGsap().to(header, { yPercent: 0, duration: 0.4, overwrite: true });
  }, [pathname]);

  // While the menu is open the page behind is still and unreachable.
  useEffect(() => {
    const behind = document.querySelectorAll<HTMLElement>("#main, #site-footer");
    if (menuOpen) {
      wasOpen.current = true;
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
      behind.forEach((el) => (el.inert = true));
      const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    getLenis()?.start();
    document.documentElement.style.overflow = "";
    behind.forEach((el) => (el.inert = false));
    if (wasOpen.current) {
      wasOpen.current = false;
      menuButtonRef.current?.focus({ preventScroll: true });
    }
  }, [menuOpen]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = () => wide.matches && setMenuOpen(false);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-mint focus:px-4 focus:py-3 focus:text-onyx"
      >
        {t.nav.skip}
      </a>
      <header
        ref={headerRef}
        data-scrolled="false"
        className="surface-dark fixed inset-x-0 top-0 z-50 border-b border-line-dark bg-onyx/95 backdrop-blur-md transition-[background-color] duration-500 data-[scrolled=true]:bg-onyx/85"
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-8">
          <Link
            href={PATHS.home[locale]}
            data-header-item
            className="font-serif text-[21px] leading-none tracking-[-0.01em] text-bone"
          >
            54 Law Partners
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            <nav aria-label={t.nav.primary}>
              <ul className="flex items-center gap-8">
                {t.nav.items.map((item) => {
                  const key = item.key as PageKey;
                  const current = active === key;
                  return (
                    <li key={key} data-header-item>
                      <Link
                        href={PATHS[key][locale]}
                        aria-current={current ? "page" : undefined}
                        className="group relative flex h-[var(--header-h)] items-center text-[14.5px]"
                      >
                        <span className="relative block overflow-hidden">
                          <span
                            className={`block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full ${current ? "text-bone" : "text-sage"}`}
                          >
                            {item.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 block translate-y-full text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                          >
                            {item.label}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-emerald transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div data-header-item className="flex items-center gap-9">
              <span aria-hidden="true" className="h-5 w-px bg-line-raised" />
              <LanguageToggle className="-ml-3" />
            </div>
            <div data-header-item>
              <Link href={PATHS.contact[locale]} className={buttonClass("primary", "min-h-10 px-5 text-[14px]")}>
                {t.nav.speak}
              </Link>
            </div>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            data-header-item
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex min-h-11 items-center gap-3 text-[14px] text-bone lg:hidden"
          >
            <span className="grid overflow-hidden">
              <span className={`[grid-area:1/1] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "-translate-y-full" : ""}`}>
                {t.nav.menu}
              </span>
              <span
                aria-hidden="true"
                className={`[grid-area:1/1] text-mint transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "translate-y-0" : "translate-y-full"}`}
              >
                {t.nav.close}
              </span>
            </span>
            <span aria-hidden="true" className="relative block h-2.5 w-6">
              <span className={`absolute left-0 top-1/2 block h-px w-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute left-0 top-1/2 block h-px w-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "-rotate-45" : "translate-y-[4px]"}`} />
            </span>
            <span className="sr-only">{menuOpen ? t.nav.closeMenu : t.nav.openMenu}</span>
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} active={active} />
    </>
  );
}
