import assert from 'node:assert/strict';
import test from 'node:test';

import { adminOnlyAction, adminOnlyOn } from '../adminOnly.js';

test('only ADMIN_ONLY=true switches it on', () => {
  assert.equal(adminOnlyOn({ ADMIN_ONLY: 'true' }), true);
  assert.equal(adminOnlyOn({ ADMIN_ONLY: 'TRUE ' }), true);
  assert.equal(adminOnlyOn({ ADMIN_ONLY: '1' }), false);
  assert.equal(adminOnlyOn({}), false);
});

test('the console answers; public pages go to it; other API calls are not found', () => {
  assert.equal(adminOnlyAction('/admin'), 'next');
  assert.equal(adminOnlyAction('/admin/login'), 'next');
  assert.equal(adminOnlyAction('/api/admin/me'), 'next');
  assert.equal(adminOnlyAction('/api/voice/config'), 'next');
  assert.equal(adminOnlyAction('/'), 'console');
  assert.equal(adminOnlyAction('/store/cctv'), 'console');
  assert.equal(adminOnlyAction('/administrator'), 'console');
  assert.equal(adminOnlyAction('/api/checkout'), 'not_found');
  assert.equal(adminOnlyAction('/api/webhooks/stripe'), 'not_found');
  assert.equal(adminOnlyAction('/api/adminx'), 'not_found');
});
