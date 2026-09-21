export const NAV = [
  { label: "Practice areas", href: "#practice-areas" },
  { label: "Sectors", href: "#sectors" },
  { label: "People", href: "#people" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
] as const;

export type NavItem = (typeof NAV)[number];
