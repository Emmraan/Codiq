# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Release notes are generated automatically from conventional commits via
[Changesets](https://github.com/changesets/changesets). See
[CONTRIBUTING.md](CONTRIBUTING.md) for the commit guidelines.

## [Unreleased]

### Added

- Next.js 16 (App Router) foundation with TypeScript (strict) and Tailwind CSS v4.
- Dark-first design system with semantic tokens, Geist fonts, and light-theme support.
- shadcn/ui primitives: Button, Badge, Card, Dialog, DropdownMenu, Sheet, Tabs, Command, ScrollArea, Tooltip, Avatar, Progress, Input, Label, Separator, Skeleton, Sonner.
- Base layout: sticky header, responsive mobile nav, footer, and ⌘K command palette.
- Zustand stores with IndexedDB persistence (localStorage fallback): settings, UI, and progress skeleton.
- Route skeleton for all pages: home, paths, technologies, lesson, playground, labs, dashboard, search, settings, about — with loading, error, and 404 states.
- SEO foundation: metadata, OpenGraph, Twitter cards, sitemap, robots, and PWA-ready web manifest.
- Open-source governance: MIT license, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, README, and contributor guide.
- Tooling: Conventional Commits (commitlint), lint-staged, Husky, Changesets, ESLint, Prettier, Vitest, and Playwright configs.
- Documentation: architecture, implementation plan, content schema, validation engine, state & data, ADRs, and roadmap.

> This is a foundation release: the content pipeline, playground, validation engine, and sample content arrive in subsequent phases. See [PROGRESS.md](PROGRESS.md).
