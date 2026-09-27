// Server-only. The public side of Resources: the documents the store shows
// on a product page, and the documents staff published to the Resources
// sections of the website. No token -- these are public manufacturer
// documents served from our own copy.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/resources.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const TTL_MS = 5 * 60 * 1000;
const EMPTY = Object.freeze({ section: '', brands: [], total: 0, documents: [] });
// One cached listing per section; the page filters by brand and search on
// the client, so the backend is asked at most once every five minutes.
const listings = new Map();

export async function fetchProductResources(sku) {
  return backendFetch('/resources/for-product', { searchParams: { sku } });
}

export async function fetchPublishedResources(section) {
  const now = Date.now();
  const cached = listings.get(section);
  if (cached && now - cached.at < TTL_MS) return cached.listing;
  try {
    const listing = await backendFetch('/resources/published', { searchParams: { section, limit: 500 } });
    const clean = { ...EMPTY, ...listing, section, documents: Array.isArray(listing?.documents) ? listing.documents : [], brands: Array.isArray(listing?.brands) ? listing.brands : [] };
    listings.set(section, { at: now, listing: clean });
    return clean;
  } catch {
    // Keep the last good listing when the backend cannot be reached.
    return cached ? cached.listing : { ...EMPTY, section };
  }
}

export async function fetchPublishedSummary() {
  try {
    return await backendFetch('/resources/published/summary');
  } catch {
    return {};
  }
}
