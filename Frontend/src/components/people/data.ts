/**
 * The lawyers. Placeholder names and details: replace with the firm's own.
 * Adding people needs no other change; from three people on, the section
 * switches to a four-column grid with the same animation.
 */
export interface Person {
  name: string;
  role: string;
  tags: string[];
  portrait: string;
  /** Where "View profile" leads. No profile pages exist yet. */
  href: string;
}

export const PEOPLE: Person[] = [
  {
    name: "Partner name",
    role: "Managing Partner",
    tags: ["Corporate and M&A", "Banking and finance", "Infrastructure"],
    portrait: "/people/partner-1.svg",
    href: "#people",
  },
  {
    name: "Partner name",
    role: "Partner",
    tags: ["Arbitration", "Commercial litigation", "Public international law"],
    portrait: "/people/partner-2.svg",
    href: "#people",
  },
];

/** Placeholder wording for the staffing line; confirm with the firm. */
export const STAFFING_LINE =
  "Every mandate is led by a partner from first call to final outcome, with specialist counsel brought in as the matter demands.";
