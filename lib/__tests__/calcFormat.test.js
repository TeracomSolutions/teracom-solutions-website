import test from 'node:test';
import assert from 'node:assert/strict';

import { fmt, metresText, durationText } from '../calcFormat.js';

test('fmt function', () => {
  assert.strictEqual(fmt(1234.5), '1,234.50');
  assert.strictEqual(fmt(2.345, 1), '2.3');
  assert.strictEqual(fmt(NaN), '0');
  assert.strictEqual(fmt(Infinity), '0');
});

test('metresText function', () => {
  assert.strictEqual(metresText(12.34), '12.3 m');
  assert.strictEqual(metresText(5, 0), '5 m');
  assert.strictEqual(metresText(Infinity), 'the horizon');
});

test('durationText function', () => {
  assert.strictEqual(durationText(45), '45 s');
  assert.strictEqual(durationText(125), '2 min');
  assert.strictEqual(durationText(3700), '1 h 1 min');
  assert.strictEqual(durationText(90000), '1 d 1 h');
});

test('durationText function with rounding', () => {
  assert.strictEqual(durationText(59.6), '1 min');
  assert.strictEqual(durationText(0), '0 s');
});
