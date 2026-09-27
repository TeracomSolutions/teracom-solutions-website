import test from 'node:test';
import assert from 'node:assert/strict';

import { providerState, stateLabel, ringLayout, moveInList, workShare } from '../aiRouting.js';

// Test providerState function

test('providerState - disabled', () => {
  const info = { enabled: false };
  assert.strictEqual(providerState(info), 'off');
});

test('providerState - failing', () => {
  const info = { 
    enabled: true, 
    last_failed_at: '2023-01-01T10:00:00Z',
    last_ok_at: '2023-01-01T09:00:00Z'
  };
  assert.strictEqual(providerState(info), 'failing');
});

test('providerState - healthy', () => {
  const info = { 
    enabled: true, 
    last_ok_at: '2023-01-01T10:00:00Z'
  };
  assert.strictEqual(providerState(info), 'healthy');
});

test('providerState - unknown', () => {
  const info = { 
    enabled: true
  };
  assert.strictEqual(providerState(info), 'unknown');
});

// Test stateLabel function

test('stateLabel - healthy', () => {
  const info = {};
  assert.strictEqual(stateLabel('healthy', info), 'Responding');
});

test('stateLabel - off', () => {
  const info = {};
  assert.strictEqual(stateLabel('off', info), 'Disabled');
});

test('stateLabel - failing with credit error', () => {
  const info = { last_error_kind: 'credit' };
  assert.strictEqual(stateLabel('failing', info), 'Failing: out of credit');
});

test('stateLabel - failing with auth error', () => {
  const info = { last_error_kind: 'auth' };
  assert.strictEqual(stateLabel('failing', info), 'Failing: key rejected');
});

test('stateLabel - failing with rate_limit error', () => {
  const info = { last_error_kind: 'rate_limit' };
  assert.strictEqual(stateLabel('failing', info), 'Failing: rate limited');
});

test('stateLabel - failing with unreachable error', () => {
  const info = { last_error_kind: 'unreachable' };
  assert.strictEqual(stateLabel('failing', info), 'Failing: not reachable');
});

test('stateLabel - failing with model error', () => {
  const info = { last_error_kind: 'model' };
  assert.strictEqual(stateLabel('failing', info), 'Failing: model not available');
});

test('stateLabel - failing with default error', () => {
  const info = { last_error_kind: 'other_error' };
  assert.strictEqual(stateLabel('failing', info), 'Failing: other_error');
});

test('stateLabel - failing without error kind', () => {
  const info = {};
  assert.strictEqual(stateLabel('failing', info), 'Failing: last call failed');
});

// Test ringLayout function

test('ringLayout - 4 nodes around circle', () => {
  const points = ringLayout(4, 0, 0, 1);
  
  // Should have 4 points
  assert.strictEqual(points.length, 4);
  
  // Check that the positions are approximately correct
  // Top point (angle -90 degrees)
  assert.ok(Math.abs((points[0].x) - (0)) < 0.001, `${points[0].x} vs ${0}`);
  assert.ok(Math.abs((points[0].y) - (-1)) < 0.001, `${points[0].y} vs ${-1}`);
  
  // Right point (angle 0 degrees)
  assert.ok(Math.abs((points[1].x) - (1)) < 0.001, `${points[1].x} vs ${1}`);
  assert.ok(Math.abs((points[1].y) - (0)) < 0.001, `${points[1].y} vs ${0}`);
  
  // Bottom point (angle 90 degrees)
  assert.ok(Math.abs((points[2].x) - (0)) < 0.001, `${points[2].x} vs ${0}`);
  assert.ok(Math.abs((points[2].y) - (1)) < 0.001, `${points[2].y} vs ${1}`);
  
  // Left point (angle 180 degrees)
  assert.ok(Math.abs((points[3].x) - (-1)) < 0.001, `${points[3].x} vs ${-1}`);
  assert.ok(Math.abs((points[3].y) - (0)) < 0.001, `${points[3].y} vs ${0}`);
});

// Test moveInList function

test('moveInList - move up', () => {
  const list = ['a', 'b', 'c'];
  const result = moveInList(list, 'b', -1);
  assert.deepStrictEqual(result, ['b', 'a', 'c']);
});

test('moveInList - move down', () => {
  const list = ['a', 'b', 'c'];
  const result = moveInList(list, 'b', 1);
  assert.deepStrictEqual(result, ['a', 'c', 'b']);
});

test('moveInList - move up from start', () => {
  const list = ['a', 'b', 'c'];
  const result = moveInList(list, 'a', -1);
  assert.deepStrictEqual(result, ['a', 'b', 'c']); // No change
});

test('moveInList - move down from end', () => {
  const list = ['a', 'b', 'c'];
  const result = moveInList(list, 'c', 1);
  assert.deepStrictEqual(result, ['a', 'b', 'c']); // No change
});

// Test workShare function

test('workShare - find best provider for each flow type', () => {
  const providers = {
    'provider-a': {
      enabled: true,
      counts: {
        assistant: { ok: 5, failed: 2 },
        research: { ok: 3, failed: 1 },
        critique: { ok: 7, failed: 0 }
      }
    },
    'provider-b': {
      enabled: true,
      counts: {
        assistant: { ok: 8, failed: 1 },
        research: { ok: 2, failed: 3 },
        critique: { ok: 4, failed: 2 }
      }
    },
    'provider-c': {
      enabled: false,
      counts: {
        assistant: { ok: 1, failed: 0 },
        research: { ok: 1, failed: 0 },
        critique: { ok: 1, failed: 0 }
      }
    }
  };
  
  const result = workShare(providers);
  assert.strictEqual(result.assistant, 'provider-b');
  assert.strictEqual(result.research, 'provider-a');
  assert.strictEqual(result.critique, 'provider-a');
});

test('moveInList - unknown key leaves the list alone', () => {
  const list = ['a', 'b', 'c'];
  assert.strictEqual(moveInList(list, 'zzz', 1), list);
});
