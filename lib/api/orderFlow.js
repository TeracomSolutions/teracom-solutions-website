// Server-only. Forward completed Stripe checkout sessions to the order flow backend.
//
// The switch ORDER_FLOW_FORWARD is checked by the caller.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/orderFlow.js must only be used on the server.');
}

import { backendFetch } from './client.js';
import { buildForwardBody } from '../orderFlowForward.js';

/**
 * Forward a completed Stripe checkout session to the order flow backend.
 *
 * Returns the backend's response, which indicates whether the order was recorded.
 */
export async function forwardCheckoutSession(session, eventId) {
  return backendFetch('/internal/orders/stripe-session', {
    method: 'POST',
    body: buildForwardBody(session, eventId),
    headers: {
      'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '',
    },
  });
}

/**
 * Tell the backend a checkout finished, expired or failed (Sales > Carts). kind: completed | expired | failed.
 */
export async function forwardCheckoutEvent(kind, session, eventId) {
  return backendFetch('/internal/sales/checkout-event', {
    method: 'POST',
    body: { kind, session, event_id: eventId || null },
    headers: {
      'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '',
    },
  });
}
