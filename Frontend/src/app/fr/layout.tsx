import "../globals.css";
import { SiteDocument } from "@/components/site/SiteDocument";
import { rootMetadata } from "@/lib/metadata";

export const metadata = rootMetadata("fr");

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="fr">{children}</SiteDocument>;
}
