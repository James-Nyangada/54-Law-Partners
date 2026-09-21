export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

/** A piece of content written in both languages. */
export type Localized = Record<Locale, string>;

/** Picks the right language from a localized value. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale];
}
