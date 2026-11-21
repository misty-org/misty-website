import { expect, test } from "@playwright/test";

test("the site uses the app's design system: its font, palette, corners and 100% root", async ({ page }) => {
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

  // Dark only, like the app's default theme (@misty/ui/styles.css).
  expect(system.dark).toBe(true);
  // One face everywhere, the system font, as in the app.
  expect(system.bodyFont).toContain("-apple-system");
  expect(system.headingFont).toContain("-apple-system");
  // The root is never scaled, as in the desktop app: every rem size is the size it says.
  expect(system.rootFontSize).toBe("16px");
  expect(system.background).toBe("#131313");
  expect(system.radius).toBe("0.5625rem");
  expect(system.overscrollBehaviorY).toBe("auto");
});
