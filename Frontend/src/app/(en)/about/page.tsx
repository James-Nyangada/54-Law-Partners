import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("en");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "en", paths: PATHS.about, title: t.about.title }),
};

export default function Page() {
  return <AboutView locale="en" />;
}
