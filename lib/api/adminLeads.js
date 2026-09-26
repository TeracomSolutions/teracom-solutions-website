// Server-only. Enquiries from the public contact form, stored by the website
// backend (api/staff_leads.py); staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminLeads.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchLeads(token) {
  return backendFetch('/staff/leads', { token });
}

export async function markLeadContacted(token, leadId) {
  return backendFetch(`/staff/leads/${encodeURIComponent(leadId)}/contacted`, { method: 'POST', token });
}
