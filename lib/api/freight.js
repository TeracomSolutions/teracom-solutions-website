// Server-only. Delivery prices for a cart, from the website backend
// (services/freight_service.py), which holds the rates and carrier keys.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/freight.js must only be used on the server.');
}

import { backendFetch } from './client.js';
import { freightItems } from '../freightParcels.js';

/**
 * The delivery choices for these cart lines to this postcode, cheapest
 * first: { postcode, chargeable_kg, options: [{ key, label, cents, note }], errors }.
 */
export async function quoteFreight({ lines, postcode }) {
  return backendFetch('/internal/freight/quote', {
    method: 'POST',
    body: { postcode, items: freightItems(lines) },
    headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
  });
}