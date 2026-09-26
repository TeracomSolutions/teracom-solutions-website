import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deviceFromUserAgent,
  isBot,
  isTrackablePath,
  referrerHost,
  sydneyDay,
  visitorHash,
} from '../visitTracking.js';

test('only public pages are trackable', () => {
  assert.equal(isTrackablePath('/'), true);
  assert.equal(isTrackablePath('/store/product/sample-reader'), true);
  assert.equal(isTrackablePath('/admin/scout'), false);
  assert.equal(isTrackablePath('/api/track'), false);
  assert.equal(isTrackablePath('/_next/static/x.js'), false);
  assert.equal(isTrackablePath('/logo.png'), false);
  assert.equal(isTrackablePath('not-a-path'), false);
});

test('bots and empty agents are ignored', () => {
  assert.equal(isBot(''), true);
  assert.equal(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)'), true);
  assert.equal(isBot('vercel-screenshot/1.0'), true);
  assert.equal(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0'), false);
});

test('device is read from the user agent', () => {
  assert.equal(deviceFromUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148'), 'mobile');
  assert.equal(deviceFromUserAgent('Mozilla/5.0 (iPad; CPU OS 17_0)'), 'tablet');
  assert.equal(deviceFromUserAgent('Mozilla/5.0 (Windows NT 10.0) Chrome/130.0'), 'desktop');
});

test('referrer keeps only the host and drops our own pages', () => {
  assert.equal(referrerHost('https://www.google.com/search?q=teracom', 'www.teracomsolutions.com.au'), 'google.com');
  assert.equal(referrerHost('https://www.teracomsolutions.com.au/store', 'www.teracomsolutions.com.au'), null);
  assert.equal(referrerHost('', 'www.teracomsolutions.com.au'), null);
  assert.equal(referrerHost('garbage', 'www.teracomsolutions.com.au'), null);
});

test('visitor hash is stable within a day and changes across days', () => {
  const base = { ip: '203.0.113.9', userAgent: 'UA', salt: 's' };
  const a = visitorHash({ ...base, day: '2026-09-26' });
  const b = visitorHash({ ...base, day: '2026-09-26' });
  const c = visitorHash({ ...base, day: '2026-09-27' });
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(a.length, 64);
  assert.ok(!a.includes('203.0.113.9'));
});

test('sydneyDay rolls over at 14:00 UTC', () => {
  assert.equal(sydneyDay(new Date('2026-09-26T13:59:00Z')), '2026-09-26');
  assert.equal(sydneyDay(new Date('2026-09-26T14:00:00Z')), '2026-09-27');
});
