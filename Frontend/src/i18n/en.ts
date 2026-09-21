/**
 * English copy for the page and its interface. Content lists (practice areas,
 * people, matters, articles, map places) carry their own translations in their
 * data files.
 */
export const en = {
  language: { label: "Language", names: { en: "English", fr: "Français" } },
  nav: {
    items: [
      { label: "Practice areas", href: "#practice-areas" },
      { label: "Sectors", href: "#sectors" },
      { label: "People", href: "#people" },
      { label: "Insights", href: "#insights" },
      { label: "Contact", href: "#contact" },
    ],
    primary: "Primary",
    footer: "Footer",
    reach: "Our reach",
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    siteMenu: "Site menu",
    tagline: "Nairobi · Cross-border counsel",
    speak: "Speak to us",
  },
  hero: {
    eyebrow: "Nairobi · Cross-border counsel",
    headline: ["Commercially grounded", "counsel for Africa’s", "most complex matters."],
    support: "Advising on transactions, disputes and regulation across East Africa.",
    practice: "Practice areas",
    speak: "Speak to us",
  },
  positioning: {
    statement:
      "A modern African law firm delivering commercially grounded, cross-border advice for businesses, investors and institutions operating across Africa.",
    audience: "We also advise development organisations and diplomatic missions.",
    backdrop: "AFRICA",
    facts: [
      { label: "Base", value: "Headquartered in Nairobi" },
      { label: "Practice", value: "Transactions and disputes" },
      { label: "Reach", value: "Across Africa and beyond" },
    ],
  },
  practice: { title: "Practice areas" },
  kenya: {
    title: "Kenyan grounding",
    imageAlt: "The Nairobi skyline at dusk",
    panels: [
      { eyebrow: "01 · Foundation", lines: ["Kenya is", "our foundation."], support: "Rooted in Kenyan law, its courts and its regulators." },
      { eyebrow: "02 · Horizon", lines: ["Africa is our", "operating horizon."], support: "Advice built for matters that cross the continent’s borders." },
      { eyebrow: "03 · Standard", lines: ["International standards,", "throughout."], support: "Work that meets the expectations of global counterparties." },
    ],
  },
  reach: {
    title: "Reach",
    statement:
      "From Nairobi, across anglophone and francophone Africa, and into the forums where international matters are decided.",
    legend: { region: "Regional matters", francophone: "Francophone jurisdictions", forum: "Forums we appear before" },
    mapLabel:
      "A map of Africa with lines from Nairobi to the region, to francophone jurisdictions and to the forums the firm appears before",
  },
  people: {
    eyebrow: "People",
    title: "Our people",
    staffing:
      "Every mandate is led by a partner from first call to final outcome, with specialist counsel brought in as the matter demands.",
    viewProfile: ["View", "profile"],
    fullTeam: "The full team",
    portrait: "Portrait of",
    admitted: "Admitted",
    languages: "Languages",
    forums: "Forums",
  },
  experience: {
    eyebrow: "Experience",
    title: "Representative matters",
    synopsis:
      "A selection of our work across the three pillars, described without identifying our clients.",
    disclaimer:
      "These matters are representative only and are described without client identifiers. Some were handled by our lawyers before they joined the firm. Past results do not guarantee a similar outcome in any future matter.",
    sample: "Sample, not supplied by the firm",
  },
  insights: {
    title: "Insights",
    subtitle: "Legal analysis, alerts and publications.",
    archive: "The full archive",
    list: "Latest insights",
    publishedIn: "Published in",
    newTab: "opens in a new tab",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  contact: {
    title: "Tell us about the matter.",
    form: "Enquiry",
    fields: {
      name: { label: "Your name", error: "Please add your name." },
      email: { label: "Email address", error: "Please add an email address we can reply to." },
      organisation: { label: "Organisation", error: "" },
      matter: { label: "The matter, in a few lines", error: "Please tell us a little about the matter." },
    },
    emailInvalid: "That email address does not look complete.",
    optional: "(optional)",
    disclaimer:
      "Sending an enquiry does not create a lawyer–client relationship. Please do not include confidential information until we have confirmed that we can act for you.",
    send: "Send enquiry",
    sending: "Sending",
    thanks: "Thank you. Your message is with us.",
    followUp: "We will be in touch shortly.",
    failed: "Your message could not be sent. Please email us at",
    details: { office: "Office", phone: "Telephone", email: "Email", hours: "Office hours" },
  },
  footer: { backToTop: "Back to top" },
};

export type Dictionary = typeof en;
