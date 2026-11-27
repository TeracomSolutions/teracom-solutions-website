import test from 'node:test';
import assert from 'node:assert/strict';

import { importDays, shouldImport } from '../stripeImport.js';

test('only paid one-off live checkouts are imported', () => {
  assert.ok(shouldImport({ id: 'cs_1', mode: 'payment', livemode: true, payment_status: 'paid' }));
  assert.ok(!shouldImport({ id: 'cs_2', mode: 'payment', livemode: true, payment_status: 'unpaid' }));
  assert.ok(!shouldImport({ id: 'cs_3', mode: 'subscription', livemode: true, payment_status: 'paid' }));
  assert.ok(!shouldImport({ id: 'cs_4', mode: 'payment', livemode: false, payment_status: 'paid' }));
  assert.ok(!shouldImport(null));
});

test('days back is bounded', () => {
  assert.equal(importDays(undefined), 90);
  assert.equal(importDays('30'), 30);
  assert.equal(importDays(9999), 365);
  assert.equal(importDays(-3), 90);
});
