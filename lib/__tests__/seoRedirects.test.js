import test from 'node:test';
import assert from 'node:assert/strict';

import {
  REFRESH_MS,
  RETRY_MS,
  buildTable,
  createRedirectCache,
  isConsolePath,
  isSafeTarget,
  lookup,
  redirectKey,
} from '../seoRedirects.js';

test('addresses are compared without case, trailing slash, query or anchor', () => {
  assert.equal(redirectKey('/Access-Control/'), '/access-control');
  assert.equal(redirectKey('/FAQ/XMEye_explained?x=1#top'), '/faq/xmeye_explained');
  assert.equal(redirectKey('/Crow%20Systems/Catalogue.PDF'), '/crow systems/catalogue.pdf');
  assert.equal(redirectKey('/'), '/');
  assert.equal(redirectKey('/bad%zz'), '/bad%zz');
});

test('the console and its calls are never redirected', () => {
  assert.ok(isConsolePath('/admin'));
  assert.ok(isConsolePath('/admin/seo'));
  assert.ok(isConsolePath('/api/admin/seo'));
  assert.ok(isConsolePath('/api/tera/ask'));
  assert.ok(!isConsolePath('/administrator'));
  assert.ok(!isConsolePath('/store/cctv'));
});

test('a target has to be a page on this site', () => {
  assert.ok(isSafeTarget('/store/cctv'));
  assert.ok(isSafeTarget('/brands/tecom-challenger'));
  for (const bad of ['', 'store', '//evil.example/x', 'https://evil.example', '/a b', '/x<script>', '/a"b', '/a' + String.fromCharCode(92) + 'b', '/' + 'a'.repeat(400)]) {
    assert.ok(!isSafeTarget(bad), bad);
  }
});

test('the table keeps safe pairs and leaves out the rest', () => {
  const table = buildTable([
    ['/Old-Page/', '/brands/hid'],
    ['/same', '/same/'],
    ['/', '/store'],
    ['/evil', 'https://evil.example'],
    ['/short'],
    'nonsense',
  ]);
  assert.deepEqual([...table], [['/old-page', '/brands/hid']]);
  assert.equal(buildTable(null).size, 0);
});

test('an old address is found whatever its case, slash or query', () => {
  const table = buildTable([['/FAQ/xmeye_explained', '/resources/help-centre']]);
  assert.equal(lookup(table, '/faq/XMEye_explained/'), '/resources/help-centre');
  assert.equal(lookup(table, '/faq/xmeye_explained?utm=1'), '/resources/help-centre');
  assert.equal(lookup(table, '/store'), null);
});

test('a new address that is itself listed is followed on, and a loop gives nothing', () => {
  const chain = buildTable([['/a', '/b'], ['/b', '/c']]);
  assert.equal(lookup(chain, '/a'), '/c');
  assert.equal(lookup(chain, '/b'), '/c');
  const loop = buildTable([['/a', '/b'], ['/b', '/a']]);
  assert.equal(lookup(loop, '/a'), null);
  const long = buildTable([['/a', '/b'], ['/b', '/c'], ['/c', '/d'], ['/d', '/e']]);
  assert.equal(lookup(long, '/a'), '/d');
});

test('the list is fetched once, kept, and fetched again when it is old', async () => {
  let clock = 1000;
  let calls = 0;
  const current = createRedirectCache({
    load: async () => {
      calls += 1;
      return [['/old', '/new' + calls]];
    },
    now: () => clock,
  });
  assert.equal(lookup(await current(), '/old'), '/new1');
  clock += REFRESH_MS - 1;
  assert.equal(lookup(await current(), '/old'), '/new1');
  assert.equal(calls, 1);
  clock += 2;
  assert.equal(lookup(await current(), '/old'), '/new2');
  assert.equal(calls, 2);
});

test('callers at the same time share one fetch', async () => {
  let calls = 0;
  const current = createRedirectCache({
    load: async () => {
      calls += 1;
      return [['/old', '/new']];
    },
    now: () => 5000,
  });
  const tables = await Promise.all([current(), current(), current()]);
  assert.equal(calls, 1);
  assert.ok(tables.every((table) => lookup(table, '/old') === '/new'));
});

test('when the backend cannot be reached the last list stays and it is tried again soon', async () => {
  let clock = 0;
  let broken = false;
  let calls = 0;
  const current = createRedirectCache({
    load: async () => {
      calls += 1;
      if (broken) throw new Error('down');
      return [['/old', '/new']];
    },
    now: () => clock,
  });
  assert.equal(lookup(await current(), '/old'), '/new');
  broken = true;
  clock += REFRESH_MS + 1;
  assert.equal(lookup(await current(), '/old'), '/new');
  assert.equal(calls, 2);
  clock += RETRY_MS - 1;
  await current();
  assert.equal(calls, 2);
  clock += 2;
  await current();
  assert.equal(calls, 3);
});

test('a backend that is down from the start gives an empty list, not an error', async () => {
  const current = createRedirectCache({ load: async () => { throw new Error('down'); }, now: () => 0 });
  const table = await current();
  assert.equal(table.size, 0);
  assert.equal(lookup(table, '/anything'), null);
});
