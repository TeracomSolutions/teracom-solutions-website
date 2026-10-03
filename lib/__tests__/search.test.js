import { test } from 'node:test';
import assert from 'node:assert/strict';

import { groupResults, queryTokens, searchSite } from '../search.js';

const top = (q) => searchSite(q)[0];

test('finds services, brands, tools and pages by name', () => {
  const cctv = searchSite('cctv').slice(0, 2).map((r) => r.href);
  assert.ok(cctv.includes('/services/cctv') && cctv.includes('/store/cctv'), cctv.join());
  assert.equal(top('camera').href, '/services/cctv');
  assert.equal(top('gallagher').href, '/brands/gallagher');
  assert.equal(top('voltage drop').href, '/tools/voltage-drop-calculator');
  assert.equal(top('warranty').href, '/warranty');
  assert.equal(top('software development').href, '/services/software-development');
});

test('plural and partial words still match', () => {
  assert.ok(searchSite('cameras').length > 0);
  assert.ok(searchSite('calc').some((r) => r.type === 'tool'));
});

test('every word must match', () => {
  assert.deepEqual(searchSite('gallagher zzzzqqq'), []);
  assert.deepEqual(searchSite('zzzzqqq'), []);
});

test('help centre questions are searchable', () => {
  assert.ok(searchSite('xmeye').some((r) => r.type === 'help' && r.href.startsWith('/resources/help-centre#')));
});

test('empty and stopword-only queries return nothing', () => {
  assert.deepEqual(searchSite(''), []);
  assert.deepEqual(searchSite('the and of'), []);
  assert.deepEqual(queryTokens('  '), []);
});

test('results group by type', () => {
  const groups = groupResults(searchSite('access control'));
  assert.ok(groups.length > 1);
  for (const g of groups) assert.ok(g.label && g.items.every((i) => i.type === g.type));
});

const catalogue = [
  { id: 'basy-ds225', sku: 'BASY-DS225+', name: 'Synology DiskStation DS225+ 2-Bay NAS', brand: 'Synology', manufacturerSku: 'DS225+', category: 'NAS & Storage', description: 'Compact 2-bay NAS.' },
  ...Array.from({ length: 40 }, (_, i) => ({ id: `ubq-${i}`, sku: `NHU-${i}`, name: `Ubiquiti UniFi thing ${i}`, brand: 'Ubiquiti', category: 'Networking', description: '' })),
];

test('store catalogue products are searchable by name, part number and brand, and link to their own page', () => {
  const byName = searchSite('ds225', { products: catalogue });
  assert.equal(byName[0].href, '/store/product/basy-ds225');
  assert.equal(byName[0].type, 'product');
  assert.ok(searchSite('basy ds225', { products: catalogue }).some((r) => r.href === '/store/product/basy-ds225'));
  assert.ok(searchSite('synology', { products: catalogue }).some((r) => r.href === '/store/product/basy-ds225'));
});

test('a part number brings that product first, ahead of accessories that mention it', () => {
  const list = [
    { id: 'antenna', sku: 'NHT-PR1IC860', name: 'Teltonika antenna for RUT241 routers', brand: 'Teltonika', category: 'Networking' },
    { id: 'router', sku: 'NHT-RUT241', name: 'Teltonika RUT241 Industrial Cellular Router', brand: 'Teltonika', category: 'Networking' },
  ];
  assert.equal(searchSite('rut241', { products: list })[0].href, '/store/product/router');
  const cameras = [
    { id: 'mount', sku: 'NHU-UACC-G6-DOME-FM-B', name: 'Ubiquiti G6 Pro Dome Flush Mount', brand: 'Ubiquiti', category: 'CCTV' },
    { id: 'camera', sku: 'NHU-UVC-G6-PRO-DOME-W', name: 'Ubiquiti G6 Pro Dome, White', brand: 'Ubiquiti', category: 'CCTV' },
  ];
  assert.equal(searchSite('g6 pro dome', { products: cameras })[0].href, '/store/product/camera');
  const accessPoints = [
    { id: 'cover', sku: 'NHU-U7-PRO-WALL-COVER', name: 'Ubiquiti U7 Pro Wall cover', brand: 'Ubiquiti', category: 'Networking' },
    { id: 'ap', sku: 'NHU-U7-PRO', name: 'Ubiquiti U7 Pro access point', brand: 'Ubiquiti', category: 'Networking' },
  ];
  assert.equal(searchSite('u7 pro', { products: accessPoints })[0].href, '/store/product/ap');
  assert.equal(searchSite('ds225', { products: catalogue })[0].href, '/store/product/basy-ds225');
});

test('a search matching many products shows at most 30 of them', () => {
  const results = searchSite('ubiquiti', { products: catalogue });
  assert.equal(results.filter((r) => r.type === 'product').length, 30);
  assert.ok(results.some((r) => r.type === 'brand' && r.href === '/brands/ubiquiti'));
});

