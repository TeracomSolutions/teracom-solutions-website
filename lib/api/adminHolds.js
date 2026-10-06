// Server-only. Price list rows held back because their recommended price is
// below cost, from the website backend (api/staff_import_holds.py), with the
// staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminHolds.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function listHolds(token, status = 'pending') {
  return backendFetch('/staff/store-catalog/holds', { token, searchParams: { status, limit: 500 } });
}

export async function resolveHolds(token, ids, action) {
  return backendFetch('/staff/store-catalog/holds/resolve', { method: 'POST', token, body: { ids, action } });
}

// How many are waiting, decided or cleared, for the count in the Store tabs.
export async function holdCounts(token) {
  return backendFetch('/staff/store-catalog/holds/count', { token });
}