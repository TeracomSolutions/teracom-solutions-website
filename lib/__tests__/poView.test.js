import test from 'node:test';
import assert from 'node:assert/strict';

import {
  poStatusLabel,
  poStatusTone,
  poButtons,
  poRecipientNote,
  poLineTotalCents,
  unassignedNote,
} from '../poView.js';

// poStatusLabel

test('poStatusLabel for draft', () => {
  assert.equal(poStatusLabel('draft'), 'Draft (not in Zoho yet)');
});

test('poStatusLabel for created', () => {
  assert.equal(poStatusLabel('created'), 'Created in Zoho');
});

test('poStatusLabel for issued', () => {
  assert.equal(poStatusLabel('issued'), 'Issued in Zoho, email not sent yet');
});

test('poStatusLabel for sent', () => {
  assert.equal(poStatusLabel('sent'), 'Sent to the supplier');
});

test('poStatusLabel for failed', () => {
  assert.equal(poStatusLabel('failed'), 'Failed');
});

test('poStatusLabel for unknown status', () => {
  assert.equal(poStatusLabel('some_new'), 'Some new');
});

// poStatusTone

test('poStatusTone for sent', () => {
  assert.equal(poStatusTone('sent'), 'good');
});

test('poStatusTone for created', () => {
  assert.equal(poStatusTone('created'), 'warn');
});

test('poStatusTone for issued', () => {
  assert.equal(poStatusTone('issued'), 'warn');
});

test('poStatusTone for failed', () => {
  assert.equal(poStatusTone('failed'), 'bad');
});

test('poStatusTone for unknown status', () => {
  assert.equal(poStatusTone('some_new'), 'muted');
});

// poButtons

test('poButtons for draft status', () => {
  const result = poButtons({ status: 'draft' });
  assert.equal(result.create, true);
  assert.equal(result.send, false);
});

test('poButtons for failed status', () => {
  const result = poButtons({ status: 'failed' });
  assert.equal(result.create, true);
  assert.equal(result.send, false);
});

test('poButtons for created status', () => {
  const result = poButtons({ status: 'created' });
  assert.equal(result.create, false);
  assert.equal(result.send, true);
});

test('poButtons for issued status', () => {
  const result = poButtons({ status: 'issued' });
  assert.equal(result.create, false);
  assert.equal(result.send, true);
});

test('poButtons for sent status', () => {
  const result = poButtons({ status: 'sent' });
  assert.equal(result.create, false);
  assert.equal(result.send, false);
});

// poRecipientNote

test('poRecipientNote in live mode with email', () => {
  const result = poRecipientNote({ mode: 'live', email_to: 'supplier@example.com' });
  assert.equal(result, 'The purchase order will be emailed to supplier@example.com.');
});

test('poRecipientNote in live mode without email', () => {
  const result = poRecipientNote({ mode: 'live', email_to: null });
  assert.equal(result, 'The purchase order will be emailed to the supplier (no email address set).');
});

test('poRecipientNote in test mode with email', () => {
  const result = poRecipientNote({ mode: 'test', email_to: 'test@example.com' });
  assert.equal(result, 'TEST: nothing goes to the supplier. Emails go only to test@example.com.');
});

test('poRecipientNote in test mode without email', () => {
  const result = poRecipientNote({ mode: 'test', email_to: null });
  assert.equal(result, 'TEST: nothing goes to the supplier. Emails go only to the test address (not set, so sending is refused).');
});

// poLineTotalCents

test('poLineTotalCents for two lines', () => {
  const result = poLineTotalCents({ lines: [
    { quantity: 2, cost_cents: 2000 },
    { quantity: 1, cost_cents: 500 }
  ]});
  assert.equal(result, 4500);
});

test('poLineTotalCents with missing cost', () => {
  const result = poLineTotalCents({ lines: [
    { quantity: 2, cost_cents: 2000 },
    { quantity: 1 }
  ]});
  assert.equal(result, 4000);
});

// unassignedNote

test('unassignedNote for empty array', () => {
  assert.equal(unassignedNote([]), '');
});

test('unassignedNote for undefined', () => {
  assert.equal(unassignedNote(undefined), '');
});

test('unassignedNote for two items', () => {
  const result = unassignedNote([
    { sku: 'SKU123' },
    { sku: 'SKU456' }
  ]);
  assert.equal(result, 'No supplier is set for: SKU123, SKU456. They are not on any purchase order.');
});