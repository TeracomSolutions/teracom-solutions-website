// Server-only. Ask Tera -- api/support.py on the website backend: the chat
// with the signed-in customer's token, and the console's Support page with
// the staff token.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/support.js must only be used on the server.');
}

import { BACKEND_API_URL } from '../config.js';
import { ApiError, backendFetch } from './client.js';

// kind is 'customer' (the website session) or 'staff' (the console session).
export async function askTera(token, body, kind = 'customer') {
  const path = kind === 'staff' ? '/staff/support/chat' : '/support/chat';
  return backendFetch(path, { method: 'POST', token, body });
}

// The chat as server-sent events: the backend's Response, for
// /api/tera/stream to pass straight on so Tera's words appear as written.
export async function streamTera(token, body, kind = 'customer') {
  const path = kind === 'staff' ? '/staff/support/chat/stream' : '/support/chat/stream';
  let response;
  try {
    response = await fetch(`${BACKEND_API_URL}${path}`, {
      method: 'POST',
      headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch (cause) {
    throw new ApiError('Unable to reach the Teracom AI backend.', 0, { cause: String(cause) });
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const detail = data && (data.detail || data.error);
    throw new ApiError(typeof detail === 'string' ? detail : 'Request failed', response.status, { body: data });
  }
  return response;
}

// Send a question to the team, or ask for a callback, from the chat window.
export async function teraHandover(token, body, kind = 'customer') {
  const path = kind === 'staff' ? '/staff/support/handover' : '/support/handover';
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

// Study now: Tera looks up the next batch of products on manufacturers' websites.
export async function startSupportStudy(token) {
  return backendFetch('/staff/support/study', { method: 'POST', token });
}

export async function saveSupportSettings(token, body) {
  return backendFetch('/staff/support/settings', { method: 'PUT', token, body });
}

// Teach Tera: facts staff write, and answers kept from conversations.
export async function addSupportFact(token, body) {
  return backendFetch('/staff/support/facts', { method: 'POST', token, body });
}

export async function updateSupportFact(token, factId, body) {
  return backendFetch(`/staff/support/facts/${encodeURIComponent(factId)}`, { method: 'PUT', token, body });
}

export async function deleteSupportFact(token, factId) {
  return backendFetch(`/staff/support/facts/${encodeURIComponent(factId)}`, { method: 'DELETE', token });
}

export async function keepSupportAnswer(token, messageId) {
  return backendFetch(`/staff/support/messages/${encodeURIComponent(messageId)}/keep`, { method: 'POST', token });
}