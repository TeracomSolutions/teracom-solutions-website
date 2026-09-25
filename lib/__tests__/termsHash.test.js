import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import {
  TERMS_CONTENT_SHA256,
  termsAcceptanceRecord,
  termsParts,
  termsPreamble,
  termsVersionHistory,
} from '../termsDocument.js';

/**
 * The same canonical form scripts/terms/build_terms.py hashes: keys sorted,
 * no whitespace, characters left as-is. Reimplemented here on purpose --
 * recomputing the fingerprint with independent code is the only way this
 * test can catch a document that was edited without being regenerated.
 */
function canonical(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
}

test('the document fingerprint matches the document it claims to describe', () => {
  // Without this, the fingerprint is just a string sitting next to the text,
  // and a hand-edit to the generated module would sail past every check --
  // including the rule that a published version cannot change its wording.
  const hash = createHash('sha256')
    .update(
      canonical({
        annexure: termsAcceptanceRecord,
        history: termsVersionHistory,
        parts: termsParts,
        preamble: termsPreamble,
      }),
      'utf8'
    )
    .digest('hex');

  assert.equal(
    hash,
    TERMS_CONTENT_SHA256,
    'lib/termsDocument.js has been edited by hand. Regenerate it with ' +
      'scripts/terms/build_terms.py from the source document instead; if the wording ' +
      'really did change and the version is already published, bump the version.'
  );
});
