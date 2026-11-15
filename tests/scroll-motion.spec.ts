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

/** Scrolls to step `step` of the bento's scene: one step per `data-step` pixels once the stage has pinned. Steps
 * are the whole bento, then a step per screenshot of each tile (3, 5, 3, 3), then the whole bento again. */
async function sceneAt(page: import("@playwright/test").Page, step: number) {
  await page.locator('.mist-zoom-track').evaluate((track, at) => {
    const stage = track.firstElementChild as HTMLElement;
    const pinTop = parseFloat(getComputedStyle(stage).top);
    scrollTo(0, track.getBoundingClientRect().top + scrollY - pinTop + at * Number((track as HTMLElement).dataset.step));
  }, step);
}

test("the bento pins and steps: zoom into a tile, one screenshot per step, then back out", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'The scene only pins on wide screens');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const track = page.locator('.mist-zoom-track');
  const view = page.locator('.mist-zoom-view[data-shown]');
  await expect(page.locator('#highlights .mist-tile')).toHaveCount(4);
  await expect(track).toHaveAttribute('data-pinned', '');
  // The tiles never move or scale; only the card expands over them.
  const scale = () => page.locator('#highlights .mist-tile').first().evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a);
  const stageTop = () => page.locator('.mist-zoom-stage').evaluate(el => Math.round(el.getBoundingClientRect().top));
  // At rest the whole bento shows.
  await sceneAt(page, 0);
  await expect.poll(scale).toBe(1);
  await expect(view).toHaveCount(0);
  const pinned = await stageTop();
  // One step zooms the first tile open: it is its own viewport, exactly the bento's size, on its first screenshot.
  await sceneAt(page, 1);
  await expect(view).toHaveAttribute('data-expanded', '');
  expect(await stageTop()).toBe(pinned);
  const frame = (await page.locator('.mist-zoom-frame').boundingBox())!, open = (await view.boundingBox())!;
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(Math.abs(open[key] - frame[key])).toBeLessThan(1);
  const tabs = view.locator('.mist-zoom-tabs button');
  await expect(tabs.nth(0)).toHaveAttribute('aria-pressed', 'true');
  // The next step brings in the second screenshot, fully in place once the step settles.
  await sceneAt(page, 2);
  await expect(tabs.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => view.locator('.mist-zoom-shot').nth(1).evaluate(el => new DOMMatrix(getComputedStyle(el).transform).f)).toBe(0);
  // A tab scrolls the page to its screenshot's step.
  await tabs.nth(2).click();
  await expect(tabs.nth(2)).toHaveAttribute('aria-pressed', 'true');
  // After the last screenshot the card shrinks back into its tile, then the next step expands the second tile.
  await sceneAt(page, 4);
  await expect.poll(scale).toBe(1);
  await expect(view).toHaveCount(0);
  await sceneAt(page, 5);
  await expect(page.locator('.mist-zoom-view').nth(1)).toHaveAttribute('data-expanded', '');
  // Past the scene the bento is whole again and the page moves on.
  await track.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight));
  await expect.poll(scale).toBe(1);
  await expect(view).toHaveCount(0);
});

test("a jump across several steps (the scrollbar) goes straight to where it lands, with one zoom", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'The scene only pins on wide screens');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.mist-zoom-track')).toHaveAttribute('data-pinned', '');
  await sceneAt(page, 0);
  // Record every viewport that shows on the way: the first tile is flown past, so only the second may show.
  await page.evaluate(() => {
    const seen = ((window as unknown as { seen: number[] }).seen = []);
    document.querySelectorAll('.mist-zoom-view').forEach((view, index) => new MutationObserver(() => {
      if (view.hasAttribute('data-shown')) seen.push(index);
    }).observe(view, { attributes: true, attributeFilter: ['data-shown'] }));
  });
  // Step 7 is the second tile (steps 5 to 9) on its third screenshot.
  await sceneAt(page, 7);
  const second = page.locator('.mist-zoom-view').nth(1);
  await expect(second).toHaveAttribute('data-expanded', '');
  await expect(second.locator('.mist-zoom-tabs button').nth(2)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => [...new Set((window as unknown as { seen: number[] }).seen)])).toEqual([1]);
});

