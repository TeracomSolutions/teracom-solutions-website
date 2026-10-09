import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CONFIDENCE_LABELS,
  VIEWS,
  confidenceLabel,
  countFor,
  decideNotice,
  shownText,
  startNotice,
  syncNotice,
  validTarget,
} from '../searchPage.js';

test('the tabs and how sure each kind of guess is', () => {
  assert.deepEqual(VIEWS.map((view) => view.key), ['proposed', 'active', 'rejected']);
  assert.equal(confidenceLabel('exact'), 'Sure');
  assert.equal(confidenceLabel('weak'), 'General page');
  assert.equal(confidenceLabel('nonsense'), '');
  assert.equal(Object.keys(CONFIDENCE_LABELS).length, 5);
});

test('the number beside a tab is how many redirects are in it', () => {
  assert.equal(countFor({ proposed: 311, active: 0 }, 'proposed'), ' (311)');
  assert.equal(countFor({ proposed: 311 }, 'rejected'), ' (0)');
  assert.equal(countFor(null, 'proposed'), '');
});

test('a row says how often Google showed the old address', () => {
  assert.equal(shownText({ impressions: 1, clicks: 1 }), '1 view, 1 click');
  assert.equal(shownText({ impressions: 782, clicks: 12 }), '782 views, 12 clicks');
  assert.equal(shownText({}), '0 views, 0 clicks');
});

test('a new address has to be a page on this site', () => {
  assert.ok(validTarget(' /store/cctv '));
  assert.ok(!validTarget('https://evil.example'));
  assert.ok(!validTarget('store/cctv'));
  assert.ok(!validTarget(''));
  assert.ok(!validTarget(null));
});

test('the line about the last search says what happened', () => {
  assert.equal(syncNotice(null), '');
  assert.match(syncNotice({ running: true }), /Searching now/);
  assert.equal(syncNotice({ error: 'Google could not be reached' }), 'The last search stopped: Google could not be reached');
  assert.equal(syncNotice({ last_sync_at: null }), 'No search has run yet.');
  const done = syncNotice({ last_sync_at: '2026-10-09T03:00:00Z', summary: { pages: 981, dead: 616 } });
  assert.match(done, /^Last search .+: Google showed 981 pages and 616 of them no longer exist on the website.$/);
  assert.match(syncNotice({ last_sync_at: '2026-10-09T03:00:00Z', summary: { pages: 1, dead: 0 } }), /Google showed 1 page and 0 of them/);
});

test('Search now says it started, or why it did not', () => {
  assert.match(startNotice({ started: true }), /^Search started/);
  assert.equal(startNotice({ started: false, detail: 'A search is already running.' }), 'A search is already running.');
  assert.equal(startNotice({}), 'Nothing started.');
});

test('a yes or a no says how many', () => {
  assert.equal(decideNotice(1, 'approve'), '1 redirect turned on.');
  assert.equal(decideNotice(12, 'reject'), '12 redirects set aside.');
  assert.equal(decideNotice(undefined, 'reject'), '0 redirects set aside.');
});
