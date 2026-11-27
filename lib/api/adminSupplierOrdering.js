/*
 * Server-only API helpers for supplier ordering details
 */

// Header guard - do not run in browser
if (typeof window !== 'undefined') {
  throw new Error('This module must only be used server-side');
}

import { backendFetch } from './client.js';

export async function fetchSupplierOrdering(token, supplierId) {
  const path = `/staff/suppliers/${encodeURIComponent(supplierId)}/ordering`;
  return await backendFetch(path, { token, method: 'GET' });
}

// Vendors in Zoho Books matching a name, for the Find in Zoho box on Ordering details.
export async function searchZohoVendors(token, q) {
  return await backendFetch('/staff/suppliers/ordering/zoho-vendors', { token, method: 'GET', searchParams: { q } });
}

export async function saveSupplierOrdering(token, supplierId, values) {
  const path = `/staff/suppliers/${encodeURIComponent(supplierId)}/ordering`;
  return await backendFetch(path, { token, method: 'PUT', body: values });
}