import test from 'node:test';
import assert from 'node:assert/strict';

import { couponToForm, couponPatch } from '../couponEdit.js';

const full = {
  label: 'Test Coupon',
  max_discount_cents: 1250,
  min_subtotal_cents: 1000,
  expires_at: '2026-12-31T10:00:00.000Z',
  max_redemptions: 100,
  internal_note: 'Test note',
};
const bare = { label: 'Bare', max_discount_cents: null, min_subtotal_cents: null, expires_at: null, max_redemptions: null, internal_note: null };

test('couponToForm turns cents into dollars and an ISO expiry into its date', () => {
  assert.deepEqual(couponToForm(full), {
    label: 'Test Coupon',
    max_discount_cents: '12.50',
    min_subtotal_cents: '10.00',
    expires_at: '2026-12-31',
    max_redemptions: '100',
    internal_note: 'Test note',
  });
  assert.deepEqual(couponToForm(bare), { label: 'Bare', max_discount_cents: '', min_subtotal_cents: '', expires_at: '', max_redemptions: '', internal_note: '' });
});

test('an untouched form is no change, whether the coupon has limits or not', () => {
  assert.deepEqual(couponPatch(full, couponToForm(full)), {});
  assert.deepEqual(couponPatch(bare, couponToForm(bare)), {});
});

test('cents compare as whole numbers, not floats', () => {
  const coupon = { ...bare, max_discount_cents: 10 };
  assert.deepEqual(couponPatch(coupon, { ...couponToForm(coupon), max_discount_cents: '0.10' }), {});
  assert.deepEqual(couponPatch(full, { ...couponToForm(full), max_discount_cents: '12.50' }), {});
});

test('only the changed fields are sent, converted', () => {
  assert.deepEqual(couponPatch(full, { ...couponToForm(full), label: 'New Label' }), { label: 'New Label' });
  const coupon = { ...full, max_discount_cents: 1000 };
  assert.deepEqual(couponPatch(coupon, { ...couponToForm(coupon), max_discount_cents: '12.50' }), { max_discount_cents: 1250 });
  assert.deepEqual(couponPatch(full, { ...couponToForm(full), max_redemptions: '50' }), { max_redemptions: 50 });
  const dated = couponPatch(full, { ...couponToForm(full), expires_at: '2027-01-31' });
  assert.deepEqual(Object.keys(dated), ['expires_at']);
  assert.equal(dated.expires_at, new Date('2027-01-31T23:59:59').toISOString());
});

test('clearing a field sends null, but only when there was something to clear', () => {
  const cleared = couponPatch(full, { label: 'Test Coupon', max_discount_cents: '', min_subtotal_cents: '', expires_at: '', max_redemptions: '', internal_note: '' });
  assert.deepEqual(cleared, { max_discount_cents: null, min_subtotal_cents: null, expires_at: null, max_redemptions: null, internal_note: null });
  assert.deepEqual(couponPatch(bare, { label: 'Bare', max_discount_cents: '', min_subtotal_cents: '', expires_at: '', max_redemptions: '', internal_note: '' }), {});
});
