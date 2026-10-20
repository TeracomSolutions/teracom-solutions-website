import test from 'node:test';
import assert from 'node:assert/strict';

import { statusSentences, productStatusLabel, orderStatusLabel, priceSummary, originNote, orderPreview, canSubmit, supplierBadge, searchableSuppliers, fileImportSummary, errorLines, findConnection } from '../marketplaceView.js';

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
test('supplierBadge statuses', () => {
  assert.deepEqual(supplierBadge({ status: 'connected' }), { label: 'Connected', tone: 'good' });
  assert.equal(supplierBadge({ status: 'file' }).label, 'Spreadsheet import');
  const notSetUp = supplierBadge({ status: 'not_set_up' });
  assert.equal(notSetUp.label, 'Needs your key');
  assert.equal(notSetUp.tone, 'warn');
  assert.ok(supplierBadge({ status: 'attention' }).label.includes('not built yet'));
  assert.equal(supplierBadge({ status: 'failing' }).tone, 'bad');
  assert.ok(supplierBadge({ status: 'unknown' }).label.includes('press Test'));
  assert.equal(supplierBadge({ status: 'zzz' }).label, 'zzz');
  assert.equal(supplierBadge(undefined).label, '');
});

test('searchableSuppliers filters can_search', () => {
  const list = [
    { name: 'A', can_search: true },
    { name: 'B', can_search: false },
    { name: 'C' }
  ];
  const result = searchableSuppliers(list);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'A');
  assert.deepEqual(searchableSuppliers(undefined), []);
});

test('fileImportSummary', () => {
  assert.equal(fileImportSummary({ total: 3, created: 2, existing: 0, skipped: 1 }), 'Made 2 drafts, 1 skipped (3 rows read).');
  assert.equal(fileImportSummary({ total: 1, created: 1, existing: 0, skipped: 0 }), 'Made 1 draft (1 row read).');
  assert.ok(fileImportSummary({ total: 3, created: 1, existing: 2, skipped: 0 }).includes('2 already there'));
  assert.equal(fileImportSummary(null), '');
});

test('errorLines', () => {
  assert.deepEqual(errorLines({ errors: [{ row: 2, reason: 'No usable price' }] }), ['Row 2: No usable price']);
  const many = Array.from({ length: 7 }, (_, i) => ({ row: i + 1, reason: 'err' }));
  const result = errorLines({ errors: many });
  assert.equal(result.length, 6);
  assert.equal(result[5], 'and 2 more');
  assert.deepEqual(errorLines(null), []);
});

test('findConnection', () => {
  const list = [{ key: 'marketplace', name: 'Settings' }, { key: 'mp_cj', name: 'CJ' }];
  assert.equal(findConnection(list, 'mp_cj').name, 'CJ');
  assert.equal(findConnection(list, 'nope'), null);
  assert.equal(findConnection(undefined, 'mp_cj'), null);
});

test('supplierBadge tone is always in the allowed set', () => {
  const allowed = ['good', 'warn', 'bad', 'muted'];
  for (const s of ['connected', 'file', 'not_set_up', 'attention', 'failing', 'unknown', 'zzz']) {
    assert.ok(allowed.includes(supplierBadge({ status: s }).tone), 'tone for ' + s + ' not in allowed set');
  }
});

