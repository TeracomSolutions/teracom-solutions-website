// Server-only API for the admin Marketplace page.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminMarketplace.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function marketplaceCall(token, method, path, { searchParams, body } = {}) {
  return backendFetch('/staff/marketplace/' + path, { token, method, searchParams, body });
}

export async function fetchMarketplaceStatus(token) {
  return marketplaceCall(token, 'GET', 'status');
}
