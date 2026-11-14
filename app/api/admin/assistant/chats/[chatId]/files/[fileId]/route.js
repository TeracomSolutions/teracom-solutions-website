import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { BACKEND_API_URL } from '@/lib/config';

const ID = /^[0-9a-f-]{36}$/;

// A file attached in an Assistant chat, kept by the backend (services/assistant_history.py), downloaded as sent.
export const GET = withAdminSession(async ({ token, params }) => {
  if (!ID.test(params.chatId) || !ID.test(params.fileId)) return NextResponse.json({ error: 'Unknown file.' }, { status: 404 });
  const url = `${BACKEND_API_URL.replace(/[/]$/, '')}/staff/assistant/chats/${params.chatId}/files/${params.fileId}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!response.ok) return NextResponse.json({ error: 'That file could not be opened.' }, { status: response.status || 502 });
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': response.headers.get('content-disposition') || 'attachment; filename="file"',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  });
});
