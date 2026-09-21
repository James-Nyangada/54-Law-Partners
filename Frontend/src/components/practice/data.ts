/**
 * The three pillars and seven practice areas.
 *
 * The pillars come from the design spec. The seven area names and their
 * grouping are placeholders to confirm against the firm's proposal. Images are
 * generated placeholders; swap each `image` for a photograph at the same path.
 */

export const PILLARS = [
  { id: "transactions", name: "Transactions and advisory", short: "Transactions" },
  { id: "disputes", name: "Disputes", short: "Disputes" },
  { id: "international", name: "International law", short: "International" },
] as const;

export type PillarId = (typeof PILLARS)[number]["id"];

export interface PracticeArea {
  name: string;
  pillar: PillarId;
  image: string;
}

export const AREAS: PracticeArea[] = [
  { name: "Corporate and M&A", pillar: "transactions", image: "/practice/boardroom.svg" },
  { name: "Banking and finance", pillar: "transactions", image: "/practice/finance.svg" },
  { name: "Infrastructure and energy", pillar: "transactions", image: "/practice/port.svg" },
  { name: "Commercial litigation", pillar: "disputes", image: "/practice/courtroom.svg" },
  { name: "Arbitration", pillar: "disputes", image: "/practice/arbitration.svg" },
  { name: "Trade and investment", pillar: "international", image: "/practice/trade.svg" },
  { name: "Public international law", pillar: "international", image: "/practice/institution.svg" },
];
