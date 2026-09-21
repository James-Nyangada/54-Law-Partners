/**
 * The firm's contact and regulatory details. Every value here is a placeholder
 * to be replaced with the firm's confirmed information; none of it is real.
 */
export const FIRM = {
  name: "54 Law Partners",
  address: ["Office address to confirm", "Nairobi, Kenya"],
  phone: { display: "+254 000 000 000", href: "tel:+254000000000" },
  email: "contact@example.com",
  hours: "Monday to Friday, hours to confirm",
  /** The practising statement the Law Society of Kenya requires. */
  practising:
    "54 Law Partners is a firm of advocates practising in Kenya. [Practising and registration details to be confirmed with the Law Society of Kenya.]",
};

export const LEGAL_LINKS = [
  { label: "Privacy notice", href: "#contact" },
  { label: "Terms of use", href: "#contact" },
  { label: "Cookie policy", href: "#contact" },
];

/** Only shown if the firm has accounts. Example: { label: "LinkedIn", href: "https://..." } */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];
