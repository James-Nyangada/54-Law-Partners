"use client";

import { LOCALES } from "./types";
import { useLocale } from "./useLocale";

/**
 * EN / FR. The active language is mint; the other is sage and brightens on
 * hover. Each button declares its own language for screen readers.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, t, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={`flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] ${className}`}
    >
      {LOCALES.map((code, index) => (
        <span key={code} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="text-sage/50">
              /
            </span>
          ) : null}
          <button
            type="button"
            lang={code}
            aria-label={t.language.names[code]}
            aria-pressed={locale === code}
            onClick={() => setLocale(code)}
            className={`py-1 transition-colors duration-300 ${
              locale === code ? "text-mint" : "text-sage hover:text-bone"
            }`}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
