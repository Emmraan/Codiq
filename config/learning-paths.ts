import type { Difficulty } from "@/types/content";

export interface LearningPathDef {
  slug: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  /** Technology slugs in the recommended order. */
  technologies: string[];
  estimatedHours: number;
  difficulty: Difficulty;
}

/**
 * Curated curriculum sequences. Phase 1 seeds the definitions; Phase 2 wires
 * each path to the content registry so progress can be computed per path.
 */
export const learningPaths: LearningPathDef[] = [
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    description:
      "Master the browser stack end to end — from semantic HTML through CSS, JavaScript, TypeScript, and modern React with Next.js.",
    color: "#8b5cf6",
    icon: "layout-template",
    technologies: ["css", "tailwindcss", "javascript", "typescript", "react", "nextjs"],
    estimatedHours: 40,
    difficulty: "beginner",
  },
  {
    slug: "backend-developer",
    title: "Backend Developer",
    description:
      "Build the server side of the web — JavaScript and TypeScript fundamentals, then Node.js and Express with real API design practice.",
    color: "#10b981",
    icon: "server",
    technologies: ["javascript", "typescript", "nodejs", "express"],
    estimatedHours: 30,
    difficulty: "beginner",
  },
  {
    slug: "fullstack-developer",
    title: "Full Stack Developer",
    description:
      "Combine frontend and backend into complete, shippable products — the CODIQ flagship path.",
    color: "#06b6d4",
    icon: "blocks",
    technologies: [
      "css",
      "tailwindcss",
      "javascript",
      "typescript",
      "react",
      "nextjs",
      "nodejs",
      "express",
    ],
    estimatedHours: 70,
    difficulty: "intermediate",
  },
];
