import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

const files = walk(path.resolve('src')).concat(walk(path.resolve('scripts')));
for (const file of files) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
console.log(`Syntax check passed for ${files.length} JavaScript files.`);
