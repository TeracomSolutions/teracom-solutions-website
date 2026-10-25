import assert from 'node:assert/strict';
import test from 'node:test';

import { snapshotItems, snapshotKey } from '../cartSnapshot.js';

test('a saved cart holds code, name, quantity and price only', () => {
  const items = snapshotItems([
    { productId: 'p1', quantity: 2, product: { sku: 'C1', name: 'Dome camera', priceCents: 1100, cost: 700 } },
    { productId: 'p2', quantity: 1, product: null },
    { productId: 'p3', quantity: 0, product: { sku: 'C3', name: 'x', priceCents: 1 } },
    { productId: 'p4', quantity: 1.7, product: { name: 'No code', priceCents: 50 } },
  ]);
  assert.deepEqual(items, [
    { sku: 'C1', name: 'Dome camera', quantity: 2, unit_price_cents: 1100 },
    { sku: 'p4', name: 'No code', quantity: 1, unit_price_cents: 50 },
  ]);
  assert.equal(snapshotKey(items), 'C1x2|p4x1');
  assert.deepEqual(snapshotItems(null), []);
});
