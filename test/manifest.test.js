import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(buf) {
  // Check PNG signature
  assert.deepEqual(
    [...buf.subarray(0, 8)],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    'Not a valid PNG file'
  );

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  let offset = 8;
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  assert.equal(bitDepth, 8, 'Expected 8-bit PNG');
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  assert.ok(channels === 3 || channels === 4, `Unsupported colorType ${colorType}`);

  const compressed = Buffer.concat(idatChunks);
  const raw = inflateSync(compressed);
  const stride = width * channels;
  const unfilter = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filterType = raw[y * (stride + 1)];
    const rowStart = y * (stride + 1) + 1;
    const outRow = y * stride;
    const prevRow = (y - 1) * stride;

    for (let x = 0; x < stride; x++) {
      const byte = raw[rowStart + x];
      const a = x >= channels ? unfilter[outRow + x - channels] : 0;
      const b = y > 0 ? unfilter[prevRow + x] : 0;
      const c = y > 0 && x >= channels ? unfilter[prevRow + x - channels] : 0;

      if (filterType === 0) unfilter[outRow + x] = byte;
      else if (filterType === 1) unfilter[outRow + x] = (byte + a) & 0xff;
      else if (filterType === 2) unfilter[outRow + x] = (byte + b) & 0xff;
      else if (filterType === 3) unfilter[outRow + x] = (byte + ((a + b) >> 1)) & 0xff;
      else if (filterType === 4) unfilter[outRow + x] = (byte + paethPredictor(a, b, c)) & 0xff;
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = unfilter[i * channels];
    rgba[i * 4 + 1] = unfilter[i * channels + 1];
    rgba[i * 4 + 2] = unfilter[i * channels + 2];
    rgba[i * 4 + 3] = channels === 4 ? unfilter[i * channels + 3] : 255;
  }

  return { width, height, data: rgba };
}

const loadManifest = async (name = 'site.webmanifest') =>
  JSON.parse(await readFile(join(ROOT, name), 'utf8'));
