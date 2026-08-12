# CODIQ — Validation Engine

## 1. Goal

Every lab challenge is graded by a **reusable, pluggable validation engine**. We **never compare plain strings**. Instead, each challenge owns a validator that inspects the learner's code and produces granular, per-check feedback.

## 2. Core concepts

```ts
type ValidatorType = "html" | "css" | "js" | "ts" | "react" | "express";

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

interface ConsoleLine {
  level: "log" | "info" | "warn" | "error";
  text: string;
}

interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
  /** Captured console output. */
  console: ConsoleLine[];
  /** Free-form feedback (errors, compile messages). */
  feedback: string[];
}
```

A `Validator` is a factory keyed by type in a registry (`validators/index.ts`):

```ts
interface Validator {
  type: string;
  run(input: ValidatorInput): Promise<ValidationResult> | ValidationResult;
}
```

New validator types are **pluggable**: implement the interface, register the type in `validatorFactories`, add a `RUNTIME_LIBS` entry, done.

## 3. Execution model — sandboxed iframe harness

Untrusted learner code **never runs on the main thread**. The harness (`validators/harness.ts`):

1. Builds a hidden iframe via `srcdoc` with `sandbox="allow-scripts"` **without** `allow-same-origin` (the frame has an opaque origin and can never touch the hosting page).
2. Injects the challenge's compiled validator bundle (a build-time esbuild **IIFE** with `globalName: "__codiqValidator"`, so the exports object lands on `window.__codiqValidator`) plus any required runtime library scripts.
3. Communicates over `postMessage` (`SandboxMessage`) and enforces a timeout (`DEFAULT_VALIDATOR_TIMEOUT_MS = 8000`).
4. Always resolves with a structured `ValidationResult` — the harness never throws.

The harness is intentionally thin: all per-challenge behaviour lives in the validator bundle.

### 3.1 Sandbox document layout

The `srcdoc` built by `buildSandboxHtml(validatorSource, runtime)` is:

```html
<!doctype html>
<html lang="en">
  <head>… runtime library <script src="…"> tags …</head>
  <body>
    <script>…validator IIFE (window.__codiqValidator)…</script>
    <script>…harness bootstrap (console capture + message relay)…</script>
  </body>
</html>
```

The bootstrap captures `console.*`, stores it in `window.__codiqConsole`, relays every line to the host live, and runs the validator on demand.

### 3.2 Runtime libraries

Libraries the `ts` / `react` validators need are bootstrapped from a CDN into the sandbox **before** the learner code runs:

| Type    | Libraries loaded                                                   |
| ------- | ------------------------------------------------------------------ |
| `html`  | —                                                                  |
| `css`   | —                                                                  |
| `js`    | —                                                                  |
| `ts`    | TypeScript 5.5 (`window.ts`)                                       |
| `react` | TypeScript 5.5 + React 18 UMD (`window.React` + `window.ReactDOM`) |

No library is ever fetched at runtime by the learner's code; the sandbox only ever talks to the host via `postMessage`.

### 3.3 postMessage protocol

Host → sandbox (`RunRequest`):

```ts
interface RunRequest {
  id: number; // correlates the response
  type: "run";
  code: Record<string, string>; // learner files
  config: Record<string, unknown>; // challenge validator config
}
```

Sandbox → host (`SandboxMessage`):

```ts
type SandboxMessage =
  | { type: "ready" } // bootstrap finished
  | { type: "console"; id?: number; level: string; text: string } // live console line
  | { type: "result"; id?: number; result: ValidationResult } // run finished
  | { type: "error"; id?: number; message: string }; // validator crashed / lib missing
```

The host only accepts messages whose `event.source` is the harness frame and whose `event.origin === "null"`; stale `id`s and foreign origins are ignored. A run that exceeds the timeout resolves as `passed: false` with a "timed out" message and destroys the frame.

## 4. Built-in validator types

| Type      | Language     | Evaluates                                                       | File                            |
| --------- | ------------ | --------------------------------------------------------------- | ------------------------------- |
| `html`    | HTML         | structure, presence of elements/attributes, nesting             | `validators/builtin/html.ts`    |
| `css`     | CSS          | selector presence, computed styles in a rendered fixture        | `validators/builtin/css.ts`     |
| `js`      | JavaScript   | console capture + assertion checks on outputs                   | `validators/builtin/js.ts`      |
| `ts`      | TypeScript   | transpile (sandbox `window.ts` or injected esbuild) + js checks | `validators/builtin/ts.ts`      |
| `react`   | React        | transpile TSX → CJS, render in sandbox, assert on DOM           | `validators/builtin/react.ts`   |
| `express` | Express mock | simulated requests against a parsed in-memory router (no eval)  | `validators/builtin/express.ts` |

Each validator is authored under `validators/builtin/` and registered in `validators/index.ts`. Content validators may implement `Validator` directly (bundled standalone) or delegate to these factories, e.g. `export const validator = createCssValidator({ ... })`.

## 5. Build pipeline

`scripts/build-content.mts` discovers each module's `validator.ts`, bundles it with esbuild into an IIFE under `lib/generated/validators/<tech>-<module>.js` (`globalName: "__codiqValidator"`), and emits the map `lib/generated/validator-sources.ts` (`validatorKey` → raw source). The `ChallengeRunner` embeds that raw source into the sandbox `srcdoc` — so validators execute with the learner's code inside an opaque origin without any runtime network fetch of app code.

## 6. ChallengeRunner UI

- `components/feature/challenge/challenge-runner.tsx` — Monaco editor (per-file tabs) + Run / Reset toolbar, wired into every lesson with a `challenge.json`.
- Requirements checklist that reflects live check results (pending / running / pass / fail with messages + hints).
- Progressive hints (each reveal costs nothing, encourages attempt).
- Console output panel fed by live `console` `postMessage` lines.
- `components/feature/challenge/success-dialog.tsx` — all-pass dialog → records completion in the progress store (Phase 1) and awards XP. Phase 5/6 build gamification on top.
- `app/labs/page.tsx` lists every published lesson that ships a challenge.

## 7. Security

- `sandbox="allow-scripts"` iframe **without** `allow-same-origin`; `postMessage` is the only bridge. The host validates `event.source` and the `null` origin.
- Validators are bundled at build time from trusted `content/` source; no `eval` on the main thread. CSP-friendly.
- Learner code runs only inside the opaque sandbox; `console` capture and result relay are the only side channels.

## 8. Testing

The engine is unit-tested (Vitest): each built-in validator type, the harness protocol (valid/forged/stale messages, origins), timeouts, and error paths.

- `validators/builtin/*.test.ts` — per-type check suites.
- `validators/harness.test.ts` — sandbox document layout, message relay, timeout + disposal.
