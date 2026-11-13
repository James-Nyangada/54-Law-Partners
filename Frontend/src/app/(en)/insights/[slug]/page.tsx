import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/pages/InsightViews";
import { getArticles, getArticle } from "@/content/insights";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getArticles().map((entry) => ({ slug: entry.slug.en }));
  // A static export needs at least one path; an empty archive serves the 404.
  return slugs.length ? slugs : [{ slug: "none" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = getArticle((await params).slug, "en");
  if (!entry) return {};
  return pageMetadata({
    locale: "en",
    paths: { en: href.article(entry, "en"), fr: href.article(entry, "fr") },
    title: entry.title.en,
    description: entry.standfirst.en,
    image: entry.image,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getArticle((await params).slug, "en");
  if (!entry) notFound();
  return <ArticleView entry={entry} locale="en" />;
}
