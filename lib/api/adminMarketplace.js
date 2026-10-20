// Server-only API for the admin Marketplace page.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminMarketplace.js must only be used on the server.');
}

import { backendFetch } from './client.js';
import { listConnections } from './adminConnections.js';

export async function marketplaceCall(token, method, path, { searchParams, body } = {}) {
  return backendFetch('/staff/marketplace/' + path, { token, method, searchParams, body });
}

export async function fetchMarketplaceStatus(token) {
  return marketplaceCall(token, 'GET', 'status');
}

export async function fetchMarketplaceSuppliers(token) {
  return marketplaceCall(token, 'GET', 'suppliers');
}

export async function fetchMarketplaceConnections(token) {
  const list = await listConnections(token);
  return list.filter((item) => item.key === 'marketplace' || String(item.key).startsWith('mp_'));
}
