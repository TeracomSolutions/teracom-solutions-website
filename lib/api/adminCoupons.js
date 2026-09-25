// Server-only. Coupon administration against the website backend.
//
// The backend owns the codes and the rules. This is the staff route into the
// same /internal/coupons API that Teracom AI will use later, so building the
// admin page does not create a second way of doing the same thing.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminCoupons.js must only be used on the server.');
}

import { backendFetch } from './client.js';

function serviceHeaders() {
  return { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' };
}

export async function listCoupons() {
  return backendFetch('/internal/coupons', { headers: serviceHeaders() });
}

export async function createCoupon(payload) {
  return backendFetch('/internal/coupons', {
    method: 'POST',
    body: payload,
    headers: serviceHeaders(),
  });
}

export async function updateCoupon(code, payload) {
  return backendFetch(`/internal/coupons/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    body: payload,
    headers: serviceHeaders(),
  });
}
