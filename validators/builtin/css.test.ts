import { describe, expect, it } from "vitest";

import { createCssValidator, runCssChecks } from "./css";

const GOOD_CSS = `
body { font-family: system-ui; }
#target { color: red; padding: 1rem; }
.card { color: red; }
`;

describe("css validator", () => {
  it("passes rule and property checks", () => {
    const checks = runCssChecks(GOOD_CSS, '<p id="target">t</p>', [
      { id: "a", type: "rule", pattern: /#target\s*\{/ },
      { id: "b", type: "property", pattern: /#target\s*\{[^}]*\}/, property: "color" },
    ]);
    expect(checks.every((check) => check.passed)).toBe(true);
  });

  it("fails when a declaration is missing from the matched block", () => {
    const checks = runCssChecks(GOOD_CSS, '<p id="target">t</p>', [
      { id: "a", type: "property", pattern: /\.card\s*\{[^}]*\}/, property: "padding" },
    ]);
    expect(checks[0]?.passed).toBe(false);
    expect(checks[0]?.message).toContain("padding");
  });

  it("reads computed styles from a rendered fixture", () => {
    const checks = runCssChecks(GOOD_CSS, '<p id="target">t</p>', [
      {
        id: "a",
        type: "computed",
        selector: "#target",
        property: "color",
        value: "rgb(255, 0, 0)",
      },
      { id: "b", type: "computed", selector: "#target", property: "padding-top", value: "16px" },
    ]);
    expect(checks[0]?.passed).toBe(true);
    expect(checks[1]?.passed).toBe(true);
  });

  it("reports the computed value it actually measured", () => {
    const checks = runCssChecks("#target { color: blue; }", '<p id="target">t</p>', [
      { id: "a", type: "computed", selector: "#target", property: "color", value: "rgb(0, 0, 0)" },
    ]);
    expect(checks[0]?.passed).toBe(false);
    expect(checks[0]?.message).toContain("rgb(0, 0, 255)");
  });

  it("cleans up its DOM scope after measuring", async () => {
    const validator = createCssValidator({
      checks: [{ id: "a", type: "computed", selector: "#target", property: "color" }],
    });
    await validator.run({
      code: { "styles.css": "#target { color: green; }" },
      config: {},
    });
    expect(document.getElementById("codiq-css-host")?.innerHTML).toBe("");
    expect(document.getElementById("codiq-css-style")?.textContent).toBe("");
  });
});
