import type { Metadata } from "next";
import { ContactView } from "@/components/pages/OtherViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("fr");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "fr", paths: PATHS.contact, title: t.contactPage.title }),
};

export default function Page() {
  return <ContactView locale="fr" />;
}
