import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("the Misty path follows user scrolling and never advances on its own", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("desktop-"), "Desktop pinned motion");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.feature-bento-story');
  for (const progress of [0.3, 0.4, 0.7, 0.9]) {
    await track.evaluate((el, value) => {
      const rect = el.getBoundingClientRect();
      scrollTo(0, scrollY + rect.top + value * (rect.height - innerHeight));
    }, progress);
    await page.waitForTimeout(800);
    for (const delta of [40, -20]) {
      const before = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(180);
      expect(await page.evaluate(() => scrollY)).toBeCloseTo(before + delta, 0);
      await page.waitForTimeout(800);
      expect(await page.evaluate(() => scrollY)).toBeCloseTo(before + delta, 0);
      await page.waitForTimeout(300);
      const settled = await track.locator('#feature-bento-progress-mask path').getAttribute('stroke-dashoffset');
      await page.waitForTimeout(300);
      expect(await track.locator('#feature-bento-progress-mask path').getAttribute('stroke-dashoffset')).toBe(settled);
    }
  }
});

test("the hero continues from the first gesture without waiting for scrolling to stop", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("desktop-"), "Desktop pinned motion");
  await page.goto("/");
  await page.mouse.wheel(0, 80);
  await page.waitForTimeout(120);
  const first = await page.evaluate(() => scrollY);
  expect(first).toBeGreaterThan(90);
  await page.waitForTimeout(120);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(first);
  await expect.poll(() => page.locator('.hero-scroll-layout').evaluate(el =>
    Number((el as HTMLElement).style.getPropertyValue('--hero-product-scale')))).toBeCloseTo(1, 3);
  await expect(page.locator('.hero-scroll-copy')).toHaveAttribute('inert');
  await expect(page.locator('.hero-scroll-product')).not.toHaveAttribute('inert');
});

test("reversing redirects the hero immediately and Escape stops the follow-through", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("desktop-"), "Desktop pinned motion");
  await page.goto("/");
  await page.mouse.wheel(0, 80);
  await page.waitForTimeout(350);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, -20);
  await page.waitForTimeout(120);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(before - 20);
  await page.keyboard.press('Escape');
  const stopped = await page.evaluate(() => scrollY);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => scrollY)).toBe(stopped);
});

test("embedded browser environments disable scroll continuation to eliminate jitter", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("desktop-"), "Desktop pinned motion");
  await page.addInitScript(() => {
    (window as unknown as Record<string, unknown>).__MISTY_APP_SHORTCUTS__ = new Map();
  });
  await page.goto("/");
  await page.mouse.wheel(0, 80);
  await page.waitForTimeout(250);
  const position = await page.evaluate(() => scrollY);
  // Without scroll continuation auto-advancing, scrollY only reflects the direct wheel delta (~80px),
  // rather than continuing to auto-scroll through the hero track.
  expect(position).toBeLessThan(120);
});

test("mobile and reduced motion keep all showcase panels available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator('[data-bento-card]')).toHaveCount(6);
  for (const card of await page.locator('[data-bento-card]').all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const section of ['#how-it-works', '#features']) {
  test(`${section} heading scrolls directly into content with gentle edge scaling`, async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("desktop-"), "Desktop scrolling");
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const intro = page.locator(`${section} > .chapter-intro`);
    await intro.evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 100));
    await page.waitForTimeout(1000);
    const copy = intro.locator('.chapter-intro-copy');
    const initial = await copy.boundingBox();
    expect(initial!.x + initial!.width / 2).toBeCloseTo(720, 0);
    expect(await intro.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const copy = el.querySelector<HTMLElement>('.chapter-intro-copy')!;
      return rect.height - copy.offsetHeight;
    })).toBeLessThanOrEqual(150);
    for (const delta of [40, 160, -120, -80]) {
      const before = await page.evaluate(() => scrollY);
      const box = await copy.boundingBox();
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(300);
      expect(await page.evaluate(() => scrollY)).toBeCloseTo(before + delta, 0);
      const after = await copy.boundingBox();
      expect(after!.y + after!.height / 2).toBeCloseTo(box!.y + box!.height / 2 - delta, 0);
      expect(after!.x + after!.width / 2).toBeCloseTo(720, 0);
      const scale = await copy.evaluate(el => Number(getComputedStyle(el).scale));
      expect(scale).toBeGreaterThanOrEqual(0.9);
      expect(scale).toBeLessThanOrEqual(1);
      expect(await copy.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    }
    const track = page.locator(`${section} > ${section === '#features' ? '.feature-bento-story' : '.pin-track'}`);
    const gap = await track.evaluate(el => el.getBoundingClientRect().top - el.previousElementSibling!.getBoundingClientRect().bottom);
    expect(gap).toBeCloseTo(0, 0);
    expect(await track.locator('.chapter-intro').count()).toBe(0);
    // Scrolling the title away brings the already-visible first content in.
    await track.evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 100));
    await page.waitForTimeout(300);
    const content = track.locator(section === '#features' ? '.feature-bento-stage-inner' : '.pin-scene');
    expect(await content.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    expect(await copy.evaluate(el => Number(getComputedStyle(el).scale))).toBeGreaterThanOrEqual(0.9);
  });
}

