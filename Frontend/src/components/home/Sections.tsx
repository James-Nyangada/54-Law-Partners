import Link from "next/link";
import type { Locale } from "@/i18n/types";
import { getDictionary } from "@/i18n/dictionaries";
import { getMatters } from "@/content/matters";
import { PEOPLE } from "@/content/people";
import { getInsights } from "@/content/insights";
import { FIRM } from "@/content/firm";
import { PATHS } from "@/lib/routes";
import { MatterCard, PersonCard } from "@/components/cards/Cards";
import { TextLink } from "@/components/ui/TextLink";
import { Arrow } from "@/components/ui/Arrow";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { InsightsRail } from "./InsightsRail";

/** A section heading row: eyebrow and title on the left, a note on the right. */
export function SectionHead({
  eyebrow,
  title,
  aside,
  action,
}: {
  eyebrow: string;
  title: string;
  aside?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
      <div className="lg:col-span-7">
        <p className="eyebrow text-[var(--accent)]" data-reveal="fade">{eyebrow}</p>
        <h2 className="type-section mt-5" data-reveal="lines">{title}</h2>
      </div>
      {aside ? (
        <p className="max-w-[46ch] text-[15.5px] leading-[1.6] text-[var(--muted-text)] lg:col-span-5 lg:col-start-8 lg:pb-1.5" data-reveal="up">
          {aside}
        </p>
      ) : null}
      {action ? <div className="lg:col-span-5 lg:col-start-8 lg:justify-self-end" data-reveal="up">{action}</div> : null}
    </div>
  );
}

export function Experience({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const matters = getMatters().slice(0, 6);
  if (matters.length === 0) return null;
  return (
    <section className="surface-dark bg-forest section-y">
      <div className="shell">
        <SectionHead eyebrow={t.experience.eyebrow} title={t.experience.title} aside={t.experience.support} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matters.map((matter) => (
            <li key={matter.id} data-reveal="up">
              <MatterCard matter={matter} locale={locale} />
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-[70ch] text-[13px] leading-[1.6] text-sage" data-reveal="fade">
          {FIRM.mattersDisclaimer?.[locale] ?? t.experience.disclaimer}
        </p>
      </div>
    </section>
  );
}

export function PeopleTeaser({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="surface-dark bg-onyx section-y">
      <div className="shell">
        <SectionHead eyebrow={t.peopleTeaser.eyebrow} title={t.peopleTeaser.title} aside={t.peopleTeaser.support} />
        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {PEOPLE.slice(0, 3).map((person) => (
            <li key={person.id} data-reveal="up">
              <PersonCard person={person} locale={locale} />
            </li>
          ))}
          {PEOPLE.length < 3 ? (
            <li data-reveal="up" className="sm:col-span-2 lg:col-span-1">
              <Link
                href={PATHS.careers[locale]}
                className="group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden border border-dashed border-line-raised p-8 transition-colors duration-500 hover:border-emerald lg:aspect-[4/5] lg:min-h-0"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-forest-deep transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="relative font-serif text-[26px] leading-tight text-bone">{t.peopleTeaser.joinTitle}</span>
                <span className="relative mt-3 max-w-[30ch] text-[15px] leading-[1.6] text-sage">{t.peopleTeaser.joinText}</span>
                <span className="relative mt-6 inline-flex items-center gap-2.5 text-[14.5px] font-medium text-mint">
                  {t.peopleTeaser.joinLink}
                  <Arrow className="transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
              </Link>
            </li>
          ) : null}
        </ul>
        <div className="mt-12" data-reveal="fade">
          <TextLink href={PATHS.people[locale]}>{t.common.fullTeam}</TextLink>
        </div>
      </div>
    </section>
  );
}

export function InsightsTeaser({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const entries = getInsights().slice(0, 3);
  if (entries.length === 0) return null;
  return (
    <section className="surface-light bg-bone text-onyx">
      <InsightsRail
        entries={entries}
        head={
          <SectionHead
            eyebrow={t.insightsTeaser.eyebrow}
            title={t.insightsTeaser.title}
            action={<TextLink href={PATHS.insights[locale]}>{t.common.allInsights}</TextLink>}
          />
        }
      />
    </section>
  );
}

export function ContactSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section id="contact" className="surface-dark border-t border-line-dark bg-onyx section-y">
      <div className="shell grid gap-y-14 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          <h2 className="type-display" data-reveal="lines">
            {t.contactBlock.title[0]} {t.contactBlock.title[1]}
          </h2>
          <div className="mt-12" data-reveal="up">
            <EnquiryForm />
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-[clamp(80px,9vw,140px)]">
          <ContactDetails locale={locale} />
        </div>
      </div>
    </section>
  );
}

/** The office details. Only what the firm has confirmed is shown. */
export function ContactDetails({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: t.details.address,
      value: (
        <>
          {FIRM.street ? <span className="block">{FIRM.street[locale]}</span> : null}
          <span className="block">{FIRM.city[locale]}</span>
        </>
      ),
    },
  ];
  if (FIRM.phone) rows.push({ label: t.details.phone, value: <a href={FIRM.phone.href} className="hover:text-mint">{FIRM.phone.display}</a> });
  if (FIRM.email) rows.push({ label: t.details.email, value: <a href={`mailto:${FIRM.email}`} className="hover:text-mint">{FIRM.email}</a> });
  if (FIRM.hours) rows.push({ label: t.details.hours, value: FIRM.hours[locale] });

  return (
    <dl className="border-t border-line-dark">
      {rows.map((row) => (
        <div key={row.label} className="border-b border-line-dark py-5" data-reveal="up">
          <dt className="eyebrow text-mint">{row.label}</dt>
          <dd className="mt-2 text-[15.5px] text-bone">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
