import test from 'node:test';
import assert from 'node:assert/strict';

import { internetSentence, orderList } from '../aiRouting.js';

test('the internet sentence for each mode', () => {
  assert.ok(internetSentence('web_first').includes('web first'));
  assert.ok(internetSentence('model_first').includes('fallback'));
  assert.ok(internetSentence('off').includes('switched off'));
  assert.equal(internetSentence(undefined), '');
});

test('the order list prefers the full order and falls back to the assistant order', () => {
  assert.deepEqual(orderList({ order: ['internet', 'groq'], assistant_order: ['groq'] }), ['internet', 'groq']);
  assert.deepEqual(orderList({ assistant_order: ['groq'] }), ['groq']);
  assert.deepEqual(orderList(null), []);
  assert.deepEqual(orderList({}), []);
});
