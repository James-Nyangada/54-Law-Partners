import type { Localized } from "@/i18n/types";

/**
 * The three pillars and eight practice areas.
 *
 * The pillars come from the design spec. The area names, their grouping and
 * the Investigations qualifying line are placeholders to confirm with the firm;
 * the French is a draft for review. Images are generated placeholders: replace
 * each `image` with a photograph at the same path.
 */

export type PillarId = "transactions" | "disputes" | "international";

export const PILLARS: { id: PillarId; name: Localized; short: Localized }[] = [
  {
    id: "transactions",
    name: { en: "Transactions and advisory", fr: "Transactions et conseil" },
    short: { en: "Transactions", fr: "Transactions" },
  },
  {
    id: "disputes",
    name: { en: "Disputes", fr: "Contentieux" },
    short: { en: "Disputes", fr: "Contentieux" },
  },
  {
    id: "international",
    name: { en: "International law", fr: "Droit international" },
    short: { en: "International", fr: "International" },
  },
];

export type PracticeAreaId =
  | "corporate"
  | "banking"
  | "infrastructure"
  | "litigation"
  | "arbitration"
  | "investigations"
  | "trade"
  | "international-law";

export interface PracticeArea {
  id: PracticeAreaId;
  pillar: PillarId;
  image: string;
  name: Localized;
  /** A qualifying line on what the area covers, shown beneath its name. */
  note?: Localized;
}

export const AREAS: PracticeArea[] = [
  { id: "corporate", pillar: "transactions", image: "/practice/boardroom.svg", name: { en: "Corporate and M&A", fr: "Sociétés et fusions-acquisitions" } },
  { id: "banking", pillar: "transactions", image: "/practice/finance.svg", name: { en: "Banking and finance", fr: "Banque et finance" } },
  { id: "infrastructure", pillar: "transactions", image: "/practice/port.svg", name: { en: "Infrastructure and energy", fr: "Infrastructures et énergie" } },
  { id: "litigation", pillar: "disputes", image: "/practice/courtroom.svg", name: { en: "Commercial litigation", fr: "Contentieux commercial" } },
  { id: "arbitration", pillar: "disputes", image: "/practice/arbitration.svg", name: { en: "Arbitration", fr: "Arbitrage" } },
  {
    id: "investigations",
    pillar: "disputes",
    image: "/practice/investigations.svg",
    name: { en: "Investigations", fr: "Enquêtes" },
    note: {
      en: "Internal, regulatory and cross-border investigations, including fraud, corruption and sanctions matters.",
      fr: "Enquêtes internes, réglementaires et transfrontalières, notamment en matière de fraude, de corruption et de sanctions.",
    },
  },
  { id: "trade", pillar: "international", image: "/practice/trade.svg", name: { en: "Trade and investment", fr: "Commerce et investissement" } },
  { id: "international-law", pillar: "international", image: "/practice/institution.svg", name: { en: "Public international law", fr: "Droit international public" } },
];

export function areaName(id: PracticeAreaId) {
  return AREAS.find((area) => area.id === id)!.name;
}
