import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Every pose TeraPose knows has its picture in public/assets/tera, and every
// picture in that folder is a pose TeraPose knows.
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = readFileSync(join(root, 'components', 'TeraPose.js'), 'utf8');
const files = [...source.matchAll(/file: '(tera-[a-z-]+[.]webp)'/g)].map((m) => m[1]);

test('every pose has a picture', () => {
  assert.ok(files.length >= 11, `found ${files.length} poses`);
  for (const file of files) {
    assert.ok(existsSync(join(root, 'public', 'assets', 'tera', file)), file);
  }
  assert.equal(new Set(files).size, files.length, 'no pose listed twice');
});
