import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("one continuous mist wallpaper stays behind every homepage section", async ({ page }) => {
  await page.goto('/');
  const wallpaper = page.locator('.mist-atmosphere');
  const cloud = page.locator('.mist-cloud');
  await expect(wallpaper).toHaveCount(1);
  await expect(cloud).toHaveCount(1);
  await expect.poll(() => cloud.evaluate(el => getComputedStyle(el, '::before').animationPlayState)).toBe('running');
  const before = await cloud.evaluate(el => getComputedStyle(el, '::before').transform);
  await expect.poll(() => cloud.evaluate(el => getComputedStyle(el, '::before').transform)).not.toBe(before);
  for (const id of ['features', 'faq']) {
    await page.locator(`#${id}`).evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 150));
    await expect.poll(async () => Math.round((await wallpaper.boundingBox())!.y)).toBe(0);
    expect(Math.round((await wallpaper.boundingBox())!.height)).toBe(await page.evaluate(() => innerHeight));
    await expect(cloud).toHaveCSS('opacity', '0.6');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await cloud.evaluate(el => getComputedStyle(el, '::before').animationName)).toBe('none');
  await page.getByRole('navigation', { name: 'Explore footer links' }).getByRole('link', { name: 'Self-hosting' }).click();
  await expect(wallpaper).toHaveCount(0);
});

test("the hero centers its headline above the Misty screenshot", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'Desktop hero layout');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 720 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const copy = (await page.locator('.mist-hero-copy').boundingBox())!;
    const window = (await page.locator('.mist-hero-screenshot').boundingBox())!;
    await expect(page.locator('.mist-hero h1')).toHaveCSS('text-align', 'center');
    // The headline is one bright tone, and the product starts within the first screen.
    await expect(page.locator('.mist-hero h1')).toHaveCSS('color', 'rgb(244, 244, 245)');
    expect(window.y).toBeGreaterThanOrEqual(copy.y + copy.height - 1);
    expect(window.y).toBeLessThan(viewport.height);
    expect(Math.abs(window.x + window.width / 2 - viewport.width / 2)).toBeLessThan(2);
  }
});

test("the agents scene locks the viewport and lights one step at a time with the scroll", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'Pinned on desktop');
  await page.goto('/');
  const steps = page.locator('.mist-steps');
  const count = await page.locator('.mist-steps-list button').count();
  expect(count).toBe(5);
  // Scroll to a point in the scene's own progress: the pin sticks at its `top` and the track runs
  // for the scene's height less the pin's, as in AgentsChapter.
  const seek = (fraction: number) => steps.evaluate((el, fraction) => {
    const pin = el.querySelector<HTMLElement>('.mist-steps-pin')!;
    const top = parseFloat(getComputedStyle(pin).top) || 0;
    scrollTo(0, scrollY + el.getBoundingClientRect().top - top + (el.offsetHeight - pin.offsetHeight) * fraction);
  }, fraction);
  /** The middle of one step's stretch of the scroll. */
  const step = (index: number) => seek((index + 0.5) / count);
  const active = page.locator('.mist-steps-list [aria-current=step]');
  const window = page.locator('.mist-steps .mw');
  const media = page.locator('.mist-steps-media');
  await step(0);
  await expect(active).toHaveText('Pick any AI you like.');
  await expect(active).toHaveCount(1);
  await expect(window.locator('.mw-composer')).toHaveAttribute('data-typing', 'true');
  // The apps step swaps the window for the Integrations screenshot.
  await step(1);
  await expect(active).toHaveText('Connect your apps once.');
  await expect(media).toHaveAttribute('data-apps', 'true');
  await step(2);
  await expect(active).toHaveText('Ask in one sentence.');
  await expect(media).toHaveAttribute('data-apps', 'false');
  await step(3);
  await expect(active).toHaveText('Watch it work live.');
  await expect(media).toHaveAttribute('data-apps', 'false');
  await expect(window.locator('.mw-steps')).toBeVisible();
  await step(4);
  await expect(active).toHaveText('Approve what matters.');
  await expect(window.locator('.mw-approve')).toBeVisible();
  // The scene stays locked in place while the steps change.
  const pinned = await page.locator('.mist-steps-pin').boundingBox();
  await step(1);
  expect((await page.locator('.mist-steps-pin').boundingBox())!.y).toBeCloseTo(pinned!.y, 0);
  // Each step in the list jumps to itself.
  await page.getByRole('button', { name: 'Ask in one sentence.' }).click();
  await expect(active).toHaveText('Ask in one sentence.');
});

test("reduced motion keeps every image visible and still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const selector of ['.mist-cloud-back']) {
    await expect(page.locator(selector).first()).toHaveCSS('transform', 'none');
  }
  await expect(page.locator('.mist-device-badge, .mist-device-wait')).toHaveCount(0);
});
