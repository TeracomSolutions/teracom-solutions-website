import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// websiteConnections.js is server-only and reads Vercel settings, so its stale check is read as text here
// and the rule is checked through the shared max age.
import { STORED_RESULT_MAX_AGE_MS } from '../storedConnectionResults.js';

test('Stripe and Turnstile are checked again when their stored result is missing or over a day old', () => {
  const source = fs.readFileSync('lib/websiteConnections.js', 'utf8');
  assert.ok(source.includes('export function staleWebsiteTests'));
  assert.ok(source.includes('await saveWebsiteResult(token, key, result)'));
  assert.ok(source.includes('now.getTime() - at > STORED_RESULT_MAX_AGE_MS'));
  assert.equal(STORED_RESULT_MAX_AGE_MS, 24 * 60 * 60 * 1000);
});
