/**
 * Zod schemas for the content authoring format.
 *
 * These validate the raw files under `content/` (tech.json, module.json,
 * lesson.mdx frontmatter, challenge.json) before they are compiled by
 * `scripts/build-content.ts`. See docs/CONTENT_SCHEMA.md.
 *
 * The schemas are the machine-readable twin of the interfaces in
 * `types/content.ts` — keep both in sync.
 */
import { z } from "zod";

export const technologyCategorySchema = z.enum([
  "frontend",
  "backend",
  "fullstack",
  "tooling",
  "data",
  "ai",
]);

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced", "expert"]);

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "must be a hex color, e.g. #06b6d4");

/** Optional file at `content/<slug>/module.json`; derived from lessons if absent. */
export const moduleSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case slug"),
    title: z.string().min(1),
    description: z.string().min(1),
    order: z.number().int().nonnegative(),
  })
  .strict();

export const technologySchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case slug"),
    name: z.string().min(1),
    description: z.string().min(1),
    version: z.string().min(1).optional(),
    color: hexColorSchema,
    category: technologyCategorySchema,
    difficulty: difficultySchema,
    order: z.number().int().nonnegative(),
    tags: z.array(z.string().min(1)).default([]),
    pathIds: z.array(z.string().min(1)).default([]),
    icon: z.string().min(1),
    featured: z.boolean().optional(),
    prerequisites: z.array(z.string().min(1)).default([]),
    estimatedHours: z.number().int().nonnegative().optional(),
  })
  .strict();

export const lessonFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case slug"),
    order: z.number().int().nonnegative(),
    difficulty: difficultySchema,
    readingTime: z.number().int().nonnegative(),
    xp: z.number().int().nonnegative(),
    tags: z.array(z.string().min(1)).default([]),
    prerequisites: z.array(z.string().min(1)).default([]),
    description: z.string().min(1),
    status: z.enum(["draft", "published"]).default("published"),
  })
  .strict();

export const validatorConfigSchema = z.object({ type: z.string().min(1) }).passthrough();

export const challengeSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: difficultySchema,
    xp: z.number().int().nonnegative(),
    objectives: z.array(z.string().min(1)).min(1),
    requirements: z
      .array(
        z
          .object({
            id: z.string().min(1),
            label: z.string().min(1),
            hint: z.string().optional(),
          })
          .strict(),
      )
      .min(1),
    hints: z.array(z.string()).default([]),
    seed: z.record(z.string(), z.string()),
    validator: validatorConfigSchema,
    timeLimit: z.number().int().nonnegative().optional(),
  })
  .strict();

export type TechnologySchema = z.infer<typeof technologySchema>;
export type ModuleSchema = z.infer<typeof moduleSchema>;
export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;
export type ChallengeSchema = z.infer<typeof challengeSchema>;
