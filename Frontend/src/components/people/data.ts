import type { Localized } from "@/i18n/types";
import type { PracticeAreaId } from "@/components/practice/data";

/**
 * The lawyers. Everything here is a placeholder to replace with the firm's own
 * details; the French is a draft for review. Adding people needs no other
 * change: from three people on, the section becomes a four-column grid.
 */
export interface Person {
  id: string;
  name: Localized;
  role: Localized;
  /** Practice tags, by practice area. */
  practices: PracticeAreaId[];
  /** Jurisdictions of admission. */
  admitted: Localized;
  languages: Localized;
  /** Courts, tribunals and institutions the lawyer appears before. */
  forums: Localized;
  portrait: string;
  /** Where "View profile" leads. No profile pages exist yet. */
  href: string;
}

export const PEOPLE: Person[] = [
  {
    id: "partner-1",
    name: { en: "Partner name", fr: "Nom de l’associé" },
    role: { en: "Managing Partner", fr: "Associé gérant" },
    practices: ["corporate", "banking", "infrastructure"],
    admitted: { en: "Kenya; England and Wales", fr: "Kenya ; Angleterre et pays de Galles" },
    languages: { en: "English, Kiswahili", fr: "Anglais, kiswahili" },
    forums: { en: "High Court of Kenya; LCIA", fr: "Haute Cour du Kenya ; LCIA" },
    portrait: "/people/partner-1.svg",
    href: "#people",
  },
  {
    id: "partner-2",
    name: { en: "Partner name", fr: "Nom de l’associée" },
    role: { en: "Partner", fr: "Associée" },
    practices: ["arbitration", "investigations", "international-law"],
    admitted: { en: "Kenya; Rwanda", fr: "Kenya ; Rwanda" },
    languages: { en: "English, French, Kiswahili", fr: "Anglais, français, kiswahili" },
    forums: { en: "ICC; East African Court of Justice; CCJA (OHADA)", fr: "CCI ; Cour de justice de l’Afrique de l’Est ; CCJA (OHADA)" },
    portrait: "/people/partner-2.svg",
    href: "#people",
  },
];
