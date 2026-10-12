import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeadQuery } from '../leadQuery.js';

// Test lead received
await test('lead received', () => {
  const result = parseLeadQuery('?lead=received');
  assert.strictEqual(result.lead, 'received');
  assert.strictEqual(result.interest, '');
  assert.strictEqual(result.message, '');
});

// Test lead error
await test('lead error', () => {
  const result = parseLeadQuery('?lead=error');
  assert.strictEqual(result.lead, 'error');
  assert.strictEqual(result.interest, '');
  assert.strictEqual(result.message, '');
});

// Test interest with space
await test('interest with space', () => {
  const result = parseLeadQuery('?interest=Talk%20to%20Sales');
  assert.strictEqual(result.lead, '');
  assert.strictEqual(result.interest, 'Talk to Sales');
  assert.strictEqual(result.message, '');
});

// Test module in list gives message
await test('module in list gives message', () => {
  const result = parseLeadQuery('?module=Finance%20OS', ['Finance OS']);
  assert.strictEqual(result.lead, '');
  assert.strictEqual(result.interest, '');
  assert.strictEqual(result.message, 'Please include us in the early access preview of Finance OS.');
});

// Test module not in list gives empty message
await test('module not in list gives empty message', () => {
  const result = parseLeadQuery('?module=Finance%20OS', ['Other Module']);
  assert.strictEqual(result.lead, '');
  assert.strictEqual(result.interest, '');
  assert.strictEqual(result.message, '');
});

// Test no question mark in search text
await test('no question mark in search text', () => {
  const result = parseLeadQuery('lead=received&interest=Talk%20to%20Sales');
  assert.strictEqual(result.lead, 'received');
  assert.strictEqual(result.interest, 'Talk to Sales');
  assert.strictEqual(result.message, '');
});

// Test empty string
await test('empty string', () => {
  const result = parseLeadQuery('');
  assert.strictEqual(result.lead, '');
  assert.strictEqual(result.interest, '');
  assert.strictEqual(result.message, '');
});

// Test undefined and null
await test('undefined and null', () => {
  const result1 = parseLeadQuery(undefined);
  assert.strictEqual(result1.lead, '');
  assert.strictEqual(result1.interest, '');
  assert.strictEqual(result1.message, '');

  const result2 = parseLeadQuery(null);
  assert.strictEqual(result2.lead, '');
  assert.strictEqual(result2.interest, '');
  assert.strictEqual(result2.message, '');
});

// Test several parameters at once
await test('several parameters at once', () => {
  const result = parseLeadQuery('?lead=received&interest=Talk%20to%20Sales&module=Finance%20OS', ['Finance OS']);
  assert.strictEqual(result.lead, 'received');
  assert.strictEqual(result.interest, 'Talk to Sales');
  assert.strictEqual(result.message, 'Please include us in the early access preview of Finance OS.');
});