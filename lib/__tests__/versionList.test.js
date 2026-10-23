import assert from 'node:assert/strict';
import test from 'node:test';

import { CONSOLE_VERSIONS } from '../consoleVersions.js';
import { FILTERS, filterLabel, filterVersions, fromBackend } from '../versionList.js';

test('the console version history is well formed and newest first', () => {
  assert.ok(CONSOLE_VERSIONS.length >= 2);
  let previous = null;
  for (const entry of CONSOLE_VERSIONS) {
    assert.match(entry.version, /^[0-9]+[.][0-9]+[.][0-9]+$/);
    assert.match(entry.date, /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
    assert.ok(Array.isArray(entry.notes) && entry.notes.length > 0);
    const parts = entry.version.split('.').map(Number);
    if (previous) {
      const [a, b, c] = previous;
      assert.ok(a > parts[0] || (a === parts[0] && (b > parts[1] || (b === parts[1] && c > parts[2]))), `${entry.version} must be older than the one above`);
    }
    previous = parts;
  }
});

test('fromBackend turns the notes text into a list of lines without the dash', () => {
  const nl = String.fromCharCode(10);
  const list = fromBackend([{ version: '1.2.3', date: '2026-10-20', notes: `Intro line${nl}- first${nl}${nl}- second` }, { version: '1.0.0', date: '2026-10-19' }]);
  assert.deepEqual(list[0], { version: '1.2.3', date: '2026-10-20', notes: ['Intro line', 'first', 'second'] });
  assert.deepEqual(list[1].notes, []);
  assert.deepEqual(fromBackend(null), []);
});

test('filterVersions and the labels', () => {
  const items = Array.from({ length: 8 }, (_, n) => ({ version: `1.${8 - n}.0`, date: n < 3 ? '2026-10-20' : '2026-08-01', notes: ['x'] }));
  const now = new Date('2026-10-24T00:00:00Z');
  assert.equal(filterVersions(items, 'all', now).length, 8);
  assert.equal(filterVersions(items, 'recent', now).length, 5);
  assert.equal(filterVersions(items, 'month', now).length, 3);
  assert.equal(filterLabel(FILTERS[0], 8), 'All versions (8)');
  assert.equal(filterLabel(FILTERS[1], 8), 'Latest 5');
  assert.equal(filterLabel(FILTERS[2], 8), 'Last 30 days');
});
