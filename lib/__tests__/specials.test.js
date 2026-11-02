import { test } from 'node:test';
import assert from 'node:assert/strict';

import { fromCatalogueRow, forTiles } from '../catalogueMerge.js';
import { countSpecials, hasPromo, promoEndsText, savingPercent, specialsByKind } from '../specials.js';
import { feedItem, buildFeedXml } from '../shoppingFeed.js';

const row = (sku, price, promo) => ({ sku, name: sku, price_cents: price, category: 'screens', stock: 2, promo });

test('the catalogue keeps the special and the price it replaces', () => {
  const p = fromCatalogueRow(row('A1', 8000, { kind: 'clearance', label: 'Clearance', ends_at: '2026-11-09T13:00:00Z', was_price_cents: 10000 }));
  assert.deepEqual(p.promo, { kind: 'clearance', label: 'Clearance', endsAt: '2026-11-09T13:00:00Z', wasPriceCents: 10000 });
  assert.equal(fromCatalogueRow(row('A2', 8000, null)).promo, null);
  assert.deepEqual(forTiles([p])[0].promo, p.promo);
});

test('specials are grouped by kind, biggest saving first', () => {
  const products = [
    fromCatalogueRow(row('S1', 9000, { kind: 'special', label: 'Hot special', was_price_cents: 10000 })),
    fromCatalogueRow(row('S2', 5000, { kind: 'special', label: 'Hot special', was_price_cents: 10000 })),
    fromCatalogueRow(row('C1', 1000, { kind: 'clearance', label: 'Clearance', was_price_cents: 4000 })),
    fromCatalogueRow(row('N1', 1000, null)),
  ];
  const byKind = specialsByKind(products);
  assert.deepEqual(byKind.special.map((p) => p.sku), ['S2', 'S1']);
  assert.deepEqual(byKind.clearance.map((p) => p.sku), ['C1']);
  assert.equal(countSpecials(products), 3);
  assert.equal(savingPercent(products[2]), 75);
  // A "was" price that is not higher is not a special.
  assert.equal(hasPromo({ priceCents: 5000, promo: { wasPriceCents: 5000 } }), false);
});

test('the end date reads in plain words', () => {
  const now = new Date('2026-11-02T00:00:00Z');
  assert.equal(promoEndsText(null, now), '');
  assert.equal(promoEndsText('2026-11-01T00:00:00Z', now), '');
  assert.equal(promoEndsText('2026-11-02T10:00:00Z', now), 'Ends today');
  assert.match(promoEndsText('2026-11-07T03:00:00Z', now), /^Ends Saturday 7 November$/);
});

test('Google Shopping gets the normal price and the sale price', () => {
  const p = {
    ...fromCatalogueRow({ ...row('G1', 8000, { kind: 'special', label: 'Hot special', ends_at: '2026-11-09T13:00:00Z', was_price_cents: 10000 }), brand: 'Acme', image_url: 'https://x/y.jpg', description: 'A 65 inch commercial display for meeting rooms and digital signage, with 4K resolution, built-in speakers and a three year warranty.', barcode: '4006381333931', manufacturer_sku: 'G1-MPN' }),
  };
  const item = feedItem(p, 'https://www.example.com');
  assert.equal(item.price, '100.00 AUD');
  assert.equal(item.salePrice, '80.00 AUD');
  assert.match(item.salePriceEffectiveDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\/2026-11-09T13:00Z$/);
  const xml = buildFeedXml([item], 'https://www.example.com');
  assert.match(xml, /<g:sale_price>80\.00 AUD<\/g:sale_price>/);
  assert.match(xml, /<g:sale_price_effective_date>/);
  const plain = feedItem({ ...p, promo: null }, 'https://www.example.com');
  assert.equal(plain.salePrice, undefined);
  assert.doesNotMatch(buildFeedXml([plain], 'https://www.example.com'), /sale_price/);
});
