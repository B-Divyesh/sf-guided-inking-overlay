import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const templatePath = resolve(root, 'scripts/service-worker.template.js');
const outputPath = resolve(root, 'dist/sw.js');

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return paths.flat();
}

const template = await readFile(templatePath, 'utf8');
const buildFiles = (await filesIn(resolve(root, 'dist'))).filter((path) => path !== outputPath).sort();
const versionHash = createHash('sha256').update(template);
for (const path of buildFiles) versionHash.update(relative(root, path)).update(await readFile(path));
const version = (process.env.GITHUB_SHA || process.env.SWA_RELEASE_ID || versionHash.digest('hex')).slice(0, 16);
await writeFile(outputPath, template.replace('__CACHE_VERSION__', version), 'utf8');
