/**
 * Placeholder articles, in the shape the journal will use. Headlines, dates and
 * images are illustrative only; replace with the firm's publications.
 */
export interface Article {
  tag: string;
  date: string;
  title: string;
  image: string;
  href: string;
}

export const ARTICLES: Article[] = [
  { tag: "Corporate and M&A", date: "11 Sep 2026", title: "Structuring cross-border acquisitions into East Africa", image: "/practice/boardroom.svg", href: "#insights" },
  { tag: "Arbitration", date: "4 Sep 2026", title: "Choosing a seat for African commercial disputes", image: "/practice/arbitration.svg", href: "#insights" },
  { tag: "Infrastructure and energy", date: "28 Aug 2026", title: "Allocating risk in public–private infrastructure contracts", image: "/practice/port.svg", href: "#insights" },
  { tag: "Banking and finance", date: "21 Aug 2026", title: "Taking security over movable assets: a lender’s checklist", image: "/practice/finance.svg", href: "#insights" },
  { tag: "Trade and investment", date: "14 Aug 2026", title: "What investment treaties mean for investors in the region", image: "/practice/trade.svg", href: "#insights" },
  { tag: "Commercial litigation", date: "7 Aug 2026", title: "Interim relief in commercial disputes: moving quickly", image: "/practice/courtroom.svg", href: "#insights" },
  { tag: "Public international law", date: "31 Jul 2026", title: "Regional courts and the reach of community law", image: "/practice/institution.svg", href: "#insights" },
  { tag: "Corporate and M&A", date: "24 Jul 2026", title: "Doing business in Kenya: an overview for foreign investors", image: "/nairobi-wide.svg", href: "#insights" },
];