test("walkthrough fades follow scroll position and reverse without moving the panels", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("desktop-"), "Desktop scrolling");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  // Measure the track after the route entrance stops translating its ancestor.
  await page.locator('.page-transition').evaluate(el =>
    Promise.all(el.getAnimations().map(animation => animation.finished)));
  const track = page.locator('.pin-track');
  const media = track.locator('.pin-scene > div:nth-child(2) .pin-beat');
  // Stop halfway through each of the original crossfades, then reverse it.
  for (const panel of [0, 1, 2, 3, 4]) {
    await track.evaluate((el, index) => {
      const rect = el.getBoundingClientRect();
      scrollTo(0, scrollY + rect.top + (index + 0.9) / 6 * (rect.height - innerHeight));
    }, panel);
    await page.waitForTimeout(600);
    const incoming = media.nth(panel + 1);
    const opacity = () => incoming.evaluate(el => Number(getComputedStyle(el).opacity));
    expect(await opacity()).toBeGreaterThan(0.45);
    expect(await opacity()).toBeLessThan(0.55);
    const start = await page.evaluate(() => scrollY);
    await page.waitForTimeout(350);
    expect(await page.evaluate(() => scrollY)).toBe(start);
    expect(await incoming.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42)).toBe(0);
    const before = await opacity();
    await page.mouse.wheel(0, 8);
    await page.waitForTimeout(350);
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(start + 8, 0);
    expect(await opacity()).toBeGreaterThan(before);
    await page.mouse.wheel(0, -16);
    await page.waitForTimeout(350);
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(start - 8, 0);
    expect(await opacity()).toBeLessThan(before);
    const bars = await track.locator('[data-segment-fill]').evaluateAll(els => els.map(el => Number.parseFloat((el as HTMLElement).style.width)));
    expect(bars.slice(0, panel + 1)).toEqual(Array(panel + 1).fill(100));
    expect(bars[panel + 1]).toBeGreaterThan(0);
    expect(bars[panel + 1]).toBeLessThan(10);
    expect(bars.slice(panel + 2)).toEqual(Array(2 - panel).fill(0));
  }
});

test("walkthrough accepts small and large scrolling through both boundaries without capture", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("desktop-"), "Desktop scrolling");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.pin-track');
  for (const progress of [0, 0.5, 1]) {
    await track.evaluate((el, value) => {
      const rect = el.getBoundingClientRect();
      scrollTo(0, scrollY + rect.top + value * (rect.height - innerHeight));
    }, progress);
    await page.waitForTimeout(400);
    for (const delta of [1, 120, -1, -120, 1800, -1800]) {
      const before = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(350);
      const after = await page.evaluate(() => scrollY);
      // Firefox caps a large native wheel step to approximately one viewport.
      // Preserve the browser's behavior; small input must still track exactly.
      if (Math.abs(delta) < 1000) {
        expect(after).toBeCloseTo(before + delta, 0);
      } else {
        expect(Math.sign(delta) * (after - before)).toBeGreaterThan(500);
        expect(Math.abs(after - before)).toBeLessThanOrEqual(Math.abs(delta) + 1);
      }
      await page.waitForTimeout(200);
      expect(await page.evaluate(() => scrollY)).toBeCloseTo(after, 0);
    }
  }
});

