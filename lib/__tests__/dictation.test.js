import test from 'node:test';
import assert from 'node:assert/strict';

import { endsDictation, joinSpeech } from '../dictation.js';

test('dictation adds to what was typed, settled words before the ones still being heard', () => {
  assert.equal(joinSpeech('Show me', ' the new leads ', 'from this week'), 'Show me the new leads from this week');
  assert.equal(joinSpeech('', 'hello', ''), 'hello');
  assert.equal(joinSpeech(null, undefined, '  '), '');
});

test('only real errors stop dictation; silence and Stop do not', () => {
  assert.equal(endsDictation('no-speech'), false);
  assert.equal(endsDictation('aborted'), false);
  assert.equal(endsDictation('not-allowed'), true);
  assert.equal(endsDictation('network'), true);
  assert.equal(endsDictation('audio-capture'), true);
});
