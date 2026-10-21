// Asks Chrome itself whether the manifest is clean. Exits 1 on any error.
//   node scripts/verify-manifest.mjs [url]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withChrome } from './cdp.mjs';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
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
  return { url: `http://127.0.0.1:${port}/`, close: () => server.close() };
}

const local = process.argv[2] ? null : await startLocalServer();
const url = process.argv[2] ?? local.url;

try {
  const result = await withChrome(async ({ send, navigate }) => {
    await navigate(url);
    return send('Page.getAppManifest');
  });

  const errors = result.errors ?? [];
  if (errors.length > 0) {
    console.error(`Manifest audit failed for ${url}:`);
    console.error(JSON.stringify(errors, null, 2));
    process.exit(1);
  }
  const manifest = JSON.parse(result.data);
  console.log(`0 manifest errors or warnings for ${url}`);
  console.log(`manifest: ${result.url}`);
  console.log(`icons: ${manifest.icons.length}, screenshots: ${manifest.screenshots.length}, shortcuts: ${manifest.shortcuts.length}`);
} finally {
  local?.close();
}
