import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cableQuantity, fibreLossBudget } from '../cablingCalculators.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('fibreLossBudget adds fibre, connection and splice loss', () => {
  const r = fibreLossBudget({ fibre: 'sm-osp', lengthKm: '2', connections: '2', connectionLossDb: '0.75', splices: '2', spliceLossDb: '0.3', opticBudgetDb: '10', safetyMarginDb: '3' });
  close(r.fibreLossDb, 1);
  close(r.connectionsLossDb, 1.5);
  close(r.splicesLossDb, 0.6);
  close(r.totalLossDb, 3.1);
  close(r.marginDb, 3.9);
  assert.equal(r.hasBudget, true);
});

test('multimode at 850 nm loses 3.5 dB per km, and no budget means loss only', () => {
  const r = fibreLossBudget({ fibre: 'mm-850', lengthKm: '0.3', connections: '0', splices: '0', opticBudgetDb: '0' });
  close(r.totalLossDb, 1.05);
  assert.equal(r.hasBudget, false);
});

test('cableQuantity totals the runs and rounds up the boxes', () => {
  const r = cableQuantity({ runs: '24', averageMetres: '35', longestMetres: '70', slackMetres: '3', wastePercent: '10', boxMetres: '305' });
  close(r.totalMetres, 1003.2);
  assert.equal(r.boxes, 4);
  close(r.spareMetres, 216.8);
  close(r.longestWithSlack, 73);
  assert.equal(r.overPermanentLink, false);
});

test('a run over 90 m with slack is flagged', () => {
  const r = cableQuantity({ runs: '1', averageMetres: '88', longestMetres: '88', slackMetres: '3', wastePercent: '0', boxMetres: '305' });
  assert.equal(r.overPermanentLink, true);
  assert.equal(r.boxes, 1);
});
