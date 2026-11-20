import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// System > Business profile, Server clock: the NTP servers the clock check asks (backend api/staff_time.py).
export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  const servers = Array.isArray(body?.servers) ? body.servers.filter((s) => typeof s === 'string').slice(0, 10) : null;
  if (!servers) return NextResponse.json({ error: 'The servers were not understood.' }, { status: 400 });
  return NextResponse.json(await backendFetch('/staff/time/ntp', { method: 'PUT', token, body: { servers } }));
}, { verify: true });
