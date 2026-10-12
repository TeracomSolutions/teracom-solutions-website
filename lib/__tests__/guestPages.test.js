import test from 'node:test';
import assert from 'node:assert/strict';

import { guestRewritePath, guestPathStripped } from '../guestPages.js';

// Test guestRewritePath function
await test('guestRewritePath tests', async () => {
  // Valid product paths
  assert.equal(guestRewritePath('/store/product/cctv'), '/g/store/product/cctv');
  assert.equal(guestRewritePath('/store/product/cctv/'), '/g/store/product/cctv');

  // Valid category paths (not search or product)
  assert.equal(guestRewritePath('/store/security'), '/g/store/security');
  assert.equal(guestRewritePath('/store/security/'), '/g/store/security');
  assert.equal(guestRewritePath('/store/cctv'), '/g/store/cctv');

  // Valid brand paths
  assert.equal(guestRewritePath('/brands/samsung'), '/g/brands/samsung');
  assert.equal(guestRewritePath('/brands/samsung/'), '/g/brands/samsung');

  // Invalid paths - should return null
  assert.equal(guestRewritePath('/store'), null);
  assert.equal(guestRewritePath('/store/search'), null);
  assert.equal(guestRewritePath('/store/product'), null);
  assert.equal(guestRewritePath('/brands'), null);
  assert.equal(guestRewritePath('/cart'), null);
  assert.equal(guestRewritePath('/store/cctv/extra'), null);
  assert.equal(guestRewritePath('/g/store/cctv'), null);

  // Invalid inputs
  assert.equal(guestRewritePath(undefined), null);
  assert.equal(guestRewritePath(null), null);
  assert.equal(guestRewritePath(5), null);
});

// Test guestPathStripped function
await test('guestPathStripped tests', async () => {
  // Valid paths
  assert.equal(guestPathStripped('/g'), '/');
  assert.equal(guestPathStripped('/g/store/cctv'), '/store/cctv');

  // Invalid paths - should return null
  assert.equal(guestPathStripped('/gallery'), null);
  assert.equal(guestPathStripped('/store/cctv'), null);

  // Invalid inputs
  assert.equal(guestPathStripped(undefined), null);
  assert.equal(guestPathStripped(null), null);
  assert.equal(guestPathStripped(5), null);
});