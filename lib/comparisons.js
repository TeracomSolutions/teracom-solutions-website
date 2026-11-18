// Server-only. Product comparisons kept on the console (Resources > Product comparisons; backend
// services/comparisons.py). Read at most once an hour, and straight away after staff save a change.
if (typeof window !== 'undefined') {
  throw new Error('lib/comparisons.js must only be used on the server.');
}

import { backendFetch } from './api/client.js';

export const COMPARISONS_TAG = 'comparisons';

export async function getComparisons() {
  try {
    const data = await backendFetch('/comparisons', { revalidate: 3600, tags: [COMPARISONS_TAG] });
    return Array.isArray(data?.comparisons) ? data.comparisons : [];
  } catch {
    return [];
  }
}

export async function getComparison(slug) {
  try {
    return await backendFetch(`/comparisons/${encodeURIComponent(slug)}`, { revalidate: 3600, tags: [COMPARISONS_TAG] });
  } catch {
    return null;
  }
}
