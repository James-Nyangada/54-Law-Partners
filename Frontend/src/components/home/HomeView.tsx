import type { Locale } from "@/i18n/types";
import { Hero } from "./Hero";
import { Positioning } from "./Positioning";
import { PracticeIndex } from "./PracticeIndex";
import { Grounding } from "./Grounding";
import { ReachMap } from "./ReachMap";
import { Marquee } from "./Marquee";
import { Experience, PeopleTeaser, InsightsTeaser, ContactSection } from "./Sections";

/** The home page, in the order of the visual design. */
export function HomeView({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero />
      <Positioning />
      <PracticeIndex />
      <Grounding />
      <ReachMap />
      <Experience locale={locale} />
      <PeopleTeaser locale={locale} />
      <InsightsTeaser locale={locale} />
      <Marquee />
      <ContactSection locale={locale} />
    </>
  );
}
