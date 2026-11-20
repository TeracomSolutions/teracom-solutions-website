import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { BACKEND_API_URL } from '@/lib/config';

const ROOT = /^[a-z0-9-]{1,40}$/;
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
  const headers = {
    'Cache-Control': 'private, no-store',
    ...safeHeaders(response.headers.get('content-type'), response.headers.get('content-disposition')),
  };
  const length = response.headers.get('content-length');
  if (length) headers['Content-Length'] = length;
  return new NextResponse(response.body, { status: 200, headers });
});
