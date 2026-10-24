import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ADMIN_PAGES } from '../adminPages.js';
import fs from 'node:fs';

const nav = fs.readFileSync('components/AdminNav.js', 'utf8');
const labels = [...nav.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);

// Test 1: Check that the menu labels include 'Overview', 'Store' and 'About'
test('labels includes Overview, Store and About', () => {
  assert.ok(labels.includes('Overview'));
  assert.ok(labels.includes('Store'));
  assert.ok(labels.includes('About'));
});

// Test 2: Check that for every entry in ADMIN_PAGES whose listed is not false,
// the part of its menu before the first ' > ' is either one of the labels or 'Help (top right)'
test('ADMIN_PAGES menu entries match nav labels', () => {
  for (const page of ADMIN_PAGES) {
    if (page.listed !== false) {
      const menuPart = page.menu.split(' > ')[0];
      assert.ok(
        labels.includes(menuPart) || menuPart === 'Help (top right)',
        `Menu entry '${page.menu}' does not match any nav label or 'Help (top right)'`
      );
    }
  }
});
