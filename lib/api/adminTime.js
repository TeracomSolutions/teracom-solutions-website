// Server-only. The console's time zone setting and clock check, api/staff_time.py on the website backend, staff bearer token
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminTime.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const BASE = '/staff/time';

/** @returns {Promise<{ zone, abbreviation, offset, now, default }>} */
export async function fetchTime(token) {
  return backendFetch(BASE, { token });
}

/** The chosen zone, or '' when it cannot be read (the formatter then keeps Melbourne). */
export async function zoneFor(token) {
  try {
    return (await fetchTime(token)).zone || '';
  } catch {
    return '';
  }
}

export async function fetchZones(token) {
  return backendFetch(`${BASE}/zones`, { token });
}

export async function saveZone(token, zone) {
  return backendFetch(BASE, { method: 'PUT', token, body: { zone } });
}

export async function runClockCheck(token) {
  return backendFetch(`${BASE}/clock-check`, { method: 'POST', token });
}
