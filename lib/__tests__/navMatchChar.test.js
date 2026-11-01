import { test } from "node:test";
import assert from "node:assert/strict";
import { isAreaActive } from "../adminNavMatch.js";

test("exact and prefix matches", () => {
  assert.deepEqual(isAreaActive({ href: '/admin', exact: true }, '/admin'), true);
  assert.deepEqual(isAreaActive({ href: '/admin', exact: true }, '/admin/sales'), false);
  assert.deepEqual(isAreaActive({ href: '/admin/sales' }, '/admin/sales/123'), true);
  assert.deepEqual(isAreaActive({ href: '/admin/sales', match: ['/admin/orders'] }, '/admin/orders/9'), true);
  assert.deepEqual(isAreaActive({ href: '/admin/sales' }, '/admin/salesx'), false);
});