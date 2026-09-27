// Server-only. Fetches the storefront catalogue from the backend.
//
// This is used by lib/catalogue.js to get the latest catalogue data.

if (typeof window !== 'undefined') {
  throw new Error('lib/api/storefront.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchStorefrontCatalogue() {
  return backendFetch('/internal/store-catalog/storefront', {
    headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' }
  });
}