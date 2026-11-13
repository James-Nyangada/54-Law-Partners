import { HomeView } from "@/components/home/HomeView";
import { pageMetadata } from "@/lib/metadata";
import { PATHS } from "@/lib/routes";

export const metadata = pageMetadata({ locale: "fr", paths: PATHS.home });

export default function Page() {
  return <HomeView locale="fr" />;
}
