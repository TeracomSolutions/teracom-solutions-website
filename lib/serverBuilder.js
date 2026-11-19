// Server-only. The servers the server builder offers, with their options from the maker's QuickSpecs (backend
// services/server_builder.py). Read at most once an hour.
if (typeof window !== 'undefined') {
  throw new Error('lib/serverBuilder.js must only be used on the server.');
}

import { backendFetch } from './api/client.js';

export const SERVER_BUILDER_TAG = 'server-builder';

export async function getServerModels() {
  try {
    const data = await backendFetch('/server-builder', { revalidate: 3600, tags: [SERVER_BUILDER_TAG] });
    return Array.isArray(data?.models) ? data.models : [];
  } catch {
    return [];
  }
}
