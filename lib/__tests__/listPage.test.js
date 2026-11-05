import test from 'node:test';
import assert from 'node:assert/strict';

import { LIST_DEFAULT, LIST_SIZES, listPage } from '../listPage.js';

const rows = Array.from({ length: 95 }, (_, i) => i + 1);

test('20 rows by default, from 10, 20, 50 or 100', () => {
  assert.deepEqual(LIST_SIZES, [10, 20, 50, 100]);
  assert.equal(LIST_DEFAULT, 20);
  const view = listPage(rows, 1);
  assert.equal(view.size, 20);
  assert.deepEqual(view.rows, rows.slice(0, 20));
  assert.equal(view.pages, 5);
});

test('a page in the middle and the last page', () => {
  const view = listPage(rows, 2, 50);
  assert.deepEqual([view.first, view.last, view.rows.length], [51, 95, 45]);
  const third = listPage(rows, 3, 20);
  assert.deepEqual([third.first, third.last], [41, 60]);
});

test('out-of-range pages and sizes are brought back in', () => {
  assert.equal(listPage(rows, 99, 20).page, 5);
  assert.equal(listPage(rows, 0, 20).page, 1);
  assert.equal(listPage(rows, 1, 7).size, 20);
  assert.equal(listPage(rows, 1, 3, [5, 10, 20, 50]).size, 20);
  assert.equal(listPage(rows, 1, 3, [5, 10, 50]).size, 5);
});

test('an empty list', () => {
  const view = listPage([], 1, 20);
  assert.deepEqual([view.total, view.first, view.last, view.pages], [0, 0, 0, 1]);
  assert.deepEqual(listPage(null, 1).rows, []);
});