test("the page uses only non-interactive viewport edge fades", async ({ page }) => {
  await page.goto('/');
  const styles = await page.locator('.home-scroll-edge-fade').evaluate(el =>
    ['::before', '::after'].map(pseudo => {
      const style = getComputedStyle(el, pseudo);
      return { position: style.position, pointerEvents: style.pointerEvents, background: style.backgroundImage };
    }));
  for (const style of styles) {
    expect(style.position).toBe('fixed');
    expect(style.pointerEvents).toBe('none');
    expect(style.background).toContain('linear-gradient');
  }
  await expect(page.locator('.layered-story')).toHaveCount(0);
  expect(await page.locator('.foundation-section').evaluate(el => Number.parseFloat(getComputedStyle(el).marginTop))).toBeGreaterThanOrEqual(0);
});

test("the path camera keeps Misty visible beneath navigation through every row and reversal", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Desktop path camera');
  test.setTimeout(60_000);
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.feature-bento-story');
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 1024, height: 600 }]) {
    await page.setViewportSize(viewport);
    for (const progress of [0, 0.1, 0.25, 0.4, 0.5, 0.65, 0.8, 1, 0.65, 0.4, 0.1]) {
      await track.evaluate((el, value) => {
        const rect = el.getBoundingClientRect();
        scrollTo(0, scrollY + rect.top + value * (rect.height - innerHeight));
      }, progress);
      await page.waitForTimeout(450);
      const camera = await track.evaluate(el => {
        const sprite = el.querySelector('.feature-bento-sprite-core')!.getBoundingClientRect();
        const stage = el.querySelector('.feature-bento-stage')!.getBoundingClientRect();
        const fade = document.querySelector('.home-scroll-edge-fade')!;
        const edgeDepth = Number.parseFloat(getComputedStyle(fade, '::after').height);
        const navHeight = Number.parseFloat(getComputedStyle(fade, '::before').height) - edgeDepth;
        const card = el.querySelector('[data-active="true"]')!.getBoundingClientRect();
        return { top: sprite.top, bottom: sprite.bottom, left: sprite.left, right: sprite.right,
          stageTop: stage.top, stageBottom: stage.bottom, viewportWidth: innerWidth,
          clearTopGap: stage.top - navHeight,
          clearBottomGap: innerHeight - stage.bottom,
          fadeTop: navHeight + edgeDepth * 0.75, fadeBottom: innerHeight - edgeDepth * 0.75,
          cardTopGap: card.top - stage.top, cardBottomGap: stage.bottom - card.bottom };
      });
      expect(camera.top).toBeGreaterThan(camera.stageTop + 12);
      expect(camera.bottom).toBeLessThan(camera.stageBottom - 12);
      expect(camera.left).toBeGreaterThan(0);
      expect(camera.right).toBeLessThan(camera.viewportWidth);
      expect(camera.clearTopGap).toBeCloseTo(0, 0);
      if (progress >= 0.5) expect(camera.top).toBeGreaterThan(camera.fadeTop);
      expect(camera.clearBottomGap).toBeCloseTo(0, 0);
      expect(camera.bottom).toBeLessThan(camera.fadeBottom);
      if ([0, 1].includes(progress)) {
        expect(camera.cardTopGap).toBeGreaterThan(0);
        expect(camera.cardBottomGap).toBeGreaterThan(0);
        // The final camera may shift slightly to keep the larger row and cloud clear.
        if (progress === 0) expect(camera.cardTopGap).toBeLessThan(130);
      }
    }
  }
});


