import test from 'node:test';
import assert from 'node:assert/strict';

import { connectNotice, visibleConnections } from '../accountingPlatforms.js';

test('only the chosen accounting platform card shows', () => {
  const list = [{ key: 'zoho_books' }, { key: 'xero' }, { key: 'myob' }, { key: 'quickbooks' }, { key: 'vercel' }];
  assert.deepEqual(visibleConnections(list, 'xero').map((c) => c.key), ['xero', 'vercel']);
  assert.deepEqual(visibleConnections(list, '').map((c) => c.key), ['vercel']);
});

test('a sign-in result becomes a notice', () => {
  assert.deepEqual(connectNotice({ quickbooks: 'connected' }), { ok: true, text: 'QuickBooks Online is connected.' });
  assert.equal(connectNotice({ myob: 'failed', reason: 'No.' }).text, 'MYOB Business did not connect. No.');
  assert.equal(connectNotice({}), null);
});
