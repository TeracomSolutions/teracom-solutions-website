import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isValidGtin,
  plainText,
  productProblems,
  isReady,
  feedItem,
  escapeXml,
  buildFeedXml,
  summarise,
  listProducts,
  FEED_CODES,
  availabilityDateFor
} from '../shoppingFeed.js';

const good = {
  id: 'ds225',
  sku: 'DS225+',
  name: 'Synology DS225+ 2 Bay NAS',
  description: 'A two bay NAS for small offices with fast file sharing and backups for every user.',
  priceCents: 49900,
  brand: 'Synology',
  stock: 3,
  imageUrl: '/images/ds225.jpg',
  manufacturerSku: 'DS225+',
  barcode: '4006381333931',
  category: 'NAS',
  type: 'hardware'
};

// Test isValidGtin
{
  test('isValidGtin', () => {
    assert.equal(isValidGtin('4006381333931'), true);
    assert.equal(isValidGtin('036000291452'), true);
    assert.equal(isValidGtin('96385074'), true);
    assert.equal(isValidGtin(' 4006381333931 '), true);
    assert.equal(isValidGtin('4006381333932'), false);
    assert.equal(isValidGtin('123'), false);
    assert.equal(isValidGtin(''), false);
    assert.equal(isValidGtin(null), false);
    assert.equal(isValidGtin('abcdefghijklm'), false);
  });
}

// Test plainText
{
  test('plainText', () => {
    assert.equal(
      plainText('<p>Fast &amp; <b>reliable</b></p><p>2&nbsp;years</p>'),
      'Fast & reliable 2 years'
    );
    assert.equal(plainText(null), '');
  });
}

// Test good product
{
  test('good product', () => {
    assert.deepEqual(productProblems(good), []);
    assert.equal(isReady(good), true);
  });
}

// Test feedItem for good product
{
  test('feedItem for good product', () => {
    const item = feedItem(good, 'https://example.com');
    assert.equal(item.link, 'https://example.com/store/product/ds225');
    assert.equal(item.imageLink, 'https://example.com/images/ds225.jpg');
    assert.equal(item.availability, 'in_stock');
    assert.equal(item.price, '499.00 AUD');
    assert.equal(item.gtin, '4006381333931');
    assert.equal(item.mpn, 'DS225+');
    assert.equal(item.condition, 'new');
    assert.equal(item.productType, 'NAS');
    assert.equal(item.id, 'DS225+');
  });
}

// Test variants of good product
{
  test('stock 0 gives availability backorder', () => {
    const item = feedItem({ ...good, stock: 0 }, 'https://example.com');
    assert.equal(item.availability, 'backorder');
  });

  test('imageUrl from CDN', () => {
    const item = feedItem({ ...good, imageUrl: 'https://cdn.example.com/a.jpg' }, 'https://example.com');
    assert.equal(item.imageLink, 'https://cdn.example.com/a.jpg');
  });

  test('barcode empty gives productProblems', () => {
    const item = feedItem({ ...good, barcode: '' }, 'https://example.com');
    assert.deepEqual(productProblems({ ...good, barcode: '' }), ['no_gtin']);
    assert.equal(isReady({ ...good, barcode: '' }), true);
    assert.equal('gtin' in item, false);
  });

  test('barcode invalid gives productProblems', () => {
    const item = feedItem({ ...good, barcode: '4006381333932' }, 'https://example.com');
    assert.deepEqual(productProblems({ ...good, barcode: '4006381333932' }), ['bad_gtin']);
    assert.equal('gtin' in item, false);
  });
}

// Test product with missing fields
{
  test('product with missing fields', () => {
    const bad = {
      ...good,
      imageUrl: null,
      description: 'a'.repeat(10),
      brand: null,
      priceCents: 0,
      barcode: null
    };
    assert.deepEqual(productProblems(bad), ['no_image', 'no_description', 'no_brand', 'no_price', 'no_gtin']);
    assert.equal(isReady(bad), false);
    assert.equal(feedItem(bad, 'https://example.com'), null);
  });

  test('service type is never ready', () => {
    const service = { ...good, type: 'service' };
    assert.equal(isReady(service), false);
  });

  test('description with html and letters is ready', () => {
    const desc = '<p>' + 'a'.repeat(60) + '</p>';
    const item = feedItem({ ...good, description: "", descriptionHtml: desc }, 'https://example.com');
    assert.equal(isReady({ ...good, description: "", descriptionHtml: desc }), true);
    assert.equal(item.description, 'a'.repeat(60)); // The plain text version
  });
}

// Test long title
{
  test('long title', () => {
    const title = 'a'.repeat(200);
    const item = feedItem({ ...good, name: title }, 'https://example.com');
    assert.deepEqual(productProblems({ ...good, name: title }), ['title_long']);
    assert.equal(isReady({ ...good, name: title }), true);
    assert.ok(item.title.length <= 150);
  });
}

// Test image URL with spaces
{
  test('a photo address with spaces is made valid', () => {
    // Test relative path with spaces
    const item1 = feedItem({ ...good, imageUrl: '/images/a b.jpg' }, 'https://example.com');
    assert.equal(item1.imageLink, 'https://example.com/images/a%20b.jpg');

    // Test CDN URL with spaces
    const item2 = feedItem({ ...good, imageUrl: 'https://www.mmt.com.au/Files/Product assets/Images/15E/EKW200.jpg' }, 'https://example.com');
    assert.equal(item2.imageLink, 'https://www.mmt.com.au/Files/Product%20assets/Images/15E/EKW200.jpg');
  });
}

// Test availabilityDateFor
{
  test('availabilityDateFor counts seven days ahead at midnight UTC', () => {
    assert.equal(availabilityDateFor(new Date('2026-10-12T05:30:00Z')), '2026-10-19T00:00:00Z');
    assert.equal(availabilityDateFor(new Date('2026-12-28T23:59:00Z')), '2027-01-04T00:00:00Z');
  });

  test('a product with no stock gets an availability date', () => {
    const item = feedItem({ ...good, stock: 0 }, 'https://example.com');
    assert.equal(item.availability, 'backorder');
    assert.equal(typeof item.availabilityDate, 'string');
    assert.equal(item.availabilityDate.length, 20);
    assert.ok(item.availabilityDate.endsWith('T00:00:00Z'));
  });

  test('a product in stock has no availability date', () => {
    const item = feedItem({ ...good, stock: 5 }, 'https://example.com');
    assert.equal(item.availability, 'in_stock');
    assert.equal(item.availabilityDate, undefined);
  });

  test('the feed publishes the availability date for backorder items only', () => {
    const backorderItem = feedItem({ ...good, stock: 0 }, 'https://example.com');
    const inStockItem = feedItem({ ...good, stock: 5 }, 'https://example.com');
    const xml = buildFeedXml([backorderItem, inStockItem], 'https://example.com');
    assert.equal(xml.split('<g:availability_date>').length - 1, 1);
  });

  test('escapeXml drops control characters XML does not allow', () => {
    const bad = String.fromCharCode(0) + String.fromCharCode(8) + String.fromCharCode(11) + String.fromCharCode(31) + String.fromCharCode(65534);
    assert.equal(escapeXml('a' + bad + 'b'), 'ab');
    const kept = String.fromCharCode(9) + String.fromCharCode(10) + String.fromCharCode(13);
    assert.equal(escapeXml('a' + kept + 'b'), 'a' + kept + 'b');
    assert.equal(escapeXml('Tom & "Jerry" <x>'), 'Tom &amp; &quot;Jerry&quot; &lt;x&gt;');
  });
}
