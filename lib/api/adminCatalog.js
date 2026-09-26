// Server-only. Staff sign-in and the store catalogue, both served by the
// website backend (api/staff_auth.py, api/staff_store_catalog.py). This is
// the only module that carries a real staff bearer token rather than a
// service secret -- see lib/api/client.js's own `token` option.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminCatalog.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function staffLogin(email, password) {
  return backendFetch('/staff/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function listCatalogProducts(token, { skip = 0, limit = 100, supplierId, q, includeInactive = true } = {}) {
  return backendFetch('/staff/store-catalog/products', {
    method: 'GET',
    token,
    searchParams: { skip, limit, supplier_id: supplierId, q, include_inactive: includeInactive ? 'true' : 'false' },
  });
}

export async function importCatalogFeed(token, rows) {
  return backendFetch('/staff/store-catalog/import', {
    method: 'POST',
    token,
    body: rows,
  });
}

// A one-off product entered by hand. Dollars: price inc GST, cost ex GST.
export async function createProduct(token, body) {
  return backendFetch('/staff/store-catalog/products', { method: 'POST', token, body });
}

// Any subset of the editable columns.
export async function updateProduct(token, productId, body) {
  return backendFetch(`/staff/store-catalog/products/${encodeURIComponent(productId)}`, { method: 'PATCH', token, body });
}

// Soft delete: the product disappears from the store but keeps its history.
export async function deactivateProduct(token, productId) {
  return backendFetch(`/staff/store-catalog/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    token,
  });
}

// RRP from cost by markup; preview first.
export async function repriceProducts(token, body) {
  return backendFetch('/staff/store-catalog/reprice', { method: 'POST', token, body });
}

// Every product at RRP and at every active tier.
export async function fetchPriceList(token, { supplierId, q, includeInactive = false } = {}) {
  return backendFetch('/staff/store-catalog/price-list', {
    token,
    searchParams: { supplier_id: supplierId, q, include_inactive: includeInactive ? 'true' : undefined },
  });
}
