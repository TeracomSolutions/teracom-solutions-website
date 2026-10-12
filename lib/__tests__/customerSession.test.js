import test from 'node:test';
import assert from 'node:assert/strict';

import { setCustomerSessionCookies, clearCustomerSessionCookies } from '../customerSession.js';
import { CUSTOMER_MARKER_COOKIE } from '../customerMarker.js';

const CUSTOMER_ACCESS_TOKEN_COOKIE = 'teracom_customer_session';
const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;

function makeFakeResponse() {
  return {
    cookies: {
      calls: [],
      set(name, value, options) {
        this.calls.push({ name, value, options });
      },
    },
  };
}

test('signing in sets the session cookie httpOnly and the marker cookie not httpOnly', () => {
  const fake = makeFakeResponse();
  const response = setCustomerSessionCookies(fake, 'tok');

  // Check that it returns the same object
  assert.equal(response, fake);

  // Find the calls for both cookies
  const sessionCall = fake.cookies.calls.find(call => call.name === CUSTOMER_ACCESS_TOKEN_COOKIE);
  const markerCall = fake.cookies.calls.find(call => call.name === CUSTOMER_MARKER_COOKIE);

  // Check session cookie
  assert.ok(sessionCall, 'Session cookie should be set');
  assert.equal(sessionCall.value, 'tok');
  assert.equal(sessionCall.options.httpOnly, true);
  assert.equal(sessionCall.options.maxAge, ACCESS_TOKEN_MAX_AGE_SECONDS);

  // Check marker cookie
  assert.ok(markerCall, 'Marker cookie should be set');
  assert.equal(markerCall.value, '1');
  assert.equal(markerCall.options.httpOnly, false);
  assert.equal(markerCall.options.maxAge, ACCESS_TOKEN_MAX_AGE_SECONDS);
  assert.equal(markerCall.options.path, '/');
});

test('signing out clears both cookies', () => {
  const fake = makeFakeResponse();
  const response = clearCustomerSessionCookies(fake);

  // Check that it returns the same object
  assert.equal(response, fake);

  // Find the calls for both cookies
  const sessionCall = fake.cookies.calls.find(call => call.name === CUSTOMER_ACCESS_TOKEN_COOKIE);
  const markerCall = fake.cookies.calls.find(call => call.name === CUSTOMER_MARKER_COOKIE);

  // Check session cookie is cleared
  assert.ok(sessionCall, 'Session cookie should be cleared');
  assert.equal(sessionCall.value, '');
  assert.equal(sessionCall.options.maxAge, 0);

  // Check marker cookie is cleared
  assert.ok(markerCall, 'Marker cookie should be cleared');
  assert.equal(markerCall.value, '');
  assert.equal(markerCall.options.maxAge, 0);
  assert.equal(markerCall.options.httpOnly, false);
});

test('the marker never holds the token', () => {
  const fake = makeFakeResponse();
  setCustomerSessionCookies(fake, 'secret-token');

  // Find all calls for the marker cookie
  const markerCalls = fake.cookies.calls.filter(call => call.name === CUSTOMER_MARKER_COOKIE);

  // Check that none of the marker calls have the token in their value
  for (const call of markerCalls) {
    assert.ok(!call.value.includes('secret-token'), `Marker cookie value should not contain the token: ${call.value}`);
  }
});