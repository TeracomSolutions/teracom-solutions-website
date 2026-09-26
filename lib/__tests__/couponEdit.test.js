import test from 'node:test';
import assert from 'node:assert/strict';

import { couponToForm, couponPatch } from '../couponEdit.js';

// Test couponToForm function

test('couponToForm formats values correctly', () => {
  const coupon = {
    label: 'Test Coupon',
    max_discount_cents: 1250,
    min_subtotal_cents: 1000,
    expires_at: '2024-12-31T10:00:00.000Z',
    max_redemptions: 100,
    internal_note: 'Test note',
  };

  const form = couponToForm(coupon);

  assert.equal(form.label, 'Test Coupon');
  assert.equal(form.max_discount_cents, '12.50');
  assert.equal(form.min_subtotal_cents, '10.00');
  assert.equal(form.expires_at, '2024-12-31');
  assert.equal(form.max_redemptions, '100');
  assert.equal(form.internal_note, 'Test note');
});

test('couponToForm handles null/empty values correctly', () => {
  const coupon = {
    label: '',
    max_discount_cents: null,
    min_subtotal_cents: undefined,
    expires_at: null,
    max_redemptions: null,
    internal_note: null,
  };

  const form = couponToForm(coupon);

  assert.equal(form.label, '');
  assert.equal(form.max_discount_cents, '');
  assert.equal(form.min_subtotal_cents, '');
  assert.equal(form.expires_at, '');
  assert.equal(form.max_redemptions, '');
  assert.equal(form.internal_note, '');
});

// Test couponPatch function

test('couponPatch returns empty object when form matches coupon', () => {
  const coupon = {
    label: 'Test Coupon',
    max_discount_cents: 1250,
    min_subtotal_cents: 1000,
    expires_at: '2024-12-31T10:00:00.000Z',
    max_redemptions: 100,
    internal_note: 'Test note',
  };

  const form = {
    label: 'Test Coupon',
    max_discount_cents: '12.50',
    min_subtotal_cents: '10.00',
    expires_at: '2024-12-31',
    max_redemptions: '100',
    internal_note: 'Test note',
  };

  const patch = couponPatch(coupon, form);

  assert.deepEqual(patch, {});
});

test('couponPatch correctly identifies differences', () => {
  const coupon = {
    label: 'Old Label',
    max_discount_cents: 1000,
    min_subtotal_cents: 1000,
    expires_at: '2024-12-31T10:00:00.000Z',
    max_redemptions: 100,
    internal_note: 'Old note',
  };

  const form = {
    label: 'New Label',
    max_discount_cents: '12.50',
    min_subtotal_cents: '15.00',
    expires_at: '2025-01-31',
    max_redemptions: '50',
    internal_note: 'New note',
  };

  const patch = couponPatch(coupon, form);

  assert.deepEqual(patch, {
    label: 'New Label',
    max_discount_cents: 1250,
    min_subtotal_cents: 1500,
    expires_at: new Date('2025-01-31T23:59:59').toISOString(),
    max_redemptions: 50,
    internal_note: 'New note',
  });
});
test('couponPatch handles cleared fields correctly', () => {
  const coupon = {
    label: 'Test',    max_discount_cents: 1250,
    min_subtotal_cents: 1000,
    expires_at: '2024-12-31T10:00:00.000Z',
    max_redemptions: 100,
    internal_note: 'Test note',
  };

  const form = {
    label: 'Test',
    max_discount_cents: '',
    min_subtotal_cents: '',
    expires_at: '',
    max_redemptions: '',
    internal_note: '',
  };

  const patch = couponPatch(coupon, form);

  assert.deepEqual(patch, {
    max_discount_cents: null,
    min_subtotal_cents: null,
    expires_at: null,
    max_redemptions: null,
    internal_note: null,
  });
});