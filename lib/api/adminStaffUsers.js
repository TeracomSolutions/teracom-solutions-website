// Server-only. Staff user management for the console.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminStaffUsers.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function listStaffUsers(token) {
  return backendFetch('/staff/users', { token });
}

export async function createStaffUser(token, body) {
  return backendFetch('/staff/users', { method: 'POST', token, body });
}

export async function updateStaffUser(token, id, body) {
  return backendFetch(`/staff/users/${encodeURIComponent(id)}`, { method: 'PATCH', token, body });
}

export async function resetStaffPassword(token, id) {
  return backendFetch(`/staff/users/${encodeURIComponent(id)}/reset-password`, { method: 'POST', token });
}

export async function resetStaffTwoFactor(token, id) {
  return backendFetch(`/staff/users/${encodeURIComponent(id)}/reset-two-factor`, { method: 'POST', token });
}

export async function deleteStaffUser(token, id) {
  return backendFetch(`/staff/users/${encodeURIComponent(id)}`, { method: 'DELETE', token });
}
