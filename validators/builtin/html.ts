/**
 * Built-in `html` validator.
 *
 * Parses the learner's HTML into a detached document and asserts on element
 * presence, attributes and text. Purely structural — no script execution, so it
 * is safe in tests and never mutates the live document.
 */
import type { CheckResult, Validator, ValidatorInput, ValidationResult } from "@/validators/types";
import { aggregate, makeCheck, readCode } from "./shared";

interface HtmlCheckBase {
  id: string;
  /** Human-readable label for the checklist. */
  label?: string;
  hint?: string;
}

interface SelectorCheck extends HtmlCheckBase {
  type: "selector";
  /** CSS selector that must match at least one element. */
  selector: string;
}

interface AttributeCheck extends HtmlCheckBase {
  type: "attribute";
  selector: string;
  attr: string;
  /** When provided, the attribute value must equal this. */
  value?: string;
}

interface TextCheck extends HtmlCheckBase {
  type: "text";
  selector: string;
  /** Text content must include at least one of these substrings. */
  contains?: string[];
}

export type HtmlCheck = SelectorCheck | AttributeCheck | TextCheck;

export interface HtmlValidatorConfig {
  /** Key in `input.code` that holds the HTML source. Defaults to "index.html". */
  file?: string;
  checks: HtmlCheck[];
}

/** Parse learner HTML into a detached document (works in jsdom + browsers). */
export function parseHtml(source: string): Document {
  if (typeof DOMParser !== "undefined") {
    return new DOMParser().parseFromString(source, "text/html");
  }
  const doc = document.implementation.createHTMLDocument("fixture");
  doc.documentElement.innerHTML = source;
  return doc;
}

export function runHtmlChecks(htmlSource: string, checks: HtmlCheck[]): CheckResult[] {
  const doc = parseHtml(htmlSource);

  return checks.map((check) => {
    const baseLabel = check.label ?? check.id;
    switch (check.type) {
      case "selector": {
        const found = doc.querySelector(check.selector) !== null;
        return makeCheck(
          check.id,
          baseLabel,
          found,
          found ? `Found "${check.selector}"` : `No element matches "${check.selector}"`,
          check.hint ?? `Add an element matching the selector "${check.selector}".`,
        );
      }
      case "attribute": {
        const el = doc.querySelector(check.selector);
        if (!el) {
          return makeCheck(
            check.id,
            baseLabel,
            false,
            `No element matches "${check.selector}"`,
            check.hint ?? `Add an element matching "${check.selector}".`,
          );
        }
        if (check.value !== undefined) {
          const actual = el.getAttribute(check.attr);
          const equal = actual === check.value;
          return makeCheck(
            check.id,
            baseLabel,
            equal,
            equal
              ? `"${check.attr}" is "${actual}"`
              : `"${check.attr}" is ${JSON.stringify(actual)} — expected "${check.value}"`,
            check.hint ?? `Set ${check.attr}="${check.value}" on ${check.selector}.`,
          );
        }
        const present = el.hasAttribute(check.attr);
        return makeCheck(
          check.id,
          baseLabel,
          present,
          present ? `"${check.attr}" is present` : `Missing ${check.attr} attribute`,
          check.hint ?? `Add the ${check.attr} attribute to ${check.selector}.`,
        );
      }
      case "text": {
        const el = doc.querySelector(check.selector);
        if (!el) {
          return makeCheck(
            check.id,
            baseLabel,
            false,
            `No element matches "${check.selector}"`,
            check.hint ?? `Add an element matching "${check.selector}".`,
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
            ? `Text contains the expected content`
            : `Missing text ${missing.map((m) => JSON.stringify(m)).join(", ")}`,
          check.hint ?? `Write the expected text inside ${check.selector}.`,
        );
      }
    }
  });
}

export function createHtmlValidator(config: HtmlValidatorConfig): Validator {
  return {
    type: "html",
    run(input: ValidatorInput): ValidationResult {
      const source = readCode(input.code, config.file ?? "index.html", ["index.htm"]);
      const checks = runHtmlChecks(source, config.checks);
      const { passed, checks: results, feedback } = aggregate(checks);
      const isEmpty = source.trim().length === 0;
      return {
        passed,
        checks: results,
        console: [],
        feedback: isEmpty ? [...feedback, "Write some HTML before running."] : feedback,
      };
    },
  };
}
