import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// The lead finder's addresses (api/staff_leadgen.py in the backend); nothing else passes through.
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const PATHS = {
  GET: new RegExp(`^(|prospects|prospects/${UUID}|messages|suppressions)$`),
  POST: new RegExp(`^(searches|searches/${UUID}/run|prospects/${UUID}/(draft|contacts)|messages/${UUID}/(approve|discard|replied)|suppressions)$`),
  PUT: new RegExp(`^(searches/${UUID}|messages/${UUID}|settings)$`),
  PATCH: new RegExp(`^prospects/${UUID}$`),
  DELETE: new RegExp(`^searches/${UUID}$`),
};

function handler(method) {
  return withAdminSession(async ({ req, token, params }) => {
    const path = (params.path || []).join('/');
    if (!PATHS[method].test(path)) return NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });
    const searchParams = {};
    new URL(req.url).searchParams.forEach((value, key) => { searchParams[key] = value; });
    let body;
    if (method !== 'GET' && method !== 'DELETE') {
      try { body = await req.json(); } catch { body = undefined; }
    }
    const data = await backendFetch(`/staff/leads/finder${path ? `/${path}` : ''}`, { method, token, searchParams, body });
    return NextResponse.json(data);
  }, { fallback: 'The lead finder did not answer in time. Try again.' });
}

export const maxDuration = 60;
export const GET = handler('GET');
export const POST = handler('POST');
export const PUT = handler('PUT');
export const PATCH = handler('PATCH');
export const DELETE = handler('DELETE');
