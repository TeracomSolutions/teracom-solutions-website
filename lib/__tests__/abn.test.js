import { test } from 'node:test';
import assert from 'node:assert/strict';

import { abnDigits, abnProblem, formatAbn, isValidAbn } from '../abn.js';

// Real, published ABNs. These exist so that the "subtract 1 from the first
// digit" step can never be quietly dropped: without it the algorithm still
// looks sensible and rejects every one of these.
const REAL = {
  teracom: '49 107 979 546',
  ato: '51 824 753 556',
  telstra: '33 051 775 556',
};

test('every real ABN is accepted', () => {
  for (const [who, abn] of Object.entries(REAL)) {
    assert.equal(isValidAbn(abn), true, `${who} (${abn}) should be valid`);
  }
});

test("Teracom's own ABN is accepted", () => {
  // Called out separately because this is the one that matters most: if this
  // fails, the trade account application rejects the company that owns it.
  assert.equal(isValidAbn('49107979546'), true);
});

test('dropping the first-digit decrement would fail every real ABN', () => {
  // Guards the exact mistake. Teracom's weighted sum is 633 without the
  // decrement (633 % 89 = 10, rejected) and 623 with it (89 x 7 exactly).
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = '49107979546'.split('').map(Number);

  const withoutDecrement = digits.reduce((t, d, i) => t + d * weights[i], 0);
  assert.equal(withoutDecrement, 633);
  assert.notEqual(withoutDecrement % 89, 0, 'the broken version must not pass');

  digits[0] -= 1;
  const withDecrement = digits.reduce((t, d, i) => t + d * weights[i], 0);
  assert.equal(withDecrement, 623);
  assert.equal(withDecrement % 89, 0);
});

test('a single altered digit is rejected', () => {
  assert.equal(isValidAbn('49 107 979 547'), false);
  assert.equal(isValidAbn('49 107 979 545'), false);
});

test('spaces and punctuation are ignored', () => {
  assert.equal(isValidAbn('49107979546'), true);
  assert.equal(isValidAbn('49 107 979 546'), true);
  assert.equal(isValidAbn(' 49-107-979-546 '), true);
  assert.equal(abnDigits('49 107 979 546'), '49107979546');
});

test('nonsense of the right length is rejected', () => {
  assert.equal(isValidAbn('12345678901'), false);
  assert.equal(isValidAbn('00000000000'), false);
  assert.equal(isValidAbn('11111111111'), false);
});

test('blank and malformed input is rejected without throwing', () => {
  for (const value of ['', '   ', null, undefined, 'not an abn', '4910797954', '491079795461']) {
    assert.equal(isValidAbn(value), false);
  }
});

test('an ACN is named as an ACN, because that is the usual mistake', () => {
  // 9 digits pasted from a company search. "Invalid ABN" would leave someone
  // staring at a number they know is correct.
  assert.match(abnProblem('051 775 556'), /ACN/);
  assert.match(abnProblem('051 775 556'), /11 digits/);
});

test('a wrong length says how many digits were given', () => {
  assert.match(abnProblem('4910797954'), /10/);
});

test('a blank ABN is not a format problem', () => {
  // Whether it was required is a separate question the caller already knows.
  assert.equal(abnProblem(''), null);
  assert.equal(abnProblem(null), null);
});

test('a valid ABN reports no problem', () => {
  for (const abn of Object.values(REAL)) {
    assert.equal(abnProblem(abn), null);
  }
});

test('an invalid 11-digit ABN points at where to check', () => {
  assert.match(abnProblem('12345678901'), /invoice or letterhead/);
});

test('formatting matches the way the ATO prints it', () => {
  assert.equal(formatAbn('49107979546'), '49 107 979 546');
  assert.equal(formatAbn('49 107 979 546'), '49 107 979 546');
  // Anything that is not 11 digits comes back untouched rather than being
  // chopped into a shape it is not.
  assert.equal(formatAbn('12345'), '12345');
  assert.equal(formatAbn(''), '');
});
