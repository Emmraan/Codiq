# CODIQ — Validation Engine

## 1. Goal

Every lab challenge is graded by a **reusable, pluggable validation engine**. We **never compare plain strings**. Instead, each challenge owns a validator that inspects the learner's code and produces granular, per-check feedback.

## 2. Core concepts

```ts
interface ValidatorInput {
  /** File name → source code of the learner's solution. */
  code: Record<string, string>;
  /** The challenge's validator config (from challenge.json). */
  config: ValidatorConfig;
}

interface CheckResult {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
  hint?: string;
}

interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
  /** Captured console output. */
  console: Array<{ level: string; text: string }>;
  /** Free-form feedback (errors, compile messages). */
  feedback: string[];
}
```

A `Validator` is a factory keyed by type in a registry (`validators/index.ts`):

```ts
interface Validator {
  type: string;
  run(input: ValidatorInput): Promise<ValidationResult>;
}
```

New validator types are **pluggable**: implement the interface, register the type, done.

## 3. Execution model — sandboxed iframe harness

Untrusted learner code **never runs on the main thread**. The harness:

1. Builds an iframe via `srcdoc` with the `sandbox` attribute **without** `allow-same-origin` (keeps the sandbox opaque).
2. Injects the learner code + the challenge's compiled validator bundle.
3. Communicates over `postMessage`: `ready`, `console`, `result`, `error`.
4. Enforces a timeout and always resolves with a structured `ValidationResult`.

This mirrors how code actually runs in the browser (DOM, CSS cascade, React, fetch) while keeping the app safe.

## 4. Built-in validator types

| Type      | Language     | Evaluates                                                |
| --------- | ------------ | -------------------------------------------------------- |
| `html`    | HTML         | structure, presence of elements/attributes, nesting      |
| `css`     | CSS          | selector presence, computed styles in a rendered fixture |
| `js`      | JavaScript   | console capture + assertion checks on outputs            |
| `ts`      | TypeScript   | compile to JS (esbuild) + assertion checks               |
| `react`   | React        | renders in the sandbox, asserts on output + behavior     |
| `express` | Express mock | simulated requests against an in-memory router           |

Each validator is authored under `validators/` and registered in the type map.

## 5. ChallengeRunner UI

- Requirements checklist that reflects live check results.
- Code editor (Monaco, lazy) + Run / Reset.
- Progressive hints (each reveal costs nothing, encourages attempt).
- Results panel with per-check pass/fail + hints.
- Success dialog on all-pass → triggers XP award + completion animation (Phase 5/6).

## 6. Security

- `sandbox` iframe without `allow-same-origin`; `postMessage` as the only bridge.
- Validators are bundled at build time from trusted `content/` source.
- No `eval` on the main thread. CSP-friendly.

## 7. Testing

The engine is unit-tested (Vitest): each validator type, the harness protocol, timeouts, and error paths. See `tests/validators/` (Phase 4).
