// Server-only. The Teracom AI monthly prices (A$ ex GST, keyed by slug, "base-platform"
// for the base platform fee) from the backend price list: the TAI- rows, which stay
// unpublished so they never reach the store. Cached for an hour and refreshed with the
// store catalogue (the console's Publish prices button revalidates the same tag).

if (typeof window !== 'undefined') {
  throw new Error('lib/api/teracomAiPrices.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchTeracomAiPrices() {
  const data = await backendFetch('/internal/store-catalog/teracom-ai-prices', {
    headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
    revalidate: 3600,
    tags: ['storefront-catalogue'],
  });
  return data && typeof data.prices === 'object' && data.prices !== null ? data.prices : null;
}
