import test from 'node:test';
import assert from 'node:assert/strict';

import { fromCatalogueRow, mergeCatalogue, slugForSku, tierLabel, unitPriceCents } from '../catalogueMerge.js';
import { memberPriceCents } from '../products.js';

const row = (sku, name, extra = {}) => ({
  sku, name, description: null, price_cents: 10000, category: 'CCTV', brand: 'Hik', supplier: 'Dist', stock: 3,
  tier_prices_cents: { silver: 9500, gold: 9000, platinum: 8500 }, updated_at: '2026-09-20T00:00:00Z', ...extra,
});

test('slugForSku makes a lower-case hyphenated id', () => {
  assert.equal(slugForSku('TS9100VM_DS'), 'ts9100vm-ds');
  assert.equal(slugForSku('  DS-2CD2143G2-I (2.8mm) '), 'ds-2cd2143g2-i-2-8mm');
  assert.equal(slugForSku(''), 'product');
  assert.equal(slugForSku('***'), 'product');
});

test('fromCatalogueRow maps the backend row to the product shape', () => {
  const p = fromCatalogueRow(row('TS9100VM_DS', 'Tecom 9100'));
  assert.equal(p.id, 'ts9100vm-ds');
  assert.equal(p.priceCents, 10000);
  assert.equal(p.type, 'hardware');
  assert.deepEqual(p.tierPricesCents, { silver: 9500, gold: 9000, platinum: 8500 });
  assert.equal(p.description, '');
  assert.equal(p.updatedAt, '2026-09-20T00:00:00Z');
  assert.equal(p.source, 'catalogue');
});

test('mergeCatalogue keeps built-in products first and lets the catalogue set their price', () => {
  const builtIn = [
    { id: 'sample-reader', sku: 'HW-READER-SAMPLE', name: 'Sample Reader', description: 'Built-in copy', priceCents: 29500, category: 'Access Control', type: 'hardware', features: ['RFID'], dateAdded: '2026-09-01' },
    { id: 'design-review', sku: 'SVC-DESIGN-REVIEW', name: 'Design Review', description: 'A service', priceCents: 69900, category: 'Services', type: 'service', features: [] },
  ];
  const merged = mergeCatalogue(builtIn, [row('hw-reader-sample', 'Reader from feed', { price_cents: 24900 }), row('ZZZ-1', 'Zeta'), row('AAA-1', 'Alpha')]);
  assert.deepEqual(merged.map((p) => p.id), ['sample-reader', 'design-review', 'aaa-1', 'zzz-1']);
  const reader = merged[0];
  assert.equal(reader.priceCents, 24900);
  assert.equal(reader.description, 'Built-in copy');
  assert.equal(reader.type, 'hardware');
  assert.deepEqual(reader.features, ['RFID']);
  assert.equal(reader.dateAdded, '2026-09-01');
  assert.equal(reader.source, 'catalogue');
  assert.equal(merged[1].source, 'static');
  assert.equal(merged[1].priceCents, 69900);
});

test('mergeCatalogue keeps ids unique', () => {
  const builtIn = [{ id: 'abc-1', sku: 'OLD', name: 'Old', priceCents: 1, category: 'X', type: 'hardware' }];
  const merged = mergeCatalogue(builtIn, [row('ABC 1', 'One'), row('ABC-1', 'Two'), row('abc_1', 'Three')]);
  assert.deepEqual(merged.map((p) => p.id), ['abc-1', 'abc-1-2', 'abc-1-3', 'abc-1-4']);
  assert.deepEqual(merged.slice(1).map((p) => p.name), ['One', 'Three', 'Two']);
});

test('mergeCatalogue with no rows is the built-in list', () => {
  const builtIn = [{ id: 'a', sku: 'A', name: 'A', priceCents: 1, category: 'X', type: 'hardware' }];
  assert.deepEqual(mergeCatalogue(builtIn, []), [{ ...builtIn[0], source: 'static' }]);
  assert.equal(builtIn[0].source, undefined);
});

test('unitPriceCents: guest RRP, member price, tier price, subscription always RRP', () => {
  const product = fromCatalogueRow(row('X', 'X'));
  const builtIn = { id: 'b', sku: 'B', name: 'B', priceCents: 10000, category: 'X', type: 'hardware' };
  const subscription = { id: 's', sku: 'S', name: 'S', priceCents: 4900, category: 'Software', type: 'subscription', tierPricesCents: { gold: 1 } };
  assert.equal(unitPriceCents(product, null), 10000);
  assert.equal(unitPriceCents(product, { tier: null }), memberPriceCents(product));
  assert.equal(unitPriceCents(product, { tier: 'Gold' }), 9000);
  assert.equal(unitPriceCents(product, { tier: 'PLATINUM' }), 8500);
  assert.equal(unitPriceCents(product, { tier: 'Bronze' }), memberPriceCents(product));
  assert.equal(unitPriceCents(builtIn, { tier: 'Gold' }), memberPriceCents(builtIn));
  assert.equal(unitPriceCents(subscription, { tier: 'Gold' }), 4900);
  assert.equal(unitPriceCents(null, { tier: 'Gold' }), null);
});

test('tierLabel finds the label case-insensitively', () => {
  const tiers = [{ key: 'silver', label: 'Silver' }, { key: 'gold', label: 'Gold' }];
  assert.equal(tierLabel({ tier: 'GOLD' }, tiers), 'Gold');
  assert.equal(tierLabel({ tier: 'Platinum' }, tiers), null);
  assert.equal(tierLabel(null, tiers), null);
  assert.equal(tierLabel({ tier: null }, tiers), null);
});
