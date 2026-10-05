import test from 'node:test';
import assert from 'node:assert/strict';

import { brandForProduct, brandKey, mergeBrands, nameKeys, productsForBrand } from '../storeBrandsMerge.js';

const STATIC = [
  { slug: 'axis', name: 'Axis', tagline: 'Network cameras.', body: 'Axis text.', logoFile: 'axis.svg' },
  { slug: 'unv-uniview', name: 'UNV / Uniview', tagline: 'Cameras.', body: 'UNV text.' },
  { slug: 'i-pro', name: 'i-PRO', tagline: 'Cameras.', body: 'i-PRO text.' },
];

test('spellings that differ by case or punctuation are one brand', () => {
  assert.equal(brandKey('i-PRO'), 'ipro');
  assert.equal(brandKey('I PRO'), 'ipro');
  assert.deepEqual(nameKeys('UNV / Uniview'), ['unvuniview', 'unv', 'uniview']);
  assert.deepEqual(nameKeys('Reliance (XR Pro)'), ['reliancexrpro', 'reliance', 'xrpro']);
  assert.deepEqual(nameKeys(''), []);
});

test('a feed brand with no hand-written page becomes a store brand', () => {
  const rows = [
    { slug: 'optex', name: 'Optex', aliases: [], products: 12, logo_url: 'https://api.example/store-brands/optex/logo?v=1', logo_tile: false },
    { slug: 'inovonics', name: 'Inovonics', aliases: ['Innovonics'], products: 0, supported: true, tagline: 'Wireless alarm.' },
  ];
  const merged = mergeBrands(STATIC, rows);
  assert.equal(merged.length, 5);
  const optex = merged.find((b) => b.slug === 'optex');
  assert.equal(optex.isStoreBrand, true);
  assert.equal(optex.logoUrl, 'https://api.example/store-brands/optex/logo?v=1');
  assert.match(optex.body, /Optex products are available from the Teracom Store/);
  assert.equal(optex.tagline, 'Optex products from the Teracom Store.');
  const inovonics = merged.find((b) => b.slug === 'inovonics');
  assert.equal(inovonics.tagline, 'Wireless alarm.');
  assert.deepEqual(inovonics.matchKeys, ['inovonics', 'innovonics']);
});

test('a hand-written brand keeps its text and logo and counts its products', () => {
  const rows = [
    { slug: 'uniview', name: 'Uniview', aliases: ['UNV'], products: 30, logo_url: 'https://api.example/uv.png', logo_tile: true },
    { slug: 'ipro', name: 'iPRO', aliases: [], products: 4 },
    { slug: 'axis', name: 'AXIS', aliases: [], products: 9, logo_url: 'https://api.example/axis.png' },
  ];
  const merged = mergeBrands(STATIC, rows);
  assert.equal(merged.length, 3, 'no extra pages for brands that already have one');
  const uniview = merged.find((b) => b.slug === 'unv-uniview');
  assert.equal(uniview.body, 'UNV text.');
  assert.equal(uniview.products, 30);
  assert.equal(uniview.logoUrl, 'https://api.example/uv.png');
  assert.equal(uniview.logoTile, true);
  assert.equal(merged.find((b) => b.slug === 'i-pro').products, 4);
  const axis = merged.find((b) => b.slug === 'axis');
  assert.equal(axis.logoFile, 'axis.svg');
  assert.equal(axis.logoUrl, undefined, 'a hand-made logo wins');
  assert.ok(merged.every((b) => b.supported === true || b.isStoreBrand));
});

test('products and brand pages are matched by brand name', () => {
  const merged = mergeBrands(STATIC, [{ slug: 'optex', name: 'Optex', aliases: ['OPTEX Co'], products: 2 }]);
  const products = [{ id: 1, brand: 'OPTEX' }, { id: 2, brand: 'Optex Co' }, { id: 3, brand: 'Axis' }, { id: 4, brand: null }];
  assert.deepEqual(productsForBrand(products, merged.find((b) => b.slug === 'optex')).map((p) => p.id), [1, 2]);
  assert.equal(brandForProduct(merged, 'iPRO').slug, 'i-pro');
  assert.equal(brandForProduct(merged, 'Unknown Brand'), null);
  assert.equal(brandForProduct(merged, ''), null);
});