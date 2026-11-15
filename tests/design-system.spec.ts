import { expect, test } from "@playwright/test";

test("the site uses the app's design system: its font, palette, corners and 110% root", async ({ page }) => {
  await page.route("**/api/**", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "Unauthorized" }),
    }),
  );

  await page.goto("/");

  const system = await page.evaluate(() => {
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);
    const heading = document.querySelector("h1");

    return {
      dark: root.classList.contains("dark"),
      bodyFont: getComputedStyle(document.body).fontFamily,
      headingFont: heading ? getComputedStyle(heading).fontFamily : "",
      rootFontSize: rootStyles.fontSize,
      background: rootStyles.getPropertyValue("--misty-theme-bg").trim(),
      radius: rootStyles.getPropertyValue("--radius").trim(),
      overscrollBehaviorY: rootStyles.overscrollBehaviorY,
    };
  });

  // Dark only, like the app's default theme (src/styles/misty-theme.css).
  expect(system.dark).toBe(true);
  // One face everywhere, the system font, as in the app.
  expect(system.bodyFont).toContain("-apple-system");
  expect(system.headingFont).toContain("-apple-system");
  // The app's 110% root, so every rem size matches the desktop app's.
  expect(system.rootFontSize).toBe("17.6px");
  expect(system.background).toBe("#131313");
  expect(system.radius).toBe("0.5625rem");
  expect(system.overscrollBehaviorY).toBe("auto");
});
