// Server-only. The website growth tools (Scout, Growth tools tab): each tool's
// switch, settings, last report and Run now (api/staff_growth.py on the backend).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminGrowth.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchGrowth(token) {
  return backendFetch('/staff/growth', { token });
}

export async function updateGrowthTool(token, key, body) {
  return backendFetch(`/staff/growth/${encodeURIComponent(key)}`, { method: 'PUT', token, body });
}

export async function runGrowthTool(token, key) {
  return backendFetch(`/staff/growth/${encodeURIComponent(key)}/run`, { method: 'POST', token });
}

// Any other growth call: pages and issues, drafts, photos, sending.
export async function growthCall(token, method, path, { body } = {}) {
  // Security review 2026-11-20: no ".." or encoded slashes, so a path cannot reach other /staff endpoints.
  if (/(^|\/)\.\.?(\/|$)|%2e|%2f|%5c|\\/i.test(String(path))) {
    throw new Error('Unknown growth path');
  }
  return backendFetch(`/staff/growth/${path}`, { method, token, body });
}
