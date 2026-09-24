import { test } from 'node:test';
import assert from 'node:assert/strict';

import { products as PRODUCTS } from '../products.js';
import { needsShipping, resolveLines, subtotalCents, totalCents } from '../cartPricing.js';

const hardware = PRODUCTS.find((p) => p.type === 'hardware');
const digital = PRODUCTS.find((p) => p.type !== 'hardware' && p.type !== 'subscription');

test('a discount never makes the goods total negative', () => {
  // Stripe rejects a negative amount, and no customer should ever be shown
  // one. A $500 code on a $30 order takes the order to zero, not to -$470.
  assert.equal(totalCents({ subtotal: 3000, discount: 50000 }), 0);
  assert.equal(totalCents({ subtotal: 3000, discount: 3000 }), 0);
});

test('a discount does not eat into the shipping line', () => {
  // Freight costs us the same whatever the customer paid for the goods, so a
  // discount bigger than the goods must not start paying for delivery.
  assert.equal(totalCents({ subtotal: 3000, shipping: 1500, discount: 50000 }), 1500);
  assert.equal(totalCents({ subtotal: 10000, shipping: 1500, discount: 2000 }), 9500);
});

test('a negative discount cannot be used to inflate a total', () => {
  assert.equal(totalCents({ subtotal: 10000, discount: -5000 }), 10000);
});

test('no discount leaves the total exactly as it was', () => {
  assert.equal(totalCents({ subtotal: 10000, shipping: 1500 }), 11500);
});

test('a product that has left the catalogue is reported, not silently dropped', () => {
  // Quietly ignoring it would charge for a shorter order than the customer
  // thinks they are buying.
  const { lines, missing } = resolveLines([
    { productId: digital.id, quantity: 1 },
    { productId: 'no-such-product', quantity: 4 },
  ]);
  assert.equal(lines.length, 1);
  assert.deepEqual(missing, ['no-such-product']);
});

test('the subtotal is built from the catalogue, not from the request', () => {
  // The browser sends ids and quantities. If it could send prices, the
  // minimum-spend rule on a coupon would be trivially defeated.
  const { lines } = resolveLines([{ productId: digital.id, quantity: 3 }]);
  const expected = subtotalCents(lines);
  assert.ok(expected > 0);
  assert.equal(expected % 1, 0, 'cents must stay whole');

  const single = resolveLines([{ productId: digital.id, quantity: 1 }]).lines;
  assert.equal(expected, subtotalCents(single) * 3);
});

test('shipping applies only when something physical is in the cart', () => {
  if (hardware) {
    assert.equal(needsShipping(resolveLines([{ productId: hardware.id, quantity: 1 }]).lines), true);
  }
  assert.equal(needsShipping(resolveLines([{ productId: digital.id, quantity: 1 }]).lines), false);
});

test('an empty cart has no subtotal and needs no shipping', () => {
  assert.equal(subtotalCents([]), 0);
  assert.equal(needsShipping([]), false);
});
