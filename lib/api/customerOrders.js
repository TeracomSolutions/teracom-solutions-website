// The signed-in customer's own orders (backend GET /customer/orders). Server-only.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/customerOrders.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchMyOrders(token) {
  return backendFetch('/customer/orders', { token });
}
