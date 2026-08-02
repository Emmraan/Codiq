# CODIQ — State & Data

## 1. Overview

CODIQ has **no server state**. All data is either static content (build-time) or client state (runtime). Global state is managed with Zustand and persisted locally.

```
┌───────────────────────────────────────────────────────────┐
│  Zustand stores                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐    │
│  │ progress     │  │ settings     │  │ ui (ephemeral)│    │
│  │ (persisted)  │  │ (persisted)  │  │ (not persisted)│   │
│  └──────┬───────┘  └──────┬───────┘  └───────────────┘    │
│         │                 │                               │
│         └────────┬────────┘                               │
│                  ▼                                        │
│       Storage adapter (lib/storage.ts)                    │
│       IndexedDB (idb) → localStorage fallback             │
└───────────────────────────────────────────────────────────┘
```

## 2. Storage abstraction (`lib/storage.ts`)

- `StorageAdapter` interface: `getItem` / `setItem` / `removeItem` (all async).
- IndexedDB backed by `idb` (single `kv` object store, DB `codiq`), feature-detected.
- Falls back to `localStorage` when IndexedDB is unavailable (private mode, restricted contexts).
- `createAsyncJSONStorage()` adapts this to Zustand's `persist` middleware.

Keys (`lib/constants.ts`): `codiq:progress:v1`, `codiq:settings:v1`, `codiq:activity:v1`.

## 3. Stores

### Progress store (`store/progress-store.ts`)

| Field                               | Purpose                               |
| ----------------------------------- | ------------------------------------- |
| `completedLessons`, `completedLabs` | Completion tracking                   |
| `currentLesson`, `currentPath`      | Resume + "continue learning"          |
| `totalXp`                           | XP total                              |
| `streak`                            | current/best streak, last active date |
| `resume`                            | lesson slug + scroll position         |
| `badges`, `achievements`            | Gamification                          |
| `activity`                          | Bounded event log (200 entries)       |

Actions: `startLesson`, `completeLesson`, `completeLab`, `awardXp`, `addEvent`, `setCurrentPath`, `setResumePosition`, `resetProgress`.

### Settings store (`store/settings-store.ts`)

Theme (dark-first, light opt-in), editor font size, editor theme, animations toggle.

### UI store (`store/ui-store.ts`)

Command palette, mobile nav, lesson sidebar — ephemeral, never persisted.

## 4. Gamification services (Phase 5)

- **XP** — awarded per lesson/lab; accumulated in the progress store.
- **Levels** — threshold curve in `config/levels.ts` (LevelDef with `xpRequired`).
- **Badges & achievements** — declarative definitions (`config/badges.ts`, `config/achievements.ts`) with rules evaluated on events by `features/gamification/`.
- **Streak** — updated on daily activity; rollover logic tested for timezone/midnight edges.
- **Daily/weekly goals** — rolling targets in `types/progress.ts` (DailyGoal, WeeklyGoal).

## 5. Cross-tab sync & hydration

- Stores hydrate from storage on first client interaction (`useProgressStore` exposes `hydrate()`).
- Cross-tab updates sync via the browser `storage` event (Phase 5).
- `resetProgress` clears local data; export/import (Phase 6) round-trips the JSON.

## 6. Design constraints

- Stores stay **small and domain-shaped**; no component state in global stores.
- Derived values (levels, completion %) are **computed**, never stored.
- Persistence is async everywhere — the UI treats hydration as a first-class loading state.
