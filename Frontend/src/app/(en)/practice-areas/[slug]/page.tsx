import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaView } from "@/components/pages/PracticeViews";
import { AREAS } from "@/content/practice";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/routes";

const find = (slug: string) => AREAS.find((area) => area.slug.en === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug.en }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const area = find((await params).slug);
  if (!area) return {};
  return pageMetadata({
    locale: "en",
    paths: { en: href.area(area.id, "en"), fr: href.area(area.id, "fr") },
    title: area.name.en,
    description: area.intro.en,
    image: area.image,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const area = find((await params).slug);
  if (!area) notFound();
  return <AreaView area={area} locale="en" />;
}
