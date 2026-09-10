// Server-only. Teracom Solutions Website Admin, Phase 1 -- the one
// caller of teracom-solutions-website-backend's new staff auth/store
// catalog proxy routes (api/staff_store_catalog.py in that repo,
// itself forwarding on to teracom-platform-backend's real staff-
// authenticated API). Deliberately its own module, not folded into
// lib/api/leads.js or lib/api/commerceLicensing.js: this is the only
// caller in this codebase that carries a real *staff* bearer token
// rather than a service secret or no credential at all -- see
// lib/api/client.js's own `token` option.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminCatalog.js must only be used on the server.');
}

import { backendFetch } from './client.js';

/**
 * Returns the raw backend response -- either
 * { access_token, refresh_token } on success, or
 * { mfa_required: true, mfa_challenge_token } if the staff account has
 * MFA enabled. The MFA-verify follow-up step
 * (teracom-platform-backend's POST /staff/mfa/login-verify) is not
 * wired up anywhere in this admin UI yet -- out of scope for this
 * Phase 1 pass, see app/admin/login/page.js's own handling of this
 * case.
 */
export async function staffLogin(email, password) {
  return backendFetch('/staff/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function listCatalogProducts(token, { skip = 0, limit = 100 } = {}) {
  return backendFetch('/staff/store-catalog/products', {
    method: 'GET',
    token,
    searchParams: { skip, limit },
  });
}

export async function importCatalogFeed(token, rows) {
  return backendFetch('/staff/store-catalog/import', {
    method: 'POST',
    token,
    body: rows,
  });
}
