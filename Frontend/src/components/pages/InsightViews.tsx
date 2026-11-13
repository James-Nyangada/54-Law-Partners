import Link from "next/link";
import type { Locale } from "@/i18n/types";
import { getDictionary, formatDate } from "@/i18n/dictionaries";
import { getInsights, insightsInArea, readingMinutes, type Insight, type Block } from "@/content/insights";
import { getArea, type PracticeAreaId } from "@/content/practice";
import { getPersonById, getProfile } from "@/content/people";
import { FIRM } from "@/content/firm";
import { PATHS, href } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";
import { Portrait } from "@/components/ui/Portrait";
import { Tag } from "@/components/ui/Tag";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { InsightMini } from "@/components/cards/Cards";
import { PageHeader } from "./PageHeader";
import { InsightsBrowser, SubscribeBox } from "./InsightsBrowser";
import { ReadingProgress, Contents, Share } from "./ArticleParts";

export function InsightsView({ locale, area }: { locale: Locale; area?: PracticeAreaId }) {
  const t = getDictionary(locale);
  const entries = area ? insightsInArea(area) : getInsights();
  const areaName = area ? getArea(area).name[locale] : null;
  return (
    <>
      <PageHeader
        locale={locale}
        surface="light"
        trail={area ? [{ label: t.insightsPage.title, href: PATHS.insights[locale] }, { label: areaName! }] : [{ label: t.insightsPage.title }]}
        eyebrow={area ? t.insightsPage.areaTitle : undefined}
        title={areaName ?? t.insightsPage.title}
        intro={t.insightsPage.intro}
        aside={<SubscribeBox />}
      />
      <InsightsBrowser entries={entries} area={area} />
    </>
  );
}

/** An article written by the firm, per the visual design. */
export function ArticleView({ entry, locale }: { entry: Insight; locale: Locale }) {
  const t = getDictionary(locale);
  const a = t.article;
  const area = getArea(entry.practice);
  const author = entry.author ? getPersonById(entry.author) : undefined;
  const bio = author ? getProfile(author.id)?.bio[0][locale] : undefined;
  const body = (locale === "fr" ? entry.bodyFr : undefined) ?? entry.body ?? [];
  const bodyLang = locale === "fr" && !entry.bodyFr ? "en" : locale;
  const headings = body.filter((block): block is Extract<Block, { type: "h2" }> => block.type === "h2");
  const more = insightsInArea(entry.practice).filter((other) => other.id !== entry.id).slice(0, 3);

  return (
    <div className="surface-light bg-bone text-onyx">
      <ReadingProgress target="article-body" />

      <header className="pt-[calc(var(--header-h)+clamp(32px,5vw,72px))]">
        <div className="shell">
          <div className="mx-auto max-w-[760px]">
            <Breadcrumbs locale={locale} trail={[{ label: t.insightsPage.title, href: PATHS.insights[locale] }, { label: entry.title[locale] }]} />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-[13.5px] text-muted" data-reveal="fade">
              <Link href={href.insightsArea(entry.practice, locale)}>
                <Tag className="transition-colors hover:bg-forest hover:text-bone">{area.tag[locale]}</Tag>
              </Link>
              <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(body)} {t.common.minRead}</span>
            </div>
            <h1 className="mt-6 font-serif text-[clamp(34px,4.2vw,56px)] leading-[1.1] tracking-[-0.015em]" data-reveal="lines">
              {entry.title[locale]}
            </h1>
            <p className="mt-6 font-serif text-[clamp(19px,1.7vw,22px)] italic leading-[1.5] text-muted" data-reveal="up">
              {entry.standfirst[locale]}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-t border-line-light pt-6" data-reveal="up">
              {author ? (
                <Link href={href.person(author.slug, locale)} className="group flex items-center gap-4">
                  <Portrait person={author} sizes="48px" className="size-12 rounded-full" />
                  <span>
                    <span className="block text-[15px] font-medium group-hover:text-forest">{author.name}</span>
                    <span className="block text-[13px] text-muted">{author.role[locale]}</span>
                  </span>
                </Link>
              ) : <span />}
              <Share title={entry.title[locale]} />
            </div>
          </div>
        </div>
        <div className="shell mt-12">
          <Photo src={entry.image} alt="" sizes="(min-width: 1024px) 1100px, 100vw" tone="light" priority className="mx-auto aspect-[16/8] max-w-[1100px]" />
        </div>
      </header>

      <div className="shell grid gap-y-10 py-[clamp(56px,6vw,88px)] lg:grid-cols-12 lg:gap-x-6">
        {headings.length > 1 ? (
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-[calc(var(--header-h)+48px)]">
              <Contents items={headings.map((h) => ({ id: h.id, text: h.text }))} />
            </div>
          </aside>
        ) : null}

        <article id="article-body" className="lg:col-span-7 lg:col-start-4">
          {bodyLang !== locale ? (
            <p className="mb-8 border-l-2 border-forest bg-bone-deep px-4 py-3 text-[14px] text-muted">{t.common.englishOnly}</p>
          ) : null}
          <div className="prose-article" lang={bodyLang}>
            {body.map((block, index) => (
              <BlockView key={index} block={block} entry={entry} locale={locale} />
            ))}
          </div>

          <p className="mt-14 border border-line-light bg-bone-deep px-5 py-4 text-[13.5px] leading-[1.6] text-muted">
            {FIRM.articleDisclaimer?.[locale] ?? a.disclaimer}
          </p>

          {author ? (
            <div className="mt-12 flex gap-6 border-t border-line-light pt-10" data-reveal="up">
              <Portrait person={author} sizes="96px" className="h-[100px] w-[84px] shrink-0" />
              <div>
                <p className="eyebrow text-forest">{a.writtenBy}</p>
                <p className="mt-2 font-serif text-[24px] leading-tight">{author.name}</p>
                {bio ? <p className="mt-2 max-w-[56ch] text-[14.5px] leading-[1.6] text-muted">{bio}</p> : null}
                <TextLink href={href.person(author.slug, locale)} className="mt-4">{t.common.viewProfile}</TextLink>
              </div>
            </div>
          ) : null}
        </article>
      </div>

      {more.length > 0 ? (
        <section className="border-t border-line-light bg-bone-deep py-[clamp(56px,6vw,88px)]">
          <div className="shell">
            <p className="eyebrow text-forest" data-reveal="fade">{a.moreIn} {area.name[locale]}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((other) => (
                <li key={other.id} data-reveal="up">
                  <InsightMini entry={other} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function BlockView({ block, entry, locale }: { block: Block; entry: Insight; locale: Locale }) {
  const t = getDictionary(locale);
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h2":
      return <h2 id={block.id}>{block.text}</h2>;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "list":
      return (
        <ul>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );
    case "brief":
      if (!entry.brief) return null;
      return (
        <div className="surface-dark !my-10 flex flex-col gap-5 bg-onyx p-6 text-bone sm:flex-row sm:items-center">
          <span className="flex h-14 w-11 shrink-0 items-center justify-center border border-line-raised bg-forest-deep text-[10px] font-semibold tracking-[0.12em] text-mint">PDF</span>
          <span className="flex-1">
            <span className="block font-serif text-[19px] leading-snug">{entry.brief.title[locale]}</span>
            <span className="mt-1 block text-[13px] text-sage">{entry.brief.size}</span>
          </span>
          <ButtonLink href={entry.brief.href} download data-transition="off" className="shrink-0">
            {t.article.download}
          </ButtonLink>
        </div>
      );
  }
}
