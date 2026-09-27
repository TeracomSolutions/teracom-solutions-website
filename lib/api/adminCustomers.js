// Server-only. The Customers tab under Social: every customer account and
// who receives email updates (api/staff_customers.py). Read-only.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminCustomers.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function listCustomers(token, params) {
  return backendFetch('/staff/customers', { token, searchParams: params });
}
