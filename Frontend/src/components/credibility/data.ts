/**
 * The credibility figures. Every `value` stays null until the firm confirms it.
 *
 * Rules, from the design spec:
 * - Never invent these. A firm that overstates itself on its own homepage loses
 *   the credibility this band exists to create.
 * - Four confirmed figures: a band of four. Three: a band of three.
 * - Fewer than three: the band becomes a quiet line naming the courts and
 *   tribunals in FORUMS instead. If that is empty too, nothing is shown.
 *
 * `sample` values appear only in development, visibly marked "Sample", so the
 * counter can be reviewed. Production builds never render them.
 */
export interface Figure {
  label: string;
  value: number | null;
  sample: number;
  suffix?: string;
}

export const FIGURES: Figure[] = [
  { label: "Practice areas", value: null, sample: 7 },
  { label: "Dispute forums we appear before", value: null, sample: 12 },
  { label: "Years of combined experience", value: null, sample: 30 },
  { label: "Jurisdictions covered", value: null, sample: 9 },
];

/** Courts and tribunals the firm appears before, for the text fallback. */
export const FORUMS: string[] = [];
