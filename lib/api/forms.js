// Server-only. Forms customers fill in and sign (lib/onlineForms): sending one to the
// backend with the website's service token, and the console's Forms page (staff token).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/forms.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function submitForm(payload, clientIp, userAgent) {
  const headers = { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' };
  if (clientIp) headers['X-Client-IP'] = clientIp;
  if (userAgent) headers['X-Client-User-Agent'] = String(userAgent).slice(0, 400);
  return backendFetch('/internal/forms/submissions', { method: 'POST', body: payload, headers });
}

export async function fetchFormSubmissions(token, { formKey, status, q } = {}) {
  const searchParams = {};
  if (formKey) searchParams.form_key = formKey;
  if (status) searchParams.status = status;
  if (q) searchParams.q = q;
  return backendFetch('/staff/forms/submissions', { token, searchParams });
}

export async function fetchFormSubmission(token, id) {
  return backendFetch(`/staff/forms/submissions/${encodeURIComponent(id)}`, { token });
}

export async function updateFormSubmission(token, id, changes) {
  return backendFetch(`/staff/forms/submissions/${encodeURIComponent(id)}`, { method: 'PATCH', token, body: changes });
}

export async function fetchFormDelivery(token) {
  return backendFetch('/staff/forms/delivery', { token });
}

export async function saveFormDelivery(token, routes) {
  return backendFetch('/staff/forms/delivery', { method: 'PUT', token, body: { routes } });
}

export async function resendFormSubmission(token, id, customer) {
  return backendFetch(`/staff/forms/submissions/${encodeURIComponent(id)}/deliver`, { method: 'POST', token, body: { customer } });
}
