# CODIQ — Architecture

## 1. Overview

CODIQ is a **static-first Next.js 16 application** with no backend. All content is compiled at build time into a typed registry; all interactivity (playground, validation, progress) runs client-side. Progress is persisted locally in IndexedDB with a localStorage fallback.

```
┌────────────────────────────────────────────────────────────────────┐
│                           Browser (client)                          │
│                                                                    │
│  UI Components  ←─  Feature logic/hooks  ←─  Zustand stores       │
│      │                    │                       │                │
│      │                    │                 Progress/UI/Settings  │
│      ▼                    ▼                       │                │
│  Content registry   Validation engine        Storage adapter       │
│  (build-time MDX)   (sandboxed iframes)   (IndexedDB | localStorage)│
└────────────────────────────────────────────────────────────────────┘
          ▲                              ▲
          │ build time                   │ runtime
┌─────────┴──────────────────────────────┴───────────────────────────┐
│  scripts/build-content.ts   content/ (MDX, challenge.json, etc.)    │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Rendering strategy

| Route                              | Strategy                             | Why                                            |
| ---------------------------------- | ------------------------------------ | ---------------------------------------------- |
| Marketing & index pages            | Server Components (static)           | Fast, SEO-friendly                             |
| Lesson pages                       | Server-rendered MDX + client islands | Content SEO + interactive playground/challenge |
| Playground / challenge / dashboard | Client components                    | Heavy interaction; lazy-loaded editors         |

Routes are statically generated from the content registry where possible.

## 3. Layer rules

Dependencies point **inward**: `app → features → lib → types`. No reverse imports.

| Layer         | Owns                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------- |
| `app/`        | Routes, layouts, page composition                                                           |
| `components/` | Presentation only. `ui/` (primitives), `composite/` (patterns), `feature/` (feature-scoped) |
| `features/`   | Business logic per domain: lessons, progress, search, gamification, playground, validation  |
| `hooks/`      | Reusable client hooks                                                                       |
| `store/`      | Global state (Zustand). No component-specific state here                                    |
| `lib/`        | Infrastructure: content engine, storage, search, utils                                      |
| `types/`      | Contracts shared across layers                                                              |
| `validators/` | Validation engine + sandbox harness                                                         |
| `config/`     | Static configuration (site, nav, paths, seeds)                                              |
| `content/`    | All authored content (data, never code)                                                     |
| `scripts/`    | Build-time content pipeline                                                                 |

### Rules

- Content is **data**. React components never import MDX or challenge files directly — they consume the generated registry.
- Components are **dumb**: no data fetching, no business logic. Logic lives in hooks/features.
- No prop drilling: shared state flows through Zustand stores.
- No one-off visuals: extend design tokens and shared primitives.

## 4. Data architecture

### Content registry (build time)

`scripts/build-content.ts` scans `content/`, validates metadata with Zod, compiles MDX, bundles validators (esbuild), extracts headings/text for search, and emits `lib/generated/content-registry.ts` + `search-index.json`. Fully regenerated per build. See [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md).

### Progress (runtime, client-only)

Stored in IndexedDB via a thin `idb` wrapper, falling back to localStorage. Managed by the progress store. See [STATE_AND_DATA.md](STATE_AND_DATA.md).

## 5. Key systems

### Validation engine

Every challenge owns a pluggable validator. Validators run inside a **sandboxed iframe** (`CSP sandbox` attribute, no `allow-same-origin` for untrusted code) communicating via `postMessage`. Built-in validator types: html, css, js, ts, react, express-mock. See [VALIDATION_ENGINE.md](VALIDATION_ENGINE.md).

### Playground

Monaco (lazy) for editing; Sandpack (lazy) for live previews. Editors are settings-aware (font size, theme). See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) Phase 3.

### Search

A build-time search index + client-side fuzzy matching (Fuse.js). Instant, offline-friendly. Command palette (⌘K) + `/search` page. Phase 6.

## 6. Cross-cutting concerns

- **Accessibility:** semantic HTML, keyboard operability, visible focus, ARIA on custom widgets, `prefers-reduced-motion`.
- **Performance:** static-first, route code splitting, lazy Monaco/Sandpack/Framer Motion, memoized lists. Budgets verified in Phase 8.
- **Security:** untrusted code only in sandboxed iframes; no secrets in the client; AI keys server-side only.
- **Error handling:** page/feature/widget error boundaries; consistent empty/loading/error states.
- **SEO:** metadata, OpenGraph image, sitemap, robots, structured data.

## 7. Extensibility

- **New technology:** create `content/<slug>/` and rebuild. Registry + routes + sitemap + search update automatically.
- **New validator type:** implement `Validator`, register it in the registry map.
- **New language:** content is locale-independent; add a locale layer per [ROADMAP.md](ROADMAP.md).

See [ADRS.md](ADRS.md) for the decision records behind this architecture.
