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
  for (const id of ['features', 'foundation', 'resources']) {
    await page.locator(`#${id}`).evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 150));
    await expect.poll(async () => Math.round((await wallpaper.boundingBox())!.y)).toBe(0);
    expect(Math.round((await wallpaper.boundingBox())!.height)).toBe(await page.evaluate(() => innerHeight));
    await expect(cloud).toHaveCSS('opacity', '0.6');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await cloud.evaluate(el => getComputedStyle(el, '::before').animationName)).toBe('none');
  await page.locator('.mist-hero').getByRole('link', { name: 'Join now' }).click();
  await expect(wallpaper).toHaveCount(0);
});

test("viewport motion reverses with scrolling and never drifts while idle", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.page-transition').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  const section = page.locator('#foundation');
  const device = page.locator('.mist-laptop-device');
  // Let the card finish its one-time reveal, so seeking measures a card at rest.
  await section.scrollIntoViewIfNeeded();
  await expect(page.locator('#sync .mist-feature-grid')).toHaveAttribute('data-revealed', 'true');
  await section.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  const seek = async (fraction: number) => {
    await section.evaluate((el, fraction) => scrollTo(0, scrollY + el.getBoundingClientRect().top - innerHeight * fraction), fraction);
    await page.waitForTimeout(100);
    return device.evaluate(el => getComputedStyle(el).transform);
  };
  const before = await seek(.95);
  const after = await seek(.4);
  expect(after).not.toBe(before);
  const position = await page.evaluate(() => scrollY);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => scrollY)).toBe(position);
  expect(await device.evaluate(el => getComputedStyle(el).transform)).toBe(after);
  const reversed = await seek(.95);
  // Native scrolling rounds to physical pixels; allow subpixel differences.
  const translation = (matrix: string) => matrix.slice(7, -1).split(',').slice(4).map(Number);
  translation(reversed).forEach((value, index) => {
    expect(Math.abs(value - translation(before)[index])).toBeLessThan(1);
  });
});

test("the hero centers its two-tone headline above a live Misty window", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'Desktop hero layout');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 720 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const copy = (await page.locator('.mist-hero-copy').boundingBox())!;
    const window = (await page.locator('.mist-hero-demo .mw').boundingBox())!;
    await expect(page.locator('.mist-hero h1')).toHaveCSS('text-align', 'center');
    // The headline is one bright tone, and the product starts within the first screen.
    await expect(page.locator('.mist-hero h1 > span').last()).toHaveCSS('color', 'rgb(244, 244, 245)');
    expect(window.y).toBeGreaterThanOrEqual(copy.y + copy.height - 1);
    expect(window.y).toBeLessThan(viewport.height);
    expect(Math.abs(window.x + window.width / 2 - viewport.width / 2)).toBeLessThan(2);
  }
});

test("the agents scene locks the viewport, shows one step at a time, and fills its pill with the scroll", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'Pinned on desktop');
  await page.goto('/');
  const steps = page.locator('.mist-steps');
  const beats = await page.locator('.mist-steps-beat').count();
  expect(beats).toBe(6);
  // Scroll to a point in the scene's own progress: the pin sticks at its `top` and the track runs
  // for the scene's height less the pin's, as in AgentsChapter.
  const seek = (fraction: number) => steps.evaluate((el, fraction) => {
    const pin = el.querySelector<HTMLElement>('.mist-steps-pin')!;
    const top = parseFloat(getComputedStyle(pin).top) || 0;
    scrollTo(0, scrollY + el.getBoundingClientRect().top - top + (el.offsetHeight - pin.offsetHeight) * fraction);
  }, fraction);
  /** The middle of one beat's stretch of the scroll. */
  const beat = (index: number) => seek((index + 0.5) / beats);
  const active = page.locator('.mist-steps-beat[data-active=true] h3');
  const window = page.locator('.mist-steps .mw');
  const fill = (index: number) => page.locator('.mist-steps-progress i').nth(index).evaluate(el =>
    new DOMMatrix(getComputedStyle(el, '::after').transform).a);
  await beat(0);
  await expect(active).toHaveText('Ask in one sentence.');
  await expect(page.locator('.mist-steps-beat[data-active=true]')).toHaveCount(1);
  await expect(window.locator('.mw-composer')).toHaveAttribute('data-typing', 'true');
  await beat(1);
  await expect(active).toHaveText('Approve the plan before anything changes.');
  await expect(window.locator('.mw-plan')).toBeVisible();
  // The first segment is full and the second is partway through.
  await expect.poll(() => fill(0)).toBeCloseTo(1, 2);
  await expect.poll(() => fill(1)).toBeGreaterThan(0.3);
  expect(await fill(1)).toBeLessThan(0.7);
  expect(await fill(2)).toBeCloseTo(0, 2);
  await beat(2);
  await expect(active).toHaveText('It works across your tabs and apps.');
  await expect(window.locator('.mw-steps')).toBeVisible();
  await beat(3);
  await expect(window.locator('.mw-approve')).toBeVisible();
  await beat(4);
  await expect(window.locator('.mw-saved')).toBeVisible();
  await beat(5);
  await expect(window.locator('.mw-handoff')).toBeVisible();
  // The scene stays locked in place while the steps change.
  const pinned = await page.locator('.mist-steps-pin').boundingBox();
  await beat(3);
  expect((await page.locator('.mist-steps-pin').boundingBox())!.y).toBeCloseTo(pinned!.y, 0);
  // Each segment of the pill jumps to its step.
  await page.getByRole('button', { name: 'Step 1: Ask in one sentence.' }).click();
  await expect(active).toHaveText('Ask in one sentence.');
});

test("reduced motion keeps every image and both computer screens visible and still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const selector of ['.mist-laptop-device', '.mist-cloud-back']) {
    await expect(page.locator(selector).first()).toHaveCSS('transform', 'none');
  }
  // The live window holds still on the moment the agent asks for approval.
  await expect(page.locator('.mist-hero-demo .mw-approve')).toBeVisible();
  await page.locator('#foundation').scrollIntoViewIfNeeded();
  const images = page.locator('[data-image-slot="continuity"] img');
  await expect(images).toHaveCount(2);
  expect(await images.nth(0).getAttribute('src')).toBe(await images.nth(1).getAttribute('src'));
  await expect.poll(() => images.evaluateAll(images => images.every(img => (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await expect(page.locator('.mist-device-badge, .mist-device-wait')).toHaveCount(0);
});
