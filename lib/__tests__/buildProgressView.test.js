import assert from 'node:assert/strict';
import test from 'node:test';

import {
  clampPercent,
  formatAge,
  formatDuration,
  formatTokens,
  gpuLine,
  groupItems,
  jobTone,
  snapshotWarning,
  stageSteps,
} from '../buildProgressView.js';

test('formatAge says how long ago in plain words', () => {
  assert.equal(formatAge(null), 'never');
  assert.equal(formatAge(0), 'just now');
  assert.equal(formatAge(1), '1 minute ago');
  assert.equal(formatAge(45), '45 minutes ago');
  assert.equal(formatAge(180), '3 hours ago');
  assert.equal(formatAge(60 * 72), '3 days ago');
});

test('snapshotWarning warns when nothing has arrived or it is older than 30 minutes', () => {
  assert.match(snapshotWarning('factory', null), /No factory snapshot/);
  assert.equal(snapshotWarning('factory', { age_minutes: 12, stale: false }), '');
  assert.match(snapshotWarning('factory', { age_minutes: 45, stale: true }), /45 minutes ago/);
});

test('formatDuration, formatTokens and clampPercent', () => {
  assert.equal(formatDuration(42), '42s');
  assert.equal(formatDuration(200), '3m 20s');
  assert.equal(formatDuration(3900), '1h 05m');
  assert.equal(formatDuration(null), '-');
  assert.equal(formatTokens(950), '950');
  assert.equal(formatTokens(12345), '12.3k');
  assert.equal(formatTokens(2500000), '2.5M');
  assert.equal(clampPercent(140), 100);
  assert.equal(clampPercent(-5), 0);
  assert.equal(clampPercent('x'), null);
});

test('groupItems keeps the group order and drops empty groups; stageSteps marks the current step', () => {
  const groups = groupItems([
    { id: 'a', group: 'After that' },
    { id: 'b', group: 'Today' },
    { id: 'c', group: 'Today' },
  ]);
  assert.deepEqual(groups.map((g) => g.name), ['Today', 'After that']);
  assert.equal(groups[0].items.length, 2);
  const steps = stageSteps(2);
  assert.deepEqual(steps.map((s) => [s.label, s.done, s.current]), [
    ['Planned', true, false],
    ['Being built', true, false],
    ['In tests', false, true],
    ['Merged', false, false],
    ['Live', false, false],
  ]);
});

test('jobTone and gpuLine', () => {
  assert.equal(jobTone('running'), 'busy');
  assert.equal(jobTone('CHECK_OK'), 'ok');
  assert.equal(jobTone('failed'), 'bad');
  assert.equal(jobTone('pending'), 'wait');
  assert.equal(gpuLine(null), 'GPU: no reading yet');
  assert.equal(gpuLine({ util_pct: 80, mem_used_mib: 20480, mem_total_mib: 24576, models: ['qwen'] }), 'GPU: 80% busy, 20 of 24 GB memory, model loaded: qwen');
});
