import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { AUD, toGaItem, track, trackOnce } from '../gtag.js';

function fakeWindow({ gtag, storage } = {}) {
  const calls = [];
  const store = new Map();
  globalThis.window = {
    gtag: gtag === undefined ? (...args) => calls.push(args) : gtag,
    sessionStorage: storage || {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, v),
    },
  };
  return calls;
}

afterEach(() => {
  delete globalThis.window;
});

test('a missing or broken gtag never throws', () => {
  // An ad blocker replacing gtag with something that throws must not take
  // the page down with it, and roughly one technical visitor in six blocks
  // analytics outright.
  delete globalThis.window;
  assert.equal(track('purchase', {}), false);

  fakeWindow({ gtag: undefined });
  globalThis.window.gtag = undefined;
  assert.equal(track('purchase', {}), false);

  fakeWindow({
    gtag: () => {
      throw new Error('blocked');
    },
  });
  assert.equal(track('purchase', {}), false);
});

test('track passes the event through to gtag', () => {
  const calls = fakeWindow();
  assert.equal(track('contact_click', { contact_method: 'phone' }), true);
  assert.deepEqual(calls, [['event', 'contact_click', { contact_method: 'phone' }]]);
});

test('trackOnce reports a purchase once per session, not once per refresh', () => {
  // Trade customers refresh the confirmation page to re-read an order
  // number. A duplicated purchase is a wrong revenue figure, not a missing
  // one, so it is the worse failure.
  const calls = fakeWindow();
  assert.equal(trackOnce('pi_123', 'purchase', { value: 100 }), true);
  assert.equal(trackOnce('pi_123', 'purchase', { value: 100 }), false);
  assert.equal(calls.length, 1);

  // A different order still reports.
  assert.equal(trackOnce('pi_456', 'purchase', { value: 50 }), true);
  assert.equal(calls.length, 2);
});

test('blocked session storage reports rather than silently dropping the event', () => {
  // A possible duplicate beats a certain absence: private browsing must not
  // make purchases invisible.
  const calls = fakeWindow({
    storage: {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    },
  });
  assert.equal(trackOnce('pi_789', 'purchase', {}), true);
  assert.equal(calls.length, 1);
});

test('a cart line is converted to the shape GA4 expects', () => {
  const product = {
    sku: 'PIR-MOTION-QUAD',
    name: 'Quad PIR Motion Detector',
    category: 'Intrusion',
    type: 'hardware',
    priceCents: 12900,
  };
  assert.deepEqual(toGaItem(product, 3), {
    item_id: 'PIR-MOTION-QUAD',
    item_name: 'Quad PIR Motion Detector',
    item_category: 'Intrusion',
    item_variant: 'hardware',
    price: 129,
    quantity: 3,
  });
  // Member pricing overrides the list price, so the reported value matches
  // what the customer is actually charged.
  assert.equal(toGaItem(product, 1, 11610).price, 116.1);
  // A product with no public price reports no price rather than zero.
  assert.equal(toGaItem({ ...product, priceCents: null }, 1).price, undefined);
  assert.equal(AUD, 'AUD');
});
