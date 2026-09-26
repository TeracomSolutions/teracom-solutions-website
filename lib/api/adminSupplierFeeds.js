// Server-only. Automatic supplier feeds (a URL or API pulled on a schedule)
// -- api/supplier_feeds.py on the website backend, staff bearer token. The
// authentication value only ever travels in; the backend never returns it.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminSupplierFeeds.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchSupplierFeeds(token, supplierId) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}/feeds`, { token });
}

export async function createSupplierFeed(token, supplierId, body) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}/feeds`, { method: 'POST', token, body });
}

export async function updateSupplierFeed(token, feedId, body) {
  return backendFetch(`/data-feeds/feeds/${encodeURIComponent(feedId)}`, { method: 'PATCH', token, body });
}

export async function deleteSupplierFeed(token, feedId) {
  return backendFetch(`/data-feeds/feeds/${encodeURIComponent(feedId)}`, { method: 'DELETE', token });
}

// Starts a pull in the background; the feed row comes back straight away.
export async function fetchSupplierFeedNow(token, feedId) {
  return backendFetch(`/data-feeds/feeds/${encodeURIComponent(feedId)}/fetch`, { method: 'POST', token });
}
