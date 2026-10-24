import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { CONSOLE_VERSIONS, CONSOLE_VERSION } from '../consoleVersions.js';

// Test 1: CONSOLE_VERSION is the same object as CONSOLE_VERSIONS[0]
test('CONSOLE_VERSION is the same object as CONSOLE_VERSIONS[0]', () => {
  assert.equal(CONSOLE_VERSION, CONSOLE_VERSIONS[0]);
});

// Test 2: every entry has a version matching /^[0-9]+[.][0-9]+[.][0-9]+$/, a date matching /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, and a notes array with at least one non-empty string; no two entries share a version

test('every entry has correct format and unique versions', () => {
  const seenVersions = new Set();

  for (const entry of CONSOLE_VERSIONS) {
    // Check version format
    assert.ok(/^[0-9]+\.[0-9]+\.[0-9]+$/.test(entry.version), `Version ${entry.version} does not match expected format`);

    // Check date format
    assert.ok(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(entry.date), `Date ${entry.date} does not match expected format`);

    // Check notes array
    assert.ok(Array.isArray(entry.notes), 'Notes must be an array');
    assert.ok(entry.notes.length > 0, 'Notes array must have at least one entry');
    assert.ok(entry.notes.every(note => typeof note === 'string' && note.trim() !== ''), 'All notes must be non-empty strings');

    // Check unique version
    assert.ok(!seenVersions.has(entry.version), `Duplicate version ${entry.version} found`);
    seenVersions.add(entry.version);
  }
});

// Test 3: the list is newest first

test('the list is newest first', () => {
  const parts = (v) => v.split('.').map(Number);

  const compare = (a, b) => {
    const aParts = parts(a.version);
    const bParts = parts(b.version);

    for (let i = 0; i < 3; i++) {
      if (aParts[i] > bParts[i]) return -1; // a is newer
      if (aParts[i] < bParts[i]) return 1;  // b is newer
    }
    return 0;
  };

  for (let i = 0; i < CONSOLE_VERSIONS.length - 1; i++) {
    const current = CONSOLE_VERSIONS[i];
    const next = CONSOLE_VERSIONS[i + 1];

    // Check version order
    assert.ok(compare(current, next) <= 0, `Version ${current.version} should be newer or equal to ${next.version}`);

    // Check date order (dates should be non-decreasing)
    assert.ok(current.date >= next.date, `Date ${current.date} should be greater than or equal to ${next.date}`);
  }
});
