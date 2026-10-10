import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GROUP_INFO,
  GROUP_ORDER,
  OPPORTUNITY_TABS,
  changeText,
  countFor,
  formatNumber,
  gainText,
  groupHelp,
  groupLabel,
  jobText,
  lengthNote,
  percentText,
  positionText,
  queueNotice,
  shortPath,
  sitemapLine,
  titleStatusLabel,
  trendSentence,
  weekBars,
} from '../searchInsights.js';

test('every state Google can give has a plain label and help, in the order shown', () => {
  assert.deepEqual([...GROUP_ORDER].sort(), Object.keys(GROUP_INFO).sort());
  for (const group of GROUP_ORDER) assert.ok(GROUP_INFO[group].label && GROUP_INFO[group].help.length > 20, group);
  assert.equal(groupLabel('waiting'), 'Seen, not added');
  assert.equal(groupLabel('nonsense'), 'nonsense');
});

test('a product page that Google has not added is pointed to Photos and text', () => {
  assert.match(groupHelp('waiting', 'product'), /Find photos and text/);
  assert.match(groupHelp('unknown', 'product'), /Find photos and text/);
  assert.doesNotMatch(groupHelp('waiting', 'brand'), /Find photos and text/);
  assert.equal(groupHelp('nonsense', 'product'), '');
});

test('there is a tab for each kind of opportunity and the counts show beside them', () => {
  assert.deepEqual(OPPORTUNITY_TABS.map((tab) => tab.key), ['striking', 'ctr', 'gaps', 'rising', 'falling']);
  assert.equal(countFor({ striking: 3 }, 'striking'), ' (3)');
  assert.equal(countFor({ striking: 3 }, 'gaps'), ' (0)');
  assert.equal(countFor(null, 'gaps'), '');
});

test('numbers read the way people say them', () => {
  assert.equal(formatNumber(22101), '22,101');
  assert.equal(formatNumber(null), '0');
  assert.equal(percentText(0.0143), '1.4%');
  assert.equal(percentText(0.5), '50%');
  assert.equal(percentText('x'), '—');
  assert.equal(positionText(7.234), '7.2');
  assert.equal(positionText(0), '—');
  assert.equal(positionText(null), '—');
});

test('a change is shown against the period before', () => {
  assert.equal(changeText(110, 100), '+10%');
  assert.equal(changeText(40, 100), '-60%');
  assert.equal(changeText(100, 100), '0%');
  assert.equal(changeText(5, 0), 'new');
  assert.equal(changeText(0, 0), '—');
});

test('the gain is said as clicks a month', () => {
  assert.equal(gainText(10), 'about 10 more clicks a month');
  assert.equal(gainText(2.6), 'about 2.6 more clicks a month');
  assert.equal(gainText(1), 'about 1 more click a month');
  assert.equal(gainText(0.2), 'under 1 more click a month');
  assert.equal(gainText(123.4), 'about 123 more clicks a month');
});

test('the weekly totals become bars for a chart', () => {
  const weeks = [{ week: '2026-10-05', clicks: 12, impressions: 884 }, { week: '2026-10-12', clicks: 3 }];
  assert.deepEqual(weekBars(weeks, 'clicks'), [{ date: '2026-10-05', clicks: 12 }, { date: '2026-10-12', clicks: 3 }]);
  assert.deepEqual(weekBars(weeks, 'impressions'), [{ date: '2026-10-05', impressions: 884 }, { date: '2026-10-12', impressions: 0 }]);
  assert.deepEqual(weekBars(null, 'clicks'), []);
});

test('the trend sentence says how far views have fallen from the best week', () => {
  const weeks = [
    { week: '2026-07-13', clicks: 153, impressions: 22101 },
    { week: '2026-07-20', clicks: 140, impressions: 16398 },
    { week: '2026-09-21', clicks: 13, impressions: 982 },
    { week: '2026-09-28', clicks: 11, impressions: 1287 },
    { week: '2026-10-05', clicks: 5, impressions: 400 },
  ];
  const got = trendSentence(weeks);
  assert.match(got, /22,101 times in the week of 13 Jul/);
  assert.match(got, /1,287 times in the week of 28 Sep/);
  assert.match(got, /94% fewer/);
});

test('the trend sentence is kind when views are at their best and quiet with too little data', () => {
  const good = [
    { week: '2026-09-14', clicks: 1, impressions: 100 },
    { week: '2026-09-21', clicks: 2, impressions: 400 },
    { week: '2026-09-28', clicks: 3, impressions: 420 },
    { week: '2026-10-05', clicks: 1, impressions: 10 },
  ];
  assert.match(trendSentence(good), /at or near its best/);
  assert.equal(trendSentence([{ week: '2026-10-05', impressions: 10 }]), '');
  assert.equal(trendSentence(null), '');
  assert.equal(trendSentence([{ week: 'a', impressions: 0 }, { week: 'b', impressions: 0 }, { week: 'c', impressions: 0 }]), '');
});

test('a background job is described by its state', () => {
  assert.match(jobText({ running: true }), /Working on it/);
  assert.equal(jobText({ error: 'Google could not be reached' }), 'The last attempt stopped: Google could not be reached');
  assert.equal(jobText({ last_at: null }), 'Not run yet.');
  assert.match(jobText({ last_at: '2026-10-10T01:00:00Z' }), /^Updated .+\.$/);
  assert.match(jobText({ last_at: '2026-10-10T01:00:00Z' }, 'Checked'), /^Checked /);
  assert.equal(jobText(null), '');
});

test('a title and a description are measured against what Google shows', () => {
  assert.deepEqual(lengthNote('abc', 60), { length: 3, tooLong: false, text: '3 of about 60 characters' });
  assert.equal(lengthNote('x'.repeat(70), 60).tooLong, true);
  assert.equal(lengthNote(null, 60).length, 0);
});

test('a title is labelled by whether it is live or waiting', () => {
  assert.equal(titleStatusLabel('active'), 'Title live');
  assert.equal(titleStatusLabel('proposed'), 'Suggestion waiting');
  assert.equal(titleStatusLabel(null), '');
});

test('sending pages to Photos and text says how many were queued', () => {
  assert.equal(queueNotice({ queued: 3, already: 1, ready: 2, not_products: 1 }),
    "3 products are being looked up on the manufacturers' websites. 1 was already waiting. 2 already have a photo and description. 1 page is not a product page.");
  assert.equal(queueNotice({ queued: 1 }), "1 product is being looked up on the manufacturers' websites.");
  assert.equal(queueNotice({}), 'Nothing to look up.');
});

test('a sitemap is described in one line', () => {
  assert.equal(
    sitemapLine({ submitted: 1304, errors: 0, warnings: 0, last_downloaded: null }),
    '1,304 addresses listed',
  );
  assert.match(sitemapLine({ submitted: 3006, errors: 1, warnings: 2, last_downloaded: '2026-10-07T17:35:00Z' }), /^3,006 addresses listed, read by Google .+, 1 error, 2 warnings$/);
});

test('a long address is cut to fit', () => {
  assert.equal(shortPath('/store/cctv'), '/store/cctv');
  assert.equal(shortPath('/store/product/' + 'a'.repeat(100), 20), '/store/product/aaaa…');
  assert.equal(shortPath(null), '');
});
