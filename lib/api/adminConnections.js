// Server-only. Admin -> Connections -- api/staff_connections.py and
// api/monitor_devices.py on the website backend, staff bearer token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminConnections.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function listConnections(token) {
  return backendFetch('/staff/connections', { token });
}

export async function testConnection(token, key) {
  return backendFetch(`/staff/connections/${encodeURIComponent(key)}/test`, { method: 'POST', token });
}

export async function saveConnection(token, key, values) {
  return backendFetch(`/staff/connections/${encodeURIComponent(key)}`, { method: 'PUT', token, body: { values } });
}

export async function clearConnection(token, key) {
  return backendFetch(`/staff/connections/${encodeURIComponent(key)}`, { method: 'DELETE', token });
}

export async function startZohoConnect(token) {
  return backendFetch('/staff/connections/zoho_books/authorize', { method: 'POST', token });
}

export async function finishZohoConnect(token, code, state) {
  return backendFetch('/staff/connections/zoho_books/exchange', { method: 'POST', token, body: { code, state } });
}

export async function addDevice(token, body) {
  return backendFetch('/staff/connections/devices', { method: 'POST', token, body });
}

export async function updateDevice(token, deviceId, body) {
  return backendFetch(`/staff/connections/devices/${encodeURIComponent(deviceId)}`, { method: 'PUT', token, body });
}

export async function replaceDeviceToken(token, deviceId) {
  return backendFetch(`/staff/connections/devices/${encodeURIComponent(deviceId)}/token`, { method: 'POST', token });
}

export async function removeDevice(token, deviceId) {
  return backendFetch(`/staff/connections/devices/${encodeURIComponent(deviceId)}`, { method: 'DELETE', token });
}