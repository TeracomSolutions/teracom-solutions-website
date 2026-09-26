// Server-only. The public side of Resources: the documents the store shows
// on a product page. No token -- these are public manufacturer documents
// served from our own copy.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/resources.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchProductResources(sku) {
  return backendFetch('/resources/for-product', { searchParams: { sku } });
}
