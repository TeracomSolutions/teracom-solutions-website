import test from 'node:test';
import assert from 'node:assert/strict';

import { supplierChoices } from '../marketplaceView.js';

test('suppliers not on the tiles are offered, Australian ones first', () => {
  const groups = supplierChoices([
    { name: 'mock', label: 'Practice', region: 'Nowhere', shown: false },
    { name: 'cj', label: 'CJ Dropshipping', region: 'China', shown: true },
    { name: 'doba', label: 'Doba', region: 'United States', shown: false },
    { name: 'wefulfil', label: 'Wefulfil', region: 'Australia and China', shown: false },
    { name: 'dropshipzone', label: 'Dropshipzone', region: 'Australia', shown: false },
  ]);
  assert.deepEqual(groups.map((g) => g.label), ['Australian', 'Overseas']);
  assert.deepEqual(groups[0].suppliers.map((s) => s.name), ['dropshipzone', 'wefulfil']);
  assert.deepEqual(groups[1].suppliers.map((s) => s.name), ['doba']);
  assert.deepEqual(supplierChoices([]), []);
});
