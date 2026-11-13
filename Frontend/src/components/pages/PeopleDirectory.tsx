"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ensureGsap, EASE, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { PEOPLE } from "@/content/people";
import { AREAS, type PracticeAreaId } from "@/content/practice";
import { PATHS } from "@/lib/routes";
import { PersonCard } from "@/components/cards/Cards";
import { Arrow } from "@/components/ui/Arrow";

/** Filters switch on by themselves once the team reaches this size. */
const FILTERS_FROM = 5;

/**
 * The lawyers. At launch two profiles are shown large, with a third cell
 * inviting applications, so the page does not read as thin. The filter bar is
 * built and switches on as the team grows; no rebuild is needed.
 */
export function PeopleDirectory() {
  const { locale, t } = useLocale();
  const [area, setArea] = useState<PracticeAreaId | "">("");
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const first = useRef(true);

  const languages = useMemo(
    () => [...new Set(PEOPLE.flatMap((p) => p.languages[locale].split(/,\s*/)))].sort(),
    [locale],
  );
  const shown = PEOPLE.filter(
    (person) =>
      (!area || person.practices.includes(area)) &&
      (!role || person.seniority === role) &&
      (!language || person.languages[locale].split(/,\s*/).includes(language)),
  );
  const filters = PEOPLE.length >= FILTERS_FROM;
  const wide = PEOPLE.length > 3;

  // Cards rise in on arrival and again whenever the filters change.
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;
    const gsap = ensureGsap();
    gsap.set(list.children, { autoAlpha: 0, y: 30 });
    const play = () =>
      gsap.to(list.children, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, delay: first.current ? 0.3 : 0 });
    const cancel = whenRevealed(() => {
      play();
      first.current = false;
    });
    return cancel;
  }, [area, role, language]);

  const select = "min-h-11 appearance-none rounded-[2px] border border-line-raised bg-onyx px-4 pr-9 text-[14px] text-bone transition-colors hover:border-emerald";

  return (
    <>
      {filters ? (
        <div className="border-b border-line-dark">
          <div className="shell flex flex-wrap items-center gap-3 py-5">
            <span className="eyebrow mr-3 text-mint">{t.peoplePage.filter}</span>
            <select aria-label={t.peoplePage.allAreas} className={select} value={area} onChange={(e) => setArea(e.target.value as PracticeAreaId | "")}>
              <option value="">{t.peoplePage.allAreas}</option>
              {AREAS.map((a) => <option key={a.id} value={a.id}>{a.name[locale]}</option>)}
            </select>
            <select aria-label={t.peoplePage.allRoles} className={select} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">{t.peoplePage.allRoles}</option>
              {(["partner", "counsel", "associate"] as const).map((r) => <option key={r} value={r}>{t.peoplePage.seniority[r]}</option>)}
            </select>
            <select aria-label={t.peoplePage.allLanguages} className={select} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">{t.peoplePage.allLanguages}</option>
              {languages.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      ) : null}

      <section className="surface-dark bg-onyx section-y">
        <div className="shell">
          {shown.length === 0 ? (
            <div className="py-10">
              <p className="type-card text-bone">{t.peoplePage.none}</p>
              <button type="button" onClick={() => { setArea(""); setRole(""); setLanguage(""); }} className="mt-4 text-[14.5px] text-mint underline-offset-4 hover:underline">
                {t.peoplePage.reset}
              </button>
            </div>
          ) : (
            <ul ref={listRef} className={`grid gap-x-6 gap-y-16 sm:grid-cols-2 ${wide ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {shown.map((person) => (
                <li key={person.id}>
                  <PersonCard person={person} locale={locale} />
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {person.practices.map((id) => (
                      <li key={id} className="rounded-[2px] border border-line-raised px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage">
                        {AREAS.find((a) => a.id === id)!.tag[locale]}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {!wide ? (
                <li className="sm:col-span-2 lg:col-span-1">
                  <Link
                    href={PATHS.careers[locale]}
                    className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden border border-dashed border-line-raised p-8 transition-colors duration-500 hover:border-emerald lg:aspect-[4/5] lg:min-h-0"
                  >
                    <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-forest-deep transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                    <span className="relative font-serif text-[26px] leading-tight text-bone">{t.peoplePage.joinTitle}</span>
                    <span className="relative mt-3 max-w-[30ch] text-[15px] leading-[1.6] text-sage">{t.peoplePage.joinText}</span>
                    <span className="relative mt-6 inline-flex items-center gap-2.5 text-[14.5px] font-medium text-mint">
                      {t.nav.items[4].label}
                      <Arrow className="transition-transform duration-500 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
