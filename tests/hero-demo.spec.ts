import { expect, test, type Page } from "@playwright/test";

/** The hero's Misty window can be used: approve, switch tabs and ask for other tasks. */

test.skip(({ viewport }) => (viewport?.width ?? 0) < 1000, "The composer is read-only where the window is scaled down");

const openReduced = async (page: Page) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
};

test("the demo waits for approval, then posts the summary to Slack", async ({ page }) => {
  await openReduced(page);
  const demo = page.locator(".mist-hero-demo .mw");
  // Reduced motion opens on the approval, with the doc already written.
  await expect(demo.locator(".mw-approve")).toContainText("Post a 4-line summary to #launch");
  await expect(demo.locator(".mw-slack-box[data-draft=true]")).toBeVisible();
  await demo.getByRole("button", { name: "Approve" }).click();
  await expect(demo.locator(".mw-done")).toHaveText("Posted to #launch");
  await expect(demo.locator(".mw-slack .mw-new-message")).toContainText("Launch catch-up");

  // The doc tab shows what the agent wrote.
  await demo.getByRole("button", { name: "Launch plan" }).click();
  await expect(demo.locator(".mw-doc-new")).toHaveAttribute("data-written", "true");
});

test("visitors can decline, pick another task, or ask for something the demo can't do", async ({ page }) => {
  await openReduced(page);
  const demo = page.locator(".mist-hero-demo .mw");
  await demo.getByRole("button", { name: "Not now" }).click();
  await expect(demo.locator(".mw-note")).toHaveText("Okay, nothing was posted.");
  await expect(demo.locator(".mw-slack-box[data-draft=true]")).toHaveCount(0);

  await demo.getByRole("button", { name: "Reply to Ravi about the embargo" }).click();
  await expect(demo.locator(".mw-approve")).toContainText("Send this reply to Ravi Shah?", { timeout: 10_000 });
  await expect(demo.locator(".mw-email")).toContainText("confirmed: Oct 27");
  await demo.getByRole("button", { name: "Approve" }).click();
  await expect(demo.locator(".mw-done")).toHaveText("Sent to Ravi");

  const composer = demo.getByRole("textbox", { name: "Ask Misty" });
  await composer.fill("What's still open before launch?");
  await composer.press("Enter");
  await expect(demo.locator(".mw-answer li")).toHaveCount(3, { timeout: 10_000 });

  await composer.fill("Book me a flight to Lisbon");
  await composer.press("Enter");
  await expect(demo.locator(".mw-note")).toContainText("only has three sample tabs");
  await expect(demo.locator(".mw-suggest button")).toHaveCount(3);
});

test("a running task can be stopped", async ({ page }) => {
  await openReduced(page);
  const demo = page.locator(".mist-hero-demo .mw");
  await demo.getByRole("button", { name: "Not now" }).click();
  await demo.getByRole("button", { name: "What's still open before launch?" }).click();
  await expect(demo.locator(".mw-page[data-agent=true]")).toBeVisible();
  await demo.getByRole("button", { name: "Stop" }).click();
  await expect(demo.locator(".mw-note")).toHaveText("Stopped. Your tabs are yours again.");
  await expect(demo.locator(".mw-steps li[data-state=skipped]")).toHaveCount(3);
});

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the demo types the first task on its own and works through it", async ({ page }) => {
    await page.goto("/");
    const demo = page.locator(".mist-hero-demo .mw");
    await expect(demo.getByRole("textbox", { name: "Ask Misty" })).toHaveValue(/Catch me up/, { timeout: 8_000 });
    await expect(demo.locator(".mw-steps li[data-state=active]")).toBeVisible({ timeout: 8_000 });
    await expect(demo.locator(".mw-approve")).toBeVisible({ timeout: 12_000 });
  });

  test("typing takes the composer back from the autoplay", async ({ page }) => {
    await page.goto("/");
    const composer = page.locator(".mist-hero-demo").getByRole("textbox", { name: "Ask Misty" });
    await composer.click();
    await composer.fill("Reply to Ravi");
    await page.waitForTimeout(2500);
    await expect(composer).toHaveValue("Reply to Ravi");
    await expect(page.locator(".mist-hero-demo .mw-steps")).toHaveCount(0);
  });
});
