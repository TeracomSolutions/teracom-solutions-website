// Server-only. The AI providers Scout researches with. The website backend
// stores each key encrypted and only ever returns its last four
// characters (api/staff_ai_connections.py); a key entered here goes
// straight through and is never read back.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminAiConnections.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function listAiConnections(token) {
  return backendFetch('/staff/ai-connections', { token });
}

export async function fetchAiProviders(token) {
  return backendFetch('/staff/ai-connections/providers', { token });
}

// `body` may carry api_key, default_model, base_url, enabled -- each optional,
// only the ones present change.
export async function upsertAiConnection(token, provider, body) {
  return backendFetch(`/staff/ai-connections/${encodeURIComponent(provider)}`, {
    method: 'PUT',
    token,
    body,
  });
}

export async function deleteAiConnection(token, provider) {
  return backendFetch(`/staff/ai-connections/${encodeURIComponent(provider)}`, {
    method: 'DELETE',
    token,
  });
}
