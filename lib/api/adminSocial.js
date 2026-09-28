// Server-only. The Social area of the console: the accounts we post to and
// show in the footer, and the updates sent to the networks and to consenting
// customers. Credentials go through to the backend encrypted and are never
// read back (api/staff_social.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminSocial.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const enc = encodeURIComponent;

export async function listSocialAccounts(token) {
  return backendFetch('/staff/social/accounts', { token });
}

// `body` may carry display_name, profile_url, show_on_site and credentials;
// only the ones present change.
export async function updateSocialAccount(token, network, body) {
  return backendFetch(`/staff/social/accounts/${enc(network)}`, { method: 'PUT', token, body });
}

export async function checkSocialAccount(token, network) {
  return backendFetch(`/staff/social/accounts/${enc(network)}/check`, { method: 'POST', token });
}

export async function clearSocialCredentials(token, network) {
  return backendFetch(`/staff/social/accounts/${enc(network)}/credentials`, { method: 'DELETE', token });
}

export async function listSocialUpdates(token) {
  return backendFetch('/staff/social/updates', { token });
}

export async function createSocialUpdate(token, body) {
  return backendFetch('/staff/social/updates', { method: 'POST', token, body });
}

export async function getSocialUpdate(token, id) {
  return backendFetch(`/staff/social/updates/${enc(id)}`, { token });
}

export async function sendSocialUpdate(token, id) {
  return backendFetch(`/staff/social/updates/${enc(id)}/send`, { method: 'POST', token });
}

export async function cancelSocialUpdate(token, id) {
  return backendFetch(`/staff/social/updates/${enc(id)}/cancel`, { method: 'POST', token });
}

export async function deleteSocialUpdate(token, id) {
  return backendFetch(`/staff/social/updates/${enc(id)}`, { method: 'DELETE', token });
}

export async function mediaTicket(token) {
  return backendFetch('/staff/social/media/ticket', { method: 'POST', token });
}

export async function updateMedia(token, id, body) {
  return backendFetch(`/staff/social/media/${enc(id)}`, { method: 'PATCH', token, body });
}

export async function deleteMedia(token, id) {
  return backendFetch(`/staff/social/media/${enc(id)}`, { method: 'DELETE', token });
}

export async function checkPost(token, body) {
  return backendFetch('/staff/social/check', { method: 'POST', token, body });
}
