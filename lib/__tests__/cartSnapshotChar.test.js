import { test } from "node:test";
import assert from "node:assert/strict";
import { snapshotItems, snapshotKey } from "../cartSnapshot.js";

test("items and key", () => {
  assert.deepEqual(snapshotItems([{ sku: 'A1', name: 'Cam', quantity: 2, priceCents: 1000 }]), []);
  assert.deepEqual(snapshotItems([]), []);
  assert.deepEqual(snapshotKey([]), "");
});