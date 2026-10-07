import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_FILTERS,
  PAGE_SIZE,
  allTicked,
  clampPage,
  nextSort,
  pageCount,
  pickSheetParams,
  rangeLabel,
  sheetParams,
  sheetQueryString,
  sortName,
  togglePage,
} from '../sheetQuery.js';
import { catalogCsv, csvEscape, dollars, marginClass, marginOf, money } from '../catalogShared.js';

test('the first page with no filters asks for 100 products sorted by name', () => {
  assert.equal(PAGE_SIZE, 100);
  const params = new URLSearchParams(sheetQueryString(DEFAULT_FILTERS));
  assert.equal(params.get('skip'), '0');
  assert.equal(params.get('limit'), '100');
  assert.equal(params.get('sort'), 'name');
  assert.equal(params.get('direction'), 'asc');
  for (const key of ['q', 'supplier_id', 'category', 'live', 'include_inactive', 'thin']) {
    assert.equal(params.has(key), false, key);
  }
});

test('each filter and the page number go into the query', () => {
  const params = new URLSearchParams(sheetQueryString({
    q: '  optex  ',
    supplierId: 'abc',
    category: 'Cameras',
    live: 'live',
    showInactive: true,
    thin: true,
    sort: 'cost_cents',
    dir: 'desc',
    page: 3,
  }));
  assert.equal(params.get('skip'), '200');
  assert.equal(params.get('q'), 'optex');
  assert.equal(params.get('supplier_id'), 'abc');
  assert.equal(params.get('category'), 'Cameras');
  assert.equal(params.get('live'), 'live');
  assert.equal(params.get('include_inactive'), 'true');
  assert.equal(params.get('thin'), 'true');
  assert.equal(params.get('sort'), 'cost');
  assert.equal(params.get('direction'), 'desc');
});

test('an export asks for every matching row, and a bad page number becomes page one', () => {
  const all = new URLSearchParams(sheetQueryString({ ...DEFAULT_FILTERS, page: 7 }, { all: true }));
  assert.equal(all.get('skip'), '0');
  assert.equal(all.get('limit'), '5000');
  assert.equal(new URLSearchParams(sheetQueryString({ page: 'x' })).get('skip'), '0');
  assert.equal(new URLSearchParams(sheetQueryString({ live: 'other' })).has('live'), false);
  assert.deepEqual(sheetParams(DEFAULT_FILTERS), { skip: '0', limit: '100', sort: 'name', direction: 'asc' });
});

test('column headings become the names the backend sorts by', () => {
  assert.equal(sortName('name'), 'name');
  assert.equal(sortName('rrp_cents'), 'price');
  assert.equal(sortName('cost_cents'), 'cost');
  assert.equal(sortName('last_imported_at'), 'last_imported');
  assert.equal(sortName('tier:gold'), 'tier');
});

test('only the known filters are passed from the browser to the backend', () => {
  const picked = pickSheetParams(new URLSearchParams('skip=100&limit=100&q=cam&sort=name&evil=1&thin='));
  assert.deepEqual(picked, { skip: '100', limit: '100', q: 'cam', sort: 'name' });
});

test('paging counts, clamps and labels the range', () => {
  assert.equal(pageCount(0), 1);
  assert.equal(pageCount(100), 1);
  assert.equal(pageCount(101), 2);
  assert.equal(pageCount(4604), 47);
  assert.equal(clampPage(0, 4604), 1);
  assert.equal(clampPage(99, 4604), 47);
  assert.equal(clampPage('x', 4604), 1);
  assert.equal(rangeLabel(0, 1), 'No products');
  assert.equal(rangeLabel(50, 1), '1–50 of 50');
  assert.equal(rangeLabel(4604, 2), '101–200 of 4,604');
  assert.equal(rangeLabel(4604, 47), '4,601–4,604 of 4,604');
});

test('clicking a heading sorts by it and clicking again reverses it', () => {
  assert.deepEqual(nextSort({ sort: 'name', dir: 'asc' }, 'sku'), { sort: 'sku', dir: 'asc' });
  assert.deepEqual(nextSort({ sort: 'sku', dir: 'asc' }, 'sku'), { sort: 'sku', dir: 'desc' });
  assert.deepEqual(nextSort({ sort: 'sku', dir: 'desc' }, 'sku'), { sort: 'sku', dir: 'asc' });
});

test('ticking a page keeps the ticks from other pages', () => {
  const before = new Set(['a', 'z']);
  const ticked = togglePage(before, ['a', 'b', 'c'], true);
  assert.deepEqual([...ticked].sort(), ['a', 'b', 'c', 'z']);
  assert.equal(before.size, 2);
  assert.deepEqual([...togglePage(ticked, ['a', 'b', 'c'], false)], ['z']);
  assert.equal(allTicked(ticked, ['a', 'b', 'c']), true);
  assert.equal(allTicked(ticked, ['a', 'q']), false);
  assert.equal(allTicked(ticked, []), false);
});

test('money is shown in dollars from cents and margins in percent', () => {
  assert.equal(money(18700), '$187.00');
  assert.equal(money(null), '—');
  assert.equal(dollars(18700), '187.00');
  assert.equal(dollars(null), '');
  const { cents, pct } = marginOf(11000, 8500);
  assert.equal(Math.round(cents), 1500);
  assert.equal(Math.round(pct), 15);
  assert.deepEqual(marginOf(11000, null), { cents: null, pct: null });
  assert.equal(marginClass(-1), 'admin-margin bad');
  assert.equal(marginClass(10), 'admin-margin thin');
  assert.equal(marginClass(30), 'admin-margin good');
  assert.equal(marginClass(null), 'admin-muted');
});

test('the CSV has a header, one line per product and quotes where it must', () => {
  assert.equal(csvEscape('plain'), 'plain');
  assert.equal(csvEscape('a,b'), '"a,b"');
  assert.equal(csvEscape('say "hi"'), '"say ""hi"""');
  assert.equal(csvEscape(null), '');
  const tiers = [{ key: 'member', label: 'Member' }];
  const product = {
    sku: 'A1', name: 'Camera, dome', brand: 'Optex', category: 'Cameras', supplier: 'Dicker Data', cost_cents: 8500, price_cents: 11000,
    stock: 3, active: true, published: false, last_imported_at: null, tier_prices_cents: { member: 10450 },
  };
  const lines = catalogCsv([product], tiers).split(String.fromCharCode(10));
  assert.equal(lines.length, 2);
  assert.equal(lines[0], 'SKU,Name,Brand,Category,Supplier,Cost ex GST,RRP inc GST,RRP ex GST,Margin $,Margin %,Member,Stock,Active,Live on website,Last imported');
  assert.equal(lines[1], 'A1,"Camera, dome",Optex,Cameras,Dicker Data,85.00,110.00,100.00,15.00,15.0,104.50,3,yes,no,');
});
