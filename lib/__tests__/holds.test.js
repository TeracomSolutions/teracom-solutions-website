import test from 'node:test';
import assert from 'node:assert/strict';

import { STATUS_LABELS, dollars, heldNotice, holdReason, tabLabel } from '../holds.js';

test('money is shown in Australian dollars from cents', () => {
  assert.equal(dollars(18700), '$187.00');
  assert.equal(dollars(123456), '$1,234.56');
  assert.equal(dollars(null), '$0.00');
});

test('an import result says when rows were held or left out, and nothing when not', () => {
  assert.equal(heldNotice({ created: 5, updated: 2 }), '');
  assert.equal(heldNotice({ held: 1 }), '1 row held for review (recommended price below cost)');
  assert.equal(heldNotice({ held: 3, left_out: 2 }), '3 rows held for review (recommended price below cost), 2 left out as before');
  assert.equal(heldNotice(null), '');
});

test('the reason for a hold compares the price before GST with the cost', () => {
  const reason = holdReason({ price_ex_gst_cents: 17000, cost_cents: 21000 });
  assert.equal(reason, 'The recommended price is $170.00 before GST, which is less than the cost of $210.00.');
});

test('the Store tab shows how many are waiting', () => {
  assert.equal(tabLabel(0), 'Needs review');
  assert.equal(tabLabel(4), 'Needs review (4)');
});

test('every status the backend uses has words', () => {
  for (const status of ['pending', 'dismissed', 'approved', 'cleared']) {
    assert.ok(STATUS_LABELS[status], status);
  }
});
