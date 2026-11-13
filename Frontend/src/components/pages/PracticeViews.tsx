import Link from "next/link";
import type { Locale } from "@/i18n/types";
import { getDictionary } from "@/i18n/dictionaries";
import { PILLARS, areasInPillar, areaNumber, getPillar, type PracticeArea } from "@/content/practice";
import { peopleInArea } from "@/content/people";
import { mattersInArea } from "@/content/matters";
import { insightsInArea } from "@/content/insights";
import { FIRM } from "@/content/firm";
import { PATHS, href } from "@/lib/routes";
import { Arrow } from "@/components/ui/Arrow";
import { ButtonLink } from "@/components/ui/Button";
import { MatterCard, InsightMini, PersonCard } from "@/components/cards/Cards";
import { PageHeader } from "./PageHeader";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/** All eight areas under their three pillars, each card linking to its page. */
export function PracticeOverview({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader locale={locale} trail={[{ label: t.practicePage.title }]} title={t.practicePage.title} intro={t.practicePage.intro} />
      <section className="surface-dark bg-onyx section-y">
        <div className="shell space-y-[clamp(56px,7vw,96px)]">
          {PILLARS.map((pillar) => {
            const areas = areasInPillar(pillar.id);
            const fillers = (3 - (areas.length % 3)) % 3;
            return (
              <div key={pillar.id}>
                <div className="flex items-center gap-5" data-reveal="fade">
                  <p className="eyebrow shrink-0 text-mint">
                    {t.practiceIndex.pillar} {pillar.numeral} · {pillar.name[locale]}
                  </p>
                  <span data-reveal="rule" className="block h-px flex-1 bg-line-dark" />
                </div>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {areas.map((area) => (
                    <li key={area.id} data-reveal="up">
                      <AreaCard area={area} locale={locale} />
                    </li>
                  ))}
                  {/* Empty cells keep the grid even (wireframe). */}
                  {Array.from({ length: fillers }, (_, i) => (
                    <li key={`gap-${i}`} aria-hidden="true" className="hidden border border-dashed border-line-dark lg:block" />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function AreaCard({ area, locale }: { area: PracticeArea; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Link
      href={href.area(area.id, locale)}
      data-cursor={t.practicePage.explore}
      className="group relative flex h-full min-h-[260px] flex-col overflow-hidden border border-line-raised p-7"
    >
      {/* The area's photograph rises behind the card on hover. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-cover bg-center opacity-0 saturate-[0.6] transition-[opacity,transform] duration-[900ms] ${EASE_CLASS} scale-110 group-hover:scale-100 group-hover:opacity-100`}
        style={{ backgroundImage: `url(${area.image})` }}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_14_12/0.6),rgb(12_43_31/0.92))] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-mint transition-transform duration-700 ${EASE_CLASS} group-hover:scale-x-100`} />
      <span className="relative text-[12px] tabular-nums text-mint">{areaNumber(area.id)}</span>
      <span className="type-card relative mt-5 font-normal text-bone">{area.name[locale]}</span>
      {area.note ? (
        <span className="relative mt-3 text-[13.5px] leading-[1.55] text-sage">{area.note[locale]}</span>
      ) : (
        <span className="relative mt-3 line-clamp-3 text-[14.5px] leading-[1.6] text-sage">{area.intro[locale]}</span>
      )}
      <span className="relative mt-auto flex items-center gap-2.5 pt-8 text-[14px] font-medium text-mint">
        {t.practicePage.explore}
        <Arrow className={`transition-transform duration-500 ${EASE_CLASS} group-hover:translate-x-1.5`} />
      </span>
    </Link>
  );
}

/** A practice area page, per the visual design. */
export function AreaView({ area, locale }: { area: PracticeArea; locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.areaPage;
  const pillar = getPillar(area.pillar);
  const lawyers = peopleInArea(area.id);
  const matters = mattersInArea(area.id).slice(0, 3);
  const related = insightsInArea(area.id).slice(0, 2);
  const siblings = areasInPillar(area.pillar).filter((other) => other.id !== area.id);

  return (
    <>
      <PageHeader
        locale={locale}
        trail={[{ label: t.practicePage.title, href: PATHS.practice[locale] }, { label: area.name[locale] }]}
        eyebrow={`${t.practiceIndex.pillar} ${pillar.numeral} · ${pillar.name[locale]}`}
        title={area.name[locale]}
        intro={
          <>
            <p>{area.intro[locale]}</p>
            {area.note ? <p className="mt-4 border-l-2 border-emerald pl-4 text-[15px] text-bone/80">{area.note[locale]}</p> : null}
          </>
        }
        image={{ src: area.image, alt: `${p.imageAlt} ${area.name[locale]}` }}
      />

      <section className="surface-dark bg-onyx section-y">
        <div className="shell grid gap-y-16 lg:grid-cols-12 lg:gap-x-6">
          <div className="space-y-[clamp(56px,6vw,80px)] lg:col-span-8">
            <div>
              <p className="eyebrow text-mint" data-reveal="fade">{p.overview}</p>
              <p className="mt-5 font-serif text-[clamp(21px,1.9vw,25px)] leading-[1.45] text-bone" data-reveal="lines">
                {area.overview[0][locale]}
              </p>
              <p className="type-lead mt-5 max-w-[64ch] text-sage" data-reveal="up">{area.overview[1][locale]}</p>
            </div>

            <div>
              <p className="eyebrow text-mint" data-reveal="fade">{p.clients}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {area.clients.map((client) => (
                  <li
                    key={client.en}
                    data-reveal="up"
                    className="border border-line-raised px-5 py-4 text-[15.5px] text-bone transition-colors duration-500 hover:border-emerald hover:bg-forest-deep"
                  >
                    {client[locale]}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-mint" data-reveal="fade">{p.services}</p>
              <ul className="mt-6 border-t border-line-dark">
                {area.services.map((service) => (
                  <li key={service.en} data-reveal="up" className="group flex items-baseline gap-5 border-b border-line-dark py-4 text-[16px] text-bone">
                    <span aria-hidden="true" className={`block h-px w-4 shrink-0 translate-y-[-4px] bg-emerald transition-[width] duration-500 ${EASE_CLASS} group-hover:w-8`} />
                    {service[locale]}
                  </li>
                ))}
              </ul>
            </div>

            {matters.length > 0 ? (
              <div>
                <p className="eyebrow text-mint" data-reveal="fade">{p.matters}</p>
                <ul className="mt-6 space-y-3">
                  {matters.map((matter) => (
                    <li key={matter.id} data-reveal="up">
                      <MatterCard matter={matter} locale={locale} layout="row" />
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] text-sage/80" data-reveal="fade">
                  {FIRM.mattersDisclaimer?.[locale] ?? t.experience.disclaimer}
                </p>
              </div>
            ) : null}

            {related.length > 0 ? (
              <div>
                <p className="eyebrow text-mint" data-reveal="fade">{p.insights}</p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {related.map((entry) => (
                    <li key={entry.id} data-reveal="up">
                      <InsightMini entry={entry} locale={locale} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Sidebar, sticky on scroll (wireframe). */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-10 lg:sticky lg:top-[calc(var(--header-h)+40px)]">
              {lawyers.length > 0 ? (
                <div data-reveal="up">
                  <p className="eyebrow text-mint">{p.lawyers}</p>
                  <ul className="mt-5 space-y-4">
                    {lawyers.map((person) => (
                      <li key={person.id}>
                        <PersonCard person={person} locale={locale} size="small" />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="border-t border-line-dark pt-8" data-reveal="up">
                <p className="eyebrow text-mint">{p.alsoInPillar}</p>
                <ul className="mt-4 space-y-1">
                  {siblings.map((other) => (
                    <li key={other.id}>
                      <Link href={href.area(other.id, locale)} className="group flex items-start justify-between gap-4 py-1.5 text-[15px] leading-[1.45] text-sage transition-colors duration-300 hover:text-bone">
                        {other.name[locale]}
                        <Arrow className={`mt-1.5 shrink-0 opacity-0 transition-[opacity,transform] duration-500 ${EASE_CLASS} -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-line-raised bg-forest p-7" data-reveal="up">
                <p className="font-serif text-[22px] leading-tight text-bone">{area.cta[locale]}</p>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-sage">{p.respond}</p>
                <ButtonLink href={PATHS.contact[locale]} className="mt-6 w-full">{t.nav.speak}</ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
