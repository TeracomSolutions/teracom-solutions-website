import test from 'node:test';
import assert from 'node:assert/strict';

import { brandKey, hasBrandPage } from '../brandPages.js';
import { categories } from '../categories.js';

test('brandKey keeps letters and digits only, lower case', () => {
  assert.equal(brandKey('UNV / Uniview'), 'unvuniview');
  assert.equal(brandKey('Power Shield'), 'powershield');
  assert.equal(brandKey(null), '');
});

test('hasBrandPage matches a brand page by name or slug', () => {
  assert.equal(hasBrandPage('Ubiquiti'), true);
  assert.equal(hasBrandPage('POWERSHIELD'), true);
  assert.equal(hasBrandPage('Uniview'), true);
  assert.equal(hasBrandPage('No Such Brand Pty'), false);
  assert.equal(hasBrandPage(''), false);
});

test('every store category except New Arrivals lists the products under its title', () => {
  for (const category of categories) {
    if (category.isDynamic) {
      assert.equal(category.productCategory, undefined);
    } else {
      assert.ok(category.productCategory, category.slug);
    }
  }
  assert.equal(categories.find((c) => c.slug === 'networking').productCategory, 'Networking');
  assert.equal(categories.find((c) => c.slug === 'nas').productCategory, 'NAS & Storage');
});
