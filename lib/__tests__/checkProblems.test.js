import test from 'node:test';
import assert from 'node:assert/strict';

import { splitProblems, problemsLine } from '../checkProblems.js';

test('splitProblems', () => {
  assert.deepStrictEqual(splitProblems(''), []);
  assert.deepStrictEqual(splitProblems(null), []);
  assert.deepStrictEqual(splitProblems('Problem 1; Problem 2'), ['Problem 1', 'Problem 2']);
  assert.deepStrictEqual(splitProblems('Problem 1;   ; Problem 2'), ['Problem 1', 'Problem 2']);
});

 test('problemsLine', () => {
  assert.strictEqual(problemsLine(''), '');
  assert.strictEqual(problemsLine(null), '');
  
  // One short problem
  assert.strictEqual(problemsLine('A short problem'), 'A short problem');
  
  // One long problem (91 characters)
  const longProblem = 'A'.repeat(91);
  assert.strictEqual(problemsLine(longProblem), 'A'.repeat(87) + '…');
  
  // Multiple problems
  assert.strictEqual(problemsLine('Problem 1; Problem 2; Problem 3'), '3 issues from the last check (click to see them)');
});