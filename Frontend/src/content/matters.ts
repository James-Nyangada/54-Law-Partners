import type { Localized } from "@/i18n/types";
import type { PracticeAreaId } from "./practice";
import { withSamples } from "./samples";

/**
 * Representative matters. FIRM TO SUPPLY: add entries to MATTERS, described
 * without client identifiers. Until then the samples below appear only in
 * development and preview builds (see samples.ts); the launch build leaves the
 * Experience sections out.
 */
export interface Matter {
  id: string;
  practice: PracticeAreaId;
  /** The lawyers who handled it, by person id. */
  people: string[];
  sector: Localized;
  jurisdiction: Localized;
  role: Localized;
  summary: Localized;
}

const MATTERS: Matter[] = [];

const SAMPLE_MATTERS: Matter[] = [
  {
    id: "m1", practice: "mergers", people: ["partner-one"],
    sector: { en: "Logistics", fr: "Logistique" },
    jurisdiction: { en: "Kenya, Uganda, Rwanda", fr: "Kenya, Ouganda, Rwanda" },
    role: { en: "Counsel to the buyer", fr: "Conseil de l’acquéreur" },
    summary: {
      en: "Acquisition of a regional logistics group, including merger clearance in three jurisdictions.",
      fr: "Acquisition d’un groupe logistique régional, y compris le contrôle des concentrations dans trois juridictions.",
    },
  },
  {
    id: "m2", practice: "disputes", people: ["partner-two"],
    sector: { en: "Infrastructure", fr: "Infrastructures" },
    jurisdiction: { en: "ICC arbitration", fr: "Arbitrage CCI" },
    role: { en: "Counsel to the contractor", fr: "Conseil de l’entrepreneur" },
    summary: {
      en: "Institutional arbitration over delay and variation claims on a public works contract.",
      fr: "Arbitrage institutionnel portant sur des réclamations pour retards et modifications d’un marché de travaux publics.",
    },
  },
  {
    id: "m3", practice: "banking", people: ["partner-one"],
    sector: { en: "Agribusiness", fr: "Agro-industrie" },
    jurisdiction: { en: "Kenya, Tanzania", fr: "Kenya, Tanzanie" },
    role: { en: "Counsel to the lenders", fr: "Conseil des prêteurs" },
    summary: {
      en: "Cross-border term facility secured over assets in two countries.",
      fr: "Prêt à terme transfrontalier garanti par des actifs situés dans deux pays.",
    },
  },
  {
    id: "m4", practice: "investigations", people: ["partner-two"],
    sector: { en: "Development", fr: "Développement" },
    jurisdiction: { en: "East Africa", fr: "Afrique de l’Est" },
    role: { en: "Investigating counsel", fr: "Conseil chargé de l’enquête" },
    summary: {
      en: "Internal investigation into procurement irregularities for a development organisation.",
      fr: "Enquête interne sur des irrégularités de passation de marchés pour une organisation de développement.",
    },
  },
  {
    id: "m5", practice: "projects", people: ["partner-one"],
    sector: { en: "Renewable energy", fr: "Énergies renouvelables" },
    jurisdiction: { en: "Kenya", fr: "Kenya" },
    role: { en: "Counsel to the sponsor", fr: "Conseil du promoteur" },
    summary: {
      en: "Power purchase and project documents for an independent renewable generation project.",
      fr: "Contrat d’achat d’électricité et documentation de projet pour une centrale renouvelable indépendante.",
    },
  },
  {
    id: "m6", practice: "international", people: ["partner-two"],
    sector: { en: "Public sector", fr: "Secteur public" },
    jurisdiction: { en: "Regional court", fr: "Juridiction régionale" },
    role: { en: "Counsel to a diplomatic mission", fr: "Conseil d’une mission diplomatique" },
    summary: {
      en: "Advice on state immunity in commercial proceedings brought against a foreign mission.",
      fr: "Conseil sur l’immunité de l’État dans une procédure commerciale engagée contre une mission étrangère.",
    },
  },
];

export function getMatters(): Matter[] {
  return withSamples(MATTERS, SAMPLE_MATTERS);
}

export function mattersInArea(area: PracticeAreaId): Matter[] {
  return getMatters().filter((matter) => matter.practice === area);
}

export function mattersFor(personId: string): Matter[] {
  return getMatters().filter((matter) => matter.people.includes(personId));
}
