import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PRESETS,
  COMPARISONS,
  dollars,
  percentChange,
  changeTone,
  kpiCards,
  seriesForBars,
  summaryQuery
} from '../salesView.js';

// PRESETS

test('PRESETS has the correct 7 keys in order', () => {
  assert.equal(PRESETS.length, 7);
  assert.equal(PRESETS[0].key, '7d');
  assert.equal(PRESETS[1].key, '30d');
  assert.equal(PRESETS[2].key, '90d');
  assert.equal(PRESETS[3].key, 'this_month');
  assert.equal(PRESETS[4].key, 'last_month');
  assert.equal(PRESETS[5].key, 'this_year');
  assert.equal(PRESETS[6].key, 'custom');
});

// COMPARISONS

test('COMPARISONS has the correct 3 keys in order', () => {
  assert.equal(COMPARISONS.length, 3);
  assert.equal(COMPARISONS[0].key, 'previous');
  assert.equal(COMPARISONS[1].key, 'last_year');
  assert.equal(COMPARISONS[2].key, 'none');
});

// dollars

test('dollars formats 123456 as $1,234.56', () => {
  assert.equal(dollars(123456), '$1,234.56');
});

test('dollars formats 0 as $0.00', () => {
  assert.equal(dollars(0), '$0.00');
});

test('dollars returns — for null', () => {
  assert.equal(dollars(null), '—');
});

test('dollars returns — for undefined', () => {
  assert.equal(dollars(undefined), '—');
});

// percentChange

test('percentChange formats 12.5 as +12.5%', () => {
  assert.equal(percentChange(12.5), '+12.5%');
});

test('percentChange formats -3 as -3.0%', () => {
  assert.equal(percentChange(-3), '-3.0%');
});

test('percentChange formats 0 as 0.0%', () => {
  assert.equal(percentChange(0), '0.0%');
});

test('percentChange returns — for null', () => {
  assert.equal(percentChange(null), '—');
});

test('percentChange returns — for undefined', () => {
  assert.equal(percentChange(undefined), '—');
});

// changeTone

test('changeTone returns good for positive value', () => {
  assert.equal(changeTone(5), 'good');
});

test('changeTone returns bad for negative value', () => {
  assert.equal(changeTone(-5), 'bad');
});

test('changeTone returns good for negative value when higherIsBetter is false', () => {
  assert.equal(changeTone(-5, false), 'good');
});

test('changeTone returns muted for zero', () => {
  assert.equal(changeTone(0), 'muted');
});

test('changeTone returns muted for null', () => {
  assert.equal(changeTone(null), 'muted');
});

// kpiCards

test('kpiCards returns 10 cards for a small summary with orders 3, revenue_inc_cents 53900, revenue_ex_cents 49000, aov_cents 17967, units 4, margin_cents 23000, margin_percent 47.9, lines_without_cost 0, discount_cents 2200, freight_cents 1100, new_customer_orders 2, returning_customer_orders 1 and change {orders: 50}', () => {
  const summary = {
    kpis: {
      orders: 3,
      revenue_inc_cents: 53900,
      revenue_ex_cents: 49000,
      aov_cents: 17967,
      units: 4,
      margin_cents: 23000,
      margin_percent: 47.9,
      lines_without_cost: 0,
      discount_cents: 2200,
      freight_cents: 1100,
      new_customer_orders: 2,
      returning_customer_orders: 1
    },
    change: {
      orders: 50
    }
  };

  const cards = kpiCards(summary);
  assert.equal(cards.length, 10);
  assert.equal(cards[0].key, 'orders');
  assert.equal(cards[0].value, 3);
  assert.equal(cards[0].change, '+50.0%');
  assert.equal(cards[0].tone, 'good');

  // Check margin card note
  assert.ok(cards[5].note.includes('47.9%'));
});

test('kpiCards includes lines without cost in note when lines_without_cost > 0', () => {
  const summary = {
    kpis: {
      orders: 3,
      revenue_inc_cents: 53900,
      revenue_ex_cents: 49000,
      aov_cents: 17967,
      units: 4,
      margin_cents: 23000,
      margin_percent: 47.9,
      lines_without_cost: 2,
      discount_cents: 2200,
      freight_cents: 1100,
      new_customer_orders: 2,
      returning_customer_orders: 1
    },
    change: {
      orders: 50
    }
  };

  const cards = kpiCards(summary);
  assert.ok(cards[5].note.includes('(2 lines have no cost)'));
});

test('kpiCards returns empty array for undefined summary', () => {
  assert.equal(kpiCards(undefined).length, 0);
});

test('kpiCards returns empty array for summary without kpis', () => {
  assert.equal(kpiCards({}).length, 0);
});

// seriesForBars

test('seriesForBars converts revenue cents to whole dollars and keeps orders as they are', () => {
  const series = [
    { bucket: '2024-01-01', revenue_inc_cents: 42900, orders: 5 },
    { bucket: '2024-01-02', revenue_inc_cents: 39800, orders: 3 }
  ];

  const result = seriesForBars(series, 'revenue_inc_cents');
  assert.equal(result[0].value, 429);
  assert.equal(result[1].value, 398);

  // Test with orders field
  const resultOrders = seriesForBars(series, 'orders');
  assert.equal(resultOrders[0].value, 5);
  assert.equal(resultOrders[1].value, 3);
});

// summaryQuery

test('summaryQuery for 30d previous gives ?range=30d&compare=previous', () => {
  const filters = { range: '30d', compare: 'previous' };
  assert.equal(summaryQuery(filters), '?range=30d&compare=previous');
});

test('summaryQuery for custom adds start and end', () => {
  const filters = { range: 'custom', start: '2024-01-01', end: '2024-01-31', compare: 'previous' };
  assert.equal(summaryQuery(filters), '?range=custom&start=2024-01-01&end=2024-01-31&compare=previous');
});

test('summaryQuery omits start and end for presets', () => {
  const filters = { range: '30d', start: '2024-01-01', end: '2024-01-31' };
  assert.equal(summaryQuery(filters), '?range=30d');
});