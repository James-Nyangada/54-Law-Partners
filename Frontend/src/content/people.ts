import type { Localized } from "@/i18n/types";
import type { PracticeAreaId } from "./practice";
import { SHOW_SAMPLES } from "./samples";

/**
 * The lawyers. Two profiles at launch (site map decision 05).
 *
 * FIRM TO SUPPLY: every value marked below. Names, admissions, forums and
 * languages are placeholders and must be replaced before launch. Adding a
 * person needs no other change: from three people on the grid fills out, and
 * the directory filters switch on at five.
 */
export interface Person {
  id: string;
  /** The address: /people/[slug]. Use the lawyer's name, lowercase, hyphenated. */
  slug: string;
  name: string;
  role: Localized;
  seniority: "partner" | "counsel" | "associate";
  practices: PracticeAreaId[];
  admitted: Localized;
  forums: Localized;
  languages: Localized;
  email?: string;
  phone?: string;
  /** A portrait photograph, 4:5. Until supplied, a plate is shown. */
  portrait?: string;
  /** A CV for download, as a PDF in /public. */
  cv?: string;
}

export interface Profile {
  bio: [Localized, Localized];
  education: { year: string; text: Localized }[];
  publications: Localized[];
}

export const PEOPLE: Person[] = [
  {
    id: "partner-one",
    slug: "partner-one", // FIRM TO SUPPLY
    name: "Partner Name", // FIRM TO SUPPLY
    role: { en: "Managing Partner", fr: "Associé gérant" }, // FIRM TO SUPPLY
    seniority: "partner",
    practices: ["mergers", "corporate", "banking"],
    admitted: { en: "Kenya", fr: "Kenya" }, // FIRM TO SUPPLY
    forums: { en: "High Court of Kenya; Court of Appeal", fr: "Haute Cour du Kenya ; Cour d’appel" }, // FIRM TO SUPPLY
    languages: { en: "English, Kiswahili", fr: "Anglais, kiswahili" }, // FIRM TO SUPPLY
  },
  {
    id: "partner-two",
    slug: "partner-two", // FIRM TO SUPPLY
    name: "Partner Name", // FIRM TO SUPPLY
    role: { en: "Partner", fr: "Associée" }, // FIRM TO SUPPLY
    seniority: "partner",
    practices: ["disputes", "investigations", "international"],
    admitted: { en: "Kenya", fr: "Kenya" }, // FIRM TO SUPPLY
    forums: { en: "East African Court of Justice; ICC arbitration", fr: "Cour de justice de l’Afrique de l’Est ; arbitrage CCI" }, // FIRM TO SUPPLY
    languages: { en: "English, French, Kiswahili", fr: "Anglais, français, kiswahili" }, // FIRM TO SUPPLY
  },
];

/** Biographies, education and publications. Samples until the firm supplies them. */
const PROFILES: Record<string, Profile> = {};

const SAMPLE_PROFILES: Record<string, Profile> = {
  "partner-one": {
    bio: [
      {
        en: "Advises companies, investors and lenders on acquisitions, investments and financings across East Africa, with a particular focus on transactions that require regulatory approval in more than one jurisdiction.",
        fr: "Conseille les entreprises, investisseurs et prêteurs sur des acquisitions, investissements et financements en Afrique de l’Est, en particulier sur les opérations soumises à autorisation dans plusieurs juridictions.",
      },
      {
        en: "Leads the firm’s transactional practice and acts as counsel to boards on governance and strategic matters.",
        fr: "Dirige la pratique transactionnelle du cabinet et conseille les conseils d’administration sur les questions de gouvernance et de stratégie.",
      },
    ],
    education: [
      { year: "—", text: { en: "Bachelor of Laws", fr: "Licence en droit" } },
      { year: "—", text: { en: "Postgraduate Diploma in Law, Kenya School of Law", fr: "Diplôme d’études supérieures en droit, Kenya School of Law" } },
      { year: "—", text: { en: "Admitted as an Advocate of the High Court of Kenya", fr: "Admis comme avocat près la Haute Cour du Kenya" } },
    ],
    publications: [
      { en: "Structuring cross-border acquisitions into East Africa", fr: "Structurer les acquisitions transfrontalières en Afrique de l’Est" },
    ],
  },
  "partner-two": {
    bio: [
      {
        en: "Represents companies, institutions and states in commercial arbitration, litigation and international proceedings, and conducts internal investigations for boards and development organisations.",
        fr: "Représente des entreprises, des institutions et des États dans des arbitrages commerciaux, des contentieux et des procédures internationales, et conduit des enquêtes internes pour des conseils d’administration et des organisations de développement.",
      },
      {
        en: "Works in English and French, and advises clients with interests in both anglophone and francophone jurisdictions.",
        fr: "Travaille en anglais et en français, et conseille des clients ayant des intérêts dans des juridictions anglophones comme francophones.",
      },
    ],
    education: [
      { year: "—", text: { en: "Bachelor of Laws", fr: "Licence en droit" } },
      { year: "—", text: { en: "Master of Laws, international dispute settlement", fr: "Master en droit, règlement international des différends" } },
      { year: "—", text: { en: "Admitted as an Advocate of the High Court of Kenya", fr: "Admise comme avocate près la Haute Cour du Kenya" } },
    ],
    publications: [
      { en: "Choosing a seat for African commercial arbitration", fr: "Choisir le siège d’un arbitrage commercial africain" },
    ],
  },
};

export function getPerson(slug: string): Person | undefined {
  return PEOPLE.find((person) => person.slug === slug);
}

export function getPersonById(id: string): Person | undefined {
  return PEOPLE.find((person) => person.id === id);
}

export function getProfile(id: string): Profile | undefined {
  return PROFILES[id] ?? (SHOW_SAMPLES ? SAMPLE_PROFILES[id] : undefined);
}

export function peopleInArea(area: PracticeAreaId): Person[] {
  return PEOPLE.filter((person) => person.practices.includes(area));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
