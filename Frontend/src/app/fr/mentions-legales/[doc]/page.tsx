import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocView } from "@/components/pages/OtherViews";
import { LEGAL_DOCS, getLegalDoc } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ doc: doc.slug.fr }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const doc = getLegalDoc((await params).doc, "fr");
  if (!doc) return {};
  return pageMetadata({
    locale: "fr",
    paths: { en: href.legal(doc.id, "en"), fr: href.legal(doc.id, "fr") },
    title: doc.title.fr,
    description: doc.summary.fr,
  });
}

export default async function Page({ params }: { params: Promise<{ doc: string }> }) {
  const doc = getLegalDoc((await params).doc, "fr");
  if (!doc) notFound();
  return <LegalDocView doc={doc} locale="fr" />;
}
