import { test } from 'node:test';
import assert from 'node:assert/strict';

import { warrantyEntries } from '../warranties.js';
import { brands } from '../brands.js';

test('every brand has a warranty entry', () => {
  const slugs = new Set(warrantyEntries.map((w) => w.slug));
  for (const b of brands) assert.ok(slugs.has(b.slug), b.slug);
});

test('warranty links are https manufacturer pages or the contact page', () => {
  for (const w of warrantyEntries) {
    assert.ok(w.url === '/contact' || w.url.startsWith('https://'), w.slug + ': ' + w.url);
    assert.equal(w.external, w.url.startsWith('https://'));
    assert.ok(w.note && w.note.length <= 160, w.slug);
  }
});

test('entries are sorted by name', () => {
  const names = warrantyEntries.map((w) => w.name);
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  assert.deepEqual(names, sorted);
});
