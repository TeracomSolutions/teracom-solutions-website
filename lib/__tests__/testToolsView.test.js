import test from 'node:test';
import assert from 'node:assert/strict';

import {
  recordsSummary,
  cleanupConfirmText,
  canSimulate,
  cleanupResultText
} from '../testToolsView.js';

// recordsSummary

test('recordsSummary for empty array', () => {
  assert.equal(recordsSummary([]), 'No test records in Zoho');
});

test('recordsSummary for undefined', () => {
  assert.equal(recordsSummary(undefined), 'No test records in Zoho');
});

test('recordsSummary for one invoice', () => {
  assert.equal(recordsSummary([{ kind: 'invoice' }]), '1 invoice');
});

test('recordsSummary for mixed records', () => {
  const records = [
    { kind: 'payment' },
    { kind: 'invoice' },
    { kind: 'invoice' },
    { kind: 'contact' }
  ];
  assert.equal(recordsSummary(records), '1 payment, 2 invoices, 1 customer');
});

test('recordsSummary for unknown kind', () => {
  const records = [{ kind: 'unknown' }];
  assert.equal(recordsSummary(records), '');
});

// cleanupConfirmText

test('cleanupConfirmText with records and local false', () => {
  const records = [{ kind: 'invoice' }];
  assert.equal(cleanupConfirmText(records, 0, false), 'Delete 1 invoice from the Zoho TEST organisation? This cannot be undone.');
});

test('cleanupConfirmText with local true and 2 simulated orders', () => {
  const records = [{ kind: 'invoice' }];
  assert.equal(cleanupConfirmText(records, 2, true), 'Delete 1 invoice from the Zoho TEST organisation and remove 2 simulated order(s) from this site? This cannot be undone.');
});

test('cleanupConfirmText with no records', () => {
  assert.equal(cleanupConfirmText(undefined, 0, false), 'Nothing to delete in Zoho.');
});

// canSimulate

test('canSimulate true', () => {
  assert.equal(canSimulate({ allowed: true }), true);
});

test('canSimulate false', () => {
  assert.equal(canSimulate({ allowed: false }), false);
});

test('canSimulate undefined', () => {
  assert.equal(canSimulate(undefined), false);
});

// cleanupResultText

test('cleanupResultText with success', () => {
  const result = { deleted: 3, failed: 0, problems: [], local_removed: 0 };
  assert.equal(cleanupResultText(result), 'Deleted 3 record(s) in Zoho.');
});

test('cleanupResultText with local removal', () => {
  const result = { deleted: 3, failed: 0, problems: [], local_removed: 2 };
  assert.equal(cleanupResultText(result), 'Deleted 3 record(s) in Zoho, removed 2 simulated order(s).');
});

test('cleanupResultText with failure and problem', () => {
  const result = { deleted: 3, failed: 1, problems: ['Something went wrong'], local_removed: 0 };
  assert.equal(cleanupResultText(result), 'Deleted 3 record(s) in Zoho, 1 could not be deleted. Something went wrong.');
});