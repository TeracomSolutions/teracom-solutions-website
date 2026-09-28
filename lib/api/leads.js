// Server-only. Every enquiry (contact form, service and password-reset
// requests, account applications) reaches the backend through here, carrying
// the website's service token: the backend refuses a lead without it, so a
// bot cannot skip this site's human checks by posting to the backend
// directly. The visitor's address goes with it for the backend's rate limit.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/leads.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function submitLead(payload, clientIp) {
  const headers = { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' };
  if (clientIp) headers['X-Client-IP'] = clientIp;
  return backendFetch('/leads/', { method: 'POST', body: payload, headers });
}
