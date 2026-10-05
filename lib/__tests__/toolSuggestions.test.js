import test from 'node:test';
import assert from 'node:assert/strict';

import { toolsForProduct } from '../toolSuggestions.js';
import { tools } from '../tools.js';

test('every suggested calculator exists', () => {
  const known = new Set(tools.map((t) => t.slug));
  const samples = [
    ['cctv', 'Hikvision 8 channel NVR'], ['networking', 'UniFi 24 port PoE switch'], ['ups', 'APC Back-UPS 1500'],
    ['cable', 'Cat6 cable 305m box'], ['nas', 'Synology DS225+'], ['screens', 'Samsung 55 inch display'],
    ['projectors', 'Epson projector'], ['audio', '100V ceiling speaker'], ['power-supplies', '12V 5A supply'],
  ];
  for (const [category, name] of samples) {
    const found = toolsForProduct(category, name);
    assert.ok(found.length > 0, `${category} ${name}`);
    for (const slug of found) assert.ok(known.has(slug), slug);
  }
});

test('the product name comes first, then the category, at most three', () => {
  assert.deepEqual(toolsForProduct('cctv', 'Dahua 16 channel NVR').slice(0, 1), ['cctv-storage-calculator']);
  assert.equal(toolsForProduct('networking', 'UniFi PoE switch')[0], 'poe-power-budget-calculator');
  assert.ok(toolsForProduct('nas', 'WD Purple 8TB RAID kit').length <= 3);
  assert.deepEqual(toolsForProduct('it-equipment', 'Logitech mouse'), []);
});
