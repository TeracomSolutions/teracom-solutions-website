import { test } from "node:test";
import assert from "node:assert/strict";
import { levelAllows, neededFor } from "../staffAccessRules.js";

test("levels", () => {
  assert.deepEqual(levelAllows('write', 'read'), true);
  assert.deepEqual(levelAllows('read', 'write'), false);
  assert.deepEqual(levelAllows(undefined, 'read'), false);
  assert.deepEqual(neededFor('GET'), "read");
  assert.deepEqual(neededFor('PUT'), "write");
  assert.deepEqual(neededFor('DELETE'), "write");
});