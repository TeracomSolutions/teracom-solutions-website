import test from 'node:test';
import assert from 'node:assert/strict';
import { WEBSITE_VERSIONS, WEBSITE_VERSION } from '../websiteVersions.js';

// Test 1: WEBSITE_VERSION is the same object as WEBSITE_VERSIONS[0]
test('WEBSITE_VERSION is the same object as WEBSITE_VERSIONS[0]', () => {
  assert.strictEqual(WEBSITE_VERSION, WEBSITE_VERSIONS[0]);
});

// Test 2: Every entry properties
 test('Every entry has correct structure', () => {
  for (const entry of WEBSITE_VERSIONS) {
    // version matches /^[0-9]+\.[0-9]+\.[0-9]+$/
    assert.ok(/^[0-9]+\.[0-9]+\.[0-9]+$/.test(entry.version), `Invalid version format: ${entry.version}`);
    
    // date matches /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
    assert.ok(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(entry.date), `Invalid date format: ${entry.date}`);
    
    // notes is a non-empty array of non-empty strings
    assert.ok(Array.isArray(entry.notes), `Notes must be an array: ${entry.version}`);
    assert.ok(entry.notes.length > 0, `Notes array cannot be empty: ${entry.version}`);
    for (const note of entry.notes) {
      assert.ok(typeof note === 'string', `Note must be a string: ${entry.version}`);
      assert.ok(note.trim() !== '', `Note cannot be empty or whitespace only: ${entry.version}`);
    }
  }
});

// Test 3: Newest first
 test('Entries are ordered newest first', () => {
  for (let i = 0; i < WEBSITE_VERSIONS.length - 1; i++) {
    const current = WEBSITE_VERSIONS[i];
    const next = WEBSITE_VERSIONS[i + 1];
    
    // Compare versions as numbers
    const [currentMajor, currentMinor, currentPatch] = current.version.split('.').map(Number);
    const [nextMajor, nextMinor, nextPatch] = next.version.split('.').map(Number);
    
    assert.ok(
      (currentMajor > nextMajor) ||
      (currentMajor === nextMajor && currentMinor > nextMinor) ||
      (currentMajor === nextMajor && currentMinor === nextMinor && currentPatch >= nextPatch),
      `Versions not in descending order: ${current.version} should be before ${next.version}`
    );
    
    // Compare dates as strings
    assert.ok(current.date >= next.date, `Dates not in descending order: ${current.date} should be before ${next.date}`);
  }
});

// Test 4: History is kept
 test('History is kept (at least 51 entries)', () => {
  assert.ok(WEBSITE_VERSIONS.length >= 51, `Expected at least 51 versions, got ${WEBSITE_VERSIONS.length}`);
});

// Test 5: No note mentions a pull request number
 test('No note mentions a pull request number', () => {
  for (const entry of WEBSITE_VERSIONS) {
    for (const note of entry.notes) {
      assert.ok(!/#\d+/.test(note), `Note contains PR number: ${note} in version ${entry.version}`);
    }
  }
});

// Test 6: Console releases are not repeated here
 test('Console releases are not repeated here', () => {
  for (const entry of WEBSITE_VERSIONS) {
    for (const note of entry.notes) {
      assert.ok(!/^Console \d/.test(note), `Note starts with Console release: ${note} in version ${entry.version}`);
    }
  }
});
