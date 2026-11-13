import Link from "next/link";
import type { Locale } from "@/i18n/types";
import { getDictionary } from "@/i18n/dictionaries";
import { PEOPLE, getProfile, type Person } from "@/content/people";
import { getArea } from "@/content/practice";
import { mattersFor } from "@/content/matters";
import { insightsBy } from "@/content/insights";
import { FIRM } from "@/content/firm";
import { PATHS, href } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Portrait } from "@/components/ui/Portrait";
import { Tag } from "@/components/ui/Tag";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { InsightMini, PersonCard } from "@/components/cards/Cards";
import { PageHeader } from "./PageHeader";
import { PeopleDirectory } from "./PeopleDirectory";

export function PeopleView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader locale={locale} trail={[{ label: t.peoplePage.title }]} title={t.peoplePage.title} intro={t.peoplePage.intro} />
      <PeopleDirectory />
    </>
  );
}

/** A lawyer's profile, per the visual design. */
export function ProfileView({ person, locale }: { person: Person; locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.profile;
  const profile = getProfile(person.id);
  const matters = mattersFor(person.id).slice(0, 4);
  const articles = insightsBy(person.id).slice(0, 4);
  const others = PEOPLE.filter((other) => other.id !== person.id).slice(0, 3);

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: p.admitted, value: person.admitted[locale] },
    { label: p.forums, value: person.forums[locale] },
    { label: p.languages, value: person.languages[locale] },
  ];
  const contact = [person.email, person.phone].filter(Boolean);
  if (contact.length) {
    facts.push({
      label: p.contact,
      value: (
        <>
          {person.email ? <a className="hover:text-mint" href={`mailto:${person.email}`}>{person.email}</a> : null}
          {person.email && person.phone ? " · " : null}
          {person.phone ? <a className="hover:text-mint" href={`tel:${person.phone.replace(/\s/g, "")}`}>{person.phone}</a> : null}
        </>
      ),
    });
  }

  return (
    <>
      <section className="surface-dark border-b border-line-dark bg-onyx pb-[clamp(48px,6vw,88px)] pt-[calc(var(--header-h)+clamp(32px,4vw,56px))]">
        <div className="shell grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4" data-reveal="image">
            <Portrait person={person} sizes="(min-width: 1024px) 30vw, 100vw" priority className="aspect-[4/5] border border-line-raised" />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Breadcrumbs locale={locale} trail={[{ label: t.peoplePage.title, href: PATHS.people[locale] }, { label: person.name }]} />
            <h1 className="type-display mt-7" data-reveal="lines">{person.name}</h1>
            <p className="eyebrow mt-5 text-mint" data-reveal="fade">{person.role[locale]}</p>
            <ul className="mt-6 flex flex-wrap gap-2" data-reveal="up">
              {person.practices.map((id) => (
                <li key={id}>
                  <Link href={href.area(id, locale)}>
                    <Tag className="transition-colors hover:border-mint">{getArea(id).tag[locale]}</Tag>
                  </Link>
                </li>
              ))}
            </ul>
            <dl className="mt-10 border-t border-line-dark">
              {facts.map((fact) => (
                <div key={fact.label} className="grid gap-1 border-b border-line-dark py-4 sm:grid-cols-[180px_1fr]" data-reveal="up">
                  <dt className="eyebrow pt-1 text-sage">{fact.label}</dt>
                  <dd className="text-[15.5px] text-bone">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-9 flex flex-wrap gap-3" data-reveal="up">
              {person.cv ? (
                <ButtonLink href={person.cv} variant="secondary" download data-transition="off">{p.cv}</ButtonLink>
              ) : null}
              <ButtonLink href={PATHS.contact[locale]} arrow>{p.getInTouch}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-dark bg-onyx section-y">
        <div className="shell grid gap-y-16 lg:grid-cols-12 lg:gap-x-6">
          <div className="space-y-[clamp(56px,6vw,80px)] lg:col-span-8">
            {profile ? (
              <div>
                <p className="eyebrow text-mint" data-reveal="fade">{p.biography}</p>
                <p className="mt-5 font-serif text-[clamp(21px,1.9vw,25px)] leading-[1.45] text-bone" data-reveal="lines">
                  {profile.bio[0][locale]}
                </p>
                <p className="type-lead mt-5 max-w-[64ch] text-sage" data-reveal="up">{profile.bio[1][locale]}</p>
              </div>
            ) : null}

            {matters.length > 0 ? (
              <div>
                <p className="eyebrow text-mint" data-reveal="fade">{p.matters}</p>
                <ul className="mt-6 border-t border-line-dark">
                  {matters.map((matter) => (
                    <li key={matter.id} className="border-b border-line-dark py-5" data-reveal="up">
                      <p className="eyebrow text-mint">
                        {matter.sector[locale]} · {matter.jurisdiction[locale]} · {matter.role[locale]}
                      </p>
                      <p className="type-card mt-2.5 font-normal text-bone">{matter.summary[locale]}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] text-sage/80">{FIRM.mattersDisclaimer?.[locale] ?? t.experience.disclaimer}</p>
              </div>
            ) : null}

            {profile?.education.length ? (
              <div>
                <p className="eyebrow text-mint" data-reveal="fade">{p.education}</p>
                <ul className="mt-6 border-t border-line-dark">
                  {profile.education.map((item) => (
                    <li key={item.text.en} className="grid grid-cols-[72px_1fr] gap-4 border-b border-line-dark py-4 text-[15.5px]" data-reveal="up">
                      <span className="tabular-nums text-mint">{item.year}</span>
                      <span className="text-bone">{item.text[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {profile?.publications.length ? (
              <div>
                <p className="eyebrow text-mint" data-reveal="fade">{p.publications}</p>
                <ul className="mt-5 space-y-3">
                  {profile.publications.map((item) => (
                    <li key={item.en} className="text-[15.5px] text-sage" data-reveal="up">{item[locale]}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {articles.length > 0 ? (
              <div>
                <p className="eyebrow text-mint" data-reveal="fade">{p.articles}</p>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {articles.map((entry) => (
                    <li key={entry.id} data-reveal="up">
                      <InsightMini entry={entry} locale={locale} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="space-y-10 lg:sticky lg:top-[calc(var(--header-h)+40px)]">
              <div data-reveal="up">
                <p className="eyebrow text-mint">{p.practiceAreas}</p>
                <ul className="mt-4 space-y-2">
                  {person.practices.map((id) => (
                    <li key={id}>
                      <Link href={href.area(id, locale)} className="text-[15px] leading-[1.45] text-sage transition-colors hover:text-bone">
                        {getArea(id).name[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {others.length > 0 ? (
                <div className="border-t border-line-dark pt-8" data-reveal="up">
                  <p className="eyebrow text-mint">{p.alsoInTeam}</p>
                  <ul className="mt-5 space-y-4">
                    {others.map((other) => (
                      <li key={other.id}>
                        <PersonCard person={other} locale={locale} size="small" />
                      </li>
                    ))}
                  </ul>
                  <TextLink href={PATHS.people[locale]} className="mt-6">{t.common.fullTeam}</TextLink>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
