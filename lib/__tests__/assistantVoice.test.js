import test from 'node:test';
import assert from 'node:assert/strict';

import { nextState, pickVoice, speakableText, speechChunks } from '../assistantVoice.js';

const voices = [
  { lang: 'de-DE', name: 'Anna' },
  { lang: 'en-US', name: 'Samantha', default: true },
  { lang: 'en-GB', name: 'Daniel' },
  { lang: 'en-AU', name: 'Karen' },
];

test('pickVoice prefers Australian English, then British, then any English', () => {
  assert.equal(pickVoice(voices).name, 'Karen');
  assert.equal(pickVoice(voices.slice(0, 3)).name, 'Daniel');
  assert.equal(pickVoice(voices.slice(0, 2)).name, 'Samantha');
  assert.equal(pickVoice([{ lang: 'fr-FR', name: 'Amelie' }, { lang: 'de-DE', name: 'Anna', default: true }]).name, 'Anna');
  assert.equal(pickVoice([{ lang: 'fr-FR', name: 'Amelie' }]).name, 'Amelie');
  assert.equal(pickVoice([]), undefined);
  assert.equal(pickVoice(undefined), undefined);
});

test('nextState walks the avatar through listening, thinking and speaking', () => {
  assert.equal(nextState('idle', 'listen_start'), 'listening');
  assert.equal(nextState('listening', 'listen_end'), 'idle');
  assert.equal(nextState('idle', 'send'), 'thinking');
  assert.equal(nextState('thinking', { type: 'reply', speak: true }), 'speaking');
  assert.equal(nextState('thinking', { type: 'reply', speak: false }), 'idle');
  assert.equal(nextState('thinking', 'reply'), 'idle');
  assert.equal(nextState('speaking', 'speak_end'), 'idle');
  assert.equal(nextState('listening', 'error'), 'idle');
  assert.equal(nextState('thinking', 'nonsense'), 'thinking');
  assert.equal(nextState('idle', undefined), 'idle');
});

test('speakableText strips markdown and collapses whitespace', () => {
  const reply = '## Leads\n\n- **Two** new leads\n- `SKU-1` is *low*\n\n```\ncode block\n```\nDone.';
  assert.equal(speakableText(reply), 'Leads Two new leads SKU-1 is low Done.');
  assert.equal(speakableText(''), '');
  assert.equal(speakableText(null), '');
});

test('speakableText caps a very long answer at 6000 characters on a word boundary', () => {
  const long = Array.from({ length: 2000 }, (_, i) => `word${i}`).join(' ');
  const spoken = speakableText(long);
  assert.ok(spoken.length <= 6000, String(spoken.length));
  assert.ok(spoken.endsWith('…'));
  assert.ok(!spoken.slice(0, -1).endsWith(' '));
  assert.match(spoken, /word\d+…$/);
});

test('speechChunks keeps a short reply whole', () => {
  assert.deepEqual(speechChunks('Done. Two new leads.'), ['Done. Two new leads.']);
  assert.deepEqual(speechChunks(''), []);
  assert.deepEqual(speechChunks(null), []);
});

test('speechChunks splits a long reply at sentence ends and loses no words', () => {
  const reply = Array.from({ length: 120 }, (_, i) => `This is sentence number ${i} of a long answer.`).join(' ');
  const chunks = speechChunks(reply, 300);
  assert.ok(chunks.length > 10, String(chunks.length));
  assert.ok(chunks.every((chunk) => chunk.length <= 300));
  assert.ok(chunks.every((chunk) => chunk.endsWith('.')));
  assert.equal(chunks.join(' '), speakableText(reply));
});

test('speechChunks cuts a run with no full stops at a space', () => {
  const run = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ');
  const chunks = speechChunks(run, 100);
  assert.ok(chunks.length > 5, String(chunks.length));
  assert.ok(chunks.every((chunk) => chunk.length <= 100));
  assert.equal(chunks.join(' '), run);
});
