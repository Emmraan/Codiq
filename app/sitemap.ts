import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { learningPaths } from "@/config/learning-paths";
import { technologySeeds } from "@/config/technologies";

/**
 * Sitemap generated from config seeds in Phase 1. In Phase 2 this is driven by
 * the content registry so every lesson/module is discovered automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/paths",
    "/technologies",
    "/labs",
    "/dashboard",
    "/search",
    "/settings",
    "/about",
  ];

  const routes: MetadataRoute.Sitemap = [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...learningPaths.map((path) => ({
      url: `${base}/paths/${path.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...technologySeeds.flatMap((tech) => [
      {
        url: `${base}/technologies/${tech.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${base}/technologies/${tech.slug}/playground`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
    ]),
  ];

  return routes;
}
