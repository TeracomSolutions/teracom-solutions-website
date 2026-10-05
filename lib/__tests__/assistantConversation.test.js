import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_SILENT_ROUNDS,
  conversationNotice,
  conversationStep,
  endsConversation,
  normaliseSpeech,
} from '../assistantConversation.js';

test('speech is reduced to plain lower case words', () => {
  assert.equal(normaliseSpeech("Okay, that's all -- thanks!"), 'okay thats all thanks');
  assert.equal(normaliseSpeech(null), '');
});

test('a goodbye ends the conversation, with or without politeness', () => {
  for (const said of ['Goodbye', "That's all", 'Okay, that is all, thanks', 'stop', 'No thanks', 'Thank you', "I'm done."]) {
    assert.equal(endsConversation(said), true, said);
  }
});

test('a question that mentions stop or thanks does not end it', () => {
  for (const said of ['How do I stop the scheduler?', 'What does the freight minimum do', 'Thanks, now what about Gold tier', '']) {
    assert.equal(endsConversation(said), false, said);
  }
});

test('words heard are sent, and reset the count of silent rounds', () => {
  assert.deepEqual(conversationStep({ heard: true, spoken: 'What does Freight do', silentRounds: 2 }), {
    action: 'send',
    silentRounds: 0,
    reason: '',
  });
});

test('a goodbye finishes instead of being sent', () => {
  const step = conversationStep({ heard: true, spoken: "That's all thanks", silentRounds: 0 });
  assert.equal(step.action, 'end');
  assert.equal(step.reason, 'goodbye');
});

test('silence listens again until the limit, then ends', () => {
  let rounds = 0;
  for (let n = 1; n < MAX_SILENT_ROUNDS; n += 1) {
    const step = conversationStep({ heard: false, spoken: '', silentRounds: rounds });
    assert.equal(step.action, 'listen');
    rounds = step.silentRounds;
  }
  const last = conversationStep({ heard: false, spoken: '', silentRounds: rounds });
  assert.equal(last.action, 'end');
  assert.equal(last.reason, 'silence');
});

test('every end has a notice, and an unknown one still gets words', () => {
  assert.match(conversationNotice('silence'), /nothing was heard/);
  assert.match(conversationNotice('mic'), /microphone/);
  assert.equal(conversationNotice('whatever'), 'Conversation ended.');
});
