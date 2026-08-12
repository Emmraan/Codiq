/**
 * Validator registry.
 *
 * Maps built-in validator types to their factory implementations. Content
 * validators may either implement `Validator` directly (bundled standalone) or
 * delegate to these factories, e.g. `export const validator = createCssValidator({ ... })`.
 * See docs/VALIDATION_ENGINE.md.
 */
import type { Validator, ValidatorType } from "./types";
import { createCssValidator } from "./builtin/css";
import { createExpressValidator } from "./builtin/express";
import { createHtmlValidator } from "./builtin/html";
import { createJsValidator } from "./builtin/js";
import { createReactValidator } from "./builtin/react";
import { createTsValidator } from "./builtin/ts";

export { createHtmlValidator } from "./builtin/html";
export { createCssValidator } from "./builtin/css";
export { createJsValidator } from "./builtin/js";
export { createTsValidator } from "./builtin/ts";
export { createReactValidator } from "./builtin/react";
export { createExpressValidator } from "./builtin/express";

export const VALIDATOR_TYPES: readonly ValidatorType[] = [
  "html",
  "css",
  "js",
  "ts",
  "react",
  "express",
];

/** Authoring registry: type → factory. All factories are synchronous. */
export const validatorFactories: Record<ValidatorType, (config: unknown) => Validator> = {
  html: createHtmlValidator as (config: unknown) => Validator,
  css: createCssValidator as (config: unknown) => Validator,
  js: createJsValidator as (config: unknown) => Validator,
  ts: createTsValidator as (config: unknown) => Validator,
  react: createReactValidator as (config: unknown) => Validator,
  express: createExpressValidator as (config: unknown) => Validator,
};

export function isValidatorType(value: string): value is ValidatorType {
  return (VALIDATOR_TYPES as readonly string[]).includes(value);
}
