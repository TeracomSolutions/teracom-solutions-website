import { test } from 'node:test';
import assert from 'node:assert/strict';

import { CUSTOMER_ROLES, EMAIL_TOPICS, toggleTopic, topicLabel } from '../customerTopics.js';
import { describeAudience } from '../socialFormat.js';

test('topics toggle in a fixed order', () => {
  assert.deepEqual(toggleTopic([], 'news', true), ['news']);
  assert.deepEqual(toggleTopic(['news'], 'specials', true), ['specials', 'news']);
  assert.deepEqual(toggleTopic(['specials', 'news'], 'specials', false), ['news']);
  assert.deepEqual(toggleTopic(['bogus'], 'news', true), ['news']);
  assert.equal(EMAIL_TOPICS.length, 5);
  assert.ok(CUSTOMER_ROLES.some((r) => r.key === 'installer'));
  assert.equal(topicLabel('new_tools'), 'New free tools');
});

test('an audience names its topic', () => {
  assert.equal(describeAudience({ trade: true, topic: 'specials' }), 'Trade customers who agreed to hear from us, who asked for specials and clearance');
  assert.equal(describeAudience({ all: true }), 'All customers who agreed to hear from us');
});
