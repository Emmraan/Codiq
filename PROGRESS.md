# PROGRESS

Live implementation tracker for CODIQ. One entry per phase: status, date, what was implemented, and what remains. Update this file at the end of every phase.

Legend: ⬜ Not started · 🔄 In progress · ✅ Done

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

Status: ⬜ Not started

Planned:

- Zod-validated content schema; `scripts/build-content.ts` pipeline (discovery, frontmatter, MDX compile, validator bundling, search extraction).
- `lib/generated/content-registry.ts` output + `generateStaticParams` for lesson routes.
- MDX renderer with custom components (notes, diagrams, common mistakes, interview questions, embedded playground).
- Technology / module / lesson pages wired to the registry; auto navigation + sitemap + search index.
- `docs/CONTENT_SCHEMA.md` + first ADRs.

---

## Phase 3 — Playground + Monaco + Sandpack

Status: ⬜ Not started

Planned:

- Lazy-loaded Monaco editor shell (`components/feature/playground/`) wired to settings (font size, theme).
- Playground layout with tabs/split; Sandpack live previews for CSS/HTML/React; console for JS; Express mock API panel.
- Per-technology playground routes.

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
