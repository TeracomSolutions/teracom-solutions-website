import { test } from 'node:test';
import assert from 'node:assert/strict';

import { safeNextPath } from '../safeNext.js';

test('safeNextPath allows same-site paths only', () => {
  assert.equal(safeNextPath('/cart'), '/cart');
  assert.equal(safeNextPath('/store/cctv?x=1'), '/store/cctv?x=1');
  assert.equal(safeNextPath(null), '/account');
  assert.equal(safeNextPath(''), '/account');
  assert.equal(safeNextPath('https://evil.example'), '/account');
  assert.equal(safeNextPath('//evil.example'), '/account');
  assert.equal(safeNextPath('/\\evil.example'), '/account');
});
