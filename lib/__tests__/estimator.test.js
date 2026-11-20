import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  cleanEstimate, emptyEstimate, estimateCsv, estimateTotals, exGst, forSaving, lineFigures, listLines, materialsList, validUntil,
} from '../estimator.js';
import { priceEstimate } from '../estimatorPricing.js';

const NOW = '2026-11-20T00:00:00.000Z';

function sample() {
  const e = emptyEstimate(NOW);
  e.name = 'Warehouse CCTV';
  e.settings = { labourRateCents: 9500, markupPct: 20 };
  e.sections = [
    { id: 'aaaa1111', title: 'Cameras', lines: [
      { id: 'l1aaaaaa', type: 'product', productId: 'p1', name: 'Camera', sku: 'CAM1', qty: 4, unitCents: 22000, markupPct: null },
      { id: 'l2aaaaaa', type: 'labour', description: 'Install cameras', hours: 6, rateCents: null },
    ] },
    { id: 'bbbb2222', title: 'Recorder', lines: [
      { id: 'l3aaaaaa', type: 'product', productId: 'p2', name: 'NVR', sku: 'NVR1', qty: 1, unitCents: 110000, markupPct: 10 },
      { id: 'l4aaaaaa', type: 'product', productId: 'p1', name: 'Camera', sku: 'CAM1', qty: 1, unitCents: 22000, markupPct: null },
    ] },
  ];
  return cleanEstimate(e, NOW);
}

test('store prices include GST; costs are ex GST and markup is added on top', () => {
  assert.equal(exGst(22000), 20000);
  const f = lineFigures({ type: 'product', qty: 4, unitCents: 22000, markupPct: null }, { markupPct: 20, labourRateCents: 0 });
  assert.deepEqual(f, { costCents: 80000, sellCents: 96000, unitSellCents: 24000, priced: true });
  const own = lineFigures({ type: 'product', qty: 1, unitCents: 110000, markupPct: 10 }, { markupPct: 20, labourRateCents: 0 });
  assert.equal(own.sellCents, 110000);
});

test('labour uses its own rate or the estimate rate', () => {
  assert.equal(lineFigures({ type: 'labour', hours: 6, rateCents: null }, { labourRateCents: 9500 }).sellCents, 57000);
  assert.equal(lineFigures({ type: 'labour', hours: 2.5, rateCents: 12000 }, { labourRateCents: 9500 }).sellCents, 30000);
});

test('totals add sections, GST and margin', () => {
  const t = estimateTotals(sample());
  assert.equal(t.materials_cost_cents, 80000 + 100000 + 20000);
  assert.equal(t.materials_sell_cents, 96000 + 110000 + 24000);
  assert.equal(t.labour_cents, 57000);
  assert.equal(t.subtotal_cents, 287000);
  assert.equal(t.gst_cents, 28700);
  assert.equal(t.total_cents, 315700);
  assert.equal(t.materials_margin_cents, 30000);
  assert.equal(t.labour_hours, 6);
});

test('a product without a store price is counted as unpriced, not as zero', () => {
  const e = sample();
  e.sections[0].lines[0].unitCents = null;
  const t = estimateTotals(e);
  assert.equal(t.unpriced, 1);
  assert.equal(t.materials_sell_cents, 110000 + 24000);
});

test('cleaning drops lines that are not store products or labour, and bad values', () => {
  const e = cleanEstimate({
    name: 'x'.repeat(500),
    settings: { labourRateCents: -5, markupPct: 9999 },
    sections: [{ id: 'bad id!', title: 'S', lines: [
      { type: 'custom', name: 'Made-up item', unitCents: 1 },
      { type: 'product', name: 'No product id', unitCents: 1, qty: 1 },
      { type: 'product', productId: 'p9', name: 'Ok', qty: -3, unitCents: 500 },
    ] }],
  }, NOW);
  assert.equal(e.name.length, 200);
  assert.equal(e.settings.labourRateCents, 0);
  assert.equal(e.settings.markupPct, 500);
  assert.equal(e.sections[0].lines.length, 1);
  assert.equal(e.sections[0].lines[0].qty, 0);
  assert.match(e.sections[0].id, /^[a-z0-9]{8}$/);
});

test('the server prices every product from the catalogue, never from the browser', () => {
  const e = sample();
  e.sections[0].lines[0].unitCents = 1; // a made-up price
  e.sections[0].lines[0].name = 'Renamed';
  const products = [
    { id: 'p1', name: 'Real Camera', sku: 'CAM1', brand: 'B', priceCents: 30000, tierPricesCents: { member: 22000 } },
  ];
  const priced = priceEstimate(e, products, { id: 'c1', tier: null }, NOW);
  const cam = priced.sections[0].lines[0];
  assert.equal(cam.unitCents, 22000);
  assert.equal(cam.name, 'Real Camera');
  assert.equal(cam.unavailable, false);
  const nvr = priced.sections[1].lines[0];
  assert.equal(nvr.unavailable, true);
  assert.equal(priced.totals.total_cents, estimateTotals(priced).total_cents);
});

test('materials list merges the same product across sections', () => {
  const list = materialsList(sample());
  assert.deepEqual(list.map((i) => [i.productId, i.qty]), [['p1', 5], ['p2', 1]]);
});

test('forSaving carries totals the backend reads', () => {
  const saved = forSaving(sample(), NOW);
  assert.equal(saved.totals.total_cents, 315700);
  assert.equal(saved.updatedAt, NOW);
});

test('dates, list lines and CSV', () => {
  const e = sample();
  e.date = '2026-11-20';
  e.validDays = 30;
  assert.equal(validUntil(e), '2026-12-20');
  assert.deepEqual(listLines('- one\n\n• two\n three '), ['one', 'two', 'three']);
  const csv = estimateCsv(e);
  assert.match(csv, /"Cameras","Material","CAM1","Camera","4","200.00","240.00","960.00"/);
  assert.match(csv, /"Total inc GST","","","","3157.00"/);
});
