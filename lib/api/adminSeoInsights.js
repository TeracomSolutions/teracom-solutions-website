// Server-only. The Search page's Overview, Opportunities, Titles and Indexing
// tabs call the website backend here (api/staff_seo_insights.py and
// api/staff_seo_indexing.py), with the staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminSeoInsights.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const BASE = '/staff/seo';

// The weekly trend, the totals against the 28 days before, and the opportunity counts.
export async function fetchPerformance(token) {
  return backendFetch(`${BASE}/performance`, { token });
}

// Pull Google's figures again.
export async function refreshPerformance(token) {
  return backendFetch(`${BASE}/performance/refresh`, { method: 'POST', token });
}

export async function fetchOpportunities(token, kind = 'striking', skip = 0) {
  return backendFetch(`${BASE}/opportunities`, { token, searchParams: { kind, skip, limit: 50 } });
}

export async function fetchTitles(token, status = 'proposed', skip = 0) {
  return backendFetch(`${BASE}/titles`, { token, searchParams: { status, skip, limit: 100 } });
}

// Ask the AI for a better title and description for one page.
export async function suggestTitle(token, path) {
  return backendFetch(`${BASE}/titles/suggest`, { method: 'POST', token, body: { path } });
}

export async function decideTitles(token, ids, action) {
  return backendFetch(`${BASE}/titles/decide`, { method: 'POST', token, body: { ids, action } });
}

// Staff words for a page, used at once.
export async function editTitle(token, id, title, description) {
  return backendFetch(`${BASE}/titles/${encodeURIComponent(id)}`, { method: 'PATCH', token, body: { title, description } });
}

export async function fetchIndexingSummary(token) {
  return backendFetch(`${BASE}/indexing/summary`, { token });
}

export async function fetchIndexingPages(token, params = {}) {
  const searchParams = { skip: params.skip || 0, limit: 100 };
  for (const key of ['group', 'kind', 'q']) {
    if (params[key]) searchParams[key] = params[key];
  }
  return backendFetch(`${BASE}/indexing/pages`, { token, searchParams });
}

// Start today's checks with Google.
export async function checkIndexingNow(token) {
  return backendFetch(`${BASE}/indexing/check`, { method: 'POST', token });
}

// Send the product pages among these to Photos & text.
export async function queuePagesForContent(token, pageIds) {
  return backendFetch(`${BASE}/indexing/queue-content`, { method: 'POST', token, body: { page_ids: pageIds } });
}

export async function fetchSitemaps(token) {
  return backendFetch(`${BASE}/indexing/sitemaps`, { token });
}

// Tell Google about the sitemap again.
export async function submitSitemap(token) {
  return backendFetch(`${BASE}/indexing/sitemaps/submit`, { method: 'POST', token });
}

// The Health tab: the weekly check of the website's own pages.
export async function fetchHealthSummary(token) {
  return backendFetch(`${BASE}/health/summary`, { token });
}

export async function fetchHealthPages(token, params = {}) {
  const searchParams = { skip: params.skip || 0, limit: 100 };
  for (const key of ['code', 'kind', 'q']) {
    if (params[key]) searchParams[key] = params[key];
  }
  return backendFetch(`${BASE}/health/pages`, { token, searchParams });
}

// Start a check of the whole website.
export async function checkHealthNow(token) {
  return backendFetch(`${BASE}/health/check`, { method: 'POST', token });
}
