import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  findPublishedVersion,
  isPublished,
  publishedTermsVersions,
} from '../termsPublished.js';
import { TERMS_CONTENT_SHA256, TERMS_EFFECTIVE, TERMS_SOURCE_FILE, TERMS_VERSION } from '../termsDocument.js';
import { TERMS_EFFECTIVE_DATE } from '../termsRegistry.js';

test('a published version can never change its wording without changing its number', () => {
  // Robert, 2026-09-23: once published, any change bumps the version. This is
  // the test that makes that real. If it fails, the document was amended
  // while keeping its version number -- fix it by bumping the version in the
  // source document and regenerating, NOT by editing the hash below.
  const entry = findPublishedVersion(TERMS_VERSION);
  if (!entry || !entry.published) return;

  assert.equal(
    TERMS_CONTENT_SHA256,
    entry.contentHash,
    `Terms v${TERMS_VERSION} is published, but the document no longer matches what was published. ` +
      'Bump the version in the source document and regenerate; do not edit the recorded hash.'
  );
  assert.equal(TERMS_EFFECTIVE_DATE, entry.effectiveDate);
  assert.equal(TERMS_SOURCE_FILE, entry.sourceFile);
});

test('the current document has an entry, published or not', () => {
  const entry = findPublishedVersion(TERMS_VERSION);
  assert.ok(entry, `no entry for v${TERMS_VERSION} -- add one before publishing`);
  assert.equal(entry.effectiveDate, TERMS_EFFECTIVE_DATE);
  assert.ok(TERMS_EFFECTIVE.includes('2026'));
});

test('every recorded version is well formed and unique', () => {
  const versions = publishedTermsVersions.map((entry) => entry.version);
  assert.equal(new Set(versions).size, versions.length, 'duplicate version entry');

  for (const entry of publishedTermsVersions) {
    assert.match(entry.version, /^\d+\.\d+$/);
    assert.match(entry.effectiveDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(entry.contentHash, /^[0-9a-f]{64}$/, `${entry.version} has no usable fingerprint`);
    assert.ok(entry.sourceFile.endsWith('.docx'));
    assert.ok(
      entry.sourceFile.includes(`v${entry.version}`),
      `${entry.sourceFile} does not name version ${entry.version}`
    );
    // A published entry has to say when, or "published" is just a boolean
    // nobody can date.
    if (entry.published) {
      assert.ok(entry.publishedAt, `v${entry.version} is published but has no publishedAt date`);
      assert.match(entry.publishedAt, /^\d{4}-\d{2}-\d{2}/);
    }
  }
});

test('isPublished reflects the flag rather than guessing', () => {
  // Nothing should infer "published" from an effective date having passed:
  // the date can arrive while the page is still a draft, which is exactly
  // the situation today.
  assert.equal(isPublished(TERMS_VERSION), findPublishedVersion(TERMS_VERSION).published);
  assert.equal(isPublished('9.9'), false);
  assert.equal(findPublishedVersion('9.9'), null);
});
