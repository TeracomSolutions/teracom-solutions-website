// Server-only. Forms customers fill in and sign (lib/onlineForms): sending one to the
// backend with the website's service token, and the console's Forms page (staff token).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/forms.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export const FORM_EDITS_TAG = 'form-edits';

/** Staff changes to the forms, for the public pages and the server check (cached a minute). */
export async function publicFormEdits() {
  try {
    const data = await backendFetch('/internal/forms/edits', {
      revalidate: 60,
      tags: [FORM_EDITS_TAG],
      headers: { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' },
    });
    return data?.forms || {};
  } catch {
    // The forms still work as built if the backend cannot be reached.
    return {};
  }
}

export async function fetchFormEdits(token) {
  return backendFetch('/staff/forms/edits', { token });
}

export async function saveFormEdits(token, key, edits) {
  return backendFetch(`/staff/forms/edits/${encodeURIComponent(key)}`, { method: 'PUT', token, body: { edits } });
}

export async function resetFormEdits(token, key) {
  return backendFetch(`/staff/forms/edits/${encodeURIComponent(key)}`, { method: 'DELETE', token });
}

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
