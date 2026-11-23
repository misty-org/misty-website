import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Route } from "@playwright/test";

import type { MeResponse } from "../src/pages/AccountSettings/api";

type Theme = "light" | "dark";

const baseMe: MeResponse = {
  id: "user-123",
  username: "maya",
  provider: "misty",
  email: "maya@misty.local",
  created_at: "2025-04-12T12:00:00Z",
};

async function prepareAccount(
  page: Page,
  theme: Theme,
  me: MeResponse = baseMe,
  inspectRequest?: (route: Route) => void,
) {
  await page.addInitScript(
    (initialTheme) => {
      window.localStorage.clear();
      window.localStorage.setItem("misty-ui-theme", initialTheme);
    },
    theme,
  );

  await page.route("**/api/**", async (route) => {
    inspectRequest?.(route);
    const url = new URL(route.request().url());

    if (url.pathname.endsWith("/me/settings")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          email_updates_enabled: true,
          analytics_enabled: false,
          error_reporting_enabled: true,
        }),
      });
      return;
    }

    if (url.pathname.endsWith("/me")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(me),
      });
      return;
    }

    if (url.pathname.endsWith("/me/invite-code")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ code: "abcdefghij" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });
}

async function openAccountSettings(page: Page) {
  if ((page.viewportSize()?.width ?? 1440) < 768) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("button", { name: "Settings" }).click();
  } else {
    await page.getByRole("button", { name: "Open account menu" }).click();
    await page.getByRole("menuitem", { name: "Settings" }).click();
  }
  await expect(
    page.getByRole("dialog", { name: "Account settings" }),
  ).toBeVisible();
}

for (const theme of ["light", "dark"] as const) {
  test(`settings opens in the saved ${theme} theme`, async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    await prepareAccount(page, theme);

    await page.goto("/changelog");
    await openAccountSettings(page);

    await expect(page).toHaveURL(/\/changelog$/);
    await expect(page.locator("html")).toHaveClass(new RegExp(`^${theme}$`));
    const dialog = page.getByRole("dialog", { name: "Account settings" });
    await expect(
      dialog.getByRole("heading", { level: 1, name: "Profile" }),
    ).toBeVisible();
    await expect(
      dialog.getByRole("navigation", { name: "Account settings sections" }),
    ).toBeVisible();
    const profileNavButton = dialog.getByRole("button", {
      name: "Profile",
      exact: true,
    });
    await expect(profileNavButton).toHaveAttribute("aria-current", "page");
    await expect(profileNavButton).toHaveCSS(
      "background-color",
      "rgb(62, 62, 62)",
    );
    const privacyNavButton = dialog.getByRole("button", {
      name: "Privacy",
      exact: true,
    });
    await expect(privacyNavButton).toBeVisible();
    if ((page.viewportSize()?.width ?? 1440) >= 768) {
      await privacyNavButton.hover();
      await expect(privacyNavButton).toHaveCSS(
        "background-color",
        "rgb(43, 43, 43)",
      );
    }
    await expect(
      dialog.getByRole("button", { name: "Billing", exact: true }),
    ).toHaveCount(0);
    await expect(
      dialog.getByRole("button", { name: "Usage", exact: true }),
    ).toHaveCount(0);
    await expect(dialog.getByText("maya", { exact: true })).toBeVisible();
    await expect(dialog.getByLabel("Username")).toHaveValue("maya");

    await expect(dialog.getByRole("button", { name: "General" })).toHaveCount(
      0,
    );
    await expect(
      dialog.getByRole("button", { name: "Diagnostics" }),
    ).toHaveCount(0);

    await dialog.getByRole("button", { name: "Privacy", exact: true }).click();
    await expect(
      dialog.getByRole("heading", { level: 1, name: "Privacy" }),
    ).toBeVisible();
    await expect(
      dialog.getByText(
        "Private Files and shared Space content are handled differently.",
      ),
    ).toBeVisible();
    expect(await dialog.innerText()).not.toMatch(/\b(?:max|mika|credits?)\b/i);

    const geometry = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        overflow: Math.max(
          0,
          document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      };
    });
    if ((page.viewportSize()?.width ?? 1440) < 768) {
      expect(geometry).toEqual({ width: 366, height: 820, overflow: 0 });
    } else {
      expect(geometry).toEqual({ width: 980, height: 760, overflow: 0 });
    }
    expect(pageErrors).toEqual([]);

    const accessibility = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      accessibility.violations.flatMap(({ id, nodes }) =>
        nodes.map(({ target }) => `${id}: ${target.join(" > ")}`),
      ),
    ).toEqual([]);

    await dialog
      .getByRole("button", { name: "Close account settings" })
      .click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/changelog$/);
  });
}

test("account updates save the username", async ({ page }) => {
  const requests: Array<{ path: string; method: string; body: string | null }> =
    [];
  await prepareAccount(page, "dark", baseMe, (route) => {
    const request = route.request();
    requests.push({
      path: new URL(request.url()).pathname,
      method: request.method(),
      body: request.postData(),
    });
  });
  await page.goto("/changelog");
  await openAccountSettings(page);

  await page.getByRole("dialog").getByLabel("Username").fill("maya_rivera");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save changes" })
    .click();
  await expect(page.getByRole("dialog").getByRole("status")).toHaveText(
    "Saved.",
  );
  expect(requests).toContainEqual({
    path: "/api/me/username",
    method: "PUT",
    body: JSON.stringify({ username: "maya_rivera" }),
  });
});

