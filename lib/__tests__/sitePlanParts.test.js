import { test } from 'node:test';
import assert from 'node:assert/strict';

import { partChoices } from '../sitePlanParts.js';

const p = (id, name, category = 'CCTV') => ({ id, sku: id.toUpperCase(), name, category, brand: 'Acme' });

test('site plan parts: the device itself, not its accessories or other categories', () => {
  const products = [
    p('mount', 'Turret Camera Wall Mount'),
    p('cam1', '4MP Turret Camera, 2.8mm'),
    p('cam2', 'AI Turret, White'),
    p('jb', 'Turret Junction Box'),
    p('other', 'Turret camera poster', 'Uncategorised'),
  ];
  assert.deepEqual(partChoices(products, 'camera').map((x) => x.id), ['cam1', 'cam2']);
});

test('site plan parts: every search word has to be in the name', () => {
  const products = [{ ...p('radio', 'Nanostation M5', 'Networking'), description: 'intercom door station link' }, p('ds', 'IP Video Door Station', 'Access Control')];
  assert.deepEqual(partChoices(products, 'intercom').map((x) => x.id), ['ds']);
});

test('site plan parts: unknown keys and types without a search give nothing', () => {
  assert.deepEqual(partChoices([p('a', 'Power point')], 'powerpoint'), []);
  assert.deepEqual(partChoices([p('a', 'Anything')], 'nope'), []);
});
