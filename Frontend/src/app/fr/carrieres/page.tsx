import type { Metadata } from "next";
import { CareersView } from "@/components/pages/OtherViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("fr");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "fr", paths: PATHS.careers, title: t.careers.title }),
};

export default function Page() {
  return <CareersView locale="fr" />;
}
