import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { advertisingCall } from '@/lib/api/adminAdvertising';

// Only the backend's Advertising addresses pass through (api/staff_advertising.py).
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const PATHS = {
  GET: /^(results|products)$/,
  POST: new RegExp('^(campaigns|bring-in|refresh|test/[a-z_]{2,30}|campaigns/' + UUID + '/(write|send|live|pause|end|budget|results))$'),
  PUT: new RegExp('^(rules|campaigns/' + UUID + ')$'),
  DELETE: new RegExp('^campaigns/' + UUID + '$'),
};

function handler(method) {
  return withAdminSession(async ({ req, token, params }) => {
    const path = (params.path || []).join('/');
    if (!PATHS[method].test(path)) return NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });
    const searchParams = {};
    new URL(req.url).searchParams.forEach((value, key) => { searchParams[key] = value; });
    let body;
    if (method === 'POST' || method === 'PUT') {
      try { body = await req.json(); } catch { body = undefined; }
    }
    return NextResponse.json(await advertisingCall(token, method, path, { searchParams, body }));
  });
}

export const GET = handler('GET');
export const POST = handler('POST');
export const PUT = handler('PUT');
export const DELETE = handler('DELETE');
