import { test } from "node:test";
import assert from "node:assert/strict";
import { joinSpeech, endsDictation } from "../dictation.js";

test("join and end", () => {
  assert.deepEqual(joinSpeech('hello', ' world '), "hello world");
  assert.deepEqual(joinSpeech('', 'one', ''), "one");
  assert.deepEqual(endsDictation('not-allowed'), true);
  assert.deepEqual(endsDictation('no-speech'), false);
});
