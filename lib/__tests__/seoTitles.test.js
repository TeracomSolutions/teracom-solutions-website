import test from 'node:test';
import assert from 'node:assert/strict';

process.env.BACKEND_API_URL = 'https://backend.test';
process.env.WEBSITE_FRONTEND_SERVICE_TOKEN = 'service-secret';

const { applyTitle, loadTitles, withSeoTitle } = await import('../seoTitles.js');

const BASE = {
  title: 'Old title | Teracom',
  description: 'Old description.',
  alternates: { canonical: 'https://www.example.com.au/store/cctv' },
  openGraph: { title: 'Old title | Teracom', description: 'Old description.', url: 'https://www.example.com.au/store/cctv' },
  twitter: { card: 'summary_large_image', title: 'Old title | Teracom' },
};

test('an approved title and description replace the page ones, everywhere they appear', () => {
  const got = applyTitle(BASE, { title: 'CCTV Cameras | Teracom Solutions', description: 'New description here.' });
  assert.equal(got.title, 'CCTV Cameras | Teracom Solutions');
  assert.equal(got.description, 'New description here.');
  assert.equal(got.openGraph.title, 'CCTV Cameras | Teracom Solutions');
  assert.equal(got.openGraph.description, 'New description here.');
  assert.equal(got.openGraph.url, BASE.openGraph.url);
  assert.equal(got.twitter.title, 'CCTV Cameras | Teracom Solutions');
  assert.equal(got.twitter.card, 'summary_large_image');
  assert.deepEqual(got.alternates, BASE.alternates);
});

test('an approved title with no description leaves the description alone', () => {
  const got = applyTitle(BASE, { title: 'CCTV Cameras | Teracom Solutions', description: null });
  assert.equal(got.description, 'Old description.');
  assert.equal(got.openGraph.description, 'Old description.');
});

test('with nothing approved the metadata is exactly what it was', () => {
  assert.equal(applyTitle(BASE, undefined), BASE);
  assert.equal(applyTitle(BASE, { title: '', description: 'x' }), BASE);
});

test('a page with no metadata of its own can still be given a title', () => {
  assert.deepEqual(applyTitle({}, { title: 'Home | Teracom', description: 'A line.' }), {
    title: 'Home | Teracom',
    description: 'A line.',
    openGraph: { title: 'Home | Teracom', description: 'A line.' },
    twitter: { title: 'Home | Teracom', description: 'A line.' },
  });
});

test('an address is looked up the way the backend keeps it', async () => {
  const load = async () => ({ '/store/cctv': { title: 'CCTV Cameras | Teracom Solutions', description: null } });
  assert.equal((await withSeoTitle(BASE, '/Store/CCTV/', load)).title, 'CCTV Cameras | Teracom Solutions');
  assert.equal((await withSeoTitle(BASE, '/store/cctv?x=1', load)).title, 'CCTV Cameras | Teracom Solutions');
  assert.equal(await withSeoTitle(BASE, '/store/networking', load), BASE);
});

test('the list is fetched with the service token, kept for five minutes, and kept when the backend is down', async () => {
  const seen = [];
  const original = globalThis.fetch;
  let broken = false;
  globalThis.fetch = async (url, options) => {
    seen.push({ url: String(url), token: options.headers['X-Internal-Service-Token'] });
    if (broken) return { ok: false, status: 500 };
    return { ok: true, json: async () => ({ titles: { '/a': { title: 'A title here', description: null } } }) };
  };
  try {
    const start = 10_000_000_000_000;
    assert.deepEqual(await loadTitles(start), { '/a': { title: 'A title here', description: null } });
    assert.equal(seen.length, 1);
    assert.equal(seen[0].url, 'https://backend.test/internal/seo/titles');
    assert.equal(seen[0].token, 'service-secret');
    await loadTitles(start + 4 * 60 * 1000);
    assert.equal(seen.length, 1);
    broken = true;
    const later = start + 5 * 60 * 1000 + 1;
    assert.deepEqual(await loadTitles(later), { '/a': { title: 'A title here', description: null } });
    assert.equal(seen.length, 2);
    await loadTitles(later + 10 * 1000);
    assert.equal(seen.length, 2);
    await loadTitles(later + 31 * 1000);
    assert.equal(seen.length, 3);
  } finally {
    globalThis.fetch = original;
  }
});
