import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

/** Keeps the publishing dashboard and system pages out of search results. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/contact/received", "/fr/contact/demande-recue"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
