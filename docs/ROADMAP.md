# CODIQ — Roadmap

Planned future expansion. Features are designed to fit the existing architecture without major refactoring.

## Near term (aligned with the build plan)

- **Phase 2–8** — content engine, playground, validation engine, progress system, dashboard/search/gamification, sample content, polish. See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Post-MVP

### Learning & content

- **Revision Mode** — spaced-repetition review of completed lessons.
- **Roadmaps** — broader, interactive career roadmaps beyond the three starter paths.
- **Multi-language content** — content is locale-independent by design; add a locale layer (URL prefix + i18n for UI chrome).
- **Bookmarks, Notes & Favorites** — learner-generated annotations stored locally.

### Product

- **Offline Mode (PWA)** — service worker caching the static shell + content registry; web manifest already in place.
- **Mock Interviews** — timed question sets with the validation engine grading answers.
- **Coding Contests** — timed challenges scored by the same validator engine.
- **Project Builder** — guided multi-step projects that chain lessons into real applications.

### AI (see [AI_ROADMAP.md](AI_ROADMAP.md))

- AI Tutor, AI Hint System, AI Code Review, AI Explain My Mistake.

### Platform

- **Content governance** — review workflow, content linting, preview environments for `content/` PRs.
- **Analytics (privacy-respecting)** — optional, opt-in, aggregate-only.
- **More validators** — Python, Go, Rust, Docker, Git, SQL, Redis, GraphQL validators as those technologies are added.

## Design constraints that keep these cheap

- Content-driven registry → adding tech/content is data-only.
- Pluggable validators → new languages = new validator type.
- Local-first storage → PWA/offline fits naturally.
- Provider-agnostic AI interface → AI features slot in without refactors.
