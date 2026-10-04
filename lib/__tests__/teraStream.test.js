import test from 'node:test';
import assert from 'node:assert/strict';

import { takeEvents } from '../teraStream.js';

const LINE = String.fromCharCode(10);
const event = (data) => `data: ${JSON.stringify(data)}${LINE}${LINE}`;

test('complete events are read and an unfinished one is kept', () => {
  const buffer = event({ type: 'text', text: 'Hold ' }) + event({ type: 'text', text: 'reset.' }) + 'data: {"type":"do';
  const { events, rest } = takeEvents(buffer);
  assert.deepEqual(events, [{ type: 'text', text: 'Hold ' }, { type: 'text', text: 'reset.' }]);
  assert.equal(rest, 'data: {"type":"do');
  const next = takeEvents(rest + 'ne","reply":"Hold reset."}' + LINE + LINE);
  assert.deepEqual(next.events, [{ type: 'done', reply: 'Hold reset.' }]);
  assert.equal(next.rest, '');
});

test('broken or empty events are skipped', () => {
  const { events } = takeEvents(`data: {nope${LINE}${LINE}${LINE}${LINE}` + event({ type: 'error', error: 'x' }));
  assert.deepEqual(events, [{ type: 'error', error: 'x' }]);
  assert.deepEqual(takeEvents('').events, []);
});
