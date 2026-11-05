import test from 'node:test';
import assert from 'node:assert/strict';

import { COLUMNS, comparisonCsv, comparisonRow } from '../comparisonFeed.js';

const item = {
  id: 'Q1971-E', title: 'AXIS Q1971-E, "thermal"', brand: 'AXIS', mpn: 'Q1971-E', price: '1200.00 AUD', salePrice: '999.00 AUD',
  link: 'https://x/store/product/q1971-e', imageLink: 'https://x/i.webp', productType: 'Cameras', availability: 'backorder',
  description: 'A thermal camera,\nfor perimeters.',
};

test('a row takes the sale price and plain availability words', () => {
  const row = comparisonRow(item);
  assert.equal(row.length, COLUMNS.length);
  assert.equal(row[5], '999.00');
  assert.equal(row[9], 'Available to order');
});

test('the CSV quotes commas and quotes and keeps one line per product', () => {
  const csv = comparisonCsv([item]);
  const lines = csv.trim().split('\n');
  assert.equal(lines.length, 2);
  assert.ok(lines[1].startsWith('"AXIS Q1971-E, ""thermal""",AXIS,Q1971-E,,Q1971-E,999.00,'));
  assert.ok(lines[1].endsWith('"A thermal camera, for perimeters."'));
});
