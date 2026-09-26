// Server-only. Posts one page view to the website backend's beacon
// (POST /analytics/pageview) with the shared service token. The visitor
// hash is made here, on the server, so the backend never sees an address.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/track.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function recordPageView(view) {
  return backendFetch('/analytics/pageview', {
    method: 'POST',
    body: view,
    headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
  });
}
