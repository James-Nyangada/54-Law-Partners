import type { Metadata } from "next";
import { ApplyView } from "@/components/pages/OtherViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("en");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "en", paths: PATHS.apply, title: t.apply.title }),
};

export default function Page() {
  return <ApplyView locale="en" />;
}
