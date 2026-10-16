import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES, pageInfo } from '../pageRange.js';

test('the page sizes are 10, 50, 100 and 200 and the default is 50', () => {
  assert.deepEqual(PAGE_SIZES, [10, 50, 100, 200]);
  assert.equal(DEFAULT_PAGE_SIZE, 50);
});

// the first page of many
 test('the first page of many', () => {
   const p = pageInfo(137, 0, 50);
   assert.equal(p.first, 1);
   assert.equal(p.last, 50);
   assert.equal(p.page, 1);
   assert.equal(p.pages, 3);
   assert.equal(p.hasPrev, false);
   assert.equal(p.hasNext, true);
   assert.equal(p.nextOffset, 50);
 });

// a middle page
 test('a middle page', () => {
   const p = pageInfo(137, 50, 50);
   assert.equal(p.first, 51);
   assert.equal(p.last, 100);
   assert.equal(p.page, 2);
   assert.equal(p.hasPrev, true);
   assert.equal(p.prevOffset, 0);
   assert.equal(p.hasNext, true);
   assert.equal(p.nextOffset, 100);
 });

// the last page is short
 test('the last page is short', () => {
   const p = pageInfo(137, 100, 50);
   assert.equal(p.first, 101);
   assert.equal(p.last, 137);
   assert.equal(p.page, 3);
   assert.equal(p.hasNext, false);
 });

// no rows
 test('no rows', () => {
   const p = pageInfo(0, 0, 50);
   assert.equal(p.first, 0);
   assert.equal(p.last, 0);
   assert.equal(p.page, 1);
   assert.equal(p.pages, 1);
   assert.equal(p.hasPrev, false);
   assert.equal(p.hasNext, false);
 });

// an unknown page size falls back to 50 and an offset past the end is pulled back
 test('an unknown page size falls back to 50 and an offset past the end is pulled back', () => {
   const p = pageInfo(30, 500, 7);
   assert.equal(p.size, 50);
   assert.equal(p.first, 30);
   assert.equal(p.last, 30);
   assert.equal(p.page, 1);
 });

// exactly one full page
 test('exactly one full page', () => {
   const p = pageInfo(10, 0, 10);
   assert.equal(p.pages, 1);
   assert.equal(p.hasNext, false);
   assert.equal(p.last, 10);
 });
