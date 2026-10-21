// Captures the manifest screenshots: one wide (desktop) and one narrow (phone).
//   node scripts/capture-screenshots.mjs [url]
// If no URL is passed, starts a local temporary HTTP server for the repo root.
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withChrome } from './cdp.mjs';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const outDir = new URL('../screenshots/', import.meta.url);
await mkdir(outDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function startLocalServer() {
  const server = createServer(async (req, res) => {
    const reqPath = new URL(req.url, 'http://127.0.0.1').pathname;
    const relPath = reqPath === '/' ? '/index.html' : reqPath;
    try {
      const data = await readFile(join(rootDir, relPath));
      res.writeHead(200, { 'content-type': MIME[extname(relPath)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return { url: `http://127.0.0.1:${port}/#matthew-11-28`, close: () => server.close() };
}

const local = process.argv[2] ? null : await startLocalServer();
const targetUrl = process.argv[2] ?? local.url;

const shots = [
  { file: 'screenshot-wide.png', metrics: { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false } },
  { file: 'screenshot-narrow.png', metrics: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true } },
];

try {
  await withChrome(async ({ send, navigate }) => {
    for (const { file, metrics } of shots) {
      await send('Emulation.setDeviceMetricsOverride', metrics);
      const u = new URL(targetUrl);
      u.searchParams.set('shot', file);
      await navigate(u.toString());
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      await writeFile(new URL(file, outDir), Buffer.from(data, 'base64'));
      console.log(`${file}: ${metrics.width * metrics.deviceScaleFactor}x${metrics.height * metrics.deviceScaleFactor}`);
    }
  });
} finally {
  local?.close();
}