test("privacy exposes the server-backed sharing preferences", async ({
  page,
}) => {
  await prepareAccount(page, "dark");
  await page.goto("/settings/privacy");

  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await expect(dialog.getByLabel("Product update emails")).toBeChecked();
  await expect(dialog.getByLabel("Anonymous usage analytics")).not.toBeChecked();
  await expect(dialog.getByLabel("Anonymous crash reports")).toBeChecked();
});

test("saving a preference sends all three booleans", async ({ page }) => {
  let body: Record<string, boolean> | null = null;
  await prepareAccount(page, "dark", baseMe, (route) => {
    const request = route.request();
    if (
      request.method() === "PUT" &&
      new URL(request.url()).pathname.endsWith("/me/settings")
    ) {
      body = request.postDataJSON();
    }
  });

  await page.goto("/settings/privacy");
  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await dialog.getByLabel("Anonymous usage analytics").click();

  await expect.poll(() => body).not.toBeNull();
  expect(body).toEqual({
    email_updates_enabled: true,
    analytics_enabled: true,
    error_reporting_enabled: true,
  });
});

test("privacy links to the real legal pages", async ({ page }) => {
  await prepareAccount(page, "dark");
  await page.goto("/settings/privacy");

  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await expect(dialog.getByRole("link", { name: "Read" })).toHaveCount(3);
  await expect(
    dialog.locator('a[href="/privacy"], a[href="/terms"], a[href="/license"]'),
  ).toHaveCount(3);
  await expect(dialog.getByText("Coming soon")).toHaveCount(0);
});

test("the account tab owns deletion", async ({ page }) => {
  await prepareAccount(page, "dark");
  await page.goto("/settings/account");

  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await expect(dialog.getByLabel("Licensed device")).toHaveCount(0);
  await expect(dialog.getByLabel("Profile picture")).toBeAttached();

  const deleteButton = dialog.getByRole("button", {
    name: "Delete my account",
  });
  await expect(deleteButton).toBeDisabled();
  await dialog.getByLabel("Password", { exact: true }).last().fill("hunter2");
  await expect(deleteButton).toBeDisabled();
  await dialog.getByLabel("Type DELETE to confirm").fill("DELETE");
  await expect(deleteButton).toBeEnabled();
});

test("deletion is blocked while the account still owns Spaces", async ({
  page,
}) => {
  await prepareAccount(page, "dark");
  await page.route("**/api/me/deletion", async (route) => {
    await route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({
        spaces: [{ id: "space-1", name: "Design Team" }],
      }),
    });
  });

  await page.goto("/settings/account");
  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await dialog.getByLabel("Password", { exact: true }).last().fill("hunter2");
  await dialog.getByLabel("Type DELETE to confirm").fill("DELETE");
  await dialog.getByRole("button", { name: "Delete my account" }).click();
  await page.getByRole("button", { name: "Delete account" }).click();

  await expect(dialog.getByText("Design Team")).toBeVisible();
});

test("a settings URL is addressable and keeps its path", async ({ page }) => {
  await prepareAccount(page, "dark");

  await page.goto("/settings");

  await expect(page).toHaveURL(/\/settings$/);
  await expect(
    page.getByRole("dialog", { name: "Account settings" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: "Profile" }),
  ).toBeVisible();
});

test("a settings URL can target a tab directly", async ({ page }) => {
  await prepareAccount(page, "dark");

  await page.goto("/settings/privacy");

  await expect(page).toHaveURL(/\/settings\/privacy$/);
  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: "Privacy" }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Privacy", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("switching tabs on a settings URL updates the path", async ({ page }) => {
  await prepareAccount(page, "dark");

  await page.goto("/settings/account");
  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await dialog.getByRole("button", { name: "Privacy", exact: true }).click();

  await expect(page).toHaveURL(/\/settings\/privacy$/);
});

test("an unknown settings tab falls back to the default tab", async ({
  page,
}) => {
  await prepareAccount(page, "dark");

  await page.goto("/settings/billing");

  await expect(page).toHaveURL(/\/settings\/account$/);
  await expect(
    page.getByRole("dialog", { name: "Account settings" }),
  ).toBeVisible();
});

test("a signed-out settings deep link returns after sign-in", async ({
  page,
}) => {
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/me")) {
      await route.fulfill({ status: 401, body: "unauthorized" });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });

  await page.goto("/settings/privacy");

  await expect(page).toHaveURL(/\/signin$/);
  const carried = await page.evaluate(() => window.history.state?.usr?.from);
  expect(carried).toBe("/settings/privacy");
});

test("a subscriber cancels and keeps Pro in settings, never at Stripe's login", async ({
  page,
}) => {
  await prepareAccount(page, "dark");
  let cancelled = false;
  await page.route("**/account/subscription**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/cancel")) cancelled = true;
    if (path.endsWith("/resume")) cancelled = false;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        subscribed: true,
        status: "active",
        current_period_end: "2026-12-03T12:00:00Z",
        cancel_at_period_end: cancelled,
      }),
    });
  });
  await page.goto("/settings/subscription");

  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await expect(dialog.getByText("Renews on")).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toContainText("You keep Pro until");
  await confirm.getByRole("button", { name: "Cancel subscription" }).click();
  await expect(dialog.getByText("Ends on")).toBeVisible();
  await dialog.getByRole("button", { name: "Keep subscription" }).click();
  await expect(dialog.getByText("Renews on")).toBeVisible();
});

test("the profile page offers a link to invite someone", async ({ page }) => {
  await prepareAccount(page, "dark");
  await page.goto("/settings/account");
  const dialog = page.getByRole("dialog", { name: "Account settings" });
  await expect(dialog.getByText(/\/r\/abcdefghij$/)).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Copy your invite link" })).toBeVisible();
});
