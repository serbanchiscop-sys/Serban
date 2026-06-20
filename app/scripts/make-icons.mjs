/* Generate every store / launcher source image from the brand SVG.
 *
 *   node scripts/make-icons.mjs
 *
 * Writes ../store-assets/  (for the store listings):
 *   icon-1024.png          App Store / Play listing icon (opaque)
 *   feature-graphic.png    Google Play feature graphic (1024×500)
 * and  ./assets/  (consumed by `npx @capacitor/assets generate`):
 *   icon-only.png          full tile (1024)
 *   icon-foreground.png    heart only, transparent (for adaptive icons)
 *   icon-background.png    solid brand background (1024)
 *   splash.png / splash-dark.png  launch screens (2732²)
 *
 * After the native projects exist:
 *   npx @capacitor/assets generate --iconBackgroundColor '#1B4794' \
 *     --iconBackgroundColorDark '#0E2A5C' --splashBackgroundColor '#1B4794'
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const svg = join(here, '..', 'public', 'favicon.svg');
const store = join(here, '..', '..', 'store-assets');
const assets = join(here, '..', 'assets');
await mkdir(store, { recursive: true });
await mkdir(assets, { recursive: true });

const HEART = (size, stroke = 30) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">` +
  `<path d="M256 386s-118-76-160-152C72 178 96 118 152 118c34 0 55 21 68 39 13-18 34-39 68-39 56 0 80 60 56 116-42 76-160 152-160 152Z"` +
  ` fill="none" stroke="#fff" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

const tile1024 = await sharp(svg, { density: 384 }).resize(1024, 1024, { fit: 'contain', background: '#1B4794' }).png().toBuffer();

// Listing icon + full tile (opaque — stores reject transparency on the icon).
await sharp(tile1024).flatten({ background: '#1B4794' }).png().toFile(join(store, 'icon-1024.png'));
await sharp(tile1024).flatten({ background: '#1B4794' }).png().toFile(join(assets, 'icon-only.png'));

// Android adaptive icon: transparent foreground + solid background.
await sharp(HEART(432)).resize(432, 432).png().toFile(join(store, 'icon-foreground.png'));
await sharp(HEART(720)).resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(join(assets, 'icon-foreground.png'));
await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#1B4794' } }).png().toFile(join(assets, 'icon-background.png'));

// Splash screens (centered heart on brand background).
for (const [name, bg] of [['splash.png', '#1B4794'], ['splash-dark.png', '#0E2A5C']]) {
  const heart = await sharp(HEART(700)).resize(700, 700, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 2732, height: 2732, channels: 3, background: bg } })
    .composite([{ input: heart }]).png().toFile(join(assets, name));
}

// Google Play feature graphic (1024×500): brand gradient + heart + wordmark.
const feature = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500">` +
  `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="#1B4794"/><stop offset="1" stop-color="#0E2A5C"/></linearGradient></defs>` +
  `<rect width="1024" height="500" fill="url(#g)"/>` +
  `<circle cx="880" cy="60" r="220" fill="#4CA8E4" opacity="0.18"/>` +
  `<path d="M150 300s-70-45-95-90C40 178 55 142 88 142c20 0 33 13 41 24 8-11 21-24 41-24 33 0 48 36 33 68-25 45-95 90-95 90Z" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<text x="250" y="235" font-family="Montserrat, Arial, sans-serif" font-size="58" font-weight="800" fill="#fff">Family Moments AI</text>` +
  `<text x="252" y="290" font-family="Montserrat, Arial, sans-serif" font-size="30" fill="#9FD0F2">The AI memory book for families</text>` +
  `</svg>`);
await sharp(feature).png().toFile(join(store, 'feature-graphic.png'));

console.log('Wrote store-assets/{icon-1024,feature-graphic,icon-foreground}.png and assets/* for @capacitor/assets');
