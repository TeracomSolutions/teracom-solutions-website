import test from 'node:test';
import assert from 'node:assert/strict';

import { SIDEBAR_DEFAULT, clampSidebarWidth } from '../sidebarWidth.js';

test('the menu stays between 200 and 420 px, 240 by default', () => {
  assert.equal(SIDEBAR_DEFAULT, 240);
  assert.equal(clampSidebarWidth(150), 200);
  assert.equal(clampSidebarWidth(999), 420);
  assert.equal(clampSidebarWidth('300.4'), 300);
  assert.equal(clampSidebarWidth('x'), 240);
});
