import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { BACKEND_API_URL } from '@/lib/config';

const ROOT = /^[a-z0-9-]{1,40}$/;

// A picture shown in the page, or a file downloaded. Only root, path and download are forwarded.
export const GET = withAdminSession(async ({ req, token }) => {
  const incoming = new URL(req.url).searchParams;
  const root = incoming.get('root') || '';
  if (!ROOT.test(root)) return NextResponse.json({ error: 'Unknown folder' }, { status: 400 });
  const forward = new URLSearchParams({ root, path: (incoming.get('path') || '').slice(0, 500) });
  if (incoming.get('download') === '1') forward.set('download', '1');
  const url = BACKEND_API_URL.replace(/[/]$/, '') + '/staff/files/raw?' + forward.toString();
  const response = await fetch(url, { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store' });
  if (!response.ok) {
    return NextResponse.json({ error: 'That file could not be opened.' }, { status: response.status || 502 });
  }
  const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
  for (const name of ['content-type', 'content-disposition', 'content-length', 'content-security-policy']) {
    const value = response.headers.get(name);
    if (value) headers[name] = value;
  }
  return new NextResponse(response.body, { status: 200, headers });
});
