// Server-only. Teracom's suppliers and the price-list files each one
// sends. The routes live on the website backend (api/data_feeds.py and
// api/data_feed_rules.py), staff bearer token. Store opens straight on the
// suppliers (Data Feeds); the business functions remain for old routes.
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

// Every supplier, for the Data Feeds page.
export async function fetchAllSuppliers(token) {
  return backendFetch('/data-feeds/suppliers', { token });
}

export async function fetchSupplier(token, supplierId) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}`, { token });
}

// Adds a supplier without naming a business: the backend files it under
// the one business this console looks after.
export async function createSupplierDirect(token, { name, supplierType }) {
  return backendFetch('/data-feeds/suppliers', {
    method: 'POST',
    token,
    body: { name, supplier_type: supplierType },
  });
}

// The brands this supplier's imports keep to; an empty list clears the rule.
export async function setSupplierBrandRule(token, supplierId, brands) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}/brand-rule`, {
    method: 'PUT',
    token,
    body: { brands },
  });
}

// The brands in one uploaded file, with product counts, for the brand picker.
export async function fetchUploadBrands(token, uploadId) {
  return backendFetch(`/data-feeds/uploads/${encodeURIComponent(uploadId)}/brands`, { token });
}

// Imports an uploaded file taking only the chosen brands (or the saved
// rule when brands is null); saveRule keeps the choice for later imports.
export async function importUploadWithBrands(token, uploadId, { brands, saveRule }) {
  return backendFetch(`/data-feeds/uploads/${encodeURIComponent(uploadId)}/import-selected`, {
    method: 'POST',
    token,
    body: { brands, save_rule: saveRule },
  });
}

// Takes the supplier's uploads with it.
// The supplier's own categories, each with its product count and the store
// category its products are listed under, plus the store categories to
// choose from.
export async function fetchSupplierCategories(token, supplierId) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}/categories`, { token });
}

// Files one supplier category under a store category (null: not listed).
export async function setSupplierCategory(token, supplierId, { sourceCategory, storeCategory }) {
  return backendFetch(`/data-feeds/suppliers/${encodeURIComponent(supplierId)}/categories`, {
    method: 'PUT',
    token,
    body: { source_category: sourceCategory, store_category: storeCategory },
  });
}

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

// Parses the uploaded price list on the server and upserts it into the
// store catalogue, linked to the supplier. Re-running updates in place.
export async function importUploadIntoStore(token, uploadId) {
  return backendFetch(`/data-feeds/uploads/${encodeURIComponent(uploadId)}/import`, { method: 'POST', token });
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