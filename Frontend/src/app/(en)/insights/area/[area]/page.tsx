import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightsView } from "@/components/pages/InsightViews";
import { AREAS } from "@/content/practice";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/routes";

const find = (slug: string) => AREAS.find((area) => area.slug.en === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((area) => ({ area: area.slug.en }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const area = find((await params).area);
  if (!area) return {};
  const t = getDictionary("en");
  return pageMetadata({
    locale: "en",
    paths: { en: href.insightsArea(area.id, "en"), fr: href.insightsArea(area.id, "fr") },
    title: `${t.insightsPage.title}: ${area.name.en}`,
  });
}

export default async function Page({ params }: { params: Promise<{ area: string }> }) {
  const area = find((await params).area);
  if (!area) notFound();
  return <InsightsView locale="en" area={area.id} />;
}
