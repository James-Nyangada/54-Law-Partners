import Link from "next/link";
import type { Locale } from "@/i18n/types";
import { getDictionary } from "@/i18n/dictionaries";
import { PATHS } from "@/lib/routes";

/** Home / Section / Page. The current page is not a link. */
export function Breadcrumbs({
  locale,
  trail,
  className = "",
}: {
  locale: Locale;
  trail: { label: string; href?: string }[];
  className?: string;
}) {
  const t = getDictionary(locale);
  const items = [{ label: t.nav.home, href: PATHS.home[locale] }, ...trail];
  return (
    <nav aria-label={t.nav.breadcrumb} className={className} data-reveal="fade">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--muted-text)]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="opacity-60">/</span> : null}
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="transition-colors duration-300 hover:text-[var(--accent)]">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--strong)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
