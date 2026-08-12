import { describe, expect, it } from "vitest";

import { createHtmlValidator, runHtmlChecks, parseHtml } from "./html";

const SAMPLE = `
<!doctype html>
<html>
  <body>
    <main class="page">
      <h1 id="title">Welcome</h1>
      <p class="lead" data-kind="intro">Start here and keep going.</p>
    </main>
  </body>
</html>
`;

describe("html validator", () => {
  it("parses a full document into a detached DOM", () => {
    const doc = parseHtml(SAMPLE);
    expect(doc.querySelector("h1")?.textContent).toBe("Welcome");
  });

  it("passes structure, attribute and text checks", () => {
    const checks = runHtmlChecks(SAMPLE, [
      { id: "a", type: "selector", selector: "main.page" },
      { id: "b", type: "attribute", selector: "h1#title", attr: "id" },
      { id: "c", type: "attribute", selector: ".lead", attr: "data-kind", value: "intro" },
      { id: "d", type: "text", selector: "p.lead", contains: ["Start here"] },
    ]);
    expect(checks.every((check) => check.passed)).toBe(true);
  });

  it("reports granular failures with helpful hints", () => {
    const checks = runHtmlChecks("<div></div>", [
      { id: "a", type: "selector", selector: "nav" },
      { id: "b", type: "attribute", selector: "div", attr: "class" },
    ]);
    expect(checks[0]?.passed).toBe(false);
    expect(checks[0]?.message).toContain("nav");
    expect(checks[1]?.passed).toBe(false);
    expect(checks[1]?.hint).toContain("class");
  });

  it("matches attribute value strictly", () => {
    const checks = runHtmlChecks('<a href="/login">go</a>', [
      { id: "a", type: "attribute", selector: "a", attr: "href", value: "/login" },
      { id: "b", type: "attribute", selector: "a", attr: "href", value: "/logout" },
    ]);
    expect(checks[0]?.passed).toBe(true);
    expect(checks[1]?.passed).toBe(false);
  });

  it("returns a failed aggregated result for empty code", async () => {
    const validator = createHtmlValidator({
      checks: [{ id: "a", type: "selector", selector: "main" }],
    });
    const result = await validator.run({ code: { "index.html": "" }, config: {} });
    expect(result.passed).toBe(false);
    expect(result.feedback.join(" ")).toContain("Write some HTML");
  });
});
