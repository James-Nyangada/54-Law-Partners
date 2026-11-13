import type { MetadataRoute } from "next";
import { allRoutes, PATHS } from "@/lib/routes";
import { SITE_URL } from "@/lib/metadata";

/** Every page in both languages, each pointing at its counterpart. */
export default function sitemap(): MetadataRoute.Sitemap {
  const hidden = new Set<string>([PATHS.received.en, PATHS.received.fr]);
  return allRoutes()
    .filter((route) => !hidden.has(route.en))
    .flatMap((route) =>
      (["en", "fr"] as const).map((locale) => ({
        url: `${SITE_URL}${route[locale]}`,
        lastModified: new Date(),
        alternates: { languages: { en: `${SITE_URL}${route.en}`, fr: `${SITE_URL}${route.fr}` } },
      })),
    );
}
