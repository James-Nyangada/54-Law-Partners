import type { Localized } from "@/i18n/types";

/**
 * The three pillars and eight practice areas, as named in Site Map v1.0.
 *
 * Names and slugs are fixed by the site map. The descriptive copy (intro,
 * overview, clients, services) is a first draft for the firm to approve, in
 * English and French. Investigations carries a qualifying line pending
 * decision 01 of the site map.
 */

export type PillarId = "transactions" | "disputes" | "international";

export interface Pillar {
  id: PillarId;
  numeral: string;
  name: Localized;
  short: Localized;
}

export const PILLARS: Pillar[] = [
  {
    id: "transactions",
    numeral: "I",
    name: { en: "Transactions and advisory", fr: "Transactions et conseil" },
    short: { en: "Transactions", fr: "Transactions" },
  },
  {
    id: "disputes",
    numeral: "II",
    name: { en: "Disputes", fr: "Contentieux" },
    short: { en: "Disputes", fr: "Contentieux" },
  },
  {
    id: "international",
    numeral: "III",
    name: { en: "International law", fr: "Droit international" },
    short: { en: "International", fr: "International" },
  },
];

export type PracticeAreaId =
  | "corporate"
  | "banking"
  | "mergers"
  | "projects"
  | "trade"
  | "disputes"
  | "investigations"
  | "international";

export interface PracticeArea {
  id: PracticeAreaId;
  pillar: PillarId;
  slug: Localized;
  image: string;
  name: Localized;
  /** One word for tags and filters. */
  tag: Localized;
  /** Two sentences beneath the page title. */
  intro: Localized;
  /** A qualifying line on what the area covers (decision 01 for Investigations). */
  note?: Localized;
  overview: [Localized, Localized];
  clients: Localized[];
  services: Localized[];
  /** The call to action in the sidebar. */
  cta: Localized;
}

const CTA = {
  transactions: { en: "Discuss a transaction", fr: "Parler d’une opération" },
  disputes: { en: "Discuss a dispute", fr: "Parler d’un litige" },
  international: { en: "Discuss a matter", fr: "Parler d’un dossier" },
} satisfies Record<PillarId, Localized>;

