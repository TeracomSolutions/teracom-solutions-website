import test from 'node:test';
import assert from 'node:assert/strict';
import * as postPreview from '../postPreview.js';

// composeText tests
await test('composeText with override', () => {
  const result = postPreview.composeText('linkedin', { override: 'Custom text' });
  assert.equal(result, 'Custom text');
});

await test('composeText with title for linkedin', () => {
  const result = postPreview.composeText('linkedin', { title: 'Title', body: 'Body' });
  assert.equal(result, 'Title\n\nBody');
});

await test('composeText without title', () => {
  const result = postPreview.composeText('linkedin', { body: 'Body' });
  assert.equal(result, 'Body');
});

await test('composeText for x (no title)', () => {
  const result = postPreview.composeText('x', { body: 'Body' });
  assert.equal(result, 'Body');
});

// displayText tests
await test('displayText adds link for x', () => {
  const result = postPreview.displayText('x', 'Text', 'https://example.com');
  assert.equal(result, 'Text\n\nhttps://example.com');
});

await test('displayText adds link for instagram', () => {
  const result = postPreview.displayText('instagram', 'Text', 'https://example.com');
  assert.equal(result, 'Text\n\nhttps://example.com');
});

await test('displayText does not add link for linkedin when already in text', () => {
  const result = postPreview.displayText('linkedin', 'Text https://example.com', 'https://example.com');
  assert.equal(result, 'Text https://example.com');
});

await test('displayText does not add link for linkedin when empty url', () => {
  const result = postPreview.displayText('linkedin', 'Text', '');
  assert.equal(result, 'Text');
});

// visiblePart tests
await test('visiblePart for linkedin with 300 characters cuts before limit', () => {
  const text = 'This is a very long text with many words that should be cut at the limit to show more functionality. '.repeat(5);
  const result = postPreview.visiblePart('linkedin', text, false);
  assert.equal(result.more, true);
  assert.ok(result.shown.length <= 210);
});

await test('visiblePart for x returns everything when expanded', () => {
  const text = 'This is a very long text with many words that should be cut at the limit to show more functionality. '.repeat(5);
  const result = postPreview.visiblePart('x', text, true);
  assert.equal(result.more, false);
  assert.equal(result.shown, text);
});

await test('visiblePart for linkedin returns everything when expanded', () => {
  const text = 'This is a very long text with many words that should be cut at the limit to show more functionality. '.repeat(5);
  const result = postPreview.visiblePart('linkedin', text, true);
  assert.equal(result.more, false);
  assert.equal(result.shown, text);
});

// hostOf tests
await test('hostOf valid url', () => {
  const result = postPreview.hostOf('https://www.teracomsolutions.com.au/a');
  assert.equal(result, 'teracomsolutions.com.au');
});

await test('hostOf invalid url', () => {
  const result = postPreview.hostOf('nope');
  assert.equal(result, '');
});

// shortLink tests
await test('shortLink valid url with truncation', () => {
  const result = postPreview.shortLink('https://www.teracomsolutions.com.au/resources/aritech-manuals');
  assert.ok(result.length === 25);
  assert.ok(result.endsWith('…'));
});

await test('shortLink valid url without truncation', () => {
  const result = postPreview.shortLink('https://x.com/');
  assert.equal(result, 'x.com');
});

// mediaLayout tests
await test('mediaLayout for 0 items', () => {
  assert.equal(postPreview.mediaLayout(0), 'none');
});

await test('mediaLayout for 1 item', () => {
  assert.equal(postPreview.mediaLayout(1), 'single');
});

await test('mediaLayout for 2 items', () => {
  assert.equal(postPreview.mediaLayout(2), 'two');
});

await test('mediaLayout for 3 items', () => {
  assert.equal(postPreview.mediaLayout(3), 'three');
});

await test('mediaLayout for 7 items', () => {
  assert.equal(postPreview.mediaLayout(7), 'grid');
});

// initials tests
await test('initials for full name', () => {
  const result = postPreview.initials('Teracom Solutions on LinkedIn');
  assert.equal(result, 'TS');
});

await test('initials for empty string', () => {
  const result = postPreview.initials('');
  assert.equal(result, 'T');
});