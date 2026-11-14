import assert from 'node:assert/strict';
import test from 'node:test';

import { actionsFor, campaignPayload, charsLeft, dollarsToCents, emptyCampaign, money, statusText, statusTone } from '../advertisingView.js';

test('statuses read plainly with colours', () => {
  assert.equal(statusText('ready'), 'Sent, switched off');
  assert.equal(statusTone('live'), 'connected');
  assert.equal(statusTone('nonsense'), 'unknown');
});

test('money is shown and read in dollars', () => {
  assert.equal(money(123456), '$1,234.56');
  assert.equal(money(null), '—');
  assert.equal(dollarsToCents('$1,250.5'), 125050);
  assert.equal(dollarsToCents(''), null);
  assert.ok(Number.isNaN(dollarsToCents('abc')));
});

test('buttons follow the status', () => {
  assert.deepEqual(actionsFor({ status: 'draft' }), ['edit', 'write', 'send', 'delete']);
  assert.ok(actionsFor({ status: 'live' }).includes('pause'));
  assert.ok(!actionsFor({ status: 'live' }).includes('live'));
  assert.ok(actionsFor({ status: 'ready', method: 'manual' }).includes('record'));
});

test('the form becomes the backend body', () => {
  const body = campaignPayload({ ...emptyCampaign('ebay'), name: ' Cams ', budget: '25' });
  assert.equal(body.name, 'Cams');
  assert.equal(body.daily_budget_cents, 2500);
  assert.throws(() => campaignPayload({ ...emptyCampaign(), budget: 'x' }));
  assert.equal(charsLeft('abc', 40), 37);
  assert.equal(charsLeft('abc', 0), null);
});
