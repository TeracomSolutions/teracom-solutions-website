// Server-only. Customer price tiers (per cent markup on cost) and
// per-supplier markups -- api/pricing.py on the website backend, staff
// bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminPricing.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchTiers(token) {
  return backendFetch('/staff/pricing/tiers', { token });
}

export async function updateTier(token, tierKey, body) {
  return backendFetch(`/staff/pricing/tiers/${encodeURIComponent(tierKey)}`, { method: 'PUT', token, body });
}

// Every supplier with its last import, product count and tier overrides.
export async function fetchSupplierPricing(token) {
  return backendFetch('/staff/pricing/suppliers', { token });
}

export async function setSupplierOverride(token, supplierId, tierKey, markupPercent) {
  return backendFetch(`/staff/pricing/suppliers/${encodeURIComponent(supplierId)}/tiers/${encodeURIComponent(tierKey)}`, {
    method: 'PUT',
    token,
    body: { markup_percent: markupPercent },
  });
}

export async function clearSupplierOverride(token, supplierId, tierKey) {
  return backendFetch(`/staff/pricing/suppliers/${encodeURIComponent(supplierId)}/tiers/${encodeURIComponent(tierKey)}`, {
    method: 'DELETE',
    token,
  });
}