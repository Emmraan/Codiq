/**
 * Content model — the single source of truth for the content system.
 *
 * Everything under `content/` is parsed, validated (Zod), and compiled by
 * `scripts/build-content.ts` into `lib/generated/content-registry.ts`.
 * UI code never imports MDX or challenge files directly — it consumes the
 * registry. See docs/CONTENT_SCHEMA.md for the authoring guide.
 */

export type TechnologyCategory = "frontend" | "backend" | "fullstack" | "tooling" | "data" | "ai";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface TechnologyMeta {
  /** Unique URL slug, e.g. "react". */
  slug: string;
  name: string;
  description: string;
  version?: string;
  /** Accent color used for branding across the UI (any CSS color string). */
  color: string;
  category: TechnologyCategory;
  difficulty: Difficulty;
  /** Sort order within the technology index. */
  order: number;
  tags: string[];
  /** Learning path slugs that include this technology. */
  pathIds: string[];
  featured?: boolean;
  /** Slugs of technologies the learner should complete first. */
  prerequisites?: string[];
  estimatedHours?: number;
  /** Icons are mapped in `lib/icons.ts` — never store arbitrary identifiers. */
  icon: string;
}

export interface ModuleMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  technologySlug: string;
}

export interface LessonMetadata {
  title: string;
  slug: string;
  technologySlug: string;
  moduleSlug: string;
  order: number;
  difficulty: Difficulty;
  /** Estimated reading time in minutes. */
  readingTime: number;
  xp: number;
  tags: string[];
  prerequisites: string[];
  description: string;
  status?: "draft" | "published";
}

/** Validator reference declared in a challenge.json. */
export interface ValidatorConfig {
  /** Registry key of the validator type, e.g. "css" | "javascript". */
  type: string;
  /** Extra configuration consumed by the validator (checks, options, …). */
  [key: string]: unknown;
}

export interface ChallengeMetadata {
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: number;
  objectives: string[];
  requirements: Array<{ id: string; label: string; hint?: string }>;
  hints: string[];
  /** Seed code per language, keyed by file name. */
  seed: Record<string, string>;
  /** Accepted by the validation engine; the validator lives in validator.ts. */
  validator: ValidatorConfig;
  /** Soft time cap in minutes before the challenge is considered slow. */
  timeLimit?: number;
}

/** A technology as it appears in the generated registry (metadata + counts). */
export interface RegisteredTechnology extends TechnologyMeta {
  moduleCount: number;
  lessonCount: number;
}

/** A lesson entry in the generated registry (metadata + compiled content). */
export interface RegisteredLesson extends LessonMetadata {
  /** Relative path of the compiled MDX body. */
  mdxPath: string;
  /** Relative path of the example file, if any. */
  examplePath?: string;
  challenge?: ChallengeMetadata;
  /** Extracted headings for in-lesson navigation. */
  headings: Array<{ depth: number; text: string; id: string }>;
}
