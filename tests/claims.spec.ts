import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const REAL_SCENES = 'ink-guides:scenes:v1';
const DEMO_SCENES = 'demo:ink-guides:scenes:v1';
const PRODUCT_ORIGIN = 'http://127.0.0.1:4173';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
});

async function downloadBytes(page: Page, buttonName: RegExp): Promise<Buffer> {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: buttonName }).click();
  const download = await pending;
  const path = await download.path();
  expect(path).not.toBeNull();
  return readFile(path!);
}

function pngDimensions(bytes: Buffer): { width: number; height: number } {
  expect(bytes.subarray(1, 4).toString()).toBe('PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

async function saveScene(page: Page, name: string): Promise<void> {
  await page.getByLabel('Scene name').fill(name);
  await page.getByRole('button', { name: /Save scene/ }).click();
}

test('adjusts a fan and draws parallel curved rails @claim:guide-creation', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#canvas-summary')).toHaveText('13 fan lines · 1 curved guide');
  await page.getByLabel('Lines').evaluate((input: HTMLInputElement) => {
    input.value = '17';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByRole('button', { name: /Draw curved guide/ }).click();
  const canvas = page.getByLabel(/Guide canvas/);
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * .15, box!.y + box!.height * .7);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * .45, box!.y + box!.height * .35, { steps: 8 });
  await page.mouse.move(box!.x + box!.width * .8, box!.y + box!.height * .62, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('#canvas-summary')).toHaveText('17 fan lines · 2 curved guides');
});

test('decodes supported references without saving or uploading them @claim:reference-privacy', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== PRODUCT_ORIGIN) external.push(request.url());
  });
  await page.goto('/demo');
  const rasterData = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 3;
    canvas.height = 2;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#7b2948';
    context.fillRect(0, 0, 3, 2);
    return { png: canvas.toDataURL('image/png').split(',')[1]!, jpeg: canvas.toDataURL('image/jpeg').split(',')[1]! };
  });
  const fixtures = [
    { name: 'panel.png', mimeType: 'image/png', buffer: Buffer.from(rasterData.png, 'base64') },
    { name: 'panel.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(rasterData.jpeg, 'base64') },
    { name: 'panel.webp', mimeType: 'image/webp', buffer: await readFile('public/assets/hero-paper-diorama.webp') },
    { name: 'panel.gif', mimeType: 'image/gif', buffer: Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64') },
  ];
  for (const fixture of fixtures) {
    await page.locator('#reference-file').setInputFiles(fixture);
    await expect(page.locator('#reference-control')).toBeVisible();
    await page.getByRole('button', { name: 'Remove image' }).click();
  }
  await page.locator('#reference-file').setInputFiles(fixtures[0]!);
  await saveScene(page, 'Private panel');
  await expect(page.locator('.scene-load').filter({ hasText: 'Private panel' })).toBeVisible();
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES)).toContain('Private panel');
  const stored = await page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES);
  expect(stored).toContain('Private panel');
  expect(stored).not.toContain('panel.png');
  expect(stored).not.toMatch(/blob:|data:image|iVBOR/);
  expect(external).toEqual([]);
});

test('saves and reloads scene geometry locally @claim:local-scenes', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Lines').evaluate((input: HTMLInputElement) => {
    input.value = '17';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await saveScene(page, 'Rooftop correction');
  const stored = JSON.parse((await page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES)) || '[]');
  expect(stored).toHaveLength(3);
  expect(stored[0].state.fan.density).toBe(17);
  await page.reload();
  await page.getByRole('button', { name: /Rooftop correction 17 lines/ }).click();
  await expect(page.locator('#canvas-summary')).toContainText('17 fan lines');
});

test('exports geometry-only transparent SVG and PNG files @claim:geometry-exports', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#reference-file').setInputFiles('public/assets/hero-paper-diorama.webp');
  const svg = (await downloadBytes(page, /Export SVG/)).toString('utf8');
  expect(svg.match(/<line /g)).toHaveLength(13);
  expect(svg.match(/<path /g)).toHaveLength(7);
  expect(svg).not.toContain('<image');
  const png = await downloadBytes(page, /Export PNG/);
  expect(pngDimensions(png)).toEqual({ width: 1200, height: 800 });
  const cornerAlpha = await page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    return [[1, 1], [1198, 1], [1, 798], [1198, 798]].map(([x, y]) => context.getImageData(x!, y!, 1, 1).data[3]);
  }, png.toString('base64'));
  expect(cornerAlpha.filter((alpha) => alpha === 0).length).toBeGreaterThanOrEqual(3);
});

