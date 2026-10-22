import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, findCategory } from '../categories.js';

test('categories is a non-empty array and every entry has a non-empty string slug', () => {
  assert.ok(Array.isArray(categories));
  assert.ok(categories.length > 0);

  for (const category of categories) {
    assert.ok(typeof category.slug === 'string');
    assert.ok(category.slug.length > 0);
  }
});

test('the slugs are all different from each other', () => {
  const slugSet = new Set(categories.map(c => c.slug));
  assert.equal(slugSet.size, categories.length);
});

test('findCategory returns the correct category object or falsy for non-existent slugs', () => {
  const firstCategory = categories[0];
  const found = findCategory(firstCategory.slug);
  assert.equal(found, firstCategory);

  const notFound = findCategory('no-such-category-slug');
  assert.ok(!notFound);
});
