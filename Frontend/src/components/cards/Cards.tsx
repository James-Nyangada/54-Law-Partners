import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/types";
import { getDictionary, formatDate } from "@/i18n/dictionaries";
import type { Matter } from "@/content/matters";
import type { Insight } from "@/content/insights";
import type { Person } from "@/content/people";
import { getArea } from "@/content/practice";
import { getPersonById } from "@/content/people";
import { href } from "@/lib/routes";
import { Tag } from "@/components/ui/Tag";
import { Portrait } from "@/components/ui/Portrait";
import { Arrow, ArrowOut } from "@/components/ui/Arrow";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/** Matter card, per the UI kit: forest deep, a mint top rule, serif summary. */
export function MatterCard({ matter, locale, layout = "card" }: { matter: Matter; locale: Locale; layout?: "card" | "row" }) {
  if (layout === "row") {
    return (
      <div className="group relative border-l-2 border-mint bg-forest p-6 transition-colors duration-500 hover:bg-forest-deep">
        <p className="eyebrow text-mint">
          {matter.sector[locale]} · {matter.jurisdiction[locale]} · {matter.role[locale]}
        </p>
        <p className="type-card mt-3 font-normal text-bone">{matter.summary[locale]}</p>
      </div>
    );
  }
  return (
    <div className={`group relative h-full border border-line-raised/70 bg-forest-deep p-7 transition-[transform,background-color] duration-700 ${EASE_CLASS} hover:-translate-y-1 hover:bg-[#0d3123]`}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-mint" />
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-mint-light transition-transform duration-700 ${EASE_CLASS} group-hover:scale-x-100`} />
      <p className="eyebrow text-mint">{matter.sector[locale]}</p>
      <p className="mt-2 text-[13px] text-sage">{matter.jurisdiction[locale]}</p>
      <p className="type-card mt-5 font-normal text-bone">{matter.summary[locale]}</p>
      <p className="mt-6 text-[13px] text-sage/80">{matter.role[locale]}</p>
    </div>
  );
}

/**
 * Insight card. The firm's own articles open here and carry a solid practice
 * tag; pieces published elsewhere carry a dashed tag with an outward arrow and
 * open on the publisher's site.
 */
export function InsightCard({
  entry,
  locale,
  tone = "light",
  compact,
  image = true,
}: {
  entry: Insight;
  locale: Locale;
  tone?: "light" | "dark";
  compact?: boolean;
  image?: boolean;
}) {
  const t = getDictionary(locale);
  const external = entry.type === "external";
  const author = entry.author ? getPersonById(entry.author) : undefined;
  const link = external ? entry.source!.url : href.article(entry, locale);
  const area = getArea(entry.practice);

  const body = (
    <>
      {image ? (
        <div className={`relative overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[4/3]"} ${tone === "light" ? "bg-line-light" : "bg-forest-deep"}`}>
          <Image
            src={entry.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover saturate-[0.65] transition-transform duration-[1.2s] ${EASE_CLASS} group-hover:scale-[1.05]`}
          />
          <div aria-hidden="true" className={`absolute inset-0 ${tone === "light" ? "bg-[linear-gradient(180deg,transparent_40%,rgb(11_14_12/0.35)),linear-gradient(135deg,rgb(15_59_42/0.35),transparent_70%)]" : "bg-[linear-gradient(180deg,rgb(11_14_12/0.1),rgb(11_14_12/0.55))]"}`} />
        </div>
      ) : null}
      <div className={image ? "pt-5" : ""}>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[var(--muted-text)]">
          {external ? <Tag kind="external">{entry.source!.name}</Tag> : <Tag>{area.tag[locale]}</Tag>}
          <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
        </div>
        <h3 className={`mt-4 text-[var(--strong)] ${compact ? "type-card font-normal" : "type-card font-normal"}`}>
          <span className={`bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-700 ${EASE_CLASS} group-hover:bg-[length:100%_1px]`}>
            {entry.title[locale]}
          </span>
          {external ? <ArrowOut className="ml-2 inline size-2.5 align-baseline" /> : null}
        </h3>
        <p className="mt-3 flex flex-wrap items-center gap-3 text-[13.5px] text-[var(--muted-text)]">
          {external ? t.common.opensElsewhere : author ? author.name : null}
          {entry.brief && !external ? <Tag className="text-[9.5px]">{t.common.pdfBrief}</Tag> : null}
        </p>
      </div>
    </>
  );

  return external ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="group block" data-cursor={t.common.readMore}>
      {body}
      <span className="sr-only"> ({t.common.newTab})</span>
    </a>
  ) : (
    <Link href={link} className="group block" data-cursor={t.common.readMore}>
      {body}
    </Link>
  );
}

/** A small card for related insights, without imagery. */
export function InsightMini({ entry, locale }: { entry: Insight; locale: Locale }) {
  const external = entry.type === "external";
  const link = external ? entry.source!.url : href.article(entry, locale);
  const inner = (
    <>
      <p className="eyebrow text-[var(--accent)]">
        {external ? `${entry.source!.name} ↗` : getArea(entry.practice).tag[locale]} · {formatDate(entry.date, locale)}
      </p>
      <p className="type-card mt-3 font-normal text-[var(--strong)]">{entry.title[locale]}</p>
      <Arrow className={`mt-5 text-[var(--accent)] transition-transform duration-500 ${EASE_CLASS} group-hover:translate-x-1.5`} />
    </>
  );
  const cls = `group block h-full border border-[var(--rule-raised)] p-6 transition-colors duration-500 hover:border-[var(--accent)]`;
  return external ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={link} className={cls}>{inner}</Link>
  );
}

/** Lawyer card: portrait, name, role, admission and languages. */
export function PersonCard({ person, locale, size = "large" }: { person: Person; locale: Locale; size?: "large" | "small" }) {
  const t = getDictionary(locale);
  if (size === "small") {
    return (
      <Link href={href.person(person.slug, locale)} className="group flex items-center gap-4">
        <Portrait person={person} sizes="72px" className="h-[84px] w-[68px] shrink-0 border border-line-raised" />
        <span>
          <span className="block font-serif text-[19px] leading-tight text-[var(--strong)] transition-colors duration-300 group-hover:text-[var(--accent)]">
            {person.name}
          </span>
          <span className="mt-1.5 block text-[13px] text-[var(--muted-text)]">{person.role[locale]}</span>
        </span>
      </Link>
    );
  }
  return (
    <Link href={href.person(person.slug, locale)} className="group block" data-cursor={t.common.viewProfile.split(" ")[0]}>
      <Portrait person={person} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/5] border border-line-raised" />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-[26px] leading-tight text-bone">{person.name}</p>
          <p className="eyebrow mt-3 text-mint">{person.role[locale]}</p>
          <p className="mt-3 text-[14.5px] text-sage">
            {t.peoplePage.admitted}: {person.admitted[locale]} · {person.languages[locale]}
          </p>
        </div>
        <Arrow className={`mt-3 shrink-0 text-mint transition-transform duration-500 ${EASE_CLASS} group-hover:translate-x-1.5`} />
      </div>
    </Link>
  );
}
