import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-generated and tooling artifacts:
    "lib/generated/**",
    "public/vs/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    ".changeset/**",
  ]),
]);

export default eslintConfig;
