import test from 'node:test';
import assert from 'node:assert/strict';
import { publishDetails } from '../pricePublishView.js';

test('publishDetails with empty object or null returns default values', () => {
  const result1 = publishDetails({});
  const result2 = publishDetails(null);

  assert.deepEqual(result1, {
    changed: 'No changes recorded',
    published: 'Never made live from here'
  });

  assert.deepEqual(result2, {
    changed: 'No changes recorded',
    published: 'Never made live from here'
  });
});


test('publishDetails with full data returns formatted values', () => {
  const input = {
    last_changed_at: '2026-10-20T01:30:00+00:00',
    last_published_at: '2026-10-20T02:00:00+00:00',
    last_published_by: 'Robert Opus'
  };

  const result = publishDetails(input);

  assert.ok(result.changed.includes('20 Oct 2026'));
  assert.ok(result.published.includes('20 Oct 2026'));
  assert.ok(result.published.endsWith(' by Robert Opus'));
});
