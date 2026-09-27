import test from 'node:test';
import assert from 'node:assert/strict';

import { CATEGORIES, FILTER_MESSAGE, MODES, SCOPES, countsSentence, enforcementSentence, labelFor, validateRule } from '../aiGovernance.js';

test('labels', () => {
  assert.equal(labelFor(CATEGORIES, 'privacy'), 'Personal details');
  assert.equal(labelFor(MODES, 'both'), 'Instruction and filter');
  assert.equal(labelFor(SCOPES, 'external'), 'External providers only');
  assert.equal(labelFor(SCOPES, 'nope'), 'nope');
});

test('a valid rule has no errors', () => {
  assert.deepEqual(validateRule({ title: 'T', rule_text: 'Do this.', category: 'conduct', mode: 'instruct', scope: 'all' }), []);
  assert.deepEqual(validateRule({ title: 'T', rule_text: 'Do this.', category: 'privacy', mode: 'both', scope: 'external' }), []);
});

test('missing title and unknown mode are reported', () => {
  const errors = validateRule({ title: ' ', rule_text: 'x', category: 'conduct', mode: 'shout', scope: 'all' });
  assert.equal(errors.length, 2);
  assert.ok(errors[0].includes('title'));
});

test('a filter needs a filterable category', () => {
  const errors = validateRule({ title: 'T', rule_text: 'x', category: 'conduct', mode: 'filter', scope: 'all' });
  assert.deepEqual(errors, [FILTER_MESSAGE]);
  assert.deepEqual(validateRule({ title: 'T', rule_text: 'x', category: 'secrets', mode: 'filter', scope: 'all' }), []);
});

test('counts sentence', () => {
  assert.equal(countsSentence({ email: 2, phone: 1, card: 0 }), 'Removed 2 email addresses, 1 phone numbers');
  assert.equal(countsSentence({}), 'Nothing to remove');
  assert.equal(countsSentence(undefined), 'Nothing to remove');
});

test('enforcement sentence', () => {
  assert.equal(enforcementSentence({ mode: 'instruct' }), 'Told to the model on every request.');
  assert.ok(enforcementSentence({ mode: 'filter', category: 'financial', scope: 'all' }).startsWith('Filters financial details out of what every provider receive'));
  assert.ok(enforcementSentence({ mode: 'both', category: 'privacy', scope: 'external' }).includes('providers outside Teracom'));
});
