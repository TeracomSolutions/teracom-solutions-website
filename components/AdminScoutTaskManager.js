'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import AdminAutoRefreshControl from './AdminAutoRefreshControl';
import { formatDate, formatDateTime, humanise } from '@/lib/adminFormat';
import { latestRun, lastCompleted, anyRunning } from '@/lib/scoutRunSummary';

// One Scout tab: the form to add a task, the standing schedule, what has
// finished, and the live to-do list with Run research. Copied from the
// the previous platform's app/(admin)/scout/ScoutTaskManager.js; the fetches
// now go to this app's own /api/admin routes.

function RunStatus({ run }) {
  if (!run) return '—';

  const label = humanise(run.status);
  const className = `admin-status is-${run.status}`;

  if (run.status === 'needs_review') {
    return <Link href={`/admin/scout/review/${run.id}`} className={className}>Report ready → Review</Link>;
  } else if (run.status === 'running') {
    return <span className={className}>Running since {formatDateTime(run.created_at)}</span>;
  } else if (run.status === 'failed') {
    return (
      <span className={className} title={run.error_message}>
        Failed
        <br />
        <small className="admin-muted">{run.error_message}</small>
      </span>
    );
  } else if (run.status === 'approved' || run.status === 'rejected') {
    return <Link href={`/admin/scout/review/${run.id}`} className={className}>{label}</Link>;
  }
  return <span className={className}>{label}</span>;
}

