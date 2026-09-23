import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { TURNSTILE_FAILED_MESSAGE, verifyTurnstile } from '../turnstile.js';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
});

function configure() {
  process.env.TURNSTILE_SECRET_KEY = 'secret';
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'site';
}

test('unconfigured is off, not silently allowed through', async () => {
  // Shipping this before the keys are set must not break every form on the
  // site. "Off" is a deliberate state; it is not the same as a failure.
  const result = await verifyTurnstile('anything');
  assert.deepEqual(result, { ok: true, skipped: true });
});

test('a missing token is rejected once Turnstile is configured', async () => {
  configure();
  // The site key alone does not enable it -- a page with a widget and no
  // secret would check nothing.
  const result = await verifyTurnstile('');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'missing');
});

test('a token Cloudflare accepts passes, and the secret is never sent to the client', async () => {
  configure();
  let sentBody = null;
  globalThis.fetch = async (url, options) => {
    assert.match(url, /challenges\.cloudflare\.com/);
    sentBody = options.body.toString();
    return { ok: true, json: async () => ({ success: true }) };
  };

  const result = await verifyTurnstile('token-abc', '203.0.113.5');
  assert.equal(result.ok, true);
  assert.match(sentBody, /secret=secret/);
  assert.match(sentBody, /response=token-abc/);
  assert.match(sentBody, /remoteip=203.0.113.5/);
});

test('a token Cloudflare rejects is rejected here', async () => {
  configure();
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
  });
  const result = await verifyTurnstile('bad-token');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid-input-response');
});

test('it fails CLOSED when Cloudflare cannot be reached', async () => {
  // "Cloudflare was briefly unreachable" is exactly the state a flood
  // creates, so an error must not wave the submission through.
  configure();
  globalThis.fetch = async () => {
    throw new Error('network down');
  };
  const closed = await verifyTurnstile('token');
  assert.equal(closed.ok, false);
  assert.equal(closed.reason, 'unreachable');
  assert.equal(closed.retryable, true);

  globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({}) });
  const http = await verifyTurnstile('token');
  assert.equal(http.ok, false);
  assert.equal(http.reason, 'http_503');
});

test('a blocked human is given a way to reach a person', async () => {
  // Someone turned away from the account application cannot accept terms
  // online. The message must not dead-end them.
  assert.match(TURNSTILE_FAILED_MESSAGE, /try once more/i);
  assert.match(TURNSTILE_FAILED_MESSAGE, /support@teracomsolutions\.com\.au/);
});
