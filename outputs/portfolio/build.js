import { mkdir, rm, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
const files = ['index.html', 'app.js', 'styles.css', '404.html', 'design-process.html', '_redirects'];
const dirs = ['assets', 'experience', 'sketchbook', 'design-process'];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of files) {
  const src = path.join(root, file);
  if (existsSync(src)) await copyFile(src, path.join(out, file));
}
for (const dir of dirs) {
  const src = path.join(root, dir);
  if (existsSync(src)) execFileSync('cp', ['-R', src, out]);
}
console.log(`Built portfolio into ${path.relative(root, out)}`);
