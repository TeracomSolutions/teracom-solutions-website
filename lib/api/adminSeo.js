// Server-only. The Search page's calls to the website backend: the old
// addresses Google still shows, where each goes, and the yes or no staff give
// (api/staff_seo.py), with the staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminSeo.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const BASE = '/staff/seo';

// Whether Google is connected, the counts, and the last search.
export async function seoOverview(token) {
  return backendFetch(`${BASE}/overview`, { token });
}

export async function listRedirects(token, status = 'proposed', skip = 0) {
  return backendFetch(`${BASE}/redirects`, { token, searchParams: { status, skip, limit: 200 } });
}

// Say yes (approve) or no (reject) to these redirects.
export async function decideRedirects(token, ids, action) {
  return backendFetch(`${BASE}/redirects/decide`, { method: 'POST', token, body: { ids, action } });
}

// Send an old address to a page of staff's choosing, and turn it on.
export async function changeRedirect(token, id, toPath) {
  return backendFetch(`${BASE}/redirects/${encodeURIComponent(id)}`, { method: 'PATCH', token, body: { to_path: toPath } });
}

// Ask Google again which pages it shows (Search now).
export async function startSync(token) {
  return backendFetch(`${BASE}/sync`, { method: 'POST', token });
}