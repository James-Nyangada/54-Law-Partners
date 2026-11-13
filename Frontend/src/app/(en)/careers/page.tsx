import type { Metadata } from "next";
import { CareersView } from "@/components/pages/OtherViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("en");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "en", paths: PATHS.careers, title: t.careers.title }),
};

export default function Page() {
  return <CareersView locale="en" />;
}
