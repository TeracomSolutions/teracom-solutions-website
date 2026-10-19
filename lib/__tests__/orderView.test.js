import test from 'node:test';
import assert from 'node:assert/strict';

import {
  stepLabel,
  statusLabel,
  statusTone,
  orderStatusLabel,
  orderStatusTone,
  cents,
  describeCall,
  nextStep,
  stepButtons,
  buildOrdersQuery,
  pageToSkip,
  alertTone,
} from '../orderView.js';

// stepLabel

test('stepLabel for contact', () => {
  assert.equal(stepLabel('contact'), 'Customer in Zoho');
});

test('stepLabel for items', () => {
  assert.equal(stepLabel('items'), 'Products in Zoho');
});

test('stepLabel for invoice', () => {
  assert.equal(stepLabel('invoice'), 'Invoice');
});

test('stepLabel for mark_sent', () => {
  assert.equal(stepLabel('mark_sent'), 'Mark invoice as sent (no email)');
});

test('stepLabel for payment', () => {
  assert.equal(stepLabel('payment'), 'Payment');
});

test('stepLabel for freight_check', () => {
  assert.equal(stepLabel('freight_check'), 'Freight check');
});

test('stepLabel for unknown step', () => {
  assert.equal(stepLabel('some_new_step'), 'Some new step');
});

// statusLabel and statusTone

test('statusLabel for pending', () => {
  assert.equal(statusLabel('pending'), 'Waiting');
});

test('statusLabel for preview', () => {
  assert.equal(statusLabel('preview'), 'Preview only');
});

test('statusLabel for awaiting_approval', () => {
  assert.equal(statusLabel('awaiting_approval'), 'Needs your approval');
});

test('statusLabel for approved', () => {
  assert.equal(statusLabel('approved'), 'Approved');
});

test('statusLabel for sent', () => {
  assert.equal(statusLabel('sent'), 'Sent');
});

test('statusLabel for failed', () => {
  assert.equal(statusLabel('failed'), 'Failed');
});

test('statusLabel for done', () => {
  assert.equal(statusLabel('done'), 'Done');
});

test('statusLabel for skipped', () => {
  assert.equal(statusLabel('skipped'), 'Not needed');
});

test('statusLabel for unknown status', () => {
  assert.equal(statusLabel('some_new_status'), 'Some new status');
});

test('statusTone for done', () => {
  assert.equal(statusTone('done'), 'good');
});

test('statusTone for sent', () => {
  assert.equal(statusTone('sent'), 'good');
});

test('statusTone for awaiting_approval', () => {
  assert.equal(statusTone('awaiting_approval'), 'warn');
});

test('statusTone for approved', () => {
  assert.equal(statusTone('approved'), 'warn');
});

test('statusTone for preview', () => {
  assert.equal(statusTone('preview'), 'warn');
});

test('statusTone for failed', () => {
  assert.equal(statusTone('failed'), 'bad');
});

test('statusTone for unknown status', () => {
  assert.equal(statusTone('some_new_status'), 'muted');
});

// orderStatusLabel and orderStatusTone

test('orderStatusLabel for recorded', () => {
  assert.equal(orderStatusLabel('recorded'), 'Recorded');
});

test('orderStatusLabel for in_progress', () => {
  assert.equal(orderStatusLabel('in_progress'), 'In progress');
});

test('orderStatusLabel for attention', () => {
  assert.equal(orderStatusLabel('attention'), 'Needs attention');
});

test('orderStatusLabel for complete', () => {
  assert.equal(orderStatusLabel('complete'), 'Complete');
});

test('orderStatusLabel for unknown status', () => {
  assert.equal(orderStatusLabel('some_new_status'), 'Some new status');
});

test('orderStatusTone for complete', () => {
  assert.equal(orderStatusTone('complete'), 'good');
});

test('orderStatusTone for attention', () => {
  assert.equal(orderStatusTone('attention'), 'bad');
});

test('orderStatusTone for in_progress', () => {
  assert.equal(orderStatusTone('in_progress'), 'warn');
});

test('orderStatusTone for unknown status', () => {
  assert.equal(orderStatusTone('some_new_status'), 'muted');
});

// cents

test('cents formats 1250 as $12.50', () => {
  assert.equal(cents(1250), '$12.50');
});

test('cents formats 123456 as $1,234.56', () => {
  assert.equal(cents(123456), '$1,234.56');
});

test('cents returns — for null', () => {
  assert.equal(cents(null), '—');
});

test('cents returns — for undefined', () => {
  assert.equal(cents(undefined), '—');
});

// describeCall

test('describeCall for contact', () => {
  assert.equal(describeCall({ kind: 'contact', method: 'POST', path: '/api/zoho/customer' }), 'Create the customer (POST /api/zoho/customer)');
});

test('describeCall for item', () => {
  assert.equal(describeCall({ kind: 'item', method: 'POST', path: '/api/zoho/item' }), 'Create a product (POST /api/zoho/item)');
});

test('describeCall for invoice', () => {
  assert.equal(describeCall({ kind: 'invoice', method: 'POST', path: '/api/zoho/invoice' }), 'Create the invoice (POST /api/zoho/invoice)');
});

