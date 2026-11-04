import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { BACKEND_API_URL } from '@/lib/config';

const ID = /^[0-9a-f-]{36}$/;

// A file attached to a form, passed through from the backend as a download (never shown
// inline, so a customer's file cannot run as a page on this site).
export const GET = withAdminSession(async ({ token, params }) => {
  if (!ID.test(params.id) || !ID.test(params.fileId)) return NextResponse.json({ error: 'Unknown file.' }, { status: 404 });
  const url = `${BACKEND_API_URL.replace(/[/]$/, '')}/staff/forms/submissions/${params.id}/files/${params.fileId}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!response.ok) return NextResponse.json({ error: 'That file could not be opened.' }, { status: response.status || 502 });
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': response.headers.get('content-disposition') || 'attachment',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  });
});
