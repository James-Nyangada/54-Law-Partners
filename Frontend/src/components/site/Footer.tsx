"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { getLenis } from "@/lib/lenis";
import { useLocale } from "@/i18n/useLocale";
import { LanguageToggle } from "@/i18n/LanguageToggle";
import { FIRM } from "@/content/firm";
import { LEGAL_DOCS } from "@/content/legal";
import { PATHS, href } from "@/lib/routes";

/*
 * The wordmark geometry, measured from Source Serif 4: at 131.8 units
 * "54 Law Partners" is 1000 units wide, rising 89.6 above the baseline.
 */
const MARK = { size: 131.8, top: 4, ascent: 89.6, descent: 2.6, foot: 10 };
const BASELINE = MARK.top + MARK.ascent;
const VISIBLE = BASELINE + MARK.descent + MARK.foot;

/**
 * Four columns (firm, practice, legal, practising details), then the closing
 * gesture: the wordmark in outline, rising from behind the bottom edge as the
 * visitor reaches the end of the page, its stroke drawing as it comes.
 */
export function Footer() {
  const { locale, t } = useLocale();
  const svgRef = useRef<SVGSVGElement>(null);
  const riseRef = useRef<SVGGElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const svg = svgRef.current;
    const rise = riseRef.current;
    const cols = colsRef.current;
    if (!svg || !rise || !cols) return;

    let ctx: gsap.Context | null = null;
    const cancel = whenRevealed(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          rise,
          { y: VISIBLE * 0.9 },
          { y: 0, ease: "none", scrollTrigger: { trigger: svg, start: "top bottom", end: "bottom bottom", scrub: 0.6 } },
        );
        gsap.fromTo(
          cols.querySelectorAll("[data-col]"),
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            scrollTrigger: { trigger: cols, start: "top 92%", once: true },
          },
        );
      });
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0 });
  };

  const linkClass = "text-[14.5px] text-sage transition-colors duration-300 hover:text-bone";

  return (
    <footer id="site-footer" className="surface-dark overflow-hidden border-t border-line-dark bg-onyx text-bone">
      <div ref={colsRef} className="shell grid gap-x-8 gap-y-12 pb-14 pt-[clamp(56px,7vw,96px)] sm:grid-cols-2 lg:grid-cols-4">
        <div data-col>
          <p className="eyebrow text-mint">{t.footer.firm}</p>
          <ul className="mt-5 space-y-3">
            <li><Link className={linkClass} href={PATHS.about[locale]}>{t.footer.aboutUs}</Link></li>
            <li><Link className={linkClass} href={PATHS.people[locale]}>{t.nav.items[2].label}</Link></li>
            <li><Link className={linkClass} href={PATHS.careers[locale]}>{t.nav.items[4].label}</Link></li>
          </ul>
        </div>
        <div data-col>
          <p className="eyebrow text-mint">{t.footer.practice}</p>
          <ul className="mt-5 space-y-3">
            <li><Link className={linkClass} href={PATHS.practice[locale]}>{t.footer.allAreas}</Link></li>
            <li><Link className={linkClass} href={PATHS.insights[locale]}>{t.nav.items[3].label}</Link></li>
            <li><Link className={linkClass} href={PATHS.contact[locale]}>{t.footer.contactUs}</Link></li>
          </ul>
        </div>
        <div data-col>
          <p className="eyebrow text-mint">{t.footer.legal}</p>
          <ul className="mt-5 space-y-3">
            {LEGAL_DOCS.map((doc) => (
              <li key={doc.id}>
                <Link className={linkClass} href={href.legal(doc.id, locale)}>
                  {doc.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-col className="flex flex-col gap-6">
          <div>
            <p className="eyebrow text-mint">{t.footer.practising}</p>
            <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-sage">
              {FIRM.practising?.[locale] ?? t.footer.practisingDefault}
            </p>
          </div>
          <LanguageToggle />
          {FIRM.social.length > 0 ? (
            <ul className="flex gap-5">
              {FIRM.social.map((link) => (
                <li key={link.href}>
                  <a className={linkClass} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-line-dark py-6 text-[13px] text-sage">
        <p>
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {FIRM.name}. {t.footer.rights}
        </p>
        <p>
          {t.footer.builtBy}{" "}
          <a
            href="https://jam3s.netlify.app/"
            target="_blank"
            rel="noopener"
            className="font-medium text-mint underline decoration-mint/40 underline-offset-4 transition-colors duration-300 hover:text-bone hover:decoration-bone"
          >
            James.dev
          </a>
        </p>
        <button type="button" onClick={toTop} className="group flex min-h-11 items-center gap-3 transition-colors duration-300 hover:text-bone">
          {t.footer.top}
          <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-[2px] border border-line-raised transition-colors duration-500 group-hover:border-emerald">
            <svg aria-hidden="true" viewBox="0 0 10 14" width="9" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-7">
              <path d="M5 13.5V1M1 5l4-4 4 4" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 10 14" width="9" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" className="absolute translate-y-7 text-mint transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
              <path d="M5 13.5V1M1 5l4-4 4 4" />
            </svg>
          </span>
        </button>
      </div>

      <svg ref={svgRef} viewBox={`-8 0 1016 ${VISIBLE}`} role="img" aria-label={FIRM.name} className="block w-full">
        <g ref={riseRef}>
          <text
            x="0"
            y={BASELINE}
            textLength="1000"
            lengthAdjust="spacing"
            fill="none"
            stroke="var(--color-emerald)"
            strokeWidth="0.6"
            style={{ fontFamily: "var(--font-source-serif), serif", fontSize: MARK.size }}
          >
            {FIRM.name}
          </text>
        </g>
      </svg>
    </footer>
  );
}
