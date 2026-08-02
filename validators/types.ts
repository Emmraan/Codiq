/**
 * Validation engine contracts.
 *
 * Phase 2 establishes the authoring surface (`Validator`) used by content
 * validators in `content/<tech>/modules/<module>/validator.ts`. The sandboxed
 * iframe harness that executes these bundles lands in Phase 4.
 * See docs/VALIDATION_ENGINE.md.
 */

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

export interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
  /** Captured console output. */
  console: Array<{ level: string; text: string }>;
  /** Free-form feedback (errors, compile messages). */
  feedback: string[];
}

export interface Validator {
  type: string;
  run(input: ValidatorInput): Promise<ValidationResult>;
}
