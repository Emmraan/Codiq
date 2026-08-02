# CODIQ — Architecture Decision Records

This file logs significant architecture decisions. New ADRs are appended; superseded ones are marked deprecated.

## ADR-001: Build-time content registry + MDX

**Status:** Accepted

**Context:** The app must be fully content-driven — adding a lesson or technology must not require editing UI code. Runtime file access isn't possible on static hosts, and dynamic globbing is fragile.

**Decision:** `scripts/build-content.mts` (run via the `scripts/content-build.mjs` launcher, see ADR-009) scans `content/`, validates with Zod, compiles MDX, bundles validators (esbuild), extracts search data, and emits `lib/generated/content-registry.ts` + `search-index.json` plus compiled MDX modules, validator bundles, and example sources. `generateStaticParams` consumes the registry. MDX is compiled with `@mdx-js/mdx` and rendered with `@mdx-js/react` (React 19 compatible).

**Consequences:** + Adding content = dropping files + rebuild. + Works on any static host. + Full type safety. − Requires a build step for content changes. − Registry must be regenerated in CI.

**Alternatives considered:** `next-mdx-remote` (React peer-dependency friction with React 19); filesystem reads in Server Components (couples content to Node hosts).

**Reversal cost:** Medium.

## ADR-002: Sandboxed iframe validation harness

**Status:** Accepted

**Context:** Challenges require running untrusted learner code safely while producing realistic, browser-accurate results.

**Decision:** A sandboxed iframe harness (`srcdoc`, CSP `sandbox` attribute **without** `allow-same-origin`) communicates over `postMessage`. Each challenge owns a validator bundled from `content/`. Never `eval` on the main thread.

**Consequences:** + Safe execution of arbitrary code. + Realistic DOM/CSS/React behavior. + Pluggable validator types. − Slightly higher harness complexity; needs careful protocol testing.

**Alternatives considered:** Web Worker (no DOM), main-thread eval (unsafe).

**Reversal cost:** Low.

## ADR-003: Monaco for editing + Sandpack for previews (both lazy)

**Status:** Accepted

**Context:** The stack lists both Monaco Editor and Sandpack; both are heavy and overlap in editor capability.

**Decision:** Monaco powers the challenge/playground editors (full IDE features, settings-aware). Sandpack provides live previews (CSS/HTML/React/JS). Both are code-split and loaded on demand; bundles are verified in Phase 8.

**Consequences:** + Best-in-class editing + realistic previews. + Small initial bundle. − Two editor runtimes to maintain.

**Alternatives considered:** Monaco-only, Sandpack-only.

**Reversal cost:** Low.

## ADR-004: Zustand + IndexedDB with localStorage fallback

**Status:** Accepted

**Context:** No backend, no auth. Progress must persist locally, survive reloads, and be privacy-respecting.

**Decision:** Zustand with `persist` middleware, backed by an async storage adapter over `idb` (IndexedDB) falling back to `localStorage`. Gamification values are derived, never duplicated.

**Consequences:** + Small, fast global state. + Large progress data survives private browsing. − Async hydration must be handled as a loading state.

**Reversal cost:** Low.

## ADR-005: Next.js 16 App Router, static-export capable

**Status:** Accepted

**Context:** Need SEO, fast navigation, route-level code splitting, and a no-backend deploy story.

**Decision:** Next.js 16 (App Router) with Server Components for content pages and client islands for interactivity. Route-level code splitting by default. Static-first design (content registry) keeps static export viable.

**Consequences:** + SEO + performance + developer experience. − Next 16 has breaking changes vs earlier versions; code is written against current stable APIs (async `params`, Turbopack).

**Reversal cost:** Medium.

## ADR-006: pnpm package manager

**Status:** Accepted

**Context:** Dependency-heavy app on a low-end dev machine.

**Decision:** pnpm (pinned via `packageManager`) — fast installs, disk-efficient content-addressed store, strict dependency resolution.

**Consequences:** + Faster, smaller installs. − Slightly stricter peer-resolution behavior.

**Reversal cost:** Low.

## ADR-007: Conventional Commits + Changesets for releases

**Status:** Accepted

**Context:** Industry-standard open-source release process with an auto-generated changelog.

**Decision:** Conventional Commits enforced by commitlint; Changesets for versioning + CHANGELOG generation; MIT license; GitHub Actions CI on PRs and `main`.

**Consequences:** + Clean history, semantic versions, zero-manual changelog. − Contributors must follow commit conventions.

**Reversal cost:** Low.

## ADR-008: AI-ready seams, provider-agnostic

**Status:** Accepted

**Context:** AI features (Tutor, hints, code review, explain-my-mistake) are planned. They must be added later without refactoring.

**Decision:** Reserve `features/ai/` and `lib/ai/` with a provider-agnostic `AIService` interface (`complete`, `hint`, `review`, `explainMistake`) and a no-op implementation. AI keys remain server-side only. Content carries machine-readable metadata for context injection. See [AI_ROADMAP.md](AI_ROADMAP.md).

**Consequences:** + No refactor when AI lands. − Interface may need tuning once a real provider is chosen.

**Reversal cost:** Low.

## ADR-009: esbuild-CJS launcher for the content pipeline

**Status:** Accepted

**Context:** The Phase 2 content pipeline imports `@mdx-js/mdx`, whose transitive dependency `estree-walker@3.0.3` is ESM-only — its `exports` map provides no `require` condition, and pnpm does not hoist it to a path a CJS resolver can reach. Running the pipeline with `tsx` (which resolves bare ESM-only packages through the CJS resolver) throws `ERR_PACKAGE_PATH_NOT_EXPORTED`.

**Decision:** Author the pipeline as `scripts/build-content.mts` and execute it via `scripts/content-build.mjs`, which bundles the pipeline to a single CJS file with esbuild (platform: node, aliasing `@/` to the repo root, esbuild itself external) and runs it through `createRequire`. `CODIQ_ROOT` overrides the working directory for tests/CI.

**Consequences:** + Runs on any Node ≥ 18 without a tsx dependency. + Bundle step also validates the emit surface. − Pipeline cannot use top-level await; main is invoked explicitly. − An extra build hop between content and registry.

**Alternatives considered:** Installing `estree-walker` as a direct dependency with an explicit `require` condition (fragile, patches the dependency tree); pinning tsx (same resolver problem); `node --experimental-strip-types` (not stable in the pinned Node range at time of writing).

**Reversal cost:** Low.
