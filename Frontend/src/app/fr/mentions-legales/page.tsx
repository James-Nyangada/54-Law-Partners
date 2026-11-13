import type { Metadata } from "next";
import { LegalIndexView } from "@/components/pages/OtherViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("fr");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "fr", paths: PATHS.legal, title: t.legalPage.title }),
};

export default function Page() {
  return <LegalIndexView locale="fr" />;
}
