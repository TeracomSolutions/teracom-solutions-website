import test from 'node:test';
import assert from 'node:assert/strict';

import { MIN_DESCRIPTION, THIN_ROBOTS, isThinProduct } from '../thinProducts.js';

const words = 'A console cable for the management port of Axis switches.';

test('a catalogue product with no photo is thin', () => {
  assert.equal(isThinProduct({ source: 'catalogue', imageUrl: null, description: words }), true);
  assert.equal(isThinProduct({ source: 'catalogue', imageUrl: '   ', description: words }), true);
});

test('a catalogue product with no description, or a short one, is thin', () => {
  assert.equal(isThinProduct({ source: 'catalogue', imageUrl: 'https://x/a.webp', description: '' }), true);
  assert.equal(isThinProduct({ source: 'catalogue', imageUrl: 'https://x/a.webp' }), true);
  assert.equal(isThinProduct({ source: 'catalogue', imageUrl: 'https://x/a.webp', description: 'Too short.' }), true);
  assert.equal(MIN_DESCRIPTION, 40);
});

test('a catalogue product with a photo and a real description is not thin', () => {
  assert.equal(isThinProduct({ source: 'catalogue', imageUrl: 'https://x/a.webp', description: words }), false);
});

test('built-in products are never thin, and nothing at all is not thin either', () => {
  assert.equal(isThinProduct({ source: 'static', imageUrl: null, description: '' }), false);
  assert.equal(isThinProduct({ id: 'x' }), false);
  assert.equal(isThinProduct(null), false);
  assert.equal(isThinProduct(undefined), false);
});

test('the thin page directive keeps the page out of Google but lets it follow links', () => {
  assert.deepEqual(THIN_ROBOTS, { robots: { index: false, follow: true } });
});
