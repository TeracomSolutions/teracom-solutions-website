// Server-only. Hot specials and clearance on the console's Specials page, served by
// the website backend (api/staff_store_promos.py) with the staff member's own token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminSpecials.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function listSpecials(token) {
  return backendFetch('/staff/store-promos', { method: 'GET', token });
}

export async function setSpecial(token, productId, body) {
  return backendFetch(`/staff/store-promos/${encodeURIComponent(productId)}`, { method: 'PUT', token, body });
}

export async function clearSpecial(token, productId) {
  return backendFetch(`/staff/store-promos/${encodeURIComponent(productId)}`, { method: 'DELETE', token });
}
