import { expect, test } from "@playwright/test";

test("home page loads and highlights the learning pipeline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Experiment\. Build\./ })).toBeVisible();
  await expect(page.getByText("Prove it with labs")).toBeVisible();
});

test("labs page lists every published challenge", async ({ page }) => {
  await page.goto("/labs");
  await expect(page.getByRole("heading", { name: "Labs" })).toBeVisible();
  await expect(page.getByText("Target the intro")).toBeVisible();
});

test("lesson page renders the ChallengeRunner", async ({ page }) => {
  await page.goto("/learn/css/css-selectors/type-class-id-selectors");
  await expect(page.getByRole("button", { name: "Run" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();
  await expect(page.getByText("Requirements")).toBeVisible();
});
