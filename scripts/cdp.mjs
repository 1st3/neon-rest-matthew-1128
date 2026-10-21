// Tiny Chrome DevTools Protocol helper (Node 22+ has a global WebSocket).
// Uses Emulation.setDeviceMetricsOverride with mobile: true for real 390px mobile viewports.
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForJson(url) {
  for (let i = 0; i < 50; i++) {
    try {
      return await (await fetch(url)).json();
    } catch {
      await sleep(200);
    }
  }
  throw new Error(`Chrome did not start (${url})`);
}

export async function withChrome(run) {
  const port = 9300 + Math.floor(Math.random() * 500);
  const profile = await mkdtemp(join(tmpdir(), 'neon-chrome-'));
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    const tabs = await waitForJson(`http://127.0.0.1:${port}/json`);
    const ws = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let nextId = 1;
    const pending = new Map();
    const listeners = new Set();
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        pending.get(message.id)(message);
        pending.delete(message.id);
      } else if (message.method) {
        listeners.forEach((listener) => listener(message));
      }
    };

    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, (message) =>
          message.error ? reject(new Error(message.error.message)) : resolve(message.result)
        );
        ws.send(JSON.stringify({ id, method, params }));
      });

    const navigate = async (url) => {
      const loaded = new Promise((resolve) => {
        const listener = (message) => {
          if (message.method === 'Page.loadEventFired') {
            listeners.delete(listener);
            resolve();
          }
        };
        listeners.add(listener);
      });
      await send('Page.navigate', { url });
      await loaded;
      await send('Runtime.evaluate', {
        expression: 'document.fonts.ready.then(() => true)',
        awaitPromise: true,
      });
      await sleep(450);
    };

    await send('Page.enable');
    return await run({ send, navigate });
  } finally {
    chrome.kill();
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }
}
