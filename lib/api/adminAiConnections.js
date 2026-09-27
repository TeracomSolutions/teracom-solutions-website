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

export async function fetchAiRouting(token) {
  return backendFetch('/staff/ai-connections/routing', { token });
}

export async function setAiOrder(token, providers) {
  return backendFetch('/staff/ai-connections/order', {
    method: 'PUT',
    token,
    body: { providers },
  });
}

export async function checkAiProvider(token, provider) {
  return backendFetch(`/staff/ai-connections/${encodeURIComponent(provider)}/check`, {
    method: 'POST',
    token,
  });
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

// Governance: the rules every AI call follows (api/staff_ai_connections.py,
// /governance routes). The test call returns what a provider would receive
// and is never stored.
export async function fetchGovernanceRules(token) {
  return backendFetch('/staff/ai-connections/governance', { token });
}

export async function createGovernanceRule(token, body) {
  return backendFetch('/staff/ai-connections/governance', { method: 'POST', token, body });
}

export async function updateGovernanceRule(token, id, body) {
  return backendFetch(`/staff/ai-connections/governance/${encodeURIComponent(id)}`, { method: 'PUT', token, body });
}

export async function deleteGovernanceRule(token, id) {
  return backendFetch(`/staff/ai-connections/governance/${encodeURIComponent(id)}`, { method: 'DELETE', token });
}

export async function reorderGovernanceRules(token, ids) {
  return backendFetch('/staff/ai-connections/governance/order', { method: 'PUT', token, body: { ids } });
}

export async function testGovernanceFilter(token, body) {
  return backendFetch('/staff/ai-connections/governance/test', { method: 'POST', token, body });
}
