import test from 'node:test';
import assert from 'node:assert/strict';
import * as mediaFormat from '../mediaFormat.js';

// Test kindOf function
await test('kindOf with image file', () => {
  const file = { type: 'image/jpeg' };
  assert.strictEqual(mediaFormat.kindOf(file), 'image');
});

await test('kindOf with video file', () => {
  const file = { type: 'video/mp4' };
  assert.strictEqual(mediaFormat.kindOf(file), 'video');
});

// Test sizeLabel function
await test('sizeLabel with bytes', () => {
  assert.strictEqual(mediaFormat.sizeLabel(500), '500 B');
});

await test('sizeLabel with kilobytes', () => {
  assert.strictEqual(mediaFormat.sizeLabel(1500), '2 KB');
});

await test('sizeLabel with megabytes', () => {
  assert.strictEqual(mediaFormat.sizeLabel(1500000), '1.4 MB');
});

await test('sizeLabel with 8MB', () => {
  assert.strictEqual(mediaFormat.sizeLabel(8388608), '8 MB');
});

// Test durationLabel function
await test('durationLabel with null', () => {
  assert.strictEqual(mediaFormat.durationLabel(null), '');
});

await test('durationLabel with seconds', () => {
  assert.strictEqual(mediaFormat.durationLabel(45), '0:45');
});

await test('durationLabel with minutes and seconds', () => {
  assert.strictEqual(mediaFormat.durationLabel(125), '2:05');
});

await test('durationLabel with hours, minutes and seconds', () => {
  assert.strictEqual(mediaFormat.durationLabel(3723), '1:02:03');
});

// Test canAdd function
await test('canAdd with valid image', () => {
  const existing = [];
  const file = { type: 'image/png' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), '');
});

await test('canAdd with invalid type', () => {
  const existing = [];
  const file = { type: 'text/plain' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), 'Pictures must be JPEG, PNG or WebP; videos MP4 or MOV.');
});

await test('canAdd with empty type', () => {
  const existing = [];
  const file = { type: '' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), 'Pictures must be JPEG, PNG or WebP; videos MP4 or MOV.');
});

await test('canAdd with too many images', () => {
  const existing = Array(20).fill().map(() => ({ kind: 'image' }));
  const file = { type: 'image/jpeg' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), 'Up to 20 pictures in one post.');
});

await test('canAdd with video when already have a video', () => {
  const existing = [{ kind: 'video' }];
  const file = { type: 'video/mp4' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), 'Use pictures or one video, not both.');
});

await test('canAdd with video when already have images', () => {
  const existing = Array(5).fill().map(() => ({ kind: 'image' }));
  const file = { type: 'video/mp4' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), 'Use pictures or one video, not both.');
});

await test('canAdd with picture after video', () => {
  const existing = [{ kind: 'video' }];
  const file = { type: 'image/jpeg' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), 'Use pictures or one video, not both.');
});

await test('canAdd with valid video', () => {
  const existing = [];
  const file = { type: 'video/mp4' };
  assert.strictEqual(mediaFormat.canAdd(existing, file), '');
});

// Test tooBig function
await test('tooBig with valid image size', () => {
  const file = { size: 100000, type: 'image/jpeg' };
  assert.strictEqual(mediaFormat.tooBig(file, 200 * 1024, 500 * 1024), '');
});

await test('tooBig with invalid image size', () => {
  const file = { size: 300000, type: 'image/jpeg' };
  assert.strictEqual(mediaFormat.tooBig(file, 200 * 1024, 500 * 1024), 'Too big: the limit is 200 KB for a picture.');
});

await test('tooBig with valid video size', () => {
  const file = { size: 400000, type: 'video/mp4' };
  assert.strictEqual(mediaFormat.tooBig(file, 200 * 1024, 500 * 1024), '');
});

await test('tooBig with invalid video size', () => {
  const file = { size: 600000, type: 'video/mp4' };
  assert.strictEqual(mediaFormat.tooBig(file, 200 * 1024, 500 * 1024), 'Too big: the limit is 500 KB for a video.');
});

await test('canAdd refuses a picture after a video', () => {
  assert.strictEqual(mediaFormat.canAdd([{ kind: 'video' }], { type: 'image/png' }), 'Use pictures or one video, not both.');
});

await test('kindOf with no type', () => {
  assert.strictEqual(mediaFormat.kindOf({}), 'image');
});
