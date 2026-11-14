import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// The Backups page's addresses (api/staff_backups.py in the backend); nothing else passes through.
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const PATHS = {
  GET: new RegExp(`^(|${UUID})$`),
  POST: /^run$/,
  PUT: /^settings$/,
};

function handler(method) {
  return withAdminSession(async ({ req, token, params }) => {
    const path = (params.path || []).join('/');
    if (!PATHS[method].test(path)) return NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });
    let body;
    if (method !== 'GET') {
      try { body = await req.json(); } catch { body = undefined; }
    }
    const data = await backendFetch(`/staff/backups${path ? `/${path}` : ''}`, { method, token, body });
    return NextResponse.json(data);
  }, { fallback: 'The backups did not answer in time. Try again.' });
}

export const maxDuration = 60;
export const GET = handler('GET');
export const POST = handler('POST');
export const PUT = handler('PUT');
