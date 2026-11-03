import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DISCLAIMER, GOALS, PRICES_PUBLISHED, SAVINGS_PAGES_LIVE, arithmetic, bundleDiscount, canShowSavingsDraft, costAndNet, optionTotal, rowSaving } from '../savings.js';

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

test('prices and the pages stay hidden until Robert approves them', () => {
  assert.equal(SAVINGS_PAGES_LIVE, false);
  assert.equal(PRICES_PUBLISHED, false);
  assert.equal(canShowSavingsDraft(undefined), false);
  assert.equal(canShowSavingsDraft('1'), true);
  assert.deepEqual(costAndNet(['finance'], 500000, null), { yearlyCost: null, net: null, paybackMonths: null, discount: 0 });
  assert.equal(DISCLAIMER, 'Estimates only. Your results depend on your business.');
});

test('once prices are published: bundle discounts, net saving and payback', () => {
  assert.deepEqual([1, 3, 6, 10].map(bundleDiscount), [0, 0.1, 0.15, 0.2]);
  const prices = { finance: 99, sales: 99, hr: 79 };
  const r = costAndNet(['finance', 'sales', 'hr', 'finance'], 500000, prices);
  assert.equal(r.discount, 0.1);
  assert.equal(r.yearlyCost, Math.round(277 * 12 * 0.9));
  assert.equal(r.net, 500000 - r.yearlyCost);
  assert.equal(r.paybackMonths, 0.1);
});
