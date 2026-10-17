import test from 'node:test';
import assert from 'node:assert/strict';

import { LISTEN_DELAY_MS, conversationNotice, conversationStep } from '../assistantConversation.js';
test('words heard are sent', () => {
  assert.deepEqual(conversationStep({ heard: true, spoken: 'What does Freight do' }), { action: 'send' });
});
test('silence listens again, however long it lasts', () => {
  assert.deepEqual(conversationStep({ heard: false }), { action: 'listen' });
  assert.deepEqual(conversationStep({ heard: false, silentRounds: 50 }), { action: 'listen' });
});
test('goodbyes and thanks never end the conversation', () => {
  for (const said of ['Goodbye', "That's all, thanks", 'stop', 'Thank you', 'cheers']) {
    assert.deepEqual(conversationStep({ heard: true, spoken: said }), { action: 'send' }, said);
  }
});
test('the notice says why it ended, and falls back to a plain one', () => {
  assert.match(conversationNotice('mic'), /microphone/);
  assert.equal(conversationNotice('stopped'), 'Conversation ended.');
  assert.equal(conversationNotice('silence'), 'Conversation ended.');
  assert.equal(conversationNotice(undefined), 'Conversation ended.');
});
test('the microphone reopens a moment after a reply', () => {
  assert.ok(LISTEN_DELAY_MS > 0 && LISTEN_DELAY_MS < 2000);
});
