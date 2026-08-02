# CODIQ — Implementation Plan

Phased build plan with deliverables and exit criteria. Live status is tracked in [PROGRESS.md](../PROGRESS.md).

## Toolchain & governance

- **Package manager:** pnpm (pinned via `packageManager`).
- **Version control:** `main` + feature branches + PRs; Conventional Commits enforced by commitlint; husky hooks; Changesets-driven releases with auto-generated CHANGELOG.
- **CI:** GitHub Actions on every PR and push to `main`: lint → typecheck → tests → build → bundle-size check.

## Phase 1 — Foundation ✅

**Deliverables:** Next.js 16 + TS strict + Tailwind v4 + shadcn/ui scaffold · dark-first design tokens · route skeleton (all pages + error/loading/not-found) · base layout (header, footer, ⌘K palette, theme provider) · Zustand stores (settings, ui, progress skeleton) with IndexedDB persist · governance files (README, CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE, CONTRIBUTORS) · docs/ + PROGRESS.md · commitlint/husky/lint-staged/Changesets · GitHub Actions · SEO (metadata, OG, sitemap, robots, manifest).

**Exit criteria:** app runs on pnpm; lint/typecheck/test/build gates green; repository is industry-shaped.

## Phase 2 — Content engine + MDX loader

**Deliverables:** Zod content schema · `scripts/build-content.ts` (discovery, frontmatter, MDX compile, validator bundling, search extraction) · generated registry + `generateStaticParams` · MDX renderer with custom components · technology/module/lesson pages · auto navigation + sitemap + search index · docs + ADRs.

**Exit criteria:** content-driven lesson pages render from MDX with zero hardcoded lessons.

## Phase 3 — Playground + Monaco + Sandpack

**Deliverables:** lazy Monaco editor shell (settings-aware) · playground layout (tabs/split) · Sandpack previews (CSS/HTML/React), JS console, TS output, Express mock API · per-technology playground routes.

**Exit criteria:** every supported technology has a working playground.

## Phase 4 — Validation engine

**Deliverables:** Validator interface + registry · sandboxed iframe harness (CSP sandbox, postMessage protocol, timeouts) · built-in validators (html, css, js, ts, react, express-mock) · ChallengeRunner UI (requirements checklist, hints, run/reset, results) · SuccessDialog + XP award.

**Exit criteria:** challenges validate user code safely with granular, per-check feedback.

## Phase 5 — Progress system (IndexedDB)

**Deliverables:** complete progress store (lessons, labs, current, XP, level, badges, achievements, streak, activity, resume) · gamification services (xp, level curve, badges, streak, daily/weekly goals) · cross-tab sync, hydration, reset/export/import.

**Exit criteria:** completion persists across reloads and multiple tabs.

## Phase 6 — Dashboard + search + gamification

**Deliverables:** dashboard (progress rings, tech/path completion, stats, continue learning, goals) · search page + full ⌘K search (Fuse.js) · badges/achievements UI · completion animation.

**Exit criteria:** dashboard and search fully functional.

## Phase 7 — Sample content

**Deliverables:** CSS (Selectors, Flexbox) · JavaScript ×2 · React ×2 — full lessons, examples, challenges, validators · learning paths wired to registry · home sections (continue learning, featured labs).

**Exit criteria:** end-to-end Read→Complete flow for three technologies.

## Phase 8 — Polish + performance + testing

**Deliverables:** SEO/OG/JSON-LD finalization · a11y pass (axe, keyboard, reduced motion) · performance audit (chunk budgets, Core Web Vitals) · full Vitest + Playwright suite · complete CI pipeline · CHANGELOG/CONTRIBUTING finalization · docs review.

**Exit criteria:** production-ready, tested, documented, CI-green.
