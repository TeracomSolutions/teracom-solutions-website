import { NextResponse } from 'next/server';

import { backendFetch } from '@/lib/api/client';
import { clientIpFromRequest } from '@/lib/rateLimit';

// Public: the button on /stop-emails. The token in the link is the proof; the backend refuses anything else.
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const e = typeof body.e === 'string' ? body.e.slice(0, 255) : '';
  const t = typeof body.t === 'string' ? body.t.slice(0, 128) : '';
  if (!e || !t) return NextResponse.json({ error: 'That link is not valid.' }, { status: 400 });
  try {
    const ip = clientIpFromRequest(req);
    await backendFetch('/public/outreach/stop', { method: 'POST', body: { e, t }, headers: ip ? { 'X-Client-IP': ip } : {} });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'That link is not valid.' }, { status: err.status === 400 ? 400 : 502 });
  }
}
