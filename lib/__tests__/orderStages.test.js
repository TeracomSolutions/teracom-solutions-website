import assert from 'node:assert/strict';
import test from 'node:test';

import { STAGES, stageButton, stageMark, stageName, stageStateText, stageTone } from '../orderStages.js';

test('eleven stages from paid to complete, with names', () => {
  assert.equal(STAGES.length, 11);
  assert.equal(STAGES[0][0], 'paid');
  assert.equal(STAGES[10][0], 'complete');
  assert.equal(stageName('invoice_sent'), 'Invoice marked sent');
  assert.equal(stageName('mystery'), 'mystery');
});

test('states read plainly and get the order colours', () => {
  assert.equal(stageStateText('waiting'), 'Waiting for you');
  assert.equal(stageTone('done'), 'good');
  assert.equal(stageTone('failed'), 'bad');
  assert.equal(stageTone('preview'), 'warn');
  assert.equal(stageTone('not_started'), 'muted');
  assert.equal(stageMark('done'), '✓');
  assert.equal(stageMark('nonsense'), '○');
});

test('the button matches the state', () => {
  assert.equal(stageButton({ state: 'done', action: null }), null);
  assert.deepEqual(stageButton({ state: 'not_started', action: { kind: 'step', name: 'contact' } }), { kind: 'prepare', step: 'contact', label: 'Prepare' });
  assert.deepEqual(stageButton({ state: 'failed', action: { kind: 'step', name: 'invoice' } }), { kind: 'approve', step: 'invoice', label: 'Retry' });
  assert.equal(stageButton({ state: 'waiting', action: { kind: 'step', name: 'payment' } }).label, 'Approve');
  assert.equal(stageButton({ state: 'waiting', action: { kind: 'purchase_orders' } }).href, '#purchase-orders');
});
