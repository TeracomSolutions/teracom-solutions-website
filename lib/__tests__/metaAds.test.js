import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { isPrivateUrl, metaEvent, metaEventId, metaTrack, validPixelId } from '../metaPixel.js';
import { track } from '../gtag.js';
import { metaFeedItem, buildFeedXml } from '../shoppingFeed.js';
import { specialPostDraft } from '../specials.js';

afterEach(() => {
  delete globalThis.window;
});

test('GA events become Meta standard events', () => {
  assert.deepEqual(metaEvent('add_to_cart', { currency: 'AUD', value: 99.5, items: [{ item_id: 'SKU1', item_name: 'Camera', quantity: 2 }] }), [
    'AddToCart',
    { value: 99.5, currency: 'AUD', contents: [{ id: 'SKU1', quantity: 2 }], content_ids: ['SKU1'], content_type: 'product', num_items: 2, content_name: 'Camera' },
  ]);
  assert.deepEqual(metaEvent('generate_lead', { lead_source: 'contact_form' }), ['Lead', {}]);
  assert.equal(metaEvent('remove_from_cart', {}), null);
  assert.equal(metaEventId('purchase', { transaction_id: 'pi_1' }), 'pi_1');
  assert.equal(metaEventId('generate_lead', { lead_id: 'abc' }), 'abc');
  assert.equal(metaEventId('view_item', {}), '');
});

test('pixel ids and private addresses', () => {
  assert.equal(validPixelId(' 1234567890 '), '1234567890');
  assert.equal(validPixelId('12ab'), '');
  assert.equal(validPixelId(null), '');
  assert.equal(isPrivateUrl('?token=abc'), true);
  assert.equal(isPrivateUrl('?t=1&c=2'), true);
  assert.equal(isPrivateUrl('?q=camera'), false);
});

test('track sends to Meta as well, with the event id, and never throws', () => {
  const fb = [];
  globalThis.window = { gtag: () => {}, fbq: (...args) => fb.push(args) };
  track('purchase', { transaction_id: 'pi_9', currency: 'AUD', value: 10, items: [] }, {});
  assert.deepEqual(fb[0], ['track', 'Purchase', { value: 10, currency: 'AUD' }, { eventID: 'pi_9' }]);
  track('generate_lead', { lead_source: 'x' }, { lead_id: 'lead-1' });
  assert.deepEqual(fb[1], ['track', 'Lead', {}, { eventID: 'lead-1' }]);
  globalThis.window = { gtag: () => {}, fbq: () => { throw new Error('blocked'); } };
  assert.equal(metaTrack('purchase', { value: 1 }), false);
  globalThis.window = { gtag: () => {} };
  assert.equal(metaTrack('purchase', { value: 1 }), false);
});

const PRODUCT = {
  id: 'p1', sku: 'SKU1', name: 'Hikvision 4MP turret camera', type: 'hardware', brand: 'Hikvision',
  description: 'A 4MP turret camera with night vision, built for homes and small businesses.', imageUrl: '/store-images/p1.jpg',
  priceCents: 19900, barcode: '', stock: 0,
};

test('the Meta catalogue uses Meta availability words', () => {
  const backorder = metaFeedItem(PRODUCT, 'https://example.com');
  assert.equal(backorder.availability, 'available for order');
  assert.equal(backorder.availabilityDate, undefined);
  assert.equal(metaFeedItem({ ...PRODUCT, stock: 3 }, 'https://example.com').availability, 'in stock');
  assert.equal(metaFeedItem({ ...PRODUCT, brand: '' }, 'https://example.com'), null);
  const xml = buildFeedXml([backorder], 'https://example.com');
  assert.match(xml, /<g:availability>available for order<\/g:availability>/);
  assert.doesNotMatch(xml, /availability_date/);
});

test('a special becomes a ready-to-post draft', () => {
  const now = new Date('2026-11-03T00:00:00Z');
  const draft = specialPostDraft({
    product_id: 'p1', name: 'Hikvision 4MP turret camera', kind: 'special', price_cents: 14900, normal_price_cents: 19900,
    ends_at: '2026-11-06T12:59:59Z', image_url: '/store-images/p1.jpg',
  }, 'https://example.com', now);
  assert.equal(draft.title, 'Hot special: Hikvision 4MP turret camera');
  assert.match(draft.text, /now \$149\.00 inc GST \(was \$199\.00\)/);
  assert.match(draft.text, /Ends Friday 6 November\./);
  assert.equal(draft.link_url, 'https://example.com/store/product/p1');
  assert.equal(draft.image_url, 'https://example.com/store-images/p1.jpg');

  const clearance = specialPostDraft({ product_id: 'p2', name: 'Old NVR', kind: 'clearance', price_cents: 5000, normal_price_cents: 4000, image_url: '' }, 'https://example.com', now);
  assert.equal(clearance.title, 'Clearance: Old NVR');
  assert.doesNotMatch(clearance.text, /was/);
  assert.match(clearance.text, /While stocks last\./);
  assert.equal(clearance.image_url, '');
  assert.equal(specialPostDraft({ name: 'x', price_cents: 0 }, 'https://example.com'), null);
});