const loadPng = async (relPath) =>
  decodePng(await readFile(join(ROOT, relPath.replace(/^\.?\//, ''))));

test('site.webmanifest and manifest.webmanifest exist and are identical', async () => {
  const a = await readFile(join(ROOT, 'site.webmanifest'), 'utf8');
  const b = await readFile(join(ROOT, 'manifest.webmanifest'), 'utf8');
  assert.equal(a, b);
  JSON.parse(a);
});

test('start_url, scope and id are portable relative paths, and the app is installable', async () => {
  const m = await loadManifest();
  assert.equal(m.start_url, './');
  assert.equal(m.scope, './');
  assert.equal(m.id, './');
  assert.equal(m.display, 'standalone');
  assert.equal(m.lang, 'en');
  assert.equal(m.prefer_related_applications, false);
  assert.ok(m.name.length > m.short_name.length && m.short_name.length <= 12);
  assert.match(m.theme_color, /^#[0-9a-f]{6}$/i);
  assert.match(m.background_color, /^#[0-9a-f]{6}$/i);
});

test('the manifest does not lock orientation', async () => {
  const m = await loadManifest();
  assert.equal(m.orientation, undefined);
});

test('every listed icon is a PNG of exactly its declared size, and never an .ico or .svg', async () => {
  const { icons } = await loadManifest();
  assert.ok(icons.length >= 8);
  for (const icon of icons) {
    assert.equal(icon.type, 'image/png');
    assert.doesNotMatch(icon.src, /\.(ico|svg)$/);
    const image = await loadPng(icon.src);
    assert.equal(`${image.width}x${image.height}`, icon.sizes, `${icon.src} is ${image.width}x${image.height}`);
  }
});

test('there are "any" and "maskable" icons at 192 and 512', async () => {
  const { icons } = await loadManifest();
  for (const purpose of ['any', 'maskable']) {
    for (const size of ['192x192', '512x512']) {
      assert.ok(icons.some((i) => i.purpose === purpose && i.sizes === size), `missing ${purpose} ${size}`);
    }
  }
});

test('maskable icons keep their artwork inside the central 80% safe-zone circle', async () => {
  const { icons } = await loadManifest();
  for (const icon of icons.filter((i) => i.purpose === 'maskable')) {
    const image = await loadPng(icon.src);
    const { width, data } = image;
    const corner = data.subarray(0, 4);
    const safeRadius = width * 0.4;
    for (let i = 0; i < data.length; i += 4) {
      if (data.subarray(i, i + 4).equals(corner)) continue;
      const x = (i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const distance = Math.hypot(x - width / 2, y - width / 2);
      assert.ok(
        distance <= safeRadius + 1,
        `${icon.src} has artwork at ${distance.toFixed(1)}px, safe radius is ${safeRadius}`
      );
    }
  }
});

test('apple-touch-icon.png is 180x180 with a solid non-transparent background', async () => {
  const image = await loadPng('apple-touch-icon.png');
  assert.equal(`${image.width}x${image.height}`, '180x180');
  for (let i = 3; i < image.data.length; i += 4) {
    assert.equal(image.data[i], 255);
  }
});

test('wide and narrow screenshots exist and match their declared dimensions', async () => {
  const { screenshots } = await loadManifest();
  for (const factor of ['wide', 'narrow']) {
    const shot = screenshots.find((s) => s.form_factor === factor);
    assert.ok(shot, `missing a ${factor} screenshot`);
    assert.ok(shot.label.length > 5);
    const image = await loadPng(shot.src);
    assert.equal(`${image.width}x${image.height}`, shot.sizes);
    const [long, short] = [Math.max(image.width, image.height), Math.min(image.width, image.height)];
    assert.ok(long <= short * 2.3, 'Chrome rejects screenshots longer than 2.3x their short side');
  }
});

test('every shortcut stays inside scope and references an existing icon', async () => {
  const { shortcuts } = await loadManifest();
  assert.ok(shortcuts.length >= 1);
  for (const shortcut of shortcuts) {
    assert.match(shortcut.url, /^\.\//);
    for (const icon of shortcut.icons) {
      const img = await loadPng(icon.src);
      assert.equal(`${img.width}x${img.height}`, icon.sizes);
    }
  }
});

test('favicon.ico holds 16, 32, and 48 pixel frames, and favicon.svg is a pure vector', async () => {
  const bytes = await readFile(join(ROOT, 'favicon.ico'));
  assert.deepEqual([bytes.readUInt16LE(0), bytes.readUInt16LE(2)], [0, 1]);
  const count = bytes.readUInt16LE(4);
  const sizes = Array.from({ length: count }, (_, i) => bytes[6 + i * 16]).sort((a, b) => a - b);
  assert.deepEqual(sizes, [16, 32, 48]);

  const svg = await readFile(join(ROOT, 'favicon.svg'), 'utf8');
  assert.match(svg, /viewBox=/);
  assert.doesNotMatch(svg, /<image/, 'favicon.svg must not wrap a bitmap');
});

test('index.html links the manifest, all icons, and matching web-app meta tags', async () => {
  const html = await readFile(join(ROOT, 'index.html'), 'utf8');
  const m = await loadManifest();
  assert.match(html, /<link\s+rel="manifest"\s+href="\/site\.webmanifest"\s*\/?>/);
  assert.match(html, /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/?>/);
  for (const size of ['16x16', '32x32', '48x48']) {
    assert.ok(html.includes(`sizes="${size}" href="/favicon-${size}.png"`), `Missing favicon ${size}`);
  }
  assert.match(html, /<link\s+rel="shortcut icon"\s+href="\/favicon\.ico"\s*\/?>/);
  assert.match(html, /<link\s+rel="apple-touch-icon"\s+sizes="180x180"\s+href="\/apple-touch-icon\.png"\s*\/?>/);
  assert.ok(html.includes(`meta name="theme-color" content="${m.theme_color}"`));
  assert.ok(html.includes(`meta name="apple-mobile-web-app-title" content="${m.short_name}"`));
  assert.ok(html.includes(`meta name="application-name" content="${m.short_name}"`));
});
