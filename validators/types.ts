/**
 * Validation engine contracts.
 *
 * Content validators in `content/<tech>/modules/<module>/validator.ts` implement
 * the `Validator` interface and are bundled at build time into an IIFE that
 * exposes the exports object as `window.__codiqValidator`. The sandboxed iframe
 * harness (`validators/harness.ts`) executes that bundle inside an opaque
 * sandbox and communicates over `postMessage` using the message shapes below.
 * See docs/VALIDATION_ENGINE.md.
 */

/** Built-in validator types shipped by the engine. Content validators either
 *  implement `Validator` directly or delegate to the shared helpers in
 *  `validators/builtin/` that back these types. */
export type ValidatorType = "html" | "css" | "js" | "ts" | "react" | "express";

export interface ValidatorInput {
  /** File name → source code of the learner's solution. */
  code: Record<string, string>;
  /** The challenge's validator config (from challenge.json). */
  config: Record<string, unknown>;
}

export interface CheckResult {
  id: string;
  label: string;
  passed: boolean;
  message?: string;
  hint?: string;
}

export interface ConsoleLine {
  level: "log" | "info" | "warn" | "error";
  text: string;
}

export interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
  /** Captured console output. */
  console: ConsoleLine[];
  /** Free-form feedback (errors, compile messages). */
  feedback: string[];
}

export interface Validator {
  type: string;
  run(input: ValidatorInput): Promise<ValidationResult> | ValidationResult;
}

/** A well-known library the sandbox bootstraps from a CDN before running. */
export interface RuntimeLibrary {
  name: string;
  /** Global the library installs on the sandbox window (e.g. "ts", "React"). */
  global: string;
  url: string;
}

/** Host → sandbox: kick off a validation run. */
export interface RunRequest {
  id: number;
  type: "run";
  code: Record<string, string>;
  config: Record<string, unknown>;
}

/** Sandbox → host messages. */
export type SandboxMessage =
  | { type: "ready" }
  | { type: "console"; id?: number; level: string; text: string }
  | { type: "result"; id?: number; result: ValidationResult }
  | { type: "error"; id?: number; message: string };

/** Build-time result of bundling a content validator (see build-content). */
export interface BundledValidator {
  /** Relative path under `lib/generated/validators/`, e.g. "validators/css-css-selectors.js". */
  path: string;
  /** Raw IIFE source, embeddable into the harness `srcdoc`. */
  source: string;
}
