/**
 * Shared helpers for the built-in validators in `validators/builtin/`.
 *
 * These run inside the sandboxed iframe (and under jsdom in tests). Anything
 * here must be safe to execute in an opaque-origin frame: no access to the
 * hosting page, no ambient authorities.
 */
import type { CheckResult, ConsoleLine } from "@/validators/types";

/** Format a console argument like the browser would. */
export function formatConsoleArg(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === undefined) return "undefined";
  if (typeof value === "function") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Format multiple console arguments into a single line. */
export function formatConsoleLine(args: unknown[]): string {
  return args.map(formatConsoleArg).join(" ");
}

/** Run `fn` with `console` captured; always restores the original methods. */
export function captureConsole(fn: () => void): ConsoleLine[] {
  const captured: ConsoleLine[] = [];
  const levels = ["log", "info", "warn", "error"] as const;
  const originals: Partial<Record<(typeof levels)[number], typeof console.log>> = {};

  for (const level of levels) {
    originals[level] = console[level];
    console[level] = (...args: unknown[]) => {
      captured.push({ level, text: formatConsoleLine(args) });
    };
  }

  try {
    fn();
  } finally {
    for (const level of levels) {
      console[level] = originals[level] as typeof console.log;
    }
  }
  return captured;
}

/**
 * Execute source in the sandbox's global scope (indirect eval). Declarations
 * like `var x` / `function f` land on `window`, mirroring how a plain `<script>`
 * tag would behave — this is only ever called inside the opaque sandbox.
 */
export function executeInGlobal(source: string): void {
  (0, eval)(source);
}

/** Loose equality: JSON deep-compare for objects/arrays, strict otherwise. */
export function looseEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  return false;
}

/** Read `input.code[key]`, falling back to another file when the primary is missing. */
export function readCode(
  code: Record<string, string>,
  primary: string,
  fallbacks: string[] = [],
): string {
  const value = code[primary];
  if (value !== undefined) return value;
  for (const key of fallbacks) {
    if (code[key] !== undefined) return code[key] as string;
  }
  return "";
}

/** Build a `CheckResult` from a raw triple and an optional suite label map. */
export function makeCheck(
  id: string,
  label: string,
  passed: boolean,
  message?: string,
  hint?: string,
): CheckResult {
  return { id, label, passed, message, hint };
}

/** All-pass check aggregator. */
export function aggregate(
  checks: CheckResult[],
  extraFeedback: string[] = [],
): {
  passed: boolean;
  checks: CheckResult[];
  feedback: string[];
} {
  return {
    passed: checks.every((check) => check.passed),
    checks,
    feedback: extraFeedback,
  };
}
