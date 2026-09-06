import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });
test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-chromium', 'Phone interactions');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

async function storyAt(page: import('@playwright/test').Page, progress: number) {
  await page.locator('.foundation-story').evaluate((el, progress) => {
    const story = el as HTMLElement;
    const stage = story.querySelector<HTMLElement>('.foundation-stage')!;
    scrollTo(0, scrollY + story.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top)
      + (story.offsetHeight - stage.offsetHeight) * progress);
  }, progress);
  await page.waitForTimeout(650);
}

test('phone story has matching handoffs, continuous rainfall, and no scroll drift', async ({ page }) => {
  await expect(page.locator('.foundation-stage')).toHaveCSS('position', 'sticky');
  await storyAt(page, 0.1);
  await expect(page.locator('.foundation-intro')).toBeInViewport();
  await expect(page.locator('.foundation-arrival')).toHaveAttribute('inert');
  await storyAt(page, .775 / 3);
  const first = await page.locator('.foundation-intro').evaluate(el => el.getBoundingClientRect().x);
  await storyAt(page, 1.775 / 3);
  const second = await page.locator('.foundation-arrival').evaluate(el => el.getBoundingClientRect().x);
  expect(Math.abs(first - second)).toBeLessThan(2);
  await storyAt(page, .43);
  await expect(page.locator('.foundation-arrival')).not.toHaveAttribute('inert');
  await expect(page.locator('.foundation-word-rain')).toHaveAttribute('data-layout-ready', 'true');
  const card = page.locator('[data-rain-item]').nth(2);
  const before = await card.boundingBox();
  const scroll = await page.evaluate(() => scrollY);
  await page.waitForTimeout(800);
  const after = await card.boundingBox();
  expect(after!.y - before!.y).toBeGreaterThan(10);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  const layers = await page.evaluate(() => [getComputedStyle(document.querySelector('.foundation-content')!).zIndex,
    getComputedStyle(document.querySelector('.foundation-word-rain')!).zIndex].map(Number));
  expect(layers[0]).toBeGreaterThan(layers[1]);
  await storyAt(page, .8);
  await expect(page.locator('.foundation-outro')).not.toHaveAttribute('inert');
  await expect(page.locator('.foundation-goal')).toBeInViewport();
});

test('walkthrough supports touch swiping and keyboard-accessible slide controls', async ({ page }) => {
  const gallery = page.locator('.mobile-walkthrough');
  await gallery.scrollIntoViewIfNeeded();
  const images = gallery.locator('img');
  await expect(gallery.locator("[data-screenshot-slot]")).toHaveCount(4);
  await expect(images).toHaveCount(3);
  await expect.poll(() => images.evaluateAll(images => images.every(img => (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  const track = gallery.locator('.mobile-walkthrough-track');
  const rect = (await track.boundingBox())!;
  const y = Math.min(600, Math.max(160, rect.y + 90));
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y }] });
  for (const x of [275, 235, 190, 140, 90]) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await page.waitForTimeout(25);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(150);
  const last = gallery.locator('button').last();
  await last.focus();
  await page.keyboard.press('Enter');
  await expect(last).toHaveAttribute('aria-current', 'true');
  await expect(gallery.getByText('Share your Space with others', { exact: true })).toBeInViewport();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(195, y);
  await page.mouse.wheel(0, 160);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 100);
});

for (const width of [320, 390, 767]) {
  test(`mobile layout fits ${width}px with a visible hero action`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const product = page.locator('.hero-scroll-product');
    await product.scrollIntoViewIfNeeded();
    await expect(product).toHaveAttribute('data-in-view', 'true');
    const action = product.getByRole('link', { name: 'Try the web app' });
    await expect(action).toBeVisible();
    const shot = (await product.locator('.hero-scroll-shot').boundingBox())!;
    const button = (await action.boundingBox())!;
    expect(button.y).toBeGreaterThan(shot.y + shot.height);
    expect((await page.locator('.site-pinned-navbar').boundingBox())!.y).toBeGreaterThanOrEqual(12);
    await storyAt(page, .43);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(await page.locator('.foundation-word-rain').evaluate(el => el.clientHeight)).toBeGreaterThan(700);
  });
}

test('reduced motion keeps all headlines and gallery slides available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.foundation-stage')).toHaveCSS('position', 'static');
  await expect(page.locator('.foundation-word-rain')).toBeHidden();
  for (const selector of ['.foundation-intro', '.foundation-title', '.foundation-goal']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(page.locator(selector)).toBeInViewport();
  }
  await page.locator('.mobile-walkthrough').scrollIntoViewIfNeeded();
  for (const button of await page.locator('.mobile-walkthrough-controls button').all()) {
    await button.click();
    await expect(button).toHaveAttribute('aria-current', 'true');
  }
  expect(await page.locator('.hero-scroll-product').evaluate(el => getComputedStyle(el).transform)).toBe('none');
});

test('screenshots open a zoomable view and restore focus when closed', async ({ page }) => {
  const trigger = page.locator('.hero-scroll-shot .mobile-screenshot-trigger');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('img')).toBeVisible();
  await dialog.getByRole('button', { name: 'Zoom in' }).click();
  const canvas = dialog.getByRole('region', { name: 'Screenshot', exact: true });
  expect(await canvas.evaluate(el => el.scrollWidth)).toBeGreaterThan(await canvas.evaluate(el => el.clientWidth));
  await canvas.evaluate(el => el.scrollTo({ left: 250 }));
  expect(await canvas.evaluate(el => el.scrollLeft)).toBe(250);
  await dialog.getByRole('button', { name: 'Fit to screen' }).click();
  await expect.poll(() => canvas.evaluate(el => el.scrollWidth - el.clientWidth)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('mobile feature trail fills and reverses with the cloud', async ({ page }) => {
  const scene = page.locator('.feature-logo-scene');
  const move = async (fraction: number) => {
    await scene.evaluate((el, fraction) => scrollTo(0, scrollY + el.getBoundingClientRect().top - innerHeight / 2 + el.clientHeight * fraction), fraction);
    await page.waitForTimeout(600);
    return {
      trail: Number(await page.locator('[data-mobile-trail]').getAttribute('stroke-dashoffset')),
      y: await page.locator('.mobile-path-marker').evaluate(el => el.getBoundingClientRect().y + scrollY),
    };
  };
  const start = await move(.2);
  const end = await move(.7);
  expect(end.trail).toBeLessThan(start.trail);
  expect(end.y).toBeGreaterThan(start.y);
  const reverse = await move(.4);
  expect(reverse.trail).toBeGreaterThan(end.trail);
  expect(reverse.y).toBeLessThan(end.y);
  await expect(page.locator('[data-bento-card][data-mobile-active="true"]')).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.mobile-path-rail')).toBeHidden();
});
