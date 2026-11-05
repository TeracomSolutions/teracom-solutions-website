import test from 'node:test';
import assert from 'node:assert/strict';

import { formatElapsed, isRunning, progressView } from '../checkProgress.js';

const start = '2026-11-05T00:00:00Z';
const t0 = Date.parse(start);

test('formatElapsed', () => {
  assert.equal(formatElapsed(0), '0 s');
  assert.equal(formatElapsed(59.9), '59 s');
  assert.equal(formatElapsed(125), '2 min 5 s');
  assert.equal(formatElapsed(-4), '0 s');
});

test('isRunning', () => {
  assert.equal(isRunning({ status: 'running' }), true);
  assert.equal(isRunning({ status: 'ok' }), false);
  assert.equal(isRunning(null), false);
});

test('reading pages', () => {
  assert.deepEqual(
    progressView({ status: 'running', phase: 'reading', progress_done: 30, progress_total: 60, started_at: start }, t0 + 15000),
    { percent: 25, label: 'Reading pages: 30 of up to 60', detail: '15 s so far · about 2 pages a second' },
  );
});

test('downloading documents', () => {
  assert.deepEqual(
    progressView({ status: 'running', phase: 'downloading', progress_done: 10, progress_total: 40, started_at: start }, t0 + 100000),
    { percent: 63, label: 'Downloading documents: 10 of 40', detail: '1 min 40 s so far · about 10 seconds a document' },
  );
});

test('just started', () => {
  assert.deepEqual(
    progressView({ status: 'running', phase: 'reading', progress_done: 0, progress_total: 60, started_at: start }, t0 + 3000),
    { percent: 0, label: 'Starting…', detail: '3 s so far' },
  );
});

test('finished, failed and nothing', () => {
  assert.deepEqual(progressView({ status: 'ok' }, 0), { percent: 100, label: 'Finished', detail: '' });
  assert.deepEqual(progressView({ status: 'failed' }, 0), { percent: 100, label: 'Failed', detail: '' });
  assert.equal(progressView(null, 0), null);
});

test('never over 100 and no start time', () => {
  const view = progressView({ status: 'running', phase: 'downloading', progress_done: 50, progress_total: 40 }, t0);
  assert.equal(view.percent, 100);
  assert.equal(view.detail, '');
});
