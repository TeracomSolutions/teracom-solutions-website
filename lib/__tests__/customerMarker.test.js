import test from 'node:test';
import assert from 'node:assert/strict';

import { CUSTOMER_MARKER_COOKIE, hasCustomerMarker } from '../customerMarker.js';

test('CUSTOMER_MARKER_COOKIE constant', () => {
  assert.equal(CUSTOMER_MARKER_COOKIE, 'teracom_customer_in');
});

// Test cases for hasCustomerMarker function

test('marker alone', () => {
  const result = hasCustomerMarker('teracom_customer_in=1');
  assert.ok(result);
});

test('marker among other cookies', () => {
  const result = hasCustomerMarker('a=1; teracom_customer_in=1; b=2');
  assert.ok(result);
});

test('different cookie whose name only contains the marker name', () => {
  const result = hasCustomerMarker('x_teracom_customer_in=1');
  assert.ok(!result);
});

test('marker with value 0', () => {
  const result = hasCustomerMarker('teracom_customer_in=0');
  assert.ok(!result);
});

test('empty string', () => {
  const result = hasCustomerMarker('');
  assert.ok(!result);
});

test('undefined and null', () => {
  assert.ok(!hasCustomerMarker(undefined));
  assert.ok(!hasCustomerMarker(null));
});

test('cookie name appearing only inside another cookie value', () => {
  const result = hasCustomerMarker('a=teracom_customer_in=1');
  assert.ok(!result);
});