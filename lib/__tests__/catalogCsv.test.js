import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogCsv } from '../catalogShared.js';

const TIERS = [{ key: 'member', label: 'Member' }];
const P = { sku: 'A1', name: 'Cam, dome', brand: 'Axis', category: 'CCTV', supplier: 'Leader', cost_cents: 1000, price_cents: 1650, stock: 3, active: true, published: false, last_imported_at: '2026-10-23', tier_prices_cents: { member: 1600 } };
const NL = String.fromCharCode(10);

test('header', () => {
  const result = catalogCsv([], TIERS);
  assert.equal(result, 'SKU,Name,Brand,Category,Supplier,Cost ex GST,RRP inc GST,RRP ex GST,Margin $,Margin %,Member,Stock,Active,Live on website,Last imported');
});

test('one row', () => {
  const result = catalogCsv([P], TIERS);
  const lines = result.split(NL);
  assert.equal(lines.length, 2);
  assert.equal(lines[1], 'A1,"Cam, dome",Axis,CCTV,Leader,10.00,16.50,15.00,5.00,33.3,16.00,3,yes,no,2026-10-23');
});