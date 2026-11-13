"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ensureGsap, EASE, prefersReducedMotion, whenRevealed } from "@/lib/motion";
import { useLocale } from "@/i18n/useLocale";
import { formatDate } from "@/i18n/dictionaries";
import type { Insight } from "@/content/insights";
import { AREAS, getArea, type PracticeAreaId } from "@/content/practice";
import { PEOPLE, getPersonById } from "@/content/people";
import { PATHS, href } from "@/lib/routes";
import { submitForm, EMAIL_PATTERN } from "@/lib/forms";
import { InsightCard } from "@/components/cards/Cards";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

const PER_PAGE = 9;

/**
 * The insights listing: practice filters (each a real page), an author filter,
 * the featured article and a paged grid. Changes animate in place.
 */
export function InsightsBrowser({ entries, area }: { entries: Insight[]; area?: PracticeAreaId }) {
  const { locale, t } = useLocale();
  const i = t.insightsPage;
  const [author, setAuthor] = useState("");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const filtered = entries.filter((entry) => !author || entry.author === author);
  const featured = !area && !author && page === 1 ? filtered.find((entry) => entry.type === "article") : undefined;
  const rest = filtered.filter((entry) => entry !== featured);
  const pages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const visible = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const gsap = ensureGsap();
    const items = grid.querySelectorAll("[data-item]");
    gsap.set(items, { autoAlpha: 0, y: 36 });
    return whenRevealed(() => {
      gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.07, delay: first.current ? 0.35 : 0.05 });
      first.current = false;
    });
  }, [author, page]);

  const chip = (active: boolean) =>
    `inline-flex min-h-9 items-center whitespace-nowrap rounded-[2px] border px-3.5 text-[13.5px] transition-colors duration-300 ${
      active ? "border-forest bg-forest text-bone" : "border-onyx/15 text-onyx hover:border-forest"
    }`;

  return (
    <>
      <div className="surface-light sticky top-[var(--header-h)] z-20 border-b border-line-light bg-bone/95 backdrop-blur">
        <div className="shell flex items-center gap-4 py-3.5">
          <span className="eyebrow hidden shrink-0 text-forest sm:block">{i.filter}</span>
          <nav aria-label={i.filter} className="-my-2 flex flex-1 gap-2 overflow-x-auto py-2" data-lenis-prevent>
            <Link href={PATHS.insights[locale]} className={chip(!area)} aria-current={!area ? "page" : undefined}>
              {i.all}
            </Link>
            {AREAS.map((a) => (
              <Link key={a.id} href={href.insightsArea(a.id, locale)} className={chip(area === a.id)} aria-current={area === a.id ? "page" : undefined}>
                {a.tag[locale]}
              </Link>
            ))}
          </nav>
          <label className="relative shrink-0">
            <span className="sr-only">{i.byAuthor}</span>
            <select
              value={author}
              onChange={(event) => {
                setAuthor(event.target.value);
                setPage(1);
              }}
              className="min-h-9 appearance-none rounded-[2px] border border-onyx/15 bg-bone pl-3.5 pr-8 text-[13.5px] text-onyx hover:border-forest"
            >
              <option value="">{i.byAuthor}</option>
              {PEOPLE.map((person) => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
            <svg aria-hidden="true" viewBox="0 0 10 6" width="9" height="6" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="m1 1 4 4 4-4" />
            </svg>
          </label>
        </div>
      </div>

      <section className="surface-light bg-bone text-onyx section-y">
        <div ref={gridRef} className="shell">
          {filtered.length === 0 ? (
            <p data-item className="type-card py-10 text-muted">{area ? i.emptyArea : i.empty}</p>
          ) : null}

          {featured ? <Featured entry={featured} /> : null}

          <ul className={`grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 ${featured ? "mt-[clamp(56px,6vw,88px)]" : ""}`}>
            {visible.map((entry) => (
              <li key={entry.id} data-item>
                <InsightCard entry={entry} locale={locale} />
              </li>
            ))}
          </ul>

          {pages > 1 ? (
            <nav aria-label={i.page} className="mt-16 flex items-center justify-center gap-2 border-t border-line-light pt-10">
              {Array.from({ length: pages }, (_, n) => n + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={page === n ? "page" : undefined}
                  className={`size-10 rounded-[2px] border text-[14px] ${page === n ? "border-forest bg-forest text-bone" : "border-onyx/15 hover:border-forest"}`}
                >
                  {n}
                </button>
              ))}
              {page < pages ? (
                <button type="button" onClick={() => setPage(page + 1)} className="min-h-10 rounded-[2px] border border-onyx/15 px-4 text-[14px] hover:border-forest">
                  {i.next} →
                </button>
              ) : null}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );

  function Featured({ entry }: { entry: Insight }) {
    const person = entry.author ? getPersonById(entry.author) : undefined;
    return (
      <Link href={href.article(entry, locale)} data-item data-cursor={t.common.readMore} className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="relative aspect-[16/10] overflow-hidden bg-line-light lg:col-span-7 lg:aspect-[4/3]">
          <Image
            src={entry.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover saturate-[0.65] transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,rgb(15_59_42/0.35),transparent_70%)]" />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow text-forest">{i.featured}</p>
          <div className="mt-5 flex items-center gap-3 text-[13px] text-muted">
            <Tag>{getArea(entry.practice).tag[locale]}</Tag>
            <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
          </div>
          <h2 className="mt-5 font-serif text-[clamp(28px,2.8vw,40px)] leading-[1.15] tracking-[-0.01em]">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 group-hover:bg-[length:100%_1px]">
              {entry.title[locale]}
            </span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.65] text-muted">{entry.standfirst[locale]}</p>
          {person ? <p className="mt-6 text-[14.5px] font-medium text-onyx">{person.name}</p> : null}
        </div>
      </Link>
    );
  }
}

/** Subscribe to alerts. */
export function SubscribeBox() {
  const { t } = useLocale();
  const i = t.insightsPage;
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError(value ? t.form.fields.email.invalid : t.form.fields.email.error);
      return;
    }
    setError(null);
    setState("sending");
    try {
      await submitForm("subscribe", { email: value });
      setState("done");
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="w-full border border-line-light bg-bone-deep p-6 lg:w-[360px]">
      <p className="eyebrow text-forest">{i.subscribeTitle}</p>
      {state === "done" ? (
        <p role="status" className="mt-4 text-[14.5px] text-onyx">
          {i.subscribed} <strong className="font-medium">{email}</strong>.
        </p>
      ) : (
        <form noValidate onSubmit={onSubmit} className="mt-4 flex items-end gap-3">
          <label className="relative flex-1">
            <span className="sr-only">{i.subscribeLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              aria-invalid={error ? true : undefined}
              className="peer w-full bg-transparent pb-2 text-[15px] text-onyx outline-none placeholder:text-muted/70 focus-visible:outline-none"
            />
            <span className={`absolute inset-x-0 bottom-0 h-px ${error ? "bg-error" : "bg-onyx/25"}`} />
            <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-forest transition-transform duration-300 peer-focus:scale-x-100" />
          </label>
          <Button type="submit" variant="dark" disabled={state === "sending"} className="min-h-10 px-4 text-[14px]">
            {i.subscribe}
          </Button>
        </form>
      )}
      {error ? <p className="mt-2 text-[13px] text-error">{error}</p> : null}
      {state === "failed" ? <p role="alert" className="mt-2 text-[13px] text-error">{i.subscribeFailed}</p> : null}
    </div>
  );
}
