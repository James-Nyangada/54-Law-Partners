import type { Locale } from "@/i18n/types";
import { getDictionary } from "@/i18n/dictionaries";
import { PATHS } from "@/lib/routes";
import { Photo } from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "./PageHeader";
import { ReachMap } from "@/components/home/ReachMap";

/** About us: the firm, how it works, who it acts for, and its reach. */
export function AboutView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const a = t.about;
  return (
    <>
      <PageHeader
        locale={locale}
        trail={[{ label: a.title }]}
        eyebrow={a.eyebrow}
        title={a.headline.join(" ")}
        intro={a.intro}
      />

      {/* Full-bleed image, drifting as it passes. */}
      <Photo
        src="/images/nairobi-kicc.jpg"
        alt={a.imageAlt}
        sizes="100vw"
        tone="dark"
        position="50% 40%"
        parallax={8}
        className="h-[clamp(320px,62vh,720px)] w-full"
      />

      <section className="surface-dark bg-onyx section-y">
        <div className="shell grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          <p className="eyebrow text-mint lg:col-span-3" data-reveal="fade">{a.story.eyebrow}</p>
          <div className="space-y-6 lg:col-span-8 lg:col-start-5">
            <p className="font-serif text-[clamp(24px,2.4vw,32px)] leading-[1.35] text-bone" data-reveal="lines">
              {a.story.paragraphs[0]}
            </p>
            {a.story.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="type-lead max-w-[62ch] text-sage" data-reveal="up">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-dark border-t border-line-dark bg-onyx section-y">
        <div className="shell grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
          <p className="eyebrow text-mint lg:col-span-3" data-reveal="fade">{a.values.eyebrow}</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:col-start-5">
            {a.values.items.map((item, index) => (
              <li
                key={item.title}
                data-reveal="up"
                className="group relative border border-line-raised p-7 transition-colors duration-500 hover:border-emerald hover:bg-forest-deep"
              >
                <span className="text-[12px] tabular-nums text-mint">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="type-card mt-5 text-bone">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-sage">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-dark bg-forest section-y">
        <div className="shell grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4">
            <p className="eyebrow text-mint" data-reveal="fade">{a.staffing.eyebrow}</p>
            <h2 className="type-section mt-5" data-reveal="lines">{a.staffing.title}</h2>
          </div>
          <p className="type-lead max-w-[58ch] text-bone/85 lg:col-span-7 lg:col-start-6 lg:pt-10" data-reveal="up">
            {a.staffing.text}
          </p>
        </div>
      </section>

      <section className="surface-light bg-bone-deep text-onyx section-y">
        <div className="shell grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          <p className="eyebrow text-forest lg:col-span-3" data-reveal="fade">{a.clients.eyebrow}</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <ul className="flex flex-wrap gap-2.5">
              {a.clients.items.map((item) => (
                <li
                  key={item}
                  data-reveal="up"
                  className="rounded-[2px] border border-onyx/20 px-4 py-2.5 text-[14.5px] transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-bone"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="type-lead mt-8 max-w-[58ch] text-muted" data-reveal="up">{a.clients.text}</p>
          </div>
        </div>
      </section>

      <ReachMap />

      <section className="surface-dark bg-onyx section-y">
        <div className="shell flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="type-display max-w-[16ch]" data-reveal="lines">
            {t.contactBlock.title.join(" ")}
          </h2>
          <div className="flex flex-wrap gap-3" data-reveal="up">
            <ButtonLink href={PATHS.contact[locale]} arrow>{t.nav.speak}</ButtonLink>
            <ButtonLink href={PATHS.people[locale]} variant="secondary">{t.common.fullTeam}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
