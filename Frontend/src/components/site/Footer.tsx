"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { getLenis } from "@/lib/lenis";
import { FIRM, LEGAL_LINKS, SOCIAL_LINKS } from "@/components/contact/firm";
import { NAV } from "./nav";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const FOOTER_NAV = [...NAV, { label: "Our reach", href: "#reach" }];

/*
 * The wordmark geometry, measured from Source Serif 4: at 131.8 units
 * "54 Law Partners" is 1000 units wide, its tallest glyph rising 89.6 above
 * the baseline and its lowest falling 2.6 below. The view box holds the whole
 * word with a little room beneath it; the rise starts with the word hidden
 * below the bottom edge of that box.
 */
const WORDMARK = { size: 131.8, top: 4, ascent: 89.6, descent: 2.6, foot: 18 };
const BASELINE = WORDMARK.top + WORDMARK.ascent;
const VISIBLE = BASELINE + WORDMARK.descent + WORDMARK.foot;

/**
 * The footer: navigation in two columns, legal links, the practising notice,
 * social links if any, a back-to-top control, and the closing gesture — the
 * full wordmark rising into view from behind the bottom edge of the page.
 */
export function Footer() {
  const wordmarkRef = useRef<SVGSVGElement>(null);
  const riseRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const svg = wordmarkRef.current;
    const rise = riseRef.current;
    if (!svg || !rise) return;

    // Tied to the last stretch of scroll: fully risen exactly at the bottom.
    const tween = gsap.fromTo(
      rise,
      { y: VISIBLE },
      {
        y: 0,
        ease: "none",
        scrollTrigger: { trigger: svg, start: "top bottom", end: "bottom bottom", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0 });
    document.querySelector<HTMLElement>("#hero a")?.focus({ preventScroll: true });
  };

  return (
    <footer className="overflow-hidden border-t border-ivory/10 bg-ink text-ivory">
      <div className="grid gap-12 px-[clamp(1.5rem,5vw,7rem)] pb-16 pt-20 lg:grid-cols-12 lg:gap-x-6">
        <nav aria-label="Footer" className="lg:col-span-4">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] uppercase tracking-[0.16em]">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ivory/80 transition-colors duration-300 hover:text-ochre"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6 lg:col-span-5">
          <p className="max-w-[52ch] text-[13px] leading-[1.7] text-ivory-muted">{FIRM.practising}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.16em]">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-ivory/60 transition-colors duration-300 hover:text-ochre">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {SOCIAL_LINKS.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6 text-[12px] uppercase tracking-[0.16em]">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} rel="noopener noreferrer" target="_blank" className="text-ivory/80 hover:text-ochre">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex items-start lg:col-span-3 lg:justify-end">
          <button
            type="button"
            onClick={toTop}
            className="group flex items-center gap-4 text-[12px] uppercase tracking-[0.16em] text-ivory/80"
          >
            Back to top
            <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-ivory/30 transition-colors duration-500 group-hover:border-ochre">
              {/* The arrow leaves upward and a duplicate arrives from below. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 10 14"
                width="10"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className={`transition-transform duration-500 ${EASE_CLASS} group-hover:-translate-y-8`}
              >
                <path d="M5 13.5V1M1 5l4-4 4 4" />
              </svg>
              <svg
                aria-hidden="true"
                viewBox="0 0 10 14"
                width="10"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className={`absolute translate-y-8 text-ochre transition-transform duration-500 ${EASE_CLASS} group-hover:translate-y-0`}
              >
                <path d="M5 13.5V1M1 5l4-4 4 4" />
              </svg>
            </span>
          </button>
        </div>

        <p className="text-[12px] tracking-[0.08em] text-ivory/40 lg:col-span-12">
          {/* The year is baked in at build time and may differ from the
              visitor's clock on New Year's Day, so a mismatch is expected. */}
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {FIRM.name}
        </p>
      </div>

      {/* The closing gesture: a signature at the foot of the page. */}
      <svg
        ref={wordmarkRef}
        viewBox={`-8 0 1016 ${VISIBLE}`}
        role="img"
        aria-label={FIRM.name}
        className="block w-full"
      >
        <g ref={riseRef}>
          <text
            x="0"
            y={BASELINE}
            textLength="1000"
            lengthAdjust="spacing"
            fill="var(--color-ivory)"
            style={{ fontFamily: "var(--font-source-serif), serif", fontSize: WORDMARK.size }}
          >
            {FIRM.name}
          </text>
        </g>
      </svg>
    </footer>
  );
}
