import { describe, expect, it } from "vitest";
import { transformSync } from "esbuild";

import { createTsValidator } from "./ts";

const compile = (source: string) =>
  transformSync(source, { loader: "ts", format: "cjs", target: "es2020" }).code;

describe("ts validator", () => {
  it("transpiles TypeScript then runs js-style checks", async () => {
    const validator = createTsValidator({
      compile,
      checks: [
        { id: "typed", type: "global", name: "greet", equals: "hi" },
        { id: "log", type: "console", pattern: /hi from ts/ },
      ],
    });
    const result = await validator.run({
      code: {
        "index.ts": `const greet: string = "hi";\nconsole.log("hi from ts");`,
      },
      config: {},
    });
    expect(result.passed).toBe(true);
  });

  it("reports compile errors without throwing", async () => {
    const validator = createTsValidator({ compile, checks: [] });
    const result = await validator.run({
      code: { "index.ts": "const x: = 1;" },
      config: {},
    });
    expect(result.passed).toBe(false);
    expect(result.feedback.join(" ")).toContain("compiling");
  });

  it("guides an empty editor", async () => {
    const validator = createTsValidator({ compile, checks: [] });
    const result = await validator.run({ code: { "index.ts": "" }, config: {} });
    expect(result.passed).toBe(false);
    expect(result.feedback.join(" ")).toContain("TypeScript");
  });
});
