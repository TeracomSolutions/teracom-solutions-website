import test from 'node:test';
import assert from 'node:assert/strict';

import { cleanMergeRequest, dollars, describePreview } from '../productMerge.js';

// Test cleanMergeRequest
await test('cleanMergeRequest - good request', () => {
  const result = cleanMergeRequest({ keepId: 'AAAAAAAA-1111-1111-1111-111111111111', dropId: '22222222-2222-2222-2222-222222222222' });
  assert.deepStrictEqual(result, {
    keep_id: 'aaaaaaaa-1111-1111-1111-111111111111',
    drop_id: '22222222-2222-2222-2222-222222222222'
  });
});

await test('cleanMergeRequest - bad requests', () => {
  assert.deepStrictEqual(cleanMergeRequest(null), { error: 'Choose the two products to merge.' });
  assert.deepStrictEqual(cleanMergeRequest({}), { error: 'Choose the two products to merge.' });
  assert.deepStrictEqual(cleanMergeRequest({ keepId: 'x', dropId: 'y' }), { error: 'Choose the two products to merge.' });
  assert.deepStrictEqual(cleanMergeRequest({ keepId: 'AAAAAAAA-1111-1111-1111-111111111111' }), { error: 'Choose the two products to merge.' });
  assert.deepStrictEqual(cleanMergeRequest({ dropId: '22222222-2222-2222-2222-222222222222' }), { error: 'Choose the two products to merge.' });
  assert.deepStrictEqual(cleanMergeRequest({ keepId: 'AAAAAAAA-1111-1111-1111-111111111111', dropId: 'AAAAAAAA-1111-1111-1111-111111111111' }), { error: 'Choose two different products.' });
});

// Test dollars function
await test('dollars', () => {
  assert.strictEqual(dollars(45000), '$450.00');
  assert.strictEqual(dollars(0), '$0.00');
  assert.strictEqual(dollars(5), '$0.05');
  assert.strictEqual(dollars(null), 'no cost');
  assert.strictEqual(dollars(-250), '-$2.50');
});

// Test describePreview function
await test('describePreview', () => {
  const preview = {
    keep: { sku: 'BASY-DS124' },
    drop: { sku: 'DS124' },
    offers_after: [
      { supplier_name: 'Leader', supplier_sku: 'BASY-DS124', cost_cents: 45000, stock: 3 },
      { supplier_name: 'MMT', supplier_sku: 'DS124', cost_cents: 40000, stock: 5 }
    ],
    cost_before: 45000,
    cost_after: 40000,
    price_effect: 'tier prices change'
  };

  const result = describePreview(preview);

  assert.ok(result.length > 0, 'Result should not be empty');

  // Check first item
  assert.ok(result[0].includes('Keeps SKU BASY-DS124 and moves the offers of SKU DS124 onto it.'));

  // Check that all expected phrases are present
  assert.ok(result.some(item => item.includes('Leader sells it as BASY-DS124 for $450.00 with 3 in stock.')));
  assert.ok(result.some(item => item.includes('MMT sells it as DS124 for $400.00 with 5 in stock.')));
  assert.ok(result.some(item => item.includes('The cost used becomes $400.00 (it was $450.00).')));
  assert.ok(result.some(item => item.includes('Customer tier prices will change because the cost changes.')));

  // Check last item
  assert.ok(result[result.length - 1].includes('The other product stays in the catalogue, hidden, so its history is kept.'));
});

await test('describePreview with price_effect none', () => {
  const preview = {
    keep: { sku: 'BASY-DS124' },
    drop: { sku: 'DS124' },
    offers_after: [
      { supplier_name: 'Leader', supplier_sku: 'BASY-DS124', cost_cents: 45000, stock: 3 },
      { supplier_name: 'MMT', supplier_sku: 'DS124', cost_cents: 40000, stock: 5 }
    ],
    cost_before: 45000,
    cost_after: 40000,
    price_effect: 'none'
  };

  const result = describePreview(preview);

  assert.ok(result.some(item => item.includes('Customer prices do not change.')));
  assert.ok(!result.some(item => item.includes('tier prices will change')));
});

await test('describePreview with empty preview', () => {
  const result = describePreview({});

  // Check that result is empty array
  assert.deepStrictEqual(result, []);
});

await test('describePreview with null preview', () => {
  const result = describePreview(null);

  // Check that result is empty array
  assert.deepStrictEqual(result, []);
});