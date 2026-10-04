import test from 'node:test';
import assert from 'node:assert/strict';

import { FactRequest, splitSites } from '../teachTera.js';

test('a fact needs a question and an answer', () => {
  const ok = FactRequest.safeParse({ question: '  Do you sell Kantech?  ', answer: 'Yes, we can order it in.' });
  assert.equal(ok.success, true);
  assert.equal(ok.data.question, 'Do you sell Kantech?');
  assert.equal(ok.data.active, true);
  assert.equal(FactRequest.safeParse({ question: 'Hi', answer: 'Yes' }).success, false);
  assert.equal(FactRequest.safeParse({ question: 'Do you sell Kantech?', answer: '   ' }).success, false);
  assert.equal(FactRequest.safeParse({ question: 'x'.repeat(501), answer: 'Yes' }).success, false);
});

test('sites can be typed with commas, spaces, new lines or full links', () => {
  assert.deepEqual(splitSites('hikvision.com, https://www.Axis.com/au/ ui.com'), ['hikvision.com', 'axis.com', 'ui.com']);
  assert.deepEqual(splitSites(['kantech.com', 'kantech.com', 'nonsense'].join(String.fromCharCode(10))), ['kantech.com']);
  assert.deepEqual(splitSites(''), []);
});
