import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('studio works end to end without serious accessibility issues', async ({ page, browserName }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.getByRole('button', { name: 'Start transparent' }).click();
  await page.getByRole('button', { name: /Draw spline/ }).click();
  const canvas = page.getByLabel(/Guide canvas/);
  await canvas.scrollIntoViewIfNeeded();
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds) {
    await page.mouse.move(bounds.x + bounds.width * .18, bounds.y + bounds.height * .68);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width * .42, bounds.y + bounds.height * .38, { steps: 8 });
    await page.mouse.move(bounds.x + bounds.width * .72, bounds.y + bounds.height * .57, { steps: 8 });
    await page.mouse.up();
  }
  await expect(page.locator('#canvas-summary')).toContainText('1 spline');
  await page.getByLabel('Scene name').fill('Rooftop sweep');
  await page.getByRole('button', { name: /Save scene/ }).click();
  await expect(page.getByRole('button', { name: /Rooftop sweep 9 lines/ })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export SVG/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('ink-guides-layer.svg');
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const svg = await readFile(downloadPath!, 'utf8');
  expect(svg).toContain('<path');
  expect(svg).not.toContain('<image');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  expect(errors, `${browserName} console errors`).toEqual([]);
});

test('reference import stays separate from saved geometry', async ({ page }) => {
  await page.locator('#reference-file').setInputFiles('public/assets/hero-paper-diorama.webp');
  await expect(page.locator('#reference-control')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove image' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove image' }).click();
  await expect(page.locator('#reference-control')).toBeHidden();
});

test('checkout return stores and verifies the Studio license', async ({ page }) => {
  await page.route('**/api/v1/products/guided-inking-overlay/verify?*', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/?license=test-license-token');
  await expect(page).toHaveURL('/');
  await expect(page.locator('#unlock-label')).toHaveText('Studio unlocked');
  await expect(page.locator('#png-label')).toContainText('2400 × 1600');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:guided-inking-overlay'))).toBe('test-license-token');
});

test('keeps a first-time offline license return on the free tier', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const token = 'definitely-invalid-offline-regression-token';

  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
  await page.evaluate(() => localStorage.clear());

  await context.setOffline(true);
  await page.goto(`http://127.0.0.1:4173/?license=${token}`);

  await expect(page.locator('#scene-count')).toHaveText('0 / 3');
  await expect(page.locator('#png-label')).toHaveText('1200 × 800 · free');
  await expect(page.locator('#unlock-label')).toHaveText('Studio');
  await expect(page.locator('#license-status')).toHaveText('Could not reach the license service. Your free workspace still works; try again when online.');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:guided-inking-overlay'))).toBe(token);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license_verdict:guided-inking-overlay'))).toBeNull();

  await context.setOffline(false);
  await context.close();
});

test('keeps a matching verified Studio license available offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const token = 'recorded-valid-offline-license';

  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
  await page.evaluate(({ token, verdict }) => {
    localStorage.setItem('sb_license:guided-inking-overlay', token);
    localStorage.setItem('sb_license_verdict:guided-inking-overlay', JSON.stringify(verdict));
  }, { token, verdict: { license: token, valid: true, checkedAt: Date.now() } });

  await context.setOffline(true);
  await page.reload();

  await expect(page.locator('#scene-count')).toHaveText('0 / 20');
  await expect(page.locator('#png-label')).toHaveText('2400 × 1600 · Studio');
  await expect(page.locator('#unlock-label')).toHaveText('Studio unlocked');

  await context.setOffline(false);
  await context.close();
});

test('does not borrow a cached verdict for a different offline license return', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const cachedToken = 'previously-verified-license';
  const returnedToken = 'different-unverified-license';

  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
  await page.evaluate(({ cachedToken, verdict }) => {
    localStorage.setItem('sb_license:guided-inking-overlay', cachedToken);
    localStorage.setItem('sb_license_verdict:guided-inking-overlay', JSON.stringify(verdict));
  }, { cachedToken, verdict: { license: cachedToken, valid: true, checkedAt: Date.now() } });

  await context.setOffline(true);
  await page.goto(`http://127.0.0.1:4173/?license=${returnedToken}`);

  await expect(page.locator('#scene-count')).toHaveText('0 / 3');
  await expect(page.locator('#png-label')).toHaveText('1200 × 800 · free');
  await expect(page.locator('#unlock-label')).toHaveText('Studio');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:guided-inking-overlay'))).toBe(returnedToken);

  await context.setOffline(false);
  await context.close();
});

test('legal pages have one heading and mobile layout does not overflow', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toHaveCount(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
  await page.getByRole('link', { name: 'Back to studio' }).click();
  await expect(page).toHaveURL('/');
});

test('first screen names the job, artists, next step, and sample demo', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Draw perspective and curved inking guides' })).toBeVisible();
  await expect(page.getByText('Guides for comic and concept artists')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('Loads two prepared guide scenes in a separate demo.')).toBeVisible();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('#canvas-summary')).toHaveText('13 fan lines · 1 spline');
});

test('SPA route changes focus and announce the new page', async ({ page }) => {
  await page.getByRole('link', { name: 'Privacy' }).click();
  const privacyHeading = page.getByRole('heading', { level: 1, name: 'Privacy' });
  await expect(privacyHeading).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Privacy page loaded');
  await page.goBack();
  const studioHeading = page.getByRole('heading', { level: 1, name: 'Draw perspective and curved inking guides' });
  await expect(studioHeading).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Draw perspective and curved inking guides page loaded');
});

test('unknown SPA paths show the designed 404 and a way home', async ({ page }) => {
  await page.goto('/not-a-real-route');
  await expect(page).toHaveTitle('Page not found — Ink Guides');
  await expect(page.getByRole('heading', { level: 1, name: 'This page does not exist' })).toHaveCount(1);
  await page.getByRole('link', { name: 'Open the editor' }).click();
  await expect(page).toHaveURL('/');
});

