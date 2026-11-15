import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("the homepage tells its story, then answers questions", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Build together with AI");
  // A headline over the engines closes the hero; the features bento follows, with no badges on its tiles.
  await expect(page.locator(".mist-interlude h2")).toHaveText(["Works with your favorite agents"]);
  // The chapter shows only panels; its heading stays in the outline for screen readers.
  await expect(page.locator(".mist-chapter-title")).toHaveText(["One app for your agents and the people you work with."]);
  await expect(page.locator(".mist-chapter-title").first()).toHaveClass(/sr-only/);
  await expect(page.locator(".mist-tile")).toHaveCount(4);
  await expect(page.locator(".mist-feature-label")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Ready to build together with AI?" })).toBeVisible();
  // After the story come the questions; then the call to download closes the page.
  await expect(page.locator("#features + #faq + #download")).toHaveCount(1);
  await expect(page.locator(".mist-faq-item summary")).toHaveCount(7);
});

test("the homepage stays dark and accessible for either system appearance", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme as "light" | "dark" });
    await expect(page.locator("html")).toHaveClass("dark");
    const results = await new AxeBuilder({ page }).include(".mist-home").withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))).toEqual([]);
  }
});
