import { rm, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
const approved = path.resolve(root, '../portfolio-approved/dist');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
execFileSync('cp', ['-a', `${approved}/.`, out]);
console.log(`Published approved snapshot into ${path.relative(root, out)}`);
