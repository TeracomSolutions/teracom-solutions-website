import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SEARCH_PAGE_SIZE,
  normalise,
  pageWindow,
  queryTokens,
  scoreProduct,
  searchHref,
  searchProducts,
  squash,
  tileMatches,
} from '../storeSearch.js';

const product = (id, name, extra = {}) => ({
  id, sku: id.toUpperCase(), name, brand: 'Axis', category: 'CCTV', description: '', imageUrl: null, ...extra,
});

const CATALOGUE = [
  product('q1972-e', 'AXIS Q1972-E thermal camera 35 mm', { sku: '02099-001', manufacturerSku: 'Q1972-E', description: 'Outdoor perimeter protection' }),
  product('m3098-v', 'AXIS M3098-V panoramic dome camera', { sku: '02365-001', imageUrl: 'https://x/a.webp' }),
  product('ds-2cd2143g2-i', 'Hikvision 4MP AcuSense fixed dome', { sku: 'DS-2CD2143G2-I', brand: 'Hikvision' }),
  product('hid-reader', 'HID OMNIKEY 5022 contactless reader', { sku: 'R50220318-CR', brand: 'HID', category: 'Access Control' }),
  product('optex-ax', 'OPTEX AX-200TN dual beam detector', { sku: '8413', brand: 'Optex', category: 'Intrusion' }),
  product('ups-1', 'PowerShield 1000VA UPS', { brand: 'PowerShield', category: 'UPS & Power Protection' }),
];

test('words are lower case, plain and without plural endings', () => {
  assert.equal(normalise('  DS-2CD2143G2-I & more  '), 'ds 2cd2143g2 i and more');
  assert.equal(normalise(null), '');
  assert.equal(squash('DS-2CD 2143'), 'ds2cd2143');
  assert.deepEqual(queryTokens('The Dome Cameras for Access'), ['dome', 'camera', 'acces']);
  assert.deepEqual(queryTokens(''), []);
});

test('a word matches the start of a word in the name, or the brand, or the category', () => {
  const tokens = queryTokens('dome');
  assert.ok(scoreProduct(CATALOGUE[1], tokens, 'dome') > 0);
  assert.ok(scoreProduct(CATALOGUE[0], tokens, 'dome') === 0);
  assert.ok(scoreProduct(CATALOGUE[0], queryTokens('axis'), 'axis') > 0);
  assert.ok(scoreProduct(CATALOGUE[3], queryTokens('access'), 'access') > 0);
});

test('every word has to match, in any order', () => {
  assert.equal(searchProducts(CATALOGUE, { q: 'camera axis' }).total, 2);
  assert.equal(searchProducts(CATALOGUE, { q: 'thermal dome' }).total, 0);
  assert.equal(searchProducts(CATALOGUE, { q: 'zzzz' }).total, 0);
});

test('a part number is found however it is typed, and ranks first', () => {
  for (const typed of ['DS-2CD2143G2-I', 'ds2cd2143g2i', 'ds-2cd2143', '2cd2143g2']) {
    assert.equal(searchProducts(CATALOGUE, { q: typed }).items[0].id, 'ds-2cd2143g2-i', typed);
  }
  assert.equal(searchProducts(CATALOGUE, { q: 'Q1972-E' }).items[0].id, 'q1972-e');
  assert.equal(searchProducts(CATALOGUE, { q: '02365-001' }).items[0].id, 'm3098-v');
  assert.equal(searchProducts(CATALOGUE, { q: '8413' }).items[0].id, 'optex-ax');
});

test('the description is searched, but a name match ranks above it', () => {
  const found = searchProducts(CATALOGUE, { q: 'perimeter' });
  assert.deepEqual(found.items.map((p) => p.id), ['q1972-e']);
  const both = [product('a', 'Perimeter beam', { description: '' }), product('b', 'Something else', { description: 'perimeter protection' })];
  assert.deepEqual(searchProducts(both, { q: 'perimeter' }).items.map((p) => p.id), ['a', 'b']);
});

test('products with a photo rank above the same match without one', () => {
  const twins = [product('a', 'Dome camera'), product('b', 'Dome camera', { imageUrl: 'https://x/b.webp' })];
  assert.deepEqual(searchProducts(twins, { q: 'dome' }).items.map((p) => p.id), ['b', 'a']);
});

test('category and brand narrow the results, and the counts cover all the matches', () => {
  const camera = searchProducts(CATALOGUE, { q: 'camera' });
  assert.equal(camera.total, 2);
  assert.deepEqual(camera.brands, [{ name: 'Axis', count: 2 }]);
  assert.deepEqual(camera.categories, [{ name: 'CCTV', count: 2 }]);
  const axis = searchProducts(CATALOGUE, { q: 'dome', brand: 'Axis' });
  assert.deepEqual(axis.items.map((p) => p.id), ['m3098-v']);
  assert.deepEqual(axis.brands.map((b) => b.name), ['Axis', 'Hikvision']);
  assert.equal(searchProducts(CATALOGUE, { q: 'dome', categoryTitle: 'Intrusion' }).total, 0);
});

test('with no words the filters alone list products', () => {
  const found = searchProducts(CATALOGUE, { categoryTitle: 'CCTV' });
  assert.equal(found.total, 3);
  assert.equal(searchProducts(CATALOGUE, { brand: 'HID' }).items[0].id, 'hid-reader');
});

test('results come a page at a time and a page number out of range is brought back in', () => {
  const many = Array.from({ length: 60 }, (_, n) => product('p' + n, 'Dome camera ' + String(n).padStart(2, '0')));
  const first = searchProducts(many, { q: 'dome' });
  assert.equal(first.items.length, SEARCH_PAGE_SIZE);
  assert.equal(first.pages, 3);
  assert.equal(searchProducts(many, { q: 'dome', page: 3 }).items.length, 12);
  assert.equal(searchProducts(many, { q: 'dome', page: 99 }).page, 3);
  assert.equal(searchProducts(many, { q: 'dome', page: 'x' }).page, 1);
  assert.equal(searchProducts([], { q: 'dome' }).pages, 1);
  assert.equal(searchProducts().total, 0);
});

test('a tile with only a name, brand and part number can be matched as you type', () => {
  const tile = { id: 'x', sku: '03180-001', mpn: 'TD8910', name: 'AXIS TD8910 console cable', brand: 'AXIS' };
  assert.equal(tileMatches(tile, ''), true);
  assert.equal(tileMatches(tile, 'console'), true);
  assert.equal(tileMatches(tile, 'td-8910'), true);
  assert.equal(tileMatches(tile, '03180'), true);
  assert.equal(tileMatches(tile, 'speaker'), false);
});

test('search addresses carry only what is set', () => {
  assert.equal(searchHref(), '/store/search');
  assert.equal(searchHref({ q: 'dome cam', category: 'cctv', brand: 'Axis', page: 3 }), '/store/search?q=dome+cam&category=cctv&brand=Axis&page=3');
  assert.equal(searchHref({ q: 'dome', page: 1 }), '/store/search?q=dome');
});

test('the page numbers under the results leave gaps as dots', () => {
  assert.deepEqual(pageWindow(1, 1), [1]);
  assert.deepEqual(pageWindow(1, 3), [1, 2, 3]);
  assert.deepEqual(pageWindow(1, 10), [1, 2, '…', 10]);
  assert.deepEqual(pageWindow(5, 10), [1, '…', 4, 5, 6, '…', 10]);
  assert.deepEqual(pageWindow(10, 10), [1, '…', 9, 10]);
});
