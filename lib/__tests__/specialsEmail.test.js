import { test } from 'node:test';
import assert from 'node:assert/strict';

import { specialsEmailDraft } from '../specials.js';
import { describeAudience } from '../socialFormat.js';

const now = new Date('2026-11-03T00:00:00Z');
const promo = (id, kind, price, normal, extra = {}) => ({ product_id: id, name: id, kind, price_cents: price, normal_price_cents: normal, status: 'live', ends_at: null, ...extra });

test('the specials email lists live specials, hot specials first, biggest saving first', () => {
  const draft = specialsEmailDraft([
    promo('Small', 'special', 9000, 10000),
    promo('Clear', 'clearance', 5000, 10000),
    promo('Big', 'special', 5000, 10000, { ends_at: '2026-11-06T12:59:00Z' }),
    promo('Gone', 'special', 1000, 10000, { status: 'ended' }),
  ], 'https://shop.test', now);
  assert.equal(draft.audienceMode, 'trade');
  assert.deepEqual(draft.channels, ['email']);
  assert.equal(draft.link_url, 'https://shop.test/store/specials');
  const text = draft.text;
  assert.ok(text.indexOf('Big') < text.indexOf('Small') && text.indexOf('Small') < text.indexOf('Clear'));
  assert.ok(text.includes('- Big: $50.00 inc GST (was $100.00). Ends Friday 6 November.\n  https://shop.test/store/product/Big'));
  assert.ok(!text.includes('Gone'));
  assert.ok(text.includes('Hot specials\n') && text.includes('Clearance\n'));
});

test('a long list is cut with a count of the rest, and nothing live gives no email', () => {
  const many = Array.from({ length: 4 }, (_, i) => promo(`P${i}`, 'special', 5000, 10000));
  const draft = specialsEmailDraft(many, 'https://shop.test', now, 3);
  assert.ok(draft.text.includes('And 1 more on the website.'));
  assert.equal(specialsEmailDraft([promo('Off', 'special', 5000, 10000, { status: 'offline' })], 'https://shop.test', now), null);
  assert.equal(specialsEmailDraft([], 'https://shop.test', now), null);
});

test('a trade audience is described', () => {
  assert.equal(describeAudience({ trade: true }), 'Trade customers who agreed to hear from us');
  assert.equal(describeAudience({ trade: true, tiers: ['Gold'] }), 'Trade customers, tiers: Gold');
});
