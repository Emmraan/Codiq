import { describe, expect, it } from "vitest";
import { transformSync } from "esbuild";
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";

import { createReactValidator, evaluateModule, type ReactRuntime } from "./react";

const compile = (source: string) =>
  transformSync(source, {
    loader: "tsx",
    jsx: "transform",
    format: "cjs",
    target: "es2020",
  }).code;

const runtime: ReactRuntime = {
  React,
  render: (element, container) => {
    act(() => {
      createRoot(container).render(element);
    });
  },
};

const COMPONENT = `
export default function Card() {
  return (
    <div className="card">
      <h2>Hello React</h2>
      <span data-testid="count">3</span>
    </div>
  );
}
`;

describe("react validator", () => {
  it("transpiles, renders and asserts on output DOM", async () => {
    const validator = createReactValidator({
      compile,
      runtime,
      checks: [
        { id: "card", type: "element", selector: ".card" },
        { id: "heading", type: "element", selector: "h2", count: 1 },
        { id: "hello", type: "text", selector: "h2", contains: ["Hello React"] },
      ],
    });
    const result = await validator.run({ code: { "App.tsx": COMPONENT }, config: {} });
    expect(result.passed).toBe(true);
  });

  it("asserts exact element counts", async () => {
    const validator = createReactValidator({
      compile,
      runtime,
      checks: [{ id: "two-cards", type: "element", selector: ".card", count: 2 }],
    });
    const result = await validator.run({ code: { "App.tsx": COMPONENT }, config: {} });
    expect(result.passed).toBe(false);
    expect(result.checks[0]?.message).toContain("got 1");
  });

  it("evaluates a CommonJS module compiling the default export", () => {
    const js = compile("export default () => ({ ok: true });");
    const exports = evaluateModule(js, runtime);
    expect(typeof exports.default).toBe("function");
  });

  it("fails cleanly when the component does not export a function", async () => {
    const validator = createReactValidator({
      compile,
      runtime,
      checks: [{ id: "a", type: "element", selector: "div" }],
    });
    const result = await validator.run({
      code: { "App.tsx": "export default 42;" },
      config: {},
    });
    expect(result.passed).toBe(false);
    expect(result.feedback.join(" ")).toContain("component");
  });
});
