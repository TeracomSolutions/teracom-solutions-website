import test from 'node:test';
import assert from 'node:assert/strict';

import { checkPost, CHANNEL_RULES, textLength } from '../socialRules.js';

// Test cases for the social rules implementation

test('X channel - basic text validation', () => {
  const errors = checkPost('x', { text: 'Hello world', linkUrl: null, media: [] });
  assert.equal(errors.length, 0);
});

test('X channel - text over limit', () => {
  const errors = checkPost('x', { 
    text: 'a'.repeat(281), 
    linkUrl: null, 
    media: [] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
});

test('X channel - text with link over limit', () => {
  // 256 characters plus a link is exactly 280 (allowed); 257 is too long.
  assert.deepEqual(checkPost('x', { text: 'a'.repeat(256), linkUrl: 'https://example.com', media: [] }), []);
  const errors = checkPost('x', { text: 'a'.repeat(257), linkUrl: 'https://example.com', media: [] });
  assert.deepEqual(errors.map((e) => e.message), ['Too long: 281 characters including the link; the limit is 280.']);
});

test('X channel - image and video both present', () => {
  const errors = checkPost('x', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'image', url: 'img1.jpg', width: 800, height: 600 },
      { kind: 'video', url: 'vid1.mp4', duration_seconds: 30 }
    ] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
});

test('X channel - max 4 images', () => {
  const errors = checkPost('x', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'image', url: 'img1.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img2.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img3.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img4.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img5.jpg', width: 800, height: 600 }
    ] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
});

test('X channel - max 1 video', () => {
  const errors = checkPost('x', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'video', url: 'vid1.mp4', duration_seconds: 30 },
      { kind: 'video', url: 'vid2.mp4', duration_seconds: 30 }
    ] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
});

test('Instagram channel - requires media', () => {
  const errors = checkPost('instagram', { 
    text: 'test', 
    linkUrl: null, 
    media: [] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
});

test('Instagram channel - hashtag limit', () => {
  const errors = checkPost('instagram', { 
    text: '#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10 #tag11 #tag12 #tag13 #tag14 #tag15 #tag16 #tag17 #tag18 #tag19 #tag20 #tag21 #tag22 #tag23 #tag24 #tag25 #tag26 #tag27 #tag28 #tag29 #tag30 #tag31', 
    linkUrl: null, 
    media: [
      { kind: 'image', url: 'img.jpg', width: 800, height: 600 }
    ] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
});

test('Instagram channel - image aspect ratio warning', () => {
  const errors = checkPost('instagram', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'image', url: 'img.jpg', width: 100, height: 600 }
    ] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'warning');
});
test('Facebook channel - video duration range', () => {
  const errors = checkPost('facebook', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'video', url: 'vid.mp4', duration_seconds: 10 }
    ] 
  });
  assert.equal(errors.length, 0);
});
test('LinkedIn channel - video duration range', () => {
  const errors = checkPost('linkedin', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'video', url: 'vid.mp4', duration_seconds: 10 }
    ] 
  });
  assert.equal(errors.length, 0);
});
test('Email channel - video as link warning', () => {
  const errors = checkPost('email', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'video', url: 'vid.mp4', duration_seconds: 10 }
    ] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'warning');
});
test('Email channel - pictures are allowed', () => {
  const errors = checkPost('email', { text: 'test', linkUrl: null, media: [{ kind: 'image', url: 'img.jpg', width: 800, height: 600 }] });
  assert.deepEqual(errors, []);
});

test('LinkedIn text with link under limit', () => {
  // LinkedIn text of 2990 characters with a link should be fine
  const errors = checkPost('linkedin', { 
    text: 'a'.repeat(2990), 
    linkUrl: 'https://example.com', 
    media: [] 
  });
  assert.equal(errors.length, 0);
});
test('Email with 3 pictures has no problems', () => {
  // Email with 3 pictures should have no problems
  const errors = checkPost('email', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'image', url: 'img1.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img2.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img3.jpg', width: 800, height: 600 }
    ] 
  });
  assert.equal(errors.length, 0);
});
test('X with 5 pictures gives exactly one problem', () => {
  // X with 5 pictures should give exactly one problem
  const errors = checkPost('x', { 
    text: 'test', 
    linkUrl: null, 
    media: [
      { kind: 'image', url: 'img1.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img2.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img3.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img4.jpg', width: 800, height: 600 },
      { kind: 'image', url: 'img5.jpg', width: 800, height: 600 }
    ] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
  assert.equal(errors[0].message, 'Up to 4 pictures; this post has 5.');
});
test('Instagram with no media gives exactly one problem', () => {
  // Instagram with no media should give exactly one problem
  const errors = checkPost('instagram', { 
    text: 'test', 
    linkUrl: null, 
    media: [] 
  });
  assert.equal(errors.length, 1);
  assert.equal(errors[0].level, 'error');
  assert.equal(errors[0].message, 'Instagram needs a picture or a video.');
});
test('Lone # is not a hashtag', () => {
  // A lone "#" should not count as a hashtag
  const errors = checkPost('instagram', { 
    text: 'test #', 
    linkUrl: null, 
    media: [
      { kind: 'image', url: 'img.jpg', width: 800, height: 600 }
    ] 
  });
  assert.equal(errors.length, 0);
});

test('formatDuration wording matches the backend', () => {
  const m = (seconds) => checkPost('x', { text: 'Hi', linkUrl: null, media: [{ kind: 'video', duration_seconds: seconds }] }).map((p) => p.message);
  assert.deepEqual(m(200), ['Video must be 0.5 seconds to 140 seconds long; this one is 200 seconds.']);
  const li = checkPost('linkedin', { text: 'Hi', linkUrl: null, media: [{ kind: 'video', duration_seconds: 2 }] }).map((p) => p.message);
  assert.deepEqual(li, ['Video must be 3 seconds to 30 minutes long; this one is 2 seconds.']);
});
