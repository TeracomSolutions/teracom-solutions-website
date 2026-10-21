// Server-only API for the Zoho order flow switches (api/staff_zoho_flow.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminZohoFlow.js must only be used on the server.');
}
import { backendFetch } from './client.js';

export async function fetchZohoFlow(token) {
  return backendFetch('/staff/connections/zoho-flow', { token });
}

export async function saveZohoFlow(token, body) {
  return backendFetch('/staff/connections/zoho-flow', { method: 'PUT', token, body });
}
