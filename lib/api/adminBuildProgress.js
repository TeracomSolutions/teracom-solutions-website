// Server-only API for the Build progress page (api/build_progress.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminBuildProgress.js must only be used on the server.');
}
import { backendFetch } from './client.js';

export async function fetchBuildProgress(token) {
  return backendFetch('/staff/build-progress', { token });
}
