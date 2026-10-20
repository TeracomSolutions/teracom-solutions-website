import test from 'node:test';
import assert from 'node:assert/strict';
import { humanise, shortDetail, detailEntries, exportQuery } from '../auditView.js';

test('humanise converts snake_case to human readable text', () => {
  assert.equal(humanise('store_product_updated'), 'Store product updated');
  assert.equal(humanise(''), '');
  assert.equal(humanise(undefined), '');
});

test('shortDetail builds a readable one-line summary', () => {
  assert.equal(shortDetail({ sku: 'A1', name: 'Cam', note: '', gone: null }), 'sku: A1, name: Cam');
  assert.equal(shortDetail(null), '');
  const long = { key: 'a'.repeat(200) };
  const out = shortDetail(long);
  assert.ok(out.length <= 80);
  assert.ok(out.endsWith('...'));
});

test('shortDetail serialises nested objects', () => {
  assert.equal(shortDetail({ nested: { a: 1 } }), 'nested: {"a":1}');
});

test('detailEntries returns labelled rows in the expected order', () => {
  const row = {
    id: 'x1',
    at: '2026-10-20T01:00:00+00:00',
    who: 'Sharon',
    text: 'Product changed: sku A1',
    area: 'Store',
    label: 'Product changed',
    event_type: 'store_product_updated',
    detail: { sku: 'A1', empty: '', count: 3 }
  };
  const entries = detailEntries(row);
  const labels = entries.map(e => e.label);
  assert.deepEqual(labels, ['When', 'Who', 'What happened', 'Where', 'Kind', 'Sku', 'Count', 'Entry id']);
  assert.equal(entries.find(e => e.label === 'Who').value, 'Sharon');
  assert.equal(entries.find(e => e.label === 'Kind').value, 'Product changed');
  assert.ok(entries.find(e => e.label === 'When').value.includes('12:00'));
});

test('detailEntries falls back to humanise and skips empty values', () => {
  const row = {
    id: 'x2',
    at: '2026-10-20T01:00:00+00:00',
    who: 'Sharon',
    text: 'Something happened',
    area: '',
    label: '',
    event_type: 'store_product_updated',
    detail: null
  };
  const entries = detailEntries(row);
  const labels = entries.map(e => e.label);
  assert.ok(!labels.includes('Where'));
  const kind = entries.find(e => e.label === 'Kind');
  assert.equal(kind.value, 'Store product updated');
});

test('exportQuery builds a URL query string from valid filters', () => {
  assert.equal(exportQuery({}), '');
  assert.equal(
    exportQuery({ q: ' cam ', eventType: 'store_product_updated', since: '2026-10-01', until: '2026-10-31' }),
    '?q=cam&event_type=store_product_updated&since=2026-10-01&until=2026-10-31'
  );
  assert.equal(exportQuery({ q: 'a b&c' }), '?q=a%20b%26c');
});

test('exportQuery ignores dates that are not YYYY-MM-DD', () => {
  assert.equal(exportQuery({ since: 'yesterday', until: '2026-1-1' }), '');
});
