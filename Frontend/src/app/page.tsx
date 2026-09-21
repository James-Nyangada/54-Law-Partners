import { Hero } from "@/components/hero/Hero";
import { Positioning } from "@/components/positioning/Positioning";
import { PracticeAreas } from "@/components/practice/PracticeAreas";
import { KenyaScene } from "@/components/kenya/KenyaScene";
import { ReachMap } from "@/components/kenya/ReachMap";
import { People } from "@/components/people/People";
import { Insights } from "@/components/insights/Insights";
import { Marquee } from "@/components/insights/Marquee";
import { Experience } from "@/components/experience/Experience";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Positioning />
      <PracticeAreas />
      <KenyaScene />
      <ReachMap />
      <People />
      <Insights />
      <Marquee />
      <Experience />
      <Contact />
    </>
  );
}
