import { test } from "node:test";
import assert from "node:assert/strict";
import { statusTone, statusLabel, channelLabel, xLength } from "../socialFormat.js";

test("labels", () => {
  assert.deepEqual(statusTone('ok'), "muted");
  assert.deepEqual(statusTone('failing'), "bad");
  assert.deepEqual(statusLabel('not_configured'), "Not set up");
  assert.deepEqual(channelLabel('x'), "X");
  assert.deepEqual(channelLabel('email'), "Customer email");
});

test("x length", () => {
  assert.deepEqual(xLength('hello', ''), 5);
  assert.deepEqual(xLength('hello', 'https://example.com/a-long-link'), 29);
});
