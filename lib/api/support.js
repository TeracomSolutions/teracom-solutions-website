// Server-only. Ask Tera -- api/support.py on the website backend: the chat
// with the signed-in customer's token, and the console's Support page with
// the staff token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/support.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function askTera(customerToken, body) {
  return backendFetch('/support/chat', { method: 'POST', token: customerToken, body });
}

export async function sendTeraFeedback(customerToken, messageId, value) {
  return backendFetch(`/support/messages/${encodeURIComponent(messageId)}/feedback`, {
    method: 'POST',
    token: customerToken,
    body: { value },
  });
}

export async function getSupportOverview(token) {
  return backendFetch('/staff/support', { token });
}

export async function getSupportConversation(token, conversationId) {
  return backendFetch(`/staff/support/conversations/${encodeURIComponent(conversationId)}`, { token });
}

export async function rebuildSupportLibrary(token) {
  return backendFetch('/staff/support/library/rebuild', { method: 'POST', token });
}

export async function saveSupportSettings(token, body) {
  return backendFetch('/staff/support/settings', { method: 'PUT', token, body });
}