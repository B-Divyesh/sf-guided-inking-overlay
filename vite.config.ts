import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const { globalHeaders: productionHeaders } = JSON.parse(
  readFileSync(new URL('./public/staticwebapp.config.json', import.meta.url), 'utf8'),
) as { globalHeaders: Record<string, string> };

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 2048,
  },
  preview: { headers: productionHeaders },
});
