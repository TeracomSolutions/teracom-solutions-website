import { test } from 'node:test';
import assert from 'node:assert/strict';

import { AVAILABILITY, BASE_PLATFORM_KEY, BASE_PLATFORM_MONTHLY, DISCLAIMER, GOALS, GST_RATE, NOT_MEASURED, PRICES_PUBLISHED, SAVINGS_PAGES_LIVE, arithmetic, bundleDiscount, canShowSavingsDraft, costAndNet, monthlyMoney, optionTotal, rowSaving, basePlatform } from '../savings.js';

test('a saving is team x share x cost of one person, with the working shown', () => {
  assert.deepEqual(rowSaving({ teamSize: 10, costPerPerson: 100000, sharePercent: 50 }), { team: 10, cost: 100000, share: 50, people: 5, saving: 500000 });
  assert.equal(arithmetic({ teamSize: 10, costPerPerson: '100,000', sharePercent: 50 }), '10 people x 50% = 5 people x A$100,000 = A$500,000 a year');
  assert.equal(rowSaving({ teamSize: 'x', costPerPerson: -5, sharePercent: 150 }).saving, 0);
  assert.equal(rowSaving({ teamSize: 3, costPerPerson: 90000, sharePercent: 120 }).share, 100);
});

test('every savings goal option adds up to its goal', () => {
  for (const goal of GOALS) {
    assert.ok(goal.options.length >= 2 && goal.options.length <= 3, goal.title);
    for (const option of goal.options) assert.equal(optionTotal(option).saving, goal.target, option.title);
  }
});

test('the pages are live, and prices are published (price list v3, 4 November 2026)', () => {
  assert.equal(SAVINGS_PAGES_LIVE, true);
  assert.equal(PRICES_PUBLISHED, true);
  assert.equal(BASE_PLATFORM_MONTHLY, 39);
  assert.equal(canShowSavingsDraft(undefined), true);
  assert.equal(canShowSavingsDraft('1'), true);
  assert.deepEqual(costAndNet(['finance'], 500000, null), { yearlyCost: null, net: null, paybackMonths: null, discount: 0 });
  assert.equal(DISCLAIMER, 'Estimates only. Your results depend on your business.');
});

test('once prices are published: bundle discounts, net saving and payback', () => {
  assert.deepEqual([1, 2, 3, 5, 6, 9, 10].map(bundleDiscount), [0, 0.1, 0.1, 0.1, 0.15, 0.15, 0.2]);
  const prices = { finance: 99, sales: 99, hr: 79 };
  const r = costAndNet(['finance', 'sales', 'hr', 'finance'], 500000, prices);
  assert.equal(r.discount, 0.1);
  assert.equal(r.yearlyCost, Math.round(277 * 12 * 0.9) + 39 * 12);
  assert.equal(r.net, 500000 - r.yearlyCost);
  assert.equal(r.paybackMonths, 0.1);
});

test('price list v3 examples: base platform added, never discounted', () => {
  const prices = { finance: 99, sales: 99, marketing: 129, operations: 99, 'technical-support': 159, hr: 79 };
  assert.equal(costAndNet(['finance'], 0, prices).yearlyCost, 138 * 12);
  assert.equal(costAndNet(['finance'], 0, prices).discount, 0);
  const two = costAndNet(['finance', 'sales'], 0, prices);
  assert.equal(two.discount, 0.1);
  assert.equal(two.yearlyCost, Math.round(198 * 12 * 0.9) + 39 * 12);
  const six = costAndNet(['finance', 'sales', 'marketing', 'operations', 'technical-support', 'hr'], 0, prices);
  assert.equal(six.discount, 0.15);
  assert.equal(six.yearlyCost, Math.round(664 * 12 * 0.85) + 39 * 12);
});

test('monthly prices show to the cent, including GST', () => {
  assert.equal(monthlyMoney((99 + BASE_PLATFORM_MONTHLY) * (1 + GST_RATE)), 'A$151.80');
  assert.equal(monthlyMoney((159 + BASE_PLATFORM_MONTHLY) * (1 + GST_RATE)), 'A$217.80');
  assert.equal(monthlyMoney(1145), 'A$1,145.00');
  assert.equal(monthlyMoney(39), 'A$39.00');
});

test('the base platform fee comes from the price list when it is there', () => {
  assert.equal(BASE_PLATFORM_KEY, 'base-platform');
  assert.equal(basePlatform(null), 39);
  assert.equal(basePlatform({ finance: 99 }), 39);
  assert.equal(basePlatform({ 'base-platform': 45 }), 45);
  assert.equal(basePlatform({ 'base-platform': 0 }), 39);
  const r = costAndNet(['finance', 'base-platform'], 0, { finance: 99, 'base-platform': 45 });
  assert.equal(r.discount, 0);
  assert.equal(r.yearlyCost, 99 * 12 + 45 * 12);
});

test('no goal reads as a promise, and the qualifiers say what the figures are', () => {
  for (const goal of GOALS) {
    assert.ok(!/^Save /.test(goal.title), goal.title);
    for (const option of goal.options) {
      assert.ok(/^If /.test(option.title), option.title);
      assert.ok(/^For example/.test(option.business), option.business);
    }
  }
  assert.ok(NOT_MEASURED.includes('None of it is a measured result'));
  assert.ok(AVAILABILITY.includes('early access'));
});

