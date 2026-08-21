import { test } from 'node:test';
import assert from 'node:assert/strict';

import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '../rateLimit.js';

test('checkRateLimit allows requests up to the limit, then blocks', () => {
  const key = `test-key-${Math.random()}`;
  const options = { maxAttempts: 3, windowMs: 10_000 };

  assert.equal(checkRateLimit(key, options).allowed, true);
  assert.equal(checkRateLimit(key, options).allowed, true);
  assert.equal(checkRateLimit(key, options).allowed, true);

  const blocked = checkRateLimit(key, options);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
});

test('checkRateLimit tracks distinct keys independently', () => {
  const options = { maxAttempts: 1, windowMs: 10_000 };
  const keyA = `test-key-a-${Math.random()}`;
  const keyB = `test-key-b-${Math.random()}`;

  assert.equal(checkRateLimit(keyA, options).allowed, true);
  assert.equal(checkRateLimit(keyA, options).allowed, false);
  // A different key has its own independent budget, unaffected by keyA.
  assert.equal(checkRateLimit(keyB, options).allowed, true);
});

test('checkRateLimit lets requests through again once the window elapses', async () => {
  const key = `test-key-window-${Math.random()}`;
  const options = { maxAttempts: 1, windowMs: 50 };

  assert.equal(checkRateLimit(key, options).allowed, true);
  assert.equal(checkRateLimit(key, options).allowed, false);

  await new Promise((resolve) => setTimeout(resolve, 60));

  assert.equal(checkRateLimit(key, options).allowed, true);
});

test('clientIpFromRequest reads the first address from X-Forwarded-For', () => {
  const req = { headers: new Headers({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' }) };
  assert.equal(clientIpFromRequest(req), '203.0.113.5');
});

test('clientIpFromRequest falls back to X-Real-IP, then "unknown"', () => {
  const withRealIp = { headers: new Headers({ 'x-real-ip': '203.0.113.9' }) };
  assert.equal(clientIpFromRequest(withRealIp), '203.0.113.9');

  const withNeither = { headers: new Headers() };
  assert.equal(clientIpFromRequest(withNeither), 'unknown');
});

test('rateLimitResponse returns a 429 with a Retry-After header and JSON body', async () => {
  const res = rateLimitResponse(42, 'slow down');
  assert.equal(res.status, 429);
  assert.equal(res.headers.get('Retry-After'), '42');
  const body = await res.json();
  assert.deepEqual(body, { error: 'slow down' });
});
