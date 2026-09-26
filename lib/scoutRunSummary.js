// Summaries of Scout research runs for the task tables. A value in
// runsByTaskId may be one run (the latest) or the full list; both work.
function asList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function latestRun(runs) {
  runs = asList(runs);
  if (runs.length === 0) return undefined;
  return runs.reduce((latest, run) => {
    return !latest || new Date(run.created_at) > new Date(latest.created_at) ? run : latest;
  });
}

export function lastCompleted(runsByTaskId, tasks) {
  if (!runsByTaskId || !tasks) return null;

  let latestRun = null;
  let latestTask = null;

  for (const task of tasks) {
    const runs = [...asList(runsByTaskId[task.id])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (runs.length === 0) continue;

    // Find the most recent run with status that indicates completion
    const completedRun = runs.find(run =>
      run.status === 'needs_review' ||
      run.status === 'approved' ||
      run.status === 'rejected'
    );

    if (completedRun && (!latestRun || new Date(completedRun.updated_at || completedRun.created_at) > new Date(latestRun.updated_at || latestRun.created_at))) {
      latestRun = completedRun;
      latestTask = task;
    }
  }

  return latestRun && latestTask ? { task: latestTask, run: latestRun } : null;
}

export function anyRunning(runsByTaskId) {
  if (!runsByTaskId) return false;

  for (const taskId in runsByTaskId) {
    const latest = latestRun(runsByTaskId[taskId]);
    if (latest && latest.status === 'running') {
      return true;
    }
  }

  return false;
}

export function runLabel(run) {
  if (!run) return '—';

  switch (run.status) {
    case 'needs_review':
      return 'Report ready';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'failed':
      return 'Failed';
    case 'running':
      return 'Running';
    default:
      return '—';
  }
}
