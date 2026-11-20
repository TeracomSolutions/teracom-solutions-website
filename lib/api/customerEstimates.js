// Server-only. The signed-in customer's own estimates on the backend (/customer/estimates),
// for the Estimator. Thin wrappers over backendFetch, like lib/api/customerAuth.js.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/customerEstimates.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const enc = encodeURIComponent;

export const listEstimates = (token) => backendFetch('/customer/estimates', { token });
export const createEstimate = (token, data) => backendFetch('/customer/estimates', { method: 'POST', token, body: { data } });
export const getEstimate = (token, id) => backendFetch(`/customer/estimates/${enc(id)}`, { token });
export const updateEstimate = (token, id, data) => backendFetch(`/customer/estimates/${enc(id)}`, { method: 'PUT', token, body: { data } });
export const deleteEstimate = (token, id) => backendFetch(`/customer/estimates/${enc(id)}`, { method: 'DELETE', token });
