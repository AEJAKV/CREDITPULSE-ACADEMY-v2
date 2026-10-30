import { openSync, readSync, closeSync } from 'node:fs';
import path from 'node:path';
// Width ÷ height of a photo under /public, read from the file header (WebP, PNG or JPEG).
// Server-only. Returns undefined when the file is missing or the format is unknown.
const cache = new Map<string, number | undefined>();
export function imageRatio(src: string): number | undefined {
  if (cache.has(src)) return cache.get(src);
  let ratio: number | undefined;
  try {
    const fd = openSync(path.join(process.cwd(), 'public', src), 'r');
    const head = Buffer.alloc(64 * 1024);
    const length = readSync(fd, head, 0, head.length, 0);
    closeSync(fd);
    const size = dimensions(head.subarray(0, length));
    if (size && size.width > 0 && size.height > 0) ratio = size.width / size.height;
  } catch {
    ratio = undefined;
  }
  cache.set(src, ratio);
  return ratio;
}
function dimensions(b: Buffer): { width: number; height: number } | undefined {
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X')
      return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ')
      return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L')
      return {
        width: 1 + (((b[22] & 0x3f) << 8) | b[21]),
        height: 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6)),
      };
    return undefined;
  }
  if (b.readUInt32BE(0) === 0x89504e47)
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return undefined;
      const marker = b[i + 1];
      // Start-of-frame markers carry the size; C4, C8 and CC are other segment types.
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return undefined;
}
