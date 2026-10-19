import { backendFetch } from './client.js';

export async function fetchScenarios(token) {
  return await backendFetch('/staff/test-tools/scenarios', {
    token,
    method: 'GET',
  });
}

export async function fetchTestRecords(token) {
  return await backendFetch('/staff/test-tools/records', {
    token,
    method: 'GET',
  });
}

export async function simulateOrder(token, scenario) {
  return await backendFetch('/staff/test-tools/simulate', {
    token,
    method: 'POST',
    body: { scenario },
  });
}

export async function cleanupTestRecords(token, local) {
  return await backendFetch('/staff/test-tools/cleanup', {
    token,
    method: 'POST',
    body: { local: Boolean(local) },
  });
}
