import { test } from 'node:test';
import assert from 'node:assert/strict';

import { clampPlace, isDrag } from '../assistantShared.js';

test('the floating Tera stays inside the window', () => {
  assert.deepEqual(clampPlace({ right: -50, bottom: 9999 }, { w: 1000, h: 800 }, 64), { right: 8, bottom: 728 });
  assert.deepEqual(clampPlace({ right: 24.4, bottom: 24.6 }, { w: 1000, h: 800 }, 64), { right: 24, bottom: 25 });
  assert.deepEqual(clampPlace({ right: 500, bottom: 500 }, { w: 60, h: 60 }, 64), { right: 8, bottom: 8 });
});

test('a small wobble is a click, not a drag', () => {
  assert.equal(isDrag(2, 3), false);
  assert.equal(isDrag(5, 4), true);
});
