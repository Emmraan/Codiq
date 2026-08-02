# CODIQ — Content Schema & Authoring Guide

## 1. The content model

Everything under `content/` is data. The build pipeline (`scripts/build-content.mts`, executed through the `scripts/content-build.mjs` launcher) discovers it, validates it with Zod, compiles it, and emits a typed registry consumed by the app. **Adding content never requires editing UI code.**

```
content/
└── <technology-slug>/
    ├── tech.json              # technology metadata
    ├── intro.mdx              # Introduction (Why it exists)
    ├── installation.mdx       # Installation
    ├── structure.mdx          # Folder structure
    ├── best-practices.mdx     # Best practices
    ├── summary.mdx            # Summary
    └── modules/
        └── <module-slug>/
            ├── lesson.mdx     # frontmatter metadata + lesson body
            ├── example.tsx    # runnable example (per language)
            ├── challenge.json # lab challenge contract
            └── validator.ts   # typed validator (bundled by esbuild)
```

Supported technologies today: CSS, Tailwind CSS, JavaScript, TypeScript, Node.js, Express.js, React, Next.js. The architecture supports unlimited future technologies (Python, Go, Rust, Docker, Git, MongoDB, PostgreSQL, Redis, GraphQL, AI, …).

## 2. `tech.json`

```jsonc
{
  "slug": "css",
  "name": "CSS",
  "description": "Layout, specificity, flexbox, grid and the modern box model.",
  "color": "#06b6d4",
  "category": "frontend", // frontend | backend | fullstack | tooling | data | ai
  "difficulty": "beginner", // beginner | intermediate | advanced | expert
  "order": 1,
  "tags": ["styling", "layout"],
  "pathIds": ["frontend-developer", "fullstack-developer"],
  "icon": "palette", // key from lib/icons.ts
  "prerequisites": [],
}
```

## 3. `lesson.mdx` frontmatter

```yaml
---
title: CSS Selectors
slug: selectors
order: 1
difficulty: beginner
readingTime: 8 # minutes
xp: 40
tags: [selectors, basics]
prerequisites: []
description: Learn how to target elements with CSS selectors.
status: published # draft | published
---
```

The MDX body supports the standard markdown + MDX syntax plus CODIQ components: notes, diagrams, common-mistakes, interview-questions, and embedded playgrounds (mapping defined in `lib/mdx-components.tsx`).

## 4. `challenge.json`

```jsonc
{
  "title": "Target the intro",
  "description": "Style the first paragraph using a descendant selector.",
  "difficulty": "beginner",
  "xp": 50,
  "objectives": ["Use a descendant selector", "Change the text color"],
  "requirements": [
    { "id": "sel-descendant", "label": "A descendant selector exists" },
    { "id": "color-applied", "label": "The paragraph is colored" },
  ],
  "hints": ["Remember: `ancestor descendant { }`", "Try `p` with a class"],
  "seed": { "styles.css": "/* your code */" },
  "validator": {
    "type": "css",
    "checks": ["selector-presence", "computed-style"],
  },
}
```

## 5. `validator.ts`

Validators are authored in TypeScript with full typing and bundled by esbuild into browser-safe IIFEs at build time. They run inside a **sandboxed iframe** via `postMessage`. See [VALIDATION_ENGINE.md](VALIDATION_ENGINE.md).

```ts
import type { Validator } from "@/validators/types";

export const validator: Validator = {
  run({ code, config }) {
    // evaluate and return per-check results
  },
};
```

## 6. The pipeline

1. **Discover** — glob `content/**/tech.json` → technologies; `content/**/modules/**/lesson.mdx` → lessons.
2. **Validate** — Zod schemas reject malformed metadata early with helpful errors.
3. **Compile** — MDX bodies compiled to renderable modules; validator.ts bundled via esbuild.
4. **Extract** — headings and plain text captured for navigation + search index.
5. **Emit** — `lib/generated/content-registry.ts` + `search-index.json`, plus `lib/generated/mdx/**` (compiled lesson/docs modules + examples), `lib/generated/validators/**` (validator bundles), and a `.cache/` with parsed frontmatter.

**Why a launcher?** tsx cannot run `@mdx-js/mdx` here because its transitive dependency `estree-walker@3.0.3` is ESM-only (no `require` export) → `ERR_PACKAGE_PATH_NOT_EXPORTED`. `scripts/content-build.mjs` therefore bundles the pipeline with esbuild to CJS (aliasing `@/` to the repo root) and requires the bundle. See ADR-009.

Run `pnpm content:build` (wired into `next build` as well). The registry drives `generateStaticParams`, navigation, sitemap, and search.

## 7. Adding a technology — checklist

1. Create `content/<slug>/tech.json`.
2. Add intro/installation/structure/best-practices/summary MDX.
3. Add modules with `lesson.mdx`, `challenge.json`, `validator.ts`, `example.*`.
4. Map the icon key in `lib/icons.ts`.
5. Add the slug to the relevant learning path in `config/learning-paths.ts`.
6. Run `pnpm content:build` and verify the pages.
