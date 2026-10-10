import test from 'node:test';
import assert from 'node:assert/strict';

import { checkNotice, needsTitle, siteLine, sortIssues, speedText, suggestNotice } from '../siteHealth.js';

test('a load time reads in milliseconds or seconds', () => {
  assert.equal(speedText(124), '124 ms');
  assert.equal(speedText(999.6), '1.0 s');
  assert.equal(speedText(1500), '1.5 s');
  assert.equal(speedText(6103), '6.1 s');
  assert.equal(speedText(0), '—');
  assert.equal(speedText(null), '—');
  assert.equal(speedText('x'), '—');
});

test('title and description problems are the ones the Titles tab fixes', () => {
  assert.equal(needsTitle([{ code: 'slow' }, { code: 'title_long' }]), true);
  assert.equal(needsTitle([{ code: 'description_duplicate' }]), true);
  assert.equal(needsTitle([{ code: 'slow' }, { code: 'no_h1' }]), false);
  assert.equal(needsTitle([]), false);
  assert.equal(needsTitle(undefined), false);
});

test('the worst problems of a page come first', () => {
  const sorted = sortIssues([
    { code: 'noindex', severity: 'note' },
    { code: 'slow', severity: 'warning' },
    { code: 'broken_link', severity: 'problem' },
  ]);
  assert.deepEqual(sorted.map((issue) => issue.code), ['broken_link', 'slow', 'noindex']);
  assert.deepEqual(sortIssues(undefined), []);
});

test('the whole-site line says what answers and how fast pages are', () => {
  assert.equal(
    siteLine({ robots_ok: true, sitemap_ok: true, sitemap_pages: 2992, median_ms: 124, p95_ms: 4373 }),
    'robots.txt and the sitemap answer, and the sitemap lists 2,992 pages. A typical page loads in 124 ms; 95 in 100 load within 4.4 s.',
  );
  assert.match(siteLine({ robots_ok: false, sitemap_ok: true }), /^robots.txt does not answer\./);
  assert.match(siteLine({ robots_ok: true, sitemap_ok: false }), /The sitemap does not answer\./);
  assert.equal(siteLine(null), '');
  assert.equal(siteLine('x'), '');
});

test('the notices say what happened', () => {
  assert.match(checkNotice({ started: true }), /about ten minutes/);
  assert.equal(checkNotice({ started: false, detail: 'A check is already running.' }), 'A check is already running.');
  assert.equal(checkNotice(null), 'Nothing started.');
  assert.match(suggestNotice('/store/cctv'), /\/store\/cctv .* Titles tab/);
});
