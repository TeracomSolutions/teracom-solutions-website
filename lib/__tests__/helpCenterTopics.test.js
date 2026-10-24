import test from 'node:test';
import assert from 'node:assert/strict';
import { helpCenterTopics } from '../helpCenterTopics.js';

// Test 1: there is at least one topic; the slugs are all different;
// every slug matches /^[a-z0-9-]+$/; every topic has a non-empty title
// and an intro longer than 40 characters.
test('help center topics validation', () => {
  assert.ok(helpCenterTopics.length > 0, 'There should be at least one topic');

  const slugs = [];
  for (const topic of helpCenterTopics) {
    // Check title is non-empty
    assert.ok(topic.title && topic.title.trim().length > 0, `Topic should have a non-empty title: ${JSON.stringify(topic)}`);

    // Check intro is longer than 40 characters
    assert.ok(topic.intro && topic.intro.length > 40, `Topic intro should be longer than 40 characters: ${JSON.stringify(topic)}`);

    // Check slug exists and matches pattern
    assert.ok(topic.slug, 'Topic should have a slug');
    assert.ok(/^[a-z0-9-]+$/.test(topic.slug), `Slug should match /^[a-z0-9-]+$/ pattern: ${topic.slug}`);

    // Check for unique slugs
    assert.ok(!slugs.includes(topic.slug), `Slug should be unique: ${topic.slug}`);
    slugs.push(topic.slug);
  }

  // Test 2: every topic has a faqs array with at least one entry,
  // and every entry has a non-empty string q and a non-empty string a.
  for (const topic of helpCenterTopics) {
    assert.ok(Array.isArray(topic.faqs), `Topic should have a faqs array: ${JSON.stringify(topic)}`);
    assert.ok(topic.faqs.length > 0, `Topic should have at least one FAQ: ${JSON.stringify(topic)}`);

    for (const faq of topic.faqs) {
      assert.ok(faq.q && faq.q.trim().length > 0, `FAQ question should be a non-empty string: ${JSON.stringify(faq)}`);
      assert.ok(faq.a && faq.a.trim().length > 0, `FAQ answer should be a non-empty string: ${JSON.stringify(faq)}`);
    }
  }
});