import test from 'node:test';
import assert from 'node:assert/strict';

import { latestRun, lastCompleted, anyRunning, runLabel } from '../scoutRunSummary.js';

// Test latestRun function

function testLatestRun() {
  // Empty array
  assert.strictEqual(latestRun([]), undefined);
  
  // Single run
  const singleRun = [{ id: 1, created_at: '2023-01-01T00:00:00Z' }];
  assert.deepStrictEqual(latestRun(singleRun), singleRun[0]);
  
  // Multiple runs - latest first
  const runs = [
    { id: 1, created_at: '2023-01-01T00:00:00Z' },
    { id: 2, created_at: '2023-01-02T00:00:00Z' },
    { id: 3, created_at: '2023-01-01T00:00:00Z' }
  ];
  assert.deepStrictEqual(latestRun(runs), runs[1]); // Second run has latest date
  
  // Multiple runs - latest last
  const runs2 = [
    { id: 1, created_at: '2023-01-01T00:00:00Z' },
    { id: 2, created_at: '2023-01-01T00:00:00Z' },
    { id: 3, created_at: '2023-01-02T00:00:00Z' }
  ];
  assert.deepStrictEqual(latestRun(runs2), runs2[2]); // Third run has latest date
}

// Test lastCompleted function

function testLastCompleted() {
  // No runs
  assert.strictEqual(lastCompleted({}, []), null);
  
  // No completed runs
  const runsByTaskId = {
    'task1': [
      { id: 1, status: 'running', created_at: '2023-01-01T00:00:00Z' }
    ]
  };
  const tasks = [{ id: 'task1', title: 'Task 1' }];
  assert.strictEqual(lastCompleted(runsByTaskId, tasks), null);
  
  // Single completed run
  const runsByTaskId2 = {
    'task1': [
      { id: 1, status: 'needs_review', created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-02T00:00:00Z' }
    ]
  };
  const tasks2 = [{ id: 'task1', title: 'Task 1' }];
  assert.deepStrictEqual(lastCompleted(runsByTaskId2, tasks2), {
    task: tasks2[0],
    run: runsByTaskId2.task1[0]
  });
  
  // Multiple tasks with completed runs
  const runsByTaskId3 = {
    'task1': [
      { id: 1, status: 'failed', created_at: '2023-01-01T00:00:00Z' },
      { id: 2, status: 'needs_review', created_at: '2023-01-02T00:00:00Z', updated_at: '2023-01-03T00:00:00Z' }
    ],
    'task2': [
      { id: 3, status: 'approved', created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-04T00:00:00Z' }
    ]
  };
  const tasks3 = [
    { id: 'task1', title: 'Task 1' },
    { id: 'task2', title: 'Task 2' }
  ];
  assert.deepStrictEqual(lastCompleted(runsByTaskId3, tasks3), {
    task: tasks3[1], // Task 2 has more recent completed run
    run: runsByTaskId3.task2[0]
  });
}

// Test anyRunning function

function testAnyRunning() {
  // No runs
  assert.strictEqual(anyRunning({}), false);
  
  // No running tasks
  const runsByTaskId = {
    'task1': [
      { id: 1, status: 'needs_review', created_at: '2023-01-01T00:00:00Z' }
    ]
  };
  assert.strictEqual(anyRunning(runsByTaskId), false);
  
  // One running task
  const runsByTaskId2 = {
    'task1': [
      { id: 1, status: 'running', created_at: '2023-01-01T00:00:00Z' }
    ]
  };
  assert.strictEqual(anyRunning(runsByTaskId2), true);
  
  // Multiple tasks with one running
  const runsByTaskId3 = {
    'task1': [
      { id: 1, status: 'approved', created_at: '2023-01-01T00:00:00Z' }
    ],
    'task2': [
      { id: 2, status: 'running', created_at: '2023-01-02T00:00:00Z' }
    ]
  };
  assert.strictEqual(anyRunning(runsByTaskId3), true);
}

// Test runLabel function

function testRunLabel() {
  // No run
  assert.strictEqual(runLabel(undefined), '—');
  
  // Needs review
  assert.strictEqual(runLabel({ status: 'needs_review' }), 'Report ready');
  
  // Approved
  assert.strictEqual(runLabel({ status: 'approved' }), 'Approved');
  
  // Rejected
  assert.strictEqual(runLabel({ status: 'rejected' }), 'Rejected');
  
  // Failed
  assert.strictEqual(runLabel({ status: 'failed' }), 'Failed');
  
  // Running
  assert.strictEqual(runLabel({ status: 'running' }), 'Running');
  
  // Unknown status
  assert.strictEqual(runLabel({ status: 'unknown' }), '—');
}

// Run all tests

await test('scoutRunSummary functions', async (t) => {
  await t.test('latestRun', testLatestRun);
  await t.test('lastCompleted', testLastCompleted);
  await t.test('anyRunning', testAnyRunning);
  await t.test('runLabel', testRunLabel);
});

test('the helpers accept a single latest run per task, as the table keeps it', () => {
  const byTask = {
    a: { id: 1, status: 'running', created_at: '2026-01-01T00:00:00Z' },
    b: { id: 2, status: 'needs_review', created_at: '2026-01-02T00:00:00Z', updated_at: '2026-01-02T01:00:00Z' },
  };
  assert.equal(anyRunning(byTask), true);
  assert.deepEqual(lastCompleted(byTask, [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }]), { task: { id: 'b', title: 'B' }, run: byTask.b });
  assert.deepEqual(latestRun(byTask.a), byTask.a);
});
