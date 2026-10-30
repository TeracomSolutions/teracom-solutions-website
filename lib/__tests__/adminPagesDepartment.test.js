import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ADMIN_PAGES, DEPARTMENT_BY_MENU, departmentOf } from '../adminPages.js';

// Every listed console page belongs to a Department of the Teracom Product Model, or is a Shared Platform
// Service (Robert, 2026-10-31). A new menu item without one fails here.
const ALLOWED = new Set(['Executive', 'Finance', 'Sales', 'Marketing', 'Operations', 'Customer', 'Technology and Protection', 'Shared Platform Service']);

test('every listed page has a Department', () => {
  for (const page of ADMIN_PAGES.filter((entry) => entry.listed !== false)) {
    assert.ok(ALLOWED.has(departmentOf(page)), `${page.path} (${page.menu}) has no Department`);
  }
});

test('the map only uses Product Model names', () => {
  for (const value of Object.values(DEPARTMENT_BY_MENU)) assert.ok(ALLOWED.has(value), value);
});

test('pages outside the menu have none', () => {
  assert.equal(departmentOf({ menu: '' }), '');
  assert.equal(departmentOf(null), '');
  assert.equal(departmentOf({ menu: 'Store > Pricing' }), 'Operations');
});
