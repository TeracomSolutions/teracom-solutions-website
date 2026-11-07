// Server-only. The Files page: a read-only explorer over the server's folders, api/staff_files.py on the website backend, staff bearer token
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminFiles.js must only be used on the server.');
}

import { backendFetch } from './client.js';

const BASE = '/staff/files';

export async function fetchFileRoots(token) {
  return backendFetch(`${BASE}/roots`, { token });
}

export async function fetchFileList(token, root, path = '') {
  return backendFetch(`${BASE}/list`, { token, searchParams: { root, path } });
}

export async function fetchFileText(token, root, path) {
  return backendFetch(`${BASE}/text`, { token, searchParams: { root, path } });
}
