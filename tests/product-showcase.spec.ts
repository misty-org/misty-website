import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("the homepage tells its story chapter by chapter, then answers questions", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The agentic browser for building your workspace");
  // Three parts, each opened by an interlude.
  await expect(page.locator(".mist-interlude h2")).toHaveText(["It starts as a browser", "It does your work for you", "It organizes everything in a space"]);
  // Chapters show only panels; each one's heading stays in the outline for screen readers.
  await expect(page.locator(".mist-chapter-title")).toHaveText([
    "Fast, secure, and lightweight.",
    "Give each computer its own setup and keep them all in sync.",
    "Agents that work across your browser and your apps.",
    "Why one more AI subscription? Here's how Misty compares.",
    "A space for every project.",
  ]);
  await expect(page.locator(".mist-chapter-title").first()).toHaveClass(/sr-only/);
  await expect(page.locator("#equation, #integrations")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Ready to build your browser workspace?" })).toBeVisible();
  await expect(page.locator(".mist-eyebrow, .mist-device-badge, .mist-sync-status, .mist-workspace, .mist-reveal")).toHaveCount(0);
  // After the story come the Q&A and the blog, changelog and roadmap; then the call to download
  // closes the page.
  await expect(page.locator("#features + #faq + .mist-resources + #download")).toHaveCount(1);
  for (const [id, title] of [["blog", "Blog"], ["changelog", "Changelog"], ["roadmap", "Roadmap"]]) {
    const section = page.locator(`[data-resource-preview='${id}']`);
    await expect(section.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(section.getByRole("link", { name: `Visit ${id}` })).toHaveAttribute("href", `/${id}`);
  }
  await expect(page.locator(".mist-faq-item summary")).toHaveCount(5);
});

test("the sync chapter shows the devices tile beside the sync tree", async ({ page }) => {
  const tile = page.locator('#foundation.mist-tile');
  await tile.scrollIntoViewIfNeeded();
  await expect(tile.getByRole('heading', { level: 3 })).toBeVisible();
  await expect(tile.locator('.mist-devices')).toBeVisible();
  await expect(page.locator('#sync .mist-tile')).toHaveCount(4);
  // Each computer shows its own layout, so the two screens never match.
  const layouts = await tile.locator('.mist-screen').evaluateAll(els => els.map(el => (el as HTMLElement).dataset.layout));
  expect(layouts).toHaveLength(2);
  expect(layouts[0]).not.toBe(layouts[1]);
});

test("missing replacement images fall back to a capture without changing the slot size", async ({ page }) => {
  await page.route('**/screenshots/misty-space-library.webp', route => route.fulfill({ status: 404, body: '' }));
  await page.reload();
  // The shared slot is the Library pane of the Spaces tour.
  await page.locator('#mist-space-tab-library').click();
  const hero = page.locator('[data-image-slot="shared"]');
  await hero.scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-fallback', 'true');
  await expect.poll(() => hero.locator('img').evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(hero).toHaveText('');
  const emptyBox = await hero.boundingBox();
  await page.route('**/screenshots/misty-space-library.webp', route => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><rect width="1600" height="1000" fill="#345"/></svg>',
  }));
  await page.reload();
  await page.locator('#mist-space-tab-library').click();
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator('img')).toBeVisible();
  await expect.poll(() => hero.locator('img').evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(1600);
  const filledBox = await hero.boundingBox();
  expect(filledBox!.height).toBeCloseTo(emptyBox!.height, 0);
});

test("the homepage stays dark and accessible for either system appearance", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme as "light" | "dark" });
    await expect(page.locator("html")).toHaveClass("dark");
    const results = await new AxeBuilder({ page }).include(".mist-home").withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))).toEqual([]);
  }
});

test("join CTA opens registration", async ({ page }) => {
  await page.locator(".mist-hero").getByRole("link", { name: "Join now" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
});
