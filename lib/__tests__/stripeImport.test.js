import test from 'node:test';
import assert from 'node:assert/strict';

import { importDays, missingRow, shouldImport, stripeId } from '../stripeImport.js';

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

test('one payment or checkout id is accepted, anything else is not', () => {
  assert.equal(stripeId(' pi_3UalECBVl4uBUv0L15WRskRK '), 'pi_3UalECBVl4uBUv0L15WRskRK');
  assert.equal(stripeId('cs_live_a0X0zIzCrQwtufFhHx37V5z3lSf7mDVp'), 'cs_live_a0X0zIzCrQwtufFhHx37V5z3lSf7mDVp');
  assert.equal(stripeId('306'), '');
  assert.equal(stripeId('pi_x; drop'), '');
});

test('a missing order row says who, what and how much', () => {
  const row = missingRow({ id: 'cs_1', created: 5, amount_total: 30600, customer_details: { name: 'Pat', email: 'p@example.test' },
    line_items: { data: [{ quantity: 2, description: 'Device Bridge IoT' }] } });
  assert.deepEqual(row, { id: 'cs_1', created: 5, name: 'Pat', email: 'p@example.test', total_cents: 30600, items: '2 x Device Bridge IoT' });
});
