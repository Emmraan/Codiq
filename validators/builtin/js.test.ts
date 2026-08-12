import { describe, expect, it } from "vitest";

import { createJsValidator, runJsChecks } from "./js";

describe("js validator", () => {
  it("captures console output and asserts global values", async () => {
    const validator = createJsValidator({
      checks: [
        { id: "hello", type: "console", pattern: /Hello CODIQ/ },
        { id: "sum", type: "global", name: "sum", equals: 12 },
      ],
    });
    const result = await validator.run({
      code: { "index.js": 'console.log("Hello CODIQ"); var sum = 5 + 7;' },
      config: {},
    });
    expect(result.passed).toBe(true);
    expect(result.console.map((line) => line.text)).toContain("Hello CODIQ");
  });

  it("reads const/let global lexical bindings", async () => {
    const validator = createJsValidator({
      checks: [{ id: "x", type: "global", name: "answer", equals: 42 }],
    });
    const result = await validator.run({
      code: { "index.js": "const answer = 42;" },
      config: {},
    });
    expect(result.passed).toBe(true);
  });

  it("supports dotted global access", async () => {
    const validator = createJsValidator({
      checks: [{ id: "y", type: "global", name: "window.flag", equals: true }],
    });
    const result = await validator.run({
      code: { "index.js": "var flag = true;" },
      config: {},
    });
    expect(result.passed).toBe(true);
  });

  it("reports a failed check with the actual value", async () => {
    const { checks } = runJsChecks("var answer = 7;", [
      { id: "a", type: "global", name: "answer", equals: 42 },
    ]);
    expect(checks[0]?.passed).toBe(false);
    expect(checks[0]?.message).toContain("is 7");
    expect(checks[0]?.message).toContain("expected 42");
  });

  it("captures console levels", async () => {
    const validator = createJsValidator({
      checks: [{ id: "warn", type: "console", pattern: /careful/ }],
    });
    const result = await validator.run({
      code: { "index.js": 'console.warn("be careful");' },
      config: {},
    });
    expect(result.console.some((line) => line.level === "warn" && /careful/.test(line.text))).toBe(
      true,
    );
    expect(result.passed).toBe(true);
  });

  it("fails cleanly on a runtime exception", async () => {
    const validator = createJsValidator({
      checks: [{ id: "a", type: "console", pattern: /never/ }],
    });
    const result = await validator.run({
      code: { "index.js": "throw new Error('boom');" },
      config: {},
    });
    expect(result.passed).toBe(false);
    expect(result.checks.every((check) => !check.passed)).toBe(true);
  });
});
