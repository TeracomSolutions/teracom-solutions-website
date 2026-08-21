import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isValidImportToken } from '../adminAuth.js';

test('isValidImportToken accepts the exact matching token', () => {
  assert.equal(isValidImportToken('correct-token', 'correct-token'), true);
});

test('isValidImportToken rejects a wrong token of the same length', () => {
  assert.equal(isValidImportToken('wrong-token-x', 'correct-token'), false);
});

test('isValidImportToken rejects a token of a different length', () => {
  assert.equal(isValidImportToken('short', 'correct-token'), false);
});

test('isValidImportToken rejects when the expected token is unset (undefined)', () => {
  assert.equal(isValidImportToken('anything', undefined), false);
});

test('isValidImportToken rejects when the expected token is an empty string', () => {
  assert.equal(isValidImportToken('anything', ''), false);
});

test('isValidImportToken rejects a non-string provided value', () => {
  assert.equal(isValidImportToken(12345, 'correct-token'), false);
});
