"use client";

import { usePathname } from "next/navigation";
import { LOCALES } from "./types";
import { useLocale } from "./useLocale";
import { translatePath } from "@/lib/routes";

/**
 * EN / FR. Each is a real link to the same page in that language, so the
 * visitor stays where they are (site map) and search engines can follow it.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, t } = useLocale();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t.language.label} className={`flex items-center gap-3 ${className}`}>
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <a
            key={code}
            href={active ? pathname : translatePath(pathname, locale, code)}
            hrefLang={code}
            lang={code}
            aria-label={t.language.names[code]}
            aria-current={active ? "true" : undefined}
            className={`relative py-1 text-[12px] font-semibold tracking-[0.12em] transition-colors duration-300 ${
              active ? "text-[var(--strong)]" : "text-[var(--muted-text)] hover:text-[var(--strong)]"
            }`}
          >
            {code.toUpperCase()}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-mint transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </a>
        );
      })}
    </div>
  );
}
