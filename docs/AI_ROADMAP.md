# CODIQ — AI Roadmap

AI features are planned and designed for but not built yet. This document defines the seams so they can be added **without refactoring**.

## Principles

- **Provider-agnostic.** We define our own service interface; providers plug in behind it.
- **Server-side only.** API keys and provider credentials live on the server (route handlers), never in the client bundle.
- **Respects the local model.** AI is optional, opt-in, and never required to complete a lesson.

## Planned features

| Feature               | What it does                                                          | Where it plugs in                                      |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| AI Tutor              | Conversational guidance grounded in the current lesson context        | `features/ai/` tutor service + chat UI on lesson pages |
| AI Hint System        | Contextual, progressive hints for the active challenge                | Extends `ChallengeRunner` hints flow                   |
| AI Code Review        | Asks the AI to review the learner's solution and suggest improvements | Runs on the solution code before/after validation      |
| AI Explain My Mistake | Translates validation failures into plain-language explanations       | Consumes `ValidationResult` + lesson context           |

## Reserved seams

- `lib/ai/` — `AIService` interface: `complete`, `hint`, `review`, `explainMistake`. Ships with a no-op/mock implementation.
- `features/ai/` — feature components/hooks (tutor chat, review panel).
- `content/` metadata — lessons already carry objectives, keywords, and code samples, so a lesson's context can be injected into prompts without schema changes.
- Route handlers (`app/api/ai/*`) — the only place provider calls are allowed. Keeps keys out of the client.

## Suggested rollout

1. **Milestone A** — `AIService` interface + mock; `app/api/ai/hint` route behind an env-gated provider.
2. **Milestone B** — AI hint system in ChallengeRunner (progressive hints, always optional).
3. **Milestone C** — Explain-my-mistake panel powered by `ValidationResult`.
4. **Milestone D** — AI code review + tutor chat on lesson pages.

## Constraints

- Streaming responses with graceful fallback when the provider is unavailable.
- Caching + rate limiting on server routes.
- No learner code or progress ever leaves the browser unless the learner explicitly requests an AI action.
