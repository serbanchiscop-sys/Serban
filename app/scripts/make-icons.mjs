/* Rasterize the brand SVG into store/launcher source images.
 *
 *   node scripts/make-icons.mjs
 *
 * Produces, in ../store-assets/ :
 *   icon-1024.png            App Store / Play listing icon (1024×1024, opaque)
 *   icon-foreground.png      Android adaptive foreground (432×432 safe zone)
 * Then, once the native projects exist, generate every size with:
 *   npx @capacitor/assets generate --iconBackgroundColor '#1B4794' \
 *     --iconBackgroundColorDark '#0E2A5C'
 * (point it at assets/icon-only.png / icon-foreground.png — see PUBLISHING.md). */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const svg = join(here, '..', 'public', 'favicon.svg');
const out = join(here, '..', '..', 'store-assets');

await mkdir(out, { recursive: true });

// Listing icon — flat 1024, opaque (stores reject transparency on the store icon).
await sharp(svg, { density: 384 })
  .resize(1024, 1024, { fit: 'contain', background: '#1B4794' })
  .flatten({ background: '#1B4794' })
  .png()
  .toFile(join(out, 'icon-1024.png'));

// Heart-only foreground for Android adaptive icons (transparent, centered).
const heart = `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 512 512">
  <path d="M256 386s-118-76-160-152C72 178 96 118 152 118c34 0 55 21 68 39 13-18 34-39 68-39 56 0 80 60 56 116-42 76-160 152-160 152Z"
    fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
await sharp(Buffer.from(heart))
  .resize(432, 432)
  .png()
  .toFile(join(out, 'icon-foreground.png'));

console.log('Wrote store-assets/icon-1024.png and icon-foreground.png');