export const AREAS: PracticeArea[] = [
  {
    id: "corporate",
    pillar: "transactions",
    slug: { en: "corporate-commercial-governance", fr: "societes-commercial-gouvernance" },
    image: "/images/boardroom.jpg",
    name: { en: "Corporate, Commercial & Governance", fr: "Droit des sociétés, commercial et gouvernance" },
    tag: { en: "Corporate", fr: "Sociétés" },
    intro: {
      en: "Day-to-day and board-level counsel for companies doing business in and across Africa. We advise on how businesses are structured, how they contract and how they are governed.",
      fr: "Un conseil au quotidien et au niveau du conseil d’administration pour les entreprises actives en Afrique. Nous accompagnons leur structuration, leurs contrats et leur gouvernance.",
    },
    overview: [
      {
        en: "Most of what a business needs from its lawyers happens away from the headline transaction: setting up the right vehicle, negotiating the contracts it trades on, and keeping its board and shareholders on a sound footing as it grows.",
        fr: "L’essentiel de ce qu’une entreprise attend de ses avocats se joue loin des grandes opérations : choisir la bonne structure, négocier les contrats qui la font vivre, et maintenir son conseil et ses actionnaires sur des bases solides à mesure qu’elle grandit.",
      },
      {
        en: "We give that advice with the commercial context in view, so that it can be acted on, and we stay with clients as their operations move into new jurisdictions.",
        fr: "Nous donnons ce conseil en gardant le contexte commercial à l’esprit, pour qu’il soit directement applicable, et nous accompagnons nos clients lorsque leurs activités s’étendent à de nouvelles juridictions.",
      },
    ],
    clients: [
      { en: "Founders and family-owned businesses", fr: "Fondateurs et entreprises familiales" },
      { en: "Multinationals entering the region", fr: "Groupes internationaux s’implantant dans la région" },
      { en: "Boards and company secretaries", fr: "Conseils d’administration et secrétaires généraux" },
      { en: "Investors and their portfolio companies", fr: "Investisseurs et leurs sociétés en portefeuille" },
    ],
    services: [
      { en: "Company formation, structuring and market entry", fr: "Constitution, structuration et implantation de sociétés" },
      { en: "Commercial contracts, distribution and supply arrangements", fr: "Contrats commerciaux, distribution et approvisionnement" },
      { en: "Shareholder agreements and joint ventures", fr: "Pactes d’actionnaires et coentreprises" },
      { en: "Board advisory, governance and compliance frameworks", fr: "Conseil aux organes de direction, gouvernance et conformité" },
      { en: "Restructuring and reorganisation of corporate groups", fr: "Restructuration et réorganisation de groupes de sociétés" },
    ],
    cta: CTA.transactions,
  },
  {
    id: "banking",
    pillar: "transactions",
    slug: { en: "banking-finance-investment", fr: "banque-finance-investissement" },
    image: "/images/tower.jpg",
    name: { en: "Banking, Finance & Investment", fr: "Banque, finance et investissement" },
    tag: { en: "Banking", fr: "Banque" },
    intro: {
      en: "Advice to lenders, borrowers and investors on how capital moves into and across African markets, from bilateral facilities to structured and development finance.",
      fr: "Conseil aux prêteurs, emprunteurs et investisseurs sur la circulation des capitaux vers et entre les marchés africains, des financements bilatéraux à la finance structurée et au financement du développement.",
    },
    overview: [
      {
        en: "Finance in the region rarely sits within one legal system. Security may be taken in one country, the borrower incorporated in another and the lenders based offshore, each with its own rules on enforceability, currency and regulatory approval.",
        fr: "Dans la région, un financement relève rarement d’un seul système juridique. Les sûretés peuvent être prises dans un pays, l’emprunteur immatriculé dans un autre et les prêteurs établis à l’étranger, chacun avec ses règles d’opposabilité, de change et d’autorisation.",
      },
      {
        en: "We work through those layers so that documents hold up where they need to, and so that our clients understand the risks they are pricing.",
        fr: "Nous traitons ces différentes couches pour que la documentation tienne là où elle doit tenir, et pour que nos clients mesurent les risques qu’ils intègrent à leurs conditions.",
      },
    ],
    clients: [
      { en: "Commercial and investment banks", fr: "Banques commerciales et d’investissement" },
      { en: "Development finance institutions", fr: "Institutions de financement du développement" },
      { en: "Corporate borrowers", fr: "Emprunteurs institutionnels et entreprises" },
      { en: "Funds and institutional investors", fr: "Fonds et investisseurs institutionnels" },
    ],
    services: [
      { en: "Bilateral and syndicated lending", fr: "Financements bilatéraux et syndiqués" },
      { en: "Security packages and enforcement", fr: "Sûretés et réalisation des garanties" },
      { en: "Development and blended finance", fr: "Financement du développement et financement mixte" },
      { en: "Financial services regulation and licensing", fr: "Réglementation et agréments des services financiers" },
      { en: "Inward investment structuring", fr: "Structuration des investissements entrants" },
    ],
    cta: CTA.transactions,
  },
  {
    id: "mergers",
    pillar: "transactions",
    slug: { en: "mergers-acquisitions-private-equity", fr: "fusions-acquisitions-capital-investissement" },
    image: "/images/office-night.jpg",
    name: { en: "Mergers, Acquisitions & Private Equity", fr: "Fusions-acquisitions et capital-investissement" },
    tag: { en: "Mergers", fr: "Fusions" },
    intro: {
      en: "Acquisitions, disposals and investments in African businesses, handled from first approach to completion. We act for buyers, sellers, funds and management teams.",
      fr: "Acquisitions, cessions et prises de participation dans des entreprises africaines, de la première approche jusqu’au closing. Nous intervenons pour les acquéreurs, les cédants, les fonds et les équipes dirigeantes.",
    },
    overview: [
      {
        en: "A transaction in the region turns as much on approvals, local ownership rules and the realities of diligence as on the share purchase agreement. Those questions decide the timetable, and often the price.",
        fr: "Dans la région, une opération dépend autant des autorisations, des règles locales de détention du capital et des réalités de l’audit que du contrat de cession. Ces questions déterminent le calendrier, et souvent le prix.",
      },
      {
        en: "We identify them early, run diligence that is proportionate to the risk, and negotiate documents that reflect how the deal will actually be completed.",
        fr: "Nous les identifions tôt, menons un audit proportionné aux risques et négocions une documentation fidèle à la manière dont l’opération sera réellement conclue.",
      },
    ],
    clients: [
      { en: "Strategic acquirers", fr: "Acquéreurs industriels" },
      { en: "Private equity and venture funds", fr: "Fonds de capital-investissement et de capital-risque" },
      { en: "Founders and selling shareholders", fr: "Fondateurs et actionnaires cédants" },
      { en: "Management teams", fr: "Équipes dirigeantes" },
    ],
    services: [
      { en: "Share and asset acquisitions and disposals", fr: "Acquisitions et cessions de titres et d’actifs" },
      { en: "Private equity investments and exits", fr: "Investissements et sorties en capital-investissement" },
      { en: "Legal due diligence", fr: "Audit juridique" },
      { en: "Merger control and regulatory approvals", fr: "Contrôle des concentrations et autorisations réglementaires" },
      { en: "Management and co-investment arrangements", fr: "Accords de management et de co-investissement" },
    ],
    cta: CTA.transactions,
  },
  {
    id: "projects",
    pillar: "transactions",
    slug: { en: "projects-infrastructure-energy", fr: "projets-infrastructures-energie" },
    image: "/images/energy.jpg",
    name: { en: "Projects, Infrastructure & Energy", fr: "Projets, infrastructures et énergie" },
    tag: { en: "Projects", fr: "Projets" },
    intro: {
      en: "Counsel on the projects that build the region’s power, transport and public services, across the full life of the asset.",
      fr: "Conseil sur les projets qui construisent l’énergie, les transports et les services publics de la région, sur toute la durée de vie de l’actif.",
    },
    overview: [
      {
        en: "Infrastructure is long-term by nature. The contracts signed at the outset must still work twenty years later, through changes of government, of law and of market.",
        fr: "Une infrastructure s’inscrit par nature dans la durée. Les contrats signés au départ doivent encore fonctionner vingt ans plus tard, malgré les changements de gouvernement, de droit et de marché.",
      },
      {
        en: "We advise sponsors, lenders, contractors and public bodies on how that risk is allocated, and on the approvals and concessions that make a project bankable.",
        fr: "Nous conseillons promoteurs, prêteurs, entreprises de construction et entités publiques sur la répartition de ces risques, ainsi que sur les autorisations et concessions qui rendent un projet finançable.",
      },
    ],
    clients: [
      { en: "Project sponsors and developers", fr: "Promoteurs et développeurs de projets" },
      { en: "Lenders and export credit agencies", fr: "Prêteurs et agences de crédit à l’exportation" },
      { en: "Contractors and operators", fr: "Entreprises de construction et exploitants" },
      { en: "Governments and public bodies", fr: "États et entités publiques" },
    ],
    services: [
      { en: "Public–private partnerships and concessions", fr: "Partenariats public-privé et concessions" },
      { en: "Power and renewable energy projects", fr: "Projets électriques et d’énergies renouvelables" },
      { en: "Construction and engineering contracts", fr: "Contrats de construction et d’ingénierie" },
      { en: "Project finance documentation", fr: "Documentation de financement de projet" },
      { en: "Permitting, land and regulatory approvals", fr: "Permis, foncier et autorisations réglementaires" },
    ],
    cta: CTA.transactions,
  },
  {
    id: "trade",
    pillar: "transactions",
    slug: { en: "international-trade-investment", fr: "commerce-international-investissement" },
    image: "/images/port.jpg",
    name: {
      en: "International Trade, Investment & Regulatory Advisory",
      fr: "Commerce international, investissement et conseil réglementaire",
    },
    tag: { en: "Trade", fr: "Commerce" },
    intro: {
      en: "Advice on the rules that govern trade and investment across borders, and on dealing with the regulators who apply them.",
      fr: "Conseil sur les règles qui encadrent le commerce et l’investissement transfrontaliers, et sur les relations avec les autorités qui les appliquent.",
    },
    overview: [
      {
        en: "Regional integration has opened markets, but goods, capital and services still cross a mesh of national rules, regional commitments and investment treaties.",
        fr: "L’intégration régionale a ouvert les marchés, mais les biens, les capitaux et les services franchissent encore un maillage de règles nationales, d’engagements régionaux et de traités d’investissement.",
      },
      {
        en: "We help clients understand where they stand under that framework, protect their investments, and engage with regulators before problems become disputes.",
        fr: "Nous aidons nos clients à situer leur position dans ce cadre, à protéger leurs investissements et à dialoguer avec les régulateurs avant que les difficultés ne deviennent des litiges.",
      },
    ],
    clients: [
      { en: "Exporters and importers", fr: "Exportateurs et importateurs" },
      { en: "Foreign investors", fr: "Investisseurs étrangers" },
      { en: "Regulated businesses", fr: "Entreprises réglementées" },
      { en: "Industry associations", fr: "Organisations professionnelles" },
    ],
    services: [
      { en: "Regional trade regimes and market access", fr: "Régimes commerciaux régionaux et accès aux marchés" },
      { en: "Investment treaty protection and structuring", fr: "Protection et structuration au titre des traités d’investissement" },
      { en: "Customs, tariffs and trade remedies", fr: "Douanes, tarifs et mesures de défense commerciale" },
      { en: "Regulatory licensing and engagement", fr: "Agréments et relations avec les régulateurs" },
      { en: "Sanctions and export controls", fr: "Sanctions et contrôle des exportations" },
    ],
    cta: CTA.transactions,
  },
  {
    id: "disputes",
    pillar: "disputes",
    slug: { en: "litigation-arbitration-adr", fr: "contentieux-arbitrage-modes-alternatifs" },
    image: "/images/columns.jpg",
    name: {
      en: "Litigation, Arbitration & Alternative Dispute Resolution",
      fr: "Contentieux, arbitrage et modes alternatifs de règlement des différends",
    },
    tag: { en: "Disputes", fr: "Contentieux" },
    intro: {
      en: "Representation in commercial disputes before national courts, arbitral tribunals and mediators, with strategy set by what the client needs the outcome to achieve.",
      fr: "Représentation dans les litiges commerciaux devant les juridictions nationales, les tribunaux arbitraux et les médiateurs, avec une stratégie fixée par ce que le client attend de l’issue.",
    },
    overview: [
      {
        en: "The right forum, and the right moment to settle, are decided early. We assess a dispute on its merits and on its commercial consequences, and advise plainly on both.",
        fr: "Le choix du bon forum, et du bon moment pour transiger, se fait tôt. Nous évaluons un litige sur le fond comme sur ses conséquences commerciales, et nous nous prononçons clairement sur les deux.",
      },
      {
        en: "When a matter must be fought, we prepare it thoroughly and see it through, including the enforcement of judgments and awards across borders.",
        fr: "Lorsqu’un dossier doit être plaidé, nous le préparons avec rigueur et le menons à son terme, y compris l’exécution transfrontalière des jugements et sentences.",
      },
    ],
    clients: [
      { en: "Companies in commercial disputes", fr: "Entreprises en litige commercial" },
      { en: "Financial institutions", fr: "Établissements financiers" },
      { en: "Contractors and employers on major projects", fr: "Entrepreneurs et maîtres d’ouvrage de grands projets" },
      { en: "States and state-owned entities", fr: "États et entreprises publiques" },
    ],
    services: [
      { en: "Commercial litigation in the courts", fr: "Contentieux commercial devant les juridictions" },
      { en: "Institutional and ad hoc arbitration", fr: "Arbitrage institutionnel et ad hoc" },
      { en: "Mediation and negotiated settlement", fr: "Médiation et règlement négocié" },
      { en: "Interim relief and urgent applications", fr: "Mesures provisoires et procédures d’urgence" },
      { en: "Recognition and enforcement of judgments and awards", fr: "Reconnaissance et exécution des jugements et sentences" },
    ],
    cta: CTA.disputes,
  },
  {
    id: "investigations",
    pillar: "disputes",
    slug: { en: "investigations", fr: "enquetes" },
    image: "/images/library.jpg",
    name: { en: "Investigations", fr: "Enquêtes" },
    tag: { en: "Investigations", fr: "Enquêtes" },
    note: {
      en: "Internal and regulatory investigations, including allegations of fraud, corruption and misconduct.",
      fr: "Enquêtes internes et réglementaires, notamment en matière de fraude, de corruption et de manquements.",
    },
    intro: {
      en: "Discreet, independent investigations for boards, institutions and their advisers when serious allegations arise.",
      fr: "Des enquêtes discrètes et indépendantes pour les conseils d’administration, les institutions et leurs conseils lorsque surviennent des allégations sérieuses.",
    },
    overview: [
      {
        en: "When an allegation surfaces, the first decisions shape everything that follows: who leads the inquiry, how evidence is preserved, and what must be reported, and to whom.",
        fr: "Lorsqu’une allégation apparaît, les premières décisions conditionnent tout le reste : qui conduit l’enquête, comment préserver les preuves, et ce qui doit être signalé, et à qui.",
      },
      {
        en: "We run investigations that establish the facts with care and stand up to scrutiny, and advise on the regulatory and litigation consequences of what they find.",
        fr: "Nous menons des enquêtes qui établissent les faits avec soin et résistent à l’examen, et nous conseillons sur les conséquences réglementaires et contentieuses de leurs conclusions.",
      },
    ],
    clients: [
      { en: "Boards and audit committees", fr: "Conseils d’administration et comités d’audit" },
      { en: "Development organisations", fr: "Organisations de développement" },
      { en: "Regulated financial institutions", fr: "Établissements financiers réglementés" },
      { en: "General counsel and compliance teams", fr: "Directions juridiques et équipes conformité" },
    ],
    services: [
      { en: "Internal investigations", fr: "Enquêtes internes" },
      { en: "Regulatory inquiries and self-reporting", fr: "Enquêtes réglementaires et déclarations spontanées" },
      { en: "Anti-bribery and corruption compliance", fr: "Conformité anticorruption" },
      { en: "Whistleblower and misconduct reviews", fr: "Traitement des alertes et des manquements" },
      { en: "Asset tracing and recovery", fr: "Recherche et recouvrement d’actifs" },
    ],
    cta: CTA.disputes,
  },
  {
    id: "international",
    pillar: "international",
    slug: { en: "public-international-law", fr: "droit-international-public" },
    image: "/images/peace-palace.jpg",
    name: {
      en: "Public International Law, Human Rights & Dispute Settlement",
      fr: "Droit international public, droits humains et règlement des différends",
    },
    tag: { en: "Public international", fr: "International public" },
    intro: {
      en: "Advice and advocacy for states, institutions and investors on questions of international law, and before the forums where they are decided.",
      fr: "Conseil et représentation des États, des institutions et des investisseurs sur les questions de droit international, et devant les instances qui les tranchent.",
    },
    overview: [
      {
        en: "Questions of treaty, immunity, sovereignty and human rights arise more often in commercial life than is commonly assumed, and in the region they are frequently decisive.",
        fr: "Les questions de traités, d’immunités, de souveraineté et de droits humains se posent plus souvent qu’on ne le croit dans la vie des affaires, et elles sont souvent décisives dans la région.",
      },
      {
        en: "We advise on them with an African perspective and appear before regional and international bodies on behalf of our clients.",
        fr: "Nous les traitons avec une perspective africaine et intervenons devant les instances régionales et internationales pour le compte de nos clients.",
      },
    ],
    clients: [
      { en: "Governments and state agencies", fr: "Gouvernements et administrations" },
      { en: "Diplomatic missions", fr: "Missions diplomatiques" },
      { en: "International and regional organisations", fr: "Organisations internationales et régionales" },
      { en: "Investors in treaty disputes", fr: "Investisseurs parties à des différends conventionnels" },
    ],
    services: [
      { en: "Treaty interpretation and advice", fr: "Interprétation et conseil en matière de traités" },
      { en: "State and diplomatic immunity", fr: "Immunités des États et immunités diplomatiques" },
      { en: "Investor–state dispute settlement", fr: "Règlement des différends entre investisseurs et États" },
      { en: "Human rights advisory and litigation", fr: "Conseil et contentieux en droits humains" },
      { en: "Proceedings before regional courts", fr: "Procédures devant les juridictions régionales" },
    ],
    cta: CTA.international,
  },
];

export function getArea(id: PracticeAreaId): PracticeArea {
  return AREAS.find((area) => area.id === id)!;
}

export function getPillar(id: PillarId): Pillar {
  return PILLARS.find((pillar) => pillar.id === id)!;
}

export function areasInPillar(id: PillarId): PracticeArea[] {
  return AREAS.filter((area) => area.pillar === id);
}

/** Two-digit number in navigation order: 01 to 08. */
export function areaNumber(id: PracticeAreaId): string {
  return String(AREAS.findIndex((area) => area.id === id) + 1).padStart(2, "0");
}
