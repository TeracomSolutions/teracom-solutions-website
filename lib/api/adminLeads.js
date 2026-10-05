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

// Tera's draft reply to an enquiry: draft again, discard, or send.
export async function redraftLead(token, leadId) {
  return backendFetch(`/staff/leads/${encodeURIComponent(leadId)}/draft`, { method: 'POST', token });
}

export async function discardLeadDraft(token, leadId) {
  return backendFetch(`/staff/leads/${encodeURIComponent(leadId)}/draft`, { method: 'DELETE', token });
}

export async function sendLeadReply(token, leadId, text) {
  return backendFetch(`/staff/leads/${encodeURIComponent(leadId)}/reply`, { method: 'POST', token, body: { text } });
}
