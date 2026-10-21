import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://news.dieppe.app';
const PLATFORM_NAME = 'News Dieppe';

const html = await readFile(join(ROOT, 'index.html'), 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/i)[1];

function meta(attr, name) {
  const re = new RegExp(`<meta\\s+[^>]*${attr}="${name}"[^>]*>`, 'i');
  const tag = head.match(re)?.[0];
  assert.ok(tag, `missing <meta ${attr}="${name}">`);
  const content = tag.match(/content="([^"]*)"/i)?.[1];
  assert.notEqual(content, undefined, `<meta ${attr}="${name}"> has no content`);
  return content;
}

function pngGeometry(buf) {
  assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'not a PNG');
  assert.equal(buf.subarray(12, 16).toString('ascii'), 'IHDR');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

test('Platform name is News Dieppe everywhere (never Neon Rest)', async () => {
  const filesToCheck = [
    'index.html',
    '404.html',
    'site.webmanifest',
    'manifest.webmanifest',
    'neon.js',
    'sw.js',
    'README.md',
  ];
  for (const rel of filesToCheck) {
    const content = await readFile(join(ROOT, rel), 'utf8');
    assert.doesNotMatch(content, /neon\s*rest/i, `${rel} still contains 'Neon Rest'`);
  }
  assert.equal(meta('name', 'application-name'), PLATFORM_NAME);
  assert.equal(meta('name', 'apple-mobile-web-app-title'), PLATFORM_NAME);
  assert.equal(meta('property', 'og:site_name'), PLATFORM_NAME);
});

test('HTML document basics: lang, charset first, viewport, no zoom lock', () => {
  assert.match(html, /<html\s+lang="en">/i);
  const firstTag = head.trim().match(/^<[^>]+>/)[0];
  assert.match(firstTag, /<meta\s+charset="utf-8"\s*\/?>/i);
  const vp = meta('name', 'viewport');
  assert.match(vp, /width=device-width/);
  assert.doesNotMatch(vp, /maximum-scale=1|user-scalable=no/i);
});

test('Title is 50–60 chars, carries primary keyword + brand suffix News Dieppe', () => {
  const title = head.match(/<title>([^<]+)<\/title>/i)?.[1];
  assert.ok(title, 'missing <title>');
  assert.ok(
    title.length >= 50 && title.length <= 60,
    `title length ${title.length} outside 50–60: "${title}"`
  );
  assert.match(title, /Matthew 11:28/i);
  assert.match(title, /\|\s*News Dieppe$/);
});

test('Meta description is 130–155 chars and is a real sentence', () => {
  const desc = meta('name', 'description');
  assert.ok(
    desc.length >= 130 && desc.length <= 155,
    `description length ${desc.length} outside 130–155: "${desc}"`
  );
  assert.match(desc, /Come to me/i);
  assert.match(desc, /News Dieppe\.$/);
});

test('Canonical link and og:url are identical absolute HTTPS URLs', () => {
  const canonical = head.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  assert.equal(canonical, `${SITE}/`);
  assert.equal(meta('property', 'og:url'), canonical);
});

test('Open Graph tags are complete and og:image is a real 1200x630 PNG under 200 KB', async () => {
  assert.equal(meta('property', 'og:type'), 'website');
  assert.equal(meta('property', 'og:site_name'), PLATFORM_NAME);
  assert.equal(meta('property', 'og:locale'), 'en_US');
  assert.ok(meta('property', 'og:title').length >= 30);
  assert.equal(meta('property', 'og:description'), meta('name', 'description'));

  const imgUrl = meta('property', 'og:image');
  assert.equal(imgUrl, `${SITE}/og-image.png`);
  assert.equal(meta('property', 'og:image:type'), 'image/png');
  assert.equal(meta('property', 'og:image:width'), '1200');
  assert.equal(meta('property', 'og:image:height'), '630');
  assert.ok(meta('property', 'og:image:alt').length >= 20);

  const img = pngGeometry(await readFile(join(ROOT, 'og-image.png')));
  assert.equal(img.width, 1200);
  assert.equal(img.height, 630);
  assert.ok(
    img.bytes < 200 * 1024,
    `og-image.png is ${img.bytes} bytes (must be < 200 KB for WhatsApp)`
  );

  assert.equal(meta('name', 'twitter:card'), 'summary_large_image');
});

test('Icons and Web App Manifest are wired and sized correctly', async () => {
  assert.match(head, /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"/);
  assert.match(head, /<link\s+rel="apple-touch-icon"\s+sizes="180x180"\s+href="\/apple-touch-icon\.png"/);
  assert.match(head, /<link\s+rel="manifest"\s+href="\/site\.webmanifest"/);
  assert.equal(meta('name', 'theme-color'), '#080b0f');

  const touch = pngGeometry(await readFile(join(ROOT, 'apple-touch-icon.png')));
  assert.equal(touch.width, 180);
  assert.equal(touch.height, 180);

  const manifest = JSON.parse(await readFile(join(ROOT, 'site.webmanifest'), 'utf8'));
  assert.equal(manifest.short_name, PLATFORM_NAME);
  assert.match(manifest.name, /^News Dieppe/);
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#080b0f');
});

test('JSON-LD is valid, matches visible content, and uses a single applicationCategory string', () => {
  const raw = head.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
  assert.ok(raw, 'missing JSON-LD block');
  const ld = JSON.parse(raw);
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@type'], 'WebApplication');
  assert.equal(ld.name, PLATFORM_NAME);
  assert.equal(ld.url, `${SITE}/`);
  assert.equal(ld.image, `${SITE}/og-image.png`);
  assert.equal(typeof ld.applicationCategory, 'string');
  assert.equal(ld.offers.price, '0');
});

test('Semantic landmarks: exactly one <h1>, <main>, and crawlable quote copy in initial HTML', () => {
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert.equal(h1s.length, 1, `expected 1 <h1>, found ${h1s.length}`);
  assert.match(h1s[0][1], /Matthew 11:28/);
  assert.match(html, /<main\b/i);
  assert.match(html, /Come to me, all you who are weary and burdened/i);
});

test('LCP background image is preloaded in <head>', () => {
  assert.match(head, /<link\s+rel="preload"\s+as="image"\s+href="\/blank-shirt\.png"\s*\/?>/i);
});

test('robots.txt, sitemap.xml, and 404.html are present and well-formed', async () => {
  const robots = await readFile(join(ROOT, 'robots.txt'), 'utf8');
  assert.match(robots, /^User-agent:\s*\*/m);
  assert.match(robots, /^Allow:\s*\/$/m);
  assert.match(robots, /^Disallow:\s*\/verses\.json$/m);
  assert.match(robots, new RegExp(`^Sitemap:\\s*${SITE}/sitemap\\.xml$`, 'm'));

  const sitemap = await readFile(join(ROOT, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, new RegExp(`<loc>${SITE}/</loc>`));

  const notFound = await readFile(join(ROOT, '404.html'), 'utf8');
  assert.match(notFound, /<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/?>/i);
  assert.match(notFound, /News Dieppe/);
});