export default function AdminScoutTaskManager({ section }) {
  const titlePlaceholder = section === 'operating_systems'
    ? 'e.g. Enhance Technical Support OS'
    : 'Task title';
  const targetPlaceholder = section === 'operating_systems'
    ? 'e.g. Gallagher Command Centre support docs, Inner Range Integriti knowledge base, common alarm/access-control troubleshooting and escalation procedures'
    : 'Target (optional)';

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [recurrence, setRecurrence] = useState('once');
  const [activeTasks, setActiveTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [historyTasks, setHistoryTasks] = useState([]);
  const [latestRunsByTaskId, setLatestRunsByTaskId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [activeRes, recurringRes, historyRes] = await Promise.all([
        fetch(`/api/admin/scout-tasks?view=active&section=${section}`),
        fetch(`/api/admin/scout-tasks?view=recurring&section=${section}`),
        fetch(`/api/admin/scout-tasks?view=history&section=${section}`),
      ]);
      if (!activeRes.ok || !recurringRes.ok || !historyRes.ok) {
        setError('Unable to load the tasks. Your session may have expired -- sign in again.');
      } else {
        setError('');
      }
      const activeTasksData = activeRes.ok ? await activeRes.json() : [];
      const recurringTasksData = recurringRes.ok ? await recurringRes.json() : [];
      const historyTasksData = historyRes.ok ? await historyRes.json() : [];
      setActiveTasks(activeTasksData);
      setRecurringTasks(recurringTasksData);
      setHistoryTasks(historyTasksData);

      // Combine all tasks to fetch runs for all of them
      const allTasks = [...activeTasksData, ...recurringTasksData, ...historyTasksData];

      if (allTasks.length > 0) {
        // Create a set of unique task IDs to avoid duplicate requests
        const taskIds = [...new Set(allTasks.map(task => task.id))];

        // Fetch runs for all tasks
        const runsResponses = await Promise.all(
          taskIds.map((taskId) => fetch(`/api/admin/scout-tasks/${taskId}/runs`))
        );
        const runsData = await Promise.all(runsResponses.map((res) => (res.ok ? res.json() : [])));

        const latestRuns = {};
        taskIds.forEach((taskId, index) => {
          if (runsData[index] && runsData[index].length > 0) {
            latestRuns[taskId] = latestRun(runsData[index]);
          }
        });
        setLatestRunsByTaskId(latestRuns);
      } else {
        setLatestRunsByTaskId({});
      }
    } catch {
      setError('Unable to load the tasks.');
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Poll for running tasks
  useEffect(() => {
    if (anyRunning(latestRunsByTaskId)) {
      const interval = setInterval(() => {
        loadTasks();
      }, 20000); // 20 seconds

      return () => clearInterval(interval);
    }
  }, [latestRunsByTaskId, loadTasks]);

  async function postAction(url, options = {}) {
    const response = await fetch(url, { method: 'POST', ...options });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || data.detail || 'The request failed.');
    }
    return response;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await postAction('/api/admin/scout-tasks', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, title, target, recurrence }),
      });
      setTitle('');
      setTarget('');
      setRecurrence('once');
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = async (taskId) => {
    setBusyId(taskId);
    setError('');
    try {
      await postAction(`/api/admin/scout-tasks/${taskId}/complete`);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Cancel this task? It will be removed entirely.')) return;
    setBusyId(taskId);
    setError('');
    try {
      const response = await fetch(`/api/admin/scout-tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Unable to cancel the task.');
      }
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleRun = async (taskId) => {
    if (!window.confirm('Run research for this task now? It uses the configured AI providers, can take several minutes, and the result goes to the Review Queue tab.')) return;
    setBusyId(taskId);
    setError('');
    try {
      await postAction(`/api/admin/scout-tasks/${taskId}/run`);
      await loadTasks();
      setNotice('Research started. This takes a few minutes; the row updates when it finishes.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading && activeTasks.length === 0 && recurringTasks.length === 0 && historyTasks.length === 0) {
    return <p className="admin-muted">Loading tasks…</p>;
  }

  const completed = lastCompleted(latestRunsByTaskId, [...activeTasks, ...recurringTasks, ...historyTasks]);

  return (
    <div>
      <AdminAutoRefreshControl onRefresh={loadTasks} storageKey={`scout-refresh-${section}`} />

      <p className="admin-card">
        {completed ? (
          <>
            Last completed: <strong>{completed.task.title}</strong> on {formatDateTime(completed.run.updated_at || completed.run.created_at)}
            {' · '}
            <Link href={`/admin/scout/review/${completed.run.id}`} className="admin-link">Open the report</Link>
          </>
        ) : (
          'No research has completed yet. Run research on an active task and its report appears in the Review Queue.'
        )}
      </p>

      {error && <p className="form-error" role="alert">{error}</p>}

      <h2>Add new task</h2>
      {notice && <p className="admin-card">{notice}</p>}
      <form onSubmit={handleSubmit} className="admin-form admin-card">
        <label>
          Task title
          <input
            type="text"
            placeholder={titlePlaceholder}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Target
          <input
            type="text"
            placeholder={targetPlaceholder}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          />
        </label>
        <label>
          Recurrence
          <select value={recurrence} onChange={(event) => setRecurrence(event.target.value)}>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary btn-sm">Create Task</button>
        </div>
      </form>

      <h2>Recurring tasks</h2>
      {recurringTasks.length === 0 ? (
        <p className="admin-muted">No recurring tasks.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Target</th>
                <th>Recurrence</th>
                <th>Status</th>
                <th>Last run</th>
                <th>Latest run</th>
              </tr>
            </thead>
            <tbody>
              {recurringTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td className="wrap">{task.target || '—'}</td>
                  <td>{humanise(task.recurrence)}</td>
                  <td>{humanise(task.status)}</td>
                  <td>{formatDate(task.last_run_at, 'Never')}</td>
                  <td><RunStatus run={latestRunsByTaskId[task.id]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>History</h2>
      {historyTasks.length === 0 ? (
        <p className="admin-muted">No history.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Target</th>
                <th>Recurrence</th>
                <th>Status</th>
                <th>Last run</th>
                <th>Latest run</th>
              </tr>
            </thead>
            <tbody>
              {historyTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td className="wrap">{task.target || '—'}</td>
                  <td>{humanise(task.recurrence)}</td>
                  <td>{humanise(task.status)}</td>
                  <td>{formatDate(task.last_run_at, 'Never')}</td>
                  <td><RunStatus run={latestRunsByTaskId[task.id]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Active tasks</h2>
      {activeTasks.length === 0 ? (
        <p className="admin-muted">No active tasks.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Target</th>
                <th>Status</th>
                <th>Latest run</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td className="wrap">{task.target || '—'}</td>
                  <td>{humanise(task.status)}</td>
                  <td><RunStatus run={latestRunsByTaskId[task.id]} /></td>
                  <td>{formatDate(task.created_at)}</td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleComplete(task.id)} disabled={busyId === task.id}>
                        Mark complete
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDelete(task.id)} disabled={busyId === task.id}>
                        Cancel
                      </button>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => handleRun(task.id)} disabled={busyId === task.id}>
                        Run research
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
