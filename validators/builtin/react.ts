/**
 * Built-in `react` validator.
 *
 * Transpiles the learner's TSX to CommonJS JavaScript, evaluates the module in
 * a scope that provides `React` / `ReactDOM`, renders the default export into a
 * fixture container in the sandbox and asserts on the resulting DOM. React and
 * ReactDOM are bootstrapped into the sandbox via `RUNTIME_LIBS.react`.
 */
import type { ComponentType, ReactElement } from "react";
import type { CheckResult, Validator, ValidatorInput, ValidationResult } from "@/validators/types";
import { tsTranspile } from "./ts";
import { makeCheck, readCode } from "./shared";

interface ReactCheckBase {
  id: string;
  label?: string;
  hint?: string;
}

interface ElementCheck extends ReactCheckBase {
  type: "element";
  selector: string;
  /** Exact number of matches (optional; default ≥ 1). */
  count?: number;
}

interface TextCheck extends ReactCheckBase {
  type: "text";
  selector: string;
  contains?: string[];
}

export type ReactCheck = ElementCheck | TextCheck;

/** Rendering primitives the validator needs; injectable for tests. */
export interface ReactRuntime {
  /** The full React object (createElement, hooks, memo, …). */
  React: unknown;
  render: (element: ReactElement, container: HTMLElement) => void;
}

export interface ReactValidatorConfig {
  /** Key in `input.code` that holds the component source. Defaults to "App.tsx". */
  file?: string;
  checks: ReactCheck[];
  /** Override the TSX transpiler (defaults to the sandbox's `window.ts`). */
  compile?: (source: string) => string;
  /** Override the React runtime (defaults to the sandbox globals). */
  runtime?: ReactRuntime;
  /** Inner-HTML fixture rendered into before mounting the component. */
  containerIdPrefix?: string;
}

function sandboxRuntime(): ReactRuntime {
  const win = window as unknown as {
    React?: unknown;
    ReactDOM?: {
      createRoot?: (c: HTMLElement) => { render: (el: ReactElement) => void };
      render?: (el: ReactElement, c: HTMLElement) => void;
    };
  };
  const React = win.React;
  const ReactDOM = win.ReactDOM;
  if (!React || typeof (React as { createElement?: unknown }).createElement !== "function") {
    throw new Error("React runtime is unavailable in the sandbox.");
  }
  if (!ReactDOM) {
    throw new Error("ReactDOM runtime is unavailable in the sandbox.");
  }
  return {
    React,
    render: (element, container) => {
      if (typeof ReactDOM.createRoot === "function") {
        ReactDOM.createRoot(container).render(element);
      } else {
        // React 18 UMD fallback bootstrapped into the sandbox.
        // eslint-disable-next-line react/no-deprecated -- required for the UMD runtime
        const render = ReactDOM.render;
        if (typeof render !== "function") {
          throw new Error("ReactDOM has no render method.");
        }
        render(element, container);
      }
    },
  };
}

/** Evaluate a CommonJS module in a scoped function, returning its exports. */
export function evaluateModule(
  jsSource: string,
  runtime: Pick<ReactRuntime, "React">,
): Record<string, unknown> {
  // esbuild emits CommonJS that writes to `module.exports`, so the scoped
  // function must expose `module` under that exact name (not a renamed local).
  // eslint-disable-next-line @next/next/no-assign-module-variable -- scoped CJS shim
  const module = { exports: {} as Record<string, unknown> };
  const fn = new Function("module", "exports", "require", "React", jsSource);
  fn(module, module.exports, () => ({}), runtime.React);
  return module.exports;
}

export function runReactChecks(container: HTMLElement, checks: ReactCheck[]): CheckResult[] {
  return checks.map((check): CheckResult => {
    const baseLabel = check.label ?? check.id;
    switch (check.type) {
      case "element": {
        const found = container.querySelectorAll(check.selector);
        const count = found.length;
        const expected = check.count ?? 1;
        const passed = count === expected;
        return makeCheck(
          check.id,
          baseLabel,
          passed,
          passed
            ? `Found ${count} × "${check.selector}"`
            : `Expected ${expected} × "${check.selector}", got ${count}`,
          check.hint ?? `Render an element matching "${check.selector}".`,
        );
      }
      case "text": {
        const el = container.querySelector(check.selector);
        if (!el) {
          return makeCheck(
            check.id,
            baseLabel,
            false,
            `No element matches "${check.selector}"`,
            check.hint ?? `Render an element matching "${check.selector}".`,
          );
        }
        const text = el.textContent ?? "";
        const missing = (check.contains ?? []).filter((part) => !text.includes(part));
        const passed = missing.length === 0;
        return makeCheck(
          check.id,
          baseLabel,
          passed,
          passed
            ? "Contains the expected text"
            : `Missing text ${missing.map((m) => JSON.stringify(m)).join(", ")}`,
          check.hint ?? `Render the expected text inside ${check.selector}.`,
        );
      }
    }
  });
}

export function createReactValidator(config: ReactValidatorConfig): Validator {
  const compile = config.compile ?? ((source: string) => tsTranspile(source, true));

  return {
    type: "react",
    async run(input: ValidatorInput): Promise<ValidationResult> {
      const raw = readCode(input.code, config.file ?? "App.tsx");
      if (raw.trim().length === 0) {
        return {
          passed: false,
          checks: [],
          console: [],
          feedback: ["Write a component before running."],
        };
      }

      let runtime: ReactRuntime;
      let jsSource: string;
      let Component: unknown;
      try {
        runtime = config.runtime ?? sandboxRuntime();
        jsSource = compile(raw);
        const exports = evaluateModule(jsSource, runtime);
        Component = (exports.default as ComponentType | undefined) ?? exports.App;
        if (typeof Component !== "function") {
          throw new Error("The component does not export a function component.");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          passed: false,
          checks: [],
          console: [],
          feedback: [`Could not render your component: ${message}`],
        };
      }

      const containerId = `codiq-react-${(config.containerIdPrefix ?? "fixture").replace(/[^a-zA-Z0-9-]/g, "")}`;
      const container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
      try {
        const createElement = (
          runtime.React as { createElement?: typeof import("react").createElement }
        ).createElement;
        if (typeof createElement !== "function") {
          throw new Error("React runtime is unavailable.");
        }
        runtime.render(createElement(Component as ComponentType), container);
        const checks = runReactChecks(container, config.checks);
        return {
          passed: checks.every((check) => check.passed),
          checks,
          console: [],
          feedback: [],
        };
      } finally {
        container.remove();
      }
    },
  };
}
