import test from 'node:test';
import assert from 'node:assert/strict';

import { checkedText, groupConnections, statusLabel, summarise, withResult } from '../connectionStatus.js';

const LIST = [
  { key: 'zoho_books', group: 'Accounts and payments', status: 'not_set_up' },
  { key: 'cloudflare', group: 'Hosting and network', status: 'connected' },
  { key: 'this_server', group: 'Servers and computers', status: 'connected' },
  { key: 'odd', group: 'Zebra things', status: 'failing' },
  { key: 'vercel', group: 'Hosting and network', status: 'attention' },
];

test('groups follow the page order, unknown groups last', () => {
  const groups = groupConnections(LIST);
  assert.deepEqual(groups.map((g) => g.group), [
    'Servers and computers',
    'Hosting and network',
    'Accounts and payments',
    'Zebra things',
  ]);
  assert.deepEqual(groups[1].items.map((i) => i.key), ['cloudflare', 'vercel']);
});

test('summary counts each state, worst first', () => {
  assert.deepEqual(summarise(LIST), [
    { status: 'failing', label: 'Failing', count: 1 },
    { status: 'attention', label: 'Needs attention', count: 1 },
    { status: 'not_set_up', label: 'Not set up', count: 1 },
    { status: 'connected', label: 'Connected', count: 2 },
  ]);
});

test('a test result replaces only its own connection', () => {
  const next = withResult(LIST, { key: 'vercel', status: 'connected', detail: 'READY', checked_at: '2026-10-04T01:00:00Z' });
  assert.equal(next[4].status, 'connected');
  assert.equal(next[4].detail, 'READY');
  assert.equal(next[1], LIST[1]);
});

test('labels and checked times read plainly', () => {
  assert.equal(statusLabel('unknown'), 'Not checked yet');
  assert.equal(statusLabel('nonsense'), 'Unknown');
  const now = new Date('2026-10-04T12:00:00Z');
  assert.equal(checkedText(null, now), '');
  assert.equal(checkedText('2026-10-04T11:59:40Z', now), 'Checked just now');
  assert.equal(checkedText('2026-10-04T11:59:00Z', now), 'Checked 1 minute ago');
  assert.equal(checkedText('2026-10-04T09:00:00Z', now), 'Checked 3 hours ago');
  assert.equal(checkedText('2026-10-01T12:00:00Z', now), 'Checked 3 days ago');
});
