import type { Locale } from "./types";
import { en } from "./en";
import { fr } from "./fr";

const DICTIONARIES = { en, fr };

export function getDictionary(locale: Locale) {
  return DICTIONARIES[locale];
}

/** "4 November 2026" / "4 novembre 2026". */
export function formatDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${getDictionary(locale).common.months[month - 1]} ${year}`;
}
