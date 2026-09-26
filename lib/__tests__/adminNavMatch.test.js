import test from 'node:test';
import assert from 'node:assert/strict';

import { isAreaActive } from '../adminNavMatch.js';

// Test cases for isAreaActive function

// Overview area - exact match only
const overview = { href: '/admin', exact: true };

// Store area - matches main suppliers path and catalog/pricing paths
const store = { href: '/admin/suppliers', match: ['/admin/catalog', '/admin/pricing'] };

// Coupons area - single path, no match array
const coupons = { href: '/admin/coupons' };

test('Overview area is active only at /admin', () => {
  assert.ok(isAreaActive(overview, '/admin'));
  assert.ok(!isAreaActive(overview, '/admin/'));
  assert.ok(!isAreaActive(overview, '/admin/suppliers'));
  assert.ok(!isAreaActive(overview, '/admin/couponsx'));
});

// Test Store area
// Should be active at /admin/suppliers and sub-paths
// Should be active at /admin/catalog and /admin/pricing and their sub-paths
// Should NOT be active at other paths

// Store main path
assert.ok(isAreaActive(store, '/admin/suppliers'));
assert.ok(isAreaActive(store, '/admin/suppliers/abc/def'));
assert.ok(isAreaActive(store, '/admin/catalog'));
assert.ok(isAreaActive(store, '/admin/pricing'));
assert.ok(isAreaActive(store, '/admin/catalog/abc'));
assert.ok(isAreaActive(store, '/admin/pricing/abc'));

// Store NOT active at other paths
assert.ok(!isAreaActive(store, '/admin/suppliersx'));
assert.ok(!isAreaActive(store, '/admin/catalogs'));
assert.ok(!isAreaActive(store, '/admin/pricings'));
assert.ok(!isAreaActive(store, '/admin/other'));

// Test Coupons area - single path
assert.ok(isAreaActive(coupons, '/admin/coupons'));
assert.ok(!isAreaActive(coupons, '/admin/couponsx'));
assert.ok(!isAreaActive(coupons, '/admin/suppliers'));
