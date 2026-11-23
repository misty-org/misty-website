import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.localStorage.setItem("misty-ui-theme", "dark");
  });
  await page.reload();
});

test("the site opens dark, even when the system prefers light", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.evaluate(() => localStorage.removeItem("misty-ui-theme"));
  for (const path of ["/", "/changelog", "/signin"]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveClass("dark");
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/misty-white.png");
  }
});

test("the navbar theme toggle persists across navigation and reload", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Switch to light theme" });
  await expect(toggle).toBeVisible();
  await toggle.click();

  await expect(page.locator("html")).toHaveClass(/(^|\s)light(\s|$)/);
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("misty-ui-theme"))).toBe("light");
  await expect(page.locator(".mist-home")).toHaveCSS("background-color", "rgb(243, 243, 241)");
  await expect(page.locator(".mist-cloud")).toHaveCSS("filter", "invert(1)");

  await page.getByRole("link", { name: "Misty home" }).click();
  await page.reload();

  await expect(page.locator("html")).toHaveClass(/(^|\s)light(\s|$)/);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/misty-white.png");
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
});

test("the desktop theme toggle sits after the social links and a divider", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium", "Desktop navigation is only rendered at the desktop breakpoint.");
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  const lastSocial = navigation.getByRole("link", { name: /Instagram/ });
  const toggle = navigation.getByRole("button", { name: "Switch to light theme" });
  await expect(navigation.getByRole("link", { name: "Sign in" })).toBeVisible();
  const [socialBox, toggleBox] = await Promise.all([lastSocial.boundingBox(), toggle.boundingBox()]);
  expect(toggleBox!.x).toBeGreaterThan(socialBox!.x + socialBox!.width);
  const divider = await toggle.evaluate(el => {
    const line = el.previousElementSibling as HTMLElement | null;
    return line ? { width: line.getBoundingClientRect().width, height: line.getBoundingClientRect().height } : null;
  });
  expect(divider!.width).toBe(1);
  expect(divider!.height).toBeGreaterThan(16);
  expect(divider!.height).toBeLessThan(26);
});

test("the primary links include Download, Pricing and GitHub, with Docs under Resources", async ({
  page,
}, testInfo) => {
  const mobile = testInfo.project.name === "mobile-chromium";
  if (mobile) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
  }

  const linkContainer = mobile
    ? page.locator("#mobile-navigation")
    : page.getByRole("navigation", { name: "Primary navigation" });
  await expect(
    linkContainer.getByRole("link", { name: "Download", exact: true }),
  ).toBeVisible();
  const labels = await linkContainer
    .locator("a")
    .filter({ hasText: /^(Download|Pricing|GitHub)$/ })
    .allTextContents();

  expect(labels).toEqual(["Download", "Pricing", "GitHub"]);
  if (mobile) {
    await expect(linkContainer.getByRole("link", { name: "Docs", exact: true })).toBeVisible();
  } else {
    await linkContainer.getByRole("button", { name: "Resources" }).hover();
    await expect(page.getByRole("menuitem").first()).toHaveText("Docs");
  }
  await expect(
    linkContainer.getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveAttribute("href", "https://github.com/misty-org/misty");
  await expect(
    linkContainer.getByRole("link", { name: "Features", exact: true }),
  ).toHaveCount(0);
});

test("page navigation mounts the destination with the entrance transition", async ({
  page,
}) => {
  const homePage = page.locator('[data-page-transition="/"]');
  await expect(homePage).toBeVisible();
  await expect(homePage).toHaveClass(/page-transition/);

  await page
    .getByRole("navigation", { name: "Explore footer links" })
    .getByRole("link", { name: "Pricing", exact: true })
    .click();

  await expect(page).toHaveURL(/\/pricing$/);
  const pricingPage = page.locator('[data-page-transition="/pricing"]');
  await expect(pricingPage).toBeVisible();
  await expect(homePage).toHaveCount(0);
  await expect(pricingPage).toHaveClass(/page-transition/);
});

test("the mobile menu opens, navigates, and closes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile navigation is only rendered at the mobile breakpoint.");

  const openMenu = page.getByRole("button", { name: "Open navigation menu" });
  await openMenu.click();

  await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible();
  await expect(page.locator("#mobile-navigation")).toBeVisible();

  await page.locator("#mobile-navigation").getByRole("link", { name: "Docs" }).click();

  await expect(page).toHaveURL(/\/\/docs\.[^/]+\/?$/);
  await expect(page.locator("#mobile-navigation")).toBeHidden();
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
});
