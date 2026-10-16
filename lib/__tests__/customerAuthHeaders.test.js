import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Set backend URL and service token before importing customerAuth.js
process.env.BACKEND_API_URL = 'https://backend.test';
process.env.WEBSITE_FRONTEND_SERVICE_TOKEN = 'svc-token';

const { getSignupCaptcha, customerSignup, customerLogin, getCurrentCustomer, requestPasswordReset, resetPassword } = await import('../api/customerAuth.js');

let originalFetch;
let capturedFetchOptions = null;

before(() => {
  originalFetch = global.fetch;
});

after(() => {
  global.fetch = originalFetch;
});

function mockFetchOnce(handler) {
  global.fetch = async (url, init) => {
    capturedFetchOptions = init;
    return handler(url, init);
  };
}

// Helper to create a fake Response object
function createFakeResponse(body = '{}', status = 200) {
  return {
    ok: true,
    status,
    statusText: 'OK',
    text: async () => body,
    headers: {
      get: () => null
    }
  };
}

// Test that each public customer call sends the service token and the visitor address
for (const [name, fn] of Object.entries({
  getSignupCaptcha,
  customerSignup,
  customerLogin,
  requestPasswordReset,
  resetPassword
})) {
  test(`${name} sends the service token and the visitor address`, async () => {
    mockFetchOnce(async () => createFakeResponse());

    // Call each function with plausible arguments and the address '203.0.113.7'
    if (name === 'customerSignup') {
      await fn('{"email":"test@example.com"}', '203.0.113.7');
    } else if (name === 'customerLogin') {
      await fn('a@example.com', 'secret', '203.0.113.7');
    } else if (name === 'requestPasswordReset') {
      await fn('a@example.com', '203.0.113.7');
    } else if (name === 'resetPassword') {
      await fn('reset-token', 'newpassword', '203.0.113.7');
    } else {
      await fn('203.0.113.7');
    }

    const headers = capturedFetchOptions.headers;
    assert.equal(headers['X-Internal-Service-Token'], 'svc-token');
    assert.equal(headers['X-Client-IP'], '203.0.113.7');
  });
}

// Test that the visitor address is left out when it is unknown
test('customerLogin with unknown address sends only service token', async () => {
  mockFetchOnce(async () => createFakeResponse());

  await customerLogin('a@example.com', 'secret', 'unknown');

  const headers = capturedFetchOptions.headers;
  assert.equal(headers['X-Internal-Service-Token'], 'svc-token');
  assert.equal(headers['X-Client-IP'], undefined);
});

test('customerLogin without address sends only service token', async () => {
  mockFetchOnce(async () => createFakeResponse());

  await customerLogin('a@example.com', 'secret');

  const headers = capturedFetchOptions.headers;
  assert.equal(headers['X-Internal-Service-Token'], 'svc-token');
  assert.equal(headers['X-Client-IP'], undefined);
});

// Test that the signed-in lookup does not send the service token
// This one is special because it doesn't use serviceHeaders, just passes a token
// We need to test that Authorization header is set but no X-Internal-Service-Token
// But we can't easily verify what headers are sent for getCurrentCustomer without
// access to the function's internals. Let's make a different approach.
test('getCurrentCustomer does not send the service token', async () => {
  mockFetchOnce(async () => createFakeResponse());

  await getCurrentCustomer('bearer-token');

  // Check that Authorization header is set correctly
  const headers = capturedFetchOptions.headers;
  assert.ok(headers.Authorization.includes('Bearer bearer-token'));
  // The function should NOT have X-Internal-Service-Token in headers
  assert.equal(headers['X-Internal-Service-Token'], undefined);
});