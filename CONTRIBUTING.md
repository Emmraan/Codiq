# Contributing to CODIQ

First off — thank you for contributing. CODIQ is an open-source project and every contribution makes the developer laboratory better.

This guide covers the workflows, conventions, and standards we follow. Please also read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Conventional commits](#conventional-commits)
- [Branching & pull requests](#branching--pull-requests)
- [Code standards](#code-standards)
- [Testing](#testing)
- [Releases & changelog](#releases--changelog)
- [Adding content](#adding-content)
- [Documentation](#documentation)

## Ways to contribute

- **Report bugs** — open an issue with a clear reproduction.
- **Suggest features** — open a discussion or an issue describing the problem you're solving.
- **Write content** — lessons, modules, challenges, validators (see [Adding content](#adding-content)).
- **Write code** — UI, engines, tooling, tests, performance.
- **Improve docs** — this includes `docs/` and the guides in this repository.

## Development setup

Requirements: **Node.js >= 20** and **pnpm >= 10**.

```bash
git clone https://github.com/codiq/codiq.git
cd codiq
pnpm install
pnpm dev
```

> Installations can be heavy on low-end machines. If `pnpm install` feels slow, that's expected — it only happens once.

## Project structure

See the structure section of [README.md](README.md) and the layer rules in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). In short:

- Content lives in `content/` and is **never** hardcoded in React components.
- UI primitives live in `components/ui/`, composites in `components/composite/`.
- Business logic lives in `features/` and reusable hooks in `hooks/`.
- Global state lives in `store/` (Zustand).
- Contracts live in `types/`.

## Conventional commits

We use [Conventional Commits](https://www.conventionalcommits.org/) — enforced by `commitlint` via a husky hook. Commits drive the auto-generated changelog.

```
<type>[optional scope]: <description>

[optional body]
[optional footer(s)]
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

```
feat(playground): add live React preview to playground
fix(progress): restore streak after midnight rollover
docs(content-schema): document challenge schema
refactor(validators): extract shared check runner
test(search): add fuzzy matching cases for tags
```

Rules:

- Header max length: **100 characters**.
- Use the imperative mood ("add", "fix") — not "added", "fixes".
- Add a body explaining **why** when it's not obvious.
- Scope is optional but encouraged for large systems (e.g. `playground`, `validators`, `progress`).

## Branching & pull requests

1. Branch from `main`: `git checkout -b feat/my-change`.
2. Commit with conventional messages (see above).
3. Push and open a pull request into `main`.
4. Fill out the PR template — link related issues and describe what changed and why.
5. CI runs on every PR: lint → typecheck → tests → build → bundle-size check. The PR must be green before merging.
6. Review: at least one maintainer approval. Keep PRs small and focused.

Naming suggestion for branches: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/` prefixes.

## Code standards

- **TypeScript strict** — no `any`. Run `pnpm typecheck`.
- **Lint** — `pnpm lint`. Follow the ESLint config.
- **Formatting** — Prettier with the project config. `pnpm format` will fix everything.
- **No duplicated code** — prefer small functions and reusable hooks.
- **Accessibility** — semantic HTML, keyboard operability, visible focus, ARIA labels where needed.
- **No one-off visuals** — extend design tokens and shared primitives instead of inventing styles.
- **Server Components by default** — mark components `"use client"` only when they need interactivity.

## Testing

- **Unit & integration**: Vitest + Testing Library. `pnpm test`.
- **E2E**: Playwright against a production build. `pnpm test:e2e` (requires `pnpm build` first; the config handles it).
- Coverage runs in CI. Add tests for any logic you touch.

## Releases & changelog

Releases follow [SemVer](https://semver.org/). The changelog is generated from conventional commits by [Changesets](https://github.com/changesets/changesets).

If you make a user-facing change, add a changeset:

```bash
pnpm changeset
```

Select the bump level (`patch` for fixes, `minor` for features, `major` for breaking) and describe the change. Maintainers publish releases; the changelog updates automatically.

## Adding content

The most impactful way to contribute is by writing content. Start with [docs/CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md), which covers:

- The directory layout for a technology (`content/<tech>/tech.json`, modules, lessons).
- The frontmatter contract for `lesson.mdx`.
- The `challenge.json` contract and how validators work.
- How to preview your lesson locally.

A content-only PR is just as valuable as a code PR.

## Documentation

- Architecture and design decisions live in `docs/` — update them when you change behavior.
- Significant decisions should be recorded as ADRs in [docs/ADRS.md](docs/ADRS.md).
- User-facing notes belong in `CHANGELOG.md` (via changesets) — not hand-edited.

## Questions?

Open a discussion or reach out in the community channels listed in [README.md](README.md).

Thank you for contributing to CODIQ.
