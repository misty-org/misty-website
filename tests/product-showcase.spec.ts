import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("the homepage tells its story chapter by chapter and keeps its resource previews", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The agentic browser for building your workspace");
  // Three parts, each opened by an interlude, then the equation they add up to.
  await expect(page.locator(".mist-interlude h2")).toHaveText(["It starts as a browser.", "Then come the tools for your work.", "Bring it all together in a space."]);
  await expect(page.locator(".mist-chapter-head h2")).toHaveText([
    "Fast because it's native. No bundled Chromium.",
    "Give each computer its own setup and keep them all in sync.",
    "Agents that work across your whole browser.",
    "Connect your apps once and let agents use them.",
    "Open any file from any of your computers.",
    "A space for every project.",
  ]);
  await expect(page.locator("#equation-title")).toHaveText("browser + work + space");
  await expect(page.getByRole("heading", { name: "Ready to build your browser workspace?" })).toBeVisible();
  await expect(page.locator(".mist-eyebrow, .mist-device-badge, .mist-sync-status, .mist-workspace, .mist-reveal")).toHaveCount(0);
  // The call to download follows the equation; the blog, changelog and roadmap sit after it,
  // as three columns of two.
  await expect(page.locator("#features + #download")).toHaveCount(1);
  for (const [id, title] of [["blog", "Blog"], ["changelog", "Changelog"], ["roadmap", "Roadmap"]]) {
    const section = page.locator(`[data-resource-preview='${id}']`);
    await expect(section.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(section.locator(".resource-flat-card")).toHaveCount(1);
    await expect(section.getByRole("link", { name: `Visit ${id}` })).toHaveAttribute("href", `/${id}`);
  }
  if (page.viewportSize()!.width > 900) {
    const tops = await page.locator(".mist-resource-column").evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
  }
});

test("the sync chapter shows the devices card across its row", async ({ page }) => {
  const cards = page.locator('.mist-feature-card');
  await expect(cards).toHaveCount(1);
  await expect(cards.locator('.mist-feature-label')).toHaveText(['devices']);
  const card = cards.first();
  await card.scrollIntoViewIfNeeded();
  await expect(card.getByRole('heading', { level: 3 })).toBeVisible();
  await expect(card.locator('.mist-devices')).toBeVisible();
  if (page.viewportSize()!.width > 800) {
    const [cardWidth, gridWidth] = await card.evaluate(el => [el.getBoundingClientRect().width, el.parentElement!.getBoundingClientRect().width]);
    expect(cardWidth).toBeCloseTo(gridWidth, 0);
  }
});

test("missing replacement images fall back to a capture without changing the slot size", async ({ page }) => {
  await page.route('**/screenshots/misty-space-library.webp', route => route.fulfill({ status: 404, body: '' }));
  await page.reload();
  // The shared slot is the Library pane of the Spaces tour.
  await page.locator('#mist-tour-tab-library').click();
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
  await page.locator('#mist-tour-tab-library').click();
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
