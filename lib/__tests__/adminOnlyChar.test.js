import { test } from "node:test";
import assert from "node:assert/strict";
import { adminOnlyOn, adminOnlyAction } from "../adminOnly.js";

test("switch", () => {
  assert.deepEqual(adminOnlyOn({ ADMIN_ONLY: 'true' }), true);
  assert.deepEqual(adminOnlyOn({ ADMIN_ONLY: 'false' }), false);
  assert.deepEqual(adminOnlyOn({}), false);
});

test("actions by path", () => {
  assert.deepEqual(adminOnlyAction('/'), "console");
  assert.deepEqual(adminOnlyAction('/admin/login'), "next");
  assert.deepEqual(adminOnlyAction('/api/admin/me'), "next");
  assert.deepEqual(adminOnlyAction('/api/checkout'), "not_found");
  assert.deepEqual(adminOnlyAction('/store'), "console");
});
