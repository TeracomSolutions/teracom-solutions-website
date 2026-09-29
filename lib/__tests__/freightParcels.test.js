import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cleanPostcode, freightItems } from '../freightParcels.js';

test('only physical items go to the freight quote', () => {
  const lines = [
    { item: { quantity: 2 }, product: { type: 'hardware', weightKg: 1.5, lengthCm: 30, widthCm: 20, heightCm: 10 } },
    { item: { quantity: 1 }, product: { type: 'service' } },
    { item: { quantity: 1 }, product: { type: 'hardware' } },
  ];
  assert.deepEqual(freightItems(lines), [
    { quantity: 2, weight_kg: 1.5, length_cm: 30, width_cm: 20, height_cm: 10 },
    { quantity: 1, weight_kg: null, length_cm: null, width_cm: null, height_cm: null },
  ]);
});

test('a cart with no physical items needs no quote', () => {
  assert.deepEqual(freightItems([{ item: { quantity: 1 }, product: { type: 'digital' } }]), []);
});

test('postcodes are four digits', () => {
  assert.equal(cleanPostcode(' 3201 '), '3201');
  assert.equal(cleanPostcode('VIC 3000'), '3000');
  assert.equal(cleanPostcode('320'), '');
  assert.equal(cleanPostcode(null), '');
});
