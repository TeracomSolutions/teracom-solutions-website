import { test } from "node:test";
import assert from "node:assert/strict";
import { nextState, speakableText, speechChunks } from "../assistantVoice.js";

test("states", () => {
  assert.deepEqual(nextState('idle', 'listen_start'), "listening");
  assert.deepEqual(nextState('listening', 'send'), "thinking");
  assert.deepEqual(nextState('thinking', { type: 'reply', speak: true }), "speaking");
  assert.deepEqual(nextState('speaking', 'speak_end'), "idle");
});

test("speech text", () => {
  assert.deepEqual(speakableText('**Bold** and `code`'), "Bold and code");
  assert.deepEqual(speechChunks('a. b. c.', 3).length, 3);
});
