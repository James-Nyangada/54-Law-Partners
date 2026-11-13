import type { Localized } from "@/i18n/types";

/**
 * The firm's contact and regulatory details. FIRM TO SUPPLY every optional
 * value. Anything left undefined is simply not shown: the site never displays
 * an invented address, number or email.
 */
export const FIRM: {
  /** Site map decision 06: confirm the registered name. */
  name: string;
  city: Localized;
  street?: Localized;
  phone?: { display: string; href: string };
  email?: string;
  careersEmail?: string;
  hours?: Localized;
  /** The practising statement, e.g. regulator and registration details. */
  practising?: Localized;
  /** Wording the firm supplies for the notice beneath the enquiry form. */
  enquiryNotice?: Localized;
  /** Wording the firm supplies beneath representative matters. */
  mattersDisclaimer?: Localized;
  /** Wording the firm supplies at the foot of each article. */
  articleDisclaimer?: Localized;
  social: { label: string; href: string }[];
} = {
  name: "54 Law Partners",
  city: { en: "Nairobi, Kenya", fr: "Nairobi, Kenya" },
  social: [],
};

/** Nairobi, for the location plate on the contact page. */
export const NAIROBI_COORDS = "1.2921° S, 36.8219° E";
