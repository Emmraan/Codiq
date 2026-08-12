/**
 * Built-in `css` validator.
 *
 * Two kinds of checks:
 *  - static checks against the learner's CSS source (rule / property presence);
 *  - `computed` checks that render a small fixture, apply the learner stylesheet
 *    to the live document and read `getComputedStyle` — this requires the
 *    sandboxed DOM but is still fully deterministic.
 *
 * Computed values are compared using the browser's serialised form, e.g.
 * `color: red` computes to `rgb(255, 0, 0)`; `font-weight: bold` computes to
 * `700`. The fixture and expected values live in the content validator config.
 */
import type { CheckResult, Validator, ValidatorInput, ValidationResult } from "@/validators/types";
import { aggregate, makeCheck, readCode } from "./shared";

interface CssCheckBase {
  id: string;
  label?: string;
  hint?: string;
}

interface RuleCheck extends CssCheckBase {
  type: "rule";
  /** Regex matched against the stylesheet source (e.g. /#intro\s*[{]/). */
  pattern: RegExp;
}

interface PropertyCheck extends CssCheckBase {
  type: "property";
  /** Regex that must match a declaration block containing the property. */
  pattern: RegExp;
  property: string;
}

interface ComputedCheck extends CssCheckBase {
  type: "computed";
  /** Selector of the element to measure inside the fixture. */
  selector: string;
  property: string;
  /** Expected serialised computed value (omit to assert it differs from "". */
  value?: string;
}

export type CssCheck = RuleCheck | PropertyCheck | ComputedCheck;

export interface CssValidatorConfig {
  /** Key in `input.code` that holds the stylesheet. Defaults to "styles.css". */
  file?: string;
  /** Inner-HTML fixture the styles are measured against. */
  fixture?: string;
  checks: CssCheck[];
}

const HOST_ID = "codiq-css-host";
const STYLE_ID = "codiq-css-style";

interface RenderScope {
  host: HTMLElement;
  style: HTMLStyleElement;
}

function ensureRenderScope(fixture: string): RenderScope {
  let host = document.getElementById(HOST_ID) as HTMLElement | null;
  if (!host) {
    host = document.createElement("div");
    host.id = HOST_ID;
    host.style.display = "none";
    document.body.appendChild(host);
  }
  host.innerHTML = fixture;

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  return { host, style };
}

function teardownRenderScope(scope: RenderScope): void {
  scope.host.innerHTML = "";
  scope.style.textContent = "";
}

export function runCssChecks(
  cssSource: string,
  fixture: string,
  checks: CssCheck[],
): CheckResult[] {
  const scope = ensureRenderScope(fixture);
  scope.style.textContent = cssSource;

  try {
    return checks.map((check) => {
      const baseLabel = check.label ?? check.id;
      switch (check.type) {
        case "rule": {
          const matched = check.pattern.test(cssSource);
          return makeCheck(
            check.id,
            baseLabel,
            matched,
            matched ? "Rule found" : `No rule matches ${String(check.pattern)}`,
            check.hint ?? "Write a CSS rule with a selector and a declaration block.",
          );
        }
        case "property": {
          const blockMatch = check.pattern.exec(cssSource);
          const block = blockMatch ? blockMatch[0] : "";
          const present =
            check.pattern.test(cssSource) && new RegExp(`\\b${check.property}\\s*:`).test(block);
          return makeCheck(
            check.id,
            baseLabel,
            present,
            present
              ? `Declares \`${check.property}\``
              : `No \`${check.property}\` declaration found matching ${String(check.pattern)}`,
            check.hint ?? `Set the \`${check.property}\` property inside a matching rule.`,
          );
        }
        case "computed": {
          const el = scope.host.querySelector(check.selector);
          if (!el) {
            return makeCheck(
              check.id,
              baseLabel,
              false,
              `Fixture has no element matching "${check.selector}"`,
              check.hint ?? `Target an element the fixture actually contains (${check.selector}).`,
            );
          }
          const actual = getComputedStyle(el).getPropertyValue(check.property).trim();
          if (check.value !== undefined) {
            const equal = actual === check.value;
            return makeCheck(
              check.id,
              baseLabel,
              equal,
              equal
                ? `\`${check.property}\` is \`${actual}\``
                : `\`${check.property}\` computed to \`${actual || "(unset)"}\` — expected \`${check.value}\``,
              check.hint ?? `Make ${check.selector} compute \`${check.property}: ${check.value}\`.`,
            );
          }
          return makeCheck(
            check.id,
            baseLabel,
            actual.length > 0,
            actual.length > 0
              ? `\`${check.property}\` resolves to \`${actual}\``
              : `\`${check.property}\` is not set`,
            check.hint ?? `Set a non-inherited \`${check.property}\` value on ${check.selector}.`,
          );
        }
      }
    });
  } finally {
    teardownRenderScope(scope);
  }
}

export function createCssValidator(config: CssValidatorConfig): Validator {
  return {
    type: "css",
    run(input: ValidatorInput): ValidationResult {
      const source = readCode(input.code, config.file ?? "styles.css");
      const fixture = config.fixture ?? '<p id="target">target</p>';
      const checks = runCssChecks(source, fixture, config.checks);
      const result = aggregate(checks);
      return {
        passed: result.passed,
        checks: result.checks,
        console: [],
        feedback:
          source.trim().length === 0
            ? [...result.feedback, "Write some CSS before running."]
            : result.feedback,
      };
    },
  };
}