test("walkthrough progress fills continuously and drains on small reverse scrolls", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Desktop progress bars');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.pin-track');
  const fills = () => track.locator('[data-segment-fill]').evaluateAll(els => els.map(el => Number.parseFloat((el as HTMLElement).style.width)));
  const place = async (progress: number) => {
    await track.evaluate((el, value) => {
      const rect = el.getBoundingClientRect();
      scrollTo(0, scrollY + rect.top + value * (rect.height - innerHeight));
    }, progress);
    await page.waitForTimeout(500);
  };
  await place(0);
  expect(await fills()).toEqual([0, 0, 0, 0, 0, 0]);
  for (const [index, progress] of [0, 1, 2, 3, 4, 5].map(index => (index + 0.3) / 6).entries()) {
    await place(progress);
    const before = await fills();
    expect(before[index]).toBeGreaterThan(20);
    expect(before[index]).toBeLessThan(80);
    expect(before.filter(value => value > 0 && value < 100)).toHaveLength(1);
    await page.mouse.wheel(0, 4);
    await page.waitForTimeout(350);
    expect((await fills())[index]).toBeGreaterThan(before[index]);
    await page.mouse.wheel(0, -8);
    await page.waitForTimeout(350);
    const reversed = (await fills())[index];
    expect(reversed).toBeLessThan(before[index]);
    await page.waitForTimeout(400);
    expect((await fills())[index]).toBeCloseTo(reversed, 1);
  }
  await place(1);
  expect(await fills()).toEqual([100, 100, 100, 100, 100, 100]);
});


test("text grows out of taller edge fades and recedes symmetrically", async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const copy = page.locator('#how-it-works .chapter-intro-copy');
  const fade = page.locator('.home-scroll-edge-fade');
  const geometry = await fade.evaluate(el => {
    const depth = Number.parseFloat(getComputedStyle(el, '::after').height);
    const topInset = Number.parseFloat(getComputedStyle(el, '::before').height) - depth;
    return { depth, topInset, height: innerHeight };
  });
  expect(geometry.depth).toBeCloseTo(Math.max(120, Math.min(240, geometry.height * 0.21)), 0);
  const placeCenter = async (center: number) => {
    await copy.evaluate((el, y) => {
      const rect = el.getBoundingClientRect();
      scrollTo(0, scrollY + rect.top + rect.height / 2 - y);
    }, center);
    await page.waitForTimeout(150);
    return copy.evaluate(el => Number(getComputedStyle(el).scale));
  };
  const lowerEdge = geometry.height - geometry.depth / 2;
  expect(await placeCenter(lowerEdge)).toBeCloseTo(0.95, 2);
  expect(await placeCenter(geometry.height / 2)).toBe(1);
  expect(await placeCenter(geometry.topInset + geometry.depth / 2)).toBeCloseTo(0.95, 2);
  expect(await placeCenter(geometry.height / 2)).toBe(1);
  expect(await placeCenter(lowerEdge)).toBeCloseTo(0.95, 2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(copy).toHaveCSS('scale', 'none');
});


test("content keeps its size while passing through the viewport fades", async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const group = page.locator('#resources');
  for (const offset of [-250, 0, 250, 500, 250, 0]) {
    await group.evaluate((el, offset) => {
      scrollTo(0, scrollY + el.getBoundingClientRect().top + offset);
    }, offset);
    await page.waitForTimeout(100);
    await expect(group).toHaveCSS('scale', 'none');
    for (const row of await group.locator('[data-resource-preview]').all()) {
      await expect(row).toHaveCSS('scale', 'none');
      await expect(row).toHaveCSS('opacity', '1');
    }
  }
});

