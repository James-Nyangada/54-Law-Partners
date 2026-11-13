import type { Metadata } from "next";
import { PeopleView } from "@/components/pages/PeopleViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("fr");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "fr", paths: PATHS.people, title: t.peoplePage.title }),
};

export default function Page() {
  return <PeopleView locale="fr" />;
}
