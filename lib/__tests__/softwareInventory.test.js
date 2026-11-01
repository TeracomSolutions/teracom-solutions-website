import { test } from 'node:test';
import assert from 'node:assert/strict';

import { baseVersion, isNewer, statusOf, summaryOf } from '../softwareInventory.js';

test('base version of a range', () => {
  assert.equal(baseVersion('^6.11.0'), '6.11.0');
  assert.equal(baseVersion('15.5.28'), '15.5.28');
  assert.equal(baseVersion('22.x'), null);
  assert.equal(baseVersion(''), null);
});

test('newer compares major, minor and patch', () => {
  assert.equal(isNewer('15.6.0', '15.5.28'), true);
  assert.equal(isNewer('15.5.28', '15.5.28'), false);
  assert.equal(isNewer('2.0.0', '10.0.0'), false);
  assert.equal(isNewer(null, '1.0.0'), false);
});

test('status order matches the backend', () => {
  assert.equal(statusOf({ kind: 'package', running: '1.0.0', latest: '1.0.0', advisories: ['GHSA-1'] }), 'advisory');
  assert.equal(statusOf({ kind: 'package', running: '1.0.0', latest: '1.1.0', advisories: [] }), 'update');
  assert.equal(statusOf({ kind: 'package', running: '1.1.0', latest: '1.1.0', advisories: [] }), 'current');
  assert.equal(statusOf({ kind: 'package', running: '1.1.0', latest: null, advisories: [] }), 'unknown');
  assert.equal(statusOf({ kind: 'system', running: 'v22.1.0', latest: null, advisories: [] }), 'current');
});

test('summary counts', () => {
  assert.deepEqual(summaryOf([{ status: 'current' }, { status: 'update' }, { status: 'update' }]), { current: 1, update: 2, advisory: 0, unknown: 0 });
});