test('route metadata and install icons are complete', async ({ page, request }) => {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://guided-inking-overlay.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /ink-guides-social\.webp$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Ink Guides');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://guided-inking-overlay.sociobot.in/privacy');
  const manifest = await (await request.get('/site.webmanifest')).json();
  expect(manifest.icons).toHaveLength(2);
});

test('demo, Studio dialog, and privacy route have no serious accessibility issues', async ({ page }) => {
  await page.goto('/demo');
  for (const scan of [
    async () => new AxeBuilder({ page }).analyze(),
    async () => {
      await page.getByRole('button', { name: 'Studio', exact: true }).click();
      return new AxeBuilder({ page }).include('#license-dialog').analyze();
    },
    async () => {
      await page.getByRole('button', { name: 'Close Studio panel' }).click();
      await page.goto('/privacy');
      return new AxeBuilder({ page }).analyze();
    },
  ]) {
    const results = await scan();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  }
});

test('demo has no complementary landmark nested inside the editor', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.id === 'landmark-complementary-is-top-level')).toEqual([]);
});

test('pen-style and touch pointers draw splines at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: /Draw spline/ }).click();
  const box = await page.getByLabel(/Guide canvas/).boundingBox();
  expect(box).not.toBeNull();
  const session = await page.context().newCDPSession(page);
  const points = [
    { x: box!.x + box!.width * .15, y: box!.y + box!.height * .72 },
    { x: box!.x + box!.width * .43, y: box!.y + box!.height * .36 },
    { x: box!.x + box!.width * .8, y: box!.y + box!.height * .61 },
  ];
  await session.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: points[0]!.x, y: points[0]!.y, button: 'left', buttons: 1, clickCount: 1, pointerType: 'pen' });
  await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: points[1]!.x, y: points[1]!.y, button: 'left', buttons: 1, pointerType: 'pen' });
  await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: points[2]!.x, y: points[2]!.y, button: 'left', buttons: 1, pointerType: 'pen' });
  await session.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: points[2]!.x, y: points[2]!.y, button: 'left', buttons: 0, clickCount: 1, pointerType: 'pen' });
  await expect(page.locator('#canvas-summary')).toContainText('2 splines');
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: points[0]!.x, y: points[0]!.y, id: 4 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: points[1]!.x, y: points[1]!.y, id: 4 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: points[2]!.x, y: points[2]!.y, id: 4 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('#canvas-summary')).toContainText('3 splines');
});

test('390px welcome actions meet the 44px touch-target requirement', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ['Choose reference', 'Start transparent']) {
    const box = await page.getByRole('button', { name, exact: true }).boundingBox();
    expect(box, `${name} should be visible`).not.toBeNull();
    expect(box!.height, `${name} height`).toBeGreaterThanOrEqual(44);
    expect(box!.width, `${name} width`).toBeGreaterThanOrEqual(44);
  }
});

test('390px full editor scan keeps every visible action at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Start transparent', exact: true }).click();
  await page.locator('#reference-file').setInputFiles('public/assets/hero-paper-diorama.webp');
  await expect(page.locator('#reference-control')).toBeVisible();

  const targets = page.locator('button, a[href], input[type="range"], .switch, .file-button');
  const failures: string[] = [];
  for (let index = 0; index < await targets.count(); index += 1) {
    const target = targets.nth(index);
    const box = await target.boundingBox();
    if (!box || box.width === 0 || box.height === 0) continue;
    if (box.width < 44 || box.height < 44) {
      failures.push(`${await target.evaluate((element) => element.id || element.className || element.tagName)}: ${box.width.toFixed(2)}×${box.height.toFixed(2)}`);
    }
  }
  expect(failures).toEqual([]);
});

test('corrupt image recovery stays clean under the production CSP', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.reload();
  expect(response?.headers()['content-security-policy']).toContain("connect-src 'self' blob:");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();

  await page.locator('#reference-file').setInputFiles({
    name: 'broken.png',
    mimeType: 'image/png',
    buffer: Buffer.from('not a decodable PNG'),
  });
  await expect(page.locator('#toast')).toHaveText('That image could not be decoded. Try exporting it as PNG or JPEG.');
  await page.locator('#reference-file').setInputFiles('public/assets/hero-paper-diorama.webp');
  await expect(page.locator('#reference-control')).toBeVisible();
  expect(errors).toEqual([]);
});

test('keyboard shortcuts and canvas arrow controls remain operable', async ({ page }) => {
  await page.getByRole('button', { name: 'Start transparent' }).click();
  const canvas = page.getByLabel(/Guide canvas/);
  await canvas.focus();
  await page.keyboard.press('f');
  await expect(page.getByRole('button', { name: /Aim fan/ })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: /Undo/ })).toBeEnabled();
  await page.keyboard.press('s');
  await expect(page.getByRole('button', { name: /Draw spline/ })).toHaveAttribute('aria-pressed', 'true');
});

test('changing tools repeatedly keeps pressed state on tool buttons only', async ({ page }) => {
  await page.getByRole('button', { name: 'Start transparent' }).click();
  await page.getByRole('button', { name: /Aim fan/ }).click();
  await page.getByRole('button', { name: /Draw spline/ }).click();

  await expect(page.locator('#canvas-shell')).not.toHaveAttribute('aria-pressed');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('a fresh studio load makes no third-party requests', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(page.url()).origin) externalRequests.push(request.url());
  });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test('the installed shell remains usable during an offline reload', async ({ page, context }) => {
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  });
  await page.reload();
  await expect(page).toHaveTitle(/Ink Guides/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveTitle(/Ink Guides/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.setOffline(false);
});
