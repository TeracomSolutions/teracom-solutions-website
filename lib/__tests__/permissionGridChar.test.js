import { test } from "node:test";
import assert from "node:assert/strict";
import { canSee, partChoice } from "../permissionGrid.js";

test("grid reads", () => {
  assert.deepEqual(canSee({ store: 'read' }, 'store'), true);
  assert.deepEqual(canSee({}, 'store'), false);
  assert.deepEqual(partChoice({ store: 'write' }, 'store.pricing'), "inherit");
  assert.deepEqual(partChoice({ store: 'write', 'store.pricing': 'none' }, 'store.pricing'), "none");
});