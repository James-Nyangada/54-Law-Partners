import type { Localized } from "@/i18n/types";

/**
 * The firm's contact and regulatory details. Every value is a placeholder to
 * replace with the firm's confirmed information; none of it is real. French is
 * a draft for review.
 */
export const FIRM = {
  name: "54 Law Partners",
  address: { en: "Office address to confirm, Nairobi, Kenya", fr: "Adresse du bureau à confirmer, Nairobi, Kenya" } as Localized,
  phone: { display: "+254 000 000 000", href: "tel:+254000000000" },
  email: "contact@example.com",
  hours: { en: "Monday to Friday, hours to confirm", fr: "Du lundi au vendredi, horaires à confirmer" } as Localized,
  /** The practising statement the Law Society of Kenya requires. */
  practising: {
    en: "54 Law Partners is a firm of advocates practising in Kenya. [Practising and registration details to be confirmed with the Law Society of Kenya.]",
    fr: "54 Law Partners est un cabinet d’avocats exerçant au Kenya. [Informations d’exercice et d’enregistrement à confirmer auprès de la Law Society of Kenya.]",
  } as Localized,
};

export const LEGAL_LINKS: { label: Localized; href: string }[] = [
  { label: { en: "Privacy notice", fr: "Politique de confidentialité" }, href: "#contact" },
  { label: { en: "Terms of use", fr: "Conditions d’utilisation" }, href: "#contact" },
  { label: { en: "Cookie policy", fr: "Politique relative aux cookies" }, href: "#contact" },
];

/** Only shown if the firm has accounts. Example: { label: "LinkedIn", href: "https://..." } */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];
