// Server-only API for the Advertising page (api/staff_advertising.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAdvertising.js must only be used on the server.');
}
import { backendFetch } from './client.js';

export async function advertisingCall(token, method, path, { searchParams, body } = {}) {
  return backendFetch('/staff/advertising' + (path ? '/' + path : ''), { token, method, searchParams, body });
}

export async function fetchAdvertising(token) {
  return advertisingCall(token, 'GET', '');
}
