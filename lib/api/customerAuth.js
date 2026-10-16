// Server-only. Customer authentication API wrappers, following the same pattern
// as lib/api/leads.js -- thin wrappers over backendFetch (not a new HTTP client).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/customerAuth.js must only be used on the server.');
}

import { backendFetch } from './client.js';

// The backend answers these routes only for the website: the shared service
// token proves it, and X-Client-IP tells the backend which visitor this is so
// its limits are per visitor.
function serviceHeaders(clientIp) {
  const headers = { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' };
  if (clientIp && clientIp !== 'unknown') headers['X-Client-IP'] = clientIp;
  return headers;
}

export async function getSignupCaptcha(clientIp) { return backendFetch('/auth/customer/captcha', { headers: serviceHeaders(clientIp) }); }

export async function customerSignup(payload, clientIp) {
  return backendFetch('/auth/customer/signup', { method: 'POST', body: payload, headers: serviceHeaders(clientIp) });
}

export async function customerLogin(email, password, clientIp) {
  return backendFetch('/auth/customer/login', { method: 'POST', body: { email, password }, headers: serviceHeaders(clientIp) });
}

export async function getCurrentCustomer(token) {
  return backendFetch('/auth/customer/me', { token });
}

// Always resolves the same way for a known and an unknown address -- the
// backend deliberately returns one neutral response for both, so there is
// nothing here to branch on.
export async function requestPasswordReset(email, clientIp) {
  return backendFetch('/auth/customer/request-password-reset', { method: 'POST', body: { email }, headers: serviceHeaders(clientIp) });
}

export async function resetPassword(token, password, clientIp) {
  return backendFetch('/auth/customer/reset-password', { method: 'POST', body: { token, password }, headers: serviceHeaders(clientIp) });
}
