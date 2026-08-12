# PROGRESS

Live implementation tracker for CODIQ. One entry per phase: status, date, what was implemented, and what remains. Update this file at the end of every phase.

Legend: ⬜ Not started · 🔄 In progress · ✅ Done

**Branch policy (from Phase 4 onward):** every remaining phase must be developed on a dedicated feature branch (e.g. `phase-4-validation-engine`) and merged back to `main` only when the phase is complete and all checks (lint, typecheck, tests, build) pass. Keep `main` clean — no in-progress work on it.

---

## Phase 1 — Foundation (App setup + architecture + UI + routing)

Status: ✅ Done — 2026-08-01

Implemented:

- Next.js 16 (App Router) + React 19 + TypeScript (strict) scaffold (pnpm).
- Design system: dark-first tokens, light theme via `data-theme`, Geist fonts, `cn` utils.
- shadcn/ui primitives: button, badge, card, skeleton, input, label, separator, progress, dialog, dropdown-menu, sheet, tooltip, scroll-area, tabs, avatar, command, sonner.
- Base layout: ThemeProvider, SiteHeader (responsive + mobile sheet), SiteFooter, CommandPalette (⌘K), Toaster.
- Route skeleton: home, paths(+detail), technologies(+detail, +playground), learn/[tech]/[module]/[lesson], labs, dashboard, search, settings, about; loading/error/global-error/not-found.
- SEO foundation: root metadata, OpenGraph image (next/og), sitemap, robots, PWA manifest, icon.svg.
- State: settings-store, ui-store, progress-store skeleton (Zustand + IndexedDB persist w/ localStorage fallback via lib/storage.ts).
- Governance: README, CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE (MIT), CONTRIBUTORS.
- Tooling config: commitlint, husky (pre-commit, commit-msg), lint-staged, Changesets, ESLint, Prettier, Vitest, Playwright.
- Docs: docs/ index, PRODUCT_VISION, ARCHITECTURE, IMPLEMENTATION_PLAN, CONTENT_SCHEMA, VALIDATION_ENGINE, STATE_AND_DATA, ADRS, AI_ROADMAP, ROADMAP.
- GitHub Actions CI workflow + issue/PR templates.

Remaining / next:

- Git history: first commit + push (pending user confirmation).

---

## Phase 1.1 — Verification fixes (post-install)

Status: ✅ Done — 2026-08-02

Implemented (after first `pnpm install`; lint/typecheck/test/build all green):

- `scripts/build-content.ts`: block comment contained `**/` (closed the comment early → parse error). Reworded.
- `react-hooks/static-components`: replaced `getIcon()` calls inside render with a new `components/composite/tech-icon.tsx` (static map lookup via exported `iconMap` in `lib/icons.ts`); removed inline IIFE in `app/paths/[slug]/page.tsx`.
- `react-hooks/refs`: `use-hotkey.ts` now syncs `handlerRef.current` inside an effect instead of during render.
- `react-hooks/set-state-in-effect`: `use-mounted.ts` rewritten with `useSyncExternalStore`.
- `react/no-unescaped-entities`: removed apostrophes in `app/not-found.tsx` and `app/page.tsx` ("you'd").
- Removed unused bindings: `CardContent` (`paths/[slug]`), `resetSettings` (`settings`), `theme` (`mode-toggle`).
- `import/no-anonymous-default-export`: `commitlint.config.mjs` assigns config to a `const` before export.
- Typecheck: `siteConfig.keywords` spread into mutable array for `Metadata.keywords`; icon map type narrowed via ternary (`name ? iconMap[name] : undefined`) to satisfy strict `LucideIcon`.
- Test: fixed `slugify("React & Next.js!")` expectation to `"react-nextjs"` (implementation intentionally collapses hyphen runs).

Verification: `pnpm lint` ✅ · `pnpm typecheck` ✅ · `pnpm test` (8/8) ✅ · `pnpm build` (15 static + 4 dynamic routes) ✅

---

## Phase 2 — Content engine + MDX loader

Status: ✅ Done — 2026-08-02

Implemented:

- Zod-validated content schema (`lib/content/schema.ts`): technology, module, lesson frontmatter, challenge, validator config; category/difficulty/hex-color enums.
- `scripts/build-content.mts` pipeline + `scripts/content-build.mjs` esbuild-CJS launcher (tsx can't run `@mdx-js/mdx`'s ESM-only transitive dep `estree-walker` — see ADR-009): discover → validate → compile MDX (`remark-gfm`, `rehype-slug`, heading/text extraction) → bundle validators → emit `lib/generated/` (registry, search index, mdx modules, validator bundles, examples, cache).
- MDX renderer: `lib/mdx-components.tsx` (styled primitives + `Note`, `Diagram`, `CommonMistakes`, `InterviewQuestion`, `Playground`; `MDXComponents` type defined locally) and `components/composite/mdx-content.tsx` dynamic renderer.
- Validator contract `validators/types.ts` + sample CSS validator bundled into `lib/generated/validators/`.
- Routes wired to the registry: technology pages (+ docs sections, module cards), module index pages (NEW), lesson pages (breadcrumb, badges, course sidebar, challenge card, global prev/next, `dynamicParams=false`, generateStaticParams/generateMetadata), playground, paths detail, home, sitemap. All 28 routes statically generated.
- `config/technologies.ts` deleted (replaced by registry); CI reordered lint → content:build → typecheck → test → build; `prebuild` hook regenerates content before `next build`.
- Sample content: `content/css/` (tech.json + 5 guide docs; modules `css-selectors`, `css-box-model`) and `content/javascript/` (tech.json + docs; module `js-functions`).
- Tests: `lib/content/mdx.test.ts` (4 tests: normalizeText, compiled output shape, heading ids incl. re-slugging, frontmatter excluded). Docs updated (CONTENT_SCHEMA, ADR-001, ADR-009).

