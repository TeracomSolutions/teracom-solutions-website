import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STATUS_LABELS,
  confidenceText,
  contentStatusLabel,
  foundText,
  manualNotice,
  publishNotice,
  queueNotice,
  tabLabel,
} from '../content.js';

test('the tab shows how many products need a look', () => {
  assert.equal(tabLabel(0), 'Photos & text');
  assert.equal(tabLabel(12), 'Photos & text (12)');
});

test('a Catalog row says where a product stands only when there is something to say', () => {
  assert.equal(contentStatusLabel('queued'), 'Finding photo…');
  assert.equal(contentStatusLabel('working'), 'Finding photo…');
  assert.equal(contentStatusLabel('review'), 'Check photo');
  assert.equal(contentStatusLabel('not_found'), 'No photo found');
  assert.equal(contentStatusLabel('done'), '');
  assert.equal(contentStatusLabel(null), '');
  assert.equal(STATUS_LABELS.review, 'Check this one');
});

test('Go live says how many went live and how many are being looked up first', () => {
  assert.equal(publishNotice({ changed: 5, published: true, queued: 0, already_waiting: 0 }), '5 products went live.');
  assert.equal(publishNotice({ changed: 1 }), '1 product went live.');
  const mixed = publishNotice({ changed: 10, queued: 3, already_waiting: 2 });
  assert.ok(mixed.startsWith('10 products went live. 3 products have no photo or description yet, so they are not live.'));
  assert.ok(mixed.includes('each goes live as soon as it has both.'));
  assert.ok(mixed.endsWith('2 more were already being looked up.'));
  assert.ok(publishNotice({ changed: 0, queued: 1 }).startsWith('1 product has no photo or description yet, so it is not live. We are finding it'));
  assert.equal(publishNotice({}), 'Nothing changed.');
  assert.equal(publishNotice(null), 'Nothing changed.');
});

test('Take offline just says how many came off', () => {
  assert.equal(publishNotice({ changed: 4 }, false), '4 products taken off the website.');
  assert.equal(publishNotice({ changed: 1 }, false), '1 product taken off the website.');
  assert.equal(publishNotice({ changed: 0 }, false), 'Nothing changed.');
});

test('Find photos and text says what was started', () => {
  assert.equal(queueNotice({ queued: 3, already: 0, ready: 0 }), "3 products are being looked up on the manufacturers' websites.");
  assert.equal(queueNotice({ queued: 1, already: 1, ready: 2 }),
    "1 product is being looked up on the manufacturers' websites. 1 already was waiting. 2 already have a photo and description.");
  assert.equal(queueNotice({ queued: 0, already: 0, ready: 0 }), 'Nothing to look up.');
  assert.equal(queueNotice(undefined), 'Nothing to look up.');
});

test('a match says how sure it is', () => {
  assert.equal(confidenceText('high'), 'The part number is on this page.');
  assert.match(confidenceText('medium'), /check it is the right product/);
});

test('a row says what was found', () => {
  assert.equal(foundText(null), '');
  assert.equal(foundText({ image_url: 'https://x/a.webp', description: 'Words' }), 'Found a photo and a description.');
  assert.equal(foundText({ image_url: 'https://x/a.webp', description: null }), 'Found a photo.');
  assert.equal(foundText({ image_url: null, description: 'Words' }), 'Found a description.');
  assert.equal(foundText({ image_url: null, description: null }), 'Found a page, but no usable photo or text.');
});

test('the form says what it saved and what is still missing', () => {
  assert.equal(manualNotice({ photo: true, description: true, status: 'done', problems: [] }), 'Saved the photo and the description.');
  assert.equal(manualNotice({ photo: true, description: false, status: 'not_found', problems: [] }),
    'Saved the photo. It still needs a photo and a description before it can go live.');
  assert.equal(manualNotice({ photo: false, description: false, problems: ['That page could not be read.'] }), 'That page could not be read.');
  assert.equal(manualNotice({ photo: false, description: false, problems: [] }), 'Nothing usable was found.');
  assert.equal(manualNotice(null), 'Nothing usable was found.');
});
