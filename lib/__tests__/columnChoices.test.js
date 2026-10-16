import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanColumnChoices } from '../columnChoices.js';

// a) 'a heading chosen for a field is kept': cleanColumnChoices({ cost: { on: true, heading: '  Dealer Price ' } }) deep-equals { choices: { cost: { on: true, heading: 'Dealer Price' } } }.
test('a heading chosen for a field is kept', () => {
  const result = cleanColumnChoices({ cost: { on: true, heading: '  Dealer Price ' } });
  assert.deepStrictEqual(result, { choices: { cost: { on: true, heading: 'Dealer Price' } } });
});

// b) 'on with no heading means automatic': cleanColumnChoices({ stock: { on: true, heading: '' } }) gives choices.stock deep-equal { on: true, heading: null }; a missing heading does the same.
test('on with no heading means automatic', () => {
  const result = cleanColumnChoices({ stock: { on: true, heading: '' } });
  assert.deepStrictEqual(result.choices.stock, { on: true, heading: null });
});

test('missing heading does the same', () => {
  const result = cleanColumnChoices({ stock: { on: true } });
  assert.deepStrictEqual(result.choices.stock, { on: true, heading: null });
});

// c) 'off drops the heading': cleanColumnChoices({ image_url: { on: false, heading: 'Image' } }) gives choices.image_url deep-equal { on: false, heading: null }.
test('off drops the heading', () => {
  const result = cleanColumnChoices({ image_url: { on: false, heading: 'Image' } });
  assert.deepStrictEqual(result.choices.image_url, { on: false, heading: null });
});

// d) 'the part number and the name cannot be turned off': cleanColumnChoices({ sku: { on: false } }).error is 'The part number and the name cannot be turned off.' and the same for name.
test('the part number and the name cannot be turned off', () => {
  const result1 = cleanColumnChoices({ sku: { on: false } });
  assert.strictEqual(result1.error, 'The part number and the name cannot be turned off.');

  const result2 = cleanColumnChoices({ name: { on: false } });
  assert.strictEqual(result2.error, 'The part number and the name cannot be turned off.');
});

// e) 'unknown fields and bad input are refused': cleanColumnChoices({ colour: { on: true } }).error is 'Unknown field: colour'; cleanColumnChoices(null).error, cleanColumnChoices([]).error and cleanColumnChoices({}).error are all 'No choices were sent.'; cleanColumnChoices({ cost: 5 }).error is 'Bad choice for cost.'.
test('unknown fields and bad input are refused', () => {
  const result1 = cleanColumnChoices({ colour: { on: true } });
  assert.strictEqual(result1.error, 'Unknown field: colour');

  const result2 = cleanColumnChoices(null);
  assert.strictEqual(result2.error, 'No choices were sent.');

  const result3 = cleanColumnChoices([]);
  assert.strictEqual(result3.error, 'No choices were sent.');

  const result4 = cleanColumnChoices({});
  assert.strictEqual(result4.error, 'No choices were sent.');

  const result5 = cleanColumnChoices({ cost: 5 });
  assert.strictEqual(result5.error, 'Bad choice for cost.');
});

// f) 'a long heading is cut to 100 characters': a 150-character heading gives a heading of length 100.
test('a long heading is cut to 100 characters', () => {
  const longHeading = 'x'.repeat(150);
  const result = cleanColumnChoices({ cost: { on: true, heading: longHeading } });
  assert.strictEqual(result.choices.cost.heading.length, 100);
  assert.strictEqual(result.choices.cost.heading, longHeading.slice(0, 100));
});
