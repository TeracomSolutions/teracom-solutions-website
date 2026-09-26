// Server-only. Website Intelligence -- Teracom's businesses, their
// suppliers and uploaded price lists, and the enquiries the contact form
// brings in. Copied from the Global Platform's lib/api/dataFeeds.js and
// lib/api/leads.js; the routes now live on the website backend
// (api/data_feeds.py, api/staff_leads.py), same paths, staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminWebsiteIntelligence.js must only be used on the server.');
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

export async function fetchLeads(token) {
  return backendFetch('/staff/leads', { token });
}

export async function markLeadContacted(token, leadId) {
  return backendFetch(`/staff/leads/${encodeURIComponent(leadId)}/contacted`, { method: 'POST', token });
}
