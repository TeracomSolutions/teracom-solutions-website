import test from 'node:test';
import assert from 'node:assert/strict';

import { confidenceText, traceLines } from '../content.js';

test('what a lookup tried, one line each', () => {
  const lines = traceLines([
    { step: 'search', query: 'AXIS 02314-001', results: 7, on_site: 3 },
    { step: 'page', url: 'https://www.2n.com/a', result: 'the site turned the checker away (403)' },
    { step: 'elsewhere', url: 'https://shop.example.com/x', result: 'carries the part number' },
    { step: 'other' },
    null,
  ]);
  assert.deepEqual(lines, [
    'Searched "AXIS 02314-001": 7 results, 3 on the manufacturer\'s site',
    'Manufacturer page https://www.2n.com/a: the site turned the checker away (403)',
    'Other site https://shop.example.com/x: carries the part number',
  ]);
  assert.deepEqual(traceLines(undefined), []);
  assert.equal(traceLines([{ step: 'search', query: 'q', results: 1, on_site: 0 }])[0], 'Searched "q": 1 result, 0 on the manufacturer\'s site');
});

test('a best guess says it is not the manufacturer', () => {
  assert.match(confidenceText('guess'), /not the manufacturer's/);
  assert.equal(confidenceText('high'), 'The part number is on this page.');
});
