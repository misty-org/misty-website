import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== "mobile-chromium", "Phone interactions");
  await page.goto("/");
});

test("the full homepage fits phone widths and loads both device previews", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const section of await page.locator(".mist-home [data-mist-scene]").all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section.getByRole("heading").first()).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect.poll(() => page.locator('[data-image-slot="continuity"] img').evaluateAll(images => images.every(img => (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
});

test("the original side drawer reaches the new sections", async ({ page }) => {
  for (const label of ["Browser", "Sync", "Work", "Agents", "Files", "Space", "Spaces", "Download", "Resources", "Overview"]) {
    await page.getByRole("button", { name: "Open section drawer" }).click();
    const button = page.getByRole("button", { name: label, exact: true });
    await button.click();
    await expect(page.getByRole("button", { name: "Open section drawer" })).toBeVisible();
  }
  await expect(page.locator(".mist-hero h1")).toBeInViewport();
});

test("phone visitors have a web app CTA and working product previews", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator(".mist-hero").getByRole("link", { name: "Try the web app" })).toBeVisible();
  await page.locator('[data-image-slot="shared"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-image-slot="shared"]')).toBeVisible();
});
