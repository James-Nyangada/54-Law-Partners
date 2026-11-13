import "../globals.css";
import { SiteDocument } from "@/components/site/SiteDocument";
import { rootMetadata } from "@/lib/metadata";

export const metadata = rootMetadata("en");

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