test('reloads the installed demo offline @claim:offline-reload', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${PRODUCT_ORIGIN}/demo`);
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveTitle('Demo — Ink Guides');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('#canvas-summary')).toHaveText('13 fan lines · 1 curved guide');
  await context.setOffline(false);
  await context.close();
});

test('operates the guide tools from the keyboard @claim:keyboard-controls', async ({ page }) => {
  await page.goto('/demo');
  const canvas = page.getByLabel(/Guide canvas/);
  await canvas.focus();
  await page.keyboard.press('f');
  await expect(page.getByRole('button', { name: /Aim fan/ })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: /Undo/ })).toBeEnabled();
  await page.keyboard.press('s');
  await expect(page.getByRole('button', { name: /Draw curved guide/ })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('v');
  await expect(page.getByRole('button', { name: /Select/ })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Shift+ArrowLeft');
  await saveScene(page, 'Keyboard movement proof');
  const stored = JSON.parse((await page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES)) || '[]');
  expect(stored[0].state.splines[0].points[0].x).toBe(111);
  await page.keyboard.press('Delete');
  await expect(page.locator('#canvas-summary')).toContainText('no curved guide yet');
});

test('enforces the free scene and PNG boundaries @claim:free-tier', async ({ page }) => {
  await page.goto('/demo');
  await saveScene(page, 'Free scene 3');
  await expect(page.locator('#scene-count')).toHaveText('3 / 3');
  await saveScene(page, 'Fourth scene');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(JSON.parse((await page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES)) || '[]')).toHaveLength(3);
  await page.getByRole('button', { name: 'Close Studio panel' }).click();
  const png = await downloadBytes(page, /Export PNG/);
  expect(pngDimensions(png)).toEqual({ width: 1200, height: 800 });
  await expect(page.getByRole('button', { name: /Export SVG/ })).toBeEnabled();
});

test('enforces the Studio scene and PNG boundaries @claim:studio-tier', async ({ page }) => {
  await page.route('**/api/v1/products/guided-inking-overlay/verify?*', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.goto('/?license=recorded-valid-license');
  await expect(page.locator('#unlock-label')).toHaveText('Studio unlocked');
  await page.getByRole('button', { name: 'Start transparent' }).click();
  for (let index = 1; index <= 20; index += 1) await saveScene(page, `Studio scene ${index}`);
  await expect(page.locator('#scene-count')).toHaveText('20 / 20');
  await saveScene(page, 'Twenty-first scene');
  await expect(page.locator('#toast')).toHaveText('Your 20-scene shelf is full. Delete one before saving.');
  expect(JSON.parse((await page.evaluate((key) => localStorage.getItem(key), REAL_SCENES)) || '[]')).toHaveLength(20);
  const png = await downloadBytes(page, /Export PNG/);
  expect(pngDimensions(png)).toEqual({ width: 2400, height: 1600 });
});

test('states the exact one-time Studio price and checkout @claim:studio-price', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Buy Studio once', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Studio costs $9 once.');
  await expect(dialog).toContainText('Sociobot/Dodo handles checkout and refunds as the merchant of record.');
  await expect(dialog.getByRole('link', { name: 'Buy Studio — $9' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/guided-inking-overlay/checkout');
});

test('verifies a stored license no more than once per day @claim:daily-license-verification', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/v1/products/guided-inking-overlay/verify?*', (route) => {
    requests += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.evaluate(() => localStorage.setItem('sb_license:guided-inking-overlay', 'stored-license'));
  await page.reload();
  await expect.poll(() => requests).toBe(1);
  await expect(page.locator('#unlock-label')).toHaveText('Studio unlocked');
  await page.reload();
  await expect(page.locator('#unlock-label')).toHaveText('Studio unlocked');
  await page.waitForTimeout(150);
  expect(requests).toBe(1);
});

test('isolates and discards the one-click sample demo @claim:demo-sandbox', async ({ page }) => {
  const realScene = [{ id: 'private', name: 'Private scene', updatedAt: '2026-08-28T00:00:00.000Z', state: {
    fan: { visible: true, origin: { x: 600, y: 300 }, density: 5, rotation: 0, spread: 90 },
    splines: [], rails: { count: 3, gap: 20 }, style: { opacity: 70, width: 2 },
  } }];
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: REAL_SCENES, value: realScene });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: /Rainy station panel 13 lines/ })).toBeVisible();
  await expect(page.getByText('Private scene')).toHaveCount(0);
  await saveScene(page, 'Demo namespace probe');
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES)).toContain('Demo namespace probe');
  expect(await page.evaluate((key) => localStorage.getItem(key), REAL_SCENES)).toContain('Private scene');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES)).toBeNull();
  await saveScene(page, 'Discard this demo change');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_SCENES)).toBeNull();
  await expect(page.getByText('Private scene')).toBeVisible();
});

test('keeps the complete free demo flow same-origin @claim:no-tracking', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== PRODUCT_ORIGIN) external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: /Draw curved guide/ }).click();
  await saveScene(page, 'Request audit scene');
  await downloadBytes(page, /Export SVG/);
  await downloadBytes(page, /Export PNG/);
  const remoteScripts = await page.locator('script[src]').evaluateAll((scripts) => scripts
    .map((script) => (script as HTMLScriptElement).src)
    .filter((src) => new URL(src).origin !== location.origin));
  expect(remoteScripts).toEqual([]);
  expect(external).toEqual([]);
});
