/** Global site configuration. Single place for branding, links and metadata. */

export const siteConfig = {
  name: "CODIQ",
  tagline: "The Full Stack Developer Laboratory",
  description:
    "CODIQ is an interactive developer laboratory where you read, understand, experiment, solve challenges, and progressively become an independent developer — entirely in your browser.",
  /** Used for canonical URLs, OG metadata and sitemap. Override via NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/opengraph-image",
  keywords: [
    "learn to code",
    "full stack developer",
    "coding challenges",
    "interactive learning",
    "javascript",
    "react",
    "typescript",
    "css",
    "next.js",
  ],
  author: "CODIQ contributors",
  links: {
    github: "https://github.com/Emmraan/Codiq",
    twitter: "https://twitter.com/codiq",
    discord: "https://discord.gg/codiq",
  },
} as const;

export type SiteConfig = typeof siteConfig;
