"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ensureGsap, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import type { Insight } from "@/content/insights";
import { InsightCard } from "@/components/cards/Cards";

/**
 * Recent insights: the three latest entries in a grid, rising in together as
 * the section arrives.
 */
export function InsightsRail({ entries, head }: { entries: Insight[]; head: ReactNode }) {
  const { locale } = useLocale();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const list = listRef.current;
    if (!list) return;

    let ctx: gsap.Context | null = null;
    const cancel = whenRevealed(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          list.querySelectorAll("[data-card]"),
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, scrollTrigger: { trigger: list, start: "top 88%", once: true } },
        );
      }, list);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <div className="py-[var(--pad-y)]">
      <div className="shell">
        {head}
        <ul ref={listRef} className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {entries.slice(0, 3).map((entry, index) => (
            <li key={entry.id} data-card className={index === 2 ? "sm:hidden lg:block" : ""}>
              <InsightCard entry={entry} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
