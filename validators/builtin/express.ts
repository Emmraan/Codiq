/**
 * Built-in `express` validator.
 *
 * Reuses the pure, dependency-free Express mock (`features/playground/express-mock`)
 * to parse route declarations out of the learner's code and simulate requests
 * against them. No learner code is ever executed.
 */
import type { Validator, ValidatorInput, ValidationResult } from "@/validators/types";
import {
  matchRequest,
  parseExpressRoutes,
  type HttpMethod,
} from "@/features/playground/express-mock";
import { aggregate, looseEquals, makeCheck, readCode } from "./shared";

export interface ExpressExpectation {
  id: string;
  label?: string;
  hint?: string;
  method: HttpMethod;
  path: string;
  /** Optional JSON request body. */
  body?: string;
  expect?: {
    /** Expected HTTP status (when omitted, any < 400 passes). */
    status?: number;
    /** Expected response body (loose equality). */
    body?: unknown;
  };
}

export interface ExpressValidatorConfig {
  /** Key in `input.code` that holds the server source. Defaults to "server.js". */
  file?: string;
  requests: ExpressExpectation[];
}

export function createExpressValidator(config: ExpressValidatorConfig): Validator {
  return {
    type: "express",
    run(input: ValidatorInput): ValidationResult {
      const source = readCode(input.code, config.file ?? "server.js");
      const routes = parseExpressRoutes(source);

      const checks = config.requests.map((request) => {
        const label = request.label ?? `${request.method} ${request.path}`;
        const response = matchRequest(routes, request.method, request.path, request.body);

        if (response.status === 404 && !isRouteDeclaration(request)) {
          return makeCheck(
            request.id,
            label,
            false,
            `${request.method} ${request.path} → 404 (no matching route)`,
            request.hint ?? `Define a route for ${request.method} ${request.path}.`,
          );
        }

        const statusExpected = request.expect?.status;
        const statusOk =
          statusExpected === undefined ? response.status < 400 : response.status === statusExpected;
        const bodyExpected = request.expect?.body;
        const bodyOk = bodyExpected === undefined || looseEquals(response.body, bodyExpected);

        const statusText = statusExpected === undefined ? `< 400` : String(statusExpected);
        const diagnostics: string[] = [];
        if (!statusOk) {
          diagnostics.push(`expected status ${statusText}, got ${response.status}`);
        }
        if (!bodyOk) {
          diagnostics.push(
            `expected body ${JSON.stringify(bodyExpected)}, got ${JSON.stringify(response.body)}`,
          );
        }

        return makeCheck(
          request.id,
          label,
          statusOk && bodyOk,
          diagnostics.length === 0
            ? `${request.method} ${request.path} → ${response.status}`
            : diagnostics.join("; "),
          request.hint ??
            `Make ${request.method} ${request.path} respond ${statusText}${
              bodyExpected !== undefined ? ` with ${JSON.stringify(bodyExpected)}` : ""
            }.`,
        );
      });

      const result = aggregate(checks);
      return {
        passed: result.passed,
        checks: result.checks,
        console: [],
        feedback:
          routes.length === 0
            ? [...result.feedback, "No app.<verb>(path, handler) routes were found in your code."]
            : result.feedback,
      };
    },
  };
}

function isRouteDeclaration(request: ExpressExpectation): boolean {
  return request.expect?.status === 404;
}
