// Server-only API for the Build progress page (api/build_progress.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminBuildProgress.js must only be used on the server.');
}
import { backendFetch } from './client.js';

export async function fetchBuildProgress(token) {
  return backendFetch('/staff/build-progress', { token });
}

// Moves one item in the coding order: up, down, top, bottom (within its group) or first (overall).
export async function moveBuildItem(token, itemId, to) {
  return backendFetch('/staff/build-progress/move', { method: 'POST', token, body: { item_id: itemId, to } });
}
