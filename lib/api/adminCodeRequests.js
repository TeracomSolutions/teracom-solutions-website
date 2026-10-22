// Server-only API for front-end change requests (api/code_requests.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminCodeRequests.js must only be used on the server.');
}
import { backendFetch } from './client.js';

export async function fetchCodeRequests(token) {
  return backendFetch('/staff/code-requests', { token });
}

export async function createCodeRequest(token, body) {
  return backendFetch('/staff/code-requests', { method: 'POST', token, body });
}

export async function cancelCodeRequest(token, id) {
  return backendFetch(`/staff/code-requests/${encodeURIComponent(id)}/cancel`, { method: 'POST', token });
}
