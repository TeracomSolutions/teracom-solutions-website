// Server-only. One page of the store catalogue with its tier prices, the
// ids a set of filters matches, and what the filters offer: the website
// backend's api/staff_store_sheet.py, with the staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminSheet.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchSheet(token, searchParams) {
  return backendFetch('/staff/store-catalog/sheet', { token, searchParams });
}

export async function fetchSheetIds(token, searchParams) {
  return backendFetch('/staff/store-catalog/sheet/ids', { token, searchParams });
}

export async function fetchFacets(token) {
  return backendFetch('/staff/store-catalog/facets', { token });
}