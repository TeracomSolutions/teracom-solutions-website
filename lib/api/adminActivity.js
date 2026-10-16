// Server-only. The Activity page: the audit trail and the background job logs, api/staff_activity.py on the website backend, staff bearer token
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminActivity.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const BASE = '/staff/activity';

/**
 * @param {string} token
 * @param {Object} params
 * @param {number} [params.limit]
 * @param {string} [params.before]
 * @param {string} [params.event_type]
 * @param {string} [params.q]
 * @returns {Promise<{ rows, next_before }>}
 */
export async function fetchActivity(token, params = {}) {
  const searchParams = {};
  const validKeys = ['limit', 'before', 'event_type', 'q'];
  for (const key of validKeys) {
    if (params[key] !== undefined && params[key] !== '') {
      searchParams[key] = params[key];
    }
  }
  return backendFetch(BASE, { token, searchParams });
}

/**
 * @param {string} token
 * @returns {Promise<{ types: Array<{ type, label, count }> }>}
 */
export async function fetchActivityTypes(token) {
  return backendFetch(`${BASE}/types`, { token });
}

/**
 * @param {string} token
 * @returns {Promise<{ logs: Array<{ job, files, last_at }> }>}
 */
export async function fetchJobLogs(token) {
  return backendFetch(`${BASE}/logs`, { token });
}

/**
 * @param {string} token
 * @param {string} job
 * @param {number} [lines=200]
 * @returns {Promise<{ job, file, modified, lines }>}
 */
export async function fetchJobLog(token, job, lines = 200) {
  return backendFetch(`${BASE}/logs/${encodeURIComponent(job)}`, { token, searchParams: { lines } });
}