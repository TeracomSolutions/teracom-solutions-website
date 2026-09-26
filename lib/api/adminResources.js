// Server-only. Resources: the supplier and manufacturer pages we watch for
// data sheets and manuals, the documents we hold copies of, and the checks
// that found them -- api/staff_resources.py on the website backend.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminResources.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchResourceSources(token) {
  return backendFetch('/staff/resources/sources', { token });
}

export async function createResourceSource(token, body) {
  return backendFetch('/staff/resources/sources', { method: 'POST', token, body });
}

export async function updateResourceSource(token, sourceId, body) {
  return backendFetch(`/staff/resources/sources/${encodeURIComponent(sourceId)}`, { method: 'PATCH', token, body });
}

export async function deleteResourceSource(token, sourceId) {
  return backendFetch(`/staff/resources/sources/${encodeURIComponent(sourceId)}`, { method: 'DELETE', token });
}

// Starts a check in the background; the run row comes back straight away.
export async function checkResourceSource(token, sourceId) {
  return backendFetch(`/staff/resources/sources/${encodeURIComponent(sourceId)}/check`, { method: 'POST', token });
}

// The stored files for one site as a folder tree (site -> kind -> files).
export async function fetchResourceTree(token, sourceId) {
  return backendFetch(`/staff/resources/sources/${encodeURIComponent(sourceId)}/tree`, { token });
}

export async function fetchResourceRuns(token, sourceId) {
  return backendFetch(`/staff/resources/sources/${encodeURIComponent(sourceId)}/runs`, { token });
}

export async function fetchResourceDocuments(token, { sourceId, status, docType, q } = {}) {
  return backendFetch('/staff/resources/documents', {
    token,
    searchParams: { source_id: sourceId, status, doc_type: docType, q },
  });
}

export async function updateResourceDocument(token, documentId, body) {
  return backendFetch(`/staff/resources/documents/${encodeURIComponent(documentId)}`, { method: 'PATCH', token, body });
}

export async function deleteResourceDocument(token, documentId) {
  return backendFetch(`/staff/resources/documents/${encodeURIComponent(documentId)}`, { method: 'DELETE', token });
}
