import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Set backend URL before importing client.js
process.env.BACKEND_API_URL = 'https://backend.test';

const { backendFetch } = await import('../api/client.js');

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

test('without revalidate the call is not cached', async () => {
  mockFetchOnce(async () => createFakeResponse());

  await backendFetch('/x');

  assert.equal(capturedFetchOptions.cache, 'no-store');
  assert.equal(capturedFetchOptions.next, undefined);
});

test('with revalidate the call can be kept', async () => {
  mockFetchOnce(async () => createFakeResponse());

  await backendFetch('/x', { revalidate: 300 });

  assert.equal(capturedFetchOptions.next.revalidate, 300);
  assert.equal(capturedFetchOptions.cache, undefined);
});

test('revalidate does not change the method, headers or body', async () => {
  mockFetchOnce(async () => createFakeResponse());

  await backendFetch('/x', { method: 'POST', body: { a: 1 }, token: 't', revalidate: 60 });

  assert.equal(capturedFetchOptions.method, 'POST');
  assert.equal(capturedFetchOptions.body, '{"a":1}');
  assert.ok(capturedFetchOptions.headers.Authorization.includes('Bearer t'));
});