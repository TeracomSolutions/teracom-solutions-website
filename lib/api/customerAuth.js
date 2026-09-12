// Server-only. Customer authentication API wrappers, following the same pattern
// as lib/api/leads.js -- thin wrappers over backendFetch (not a new HTTP client).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/customerAuth.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function customerSignup(email, password) {
  return backendFetch('/auth/customer/signup', { method: 'POST', body: { email, password } });
}

export async function customerLogin(email, password) {
  return backendFetch('/auth/customer/login', { method: 'POST', body: { email, password } });
}

export async function getCurrentCustomer(token) {
  return backendFetch('/auth/customer/me', { token });
}