import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildTermsFeed } from '../termsFeed.js';
import { ACCEPTANCE_CONTEXTS } from '../termsRegistry.js';
import { publishedTermsVersions } from '../termsPublished.js';

const feed = buildTermsFeed();
const anythingPublished = publishedTermsVersions.some((entry) => entry.published);

test('the feed fails closed while nothing is published', () => {
  // The platform writes acceptance rows from `documents`. If an unpublished
  // draft leaked into it, the platform could record someone accepting terms
  // that are not yet readable at the URL the record points at.
  assert.equal(feed.live, anythingPublished);
  if (!anythingPublished) {
    assert.equal(feed.current, null);
    assert.deepEqual(feed.documents, []);
  }
});

test('a draft is visible but kept separate from the live documents', () => {
  if (anythingPublished) return;
  assert.ok(feed.draft, 'the platform team needs something to build against');
  assert.equal(feed.draft.published, false);
  assert.ok(feed.draft.documents.length > 0);
  assert.match(feed.draft.contentHash, /^[0-9a-f]{64}$/);
});

test('every URL is absolute, so a stored record needs no site context', () => {
  const urls = [
    ...feed.versions.map((v) => v.url),
    ...feed.documents.map((d) => d.url),
    ...(feed.draft ? feed.draft.documents.map((d) => d.url) : []),
    ...(feed.current ? [feed.current.url] : []),
  ];
  assert.ok(urls.length > 0);
  for (const url of urls) {
    assert.match(url, /^https:\/\/[^/]+\/terms\/v\d+\.\d+/, `${url} is not an absolute versioned URL`);
  }
});

test('every document carries the fingerprint that proves what was shown', () => {
  const docs = [...feed.documents, ...(feed.draft ? feed.draft.documents : [])];
  for (const doc of docs) {
    assert.match(doc.contentHash, /^[0-9a-f]{64}$/, `${doc.key} has no usable fingerprint`);
    assert.ok(doc.version);
    assert.match(doc.effectiveDate, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('the contexts tell a consumer how many rows one submission writes', () => {
  assert.deepEqual(feed.contexts, ACCEPTANCE_CONTEXTS);
  assert.deepEqual(feed.contexts.monitoring_application, ['terms', 'schedule_3']);
  const keys = new Set([...feed.documents, ...(feed.draft ? feed.draft.documents : [])].map((d) => d.key));
  for (const [context, wanted] of Object.entries(feed.contexts)) {
    for (const key of wanted) {
      assert.ok(keys.has(key), `context ${context} names "${key}", which the feed does not describe`);
    }
  }
});

test('the feed carries no customer data', () => {
  // It says which version of a public document is current. Nothing else.
  const serialised = JSON.stringify(feed).toLowerCase();
  for (const term of ['@teracomsolutions.com.au', 'account_id', 'user_email', 'ip_address']) {
    assert.ok(!serialised.includes(term), `the feed leaks "${term}"`);
  }
});
