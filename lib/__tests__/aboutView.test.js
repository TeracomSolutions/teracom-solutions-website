import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBuildTime,
  formatReleased,
  notesLines,
  sameCopy
} from '../aboutView.js';

const newline = String.fromCharCode(10);

test('formatBuildTime handles empty and invalid inputs', () => {
  assert.strictEqual(formatBuildTime(''), '');
  assert.strictEqual(formatBuildTime('nonsense'), '');
});

test('formatBuildTime shows correct date and time for valid input', () => {
  const result = formatBuildTime('2026-10-20T01:30:00+00:00');
  assert.ok(result.includes('20 Oct 2026'));
  assert.ok(result.includes('12:30'));
});

test('formatReleased formats dates correctly', () => {
  assert.strictEqual(formatReleased('2026-10-20'), '20 Oct 2026');
  assert.strictEqual(formatReleased('2026-01-05'), '5 Jan 2026');
  assert.strictEqual(formatReleased(''), '');
  assert.strictEqual(formatReleased('soon'), 'soon');
});

test('notesLines parses notes correctly', () => {
  const text = 'First line' + newline + '- a bullet' + newline + newline + '  - spaced bullet';
  const result = notesLines(text);
  assert.deepStrictEqual(result, [
    { text: 'First line', bullet: false },
    { text: 'a bullet', bullet: true },
    { text: 'spaced bullet', bullet: true }
  ]);
});

test('notesLines handles empty and undefined inputs', () => {
  assert.deepStrictEqual(notesLines(''), []);
  assert.deepStrictEqual(notesLines(undefined), []);
});

test('sameCopy compares objects correctly', () => {
  assert.strictEqual(sameCopy({ version: '1.1.0', commit: 'abc1234' }, { version: '1.1.0', commit: 'abc1234' }), true);
  assert.strictEqual(sameCopy({ version: '1.1.0', commit: 'abc1234' }, { version: '1.1.0', commit: 'different' }), false);
  assert.strictEqual(sameCopy({ version: '1.1.0', commit: 'abc1234' }, { version: '1.2.0', commit: 'abc1234' }), false);
  assert.strictEqual(sameCopy(null, {}), false);
  assert.strictEqual(sameCopy({ version: '1.1.0', commit: '' }, { version: '1.1.0', commit: '' }), false);
});
