import test from 'node:test';
import assert from 'node:assert/strict';

import { stageHref, stageLabel, tileTone, tiles, recentTiles, statusBars, poRows } from '../orderDashboardView.js';

// 1. stageHref('to_ship') equals '/admin/orders?stage=to_ship&mode=live'.
test('stageHref', () => {
  assert.equal(stageHref('to_ship'), '/admin/orders?stage=to_ship&mode=live');
});

// 2. stageLabel for each of the 8 keys in TILE_LABELS returns its label, and stageLabel('nope') is the empty string.
test('stageLabel', () => {
  assert.equal(stageLabel('to_prepare'), 'To prepare');
  assert.equal(stageLabel('to_approve'), 'To approve');
  assert.equal(stageLabel('in_zoho'), 'In Zoho');
  assert.equal(stageLabel('to_ship'), 'To ship');
  assert.equal(stageLabel('shipped'), 'Shipped');
  assert.equal(stageLabel('needs_attention'), 'Needs attention');
  assert.equal(stageLabel('to_invoice'), 'Invoice not sent');
  assert.equal(stageLabel('po_to_send'), 'Supplier purchase orders to send');
  assert.equal(stageLabel('nope'), '');
});

// 3. tileTone gives 'muted' when the count is 0 for every key, 'bad' for needs_attention with count 2, 'good' for shipped with count 1, 'warn' for to_approve with count 3.
test('tileTone', () => {
  assert.equal(tileTone('to_prepare', 0), 'muted');
  assert.equal(tileTone('to_approve', 0), 'muted');
  assert.equal(tileTone('in_zoho', 0), 'muted');
  assert.equal(tileTone('to_ship', 0), 'muted');
  assert.equal(tileTone('shipped', 0), 'muted');
  assert.equal(tileTone('needs_attention', 0), 'muted');
  assert.equal(tileTone('to_invoice', 0), 'muted');
  assert.equal(tileTone('po_to_send', 0), 'muted');

  assert.equal(tileTone('needs_attention', 2), 'bad');
  assert.equal(tileTone('shipped', 1), 'good');
  assert.equal(tileTone('to_approve', 3), 'warn');
});

// 4. tiles([{ key: 'to_ship', label: 'To ship', count: 4 }]) gives one tile with tone 'warn' and href '/admin/orders?stage=to_ship&mode=live'; tiles(undefined) is an empty array.
test('tiles', () => {
  const result = tiles([{ key: 'to_ship', label: 'To ship', count: 4 }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].key, 'to_ship');
  assert.equal(result[0].label, 'To ship');
  assert.equal(result[0].count, 4);
  assert.equal(result[0].tone, 'warn');
  assert.equal(result[0].href, '/admin/orders?stage=to_ship&mode=live');

  assert.equal(tiles(undefined).length, 0);
});

// 5. recentTiles({ orders_today: 2, orders_week: 9, value_today_cents: 12345, value_week_cents: 100000 }) has four tiles with values '2', '9', '$123.45' and '$1,000.00'.
test('recentTiles', () => {
  const result = recentTiles({ orders_today: 2, orders_week: 9, value_today_cents: 12345, value_week_cents: 100000 });
  assert.equal(result.length, 4);
  assert.equal(result[0].key, 'orders_today');
  assert.equal(result[0].label, 'Orders today');
  assert.equal(result[0].value, '2');

  assert.equal(result[1].key, 'orders_week');
  assert.equal(result[1].label, 'Orders in the last 7 days');
  assert.equal(result[1].value, '9');

  assert.equal(result[2].key, 'value_today');
  assert.equal(result[2].label, 'Sales today');
  assert.equal(result[2].value, '$123.45');

  assert.equal(result[3].key, 'value_week');
  assert.equal(result[3].label, 'Sales in the last 7 days');
  assert.equal(result[3].value, '$1,000.00');
});

// 6. recentTiles(undefined) has four tiles with values '0', '0', '$0.00', '$0.00'.
test('recentTiles undefined', () => {
  const result = recentTiles(undefined);
  assert.equal(result.length, 4);
  assert.equal(result[0].value, '0');
  assert.equal(result[1].value, '0');
  assert.equal(result[2].value, '$0.00');
  assert.equal(result[3].value, '$0.00');
});

// 7. statusBars([{ status: 'complete', count: 3 }, { status: 'attention', count: 1 }]) gives percents 75 and 25 and the label 'Complete' for the first.
test('statusBars', () => {
  const result = statusBars([{ status: 'complete', count: 3 }, { status: 'attention', count: 1 }]);
  assert.equal(result.length, 2);
  assert.equal(result[0].status, 'complete');
  assert.equal(result[0].label, 'Complete');
  assert.equal(result[0].count, 3);
  assert.equal(result[0].percent, 75);

  assert.equal(result[1].status, 'attention');
  assert.equal(result[1].label, 'Needs attention');
  assert.equal(result[1].count, 1);
  assert.equal(result[1].percent, 25);
});

// 8. statusBars([]) is an empty array and statusBars([{ status: 'complete', count: 0 }]) has percent 0.
test('statusBars edge cases', () => {
  assert.equal(statusBars([]).length, 0);

  const result = statusBars([{ status: 'complete', count: 0 }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].percent, 0);
});

// 9. poRows({ draft: 1, sent: 2 }) has six rows, the draft row count 1, the sent row count 2, the failed row count 0, and the last row key 'received' with count null and note 'Not tracked yet'.
test('poRows', () => {
  const result = poRows({ draft: 1, sent: 2 });
  assert.equal(result.length, 6);

  assert.equal(result[0].key, 'draft');
  assert.equal(result[0].label, 'Drafted');
  assert.equal(result[0].count, 1);

  assert.equal(result[3].key, 'sent');
  assert.equal(result[3].label, 'Sent to the supplier');
  assert.equal(result[3].count, 2);

  assert.equal(result[4].key, 'failed');
  assert.equal(result[4].label, 'Failed');
  assert.equal(result[4].count, 0);

  assert.equal(result[5].key, 'received');
  assert.equal(result[5].label, 'Received');
  assert.equal(result[5].count, null);
  assert.equal(result[5].note, 'Not tracked yet');
});