test("the showcase uses only the shared viewport fades", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Pinned showcase viewport');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.feature-bento-story');
  const scene = track.locator('.feature-bento-stage-inner');
  await expect(scene).toHaveCSS('scale', 'none');
  const mask = await scene.evaluate(el => getComputedStyle(el).maskImage);
  expect(mask).toBe('none');
  await expect(page.locator('.home-scroll-edge-fade')).toHaveCount(1);
  for (const pseudo of ['::before', '::after']) {
    expect(await page.locator('.home-scroll-edge-fade').evaluate((el, pseudo) =>
      getComputedStyle(el, pseudo).backgroundImage, pseudo)).toContain('linear-gradient');
  }
  for (const target of ['enter', 'center', 'exit', 'center']) {
    await track.evaluate((el, target) => {
      const rect = el.getBoundingClientRect();
      const scrollTop = scrollY + rect.top;
      scrollTo(0, target === 'enter' ? scrollTop - innerHeight + 140
        : target === 'exit' ? scrollTop + rect.height - 160
        : scrollTop + 100);
    }, target);
    await page.waitForTimeout(450);
    const sizes = await scene.evaluate(el => {
      const root = el as HTMLElement;
      const card = el.querySelector<HTMLElement>('[data-bento-card]')!;
      const rail = el.querySelector<SVGSVGElement>('.feature-logo-route')!;
      const cloud = el.querySelector<HTMLElement>('.feature-bento-sprite-core')!;
      return {
        scale: getComputedStyle(root).scale,
        card: card.getBoundingClientRect().width / card.offsetWidth,
        rail: rail.getBoundingClientRect().width / rail.clientWidth,
        cloud: cloud.getBoundingClientRect().width / cloud.offsetWidth,
        individualScale: getComputedStyle(card).scale,
      };
    });
    expect(sizes.scale).toBe('none');
    expect(sizes.card).toBeCloseTo(1, 2);
    expect(sizes.rail).toBeCloseTo(1, 2);
    expect(sizes.cloud).toBeCloseTo(1, 2);
    expect(sizes.individualScale).toBe('none');
  }
});


test("the camera drifts during horizontal travel and reverses with input", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Pinned camera movement');
  await page.goto('/');
  const track = page.locator('.feature-bento-story');
  const camera = () => track.locator('.feature-logo-scene').evaluate(el =>
    Number.parseFloat((el as HTMLElement).style.getPropertyValue('--feature-camera-y')));
  for (const progress of [0.1, 0.2, 0.4, 0.5, 0.7, 0.85]) {
    await track.evaluate((el, progress) => {
      const rect = el.getBoundingClientRect();
      scrollTo(0, scrollY + rect.top + progress * (rect.height - innerHeight));
    }, progress);
    await page.waitForTimeout(850);
    const before = await camera();
    await page.mouse.wheel(0, 16);
    await page.waitForTimeout(350);
    const forward = await camera();
    expect(before - forward).toBeGreaterThan(0.01);
    expect(before - forward).toBeLessThan(40);
    await page.mouse.wheel(0, -16);
    await page.waitForTimeout(400);
    await expect.poll(async () => Math.abs(await camera() - before)).toBeLessThan(1);
  }
});


test("the first showcase row starts close to the top when its viewport pins", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Pinned viewport framing');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.feature-bento-story');
  for (const viewport of [{width: 1440, height: 900}, {width: 1280, height: 720}, {width: 1920, height: 1080}]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(150);
    await track.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const inset = Number.parseFloat(getComputedStyle(el.querySelector('.feature-bento-stage')!).top);
      scrollTo(0, scrollY + rect.top - inset);
    });
    await page.waitForTimeout(500);
    const geometry = await track.evaluate(el => {
      const stage = el.querySelector('.feature-bento-stage')!.getBoundingClientRect();
      const card = el.querySelector('[data-bento-card]')!.getBoundingClientRect();
      return {top: card.top - stage.top, bottom: stage.bottom - card.bottom};
    });
    expect(geometry.top).toBeGreaterThan(95);
    expect(geometry.top).toBeLessThan(130);
  }
});


