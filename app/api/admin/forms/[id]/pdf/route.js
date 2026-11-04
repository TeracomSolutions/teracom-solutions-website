import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { BACKEND_API_URL } from '@/lib/config';

const ID = /^[0-9a-f-]{36}$/;

// The signed copy of a form, passed through from the backend.
export const GET = withAdminSession(async ({ token, params }) => {
  if (!ID.test(params.id)) return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });
  const url = `${BACKEND_API_URL.replace(/[/]$/, '')}/staff/forms/submissions/${params.id}/pdf`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!response.ok) return NextResponse.json({ error: 'That signed copy could not be opened.' }, { status: response.status || 502 });
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': response.headers.get('content-disposition') || 'inline; filename="form.pdf"',
      'Cache-Control': 'no-store',
    },
  });
});
