import test from 'node:test';
import assert from 'node:assert/strict';

import { shouldForward, buildForwardBody, describeForwardResult } from '../orderFlowForward.js';

// Test shouldForward function
await test('shouldForward is true only for true', () => {
  assert.ok(shouldForward({ ORDER_FLOW_FORWARD: 'true' }));
  assert.ok(shouldForward({ ORDER_FLOW_FORWARD: ' TRUE ' }));
  assert.ok(!shouldForward(undefined));
  assert.ok(!shouldForward({}));
  assert.ok(!shouldForward({ ORDER_FLOW_FORWARD: '' }));
  assert.ok(!shouldForward({ ORDER_FLOW_FORWARD: 'false' }));
  assert.ok(!shouldForward({ ORDER_FLOW_FORWARD: '1' }));
  assert.ok(!shouldForward({ ORDER_FLOW_FORWARD: 'yes' }));
});

// Test buildForwardBody function
await test('buildForwardBody returns { session, event_id }', () => {
  const session = { id: 'sess_123' };

  // Test with event_id
  const resultWithId = buildForwardBody(session, 'evt_456');
  assert.deepEqual(resultWithId, { session, event_id: 'evt_456' });

  // Test without event_id
  const resultWithoutId = buildForwardBody(session);
  assert.deepEqual(resultWithoutId, { session, event_id: null });

  // Test good session with event_id
  assert.deepEqual(buildForwardBody({ id: 'sess_123' }, 'evt_1'), { session: { id: 'sess_123' }, event_id: 'evt_1' });
});

await test('buildForwardBody throws for invalid inputs', () => {
  assert.throws(() => buildForwardBody(null), new Error('The Stripe session has no id'));
  assert.throws(() => buildForwardBody('string'), new Error('The Stripe session has no id'));
  assert.throws(() => buildForwardBody({}), new Error('The Stripe session has no id'));
});

// Test describeForwardResult function
await test('describeForwardResult gives correct sentences', () => {
  // Test recorded true
  const result1 = { recorded: true, order_id: 'order_123', created: true };
  assert.equal(describeForwardResult(result1), 'Order order_123 recorded');

  const result2 = { recorded: true, order_id: 'order_456', created: false };
  assert.equal(describeForwardResult(result2), 'Order order_456 already recorded');

  // Test recorded false
  const result3 = { recorded: false, reason: 'switched off' };
  assert.equal(describeForwardResult(result3), 'Order flow not recording: switched off');

  // Test undefined and {} cases
  assert.equal(describeForwardResult(undefined), 'Unexpected answer from the order flow');
  assert.equal(describeForwardResult({}), 'Unexpected answer from the order flow');
});