import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/pages/PeopleViews";
import { PEOPLE, getPerson } from "@/content/people";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return PEOPLE.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const person = getPerson((await params).slug);
  if (!person) return {};
  return pageMetadata({
    locale: "en",
    paths: { en: href.person(person.slug, "en"), fr: href.person(person.slug, "fr") },
    title: person.name,
    description: `${person.name}, ${person.role.en}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const person = getPerson((await params).slug);
  if (!person) notFound();
  return <ProfileView person={person} locale="en" />;
}