test("foundation centers only its headline and starts the light offscreen", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Pinned reading sequence');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.foundation-story');
  for (const viewport of [{width:1440, height:900}, {width:1024, height:720}]) {
    await page.setViewportSize(viewport);
    for (const progress of [0, 0.35, 0.65, 0.9, 0]) {
      const position = () => track.evaluate((el, progress) => {
        const stage = el.querySelector<HTMLElement>('.foundation-stage')!;
        scrollTo(0, scrollY + el.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top) + (0.48 + 0.52 * progress) * 1.8 * innerHeight * parseFloat(getComputedStyle(el).getPropertyValue("--home-scroll-travel-scale") || "1"));
      }, progress);
      await position();
      await page.waitForTimeout(450);
      await position();
      await expect.poll(() => page.locator('.foundation-content').evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--foundation-light-position')))).toBeCloseTo(-20 + 140 * progress, 0);
      await expect(page.locator('.foundation-content p')).toHaveCount(0);
      await expect(page.locator('.foundation-content button')).toHaveCount(0);
      const geometry = await page.locator('.foundation-content').evaluate(el => {
        const rect = el.getBoundingClientRect();
        const stage = el.parentElement!.getBoundingClientRect();
        const fade = Math.min(240, Math.max(120, innerHeight * 0.21)) * 0.75;
        const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-nav-height'));
        return {center: rect.x + rect.width / 2, top: rect.top, bottom: rect.bottom,
          stageCenter: stage.y + stage.height / 2, contentCenter: rect.y + rect.height / 2, fade, nav};
      });
      expect(geometry.center).toBeCloseTo(viewport.width / 2, 0);
      expect(geometry.contentCenter).toBeCloseTo(geometry.stageCenter, 0);
      expect(geometry.top).toBeGreaterThan(geometry.fade + 80);
      expect(geometry.bottom).toBeLessThan(viewport.height - geometry.fade);
      await expect(page.locator('.foundation-title-light')).toHaveCSS('background-attachment', 'scroll');
      expect(await page.locator('.foundation-title-light').evaluate(el => getComputedStyle(el).backgroundImage)).toContain('linear-gradient');
    }
  }
});

test("foundation gives both horizontal handoffs the same timing without an empty pause", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Pinned horizontal sequence');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.foundation-story');
  for (const viewport of [{width:1440, height:900}, {width:1024, height:720}]) {
    await page.setViewportSize(viewport);
    const motions: {outgoing: number; incoming: number}[][] = [];
    for (const start of [0.06, 1]) {
      const samples = [];
      for (const phase of [0, 0.25, 0.5, 0.75, 1, 0.5, 0]) {
        await track.evaluate((el, position) => {
          const stage = el.querySelector<HTMLElement>('.foundation-stage')!;
          scrollTo(0, scrollY + el.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top) + position * 1.8 * innerHeight * parseFloat(getComputedStyle(el).getPropertyValue("--home-scroll-travel-scale") || "1"));
        }, start + 0.42 * phase);
        await page.waitForTimeout(700);
        const geometry = await track.evaluate((el, isGoal) => {
          const outgoing = el.querySelector(isGoal ? '.foundation-title' : '.foundation-intro p')!.getBoundingClientRect();
          const incoming = el.querySelector(isGoal ? '.foundation-goal' : '.foundation-title')!.getBoundingClientRect();
          return {outgoing: outgoing.x + outgoing.width / 2, incoming: incoming.x + incoming.width / 2,
            yDelta: outgoing.y + outgoing.height / 2 - incoming.y - incoming.height / 2};
        }, start === 1);
        expect(Math.abs(geometry.yDelta)).toBeLessThan(1);
        // One continuous horizontal handoff, with exactly one viewport between centers.
        expect(geometry.incoming - geometry.outgoing).toBeCloseTo(viewport.width, 0);
        if (phase === 0) expect(geometry.outgoing).toBeCloseTo(viewport.width / 2, 0);
        if (phase === 1) expect(geometry.incoming).toBeCloseTo(viewport.width / 2, 0);
        samples.push(geometry);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      motions.push(samples);
    }
    for (let i = 0; i < motions[0].length; i++) {
      expect(Math.abs(motions[0][i].outgoing - motions[1][i].outgoing)).toBeLessThan(4);
      expect(Math.abs(motions[0][i].incoming - motions[1][i].incoming)).toBeLessThan(4);
    }
  }
});

