import type { Metadata } from "next";
import { PracticeOverview } from "@/components/pages/PracticeViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("fr");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "fr", paths: PATHS.practice, title: t.practicePage.title }),
};

export default function Page() {
  return <PracticeOverview locale="fr" />;
}
