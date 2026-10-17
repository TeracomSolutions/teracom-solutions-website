import test from 'node:test';
import assert from 'node:assert/strict';

import { speakReply, stopSpeaking } from '../voicePlayer.js';

const LONG = Array.from({ length: 60 }, (_, i) => `This is sentence number ${i} of a long answer to read out.`).join(' ');

function browserSpeech({ autoEnd = true } = {}) {
  const spoken = [];
  const utterances = [];
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };
  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance) => {
        spoken.push(utterance.text);
        utterances.push(utterance);
        setTimeout(() => {
          utterance.onstart?.();
          if (autoEnd) utterance.onend?.();
        }, 0);
      },
    },
  };
  return { spoken, utterances };
}

function listeners() {
  const calls = { start: 0, end: 0, error: 0, fallback: 0 };
  return {
    calls,
    handlers: {
      onStart: () => { calls.start += 1; },
      onEnd: () => { calls.end += 1; },
      onError: () => { calls.error += 1; },
      onFallback: () => { calls.fallback += 1; },
    },
  };
}

test('a long reply is spoken in pieces, one after the other, and ends once', async () => {
  const { spoken } = browserSpeech();
  const { calls, handlers } = listeners();
  await speakReply(LONG, { engine: 'browser' }, handlers);
  assert.ok(spoken.length >= 3, String(spoken.length));
  assert.ok(spoken.every((piece) => piece.length <= 900));
  assert.equal(spoken.join(' '), LONG);
  assert.deepEqual(calls, { start: 1, end: 1, error: 0, fallback: 0 });
});
test('stopping part way through speaks nothing more and never ends', async () => {
  const { spoken, utterances } = browserSpeech({ autoEnd: false });
  const { calls, handlers } = listeners();
  const done = speakReply(LONG, { engine: 'browser' }, handlers);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(spoken.length, 1);
  stopSpeaking();
  utterances[0].onend();
  await done;
  assert.equal(spoken.length, 1);
  assert.equal(calls.end, 0);
  assert.equal(calls.error, 0);
});
test('a short reply is one piece and an empty one is not spoken', async () => {
  const { spoken } = browserSpeech();
  const { calls, handlers } = listeners();
  await speakReply('Done. Two new leads.', { engine: 'browser' }, handlers);
  await speakReply('', { engine: 'browser' }, handlers);
  assert.deepEqual(spoken, ['Done. Two new leads.']);
  assert.equal(calls.end, 1);
});
test('the cloud voice speaks each piece', async () => {
  const sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push(JSON.parse(init.body).text);
    return { ok: true, blob: async () => ({}) };
  };
  URL.createObjectURL = () => 'blob:piece';
  URL.revokeObjectURL = () => {};
  globalThis.Audio = class {
    pause() {}
    play() {
      setTimeout(() => {
        this.onplaying?.();
        this.onended?.();
      }, 0);
      return Promise.resolve();
    }
  };
  browserSpeech();
  const { calls, handlers } = listeners();
  await speakReply(LONG, { engine: 'cloud' }, handlers);
  assert.ok(sent.length >= 3, String(sent.length));
  assert.equal(sent.join(' '), LONG);
  assert.deepEqual(calls, { start: 1, end: 1, error: 0, fallback: 0 });
});
test('the browser voice takes over when the cloud voice cannot answer', async () => {
  globalThis.fetch = async () => ({ ok: false });
  const { spoken } = browserSpeech();
  const { calls, handlers } = listeners();
  await speakReply(LONG, { engine: 'cloud' }, handlers);
  assert.equal(calls.fallback, 1);
  assert.equal(spoken.join(' '), LONG);
  assert.equal(calls.end, 1);
});
