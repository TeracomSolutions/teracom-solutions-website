import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DEVICE_TYPES, cleanPlan, samplePlan } from '../model.js';
import { CABLE_TYPES } from '../cables.js';
import { PART_SEARCH, cleanParts, excludedWords, partLine, partsList, partsText, pricedParts } from '../quote.js';

const dev = (id, type, x, y) => ({ id, type, name: id, x, y, rotation: 0 });
const plan = (devices, pxPerMetre = 10) => ({ format: 'teracom-site-plan', name: 'Shop', devices, pxPerMetre });

test('every part search names a real device type or cable', () => {
  const keys = new Set([...DEVICE_TYPES.map((t) => t.type), ...CABLE_TYPES.map((c) => `cable:${c.id}`)]);
  for (const [key, search] of Object.entries(PART_SEARCH)) {
    assert.ok(keys.has(key), key);
    assert.ok(Array.isArray(search.q) && search.q.length, key);
  }
});

test('accessory words are left out of device searches, except the ones a part allows', () => {
  assert.ok(excludedWords('camera').includes('mount'));
  assert.ok(!excludedWords('ceilingpir').includes('mount'));
  assert.ok(!excludedWords('cable:cat6').includes('mount'));
  assert.ok(excludedWords('cable:cat6').includes('patch'));
});

test('the parts list counts each kind of device and the cable to order', () => {
  const lines = partsList(plan([dev('n', 'nvr', 0, 0), dev('c1', 'camera', 100, 0), dev('c2', 'camera', 0, 100), dev('x', 'powerpoint', 5, 5)]));
  const camera = lines.find((l) => l.key === 'camera');
  assert.equal(camera.qty, 2);
  assert.equal(camera.searchable, true);
  assert.equal(lines.find((l) => l.key === 'powerpoint').searchable, false);
  const cat6 = lines.find((l) => l.key === 'cable:cat6');
  assert.ok(cat6.metres > 0);
  assert.equal(cat6.qty, 1);
  assert.equal(cat6.unit, '305 m box');
  assert.deepEqual(partLine('cable:cat6'), { key: 'cable:cat6', kind: 'cable', group: 'Cable', label: cat6.label, unit: '305 m box' });
  assert.equal(partLine('nope'), null);
});

test('the sample plan has a parts list', () => {
  assert.ok(partsList(samplePlan()).length > 3);
});

test('saved picks are cleaned: unknown keys dropped, quantities whole and capped', () => {
  const parts = cleanParts({ camera: { id: 'cam-1', qty: '3.7' }, bogus: { id: 'x' }, 'cable:cat6': { qty: 1e9 }, nvr: { id: '' }, dome: 'no' });
  assert.deepEqual(parts, { camera: { id: 'cam-1', qty: 3 }, 'cable:cat6': { qty: 9999 }, nvr: { id: '' } });
  assert.deepEqual(cleanParts(null), {});
  const kept = cleanPlan({ ...plan([dev('c1', 'camera', 0, 0)]), parts: { camera: { id: 'cam-2' } } });
  assert.deepEqual(kept.parts, { camera: { id: 'cam-2' } });
});

test('prices use the pick, else the first suggestion; "none" and unknown prices are left to quote', () => {
  const lines = [
    { key: 'camera', kind: 'device', label: 'Camera', qty: 2, unit: '' },
    { key: 'nvr', kind: 'device', label: 'NVR', qty: 1, unit: '' },
    { key: 'reader', kind: 'device', label: 'Reader', qty: 1, unit: '' },
    { key: 'smoke', kind: 'device', label: 'Smoke', qty: 4, unit: '' },
  ];
  const options = {
    camera: [{ id: 'a', name: 'Cam A', priceCents: 10000 }, { id: 'b', name: 'Cam B', priceCents: 25000 }],
    nvr: [{ id: 'n', name: 'NVR', priceCents: 50000 }],
    reader: [{ id: 'r', name: 'Reader', priceCents: null }],
  };
  const first = pricedParts(lines, {}, options);
  assert.equal(first.rows[0].product.id, 'a');
  assert.equal(first.totalCents, 2 * 10000 + 50000);
  assert.equal(first.unpriced, 2);

  const chosen = pricedParts(lines, { camera: { id: 'b', qty: 3 }, nvr: { id: '' } }, options);
  assert.equal(chosen.rows[0].lineCents, 75000);
  assert.equal(chosen.rows[1].product, null);
  assert.equal(chosen.totalCents, 75000);

  const text = partsText('Shop', 7, chosen);
  assert.match(text, /Site plan: Shop/);
  assert.match(text, /3 Camera: Cam B -- \$750\.00/);
  assert.match(text, /1 NVR: to be quoted/);
  assert.match(text, /Parts priced online: \$750\.00 inc\. GST \(3 lines to be quoted\)/);
});
