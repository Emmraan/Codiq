import type { Validator, ValidatorInput, ValidationResult } from "@/validators/types";

export const validator: Validator = {
  type: "css",
  async run({ code, config }: ValidatorInput): Promise<ValidationResult> {
    const styles = code["styles.css"] ?? "";
    const checks = Array.isArray(config.checks) ? config.checks.map(String) : [];

    const results = checks.map((check) => {
      let passed = true;
      let hint: string | undefined;

      if (check === "selector-presence") {
        passed = /^\s*[^{}]+{[^}]*}/m.test(styles);
        hint = "Write a rule with a selector and a declaration block";
      } else if (check === "computed-style") {
        passed = /color\s*:/i.test(styles);
        hint = "Set a `color` property";
      }

      return { id: check, label: check, passed, hint };
    });

    return {
      passed: results.every((r) => r.passed),
      checks: results,
      console: [],
      feedback: [],
    };
  },
};
