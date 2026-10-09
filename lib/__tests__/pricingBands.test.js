import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_SCOPE,
  MAX_BANDS,
  bandsForScope,
  bandsFromEditor,
  centsToText,
  dollarText,
  dollarsToCents,
  editorFromBands,
  emptyMarkups,
  exampleCents,
  rangeLabels,
  scopeOf,
  scopesWithBands,
  supplierOfScope,
} from '../pricingBands.js';

const TIERS = [
  { key: 'member', label: 'Member' },
  { key: 'silver', label: 'Silver' },
  { key: 'gold', label: 'Gold' },
  { key: 'platinum', label: 'Platinum' },
];

function row(limit, markups = {}) {
  return { limit, markups: { ...emptyMarkups(TIERS), ...markups } };
}

test('a cost limit is typed in dollars and kept in cents', () => {
  assert.equal(dollarsToCents('100'), 10000);
  assert.equal(dollarsToCents(' $1,000 '), 100000);
  assert.equal(dollarsToCents('99.5'), 9950);
  assert.equal(dollarsToCents('1,000,000'), 100000000);
  assert.equal(dollarsToCents('$$5'), 500);
  for (const bad of ['', '0', '-5', 'abc', null, undefined, '2000000']) assert.equal(dollarsToCents(bad), null, String(bad));
  assert.equal(centsToText(10000), '100');
  assert.equal(centsToText(9950), '99.5');
});

test('dollars are shown without cents unless there are some', () => {
  assert.equal(dollarText(100), '$100');
  assert.equal(dollarText(1000), '$1,000');
  assert.equal(dollarText(99.5), '$99.50');
});

test('the editor is built from the bands, lowest limit first, with the open band as the rest', () => {
  const editor = editorFromBands(
    [
      { id: 'c', up_to_cents: null, markups: { member: 8 } },
      { id: 'b', up_to_cents: 100000, markups: { member: 25, silver: 20 } },
      { id: 'a', up_to_cents: 10000, markups: { member: 40 } },
    ],
    TIERS,
  );
  assert.deepEqual(editor.rows.map((r) => r.limit), ['100', '1000']);
  assert.equal(editor.rows[1].markups.silver, '20');
  assert.equal(editor.rows[0].markups.gold, '');
  assert.equal(editor.rest.member, '8');
  assert.deepEqual(editorFromBands([], TIERS), { rows: [], rest: emptyMarkups(TIERS) });
  assert.deepEqual(editorFromBands(null, TIERS).rows, []);
});

test('the editor becomes bands in order, with the rest last and no limit', () => {
  const result = bandsFromEditor(
    {
      rows: [row('1000', { member: '25', silver: '20' }), row('100', { member: '40.5' })],
      rest: row('', { member: '8', platinum: '4' }).markups,
    },
    TIERS,
  );
  assert.deepEqual(result.bands, [
    { up_to_cents: 10000, markups: { member: 40.5 } },
    { up_to_cents: 100000, markups: { member: 25, silver: 20 } },
    { up_to_cents: null, markups: { member: 8, platinum: 4 } },
  ]);
});

test('a row with nothing in it, and a rest with nothing in it, are left out', () => {
  const result = bandsFromEditor({ rows: [row('', {}), row('100', { member: '30' })], rest: emptyMarkups(TIERS) }, TIERS);
  assert.deepEqual(result.bands, [{ up_to_cents: 10000, markups: { member: 30 } }]);
  assert.deepEqual(bandsFromEditor({ rows: [], rest: emptyMarkups(TIERS) }, TIERS), { bands: [] });
});

test('a band that cannot work is explained in plain words', () => {
  const rest = emptyMarkups(TIERS);
  assert.match(bandsFromEditor({ rows: [row('', { member: '30' })], rest }, TIERS).error, /Band 1 needs a cost limit/);
  assert.match(bandsFromEditor({ rows: [row('abc', { member: '30' })], rest }, TIERS).error, /Band 1 needs a cost limit/);
  assert.match(bandsFromEditor({ rows: [row('100', {})], rest }, TIERS).error, /Band 1 needs at least one markup/);
  assert.equal(
    bandsFromEditor({ rows: [row('100', { member: '30' }), row('100', { silver: '20' })], rest }, TIERS).error,
    'Two bands stop at $100. Give each band its own limit.',
  );
  assert.match(bandsFromEditor({ rows: [row('100', { member: 'lots' })], rest }, TIERS).error, /Band 1: A Member markup/);
  assert.match(bandsFromEditor({ rows: [row('100', { gold: '1001' })], rest }, TIERS).error, /A Gold markup/);
  assert.match(bandsFromEditor({ rows: [], rest: { ...rest, platinum: '-1' } }, TIERS).error, /Above the last band: A Platinum markup/);
});

test('there is a limit on how many bands', () => {
  const rows = Array.from({ length: MAX_BANDS + 1 }, (_, n) => row(String((n + 1) * 10), { member: '20' }));
  assert.match(bandsFromEditor({ rows, rest: emptyMarkups(TIERS) }, TIERS).error, /No more than 12 bands/);
});

test('each row says what range of cost it covers', () => {
  const editor = { rows: [row('1000'), row('100'), row('')], rest: emptyMarkups(TIERS) };
  assert.deepEqual(rangeLabels(editor), {
    rows: ['$100 to under $1,000', 'Under $100', 'Enter a limit'],
    rest: '$1,000 and over',
  });
  assert.equal(rangeLabels({ rows: [], rest: emptyMarkups(TIERS) }).rest, 'Every cost');
});

test('the example is what $100 of cost sells for at a markup, inc GST', () => {
  assert.equal(exampleCents('20'), 13200);
  assert.equal(exampleCents('0'), 11000);
  assert.equal(exampleCents(''), null);
  assert.equal(exampleCents('x'), null);
});

test('a set of bands belongs to a supplier or to the default', () => {
  assert.equal(scopeOf(null), DEFAULT_SCOPE);
  assert.equal(scopeOf(undefined), DEFAULT_SCOPE);
  assert.equal(scopeOf('abc-123'), 'abc-123');
  assert.equal(supplierOfScope(DEFAULT_SCOPE), null);
  assert.equal(supplierOfScope('abc-123'), 'abc-123');
});

test('the bands of one set are found among the sets', () => {
  const sets = [
    { supplier_id: null, bands: [{ id: '1', up_to_cents: null, markups: { member: 8 } }] },
    { supplier_id: 'abc-123', bands: [] },
  ];
  assert.equal(bandsForScope(sets, DEFAULT_SCOPE).length, 1);
  assert.deepEqual(bandsForScope(sets, 'abc-123'), []);
  assert.deepEqual(bandsForScope(sets, 'nobody'), []);
  assert.deepEqual(bandsForScope(null, DEFAULT_SCOPE), []);
  assert.deepEqual([...scopesWithBands(sets)], [DEFAULT_SCOPE]);
  assert.equal(scopesWithBands(null).size, 0);
});
