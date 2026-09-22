import { test } from 'node:test';
import assert from 'node:assert/strict';

import { groupResults, queryTokens, searchSite } from '../search.js';

const top = (q) => searchSite(q)[0];

test('finds services, brands, tools and pages by name', () => {
  const cctv = searchSite('cctv').slice(0, 2).map((r) => r.href);
  assert.ok(cctv.includes('/services/cctv') && cctv.includes('/store/cctv'), cctv.join());
  assert.equal(top('camera').href, '/services/cctv');
  assert.equal(top('gallagher').href, '/brands/gallagher');
  assert.equal(top('voltage drop').href, '/tools/voltage-drop-calculator');
  assert.equal(top('warranty').href, '/warranty');
  assert.equal(top('software development').href, '/services/software-development');
});

test('plural and partial words still match', () => {
  assert.ok(searchSite('cameras').length > 0);
  assert.ok(searchSite('calc').some((r) => r.type === 'tool'));
});

test('every word must match', () => {
  assert.deepEqual(searchSite('gallagher zzzzqqq'), []);
  assert.deepEqual(searchSite('zzzzqqq'), []);
});

test('help centre questions are searchable', () => {
  assert.ok(searchSite('xmeye').some((r) => r.type === 'help' && r.href.startsWith('/resources/help-centre#')));
});

test('empty and stopword-only queries return nothing', () => {
  assert.deepEqual(searchSite(''), []);
  assert.deepEqual(searchSite('the and of'), []);
  assert.deepEqual(queryTokens('  '), []);
});

test('results group by type', () => {
  const groups = groupResults(searchSite('access control'));
  assert.ok(groups.length > 1);
  for (const g of groups) assert.ok(g.label && g.items.every((i) => i.type === g.type));
});
