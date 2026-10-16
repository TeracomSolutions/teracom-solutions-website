import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMessages, doneFrame, errorFrame, MAX_MESSAGES, MAX_CHARS } from '../teraStaffChat.js';

// Test case 1: 'no history gives just the new message'
test('no history gives just the new message', () => {
  const result = buildMessages(undefined, 'Hi');
  assert.deepEqual(result, [{ role: 'user', content: 'Hi' }]);
});

// Test case 2: 'a greeting at the start of the history is dropped'
test('a greeting at the start of the history is dropped', () => {
  const history = [{ role: 'assistant', content: 'Welcome' }, { role: 'user', content: 'a' }];
  const result = buildMessages(history, 'b');
  assert.deepEqual(result, [{ role: 'user', content: 'a' }, { role: 'user', content: 'b' }]);
});

// Test case 3: 'the order is kept and the new message is trimmed'
test('the order is kept and the new message is trimmed', () => {
  const history = [
    { role: 'user', content: 'q1' },
    { role: 'assistant', content: 'a1' },
    { role: 'user', content: 'q2' },
    { role: 'assistant', content: 'a2' }
  ];
  const result = buildMessages(history, '  q3  ');
  assert.deepEqual(result, [
    { role: 'user', content: 'q1' },
    { role: 'assistant', content: 'a1' },
    { role: 'user', content: 'q2' },
    { role: 'assistant', content: 'a2' },
    { role: 'user', content: 'q3' }
  ]);
});

// Test case 4: 'bad roles, blank or non-text entries are skipped'
test('bad roles, blank or non-text entries are skipped', () => {
  const history = [
    { role: 'system', content: 'x' },
    { role: 'user', content: '   ' },
    { role: 'user', content: 'ok' },
    { role: 'user', content: 5 }
  ];
  const result = buildMessages(history, 'go');
  assert.deepEqual(result, [
    { role: 'user', content: 'ok' },
    { role: 'user', content: 'go' }
  ]);
});

// Test case 5: 'long contents are cut'
test('long contents are cut', () => {
  const history = [{ role: 'user', content: 'x'.repeat(9000) }];
  const result = buildMessages(history, 'y');
  assert.equal(result[0].content.length, MAX_CHARS);
});

// Test case 6: 'a long history keeps the last messages and starts with the user'
test('a long history keeps the last messages and starts with the user', () => {
  // Create a history of 16 pairs
  const history = [];
  for (let i = 0; i <= 15; i++) {
    history.push({ role: 'user', content: 'u' + i });
    history.push({ role: 'assistant', content: 'a' + i });
  }

  const result = buildMessages(history, 'last');

  // Check length
  assert.ok(result.length <= MAX_MESSAGES);

  // Check first entry is a user message
  assert.equal(result[0].role, 'user');
  assert.equal(result[0].content, 'u5');

  // Check last entry is the new message
  assert.equal(result[result.length - 1].role, 'user');
  assert.equal(result[result.length - 1].content, 'last');
});

// Test case 7: 'a history that is not a list is ignored and the message is trimmed'
test('a history that is not a list is ignored and the message is trimmed', () => {
  const result = buildMessages('nope', ' t ');
  assert.deepEqual(result, [{ role: 'user', content: 't' }]);
});

// Test case 8: 'doneFrame builds the event the chat window reads'
test('doneFrame builds the event the chat window reads', () => {
  const newline = String.fromCharCode(10);

  const result1 = doneFrame('hello', null);
  const expected1 = 'data: ' + JSON.stringify({ type: 'done', reply: 'hello', sources: [], answered: true, conversation_id: null, message_id: null }) + newline + newline;
  assert.equal(result1, expected1);

  const result2 = doneFrame(undefined, 'abc');
  const expected2 = 'data: ' + JSON.stringify({ type: 'done', reply: '', sources: [], answered: true, conversation_id: 'abc', message_id: null }) + newline + newline;
  assert.equal(result2, expected2);
});

// Test case 9: 'errorFrame builds the error event'
test('errorFrame builds the error event', () => {
  const newline = String.fromCharCode(10);

  const result = errorFrame('bad');
  const expected = 'data: ' + JSON.stringify({ type: 'error', error: 'bad' }) + newline + newline;
  assert.equal(result, expected);

  const result2 = errorFrame();
  const expected2 = 'data: ' + JSON.stringify({ type: 'error', error: 'Tera is not available right now.' }) + newline + newline;
  assert.equal(result2, expected2);
});

// Test case 10: 'the limits are as expected'
test('the limits are as expected', () => {
  assert.equal(MAX_MESSAGES, 24);
  assert.equal(MAX_CHARS, 8000);
});