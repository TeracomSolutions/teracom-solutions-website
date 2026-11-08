// Server-only. The Memory page: what the Assistant and Ask Tera keep and how quickly they answer, api/staff_memory.py on the website backend, staff bearer token

import { backendFetch } from './client.js';

const BASE = '/staff/memory-overview';
export async function fetchMemoryOverview(token) {
  return backendFetch(BASE, { token });
}