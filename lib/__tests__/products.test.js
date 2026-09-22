import { test } from 'node:test';
import assert from 'node:assert/strict';

import { memberPriceCents, MEMBER_DISCOUNT_PERCENT } from '../products.js';

test('member price takes the member discount off store items', () => {
  assert.equal(MEMBER_DISCOUNT_PERCENT, 10);
  assert.equal(memberPriceCents({ priceCents: 29500, type: 'hardware' }), 26550);
  assert.equal(memberPriceCents({ priceCents: 69900, type: 'service' }), 62910);
  assert.equal(memberPriceCents({ priceCents: 4500, type: 'hardware' }), 4050);
});

test('subscriptions and unpriced items are not discounted', () => {
  assert.equal(memberPriceCents({ priceCents: 4900, type: 'subscription' }), 4900);
  assert.equal(memberPriceCents({ priceCents: null, type: 'hardware' }), null);
  assert.equal(memberPriceCents(undefined), null);
});