Verification: `pnpm content:build` ✅ · `pnpm lint` ✅ · `pnpm typecheck` ✅ · `pnpm test` (12/12) ✅ · `pnpm build` (28 static routes) ✅

Remaining / next:

- Phase 3 (Playground + Monaco + Sandpack) — Monaco editor shell, Sandpack previews, per-technology playground routes.

---

## Phase 3 — Playground + Monaco + Sandpack

Status: ✅ Done — 2026-08-02

Implemented:

- Deps: `@monaco-editor/react` + `monaco-editor` (self-hosted via `scripts/setup-monaco.mjs` → `public/vs`, git/prettier/eslint ignored), `@codesandbox/sandpack-react` v2.19.x (React 19 peer deps OK).
- `config/playgrounds.ts`: typed `PlaygroundPreset` registry (files, template, mainFile, layout) for `css`, `tailwind`, `javascript`, `typescript`, `react`, `next`, `node`, `express`; single source of truth, all registered techs covered.
- `types/playground.ts`: `PlaygroundMode` (sandpack | express-mock), `SandpackTemplateName`, `MonacoLanguage`, `PlaygroundFile`, `PlaygroundPreset`.
- Components (`components/feature/playground/`): settings-aware self-hosted `MonacoEditor`; `SandpackWorkspace` (provider + toolbar Run/Reset, file tabs with `updateFile`, Preview/Console/Output panes); `ExpressMockPanel` (editor + method/path/body request panel, response history, parsed-route list click-to-fill); `Playground` orchestrator via `next/dynamic` (ssr:false).
- Express mock: `features/playground/express-mock.ts` — pure parser (no eval), routes/params/statuses/bodies incl. chained `res.status(201).json({...})`, `jsLiteralToJson` (true/false/null literals, unquoted/single-quoted keys, trailing commas); unresolved identifiers → `null`.
- Route: `app/technologies/[slug]/playground/page.tsx` wired to presets, SSG preserved (build shows `/technologies/css|javascript/playground`).
- Tests: `features/playground/express-mock.test.ts` (7 tests), `config/playgrounds.test.ts` (2 tests) — 26/26 total.
- pnpm 11: `postinstall` invokes `node` directly; `pnpm-workspace.yaml` `allowBuilds` (es5-ext) required over package.json `pnpm.onlyBuiltDependencies`.

Verification: `pnpm lint` ✅ · `pnpm typecheck` ✅ · `pnpm test` (26/26) ✅ · `pnpm build` (28 static routes incl. playground) ✅

Remaining / next:

- Phase 4 (Validation engine) — ChallengeRunner, validator registry, sandboxed iframe harness.

---

## Phase 4 — Validation engine

Status: ⬜ Not started

Planned:

- `validators/` framework: Validator interface, registry, sandboxed iframe harness (postMessage protocol, CSP sandbox, timeouts).
- Built-in validators: html, css, js, ts, react, express-mock.
- ChallengeRunner UI: requirements checklist, hints, run/reset, granular results, SuccessDialog + XP award.
- `docs/VALIDATION_ENGINE.md` finalized with protocol spec.

---

## Phase 5 — Progress system (IndexedDB)

Status: ⬜ Not started

Planned:

- Complete progress store: completed lessons/labs, current lesson/path, XP, level, badges, achievements, streak, activity, resume position.
- Gamification services: xp, level curve, badges, streak; daily/weekly goals.
- Cross-tab sync, hydration, reset/export/import.

---

## Phase 6 — Dashboard + search + gamification

Status: ⬜ Not started

Planned:

- Dashboard: progress rings, technology/path completion, stats, continue learning, goals.
- Search page + ⌘K command palette full-content search (Fuse.js over build-time index).
- Badges/achievements UI, completion animation.

---

## Phase 7 — Sample content (CSS, JavaScript, React)

Status: ⬜ Not started

Planned:

- CSS (Selectors, Flexbox), JavaScript ×2, React ×2 — full lesson.mdx, example, challenge.json, validator.ts.
- Learning paths wired to registry; home page sections (continue learning, featured labs).
- First CHANGELOG entries + PROGRESS update.

---

## Phase 8 — Polish + performance + testing

Status: ⬜ Not started

Planned:

- SEO/OG/JSON-LD finalization; a11y pass (axe, keyboard, reduced motion); performance audit (chunk budgets, CWV).
- Full Vitest + Playwright suite; complete GitHub Actions pipeline.
- Finalize CHANGELOG/CONTRIBUTING; docs review; close out PROGRESS.
