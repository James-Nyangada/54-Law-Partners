import Link from "next/link";
import { Suspense } from "react";
import type { Locale } from "@/i18n/types";
import { getDictionary, formatDate } from "@/i18n/dictionaries";
import { getOpenings } from "@/content/careers";
import { LEGAL_DOCS, LEGAL_UPDATED, type LegalDoc } from "@/content/legal";
import { NAIROBI_COORDS } from "@/content/firm";
import { PATHS, href } from "@/lib/routes";
import { ButtonLink } from "@/components/ui/Button";
import { Arrow } from "@/components/ui/Arrow";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { ContactDetails } from "@/components/home/Sections";
import { AFRICA_PATH, NAIROBI } from "@/components/home/geo";
import { PageHeader } from "./PageHeader";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function CareersView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.careers;
  const openings = getOpenings();
  return (
    <>
      <PageHeader
        locale={locale}
        trail={[{ label: c.title }]}
        eyebrow={c.title}
        title={c.headline.join(" ")}
        intro={c.intro}
        image={{ src: "/images/meeting-room.jpg", alt: c.imageAlt }}
      />

      <section className="surface-dark bg-onyx section-y">
        <div className="shell">
          <p className="eyebrow text-mint" data-reveal="fade">{c.lookFor.eyebrow}</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {c.lookFor.items.map((item, index) => (
              <li key={item.title} data-reveal="up" className="border border-line-raised p-7 transition-colors duration-500 hover:border-emerald hover:bg-forest-deep">
                <span className="text-[12px] tabular-nums text-mint">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="type-card mt-5 text-bone">{item.title}</h2>
                <p className="mt-3 text-[15px] leading-[1.65] text-sage">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-dark border-t border-line-dark bg-onyx section-y">
        <div className="shell">
          <h2 className="type-section" data-reveal="lines">{c.openings}</h2>
          {openings.length > 0 ? (
            <ul className="mt-10 border-t border-line-dark">
              {openings.map((opening) => (
                <li key={opening.id} data-reveal="up">
                  <Link
                    href={`${PATHS.apply[locale]}?role=${opening.id}`}
                    className="group relative flex flex-col gap-4 border-b border-line-dark py-7 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span aria-hidden="true" className={`absolute inset-0 origin-left scale-x-0 bg-forest-deep transition-transform duration-700 ${EASE_CLASS} roomy:group-hover:scale-x-100`} />
                    <span className={`relative transition-transform duration-700 ${EASE_CLASS} roomy:group-hover:translate-x-4`}>
                      <span className="type-row block text-bone">{opening.title[locale]}</span>
                      <span className="mt-2 block text-[14px] text-sage">
                        {opening.area[locale]} · {opening.type[locale]}
                      </span>
                      <span className="mt-2 block max-w-[60ch] text-[14.5px] text-sage/80">{opening.summary[locale]}</span>
                    </span>
                    <span className="relative inline-flex min-h-11 items-center gap-3 self-start border border-line-raised px-5 text-[14.5px] text-bone transition-colors duration-300 group-hover:border-mint group-hover:text-mint sm:self-auto roomy:mr-4">
                      {c.viewRole}
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 border border-dashed border-line-raised p-[clamp(28px,4vw,48px)]" data-reveal="up">
              <p className="type-card text-bone">{c.noneTitle}</p>
              <p className="mt-3 max-w-[60ch] text-[15.5px] leading-[1.65] text-sage">{c.noneText}</p>
              <ButtonLink href={PATHS.apply[locale]} arrow className="mt-7">{c.speculative}</ButtonLink>
            </div>
          )}
        </div>
      </section>

      <section className="surface-dark bg-forest section-y">
        <div className="shell flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <h2 className="type-section" data-reveal="lines">{c.howTitle}</h2>
            <p className="type-lead mt-5 max-w-[52ch] text-bone/80" data-reveal="up">{c.howText}</p>
          </div>
          <div data-reveal="up">
            <ButtonLink href={PATHS.apply[locale]} arrow>{c.applyCta}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

export function ApplyView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader
        locale={locale}
        trail={[{ label: t.careers.title, href: PATHS.careers[locale] }, { label: t.apply.title }]}
        title={t.apply.title}
        intro={t.apply.intro}
      />
      <section className="surface-dark bg-onyx section-y">
        <div className="shell max-w-[calc(860px+var(--pad-x)*2)]" data-reveal="up">
          <Suspense>
            <ApplicationForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}

export function ContactView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader locale={locale} trail={[{ label: t.contactPage.title }]} title={t.contactPage.title} intro={t.contactPage.intro} />
      <section className="surface-dark bg-onyx section-y">
        <div className="shell grid gap-y-16 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7">
            <p className="eyebrow text-mint" data-reveal="fade">{t.contactPage.form}</p>
            <div className="mt-8" data-reveal="up">
              <EnquiryForm variant="full" />
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow text-mint" data-reveal="fade">{t.details.office}</p>
            <div className="mt-6">
              <ContactDetails locale={locale} />
            </div>
            <LocationPlate label={t.contactPage.locationLabel} />
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Where the firm is: the continent in outline with Nairobi marked. Stands in
 * for an interactive map until the street address is confirmed, and loads no
 * third-party map service.
 */
function LocationPlate({ label }: { label: string }) {
  const size = 300;
  const box = `${NAIROBI.x - size / 2} ${NAIROBI.y - size / 2} ${size} ${size}`;
  return (
    <figure className="relative mt-8 aspect-square overflow-hidden border border-line-raised bg-forest-deep" data-reveal="image">
      <svg viewBox={box} className="absolute inset-0 h-full w-full" aria-hidden="true" data-media>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#1e2a24" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect x={NAIROBI.x - size} y={NAIROBI.y - size} width={size * 2} height={size * 2} fill="url(#grid)" />
        <path d={AFRICA_PATH} fill="#0f3b2a" stroke="#1f8a5f" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle cx={NAIROBI.x} cy={NAIROBI.y} r="22" fill="#6fcfa0" fillOpacity="0.12" />
        <circle cx={NAIROBI.x} cy={NAIROBI.y} r="10" fill="none" stroke="#6fcfa0" strokeOpacity="0.6" />
        <circle cx={NAIROBI.x} cy={NAIROBI.y} r="4" fill="#6fcfa0" />
      </svg>
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-onyx/90 to-transparent p-5 pt-12">
        <span className="eyebrow text-bone">{label}</span>
        <span className="text-[12px] tabular-nums tracking-[0.08em] text-sage">{NAIROBI_COORDS}</span>
      </figcaption>
    </figure>
  );
}

export function ReceivedView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="surface-dark relative flex min-h-[86svh] items-center overflow-hidden bg-onyx pt-[var(--header-h)]">
      <div aria-hidden="true" className="absolute -right-[10%] top-1/2 h-[80vmin] w-[80vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(31_138_95/0.18),transparent)]" />
      <div className="shell relative py-20">
        <span className="block h-[2px] w-16 origin-left bg-mint" data-reveal="rule" />
        <h1 className="type-display mt-10 max-w-[18ch]" data-reveal="lines">{t.received.title}</h1>
        <p className="type-lead mt-6 max-w-[56ch] text-sage" data-reveal="up">{t.received.text}</p>
        <div className="mt-10 flex flex-wrap gap-3" data-reveal="up">
          <ButtonLink href={PATHS.home[locale]}>{t.received.back}</ButtonLink>
          <ButtonLink href={PATHS.insights[locale]} variant="secondary">{t.received.insights}</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function LegalIndexView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader locale={locale} trail={[{ label: t.legalPage.title }]} title={t.legalPage.title} intro={t.legalPage.intro} />
      <section className="surface-dark bg-onyx section-y">
        <ul className="shell grid gap-4 sm:grid-cols-2">
          {LEGAL_DOCS.map((doc, index) => (
            <li key={doc.id} data-reveal="up">
              <Link href={href.legal(doc.id, locale)} className="group relative flex h-full flex-col border border-line-raised p-7 transition-colors duration-500 hover:border-emerald hover:bg-forest-deep">
                <span className="text-[12px] tabular-nums text-mint">{String(index + 1).padStart(2, "0")}</span>
                <span className="type-card mt-5 text-bone">{doc.title[locale]}</span>
                <span className="mt-3 text-[15px] leading-[1.6] text-sage">{doc.summary[locale]}</span>
                <Arrow className={`mt-8 text-mint transition-transform duration-500 ${EASE_CLASS} group-hover:translate-x-1.5`} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function LegalDocView({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  const t = getDictionary(locale);
  const others = LEGAL_DOCS.filter((other) => other.id !== doc.id);
  return (
    <>
      <PageHeader
        locale={locale}
        trail={[{ label: t.legalPage.title, href: PATHS.legal[locale] }, { label: doc.title[locale] }]}
        title={doc.title[locale]}
        intro={
          <>
            <p>{doc.summary[locale]}</p>
            <p className="mt-3 text-[14px]">
              {t.legalPage.updated}: {formatDate(LEGAL_UPDATED, locale)}
            </p>
          </>
        }
      />
      <section className="surface-light bg-bone text-onyx section-y">
        <div className="shell grid gap-y-12 lg:grid-cols-12 lg:gap-x-6">
          <article className="lg:col-span-7 lg:col-start-1">
            {doc.sections.map((section, index) => (
              <div key={section.heading.en} className="border-t border-line-light py-8 first:border-t-0 first:pt-0" data-reveal="up">
                <h2 className="font-serif text-[clamp(22px,2vw,26px)] leading-tight">
                  <span className="mr-3 text-[13px] tabular-nums text-forest">{String(index + 1).padStart(2, "0")}</span>
                  {section.heading[locale]}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.en} className="mt-4 max-w-[68ch] text-[16.5px] leading-[1.75] text-onyx/85">
                    {paragraph[locale]}
                  </p>
                ))}
              </div>
            ))}
          </article>
          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]" data-reveal="up">
              <p className="eyebrow text-forest">{t.legalPage.other}</p>
              <ul className="mt-4 space-y-2">
                {others.map((other) => (
                  <li key={other.id}>
                    <Link href={href.legal(other.id, locale)} className="text-[15px] text-muted transition-colors hover:text-onyx">
                      {other.title[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

