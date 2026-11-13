import type { Localized } from "@/i18n/types";
import type { PracticeAreaId } from "./practice";
import { withSamples } from "./samples";

/**
 * Insights: the content contract the publishing dashboard (Admin/) must deliver.
 *
 *   type "article"   The firm's own writing, with its own page on this site.
 *   type "external"  A piece published elsewhere. The card names the
 *                    publication, carries an outward arrow and opens the
 *                    publisher's page. Dashed outline, per the UI kit.
 *
 * Article bodies are English. Site map decision 04 is open: if the firm
 * publishes in French, fill `bodyFr` and the French page uses it.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "brief" };

export interface Insight {
  id: string;
  type: "article" | "external";
  slug: Localized;
  date: string;
  practice: PracticeAreaId;
  title: Localized;
  standfirst: Localized;
  image: string;
  author?: string;
  source?: { name: string; url: string };
  body?: Block[];
  bodyFr?: Block[];
  brief?: { title: Localized; href: string; size: string };
}

const INSIGHTS: Insight[] = [];

const SAMPLE_INSIGHTS: Insight[] = [
  {
    id: "a1",
    type: "article",
    slug: { en: "structuring-cross-border-acquisitions-east-africa", fr: "structurer-acquisitions-transfrontalieres-afrique-est" },
    date: "2026-11-04",
    practice: "mergers",
    author: "partner-one",
    image: "/images/office-night.jpg",
    title: {
      en: "Structuring cross-border acquisitions into East Africa",
      fr: "Structurer les acquisitions transfrontalières en Afrique de l’Est",
    },
    standfirst: {
      en: "Approvals, ownership rules and diligence decide the timetable of a regional deal long before the share purchase agreement does. A practical sequence for buyers.",
      fr: "Autorisations, règles de détention et audit fixent le calendrier d’une opération régionale bien avant le contrat de cession. Une méthode pratique pour les acquéreurs.",
    },
    brief: {
      title: { en: "Cross-border acquisitions: a buyer’s checklist", fr: "Acquisitions transfrontalières : la liste de l’acquéreur" },
      href: "/briefs/cross-border-acquisitions.pdf",
      size: "PDF · 2 pages",
    },
    body: [
      { type: "p", text: "An acquisition that touches more than one East African market is rarely one transaction. It is a set of parallel processes, each running on its own clock, that have to arrive at completion together. Buyers who treat the regulatory and structural questions as closing formalities tend to discover them as delays." },
      { type: "p", text: "The sequence below is the one we find most reliable. It is general guidance rather than advice on any particular deal." },
      { type: "h2", id: "approvals", text: "Map the approvals first" },
      { type: "p", text: "Before price is agreed, identify every approval the deal could need: national competition authorities, any regional merger control regime that applies to the parties’ turnover, and sector regulators in banking, insurance, telecommunications or energy." },
      { type: "p", text: "Thresholds and filing triggers differ from one regime to the next, and a transaction can fall within more than one. The answer shapes the long-stop date, the conditions precedent and, often, the allocation of risk between buyer and seller." },
      { type: "quote", text: "The approvals map is the deal timetable. Everything else is drafted around it." },
      { type: "h2", id: "ownership", text: "Check ownership and licensing rules" },
      { type: "p", text: "Several sectors carry local ownership requirements or licence conditions that survive a change of control only with consent. Confirm early whether the target’s licences are personal to it, whether they can be transferred, and what a regulator will ask of a new owner." },
      { type: "list", items: [
        "Sector licences and any change-of-control conditions attached to them",
        "Local ownership thresholds, where they apply",
        "Land held by the target, and any restrictions on foreign holding",
        "Exchange control and repatriation of proceeds",
      ] },
      { type: "brief" },
      { type: "h2", id: "diligence", text: "Make diligence proportionate" },
      { type: "p", text: "Diligence in the region often runs into incomplete public registries and records that sit with the business rather than with the state. Focus effort on the issues that would change the price or the decision to proceed, and use warranties and specific indemnities for what cannot be verified." },
      { type: "h2", id: "what-this-means", text: "What this means" },
      { type: "p", text: "Buyers who settle the approvals map, the ownership position and the scope of diligence before signing heads of terms negotiate from a clearer position, and complete on time more often. The cost of doing this work early is small compared with the cost of discovering it late." },
    ],
  },
  {
    id: "e1",
    type: "external",
    slug: { en: "choosing-a-seat-african-commercial-arbitration", fr: "choisir-siege-arbitrage-commercial-africain" },
    date: "2026-10-28",
    practice: "disputes",
    author: "partner-two",
    image: "/images/columns.jpg",
    source: { name: "Regional law review", url: "https://www.example.com/" },
    title: {
      en: "Choosing a seat for African commercial arbitration",
      fr: "Choisir le siège d’un arbitrage commercial africain",
    },
    standfirst: {
      en: "Why the seat matters more than the venue, and what parties should weigh before they sign the clause.",
      fr: "Pourquoi le siège compte davantage que le lieu des audiences, et ce que les parties doivent peser avant de signer la clause.",
    },
  },
  {
    id: "a2",
    type: "article",
    slug: { en: "internal-investigations-across-two-legal-systems", fr: "enquetes-internes-deux-systemes-juridiques" },
    date: "2026-10-21",
    practice: "investigations",
    author: "partner-two",
    image: "/images/library.jpg",
    title: {
      en: "Running an internal investigation across two legal systems",
      fr: "Mener une enquête interne entre deux systèmes juridiques",
    },
    standfirst: {
      en: "Privilege, data protection and employment law can pull in different directions when an inquiry crosses a border. Where to start.",
      fr: "Secret professionnel, protection des données et droit du travail peuvent tirer dans des directions opposées lorsqu’une enquête franchit une frontière. Par où commencer.",
    },
    body: [
      { type: "p", text: "When an allegation involves people, documents or money in more than one country, the investigation inherits the rules of each. Decisions that are routine in one system can create exposure in the other." },
      { type: "h2", id: "privilege", text: "Settle privilege at the outset" },
      { type: "p", text: "The protection given to legal advice and to investigation materials varies between common law and civil law systems. Decide who instructs the investigation and how its work product is created before the first interview, not after the first request for disclosure." },
      { type: "h2", id: "data", text: "Treat data as a jurisdictional question" },
      { type: "p", text: "Collecting and moving emails and devices engages data protection law wherever the data sits. Establish the lawful basis for processing, and the conditions for any transfer, before material leaves the country." },
      { type: "quote", text: "An investigation is judged on its process as much as its findings." },
      { type: "h2", id: "what-this-means", text: "What this means" },
      { type: "p", text: "A short protocol agreed at the start, covering privilege, data handling and interviews, protects the findings and the people involved, and makes it far easier to act on what the investigation finds." },
    ],
  },
  {
    id: "a3",
    type: "article",
    slug: { en: "allocating-risk-public-private-partnership-contracts", fr: "repartir-risques-contrats-partenariat-public-prive" },
    date: "2026-10-14",
    practice: "projects",
    author: "partner-one",
    image: "/images/energy.jpg",
    title: {
      en: "Allocating risk in public–private partnership contracts",
      fr: "Répartir les risques dans les contrats de partenariat public-privé",
    },
    standfirst: {
      en: "A bankable project is one where each risk sits with the party best able to manage it. How that principle plays out in practice.",
      fr: "Un projet finançable est un projet où chaque risque repose sur la partie la mieux placée pour le gérer. Ce que ce principe implique en pratique.",
    },
    body: [
      { type: "p", text: "Lenders read a project agreement for one thing above all: whether the revenue stream survives the events most likely to interrupt it. The allocation of risk between the public authority and the private party answers that question." },
      { type: "h2", id: "change-in-law", text: "Change in law" },
      { type: "p", text: "Over a concession of twenty years or more, the law will change. The agreement should say which changes the private party absorbs as an ordinary business risk and which entitle it to compensation or relief." },
      { type: "h2", id: "termination", text: "Termination and compensation" },
      { type: "p", text: "Compensation on early termination is usually the point on which bankability turns. Lenders need confidence that senior debt is covered in the scenarios where termination is not the private party’s fault." },
      { type: "list", items: [
        "Authority default: debt, equity and a measure of lost return",
        "Force majeure: typically debt and equity at cost",
        "Private party default: a market-based value, protecting lenders where possible",
      ] },
      { type: "h2", id: "what-this-means", text: "What this means" },
      { type: "p", text: "Clear, early agreement on these allocations shortens negotiation with lenders and reduces the chance of a dispute when circumstances change, as over the life of a long project they will." },
    ],
  },
  {
    id: "a4",
    type: "article",
    slug: { en: "security-over-movable-assets-kenya", fr: "suretes-biens-meubles-kenya" },
    date: "2026-10-07",
    practice: "banking",
    author: "partner-one",
    image: "/images/tower.jpg",
    title: {
      en: "Taking security over movable assets in Kenya",
      fr: "Prendre des sûretés sur des biens meubles au Kenya",
    },
    standfirst: {
      en: "Registration, priority and enforcement under the movable property regime: the points lenders most often ask about.",
      fr: "Inscription, rang et réalisation dans le régime des biens meubles : les questions que posent le plus souvent les prêteurs.",
    },
    body: [
      { type: "p", text: "Kenya’s Movable Property Security Rights Act, 2017 introduced a single framework for security over movable assets, supported by an electronic collateral registry. For lenders, it changed how security is perfected and how competing claims are ranked." },
      { type: "h2", id: "registration", text: "Registration and priority" },
      { type: "p", text: "Under the Act, a security right becomes effective against third parties chiefly through registration of a notice in the collateral registry, and priority generally follows the order of registration. A notice can be registered before the security agreement is signed." },
      { type: "h2", id: "description", text: "Describing the collateral" },
      { type: "p", text: "The description in the notice determines what the security covers against third parties. Too narrow a description leaves assets outside the security; reviewing it should be part of every closing checklist." },
      { type: "h2", id: "what-this-means", text: "What this means" },
      { type: "p", text: "Lenders should search the registry early, register promptly, and check how the regime interacts with any existing security, particularly in refinancings and where the borrower holds assets in more than one country." },
    ],
  },
  {
    id: "e2",
    type: "external",
    slug: { en: "investment-treaties-investors-region", fr: "traites-investissement-investisseurs-region" },
    date: "2026-09-30",
    practice: "trade",
    author: "partner-two",
    image: "/images/port.jpg",
    source: { name: "International trade journal", url: "https://www.example.com/" },
    title: {
      en: "What investment treaties mean for investors in the region",
      fr: "Ce que les traités d’investissement changent pour les investisseurs de la région",
    },
    standfirst: {
      en: "Treaty protection is decided when an investment is structured, not when a dispute begins.",
      fr: "La protection conventionnelle se décide lors de la structuration de l’investissement, et non au début du litige.",
    },
  },
  {
    id: "a5",
    type: "article",
    slug: { en: "immunity-commercial-activities-foreign-missions", fr: "immunite-activites-commerciales-missions-etrangeres" },
    date: "2026-09-23",
    practice: "international",
    author: "partner-two",
    image: "/images/peace-palace.jpg",
    title: {
      en: "Immunity and the commercial activities of foreign missions",
      fr: "L’immunité et les activités commerciales des missions étrangères",
    },
    standfirst: {
      en: "Where the line falls between sovereign acts and ordinary commerce, and why it matters to those who contract with states.",
      fr: "Où passe la frontière entre actes souverains et commerce ordinaire, et pourquoi elle importe à ceux qui contractent avec les États.",
    },
    body: [
      { type: "p", text: "Businesses that contract with embassies, state agencies and international organisations often assume the counterparty can be sued like any other. Frequently it cannot, or not in every respect." },
      { type: "h2", id: "restrictive", text: "The restrictive approach" },
      { type: "p", text: "Most legal systems now distinguish between acts done in the exercise of sovereign authority, which attract immunity, and commercial acts, which may not. Where the line falls depends on the forum and on how the transaction is characterised." },
      { type: "h2", id: "execution", text: "Immunity from execution" },
      { type: "p", text: "Even where a claim can be brought, enforcing a judgment against state property is a separate question. Assets used for diplomatic or sovereign purposes are generally protected." },
      { type: "h2", id: "what-this-means", text: "What this means" },
      { type: "p", text: "Contracts with state counterparties should address immunity expressly, through waivers, dispute resolution clauses and the choice of assets available for enforcement, before any dispute arises." },
    ],
  },
  {
    id: "a6",
    type: "article",
    slug: { en: "directors-duties-company-nears-insolvency", fr: "devoirs-administrateurs-approche-insolvabilite" },
    date: "2026-09-16",
    practice: "corporate",
    author: "partner-one",
    image: "/images/boardroom.jpg",
    title: {
      en: "Directors’ duties when a company nears insolvency",
      fr: "Les devoirs des administrateurs à l’approche de l’insolvabilité",
    },
    standfirst: {
      en: "As a company’s finances deteriorate, the interests the board must weigh begin to shift. What directors should do, and record.",
      fr: "Lorsque la situation financière d’une société se dégrade, les intérêts que le conseil doit prendre en compte évoluent. Ce que les administrateurs doivent faire, et consigner.",
    },
    body: [
      { type: "p", text: "Directors owe their duties to the company. As insolvency approaches, the interests of creditors weigh increasingly in what acting in the company’s interests requires, and decisions taken in that period attract scrutiny if the company later fails." },
      { type: "h2", id: "information", text: "Insist on current information" },
      { type: "p", text: "A board cannot judge solvency on stale figures. Directors should require regular cash-flow forecasts and a clear view of liabilities falling due." },
      { type: "h2", id: "advice", text: "Take advice, and minute it" },
      { type: "p", text: "Taking professional advice early, considering the options available under the insolvency framework, and recording the reasons for each decision are the best protection a director has." },
      { type: "h2", id: "what-this-means", text: "What this means" },
      { type: "p", text: "Boards that act early keep more options open, including rescue and restructuring routes that may not be available once creditors have begun to enforce." },
    ],
  },
];

export function getInsights(): Insight[] {
  return withSamples(INSIGHTS, SAMPLE_INSIGHTS).toSorted((a, b) => b.date.localeCompare(a.date));
}

export function getArticles(): Insight[] {
  return getInsights().filter((entry) => entry.type === "article");
}

export function insightsInArea(area: PracticeAreaId): Insight[] {
  return getInsights().filter((entry) => entry.practice === area);
}

export function insightsBy(personId: string): Insight[] {
  return getInsights().filter((entry) => entry.author === personId);
}

export function getArticle(slug: string, locale: "en" | "fr"): Insight | undefined {
  return getArticles().find((entry) => entry.slug[locale] === slug);
}

/** Minutes to read, at 230 words a minute. */
export function readingMinutes(body: Block[] = []): number {
  const words = body
    .map((block) => ("text" in block ? block.text : "items" in block ? block.items.join(" ") : ""))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}
