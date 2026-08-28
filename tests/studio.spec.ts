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

test('legal pages have one heading and mobile layout does not overflow', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toHaveCount(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
  await page.getByRole('link', { name: 'Back to studio' }).click();
  await expect(page).toHaveURL('/');
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
