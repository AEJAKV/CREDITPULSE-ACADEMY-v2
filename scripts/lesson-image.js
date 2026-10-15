#!/usr/bin/env node
/*
 * Convert a source image (png, jpg, webp, avif, tiff, gif) into a lesson-ready .webp.
 *
 * Usage:
 *   node scripts/lesson-image.js <source> <destination.webp>
 *
 * Example:
 *   node scripts/lesson-image.js "C:/Users/ASUS TUF/Downloads/img 1.png" \
 *     public/images/credit-mastery/04-platinum/credit-12/credit12-image-1.webp
 *
 * Scales the longest edge down to 1672px (never up), keeps the aspect ratio,
 * strips metadata and writes WebP at quality 82. The source file is left untouched.
 * See docs/lesson-images-guide.md.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_EDGE = 1672;
const QUALITY = 82;

async function main() {
  const [src, dest] = process.argv.slice(2);
  if (!src || !dest) {
    console.error('Usage: node scripts/lesson-image.js <source> <destination.webp>');
    process.exit(1);
  }
  if (!dest.toLowerCase().endsWith('.webp')) {
    console.error('Destination must end in .webp');
    process.exit(1);
  }
  if (path.resolve(src) === path.resolve(dest)) {
    console.error('Destination must differ from the source; the source is never overwritten.');
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const info = await sharp(src)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`${dest}  ${info.width}x${info.height}  ${kb}KB`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
