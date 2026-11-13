import type { Metadata } from "next";
import type { Locale } from "@/i18n/types";
import { getDictionary } from "@/i18n/dictionaries";

/** The public address, for canonical links and the sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Page metadata with a canonical address and its counterpart in the other
 * language, so search engines pair the English and French pages.
 */
export function pageMetadata({
  locale,
  paths,
  title,
  description,
  image,
}: {
  locale: Locale;
  paths: Record<Locale, string>;
  title?: string;
  description?: string;
  image?: string;
}): Metadata {
  const t = getDictionary(locale);
  return {
    title: title ? `${title} — 54 Law Partners` : t.meta.title,
    description: description ?? t.meta.description,
    alternates: {
      canonical: paths[locale],
      languages: { en: paths.en, fr: paths.fr, "x-default": paths.en },
    },
    openGraph: {
      title: title ?? t.meta.title,
      description: description ?? t.meta.description,
      siteName: "54 Law Partners",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      type: "website",
      images: [{ url: image ?? "/images/nairobi-night.jpg" }],
    },
  };
}

export function rootMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
  };
}
