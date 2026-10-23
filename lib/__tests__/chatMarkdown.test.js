import assert from 'node:assert/strict';
import test from 'node:test';

import { parseBlocks, parseInline } from '../chatMarkdown.js';

const NL = String.fromCharCode(10);
const FENCE = String.fromCharCode(96).repeat(3);
const TICK = String.fromCharCode(96);

test('inline bold, code and https links; other links stay text', () => {
  assert.deepEqual(parseInline('a **b** c'), [{ t: 'text', text: 'a ' }, { t: 'bold', text: 'b' }, { t: 'text', text: ' c' }]);
  assert.deepEqual(parseInline(`run ${TICK}npm test${TICK} now`), [{ t: 'text', text: 'run ' }, { t: 'code', text: 'npm test' }, { t: 'text', text: ' now' }]);
  assert.deepEqual(parseInline('see [docs](https://example.com/a)'), [{ t: 'text', text: 'see ' }, { t: 'link', text: 'docs', href: 'https://example.com/a' }]);
  assert.deepEqual(parseInline('[bad](javascript:alert(1))'), [{ t: 'text', text: '[bad](javascript:alert(1))' }]);
  assert.deepEqual(parseInline(''), []);
});

test('paragraphs, headings and lists', () => {
  const blocks = parseBlocks(['## Title', 'line one', 'line two', '', '- a', '- b', '', '1. first', '2) second'].join(NL));
  assert.deepEqual(blocks, [
    { type: 'h', level: 2, text: 'Title' },
    { type: 'p', text: 'line one line two' },
    { type: 'ul', items: ['a', 'b'] },
    { type: 'ol', items: ['first', 'second'] },
  ]);
});

test('fenced code keeps its lines and language, and an unclosed fence runs to the end', () => {
  const closed = parseBlocks(['before', `${FENCE}js`, 'const a = 1;', '', 'const b = 2;', FENCE, 'after'].join(NL));
  assert.deepEqual(closed, [
    { type: 'p', text: 'before' },
    { type: 'code', lang: 'js', text: 'const a = 1;' + NL + NL + 'const b = 2;' },
    { type: 'p', text: 'after' },
  ]);
  const open = parseBlocks([FENCE, 'x', 'y'].join(NL));
  assert.deepEqual(open, [{ type: 'code', lang: '', text: 'x' + NL + 'y' }]);
  assert.deepEqual(parseBlocks(''), []);
});
