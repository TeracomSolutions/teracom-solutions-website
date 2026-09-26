// Server-only. Teracom's businesses, their suppliers and the price-list
// files each supplier sends. The routes live on the website backend
// (api/data_feeds.py), staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminSuppliers.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchManagedBusinesses(token) {
  return backendFetch('/data-feeds/businesses', { token });
}

export async function createManagedBusiness(token, { name, websiteUrl }) {
  return backendFetch('/data-feeds/businesses', {
    method: 'POST',
    token,
    body: { name, website_url: websiteUrl },
  });
}

// Takes the business's suppliers and their uploads with it.
export async function deleteManagedBusiness(token, businessId) {
  return backendFetch(`/data-feeds/businesses/${encodeURIComponent(businessId)}`, { method: 'DELETE', token });
}

export async function fetchSuppliersForBusiness(token, businessId) {
  return backendFetch(`/data-feeds/businesses/${encodeURIComponent(businessId)}/suppliers`, { token });
}

export async function createSupplier(token, businessId, { name, supplierType }) {
  return backendFetch(`/data-feeds/businesses/${encodeURIComponent(businessId)}/suppliers`, {
    method: 'POST',
    token,
    body: { name, supplier_type: supplierType },
  });
}

// Takes the supplier's uploads with it.
export async function deleteSupplier(token, supplierId) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}`, { method: 'DELETE', token });
}

export async function fetchSupplierUploads(token, supplierId) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}/uploads`, { token });
}

// `formData` carries the file under the field name "file", which is what
// the backend's UploadFile parameter is called.
export async function uploadSupplierFeed(token, supplierId, formData) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}/uploads`, {
    method: 'POST',
    token,
    body: formData,
  });
}

// The backend has list endpoints only, no single-item ones, so a detail
// page finds its heading by looking the id up in the list.
export async function findBusinessName(token, businessId) {
  try {
    const businesses = await fetchManagedBusinesses(token);
    return businesses.find((b) => b.id === businessId)?.name || null;
  } catch {
    return null;
  }
}

export async function findSupplierName(token, businessId, supplierId) {
  try {
    const suppliers = await fetchSuppliersForBusiness(token, businessId);
    return suppliers.find((s) => s.id === supplierId)?.name || null;
  } catch {
    return null;
  }
}
