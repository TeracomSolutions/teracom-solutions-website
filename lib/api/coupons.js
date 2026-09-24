// Server-only. Coupon lookups against the website backend.
//
// The backend owns the codes and the rules; this never decides what a code is
// worth. It passes the cart subtotal it computed from verified prices and
// takes back an amount.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/coupons.js must only be used on the server.');
}

import { backendFetch } from './client.js';

// The backend requires this on both coupon endpoints. It is the same shared
// secret the commerce webhook already uses, and it is what lets the backend
// trust the client IP we forward for rate limiting.
function serviceHeaders(clientIp) {
  const headers = {
    'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '',
  };
  if (clientIp && clientIp !== 'unknown') headers['X-Client-IP'] = clientIp;
  return headers;
}

/**
 * Ask what a code is worth for this cart.
 *
 * Returns the backend's own answer: { valid, code, label, discount_cents } or
 * { valid: false, reason }. A reason is customer-facing text.
 */
export async function validateCoupon({ code, subtotalCents, customerId, clientIp }) {
  return backendFetch('/coupons/validate', {
    method: 'POST',
    body: {
      code,
      subtotal_cents: subtotalCents,
      ...(customerId ? { customer_id: customerId } : {}),
    },
    headers: serviceHeaders(clientIp),
  });
}

/**
 * Record that a code was actually used, once Stripe confirms payment.
 *
 * Keyed on the Stripe session id at the backend, so calling this twice for a
 * redelivered webhook records one redemption.
 */
export async function recordCouponRedemption({ code, stripeSessionId, customerId, discountCents, subtotalCents }) {
  return backendFetch('/internal/coupons/redeem', {
    method: 'POST',
    body: {
      code,
      stripe_session_id: stripeSessionId,
      customer_id: customerId || null,
      discount_cents: discountCents,
      subtotal_cents: subtotalCents,
    },
    headers: serviceHeaders(null),
  });
}
