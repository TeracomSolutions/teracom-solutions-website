import test from 'node:test';
import assert from 'node:assert/strict';

import { secureCookies } from '../adminIdle.js';

test('secureCookies with production env', () => {
  assert.equal(secureCookies({ NODE_ENV: 'production' }), true);
});

test('secureCookies with development env', () => {
  assert.equal(secureCookies({ NODE_ENV: 'development' }), false);
  assert.equal(secureCookies({}), false);
});

test('secureCookies with production and ADMIN_INSECURE_HTTP', () => {
  assert.equal(secureCookies({ NODE_ENV: 'production', ADMIN_INSECURE_HTTP: 'true' }), false);
  assert.equal(secureCookies({ NODE_ENV: 'production', ADMIN_INSECURE_HTTP: 'false' }), true);
  assert.equal(secureCookies({ NODE_ENV: 'production', ADMIN_INSECURE_HTTP: 'yes' }), true);
});
