import type { Metadata } from "next";
import { ReceivedView } from "@/components/pages/OtherViews";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

const t = getDictionary("fr");

export const metadata: Metadata = {
  ...pageMetadata({ locale: "fr", paths: PATHS.received, title: t.received.title }),
  robots: { index: false },
};

export default function Page() {
  return <ReceivedView locale="fr" />;
}
