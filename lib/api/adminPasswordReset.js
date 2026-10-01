// Server-only. The staff "Forgot your password?" flow -- api/staff_password_reset.py
// on the website backend. Nobody is signed in yet, so the shared service
// token goes with each call; it is also what lets the backend believe the
// client address we forward.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminPasswordReset.js must only be used on the server.');
}

import { backendFetch } from './client.js';

function serviceHeaders(clientIp) {
  const headers = { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' };
  if (clientIp && clientIp !== 'unknown') headers['X-Client-IP'] = clientIp;
  return headers;
}

export async function requestStaffPasswordLink(email, clientIp) {
  return backendFetch('/staff/password/forgot', { method: 'POST', body: { email }, headers: serviceHeaders(clientIp) });
}

export async function chooseStaffPassword(token, newPassword, clientIp) {
  return backendFetch('/staff/password/reset', {
    method: 'POST',
    body: { token, new_password: newPassword },
    headers: serviceHeaders(clientIp),
  });
}