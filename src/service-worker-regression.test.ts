import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

type StoredResponse = { body: string; clone: () => StoredResponse };

class MemoryCache {
  entries = new Map<string, StoredResponse>();

  async addAll(urls: string[]): Promise<void> {
    for (const url of urls) this.entries.set(url, response(`shell:${url}`));
  }

  async put(request: string | { url: string }, value: StoredResponse): Promise<void> {
    this.entries.set(typeof request === 'string' ? request : new URL(request.url).pathname, value);
  }

  async match(request: string | { url: string }): Promise<StoredResponse | undefined> {
    return this.entries.get(typeof request === 'string' ? request : new URL(request.url).pathname);
  }
}

class MemoryCaches {
  stores = new Map<string, MemoryCache>();

  async open(name: string): Promise<MemoryCache> {
    if (!this.stores.has(name)) this.stores.set(name, new MemoryCache());
    return this.stores.get(name)!;
  }

  async keys(): Promise<string[]> { return [...this.stores.keys()]; }
  async delete(name: string): Promise<boolean> { return this.stores.delete(name); }

  async match(request: string | { url: string }): Promise<StoredResponse | undefined> {
    for (const store of this.stores.values()) {
      const found = await store.match(request);
      if (found) return found;
    }
    return undefined;
  }
}

function response(body: string): StoredResponse { return { body, clone: () => response(body) }; }

async function loadWorker(version: string, caches: MemoryCaches) {
  const template = await readFile(resolve(import.meta.dirname, '../scripts/service-worker.template.js'), 'utf8');
  const listeners = new Map<string, (event: never) => void>();
  const scope = {
    location: { origin: 'https://ink-guides.test' },
    addEventListener: (name: string, listener: (event: never) => void) => listeners.set(name, listener),
    skipWaiting: () => undefined,
    clients: { claim: () => undefined },
  };
  const evaluate = new Function('self', 'caches', 'fetch', 'URL', template.replace('__CACHE_VERSION__', version));
  evaluate(scope, caches, async () => { throw new Error('offline'); }, URL);
  return { listeners, cacheName: `ink-guides-${version}` };
}

async function runLifecycle(listener: (event: { waitUntil: (work: Promise<unknown>) => void }) => void) {
  let work: Promise<unknown> | undefined;
  listener({ waitUntil: (promise) => { work = promise; } });
  await work;
}

test('service-worker release upgrade replaces the prior offline shell', async () => {
  const caches = new MemoryCaches();
  const oldWorker = await loadWorker('old-release', caches);
  await runLifecycle(oldWorker.listeners.get('install')! as never);
  await (await caches.open(oldWorker.cacheName)).put('/index.html', response('old shell'));

  const newWorker = await loadWorker('new-release', caches);
  await runLifecycle(newWorker.listeners.get('install')! as never);
  await (await caches.open(newWorker.cacheName)).put('/index.html', response('new shell'));
  await runLifecycle(newWorker.listeners.get('activate')! as never);

  expect(await caches.keys()).toEqual([newWorker.cacheName]);
  expect((await caches.match('/index.html'))?.body).toBe('new shell');
});

test('the built worker cache version changes with the application shell', async () => {
  const template = await readFile(resolve(import.meta.dirname, '../scripts/service-worker.template.js'), 'utf8');
  const version = (index: string) => createHash('sha256').update(template).update(index).digest('hex').slice(0, 16);
  expect(version('<script src="old.js"></script>')).not.toBe(version('<script src="new.js"></script>'));
});

test('a strict production CSP never routes local blob image decoding through the worker', async () => {
  const caches = new MemoryCaches();
  const worker = await loadWorker('blob-regression', caches);
  let responseHandled = false;

  worker.listeners.get('fetch')!({
    request: { method: 'GET', mode: 'no-cors', url: 'blob:https://ink-guides.test/corrupt-image' },
    respondWith: () => { responseHandled = true; },
  } as never);

  expect(responseHandled).toBe(false);
});

test('deployment policy keeps assets immutable and prevents framing', async () => {
  const config = JSON.parse(await readFile(resolve(import.meta.dirname, '../public/staticwebapp.config.json'), 'utf8'));
  expect(config.routes).toContainEqual({ route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });
  expect(config.navigationFallback).toBeUndefined();
  expect(config.routes).toEqual(expect.arrayContaining([
    { route: '/demo', rewrite: '/index.html' },
    { route: '/privacy', rewrite: '/index.html' },
    { route: '/terms', rewrite: '/index.html' },
  ]));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders['Content-Security-Policy']).toContain("connect-src 'self' blob:");
  expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
});

test('sharing, install, and 404 metadata are complete', async () => {
  const index = await readFile(resolve(import.meta.dirname, '../index.html'), 'utf8');
  const notFound = await readFile(resolve(import.meta.dirname, '../public/404.html'), 'utf8');
  const manifest = JSON.parse(await readFile(resolve(import.meta.dirname, '../public/site.webmanifest'), 'utf8'));
  expect(index).toContain('rel="canonical"');
  expect(index).toContain('property="og:image"');
  expect(index).toContain('name="twitter:card"');
  expect(index).toContain('rel="apple-touch-icon"');
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/icon-192.png', sizes: '192x192' }),
    expect.objectContaining({ src: '/icon-512.png', sizes: '512x512' }),
  ]));
  expect(notFound).toContain('<title>Page not found — Ink Guides</title>');
  expect(notFound.match(/<h1/g)).toHaveLength(1);
  expect(notFound).toContain('href="/"');
});
