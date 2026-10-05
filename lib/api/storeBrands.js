// Server-only. The store's brands from the backend (api/store_brands.py),
// with the service token; lib/storeBrands.js merges and caches them.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/storeBrands.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchStoreBrands() {
  return backendFetch('/internal/store-brands', {
    headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
  });
}