"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const noop = () => () => {};
import { ensureGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { scrollToTarget } from "@/lib/lenis";
import { useLocale } from "@/i18n/useLocale";

/** An emerald line beneath the header measuring the reader's progress. */
export function ReadingProgress({ target }: { target: string }) {
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    const article = document.getElementById(target);
    if (!bar || !article) return;
    const gsap = ensureGsap();
    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { trigger: article, start: "top 30%", end: "bottom 70%", scrub: prefersReducedMotion() ? true : 0.3 } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target]);
  return (
    <span aria-hidden="true" className="fixed inset-x-0 top-[var(--header-h)] z-40 block h-[2px]">
      <span ref={barRef} className="block h-full origin-left scale-x-0 bg-emerald" />
    </span>
  );
}

/** Contents, highlighting the section being read. */
export function Contents({ items }: { items: { id: string; text: string }[] }) {
  const { t } = useLocale();
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    ensureGsap();
    const triggers = items.map((item) => {
      const heading = document.getElementById(item.id);
      if (!heading) return null;
      return ScrollTrigger.create({
        trigger: heading,
        start: "top 45%",
        endTrigger: "#article-body",
        end: "bottom top",
        onToggle: (self) => self.isActive && setActive(item.id),
        onLeaveBack: () => {
          const index = items.findIndex((i) => i.id === item.id);
          if (index > 0) setActive(items[index - 1].id);
        },
      });
    });
    return () => triggers.forEach((trigger) => trigger?.kill());
  }, [items]);

  return (
    <nav aria-label={t.article.contents}>
      <p className="eyebrow text-forest">{t.article.contents}</p>
      <ul className="mt-5 space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                const heading = document.getElementById(item.id);
                if (!heading) return;
                event.preventDefault();
                scrollToTarget(heading, -110);
              }}
              aria-current={active === item.id ? "location" : undefined}
              className={`relative block py-1.5 pl-4 text-[14px] leading-[1.45] transition-colors duration-300 ${
                active === item.id ? "text-onyx" : "text-muted hover:text-onyx"
              }`}
            >
              <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px bg-line-light" />
              <span
                aria-hidden="true"
                className={`absolute inset-y-1 left-0 w-[2px] origin-top bg-forest transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${active === item.id ? "scale-y-100" : "scale-y-0"}`}
              />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Share on LinkedIn, by email, or copy the link. */
export function Share({ title }: { title: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const url = useSyncExternalStore(
    noop,
    () => window.location.href,
    () => "",
  );

  const box = "flex size-10 items-center justify-center rounded-[2px] border border-onyx/20 text-onyx transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-bone";
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow mr-2 text-muted">{t.article.share}</span>
      <a className={box} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label={t.article.shareLinkedIn}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22zM8.02 8h4.37v1.92h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 7v7.45h-4.56v-6.6c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.53 1.71-2.53 3.48v6.72H8.02z" />
        </svg>
      </a>
      <a className={box} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} aria-label={t.article.shareEmail}>
        <svg aria-hidden="true" viewBox="0 0 16 12" width="15" height="11" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="0.6" y="0.6" width="14.8" height="10.8" />
          <path d="m1 1 7 5.5L15 1" />
        </svg>
      </a>
      <button
        type="button"
        className={box}
        aria-label={copied ? t.article.copied : t.article.copy}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            // Clipboard unavailable; the address bar still has the link.
          }
        }}
      >
        {copied ? (
          <svg aria-hidden="true" viewBox="0 0 14 10" width="13" height="10" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m1 5 4 4 8-8" /></svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6.5 9.5 9.5 6.5M7 4l1.5-1.5a3 3 0 0 1 4.2 4.2L11 8.4M9 12l-1.5 1.5a3 3 0 0 1-4.2-4.2L5 7.6" />
          </svg>
        )}
      </button>
      <span role="status" className="sr-only">{copied ? t.article.copied : ""}</span>
    </div>
  );
}
