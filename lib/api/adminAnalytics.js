// Server-only. The visitor summary behind the admin's Website Data page --
// api/analytics.py on the website backend, staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAnalytics.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchAnalyticsSummary(token, days = 30) {
  return backendFetch('/staff/analytics/summary', { token, searchParams: { days } });
}
