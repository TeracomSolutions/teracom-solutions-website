import test from 'node:test';
import assert from 'node:assert/strict';

import { statusSentences, productStatusLabel, orderStatusLabel, priceSummary, originNote, orderPreview, canSubmit } from '../marketplaceView.js';

test('statusSentences off', () => {
  const a = statusSentences(undefined);
  const b = statusSentences({ mode: 'off' });
  assert.equal(a.length, 1);
  assert.equal(b.length, 1);
  assert.ok(a[0].includes('switched off'));
  assert.ok(b[0].includes('switched off'));
});

test('statusSentences read-only', () => {
  const result = statusSentences({ mode: 'read-only', orders_enabled: false, privacy_updated: false });
  assert.equal(result.length, 3);
  assert.ok(result[0].includes('read only'));
});

test('statusSentences live', () => {
  const result = statusSentences({ mode: 'live', orders_enabled: true, privacy_updated: true });
  assert.equal(result.length, 2);
  assert.ok(result[0].includes('are on'));
  assert.ok(result[1].includes('still needs your approval'));
});

test('productStatusLabel', () => {
  assert.equal(productStatusLabel('draft'), 'Waiting for your approval');
  assert.equal(productStatusLabel('approved'), 'Approved');
  assert.equal(productStatusLabel('rejected'), 'Rejected');
  assert.equal(productStatusLabel('x'), 'x');
});

test('orderStatusLabel', () => {
  assert.equal(orderStatusLabel('pending'), 'Ready to send');
  assert.equal(orderStatusLabel('submitted'), 'Sent to the supplier');
  assert.equal(orderStatusLabel('shipped'), 'Shipped');
  assert.equal(orderStatusLabel('failed'), 'Failed');
});

test('priceSummary null and blocked', () => {
  const nullResult = priceSummary(null);
  assert.equal(nullResult.text, '');
  assert.equal(nullResult.blocked, false);

  const blocked = priceSummary({ blocked: true, reason: 'The price is at or below cost' });
  assert.equal(blocked.blocked, true);
  assert.equal(blocked.text, 'The price is at or below cost');
});

test('priceSummary normal', () => {
  const result = priceSummary({ price_cents: 3540, margin_cents: 1000, margin_percent: 28.2, blocked: false });
  assert.ok(result.text.includes('$35.40'));
  assert.ok(result.text.includes('$10.00'));
  assert.ok(result.text.includes('28.2%'));
  assert.equal(result.blocked, false);
});

test('originNote', () => {
  assert.ok(originNote('CN').includes('overseas (CN)'));
  assert.equal(originNote('AU'), '');
  assert.equal(originNote(undefined), '');
});

test('orderPreview', () => {
  const full = orderPreview({
    order_ref: 'R1',
    items: [{ provider_product_id: 'MOCK-001', quantity: 2 }],
    recipient: { name: 'Alex', phone: '0400', email: 'a@b.c', address: { line1: '1 High St', line2: '', city: 'Melbourne', state: 'VIC', postcode: '3000', country: 'AU' } }
  });
  assert.equal(full.reference, 'R1');
  assert.deepEqual(full.items, ['2 x MOCK-001']);
  assert.deepEqual(full.recipient, ['Alex', '0400', 'a@b.c', '1 High St, Melbourne, VIC, 3000, AU']);

  const empty = orderPreview({});
  assert.equal(empty.reference, '');
  assert.deepEqual(empty.items, []);
  assert.deepEqual(empty.recipient, []);
});

test('canSubmit', () => {
  assert.equal(canSubmit({ status: 'pending' }, { orders_enabled: true, mode: 'live' }), true);
  assert.equal(canSubmit({ status: 'submitted' }, { orders_enabled: true, mode: 'live' }), false);
  assert.equal(canSubmit({ status: 'pending' }, { orders_enabled: false, mode: 'live' }), false);
  assert.equal(canSubmit({ status: 'pending' }, { orders_enabled: true, mode: 'off' }), false);
  assert.equal(canSubmit(null, { orders_enabled: true, mode: 'live' }), false);
});
