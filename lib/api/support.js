// Server-only. Ask Tera -- api/support.py on the website backend: the chat
// with the signed-in customer's token, and the console's Support page with
// the staff token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/support.js must only be used on the server.');
}

import { backendFetch } from './client.js';

// kind is 'customer' (the website session) or 'staff' (the console session).
export async function askTera(token, body, kind = 'customer') {
  const path = kind === 'staff' ? '/staff/support/chat' : '/support/chat';
  return backendFetch(path, { method: 'POST', token, body });
}

export async function sendTeraFeedback(token, messageId, value, kind = 'customer') {
  const prefix = kind === 'staff' ? '/staff/support' : '/support';
  return backendFetch(`${prefix}/messages/${encodeURIComponent(messageId)}/feedback`, {
    method: 'POST',
    token,
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