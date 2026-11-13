import type { Localized } from "@/i18n/types";
import { withSamples } from "./samples";

/**
 * Current openings. FIRM TO SUPPLY. With none, the Careers page invites a
 * speculative application instead (per the wireframe).
 */
export interface Opening {
  id: string;
  title: Localized;
  area: Localized;
  type: Localized;
  summary: Localized;
}

const OPENINGS: Opening[] = [];

const SAMPLE_OPENINGS: Opening[] = [
  {
    id: "associate-disputes",
    title: { en: "Associate, Disputes", fr: "Collaborateur, Contentieux" },
    area: { en: "Litigation and arbitration", fr: "Contentieux et arbitrage" },
    type: { en: "Nairobi · Full time", fr: "Nairobi · Temps plein" },
    summary: {
      en: "Two to five years’ post-qualification experience in commercial litigation or arbitration.",
      fr: "Deux à cinq ans d’expérience après l’admission en contentieux commercial ou en arbitrage.",
    },
  },
  {
    id: "associate-transactions",
    title: { en: "Associate, Transactions", fr: "Collaborateur, Transactions" },
    area: { en: "Corporate and finance", fr: "Sociétés et finance" },
    type: { en: "Nairobi · Full time", fr: "Nairobi · Temps plein" },
    summary: {
      en: "Experience of mergers and acquisitions or banking work; working French an advantage.",
      fr: "Expérience en fusions-acquisitions ou en financement ; la maîtrise du français est un atout.",
    },
  },
];

export function getOpenings(): Opening[] {
  return withSamples(OPENINGS, SAMPLE_OPENINGS);
}
