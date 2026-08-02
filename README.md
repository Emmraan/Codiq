# CODIQ

**The Full Stack Developer Laboratory.**

CODIQ is not a documentation website. It is an interactive developer laboratory where you learn by **reading**, **understanding**, **seeing examples**, **experimenting**, **solving validated challenges**, and **progressing** — entirely in your browser. No accounts. No backend. Your progress lives locally.

After completing a technology inside CODIQ, you should be able to read the official documentation independently — without relying on tutorials.

## Highlights

- **Content-driven** — lessons, modules, challenges and validators are plain files under `content/`. Adding a technology requires zero UI changes.
- **Live playgrounds** — Monaco-powered editor with Sandpack live previews per technology.
- **Validation engine** — every challenge owns a pluggable, sandboxed validator (HTML, CSS, JS, TS, React, Express and more).
- **Progress that respects you** — XP, levels, badges, streaks and completion stored locally in IndexedDB (with localStorage fallback).
- **Fast & premium** — Next.js 16 App Router, dark-first design system, route-level code splitting, lazy-loaded editors.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Framer Motion · Zustand · IndexedDB (`idb`) · MDX · Monaco · Sandpack · Fuse.js · Zod · Vitest · Playwright

## Getting started

Requirements: **Node.js >= 20** and **pnpm >= 10**.

> Note: installs can be heavy on low-end machines — grab a coffee.

```bash
pnpm install        # install dependencies
pnpm dev            # start the dev server at http://localhost:3000
```

Common commands:

```bash
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm test           # vitest (unit + integration)
pnpm test:e2e       # playwright
pnpm content:build  # rebuild the content registry (Phase 2+)
pnpm build          # production build
```

## Project structure

```
app/          Routes, layouts, pages (App Router)
components/   UI primitives (shadcn), composite components, feature components
content/      All authored content — technologies, modules, lessons, challenges
config/       Site config, navigation, learning paths, seeds
features/     Business logic per domain (lessons, search, gamification, …)
hooks/        Reusable React hooks
lib/          Content engine, storage, search, icons, utils
store/        Zustand stores (progress, settings, UI)
types/        Content, progress, gamification and validation contracts
validators/   Validation engine + sandboxed harness (Phase 4)
scripts/      Build-time content pipeline (Phase 2)
docs/         Architecture, plans, and authoring guides
tests/        Unit, integration and E2E suites
```

## Documentation

| Doc                                                        | Purpose                              |
| ---------------------------------------------------------- | ------------------------------------ |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)               | System architecture and layer rules  |
| [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | Phased build plan with exit criteria |
| [docs/CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md)           | Content model + authoring guide      |
| [docs/VALIDATION_ENGINE.md](docs/VALIDATION_ENGINE.md)     | Validation framework design          |
| [docs/STATE_AND_DATA.md](docs/STATE_AND_DATA.md)           | Persistence and state design         |
| [docs/ADRS.md](docs/ADRS.md)                               | Architecture decision records        |
| [PROGRESS.md](PROGRESS.md)                                 | Live implementation tracker          |
| [CHANGELOG.md](CHANGELOG.md)                               | Release notes (Keep a Changelog)     |

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, commit conventions, and the PR process, and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for upcoming work — including PWA/offline support, AI Tutor, AI hints, AI code review, revision mode, and more.

## License

MIT — see [LICENSE](LICENSE).
