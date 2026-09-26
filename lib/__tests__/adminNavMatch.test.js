import test from 'node:test';
import assert from 'node:assert/strict';

import { isAreaActive } from '../adminNavMatch.js';

const overview = { href: '/admin', exact: true };
const store = { href: '/admin/suppliers', match: ['/admin/catalog', '/admin/pricing'] };
const coupons = { href: '/admin/coupons' };

test('Overview is active only at exactly /admin', () => {
  assert.ok(isAreaActive(overview, '/admin'));
  assert.ok(!isAreaActive(overview, '/admin/'));
  assert.ok(!isAreaActive(overview, '/admin/suppliers'));
});

test('Store covers its own path, its children and the matched areas', () => {
  for (const path of ['/admin/suppliers', '/admin/suppliers/abc/def', '/admin/catalog', '/admin/pricing', '/admin/catalog/abc']) {
    assert.ok(isAreaActive(store, path), path);
  }
  for (const path of ['/admin/suppliersx', '/admin/catalogs', '/admin/pricings', '/admin/other', '/admin']) {
    assert.ok(!isAreaActive(store, path), path);
  }
});

test('an area without match only answers for its own prefix', () => {
  assert.ok(isAreaActive(coupons, '/admin/coupons'));
  assert.ok(isAreaActive(coupons, '/admin/coupons/x'));
  assert.ok(!isAreaActive(coupons, '/admin/couponsx'));
  assert.ok(!isAreaActive(coupons, '/admin/suppliers'));
});
