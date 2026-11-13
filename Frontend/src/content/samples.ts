/**
 * Sample content switch.
 *
 * Content the firm has not yet supplied (representative matters, biographies,
 * articles, openings) exists as samples so the templates can be reviewed. The
 * samples are shown:
 *   - always in development, and
 *   - in a production build only when NEXT_PUBLIC_SHOW_SAMPLES=1, for a client
 *     preview deployment.
 *
 * The public launch build leaves NEXT_PUBLIC_SHOW_SAMPLES unset, so nothing the
 * firm has not approved can reach the live site. Sections without real content
 * are then left out rather than shown empty.
 */
export const SHOW_SAMPLES =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_SAMPLES === "1";

/** Returns the firm's entries, or the samples when samples are switched on. */
export function withSamples<T>(real: T[], samples: T[]): T[] {
  if (real.length > 0) return real;
  return SHOW_SAMPLES ? samples : [];
}
