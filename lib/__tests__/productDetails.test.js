import test from 'node:test';
import assert from 'node:assert/strict';

import {
  availabilityText,
  deliveryDateText,
  gtinOf,
  productsForSkus,
  sizeText,
  warrantyText,
  weightText,
} from '../productDetails.js';
import { fromCatalogueRow } from '../catalogueMerge.js';

test('warrantyText reads months as years where it can', () => {
  assert.equal(warrantyText(36), '3 years');
  assert.equal(warrantyText(12), '1 year');
  assert.equal(warrantyText(18), '18 months');
  assert.equal(warrantyText(0), null);
  assert.equal(warrantyText(null), null);
});

test('weight and packed size', () => {
  assert.equal(weightText(2.22), '2.22 kg');
  assert.equal(weightText(0.5), '0.5 kg');
  assert.equal(weightText(null), null);
  assert.equal(sizeText(29, 27.5, 12), '29 × 27.5 × 12 cm');
  assert.equal(sizeText(29, null, 12), null);
});

test('availability says in stock, on order with a date, or available to order', () => {
  assert.equal(availabilityText(9, null), 'In stock');
  assert.equal(availabilityText(0, '2026-10-15'), 'On order, expected 15 October 2026');
  assert.equal(availabilityText(0, null), 'Available to order');
  assert.equal(deliveryDateText('2026-13-01'), null);
});

test('gtinOf accepts only real barcodes', () => {
  assert.equal(gtinOf('4711174726387'), '4711174726387');
  assert.equal(gtinOf('810084694305'), '810084694305');
  assert.equal(gtinOf('ABC123'), null);
  assert.equal(gtinOf(null), null);
});

test('productsForSkus keeps the order, skips missing ones and the product itself', () => {
  const products = [
    { id: 'a', sku: 'NHU-AI-KEY' },
    { id: 'b', sku: 'NHU-UCG-MAX' },
    { id: 'c', sku: 'NHU-UVC-G6' },
  ];
  const found = productsForSkus(products, ['nhu-ucg-max', 'NOT-LIVE', 'NHU-AI-KEY', 'NHU-UVC-G6', 'NHU-UCG-MAX'], 'c');
  assert.deepEqual(found.map((p) => p.id), ['b', 'a']);
  assert.deepEqual(productsForSkus(products, undefined), []);
});

test('fromCatalogueRow carries the feed details', () => {
  const p = fromCatalogueRow({
    sku: 'BASY-DS225+', name: 'DS225+', price_cents: 74900, category: 'NAS & Storage', stock: 9,
    manufacturer_sku: 'DS225+', barcode: '4711174726387', warranty_months: 36, next_delivery: null,
    accessory_skus: ['BASY-HAT3300-4T'], alternative_skus: [],
  });
  assert.equal(p.manufacturerSku, 'DS225+');
  assert.equal(p.barcode, '4711174726387');
  assert.equal(p.warrantyMonths, 36);
  assert.equal(p.nextDelivery, null);
  assert.deepEqual(p.accessorySkus, ['BASY-HAT3300-4T']);
  const bare = fromCatalogueRow({ sku: 'X', name: 'X', price_cents: 1, category: 'X', stock: 0 });
  assert.deepEqual(bare.accessorySkus, []);
  assert.equal(bare.warrantyMonths, null);
});
