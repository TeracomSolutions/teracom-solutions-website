import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  TOOL_STORE_CATEGORIES,
  linkedStoreCategorySlugs,
  storeCategoriesForTool,
  toolsForStoreCategory,
} from '../storeLinks.js';
import { categories } from '../categories.js';
import { tools } from '../tools.js';

test('every calculator has somewhere to send you afterwards', () => {
  // A calculator that answers a buying question and offers nowhere to buy is
  // the gap this map exists to close, so a new tool must not slip through.
  for (const tool of tools) {
    const linked = storeCategoriesForTool(tool.slug);
    assert.ok(linked.length > 0, `${tool.slug} points at no store category`);
  }
});

test('every mapped slug is a real store category', () => {
  const slugs = new Set(categories.map((c) => c.slug));
  for (const [tool, mapped] of Object.entries(TOOL_STORE_CATEGORIES)) {
    for (const slug of mapped) {
      assert.ok(slugs.has(slug), `${tool} points at "${slug}", which is not a category`);
    }
  }
});

test('every mapped tool is a real tool', () => {
  const slugs = new Set(tools.map((t) => t.slug));
  for (const slug of Object.keys(TOOL_STORE_CATEGORIES)) {
    assert.ok(slugs.has(slug), `"${slug}" is not a tool`);
  }
});

test('the mapping stays narrow enough to be useful', () => {
  // Listed against five categories is listed against none.
  for (const [tool, mapped] of Object.entries(TOOL_STORE_CATEGORIES)) {
    assert.ok(mapped.length <= 3, `${tool} points at ${mapped.length} categories`);
    assert.equal(new Set(mapped).size, mapped.length, `${tool} repeats a category`);
  }
});

test('the reverse lookup agrees with the forward one', () => {
  for (const tool of tools) {
    for (const category of storeCategoriesForTool(tool.slug)) {
      const back = toolsForStoreCategory(category.slug).map((t) => t.slug);
      assert.ok(back.includes(tool.slug), `${category.slug} does not link back to ${tool.slug}`);
    }
  }
  assert.deepEqual(toolsForStoreCategory(null), []);
  assert.deepEqual(toolsForStoreCategory('not-a-category'), []);
});

test('an unknown tool slug returns nothing rather than throwing', () => {
  assert.deepEqual(storeCategoriesForTool('not-a-tool'), []);
  assert.deepEqual(storeCategoriesForTool(undefined), []);
});

test('the calculators reach a decent spread of the store', () => {
  const linked = linkedStoreCategorySlugs();
  assert.ok(linked.length >= 8, `only ${linked.length} categories are reachable from a calculator`);
});
