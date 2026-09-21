import type { Localized } from "@/i18n/types";
import type { PracticeAreaId } from "@/components/practice/data";

/**
 * An Insights entry: the content contract the dashboard (Admin/) must deliver.
 *
 *   type        "article"  — the firm's own writing, opening on this site.
 *               "external" — a piece published elsewhere; the card names the
 *                            publication and carries an outward arrow.
 *   source      Required for "external": the publication's name and the link to
 *               the piece. Not used for "article".
 *   href        Required for "article": the page on this site.
 *   date        ISO date (YYYY-MM-DD). Formatted per language on the card.
 *   practice    The practice area tag.
 *   title       In both languages.
 *   image       A 4:3 image.
 */
export type InsightType = "article" | "external";

export interface InsightEntry {
  id: string;
  type: InsightType;
  date: string;
  practice: PracticeAreaId;
  title: Localized;
  image: string;
  href?: string;
  source?: { name: string; url: string };
}

/** Illustrative entries only; the dashboard will replace them. */
export const INSIGHTS: InsightEntry[] = [
  { id: "a1", type: "article", date: "2026-09-18", practice: "corporate", image: "/practice/boardroom.svg", href: "#insights",
    title: { en: "Structuring cross-border acquisitions into East Africa", fr: "Structurer les acquisitions transfrontalières en Afrique de l’Est" } },
  { id: "e1", type: "external", date: "2026-09-11", practice: "arbitration", image: "/practice/arbitration.svg",
    source: { name: "Publication name", url: "https://example.com/" },
    title: { en: "Choosing a seat for African commercial disputes", fr: "Choisir le siège d’un arbitrage commercial africain" } },
  { id: "a2", type: "article", date: "2026-09-04", practice: "investigations", image: "/practice/investigations.svg", href: "#insights",
    title: { en: "Running an internal investigation across two legal systems", fr: "Mener une enquête interne entre deux systèmes juridiques" } },
  { id: "a3", type: "article", date: "2026-08-28", practice: "infrastructure", image: "/practice/port.svg", href: "#insights",
    title: { en: "Allocating risk in public–private infrastructure contracts", fr: "Répartir les risques dans les contrats de partenariat public-privé" } },
  { id: "a4", type: "article", date: "2026-08-21", practice: "banking", image: "/practice/finance.svg", href: "#insights",
    title: { en: "Taking security over movable assets: a lender’s checklist", fr: "Sûretés sur biens meubles : la liste de contrôle du prêteur" } },
  { id: "e2", type: "external", date: "2026-08-14", practice: "trade", image: "/practice/trade.svg",
    source: { name: "Publication name", url: "https://example.com/" },
    title: { en: "What investment treaties mean for investors in the region", fr: "Ce que les traités d’investissement changent pour les investisseurs de la région" } },
  { id: "a5", type: "article", date: "2026-08-07", practice: "litigation", image: "/practice/courtroom.svg", href: "#insights",
    title: { en: "Interim relief in commercial disputes: moving quickly", fr: "Mesures provisoires en matière commerciale : agir vite" } },
  { id: "a6", type: "article", date: "2026-07-31", practice: "international-law", image: "/practice/institution.svg", href: "#insights",
    title: { en: "OHADA and the East African Community: where the regimes meet", fr: "OHADA et Communauté d’Afrique de l’Est : là où les régimes se rencontrent" } },
];
