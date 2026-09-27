// Server-only. The public side of Social: the profile links the footer shows
// (kept for five minutes so the footer does not call the backend on every
// page) and the unsubscribe call behind the link in every marketing email.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/social.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const TTL_MS = 5 * 60 * 1000;
let cached = { at: 0, links: null };

export async function fetchSocialLinks() {
  const now = Date.now();
  if (cached.links && now - cached.at < TTL_MS) return cached.links;
  try {
    const links = await backendFetch('/social/links');
    cached = { at: now, links: Array.isArray(links) ? links : [] };
  } catch {
    // Keep the last good list; the footer falls back to its built-in links
    // when there has never been one.
    if (!cached.links) return [];
  }
  return cached.links;
}

export async function unsubscribeCustomer(customerId, token) {
  return backendFetch('/social/unsubscribe', { method: 'POST', body: { customer_id: customerId, token } });
}
