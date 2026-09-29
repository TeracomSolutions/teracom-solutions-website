import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify, parseInline, parseGuide } from '../guideReader.js';

// Test slugify
await test('slugify', () => {
  assert.equal(slugify('Social > Posting: Step 1'), 'social-posting-step-1');
});

// Test parseInline
await test('parseInline', () => {
  const result = parseInline('Press **Save** then [the guide](/admin/guide).');
  
  assert.equal(result.length, 5);
  assert.deepStrictEqual(result[0], { type: 'text', text: 'Press ' });
  assert.deepStrictEqual(result[1], { type: 'bold', text: 'Save' });
  assert.deepStrictEqual(result[2], { type: 'text', text: ' then ' });
  assert.deepStrictEqual(result[3], { type: 'link', text: 'the guide', href: '/admin/guide' });
  assert.deepStrictEqual(result[4], { type: 'text', text: '.' });
});

// Test parseGuide with complex sample
await test('parseGuide complex sample', () => {
  const markdown = `## Introduction

### Setup

#### Configuration

This is a paragraph with **bold** text and [a link](/help).

- Item 1
- Item 2

1. First item
   - Sub-item 1
   - Sub-item 2
2. Second item
3. Third item

> This is a note

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`;
  
  const result = parseGuide(markdown);
  
  // Check types and structure
  assert.equal(result.length, 8);
  assert.deepStrictEqual(result[0], { type: 'h2', text: 'Introduction', id: 'introduction' });
  assert.deepStrictEqual(result[1], { type: 'h3', text: 'Setup', id: 'setup' });
  assert.deepStrictEqual(result[2], { type: 'h4', text: 'Configuration', id: 'configuration' });
  
  // Paragraph
  assert.equal(result[3].type, 'p');
  
  // Bullet list
  assert.equal(result[4].type, 'ul');
  assert.equal(result[4].items.length, 2);
  
  // Numbered list
  assert.equal(result[5].type, 'ol');
  assert.equal(result[5].items.length, 3);
  assert.equal(result[5].items[0].sub.length, 2);
  
  // Note
  assert.equal(result[6].type, 'note');
  
  // Table
  assert.equal(result[7].type, 'table');
  assert.equal(result[7].header.length, 2);
  assert.equal(result[7].rows.length, 2);
});

// Test edge cases
await test('parseGuide edge cases', () => {
  // "Intro" followed directly by "- a" gives a p then a ul
  const markdown1 = `Intro

- a`;
  
  const result1 = parseGuide(markdown1);
  assert.equal(result1.length, 2);
  assert.equal(result1[0].type, 'p');
  assert.equal(result1[1].type, 'ul');
  
  // "1. a", a blank line, "2. b" gives one ol with 2 items
  const markdown2 = `1. a

2. b`;
  
  const result2 = parseGuide(markdown2);
  assert.equal(result2.length, 1);
  assert.equal(result2[0].type, 'ol');
  assert.equal(result2[0].items.length, 2);
});