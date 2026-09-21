import type { Localized } from "@/i18n/types";
import type { PracticeAreaId } from "@/components/practice/data";

/**
 * Representative matters. THE FIRM SUPPLIES THESE: add four to six entries to
 * MATTERS, described without client identifiers.
 *
 * Until it does, development builds show SAMPLE_MATTERS, each visibly marked as
 * a sample, so the section can be reviewed. Production builds never render the
 * samples; with no supplied matters the section is left out entirely.
 */
export interface Matter {
  id: string;
  practice: PracticeAreaId;
  summary: Localized;
  /** Optional context line, such as the jurisdictions or forum involved. */
  context?: Localized;
}

export const MATTERS: Matter[] = [];

export const SAMPLE_MATTERS: Matter[] = [
  { id: "s1", practice: "corporate",
    summary: { en: "Advised on the acquisition of a regional logistics business across three jurisdictions.", fr: "Conseil sur l’acquisition d’un groupe logistique régional présent dans trois juridictions." },
    context: { en: "Kenya, Uganda, Rwanda", fr: "Kenya, Ouganda, Rwanda" } },
  { id: "s2", practice: "arbitration",
    summary: { en: "Represented a contractor in an institutional arbitration over an infrastructure project.", fr: "Représentation d’un entrepreneur dans un arbitrage institutionnel portant sur un projet d’infrastructure." },
    context: { en: "Seat in a francophone jurisdiction", fr: "Siège dans une juridiction francophone" } },
  { id: "s3", practice: "investigations",
    summary: { en: "Led an internal investigation into procurement irregularities for a development organisation.", fr: "Direction d’une enquête interne sur des irrégularités de passation de marchés pour une organisation de développement." } },
  { id: "s4", practice: "banking",
    summary: { en: "Acted for lenders on a cross-border facility secured over assets in two countries.", fr: "Conseil des prêteurs sur un financement transfrontalier garanti par des actifs situés dans deux pays." } },
  { id: "s5", practice: "international-law",
    summary: { en: "Advised a diplomatic mission on immunities in a commercial dispute.", fr: "Conseil d’une mission diplomatique sur les immunités dans un litige commercial." } },
];
