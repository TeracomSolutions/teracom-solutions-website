import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { BACKEND_API_URL } from '@/lib/config';

const ID = /^[0-9a-f-]{36}$/;
// Security review 2026-11-20: only pictures (not SVG) and PDFs open in the page; anything else, which could run
// script on the console's own address, is downloaded, and the sandbox stops it running even if opened.
const INLINE = /^(image\/(png|jpe?g|gif|webp|avif|bmp)|application\/pdf)\b/i;
function safeHeaders(type, disposition) {
  const inline = INLINE.test(type || '');
  return {
    'Content-Type': inline ? type : 'application/octet-stream',
    'Content-Disposition': inline ? (disposition || 'inline') : (disposition || '').replace(/^inline/i, 'attachment') || 'attachment',
    'Content-Security-Policy': "sandbox; default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'",
    'X-Content-Type-Options': 'nosniff',
  };
}

// A file attached in an Assistant chat, kept by the backend (services/assistant_history.py), downloaded as sent.
export const GET = withAdminSession(async ({ token, params }) => {
  if (!ID.test(params.chatId) || !ID.test(params.fileId)) return NextResponse.json({ error: 'Unknown file.' }, { status: 404 });
  const url = `${BACKEND_API_URL.replace(/[/]$/, '')}/staff/assistant/chats/${params.chatId}/files/${params.fileId}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!response.ok) return NextResponse.json({ error: 'That file could not be opened.' }, { status: response.status || 502 });
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      ...safeHeaders(response.headers.get('content-type'), response.headers.get('content-disposition') || 'attachment; filename="file"'),
      'Cache-Control': 'no-store',
    },
  });
});
