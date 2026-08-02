import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: true,
    include: [
      "tests/**/*.test.{ts,tsx}",
      "lib/**/*.test.{ts,tsx}",
      "features/**/*.test.{ts,tsx}",
      "config/**/*.test.{ts,tsx}",
      "validators/**/*.test.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["lib/**", "store/**", "validators/**", "config/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