test("one scroll gesture moves one step, however big; at the end the page scrolls on", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'The scene only pins on wide screens');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const track = page.locator('.mist-zoom-track');
  await expect(track).toHaveAttribute('data-pinned', '');
  const step = Number(await track.getAttribute('data-step'));
  const origin = await track.evaluate(el => el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el.firstElementChild!).top));
  const at = async () => Math.round((await page.evaluate(() => scrollY) - origin) / step);
  await sceneAt(page, 0);
  await page.mouse.move(720, 450);
  // A big swipe: many events close together, momentum dying away at the end. One step, and the first tile opens.
  for (const delta of [30, 80, 140, 160, 120, 80, 50, 30, 15, 8, 4]) await page.mouse.wheel(0, delta);
  await expect.poll(at).toBe(1);
  await expect(page.locator('.mist-zoom-view').first()).toHaveAttribute('data-expanded', '');
  // Separate gestures each move one more step, back as well as forward.
  for (const expected of [2, 3]) {
    await page.waitForTimeout(250);
    await page.mouse.wheel(0, 120);
    await expect.poll(at).toBe(expected);
  }
  await page.waitForTimeout(250);
  await page.mouse.wheel(0, -120);
  await expect.poll(at).toBe(2);
  // On the last step, the next gesture scrolls the page on natively, nothing held back.
  await track.evaluate((el, last) => scrollTo(0, el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el.firstElementChild!).top) + last), 18 * step);
  await page.waitForTimeout(250);
  const end = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(end + 200);
});

test("a card expands from its tile without moving any tile, and never past the bento's edges", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'The scene only pins on wide screens');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.mist-zoom-track')).toHaveAttribute('data-pinned', '');
  const frame = page.locator('.mist-zoom-frame');
  // The first tile (top left) and the third (bottom left), sampled all through their zoom in.
  for (const [tile, step, neighbor] of [[0, 1, 1], [2, 11, 3]] as const) {
    await sceneAt(page, step - 1);
    await page.waitForTimeout(900);
    const still = (await page.locator('#highlights .mist-tile').nth(neighbor).boundingBox())!;
    await sceneAt(page, step);
    for (let i = 0; i < 12; i++) {
      expect(await page.locator('#highlights .mist-tile').nth(neighbor).boundingBox()).toEqual(still);
      const bounds = (await frame.boundingBox())!, box = (await page.locator('#highlights .mist-tile').nth(tile).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(bounds.x - 1);
      expect(box.y).toBeGreaterThanOrEqual(bounds.y - 1);
      expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(bounds.y + bounds.height + 1);
      await page.waitForTimeout(60);
    }
    await expect(page.locator('.mist-zoom-view').nth(tile)).toHaveAttribute('data-expanded', '');
  }
});

test("gestures coming much faster than the animations let the page scroll freely, then stepping resumes", async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-chromium', 'The scene only pins on wide screens');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const track = page.locator('.mist-zoom-track');
  await expect(track).toHaveAttribute('data-pinned', '');
  const step = Number(await track.getAttribute('data-step'));
  const origin = await track.evaluate(el => el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el.firstElementChild!).top));
  const at = async () => (await page.evaluate(() => scrollY) - origin) / step;
  await sceneAt(page, 0);
  await page.mouse.move(720, 450);
  // Three quick gestures: the first two step, the third rushes on and the page scrolls by all of it.
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(200);
  }
  await expect.poll(at).toBeGreaterThan(5);
  // After a pause, one gesture is one step again.
  await page.waitForTimeout(500);
  const before = Math.round(await at());
  await page.mouse.wheel(0, 600);
  await expect.poll(async () => Math.round(await at())).toBe(before + 1);
});

test("on phones the bento is a plain grid that scrolls with the page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mist-zoom-track')).not.toHaveAttribute('data-pinned', '');
  await expect(page.locator('.mist-zoom-view')).toHaveCount(0);
  await expect(page.locator('#highlights .mist-tile')).toHaveCount(4);
});

test("reduced motion keeps every image visible and still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const selector of ['.mist-cloud-back']) {
    await expect(page.locator(selector).first()).toHaveCSS('transform', 'none');
  }
  await expect(page.locator('.mist-device-badge, .mist-device-wait')).toHaveCount(0);
});
