import { expect, test } from "@playwright/test";

test("the homepage ends with a call to download", async ({ page }, info) => {
  await page.goto("/download");
  const section = page.locator("#download");
  await expect(section.getByRole("heading", { level: 2, name: "Ready to build your browser workspace?" })).toBeInViewport();
  // The hero's button again: the visitor's own build on desktop, every release on a phone.
  const button = info.project.name === "mobile-chromium"
    ? section.getByRole("link", { name: "Download Misty" })
    : section.getByRole("link", { name: /^Download Misty( for (macOS|Windows))?$/ });
  await expect(button).toBeVisible();
  await expect(section.getByRole("link")).toHaveCount(1);
});

test("/download opens the homepage at its section and /self-hosting goes to the docs", async ({ page }) => {
  await page.goto("/self-hosting");
  await expect(page).toHaveURL(/\/docs\/self-hosting$/);
  await expect(page).toHaveTitle(/^Run a server/);
  await expect(page.locator(".mist-hero")).toHaveCount(0);

  await page.goto("/download");
  await expect(page).toHaveTitle(/^Download Misty/);
  await expect(page.locator("#download h2")).toBeInViewport();
});

test("navbar links scroll the homepage to its sections without reloading it", async ({ page }, info) => {
  test.skip(info.project.name === "mobile-chromium", "Desktop navigation");
  await page.goto("/");
  await page.locator(".mist-hero").evaluate(el => ((window as unknown as { hero: Element }).hero = el));
  const nav = page.getByRole("navigation", { name: "Primary navigation" });

  await nav.getByRole("link", { name: "Download" }).click();
  await expect(page).toHaveURL(/\/download$/);
  await expect(page.locator("#download h2")).toBeInViewport();

  await nav.getByRole("link", { name: "Misty home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  // The same page the whole time: moving between sections never remounts the homepage.
  expect(await page.locator(".mist-hero").evaluate(el => (window as unknown as { hero: Element }).hero === el)).toBe(true);
});