test('describeCall for invoice_status', () => {
  assert.equal(describeCall({ kind: 'invoice_status', method: 'PUT', path: '/api/zoho/invoice/status' }), 'Mark the invoice as sent (no email is sent) (PUT /api/zoho/invoice/status)');
});

test('describeCall for payment', () => {
  assert.equal(describeCall({ kind: 'payment', method: 'POST', path: '/api/zoho/payment' }), 'Record the payment (POST /api/zoho/payment)');
});

test('describeCall for unknown kind', () => {
  assert.equal(describeCall({ kind: 'unknown_kind', method: 'GET', path: '/api/unknown' }), 'unknown_kind (GET /api/unknown)');
});

// nextStep

test('nextStep returns first non-done, non-skipped step', () => {
  const steps = [
    { name: 'contact', status: 'done' },
    { name: 'items', status: 'pending' },
    { name: 'invoice', status: 'skipped' },
  ];
  assert.equal(nextStep(steps).name, 'items');
});

test('nextStep returns null when all steps are done or skipped', () => {
  const steps = [
    { name: 'contact', status: 'done' },
    { name: 'items', status: 'skipped' },
  ];
  assert.equal(nextStep(steps), null);
});

test('nextStep returns first step when all are pending', () => {
  const steps = [
    { name: 'contact', status: 'pending' },
    { name: 'items', status: 'pending' },
  ];
  assert.equal(nextStep(steps).name, 'contact');
});

test('nextStep sorts by seq when not done or skipped', () => {
  const steps = [
    { name: 'items', status: 'done' },
    { name: 'contact', status: 'pending' },
  ];
  assert.equal(nextStep(steps).name, 'contact');
});

// stepButtons

test('stepButtons returns prepare and approve buttons for next step in pending status', () => {
  const steps = [
    { name: 'contact', status: 'pending' },
    { name: 'items', status: 'done' },
  ];
  const result = stepButtons({ name: 'contact', status: 'pending' }, steps);
  assert.equal(result.prepare, true);
  assert.equal(result.approve, false);
});

test('stepButtons returns approve button for next step in awaiting_approval status', () => {
  const steps = [
    { name: 'contact', status: 'awaiting_approval' },
    { name: 'items', status: 'done' },
  ];
  const result = stepButtons({ name: 'contact', status: 'awaiting_approval' }, steps);
  assert.equal(result.prepare, false);
  assert.equal(result.approve, true);
});

test('stepButtons returns approve button for next step in preview status', () => {
  const steps = [
    { name: 'contact', status: 'preview' },
    { name: 'items', status: 'done' },
  ];
  const result = stepButtons({ name: 'contact', status: 'preview' }, steps);
  assert.equal(result.prepare, false);
  assert.equal(result.approve, true);
});

test('stepButtons returns approve button for next step in failed status', () => {
  const steps = [
    { name: 'contact', status: 'failed' },
    { name: 'items', status: 'done' },
  ];
  const result = stepButtons({ name: 'contact', status: 'failed' }, steps);
  assert.equal(result.prepare, false);
  assert.equal(result.approve, true);
});

test('stepButtons returns no buttons for next step in done status', () => {
  const steps = [
    { name: 'contact', status: 'done' },
    { name: 'items', status: 'pending' },
  ];
  const result = stepButtons({ name: 'contact', status: 'done' }, steps);
  assert.equal(result.prepare, false);
  assert.equal(result.approve, false);
});

test('stepButtons returns no buttons for a non-next step', () => {
  const steps = [
    { name: 'contact', status: 'pending' },
    { name: 'items', status: 'pending' },
  ];
  const result = stepButtons({ name: 'items', status: 'pending' }, steps);
  assert.equal(result.prepare, false);
  assert.equal(result.approve, false);
});

// buildOrdersQuery

test('buildOrdersQuery with all filters', () => {
  const query = buildOrdersQuery({ status: 'in_progress', mode: 'live', q: 'john@example.com', page: 1 });
  assert.equal(query, '?status=in_progress&mode=live&q=john%40example.com');
});

test('buildOrdersQuery with page 1 (should not be added)', () => {
  const query = buildOrdersQuery({ page: 1 });
  assert.equal(query, '');
});

test('buildOrdersQuery with page 3 (should be added)', () => {
  const query = buildOrdersQuery({ page: 3 });
  assert.equal(query, '?page=3');
});

test('buildOrdersQuery with empty values', () => {
  const query = buildOrdersQuery({ status: '', mode: '', q: '', page: '' });
  assert.equal(query, '');
});

test('buildOrdersQuery with no filters (should return empty string)', () => {
  const query = buildOrdersQuery({});
  assert.equal(query, '');
});

// pageToSkip

test('pageToSkip(1) returns 0', () => {
  assert.equal(pageToSkip(1), 0);
});

test('pageToSkip(3) returns 100', () => {
  assert.equal(pageToSkip(3), 100);
});

test('pageToSkip with non-numeric value returns 0', () => {
  assert.equal(pageToSkip('x'), 0);
});

// alertTone

test('alertTone for problem severity', () => {
  assert.equal(alertTone('problem'), 'bad');
});

test('alertTone for info severity', () => {
  assert.equal(alertTone('info'), 'muted');
});