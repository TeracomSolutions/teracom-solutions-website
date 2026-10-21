import test from 'node:test';
import assert from 'node:assert/strict';

import { formatWhen, publishState } from '../pricePublishView.js';


test('formatWhen handles empty and invalid inputs', () => {
  assert.strictEqual(formatWhen(''), '');
  assert.strictEqual(formatWhen('nonsense'), '');
});

test('formatWhen formats valid ISO date correctly', () => {
  const result = formatWhen('2026-10-20T01:30:00+00:00');
  assert.ok(result.includes('20 Oct 2026'));
  assert.ok(result.includes('12:30'));
});

test('publishState returns correct state for different inputs', () => {
  const result1 = publishState({ pending: true, last_changed_at: 'x' });
  assert.strictEqual(result1.tone, 'pending');
  assert.strictEqual(result1.headline, 'Changes not yet on the website');

  const result2 = publishState({ pending: false, last_changed_at: '2026-10-20T01:30:00+00:00', last_published_at: '2026-10-20T02:00:00+00:00' });
  assert.strictEqual(result2.tone, 'ok');
  assert.strictEqual(result2.headline, 'Website is up to date');

  const result3 = publishState({ pending: false });
  assert.strictEqual(result3.headline, 'No price changes recorded yet');

  const result4 = publishState(null);
  assert.strictEqual(result4.tone, 'unknown');
});