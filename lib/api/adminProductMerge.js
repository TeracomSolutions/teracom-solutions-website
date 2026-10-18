// Server-only module that talks to the merge routes of the website backend
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminProductMerge.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchMergeCandidates(token) {
  return backendFetch('/staff/store/merges/candidates', { token });
}

export async function previewMerge(token, body) {
  return backendFetch('/staff/store/merges/preview', { token, method: 'POST', body });
}

export async function applyMerge(token, body) {
  return backendFetch('/staff/store/merges/apply', { token, method: 'POST', body });
}

export async function fetchMergeHistory(token) {
  return backendFetch('/staff/store/merges/history', { token });
}