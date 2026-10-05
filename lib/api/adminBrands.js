// Server-only. The store's brands for the console's Brands page, from the
// website backend (api/store_brands.py), with the staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminBrands.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function listStoreBrands(token) {
  return backendFetch('/staff/store-brands', { token });
}

export async function updateStoreBrand(token, slug, body) {
  return backendFetch(`/staff/store-brands/${encodeURIComponent(slug)}`, { method: 'PUT', token, body });
}

export async function uploadBrandLogo(token, slug, file) {
  const form = new FormData();
  form.append('file', file, file.name || 'logo');
  return backendFetch(`/staff/store-brands/${encodeURIComponent(slug)}/logo`, { method: 'POST', token, body: form });
}

export async function removeBrandLogo(token, slug) {
  return backendFetch(`/staff/store-brands/${encodeURIComponent(slug)}/logo`, { method: 'DELETE', token });
}

// Looks for the logo on the brand's own website; can take half a minute.
export async function findBrandLogo(token, slug) {
  return backendFetch(`/staff/store-brands/${encodeURIComponent(slug)}/find-logo`, { method: 'POST', token });
}

export async function findAllBrandLogos(token) {
  return backendFetch('/staff/store-brands/find-logos', { method: 'POST', token });
}