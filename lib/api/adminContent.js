// Server-only. Photos and descriptions for products going on the website:
// the queue, what was found on the manufacturer's site, and the ways staff
// settle each product (api/staff_product_content.py on the website backend),
// with the staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminContent.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const BASE = '/staff/store-catalog/content';

// One page of the list: 20 rows by default (Robert, 2026-11-05), up to 100.
export async function listContent(token, status = 'attention', skip = 0, limit = 20) {
  const from = Math.max(0, Math.floor(Number(skip)) || 0);
  const size = Math.min(100, Math.max(1, Math.floor(Number(limit)) || 20));
  return backendFetch(BASE, { token, searchParams: { status, skip: from, limit: size } });
}

// Staff pick another of the pictures the found page offered.
export async function chooseContentImage(token, jobId, imageUrl) {
  return backendFetch(`${BASE}/jobs/${encodeURIComponent(jobId)}/image`, { method: 'POST', token, body: { image_url: imageUrl } });
}

export async function contentCounts(token) {
  return backendFetch(`${BASE}/count`, { token });
}

// Start the search for these products' photos and descriptions.
export async function queueContent(token, productIds) {
  return backendFetch(`${BASE}/queue`, { method: 'POST', token, body: { product_ids: productIds } });
}

// Start the search for every product that has no photo or description.
export async function queueMissingContent(token, liveOnly) {
  return backendFetch(`${BASE}/queue-missing`, { method: 'POST', token, body: { live_only: Boolean(liveOnly) } });
}

export async function resolveContent(token, ids, action) {
  return backendFetch(`${BASE}/resolve`, { method: 'POST', token, body: { ids, action } });
}

// A manufacturer page, a picture address or typed words for one product.
export async function manualContent(token, productId, body) {
  return backendFetch(`${BASE}/products/${encodeURIComponent(productId)}/manual`, { method: 'POST', token, body });
}

export async function uploadContentImage(token, productId, formData) {
  return backendFetch(`${BASE}/products/${encodeURIComponent(productId)}/image`, { method: 'POST', token, body: formData });
}