import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== "mobile-chromium", "Phone interactions");
  await page.goto("/");
});

test("the full homepage fits phone widths and loads both device previews", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const section of await page.locator(".mist-home section[data-mist-scene]").all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section.getByRole("heading").first()).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect(page.locator('#foundation .mist-screen')).toHaveCount(2);
});

test("phone visitors have a web app CTA and working product previews", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator(".mist-hero").getByRole("link", { name: "Try the web app" })).toBeVisible();
  await page.locator('#mist-space-tab-library').click();
  await page.locator('[data-image-slot="shared"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-image-slot="shared"]')).toBeVisible();
});
