import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  artSlugForProduct,
  exGstCents,
  findProductBySlug,
  getRelatedProducts,
  gstCents,
  memberPriceCents,
  MEMBER_DISCOUNT_PERCENT,
  productPath,
  products,
  storeCategoryForProduct,
} from '../products.js';
import { categories } from '../categories.js';

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

test('every product has a unique, URL-safe slug for its product page', () => {
  const slugs = products.map((p) => p.id);
  assert.equal(new Set(slugs).size, slugs.length, 'product ids must be unique');
  for (const slug of slugs) {
    assert.match(slug, /^[a-z0-9-]+$/, `${slug} is not URL-safe`);
  }
});

test('productPath and findProductBySlug round-trip', () => {
  for (const product of products) {
    const path = productPath(product);
    assert.equal(path, `/store/product/${product.id}`);
    assert.equal(findProductBySlug(path.split('/').pop()), product);
  }
  assert.equal(productPath(null), '/store');
  assert.equal(findProductBySlug('no-such-product'), undefined);
});

test('GST is one eleventh of a GST-inclusive price and the two halves add up', () => {
  // The displayed ex-GST figure must never contradict the inclusive one.
  for (const cents of [4500, 12900, 19900, 29500, 69900, 129900, 4900, 14900]) {
    assert.equal(gstCents(cents), Math.round(cents / 11));
    assert.equal(exGstCents(cents) + gstCents(cents), cents);
  }
  assert.equal(gstCents(null), null);
  assert.equal(exGstCents(null), null);
});

test('storeCategoryForProduct only ever returns a real category', () => {
  for (const product of products) {
    const category = storeCategoryForProduct(product);
    if (category) {
      assert.ok(categories.includes(category));
      assert.equal(category.productCategory, product.category);
    }
  }
  assert.equal(storeCategoryForProduct(null), null);
});

test('artSlugForProduct always returns something the hero art can key off', () => {
  for (const product of products) {
    const slug = artSlugForProduct(product);
    assert.match(slug, /^[a-z0-9-]+$/);
  }
});

test('related products share a category and never include the product itself', () => {
  for (const product of products) {
    const related = getRelatedProducts(product);
    assert.ok(related.length <= 3);
    for (const other of related) {
      assert.notEqual(other.id, product.id);
      assert.equal(other.category, product.category);
    }
  }
  assert.deepEqual(getRelatedProducts(null), []);
});
