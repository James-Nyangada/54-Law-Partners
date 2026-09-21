import type { Dictionary } from "./en";

/**
 * French copy. A working draft: have it reviewed by a French-speaking lawyer
 * before launch, particularly the legal notices and the disclaimer.
 */
export const fr: Dictionary = {
  language: { label: "Langue", names: { en: "English", fr: "Français" } },
  nav: {
    items: [
      { label: "Expertises", href: "#practice-areas" },
      { label: "Secteurs", href: "#sectors" },
      { label: "Équipe", href: "#people" },
      { label: "Analyses", href: "#insights" },
      { label: "Contact", href: "#contact" },
    ],
    primary: "Navigation principale",
    footer: "Pied de page",
    reach: "Notre présence",
    menu: "Menu",
    close: "Fermer",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    siteMenu: "Menu du site",
    tagline: "Nairobi · Conseil transfrontalier",
    speak: "Nous contacter",
  },
  hero: {
    eyebrow: "Nairobi · Conseil transfrontalier",
    headline: ["Un conseil d’affaires", "pour les dossiers", "africains complexes."],
    support: "Transactions, contentieux et réglementation en Afrique de l’Est.",
    practice: "Domaines d’expertise",
    speak: "Nous contacter",
  },
  positioning: {
    statement:
      "Un cabinet d’avocats africain moderne, qui apporte un conseil transfrontalier ancré dans la réalité des affaires aux entreprises, investisseurs et institutions actifs à travers l’Afrique.",
    audience: "Nous conseillons également des organisations de développement et des missions diplomatiques.",
    backdrop: "AFRIQUE",
    facts: [
      { label: "Siège", value: "Basés à Nairobi" },
      { label: "Pratique", value: "Transactions et contentieux" },
      { label: "Portée", value: "En Afrique et au-delà" },
    ],
  },
  practice: { title: "Domaines d’expertise" },
  kenya: {
    title: "Ancrage kényan",
    imageAlt: "La ligne d’horizon de Nairobi au crépuscule",
    panels: [
      { eyebrow: "01 · Fondation", lines: ["Le Kenya est", "notre fondation."], support: "Ancrés dans le droit kényan, ses juridictions et ses régulateurs." },
      { eyebrow: "02 · Horizon", lines: ["L’Afrique est notre", "horizon d’action."], support: "Un conseil conçu pour les dossiers qui traversent les frontières du continent." },
      { eyebrow: "03 · Exigence", lines: ["Des standards", "internationaux, partout."], support: "Un travail à la hauteur des attentes des contreparties internationales." },
    ],
  },
  reach: {
    title: "Présence",
    statement:
      "Depuis Nairobi, à travers l’Afrique anglophone et francophone, jusqu’aux instances où se tranchent les dossiers internationaux.",
    legend: { region: "Dossiers régionaux", francophone: "Juridictions francophones", forum: "Instances devant lesquelles nous intervenons" },
    mapLabel:
      "Carte de l’Afrique reliant Nairobi à la région, aux juridictions francophones et aux instances devant lesquelles le cabinet intervient",
  },
  people: {
    eyebrow: "Équipe",
    title: "Notre équipe",
    staffing:
      "Chaque dossier est dirigé par un associé, du premier échange jusqu’à son issue, avec des conseils spécialisés mobilisés selon les besoins.",
    viewProfile: ["Voir le", "profil"],
    fullTeam: "Toute l’équipe",
    portrait: "Portrait de",
    admitted: "Barreaux",
    languages: "Langues",
    forums: "Instances",
  },
  experience: {
    eyebrow: "Expérience",
    title: "Dossiers représentatifs",
    synopsis:
      "Une sélection de nos travaux dans nos trois pôles, présentés sans identifier nos clients.",
    disclaimer:
      "Ces dossiers sont présentés à titre indicatif, sans éléments permettant d’identifier nos clients. Certains ont été traités par nos avocats avant leur arrivée au cabinet. Les résultats passés ne préjugent pas de l’issue d’un dossier futur.",
    sample: "Exemple, non fourni par le cabinet",
  },
  insights: {
    title: "Analyses",
    subtitle: "Analyses juridiques, alertes et publications.",
    archive: "Toutes les publications",
    list: "Dernières publications",
    publishedIn: "Publié dans",
    newTab: "s’ouvre dans un nouvel onglet",
    months: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  },
  contact: {
    title: "Parlez-nous de votre dossier.",
    form: "Demande",
    fields: {
      name: { label: "Votre nom", error: "Merci d’indiquer votre nom." },
      email: { label: "Adresse e-mail", error: "Merci d’indiquer une adresse e-mail pour vous répondre." },
      organisation: { label: "Organisation", error: "" },
      matter: { label: "Votre dossier, en quelques lignes", error: "Merci de décrire brièvement votre dossier." },
    },
    emailInvalid: "Cette adresse e-mail semble incomplète.",
    optional: "(facultatif)",
    disclaimer:
      "L’envoi d’une demande ne crée pas de relation avocat-client. Merci de ne transmettre aucune information confidentielle avant que nous ayons confirmé pouvoir vous représenter.",
    send: "Envoyer la demande",
    sending: "Envoi en cours",
    thanks: "Merci. Votre message nous est bien parvenu.",
    followUp: "Nous reviendrons vers vous rapidement.",
    failed: "Votre message n’a pas pu être envoyé. Écrivez-nous à",
    details: { office: "Bureau", phone: "Téléphone", email: "E-mail", hours: "Horaires" },
  },
  footer: { backToTop: "Haut de page" },
};
