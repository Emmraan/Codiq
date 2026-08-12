/**
 * Built-in `ts` validator.
 *
 * Transpiles the learner's TypeScript to plain JavaScript (using the
 * TypeScript compiler bootstrapped into the sandbox as `window.ts`) then asserts
 * on the compiled output exactly like the `js` validator. A custom `compile`
 * may be injected (tests use esbuild).
 */
import type { Validator, ValidatorInput, ValidationResult } from "@/validators/types";
import { runJsChecks, type JsCheck } from "./js";
import { readCode } from "./shared";

export interface TsValidatorConfig {
  /** Key in `input.code` that holds the TypeScript source. Defaults to "index.ts". */
  file?: string;
  checks: JsCheck[];
  /** Override the transpiler (defaults to the sandbox's `window.ts`). */
  compile?: (source: string) => string;
}

/** Grab the TypeScript compiler UMD global inside the sandbox. */
export function tsTranspile(source: string, generateJsx: boolean): string {
  const tsLib = (
    typeof window !== "undefined" ? (window as unknown as { ts?: unknown }).ts : undefined
  ) as
    | {
        transpileModule?: (
          source: string,
          options: { compilerOptions: Record<string, unknown> },
        ) => { outputText?: string };
      }
    | undefined;

  if (!tsLib || typeof tsLib.transpileModule !== "function") {
    throw new Error("TypeScript runtime is unavailable in the sandbox.");
  }

  const output = tsLib.transpileModule(source, {
    compilerOptions: {
      target: 7, // ES2020
      module: 1, // CommonJS
      jsx: generateJsx ? 1 /* React */ : undefined,
    },
  });
  if (typeof output.outputText !== "string") {
    throw new Error("TypeScript compiler produced no output.");
  }
  return output.outputText;
}

export function createTsValidator(config: TsValidatorConfig): Validator {
  const compile = config.compile ?? ((source: string) => tsTranspile(source, false));
  return {
    type: "ts",
    async run(input: ValidatorInput): Promise<ValidationResult> {
      const raw = readCode(input.code, config.file ?? "index.ts");
      if (raw.trim().length === 0) {
        return {
          passed: false,
          checks: [],
          console: [],
          feedback: ["Write some TypeScript before running."],
        };
      }
      let jsSource: string;
      try {
        jsSource = compile(raw);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          passed: false,
          checks: [],
          console: [],
          feedback: [`TypeError while compiling: ${message}`],
        };
      }
      const { checks, console: consoleLines } = runJsChecks(jsSource, config.checks);
      return {
        passed: checks.every((check) => check.passed),
        checks,
        console: consoleLines,
        feedback: [],
      };
    },
  };
}
