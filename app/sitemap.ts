import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { learningPaths } from "@/config/learning-paths";
import { lessons, modules, technologies } from "@/lib/generated/content-registry";

/**
 * Sitemap driven by the build-time content registry, so every technology,
 * module and published lesson is discovered automatically.
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
    ...technologies.flatMap((tech) => [
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
    ...modules.map((mod) => ({
      url: `${base}/learn/${mod.technologySlug}/${mod.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...lessons
      .filter((lesson) => lesson.status !== "draft")
      .map((lesson) => ({
        url: `${base}/learn/${lesson.technologySlug}/${lesson.moduleSlug}/${lesson.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  ];

  return routes;
}
