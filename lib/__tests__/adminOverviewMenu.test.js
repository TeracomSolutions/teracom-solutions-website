import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// The Overview blocks list the same areas as the top menu, in the same order (apart from Overview itself).
test('overview blocks follow the top menu', () => {
  const nav = fs.readFileSync('components/AdminNav.js', 'utf8');
  const page = fs.readFileSync('app/admin/page.js', 'utf8');
  const menu = [...nav.matchAll(/href: '(\/admin[^']*)', label:/g)].map((m) => m[1]).filter((href) => href !== '/admin');
  const blocks = [...page.matchAll(/href: '(\/admin[^']*)',\n/g)].map((m) => m[1]);
  assert.deepEqual(blocks, menu);
});
