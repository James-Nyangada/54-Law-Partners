import type { Locale } from "@/i18n/types";
import { AREAS, getArea, type PracticeAreaId } from "@/content/practice";
import { PEOPLE } from "@/content/people";
import { getArticles, type Insight } from "@/content/insights";
import { LEGAL_DOCS, getLegalById, type LegalId } from "@/content/legal";

/**
 * Every address on the site, in both languages (Site Map v1.0).
 *
 * English lives at the root; French mirrors it under /fr with French slugs, so
 * each French page is a real page that search engines can index.
 */
export const PATHS = {
  home: { en: "/", fr: "/fr" },
  about: { en: "/about", fr: "/fr/a-propos" },
  practice: { en: "/practice-areas", fr: "/fr/domaines-de-competence" },
  people: { en: "/people", fr: "/fr/equipe" },
  insights: { en: "/insights", fr: "/fr/analyses" },
  careers: { en: "/careers", fr: "/fr/carrieres" },
  apply: { en: "/careers/apply", fr: "/fr/carrieres/postuler" },
  contact: { en: "/contact", fr: "/fr/contact" },
  received: { en: "/contact/received", fr: "/fr/contact/demande-recue" },
  legal: { en: "/legal", fr: "/fr/mentions-legales" },
} satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof PATHS;

export const href = {
  page: (key: PageKey, locale: Locale) => PATHS[key][locale],
  area: (id: PracticeAreaId, locale: Locale) => `${PATHS.practice[locale]}/${getArea(id).slug[locale]}`,
  person: (slug: string, locale: Locale) => `${PATHS.people[locale]}/${slug}`,
  article: (entry: Insight, locale: Locale) => `${PATHS.insights[locale]}/${entry.slug[locale]}`,
  insightsArea: (id: PracticeAreaId, locale: Locale) =>
    `${PATHS.insights[locale]}/${locale === "fr" ? "domaine" : "area"}/${getArea(id).slug[locale]}`,
  legal: (id: LegalId, locale: Locale) => `${PATHS.legal[locale]}/${getLegalById(id).slug[locale]}`,
};

/** Every page as an { en, fr } pair: for the language toggle and the sitemap. */
export function allRoutes(): Record<Locale, string>[] {
  const pair = (fn: (locale: Locale) => string) => ({ en: fn("en"), fr: fn("fr") });
  return [
    ...Object.values(PATHS),
    ...AREAS.map((area) => pair((l) => href.area(area.id, l))),
    ...AREAS.map((area) => pair((l) => href.insightsArea(area.id, l))),
    ...PEOPLE.map((person) => pair((l) => href.person(person.slug, l))),
    ...getArticles().map((entry) => pair((l) => href.article(entry, l))),
    ...LEGAL_DOCS.map((doc) => pair((l) => href.legal(doc.id, l))),
  ];
}

/** The same page in the other language, or that language's home page. */
export function translatePath(pathname: string, from: Locale, to: Locale): string {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const match = allRoutes().find((route) => route[from] === clean);
  return match ? match[to] : PATHS.home[to];
}

/** Which top-level section a path belongs to, for the active nav state. */
export function sectionOf(pathname: string, locale: Locale): PageKey | null {
  const keys: PageKey[] = ["about", "practice", "people", "insights", "careers", "contact", "legal"];
  return keys.find((key) => pathname === PATHS[key][locale] || pathname.startsWith(PATHS[key][locale] + "/")) ?? null;
}
