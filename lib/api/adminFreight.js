// Server-only. Store -> Freight settings and the console's test quote --
// api/staff_freight.py on the website backend, staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminFreight.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function getFreightSettings(token) {
  return backendFetch('/staff/freight/settings', { token });
}

export async function saveFreightSettings(token, body) {
  return backendFetch('/staff/freight/settings', { method: 'PUT', token, body });
}

export async function tryFreightQuote(token, body) {
  return backendFetch('/staff/freight/quote', { method: 'POST', token, body });
}