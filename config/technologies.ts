/**
 * Phase 1 seed list for the technologies index.
 *
 * TEMPORARY: replaced in Phase 2 by the build-time content registry, which
 * discovers technologies from `content/<slug>/tech.json`. Do not add logic
 * that depends on this list — it is presentation-only scaffolding.
 */

export interface TechnologySeed {
  slug: string;
  name: string;
  description: string;
  category: string;
  color: string;
  icon: string;
}

export const technologySeeds: TechnologySeed[] = [
  {
    slug: "css",
    name: "CSS",
    description: "Layout, specificity, flexbox, grid and the modern box model.",
    category: "frontend",
    color: "#06b6d4",
    icon: "palette",
  },
  {
    slug: "tailwindcss",
    name: "Tailwind CSS",
    description: "Utility-first styling with a design-token system.",
    category: "frontend",
    color: "#38bdf8",
    icon: "wind",
  },
  {
    slug: "javascript",
    name: "JavaScript",
    description: "The language of the web — values, functions, scope, async.",
    category: "frontend",
    color: "#eab308",
    icon: "braces",
  },
  {
    slug: "typescript",
    name: "TypeScript",
    description: "JavaScript with types — static analysis at scale.",
    category: "frontend",
    color: "#2563eb",
    icon: "shield-check",
  },
  {
    slug: "nodejs",
    name: "Node.js",
    description: "Run JavaScript on the server with a massive ecosystem.",
    category: "backend",
    color: "#22c55e",
    icon: "server",
  },
  {
    slug: "express",
    name: "Express.js",
    description: "Minimal, flexible HTTP framework for Node.js APIs.",
    category: "backend",
    color: "#64748b",
    icon: "route",
  },
  {
    slug: "react",
    name: "React",
    description: "Declarative component UIs with hooks and the virtual DOM.",
    category: "frontend",
    color: "#22d3ee",
    icon: "atom",
  },
  {
    slug: "nextjs",
    name: "Next.js",
    description: "The React framework — routing, rendering, and more.",
    category: "frontend",
    color: "#94a3b8",
    icon: "sparkles",
  },
];
