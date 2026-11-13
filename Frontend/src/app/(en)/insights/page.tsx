import type { Metadata } from "next";
import { InsightsView } from "@/components/pages/InsightViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("en");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "en", paths: PATHS.insights, title: t.insightsPage.title }),
};

export default function Page() {
  return <InsightsView locale="en" />;
}
