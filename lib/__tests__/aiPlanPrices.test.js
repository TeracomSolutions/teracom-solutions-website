import test from 'node:test';
import assert from 'node:assert/strict';

import { API_MODELS, SEAT_PLANS, apiMonthly, pricedDepartments, seatMonthly, teracomMonthly, windowDay } from '../aiPlanPrices.js';

const prices = { 'base-platform': 39, sales: 99, service: 99, finance: 99, 'technical-support': 159, personal: 49 };

test('Teracom AI: Departments less the bundle discount, plus the base platform', () => {
  assert.equal(teracomMonthly(['technical-support'], prices).total, 198);
  const three = teracomMonthly(['sales', 'service', 'finance', 'sales'], prices);
  assert.equal(three.departments, 3);
  assert.equal(three.total, Math.round((297 * 0.9 + 39) * 100) / 100);
  assert.equal(teracomMonthly(['personal'], prices).departments, 0);
  assert.equal(teracomMonthly(['sales'], null), null);
});

test('only business Departments with a price are offered', () => {
  assert.deepEqual(pricedDepartments(prices).map((d) => d.slug), ['technical-support', 'finance', 'sales', 'service']);
});

test('seats: US$ plans are converted, A$ plans are not, yearly uses the yearly price', () => {
  const pro = SEAT_PLANS.find((p) => p.id === 'claude-pro');
  const plus = SEAT_PLANS.find((p) => p.id === 'chatgpt-plus');
  assert.equal(seatMonthly(pro, 5, 'monthly', 1.5), 150);
  assert.equal(seatMonthly(pro, 5, 'annual', 1.5), 127.5);
  assert.equal(seatMonthly(plus, 5, 'annual', 1.5), 150);
});

test('API: tokens x price x people x working days', () => {
  const sonnet = API_MODELS.find((m) => m.id === 'claude-sonnet-5-5');
  // 1M in (US$2) + 100k out (US$1) = US$3 a day; x1.5 x2 people x22 days
  assert.equal(apiMonthly(sonnet, 2, 1000000, 100000, 1.5), 198);
});

test('a 5-hour window splits a 10-hour day into working and waiting', () => {
  const day = windowDay(2);
  assert.equal(day.worked, 4);
  assert.equal(day.waiting, 6);
  assert.deepEqual(day.parts.map((p) => p.kind), ['work', 'wait', 'work', 'wait']);
  assert.equal(windowDay(5).waiting, 0);
});
