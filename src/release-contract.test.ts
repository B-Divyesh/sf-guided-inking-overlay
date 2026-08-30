import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

test('every documented browser claim builds before its preview server starts', async () => {
  const root = resolve(import.meta.dirname, '..');
  const config = await readFile(resolve(root, 'playwright.config.ts'), 'utf8');
  const claims = JSON.parse(await readFile(resolve(root, '.factory/claims.json'), 'utf8')) as Array<{ test: string }>;

  expect(config).toContain("command: 'npm run build && npm run preview -- --host 127.0.0.1'");
  expect(claims).toHaveLength(12);
  expect(claims.every((claim) => claim.test.startsWith('npm run test:e2e -- '))).toBe(true);
});
