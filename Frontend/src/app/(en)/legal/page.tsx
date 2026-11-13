import type { Metadata } from "next";
import { LegalIndexView } from "@/components/pages/OtherViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("en");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "en", paths: PATHS.legal, title: t.legalPage.title }),
};

export default function Page() {
  return <LegalIndexView locale="en" />;
}
