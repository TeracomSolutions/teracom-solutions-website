import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aiCapabilities, findAiCapability } from '../aiCapabilities.js';

// Test 1: there are 6 capabilities; their slugs are all different (new Set of slugs has size 6); every slug contains only lower-case letters, digits and hyphens (test each with the regular expression /^[a-z0-9-]+$/).
test('aiCapabilities validation', () => {
  assert.strictEqual(aiCapabilities.length, 6);

  const slugs = aiCapabilities.map(c => c.slug);
  assert.strictEqual(new Set(slugs).size, 6, 'All slugs must be unique');

  const slugRegex = /^[a-z0-9-]+$/;
  for (const slug of slugs) {
    assert.ok(slugRegex.test(slug), `Slug '${slug}' does not match the required pattern`);
  }
});

// Test 2: every capability has a non-empty title, summary and description, an imageFile ending in '.svg', and a benefits array of exactly 3 non-empty strings.
test('capability structure validation', () => {
  for (const capability of aiCapabilities) {
    assert.ok(capability.title && typeof capability.title === 'string', 'Title must be a non-empty string');
    assert.ok(capability.summary && typeof capability.summary === 'string', 'Summary must be a non-empty string');
    assert.ok(capability.description && typeof capability.description === 'string', 'Description must be a non-empty string');
    assert.ok(capability.imageFile && typeof capability.imageFile === 'string' && capability.imageFile.endsWith('.svg'), 'ImageFile must be a string ending in .svg');

    assert.ok(Array.isArray(capability.benefits), 'Benefits must be an array');
    assert.strictEqual(capability.benefits.length, 3, 'Benefits array must have exactly 3 items');

    for (const benefit of capability.benefits) {
      assert.ok(benefit && typeof benefit === 'string', 'Each benefit must be a non-empty string');
    }
  }
});

// Test 3: findAiCapability('ai-support-agents').title is 'AI Support Agents'; findAiCapability('missing') is undefined.
test('findAiCapability function', () => {
  const agentCapability = findAiCapability('ai-support-agents');
  assert.ok(agentCapability, 'Should find the ai-support-agents capability');
  assert.strictEqual(agentCapability.title, 'AI Support Agents', 'Title should be correct');

  const missingCapability = findAiCapability('missing');
  assert.strictEqual(missingCapability, undefined, 'Should return undefined for non-existent slug');
});