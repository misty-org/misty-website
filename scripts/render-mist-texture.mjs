// Bake the procedural source once, rather than filtering large SVG surfaces at runtime.
// Run from the repository root: node scripts/render-mist-texture.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// The page stretches one tile to about 2,500 CSS px, so bake it at twice its design size to stay sharp.
const SCALE = 2;
const source = await readFile(new URL('../public/mist-clouds.svg', import.meta.url), 'utf8');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const data = await page.evaluate(async ({ svg, scale }) => {
    const image = new Image();
    image.src = `data:image/svg+xml;base64,${btoa(svg)}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth * scale;
    canvas.height = image.naturalHeight * scale;
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.78).split(',')[1];
  }, { svg: source, scale: SCALE });
  // Vite fingerprints this asset and invalidates it when regenerated.
  await writeFile(new URL('../src/assets/mist-clouds.webp', import.meta.url), Buffer.from(data, 'base64'));
} finally {
  await browser.close();
}
