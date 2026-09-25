import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ACCEPTANCE_CONTEXTS,
  TERMS_EFFECTIVE_DATE,
  TERMS_VERSION_PATH,
  acceptanceLabel,
  documentsForContext,
  findTermsDocument,
  termsRegistry,
} from '../termsRegistry.js';
import { TERMS_CONTENT_SHA256, TERMS_VERSION, termsParts } from '../termsDocument.js';

test('every registry entry is complete enough to write an acceptance row', () => {
  for (const doc of termsRegistry) {
    assert.match(doc.key, /^[a-z0-9_]+$/);
    assert.ok(doc.title);
    assert.equal(doc.version, TERMS_VERSION);
    assert.equal(doc.effectiveDate, TERMS_EFFECTIVE_DATE);
    assert.equal(doc.contentHash, TERMS_CONTENT_SHA256);
    assert.ok(doc.sourceFile.endsWith('.docx'));
    assert.ok(doc.url.startsWith(TERMS_VERSION_PATH), `${doc.key} does not point at the versioned URL`);
  }
});

test('records point at the versioned URL, never at /terms', () => {
  // /terms is whatever the terms happen to be today. A record that resolves
  // to today's wording proves nothing about what was accepted last year.
  assert.equal(TERMS_VERSION_PATH, `/terms/v${TERMS_VERSION}`);
  for (const doc of termsRegistry) {
    assert.ok(!/^\/terms(#|$)/.test(doc.url), `${doc.key} points at the moving URL`);
  }
});

test('every registry anchor exists in the document', () => {
  const ids = new Set([
    ...termsParts.map((part) => part.id),
    ...termsParts.flatMap((part) => part.sections.map((section) => section.id)),
  ]);
  for (const doc of termsRegistry) {
    if (!doc.anchor) continue;
    assert.ok(ids.has(doc.anchor), `registry anchor #${doc.anchor} is not in the document`);
    // Dotless form, confirmed permanent.
    assert.ok(!doc.anchor.includes('.'), `${doc.anchor} contains a dot`);
  }
});

test('the effective date in the registry matches the document', () => {
  assert.equal(TERMS_EFFECTIVE_DATE, '2026-10-01');
  assert.equal(termsRegistry[0].effectiveLabel, '1 October 2026');
});

test('each acceptance context names the documents that context accepts', () => {
  // One row per document, not one per submission: a monitoring application
  // accepts the general terms and Schedule 3, and both have to be recorded.
  assert.deepEqual(documentsForContext('monitoring_application').map((d) => d.key), ['terms', 'schedule_3']);
  assert.deepEqual(documentsForContext('ai_subscription').map((d) => d.key), ['terms', 'schedule_4', 'aup']);
  assert.deepEqual(documentsForContext('checkout').map((d) => d.key), ['terms', 'schedule_1']);
  assert.deepEqual(documentsForContext('nonsense'), []);

  for (const [context, keys] of Object.entries(ACCEPTANCE_CONTEXTS)) {
    for (const key of keys) {
      assert.ok(findTermsDocument(key), `${context} names unknown document "${key}"`);
    }
  }
});

test('the checkbox label names a version and links to the versioned document', () => {
  const label = acceptanceLabel('monitoring_application');
  assert.ok(label.lead.includes(`v${TERMS_VERSION}`), 'the label must state the version accepted');
  assert.ok(label.url.startsWith(`/terms/v${TERMS_VERSION}`));
  assert.deepEqual(
    label.also.map((doc) => doc.url),
    [`/terms/v${TERMS_VERSION}#schedule-3`]
  );
  assert.equal(acceptanceLabel('nonsense'), null);
});

test('nothing hard-codes a version string', () => {
  // The whole point of the registry: bump the version once and every label,
  // link and stored record follows.
  for (const doc of termsRegistry) {
    assert.ok(!/\bv?3\.0\b/.test(doc.title), `${doc.key} bakes a version into its title`);
  }
});
