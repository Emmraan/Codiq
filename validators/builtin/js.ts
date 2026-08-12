/**
 * Built-in `js` validator.
 *
 * Executes the learner's JavaScript via indirect eval inside the sandbox and
 * evaluates console output / global variables. The learner source and the check
 * probes are evaluated together in a single indirect eval so both `var`
 * declarations (window properties) and global lexical bindings (const/let) are
 * visible to the probes. Never touches the hosting page.
 */
import type {
  CheckResult,
  ConsoleLine,
  Validator,
  ValidatorInput,
  ValidationResult,
} from "@/validators/types";
import {
  aggregate,
  captureConsole,
  executeInGlobal,
  looseEquals,
  makeCheck,
  readCode,
} from "./shared";

interface JsCheckBase {
  id: string;
  label?: string;
  hint?: string;
}

interface ConsoleCheck extends JsCheckBase {
  type: "console";
  /** At least one captured console line must match. */
  pattern: RegExp;
}

interface GlobalCheck extends JsCheckBase {
  type: "global";
  /** Global variable name to inspect (e.g. "sum" or "window.count"). */
  name: string;
  /** Assert the variable is defined. */
  defined?: boolean;
  /** Expected value (loose equality; objects deep-compared). */
  equals?: unknown;
}

export type JsCheck = ConsoleCheck | GlobalCheck;

export interface JsValidatorConfig {
  /** Key in `input.code` that holds the JavaScript source. Defaults to "index.js". */
  file?: string;
  checks: JsCheck[];
  /** Optional transform applied before execution (used by the `ts` validator). */
  compile?: (source: string) => string;
}

const PROBE_PREFIX = "__codiqProbe";

export function runJsChecks(
  jsSource: string,
  checks: JsCheck[],
): {
  checks: CheckResult[];
  console: ConsoleLine[];
  error?: string;
} {
  const globalChecks = checks.filter((check): check is GlobalCheck => check.type === "global");
  const probeSource = globalChecks
    .map(
      (check, index) =>
        `globalThis.${PROBE_PREFIX}${index} = typeof (${check.name}) === "undefined" ? undefined : (${check.name});`,
    )
    .join("\n");

  let error: string | undefined;
  const captured = captureConsole(() => {
    try {
      // One shared eval keeps `const`/`let` bindings visible to the probes.
      executeInGlobal(jsSource.trim() ? `${jsSource}\n;${probeSource}` : probeSource);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught);
    }
  });

  let probeIndex = 0;
  const checkResults = checks.map((check): CheckResult => {
    const baseLabel = check.label ?? check.id;
    switch (check.type) {
      case "console": {
        const match = captured.find((line) => check.pattern.test(line.text));
        return makeCheck(
          check.id,
          baseLabel,
          match !== undefined,
          match ? `Logs: ${match.text}` : `No console output matches ${String(check.pattern)}`,
          check.hint ?? `Log the expected value with console.log().`,
        );
      }
      case "global": {
        const index = probeIndex;
        probeIndex += 1;
        const value = readProbe(index);
        if (check.defined === false) {
          const undef = value === undefined;
          return makeCheck(
            check.id,
            baseLabel,
            undef,
            undef
              ? `\`${check.name}\` is not defined`
              : `\`${check.name}\` is defined (${JSON.stringify(value)})`,
            check.hint ?? `Remove ${check.name} from the global scope.`,
          );
        }
        if (check.equals !== undefined) {
          const equal = looseEquals(value, check.equals);
          return makeCheck(
            check.id,
            baseLabel,
            equal,
            equal
              ? `\`${check.name}\` is ${JSON.stringify(value)}`
              : `\`${check.name}\` is ${JSON.stringify(value)} — expected ${JSON.stringify(check.equals)}`,
            check.hint ?? `Assign ${JSON.stringify(check.equals)} to ${check.name}.`,
          );
        }
        const defined = value !== undefined;
        return makeCheck(
          check.id,
          baseLabel,
          defined,
          defined ? `\`${check.name}\` is defined` : `\`${check.name}\` is not defined`,
          check.hint ?? `Define a variable named ${check.name}.`,
        );
      }
    }
  });

  return { checks: checkResults, console: captured, error };
}

function readProbe(index: number): unknown {
  return (globalThis as Record<string, unknown>)[`${PROBE_PREFIX}${index}`];
}

export function createJsValidator(config: JsValidatorConfig): Validator {
  return {
    type: "js",
    run(input: ValidatorInput): ValidationResult {
      const raw = readCode(input.code, config.file ?? "index.js", ["script.js", "main.js"]);
      const source = config.compile ? config.compile(raw) : raw;
      const { checks, console: consoleLines, error } = runJsChecks(source, config.checks);
      const feedback: string[] = [];
      if (error) feedback.push(`Your code threw: ${error}`);
      if (raw.trim().length === 0) feedback.push("Write some JavaScript before running.");
      const result = aggregate(checks, feedback);
      return {
        passed: result.passed,
        checks: result.checks,
        console: consoleLines,
        feedback: result.feedback,
      };
    },
  };
}
