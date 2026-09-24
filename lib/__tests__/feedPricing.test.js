import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sellPriceCents,
  applyGst,
  gstComponentCents,
  freightCents,
  roundToNearestFiveCents
} from '../feedPricing.js';

// sellPriceCents tests
 test('sellPriceCents with 20% markup', () => {
  assert.strictEqual(sellPriceCents(10000, 20), 12000);
});

test('sellPriceCents with 0% markup', () => {
  assert.strictEqual(sellPriceCents(10000, 0), 10000);
});

test('sellPriceCents rounds to whole cents', () => {
  // 10000 * 1.2 = 12000, which should be exact
  assert.strictEqual(sellPriceCents(10000, 20), 12000);
  
  // 10001 * 1.2 = 12001.2 which should round to 12001
  assert.strictEqual(sellPriceCents(10001, 20), 12001);
});

test('sellPriceCents throws TypeError for invalid buyCents', () => {
  assert.throws(() => sellPriceCents(-1, 10), TypeError);
  assert.throws(() => sellPriceCents(10.5, 10), TypeError);
  assert.throws(() => sellPriceCents('10', 10), TypeError);
});

test('sellPriceCents throws RangeError for negative markup', () => {
  assert.throws(() => sellPriceCents(10000, -1), RangeError);
});

// applyGst tests
 test('applyGst adds 10% GST', () => {
  assert.strictEqual(applyGst(10000), 11000);
});

// gstComponentCents tests
 test('gstComponentCents extracts GST component correctly', () => {
  // 11000 / 11 = 1000
  assert.strictEqual(gstComponentCents(11000), 1000);
});

// Round-trip consistency test for GST
 test('applyGst and gstComponentCents round-trip consistently', () => {
  const original = 10000;
  const withGst = applyGst(original);
  const gstComponent = gstComponentCents(withGst);
  
  // Should be able to reconstruct the original amount
  assert.strictEqual(withGst - gstComponent, original);
});

// freightCents tests
 test('freightCents handles metro zone', () => {
  assert.strictEqual(freightCents({ weightGrams: 1000, cubicCm: 0, zone: 'metro' }), 995);
});

test('freightCents handles regional zone', () => {
  assert.strictEqual(freightCents({ weightGrams: 1000, cubicCm: 0, zone: 'regional' }), 1495);
});

test('freightCents handles remote zone', () => {
  assert.strictEqual(freightCents({ weightGrams: 1000, cubicCm: 0, zone: 'remote' }), 2495);
});

test('freightCents uses volumetric weight when it exceeds dead weight', () => {
  // Dead weight = 1000g, Volumetric weight = 5000 / 5 = 1000g
  // So both are equal - should use base rate
  assert.strictEqual(freightCents({ weightGrams: 1000, cubicCm: 5000, zone: 'metro' }), 995);
  
  // Dead weight 1000g, volumetric 6000 / 5 = 1200g. Volumetric wins, but
  // 1200g is still inside the first 5kg, so it is the base rate -- the step
  // charge is a function of weight, not of which weight won.
  assert.strictEqual(freightCents({ weightGrams: 1000, cubicCm: 6000, zone: 'metro' }), 995);

  // Volumetric winning AND crossing the 5kg threshold: 40000 / 5 = 8000g,
  // which is 3 part-kilos over.
  assert.strictEqual(freightCents({ weightGrams: 1000, cubicCm: 40000, zone: 'metro' }), 995 + 750);
});

test('freightCents handles part kilo charges', () => {
  // 6000g (6kg) - first 5kg is base rate, then 1kg additional
  assert.strictEqual(freightCents({ weightGrams: 6000, cubicCm: 0, zone: 'metro' }), 995 + 250);
});

test('freightCents returns 0 for weightless and sizeless items', () => {
  assert.strictEqual(freightCents({ weightGrams: 0, cubicCm: 0, zone: 'metro' }), 0);
  assert.strictEqual(freightCents({ weightGrams: null, cubicCm: null, zone: 'metro' }), 0);
});

test('freightCents throws RangeError for unknown zone', () => {
  assert.throws(() => freightCents({ weightGrams: 1000, cubicCm: 0, zone: 'unknown' }), RangeError);
});

// roundToNearestFiveCents tests
 test('roundToNearestFiveCents rounds to nearest 5 cents', () => {
  assert.strictEqual(roundToNearestFiveCents(12), 10); // 12 rounds to 10
  assert.strictEqual(roundToNearestFiveCents(13), 15); // 13 rounds to 15
  assert.strictEqual(roundToNearestFiveCents(14), 15); // 14 rounds to 15
  assert.strictEqual(roundToNearestFiveCents(17), 15); // 17 rounds to 15
  assert.strictEqual(roundToNearestFiveCents(18), 20); // 18 rounds to 20
});

test('roundToNearestFiveCents handles exact midpoints correctly', () => {
  // Midpoint 12.5 should round to 15 (round half up)
  assert.strictEqual(roundToNearestFiveCents(12), 10); // 12 rounds to 10
  assert.strictEqual(roundToNearestFiveCents(13), 15); // 13 rounds to 15
  assert.strictEqual(roundToNearestFiveCents(14), 15); // 14 rounds to 15
  assert.strictEqual(roundToNearestFiveCents(17), 15); // 17 rounds to 15
  assert.strictEqual(roundToNearestFiveCents(18), 20); // 18 rounds to 20
});

test('roundToNearestFiveCents throws TypeError for invalid input', () => {
  assert.throws(() => roundToNearestFiveCents(-1), TypeError);
  assert.throws(() => roundToNearestFiveCents(10.5), TypeError);
  assert.throws(() => roundToNearestFiveCents('10'), TypeError);
});

test('a non-numeric markup is refused rather than returning NaN', () => {
  // The original generated implementation let this through: a string markup
  // makes `markupPercent < 0` false, so it reached the arithmetic and came
  // back as NaN -- a silently wrong price on every row of a feed.
  assert.throws(() => sellPriceCents(10000, 'twenty'), TypeError);
  assert.throws(() => sellPriceCents(10000, undefined), TypeError);
  assert.throws(() => sellPriceCents(10000, null), TypeError);
  assert.throws(() => sellPriceCents(10000, NaN), TypeError);
  assert.throws(() => sellPriceCents(10000, Infinity), TypeError);
});
