import test from 'node:test';
import assert from 'node:assert/strict';

import { MIN_FILL_MS, checkSubmission, spamReasonsForText, textValues } from '../formGuard.js';

const NOW = 1_800_000_000_000;
const ok = (extra = {}) => checkSubmission({ trap: '', started: NOW - 10_000, now: NOW, ...extra });

// The two that arrived through the contact form in September 2026.
const SPAM_1 = '<b>Cool hacker?</b> <b>Have VR?</b> <a href=https://bit.ly/4AusaJ9><b>Watch now</b></a>';
const SPAM_2 = 'Hello, I am Tracee Cain from FreeB2BData. We offer a B2B data list of decision makers, email list included.';

test('a normal enquiry passes', () => {
  const verdict = ok({ texts: ['We need 12 cameras at our Dandenong warehouse, see https://example.com/site-plan', 'Acme Pty Ltd'], names: ['Sam Lee'] });
  assert.deepEqual(verdict, { spam: false, reasons: [] });
});

test('the hidden field and the timer', () => {
  assert.deepEqual(ok({ trap: 'http://spam.example' }).reasons, ['trap']);
  assert.deepEqual(ok({ trap: '   ' }).reasons, []);
  assert.deepEqual(checkSubmission({ trap: '', now: NOW }).reasons, ['no-timer']);
  assert.deepEqual(checkSubmission({ trap: '', started: 'abc', now: NOW }).reasons, ['no-timer']);
  assert.deepEqual(checkSubmission({ trap: '', started: String(NOW - 10_000), now: NOW }).reasons, []);
  assert.deepEqual(checkSubmission({ trap: '', started: NOW - 1000, now: NOW }).reasons, ['too-fast']);
  assert.deepEqual(checkSubmission({ trap: '', started: NOW - MIN_FILL_MS, now: NOW }).reasons, []);
  assert.deepEqual(checkSubmission({ trap: '', started: NOW + 120_000, now: NOW }).reasons, ['bad-timer']);
});

test('the real spam is caught', () => {
  assert.deepEqual(ok({ texts: [SPAM_1] }).reasons, ['markup', 'shortener']);
  assert.deepEqual(ok({ texts: [SPAM_2] }).reasons, ['phrase']);
});

test('links and names', () => {
  const three = 'see https://a.example https://b.example www.c.example';
  assert.deepEqual(ok({ texts: [three] }).reasons, []);
  assert.deepEqual(ok({ texts: [three, 'and https://d.example'] }).reasons, ['links']);
  assert.deepEqual(ok({ names: ['Visit https://spam.example'] }).reasons, ['link-in-name']);
  assert.deepEqual(ok({ names: ['Jo Smith'] }).reasons, []);
});

test('ordinary security words are not spam', () => {
  assert.deepEqual(spamReasonsForText(['Our cryptography keys and SEO for the new site']), []);
  assert.deepEqual(spamReasonsForText(['Can you add me to the mailing list for product news?']), ['phrase']);
  assert.deepEqual(spamReasonsForText(['Price for 2 x TVN-2216P, less than <10 units?']), []);
  assert.deepEqual(spamReasonsForText([null, undefined, 42, '']), []);
});

test('textValues takes the strings only', () => {
  assert.deepEqual(textValues({ a: 'x', b: true, c: 3, d: 'y' }), ['x', 'y']);
  assert.deepEqual(textValues(null), []);
});