test("foundation headline stays readable without interactive controls with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.foundation-stage')).toHaveCSS('position', 'static');
  await page.locator('.foundation-title').scrollIntoViewIfNeeded();
  await expect(page.locator('.foundation-title')).toBeInViewport();
  await expect(page.locator('.foundation-title-light')).toHaveCSS('background-image', 'none');
  await page.locator('.foundation-goal').scrollIntoViewIfNeeded();
  await expect(page.locator('.foundation-goal')).toBeInViewport();
  await expect(page.locator('.foundation-outro')).not.toHaveAttribute('inert');
  await expect(page.locator('.foundation-content p, .foundation-content button')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("the path keeps moving during sustained scroll input and settles after reversal", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Pinned path interaction');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.feature-bento-story');
  await track.evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top + (el.clientHeight - innerHeight) * 0.24));
  await page.waitForTimeout(700);
  const samples = await track.evaluate(async el => {
    const path = el.querySelector('#feature-bento-progress-mask path')!;
    const read = () => {
      const sprite = getComputedStyle(el.querySelector('.feature-bento-sprite')!);
      const scene = el.querySelector<HTMLElement>('.feature-logo-scene')!;
      return { x: parseFloat(sprite.left), y: parseFloat(sprite.top),
        camera: parseFloat(scene.style.getPropertyValue('--feature-camera-y')),
        rail: 1 - Number(path.getAttribute('stroke-dashoffset')) / Number(path.getAttribute('stroke-dasharray')!.split(' ')[0]) };
    };
    const forward = [read()];
    for (let i = 0; i < 36; i++) {
      scrollBy(0, 6);
      await new Promise(requestAnimationFrame);
      forward.push(read());
    }
    const reverse = [read()];
    for (let i = 0; i < 36; i++) {
      scrollBy(0, -6);
      await new Promise(requestAnimationFrame);
      reverse.push(read());
    }
    return { forward, reverse };
  });
  // Check rendered movement: the deliberately slower descents cover less SVG
  // distance now, but must still respond during input and never jump afterward.
  const distance = (a: {x: number; y: number}, b: {x: number; y: number}) => Math.hypot(a.x - b.x, a.y - b.y);
  expect(distance(samples.forward[8], samples.forward[0])).toBeGreaterThan(2);
  expect(distance(samples.forward[24], samples.forward[12])).toBeGreaterThan(6);
  expect(distance(samples.reverse[12], samples.reverse[30])).toBeGreaterThan(6);
  expect(samples.reverse[30].rail).toBeLessThan(samples.reverse[12].rail);
  for (const samplesInDirection of [samples.forward, samples.reverse]) {
    for (let i = 1; i < samplesInDirection.length; i++) {
      expect(distance(samplesInDirection[i], samplesInDirection[i - 1])).toBeLessThan(15);
      expect(Math.abs(samplesInDirection[i].camera - samplesInDirection[i - 1].camera)).toBeLessThan(8);
    }
  }
  await page.waitForTimeout(800);
  const path = track.locator('#feature-bento-progress-mask path');
  const settled = await path.getAttribute('stroke-dashoffset');
  await page.waitForTimeout(300);
  expect(await path.getAttribute('stroke-dashoffset')).toBe(settled);
});


