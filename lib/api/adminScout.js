// Server-only. Scout -- research tasks and the runs they produce. Copied
// from the the previous platform's lib/api/scoutTasks.js and scoutResearch.js;
// the routes now live on the website backend (api/staff_scout_tasks.py,
// api/staff_scout_research.py), same paths, staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminScout.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchActiveScoutTasks(token, section) {
  return backendFetch('/staff/scout-tasks/active', { token, searchParams: { section } });
}

export async function fetchRecurringScoutTasks(token, section) {
  return backendFetch('/staff/scout-tasks/recurring', { token, searchParams: { section } });
}

export async function fetchScoutTaskHistory(token, section) {
  return backendFetch('/staff/scout-tasks/history', { token, searchParams: { section } });
}

export async function createScoutTask(token, payload) {
  return backendFetch('/staff/scout-tasks', { method: 'POST', token, body: payload });
}

export async function completeScoutTask(token, taskId) {
  return backendFetch(`/staff/scout-tasks/${encodeURIComponent(taskId)}/complete`, { method: 'POST', token });
}

export async function deleteScoutTask(token, taskId) {
  return backendFetch(`/staff/scout-tasks/${encodeURIComponent(taskId)}`, { method: 'DELETE', token });
}

export async function runScoutTask(token, taskId) {
  return backendFetch(`/staff/scout-tasks/${encodeURIComponent(taskId)}/run`, { method: 'POST', token });
}

export async function fetchTaskRuns(token, taskId) {
  return backendFetch(`/staff/scout-tasks/${encodeURIComponent(taskId)}/runs`, { token });
}

export async function fetchNeedsReview(token) {
  return backendFetch('/staff/scout-research/needs-review', { token });
}

export async function fetchResearchRun(token, runId) {
  return backendFetch(`/staff/scout-research/${encodeURIComponent(runId)}`, { token });
}

export async function approveResearchRun(token, runId, notes) {
  return backendFetch(`/staff/scout-research/${encodeURIComponent(runId)}/approve`, {
    method: 'POST',
    token,
    body: { notes: notes || null },
  });
}

export async function rejectResearchRun(token, runId, notes) {
  return backendFetch(`/staff/scout-research/${encodeURIComponent(runId)}/reject`, {
    method: 'POST',
    token,
    body: { notes: notes || null },
  });
}