test("foundation slides the previous content left while screenshot rain runs independently", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Horizontal desktop handoff');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator('.foundation-story');
  const seek = async (progress: number) => {
    const move = () => track.evaluate((el, value) => {
      const stage = el.querySelector<HTMLElement>('.foundation-stage')!;
      scrollTo(0, scrollY + el.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top) + value * 1.8 * innerHeight * parseFloat(getComputedStyle(el).getPropertyValue("--home-scroll-travel-scale") || "1"));
    }, progress);
    await move();
    await page.waitForTimeout(500);
    await move();
    await page.waitForTimeout(150);
  };
  const read = () => page.locator('.foundation-stage').evaluate(el => {
    const intro = el.querySelector('.foundation-intro')!.getBoundingClientRect();
    const content = el.querySelector('.foundation-content')!.getBoundingClientRect();
    return {introCenter: intro.x + intro.width / 2, contentCenter: content.x + content.width / 2,
      previous: document.querySelector('#features')!.getBoundingClientRect().x,
      word: getComputedStyle(el.querySelector('.foundation-rain-screenshot')!).transform,
      light: parseFloat(getComputedStyle(el).getPropertyValue('--foundation-light-position')),
      overflow: document.documentElement.scrollWidth > innerWidth};
  });
  await seek(0);
  const start = await read();
  expect(start.introCenter).toBeCloseTo(720, 0);
  expect(start.contentCenter).toBeGreaterThan(1440);
  await expect(page.locator('.foundation-arrival')).toHaveAttribute('inert');
  await seek(0.27);
  const middle = await read();
  expect(middle.introCenter).toBeLessThan(start.introCenter - 600);
  expect(middle.contentCenter).toBeGreaterThan(1300);
  expect(middle.contentCenter).toBeLessThan(1550);
  expect(middle.previous).toBeLessThan(start.previous - 600);
  expect(middle.light).toBe(-20);
  expect(middle.overflow).toBe(false);
  await seek(0.55);
  const arrived = await read();
  expect(arrived.contentCenter).toBeCloseTo(720, 0);
  expect(arrived.introCenter).toBeLessThan(0);
  await expect(page.locator('.foundation-arrival')).not.toHaveAttribute('inert');
  const rain = page.locator('.foundation-word-rain');
  await expect(rain.locator('span')).toHaveCount(0);
  await expect(rain.locator('figure')).toHaveCount(8);
  await expect(rain.locator('figure').first()).toHaveCSS('animation-play-state', 'running');
  expect(await page.locator('.foundation-title').evaluate(el => getComputedStyle(el, '::before').content)).toBe('none');
  const beforeY = await page.evaluate(() => scrollY);
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => scrollY)).toBe(beforeY);
  const afterIdle = await read();
  expect(afterIdle.word).not.toBe(arrived.word);
  expect(afterIdle.contentCenter).toBeCloseTo(arrived.contentCenter, 0);
  const y = (matrix: string) => Number(matrix.split(',')[5].replace(')', ''));
  expect(y(afterIdle.word)).toBeGreaterThan(y(arrived.word));
  await seek(0.9);
  const later = await read();
  await seek(0.55);
  expect(y((await read()).word)).toBeGreaterThan(y(later.word));
  await seek(0);
  expect((await read()).previous).toBeCloseTo(start.previous, 0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.foundation-word-rain')).toBeHidden();
  await expect(page.locator('.foundation-stage')).toHaveCSS('position', 'static');
});

test("falling screenshots keep a clear gap throughout their travel and after resizing", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop-'), 'Desktop word rain');
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const rain = page.locator('.foundation-word-rain');
  for (const viewport of [{width:1440,height:900}, {width:1024,height:720}, {width:1920,height:1080}]) {
    await page.setViewportSize(viewport);
    await page.locator('.foundation-story').evaluate(el => {
      const stage = el.querySelector<HTMLElement>('.foundation-stage')!;
      scrollTo(0, scrollY + el.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top) + .4 * ((el as HTMLElement).offsetHeight - stage.offsetHeight));
    });
    await page.waitForTimeout(400);
    await expect(rain).toHaveAttribute('data-layout-ready', 'true');
    const collisions = await rain.evaluate(el => {
      const animations = el.getAnimations({ subtree: true });
      animations.forEach(animation => animation.pause());
      const words = Array.from(el.querySelectorAll('[data-rain-item]'));
      const collisions: string[] = [];
      for (let step = 0; step <= 100; step++) {
        animations.forEach(animation => { animation.currentTime = step * 2500; });
        const bounds = words.map(word => word.getBoundingClientRect());
        for (let i = 0; i < bounds.length; i++) {
          for (let j = i + 1; j < bounds.length; j++) {
            const a = bounds[i], b = bounds[j];
            const gap = 24;
            if (a.left < b.right + gap && a.right + gap > b.left && a.top < b.bottom + gap && a.bottom + gap > b.top) {
              collisions.push(`${words[i].textContent}/${words[j].textContent} at ${step}%`);
            }
          }
        }
      }
      animations.forEach(animation => animation.play());
      return collisions;
    });
    expect(collisions.slice(0, 10)).toEqual([]);
    expect(await rain.locator('span').count()).toBe(0);
    await expect(rain.locator('.foundation-rain-screenshot')).toHaveCount(8);
    expect(await rain.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  }
});
